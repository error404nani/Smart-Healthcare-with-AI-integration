'use client'

import { useEffect, useState } from 'react'
import ProviderLayout from '../../portal-layout'
import dynamic from 'next/dynamic'
import { MapPin, Building2, Phone, Clock, Plus, Loader2, X, Navigation } from 'lucide-react'
import { toast } from 'sonner'

// Dynamically import map to avoid SSR issues
const AdminMap = dynamic(() => import('../../../components/admin-map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-muted/20 border rounded-xl animate-pulse">
      <div className="flex flex-col items-center">
        <MapPin className="w-12 h-12 text-muted-foreground/30 mb-4 animate-bounce" />
        <p className="text-muted-foreground font-semibold">Loading map interface...</p>
      </div>
    </div>
  )
})

export default function AdminMapPage() {
  const [facilities, setFacilities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    hours: '8:00 AM - 8:00 PM',
    type: 'Clinic',
    specialties: '',
    lat: '',
    lng: ''
  })

  useEffect(() => {
    fetchFacilities()
  }, [])

  const fetchFacilities = async () => {
    try {
      const res = await fetch('/api/admin/facilities')
      if (!res.ok) throw new Error('Failed to fetch facilities')
      const data = await res.json()
      setFacilities(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setFormData(prev => ({ ...prev, lat: lat.toFixed(6), lng: lng.toFixed(6) }))
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch('/api/admin/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create facility')
      }

      toast.success('Facility added successfully!')
      setIsModalOpen(false)
      setFormData({
        name: '', address: '', phone: '', hours: '8:00 AM - 8:00 PM',
        type: 'Clinic', specialties: '', lat: '', lng: ''
      })
      fetchFacilities()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ProviderLayout>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              Facility Management Map
            </h1>
            <p className="text-muted-foreground mt-2">Add and manage medical centers, clinics, and pharmacies across the ecosystem</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Location
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map Column */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-card rounded-xl border border-border shadow-lg overflow-hidden relative">
              <AdminMap facilities={facilities} onMapClick={handleMapClick} />
            </div>
          </div>

          {/* Directory Column */}
          <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 pb-4">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Directory
            </h3>
            
            {loading ? (
              <div className="flex flex-col items-center py-12 gap-3 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="text-sm font-medium">Loading facilities...</p>
              </div>
            ) : facilities.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground border border-dashed rounded-xl">No facilities registered.</p>
            ) : (
              facilities.map((fac) => (
                <div key={fac._id} className="p-4 bg-card border border-border rounded-xl shadow-sm hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{fac.name}</h4>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {fac.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-2">
                    <MapPin className="w-3 h-3 text-primary" />
                    {fac.address}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {fac.specialties?.slice(0, 2).map((s: string) => (
                      <span key={s} className="text-[9px] font-bold px-1.5 py-0.5 bg-muted rounded border">{s}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal for Adding New Facility */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b flex justify-between items-center bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold">Register New Location</h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Facility Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g. LifeCare Hospital"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Street Address</label>
                  <input 
                    type="text" required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="123 Medical Plaza, NY"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Latitude</label>
                  <input 
                    type="number" step="any" required
                    value={formData.lat}
                    onChange={(e) => setFormData({...formData, lat: e.target.value})}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="40.7128"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Longitude</label>
                  <input 
                    type="number" step="any" required
                    value={formData.lng}
                    onChange={(e) => setFormData({...formData, lng: e.target.value})}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="-74.0060"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Clinic">Clinic</option>
                    <option value="Hospital">Hospital</option>
                    <option value="Pharmacy">Pharmacy Shop</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Contact Number</label>
                  <input 
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Specialties (comma separated)</label>
                  <input 
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Pediatrics, Surgery, etc."
                  />
                </div>

                <div className="col-span-2 pt-6 flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 border border-border rounded-xl font-bold hover:bg-muted transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(10,132,255,0.3)]"
                  >
                    {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    Add Facility
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProviderLayout>
  )
}
