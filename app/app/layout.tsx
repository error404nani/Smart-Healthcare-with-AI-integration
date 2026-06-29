'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, MapPin, Calendar, Pill, Brain, LogOut, Menu, User, Package } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const SESSION_CACHE_KEY = 'app_user_cache'

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // NOTE: Don't read browser-only storage during initial render.
  // If we do, the client can render different HTML than the server and cause hydration errors.
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const hasFetched = useRef(false)

  useEffect(() => {
    // Optimized: Check auth once, use cache for fast navigation
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...')
        
        // Try cached user first for instant UI
        try {
          const cached = sessionStorage.getItem(SESSION_CACHE_KEY)
          if (cached) {
            console.log('Using cached user')
            setUser(JSON.parse(cached))
            setLoading(false)
            return
          }
        } catch {
          // ignore cache read errors and fall back to API
        }

        // Fallback to API only if no cache
        console.log('Fetching user from API...')
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        console.log('Auth response status:', res.status)
        
        if (res.ok) {
          const data = await res.json()
          console.log('Auth response data:', data)
          
          if (data.user) {
            setUser(data.user)
            sessionStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(data.user))
            console.log('User authenticated successfully')
          } else {
            console.log('No user in response')
            router.push('/auth/login')
          }
        } else {
          console.log('Auth request failed')
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } finally {
      try { sessionStorage.removeItem(SESSION_CACHE_KEY) } catch { /* ignore */ }
      router.push('/')
    }
  }

  // Only show loading spinner if we have no user at all yet (first ever load)
  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    { icon: Brain, label: 'Symptom Checker', href: '/app/symptom-checker' },
    { icon: MessageCircle, label: 'Doctor Chat', href: '/app/doctor-chat' },
    { icon: Pill, label: 'Pharmacy', href: '/app/pharmacy' },
    { icon: Package, label: 'My Orders', href: '/app/orders' },
    { icon: MapPin, label: 'Find Clinics', href: '/app/clinics' },
    { icon: Calendar, label: 'Appointments', href: '/app/appointments' },
    { icon: User, label: 'My Profile', href: '/app/profile' },
  ]

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      <div className="p-4 flex items-center justify-between shrink-0 h-16 border-b">
        <Link
          href="/app"
          onClick={() => isMobile && setMobileMenuOpen(false)}
          className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${(isMobile || sidebarOpen) ? 'flex' : 'hidden'}`}
        >
          <Heart className="w-6 h-6 text-primary shrink-0" />
          <span className="font-bold text-foreground">Smart Healthcare</span>
        </Link>
        {!isMobile && sidebarOpen === false && (
          <Link href="/app" className="flex items-center justify-center p-2 hover:bg-muted rounded-lg transition-colors">
            <Heart className="w-6 h-6 text-primary shrink-0" />
          </Link>
        )}
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href} onClick={() => isMobile && setMobileMenuOpen(false)}>
              <button 
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-semibold' 
                    : 'hover:bg-muted text-foreground hover:text-primary'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                {(isMobile || sidebarOpen) && <span>{item.label}</span>}
              </button>
            </Link>
          )
        })}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t shrink-0">
        <div className={`${(isMobile || sidebarOpen) ? 'mb-4 p-3 bg-muted rounded-lg truncate' : 'mb-4'}`}>
          {(isMobile || sidebarOpen) && (
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          )}
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(isMobile || sidebarOpen) && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop Only */}
      <div className={`hidden md:flex ${sidebarOpen ? 'w-64' : 'w-20'} bg-card border-r transition-all duration-300 flex-col shrink-0`}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b flex items-center px-4 md:px-6 justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile Sidebar Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-muted-foreground shrink-0">
                  <Menu className="w-6 h-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 flex flex-col">
                <SheetHeader className="hidden">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarContent isMobile={true} />
              </SheetContent>
            </Sheet>
            
            <Link href="/app" className="text-xl md:text-2xl font-bold text-foreground truncate hover:opacity-80 transition-opacity">
              Smart Healthcare
            </Link>
          </div>
          <div className="text-xs md:text-sm text-muted-foreground truncate ml-4">
            Welcome, {user?.email || 'User'}
          </div>
        </header>

        {/* Scrolling Wrapper */}
        <div className="flex-1 overflow-auto">
          {/* Centered Content Container */}
          <main className="p-4 md:p-8 lg:p-12 w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
