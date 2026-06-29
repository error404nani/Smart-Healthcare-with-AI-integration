"use client"

import { useEffect, useState } from 'react'
import ProviderLayout from '../portal-layout'
import { Users, UserPlus, ShieldCheck, Activity, Settings, Bell, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'doctor' as any
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats')
        if (!res.ok) throw new Error('Failed to fetch dashboard stats')
        const data = await res.json()
        setDashboardData(data)
      } catch (error: any) {
        toast.error(error.message)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [])

  const iconMap: Record<string, any> = {
    Users,
    ShieldCheck,
    Activity,
    Bell
  }

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/admin/create-staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create staff')
      }

      toast.success('Staff member created successfully!')
      setIsModalOpen(false)
      setFormData({ email: '', password: '', role: 'doctor' })
      
      // Refresh stats
      const statsRes = await fetch('/api/admin/stats')
      const statsData = await statsRes.json()
      setDashboardData(statsData)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProviderLayout>
      <div className="space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Administrator Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage the entire Smart Healthcare ecosystem</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add New Staff
          </button>
        </header>

        {/* Modal for Adding New Staff */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-md rounded-xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Register New Staff</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 hover:bg-muted rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="name@provider.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <input 
                    type="password" 
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Specialized Role</label>
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="doctor">Medical Doctor</option>
                    <option value="pharmacy">Pharmacy Merchant</option>
                    <option value="clinic">Clinic/Hospital Manager</option>
                  </select>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create Account
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-card p-6 rounded-xl border border-border shadow-sm animate-pulse h-24" />
            ))
          ) : (
            dashboardData?.stats.map((stat: any) => {
              const Icon = iconMap[stat.icon] || Activity
              return (
                <div key={stat.label} className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                  </div>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              )
            })
          )}
        </div>

        {/* User Management Section */}
        <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Recent User Activity</h2>
            <Link href="/admin/users">
              <button className="text-sm text-primary font-medium hover:underline">View All Users</button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 font-semibold text-sm">User</th>
                  <th className="px-6 py-4 font-semibold text-sm">Role</th>
                  <th className="px-6 py-4 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 font-semibold text-sm">Last Seen</th>
                  <th className="px-6 py-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {statsLoading ? (
                  Array(3).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4 h-12 bg-muted/20" />
                    </tr>
                  ))
                ) : (
                  dashboardData?.recentUsers.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{row.email}</td>
                      <td className="px-6 py-4 text-sm capitalize">{row.role}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.status === 'Active' || row.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-muted text-muted-foreground'}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.time}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/admin/users?search=${encodeURIComponent(row.email)}`}>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </ProviderLayout>
  )
}
