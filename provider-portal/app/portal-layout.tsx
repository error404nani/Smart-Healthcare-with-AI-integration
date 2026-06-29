'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Heart, LayoutDashboard, Users, UserCog, Pill, Hospital, LogOut, Menu, MapPin } from 'lucide-react'

export default function ProviderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) {
          router.push('/login')
          return
        }
        const data = await res.json()
        if (!data.user || data.user.role === 'patient') {
          router.push('/login')
          return
        }
        setUser(data.user)
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Portal...</div>

  const menuItems: Record<string, any[]> = {
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
      { icon: MapPin, label: 'Facility Map', href: '/admin/map' },
      { icon: Hospital, label: 'Hospitals', href: '/admin/hospitals' },
      { icon: Users, label: 'Manage Users', href: '/admin/users' },
      { icon: UserCog, label: 'System Settings', href: '/admin/settings' },
    ],
    doctor: [
      { icon: LayoutDashboard, label: 'My Patients', href: '/doctor' },
      { icon: Users, label: 'Appointments', href: '/doctor/appointments' },
    ],
    pharmacy: [
      { icon: LayoutDashboard, label: 'Inventory', href: '/pharmacy' },
      { icon: Pill, label: 'Orders', href: '/pharmacy/orders' },
    ],
    clinic: [
      { icon: LayoutDashboard, label: 'Clinic Overview', href: '/clinic' },
      { icon: Hospital, label: 'Staff Management', href: '/clinic/staff' },
    ],
  }

  const role = user?.role as string
  const items = menuItems[role] || []

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b flex items-center gap-2">
          <Heart className="text-primary w-6 h-6" />
          <span className="font-bold text-xl uppercase tracking-wider">{role} Portal</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {items.map((item) => (
            <Link key={item.href} href={item.href}>
              <button className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${pathname === item.href ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button 
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' })
              router.push('/login')
            }}
            className="w-full flex items-center gap-3 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
