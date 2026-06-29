'use client'

import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MapPin, Phone, Clock, Star, Navigation, Search, AlertCircle, Building2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'

// Dynamically import Map to prevent SSR window issues
const MapView = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-muted/20 border rounded-2xl animate-pulse">
      <div className="flex flex-col items-center">
        <MapPin className="w-12 h-12 text-muted-foreground/30 mb-4 animate-bounce" />
        <p className="text-muted-foreground font-semibold">Loading interactive map...</p>
      </div>
    </div>
  )
})

interface Facility {
  id: string
  name: string
  address: string
  phone: string
  specialties: string[]
  hours: string
  rating: number
  distance?: number
  type: 'Clinic' | 'Hospital' | 'Pharmacy'
  lat: number
  lng: number
}

export default function ClinicsPage() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch('/api/facilities')
        if (!res.ok) throw new Error('Failed to fetch facilities')
        const data = await res.json()
        setFacilities(data)
      } catch (error) {
        console.error('Error fetching facilities:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchFacilities()
  }, [])

  const allSpecialties = useMemo(() => {
    return Array.from(new Set(facilities.flatMap((fac) => fac.specialties || [])))
  }, [facilities])

  const filteredFacilities = useMemo(() => {
    return facilities.filter((fac) => {
      const matchesSearch =
        fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fac.address.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesSpecialty = !selectedSpecialty || (fac.specialties && fac.specialties.includes(selectedSpecialty))
      const matchesType = !selectedType || fac.type === selectedType

      return matchesSearch && matchesSpecialty && matchesType
    })
  }, [facilities, searchQuery, selectedSpecialty, selectedType])

  // Filter animations setup
  const layoutTransition = { type: 'spring' as const, stiffness: 300, damping: 24 }

  return (
    <div className="space-y-6 md:space-y-8 relative pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Find Facilities Near You</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">Locate trusted hospitals, clinics, and pharmacies in your area using our interactive map.</p>
        </div>
      </div>

      {/* Smart Search & Filter Full Width */}
      <Card className="p-1 border-0 shadow-xl bg-gradient-to-br from-primary/5 via-background to-background rounded-2xl overflow-hidden ring-1 ring-border/50">
        <div className="bg-background rounded-xl p-5 md:p-7 space-y-6">
          {/* Search Bar */}
          <div className="relative group">
            <div className={`absolute -inset-0.5 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 ${searchQuery ? 'bg-primary opacity-50' : 'bg-primary/50'}`}></div>
            <div className="relative flex items-center bg-background border rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <Search className={`absolute left-4 w-5 h-5 transition-colors ${searchQuery ? 'text-primary' : 'text-muted-foreground'}`} />
              <input
                type="text"
                placeholder="Search facilities by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-transparent text-foreground font-medium placeholder-muted-foreground/70 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 text-xs font-semibold text-muted-foreground hover:text-foreground">
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Types */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Facility Type</p>
              <div className="flex flex-wrap gap-2.5">
                {['All', 'Hospital', 'Clinic', 'Pharmacy'].map(type => {
                  const actualType = type === 'All' ? null : type;
                  const isActive = selectedType === actualType;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedType(actualType)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(10,132,255,0.3)] ring-2 ring-primary/20 scale-105'
                          : 'bg-muted/30 hover:bg-muted text-muted-foreground border-transparent hover:border-border'
                      }`}
                    >
                      {type}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Specialties */}
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Specialties</p>
              <div className="flex flex-wrap gap-2">
                {allSpecialties.map(specialty => {
                  const isActive = selectedSpecialty === specialty;
                  return (
                    <button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(isActive ? null : specialty)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 border ${
                        isActive
                          ? 'bg-primary text-primary-foreground border-primary shadow-md'
                          : 'bg-background hover:bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {specialty}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Search Context */}
          <AnimatePresence>
            {(searchQuery || selectedType || selectedSpecialty) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="pt-2 text-sm text-muted-foreground font-medium flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                Showing results
                {searchQuery && <> for <span className="text-foreground font-bold">"{searchQuery}"</span></>} 
                {selectedType && <> in <span className="text-primary font-bold">{selectedType}</span></>}
                {selectedSpecialty && <> matching <span className="text-primary font-bold">{selectedSpecialty}</span></>}
                <span className="text-xs ml-2 bg-muted px-2 py-0.5 rounded-full">{filteredFacilities.length} items</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>

      <div className="space-y-8 min-h-[600px]">
        {/* Top: Full-Width Map View */}
        <div className="w-full h-[500px]">
          <Card className="h-full overflow-hidden border-2 shadow-lg rounded-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent z-10 pointer-events-none"></div>
            {loading ? (
              <div className="w-full h-full flex items-center justify-center bg-muted/20 border rounded-2xl animate-pulse">
                <div className="flex flex-col items-center">
                  <MapPin className="w-12 h-12 text-muted-foreground/30 mb-4 animate-bounce" />
                  <p className="text-muted-foreground font-semibold">Locating healthcare centers...</p>
                </div>
              </div>
            ) : (
              <MapView facilities={filteredFacilities} />
            )}
          </Card>
        </div>

        {/* Bottom: Facility Directory (Now in a Grid) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-1">
             <h3 className="font-extrabold text-2xl text-foreground tracking-tight flex items-center gap-2">
               <Building2 className="w-6 h-6 text-primary" />
               Facility Directory
               <span className="text-sm font-medium bg-muted px-3 py-1 rounded-full ml-2 text-muted-foreground">
                 {filteredFacilities.length} Results
               </span>
             </h3>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-card border rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredFacilities.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-4 border-2 border-dashed rounded-3xl bg-muted/10 mx-auto"
            >
              <AlertCircle className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-foreground font-bold text-xl mb-2">No facilities found</p>
              <p className="text-muted-foreground text-sm mb-6">Try adjusting your filters or search terms.</p>
              <Button onClick={() => {setSearchQuery(''); setSelectedSpecialty(null); setSelectedType(null)}} size="sm" className="rounded-xl font-bold px-6">
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredFacilities.map((fac) => (
                  <motion.div 
                    key={fac.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={layoutTransition}
                  >
                    <Card className="overflow-hidden bg-card hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all duration-300 border-border/50 group h-full flex flex-col">
                      <CardHeader className="pb-2 pt-5 bg-muted/20">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg font-extrabold group-hover:text-primary transition-colors pr-2">{fac.name}</CardTitle>
                            <CardDescription className="mt-1.5 flex items-start gap-1">
                              <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <span className="leading-snug font-medium text-foreground/70">{fac.address}</span>
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 pt-5 flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2 border-b pb-3">
                           <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-black text-sm tabular-nums">{fac.rating}</span>
                          </div>
                          <span className="px-3 py-1 bg-primary/10 dark:bg-primary/20 backdrop-blur-md border border-primary/20 text-primary rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                             {fac.type}
                          </span>
                        </div>

                        <div className="space-y-3 mt-1">
                          <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                            <div className="p-2 bg-muted rounded-lg"><Phone className="w-4 h-4 text-muted-foreground" /></div>
                            <span>{fac.phone}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm font-medium text-foreground/80">
                            <div className="p-2 bg-muted rounded-lg"><Clock className="w-4 h-4 text-muted-foreground" /></div>
                            <span>{fac.hours}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-3">
                          {fac.specialties?.slice(0, 3).map((specialty) => (
                            <span
                              key={specialty}
                              className="px-2.5 py-1 bg-background border shadow-sm text-foreground/80 font-bold text-[10px] uppercase tracking-wider rounded-md"
                            >
                              {specialty}
                            </span>
                          ))}
                          {(fac.specialties?.length || 0) > 3 && (
                             <span className="px-2 py-1 bg-primary text-primary-foreground font-bold text-[10px] rounded-md">+{(fac.specialties?.length || 0) - 3}</span>
                          )}
                        </div>

                        <div className="pt-6 flex gap-3 w-full mt-auto">
                          <Button variant="outline" className="flex-1 font-bold rounded-xl h-11 hover:bg-muted/50 border-border/80 shadow-sm" onClick={() => window.open(`https://maps.google.com/?q=${fac.lat},${fac.lng}`)}>
                            <Navigation className="w-4 h-4 mr-2" />
                            Directions
                          </Button>
                          <Button className="flex-1 font-bold rounded-xl h-11 bg-foreground hover:bg-primary text-background hover:text-primary-foreground transition-all shadow-[0_4px_14px_0_rgba(10,132,255,0.2)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.4)] group-hover:-translate-y-0.5" onClick={() => window.location.href = fac.type === 'Pharmacy' ? '/app/pharmacy' : '/app/appointments'}>
                            {fac.type === 'Pharmacy' ? 'Order' : 'Book Now'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
