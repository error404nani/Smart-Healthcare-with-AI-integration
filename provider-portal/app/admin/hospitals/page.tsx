'use client'

import { useEffect, useState } from 'react'
import ProviderLayout from '../../portal-layout'
import { Hospital, MapPin, Phone, Star, Search, Filter } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'

interface HospitalData {
  _id: string
  name: string
  facility_type: string
  address: string
  city: string
  state: string
  phone: string
  type: string
  is_active: boolean
  rating: number
  total_reviews: number
}

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<HospitalData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  useEffect(() => {
    fetchHospitals()
  }, [])

  const fetchHospitals = async () => {
    try {
      const res = await fetch('/api/admin/hospitals')
      if (res.ok) {
        const data = await res.json()
        setHospitals(data)
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredHospitals = hospitals.filter(hospital => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hospital.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || hospital.type === filterType
    return matchesSearch && matchesType
  })

  if (loading) {
    return (
      <ProviderLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Hospital className="w-8 h-8 animate-pulse mx-auto mb-4" />
            <p>Loading hospitals...</p>
          </div>
        </div>
      </ProviderLayout>
    )
  }

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Hospital className="w-8 h-8 text-primary" />
              Hospitals Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and view all registered hospitals in the system
            </p>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="all">All Types</option>
            <option value="government">Government</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital._id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{hospital.name}</CardTitle>
                  <Badge variant={hospital.type === 'government' ? 'secondary' : 'default'}>
                    {hospital.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{hospital.city}, {hospital.state}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {hospital.address}
                </p>
                {hospital.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{hospital.phone}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{hospital.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({hospital.total_reviews} reviews)
                    </span>
                  </div>
                  <Badge variant={hospital.is_active ? 'default' : 'secondary'}>
                    {hospital.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12">
            <Hospital className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No hospitals found</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No hospitals have been added yet.'}
            </p>
          </div>
        )}
      </div>
    </ProviderLayout>
  )
}