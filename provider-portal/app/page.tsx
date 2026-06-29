'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Loader2 } from 'lucide-react'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (res.ok) {
          const data = await res.json()
          if (data.user && data.user.role !== 'patient') {
            router.push(`/${data.user.role}`)
            return
          }
        }
        router.push('/login')
      } catch {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center">
        <Heart className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold">Smart Healthcare</h1>
        <p className="text-muted-foreground mt-2">Initializing Provider Portal...</p>
        <Loader2 className="w-6 h-6 animate-spin mx-auto mt-6 text-primary/50" />
      </div>
    </div>
  )
}
