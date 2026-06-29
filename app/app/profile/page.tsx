'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertCircle, CheckCircle, LogOut, UserCircle, Settings, Edit3, ShieldX } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  date_of_birth: string
  medical_history: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [formData, setFormData] = useState<Partial<UserProfile>>({})

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile')
      if (!res.ok) {
        if (res.status === 401) {
          router.push('/auth/login')
          return
        }
        throw new Error('Failed to fetch profile')
      }
      const data = await res.json()
      
      setProfile(data)
      setFormData(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      setMessage({ type: 'error', text: 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setProfile(formData as UserProfile)
      setEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage({ type: 'error', text: 'Failed to update profile' })
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-muted-foreground font-semibold text-lg">Loading your profile...</p>
      </div>
    )
  }

  const layoutTransition = { type: 'spring' as const, stiffness: 300, damping: 24 }

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <UserCircle className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">My Profile</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">Manage your personal information, medical history, and account settings.</p>
        </div>
      </div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
          >
            <Card className={`border-2 shadow-sm ${message.type === 'success' ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
              <CardContent className="p-4 flex items-center gap-3">
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                )}
                <p className={`font-bold ${message.type === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>{message.text}</p>
                <Button variant="ghost" size="sm" className="ml-auto font-bold" onClick={() => setMessage(null)}>Dismiss</Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={layoutTransition}>
        <Card className="border-0 shadow-xl bg-gradient-to-br from-primary/5 via-background to-background rounded-2xl overflow-hidden ring-1 ring-border/50">
          <CardHeader className="bg-background/50 border-b pb-4 px-6 md:px-8 pt-6 md:pt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" /> Personal Information
                </CardTitle>
                <CardDescription className="mt-1.5 font-medium">View and update your profile details</CardDescription>
              </div>
              {!editing && (
                <Button onClick={() => setEditing(true)} className="font-bold rounded-xl shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.23)] hover:-translate-y-0.5 transition-all">
                  <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-6 md:px-8 py-6 md:py-8 bg-background">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider">First Name</Label>
                <div className={`transition-all ${editing ? 'ring-2 ring-primary/20 rounded-xl' : ''}`}>
                  <Input
                    value={formData.first_name || ''}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    disabled={!editing}
                    placeholder={editing ? "Enter your first name" : "Not provided"}
                    className={`h-12 border-border/50 text-base font-medium rounded-xl disabled:bg-muted/30 disabled:border-transparent ${editing ? 'bg-background shadow-sm' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider">Last Name</Label>
                <div className={`transition-all ${editing ? 'ring-2 ring-primary/20 rounded-xl' : ''}`}>
                  <Input
                    value={formData.last_name || ''}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    disabled={!editing}
                    placeholder={editing ? "Enter your last name" : "Not provided"}
                    className={`h-12 border-border/50 text-base font-medium rounded-xl disabled:bg-muted/30 disabled:border-transparent ${editing ? 'bg-background shadow-sm' : ''}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider flex items-center gap-2">
                Email Address
                <span className="bg-primary/10 text-primary text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Verified</span>
              </Label>
              <Input value={formData.email || ''} disabled className="h-12 border-transparent bg-muted/30 text-base font-medium rounded-xl opacity-80" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider">Phone Number</Label>
                <div className={`transition-all ${editing ? 'ring-2 ring-primary/20 rounded-xl' : ''}`}>
                  <Input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!editing}
                    placeholder={editing ? "Enter your phone number" : "Not provided"}
                    className={`h-12 border-border/50 text-base font-medium rounded-xl tabular-nums disabled:bg-muted/30 disabled:border-transparent ${editing ? 'bg-background shadow-sm' : ''}`}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider">Date of Birth</Label>
                <div className={`transition-all ${editing ? 'ring-2 ring-primary/20 rounded-xl' : ''}`}>
                  <Input
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                    disabled={!editing}
                    className={`h-12 border-border/50 text-base font-medium rounded-xl tabular-nums disabled:bg-muted/30 disabled:border-transparent ${editing ? 'bg-background shadow-sm' : ''}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-muted-foreground uppercase text-[11px] tracking-wider">Medical History</Label>
              <div className={`transition-all ${editing ? 'ring-2 ring-primary/20 rounded-xl' : ''}`}>
                <textarea
                  value={formData.medical_history || ''}
                  onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                  disabled={!editing}
                  placeholder={editing ? "List any medical conditions, allergies, or medications..." : "No medical history recorded"}
                  className={`w-full min-h-[120px] p-4 bg-background border border-border/50 rounded-xl text-base font-medium resize-none disabled:bg-muted/30 disabled:border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow ${editing ? 'bg-background shadow-sm' : ''}`}
                />
              </div>
            </div>

            <AnimatePresence>
              {editing && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col sm:flex-row gap-3 pt-6 border-t"
                >
                  <Button onClick={handleSave} size="lg" className="flex-1 font-bold rounded-xl h-12 shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.23)] hover:-translate-y-0.5 transition-all text-base">
                    Save Changes
                  </Button>
                  <Button onClick={() => setEditing(false)} variant="outline" size="lg" className="flex-1 font-bold rounded-xl h-12 text-base hover:bg-muted shadow-sm">
                    Cancel
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, ...layoutTransition }}>
        <Card className="border-0 shadow-lg bg-red-500/5 rounded-2xl overflow-hidden ring-1 ring-red-500/20">
          <CardHeader className="bg-card border-b border-red-500/10 pb-4 px-6 md:px-8">
            <CardTitle className="text-red-600 dark:text-red-400 font-extrabold flex items-center gap-2">
              <ShieldX className="w-5 h-5" /> Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 md:px-8 py-6">
            <p className="text-sm font-medium text-muted-foreground mb-6">
              When you log out, your current session will be terminated and you will be returned to the home page securely.
            </p>
            <Button onClick={handleLogout} variant="destructive" className="sm:w-auto w-full font-bold h-11 rounded-xl px-8 shadow-sm hover:shadow-md transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out Securely
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
