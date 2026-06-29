'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Github, Mail, Heart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('Attempting login with:', email)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        console.error('Login failed:', data)
        throw new Error(data?.error || 'Failed to login')
      }

      const data = await response.json()
      console.log('Login successful:', data)
      
      // Add a small delay to ensure cookie is set
      setTimeout(() => {
        router.push('/app')
      }, 100)
      
    } catch (error: unknown) {
      console.error('Login error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full bg-slate-50 dark:bg-background relative">
      {/* Absolute Logo for Consistency */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-2">
        <Heart className="w-6 h-6 text-primary" />
        <span className="text-xl font-bold text-foreground">Smart Healthcare</span>
      </div>

      {/* Left side Form with subtle pattern */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2 relative">
        <div className="absolute inset-0 bg-slate-50 dark:bg-background -z-20" />
        <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/30 via-transparent to-transparent dark:from-blue-900 dark:via-background dark:to-background pointer-events-none" />
        <div className="absolute inset-0 -z-10 opacity-20 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-600/30 via-transparent to-transparent dark:from-purple-900 dark:via-transparent dark:to-transparent pointer-events-none" />

        <div className="w-full max-w-md">
          <Card className="border-0 shadow-lg sm:border sm:shadow">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-3xl font-bold tracking-tight">Welcome back</CardTitle>
              <CardDescription>
                Enter your credentials to access your Smart Healthcare account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/auth/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                        tabIndex={-1}
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && <p className="text-sm font-medium text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" type="button" disabled={isLoading}>
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Button>
                  <Button variant="outline" type="button" disabled={isLoading}>
                    <Mail className="mr-2 h-4 w-4" />
                    Google
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center text-sm text-muted-foreground flex flex-col gap-3">
                <p>Don&apos;t have an account?</p>
                <Link href="/auth/signup">
                  <Button variant="secondary" className="w-full font-semibold border shadow-sm">
                    Create a new account
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side Image/Carousel */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 border-l relative overflow-hidden">
        {/* We can use an abstract gradient or standard high-quality healthcare imagery here */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-blue-900 z-10 opacity-90" />
        
        <img 
          src="https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop" 
          alt="Healthcare Interface" 
          className="absolute inset-0 object-cover w-full h-full"
        />

        <div className="relative z-20 flex flex-col justify-end p-12 text-white h-full">
          <Heart className="w-12 h-12 mb-6" />
          <h2 className="text-4xl font-bold mb-4">Your Health, Guided by Intelligence</h2>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Join thousands of users experiencing smarter healthcare—from AI symptom checks to instant consultations with verified doctors.
          </p>
        </div>
      </div>
    </div>
  )
}
