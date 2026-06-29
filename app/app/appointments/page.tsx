'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Clock, AlertCircle, CheckCircle, Hospital, CalendarPlus, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Appointment {
  id: string
  clinic_id: string
  clinic_name: string
  appointment_date: string
  appointment_time: string
  reason: string
  status: 'pending' | 'confirmed' | 'cancelled'
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(false)
  const [showBooking, setShowBooking] = useState(false)
  const [formData, setFormData] = useState({
    clinic_name: '',
    appointment_date: '',
    appointment_time: '',
    reason: '',
  })
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/appointments')
      if (response.ok) {
        const data = await response.json()
        setAppointments(data || [])
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.appointment_date || !formData.appointment_time || !formData.reason) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' })
      return
    }

    // Optimistically update the UI before server responds
    const newAppointment: Appointment = {
      id: Math.random().toString(), // temporary ID
      clinic_id: formData.clinic_name || 'Selected Clinic',
      clinic_name: formData.clinic_name || 'Selected Clinic',
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      reason: formData.reason,
      status: 'pending',
    }

    setAppointments(prev => [newAppointment, ...prev])
    setMessage({ type: 'success', text: 'Appointment booked successfully!' })
    setFormData({ clinic_name: '', appointment_date: '', appointment_time: '', reason: '' })
    setShowBooking(false)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clinic_id: newAppointment.clinic_name,
          appointment_date: newAppointment.appointment_date,
          appointment_time: newAppointment.appointment_time,
          reason: newAppointment.reason,
        }),
      })

      if (!response.ok) {
        // Rollback on failure
        setAppointments(prev => prev.filter(app => app.id !== newAppointment.id))
        setMessage({ type: 'error', text: 'Failed to book appointment' })
      } else {
        // Refresh with real data
        fetchAppointments()
      }
    } catch (error) {
      console.error('Error booking appointment:', error)
      setAppointments(prev => prev.filter(app => app.id !== newAppointment.id))
      setMessage({ type: 'error', text: 'An error occurred while booking the appointment' })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-500/10 border-green-500/20'
      case 'pending':
        return 'text-blue-600 bg-blue-500/10 border-blue-500/20'
      case 'cancelled':
        return 'text-red-600 bg-red-500/10 border-red-500/20'
      default:
        return 'text-foreground/70 bg-muted border-border'
    }
  }

  // Animation variants
  const layoutTransition = { type: 'spring' as const, stiffness: 300, damping: 24 }

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Appointments</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">Manage your healthcare schedule, book new visits, and track your consultation history all in one place.</p>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
          >
            <Card className={`border-2 ${message.type === 'success' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <CardContent className="p-4 flex items-center gap-3">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <p className={`font-bold ${message.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{message.text}</p>
                <Button variant="ghost" size="sm" className="ml-auto" onClick={() => setMessage(null)}>Dismiss</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50">
        <h2 className="text-xl font-extrabold tracking-tight">Upcoming Schedule</h2>
        <Button 
          onClick={() => setShowBooking(!showBooking)} 
          variant={showBooking ? 'outline' : 'default'}
          className={showBooking ? 'font-bold rounded-xl bg-background shadow-sm' : 'font-bold rounded-xl shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.23)] hover:-translate-y-0.5 transition-all'}
        >
          {showBooking ? 'Cancel Booking' : '+ Book New Appointment'}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {showBooking && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={layoutTransition}
            className="overflow-hidden"
          >
            <Card className="border-2 shadow-xl bg-gradient-to-br from-primary/5 via-background to-background rounded-2xl border-primary/20">
              <CardHeader className="bg-background/50 border-b pb-4">
                <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                  <CalendarPlus className="w-5 h-5 text-primary" /> Book Your Visit
                </CardTitle>
                <CardDescription>Fill in the details below to schedule your consultation</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleBookAppointment} className="space-y-6">
                  <div>
                    <Label htmlFor="clinic" className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider mb-2 block">Facility/Doctor Name</Label>
                    <div className="relative">
                      <Hospital className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="clinic"
                        placeholder="Search for a clinic or doctor"
                        value={formData.clinic_name}
                        onChange={(e) => setFormData({ ...formData, clinic_name: e.target.value })}
                        className="pl-10 h-12 bg-background border-border/50 focus-visible:ring-primary/50 text-base font-medium rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="date" className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider mb-2 block">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.appointment_date}
                        onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                        className="h-12 bg-background border-border/50 focus-visible:ring-primary/50 text-base font-medium rounded-xl tabular-nums"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <Label htmlFor="time" className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider mb-2 block">Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.appointment_time}
                        onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                        className="h-12 bg-background border-border/50 focus-visible:ring-primary/50 text-base font-medium rounded-xl tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reason" className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider mb-2 block">Reason for Visit *</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="reason"
                        placeholder="e.g., Annual Checkup, Back Pain, Follow-up"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        className="pl-10 h-12 bg-background border-border/50 focus-visible:ring-primary/50 text-base font-medium rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button type="submit" size="lg" className="w-full sm:w-auto h-12 px-8 font-bold rounded-xl shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.23)] hover:-translate-y-0.5 transition-all text-base">
                      Confirm Appointment
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4">
        {loading ? (
          <div className="py-24 text-center flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-6"></div>
            <p className="text-muted-foreground font-semibold text-lg">Retrieving your schedule...</p>
          </div>
        ) : appointments.length > 0 ? (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {appointments.map((appointment) => (
                <motion.div
                  key={appointment.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={layoutTransition}
                >
                  <Card className="hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] hover:scale-[1.02] transition-all duration-300 border-border/50 group bg-white dark:bg-zinc-900/80 h-full flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-extrabold group-hover:text-primary transition-colors">{appointment.clinic_id}</CardTitle>
                          <CardDescription className="font-medium mt-1.5 line-clamp-1">{appointment.reason}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 flex-1 flex flex-col justify-end">
                      <div className="bg-muted/40 rounded-xl p-3.5 space-y-3 mb-4 border border-border/30">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-background shadow-sm rounded-md"><Calendar className="w-4 h-4 text-primary" /></div>
                          <span className="font-bold text-sm tabular-nums text-foreground/80">{new Date(appointment.appointment_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'})}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 bg-background shadow-sm rounded-md"><Clock className="w-4 h-4 text-primary" /></div>
                          <span className="font-bold text-sm tabular-nums text-foreground/80">{appointment.appointment_time}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-auto border-t pt-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        
                        <Button variant="ghost" size="sm" className="font-bold text-xs hover:bg-primary/10 hover:text-primary rounded-lg transition-colors">
                           Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-4 border-2 border-dashed rounded-3xl bg-muted/10 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-background shadow-md rounded-full flex items-center justify-center mx-auto mb-6">
               <Calendar className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="text-foreground font-extrabold text-2xl mb-2 tracking-tight">No Appointments</p>
            <p className="text-muted-foreground mb-8">You haven't scheduled any consultations yet.</p>
            <Button onClick={() => setShowBooking(true)} size="lg" className="rounded-xl font-bold h-12 px-8 shadow-md">
              Book Your First Visit
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

