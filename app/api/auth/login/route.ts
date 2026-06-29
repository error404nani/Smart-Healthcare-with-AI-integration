import { NextRequest, NextResponse } from 'next/server'
import { verifyUser, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    console.log('Login API called')
    
    const { email, password } = await req.json()
    console.log('Login attempt for email:', email)

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 10000) // 10 second timeout
    })

    const userPromise = verifyUser(email, password)
    
    const user = await Promise.race([userPromise, timeoutPromise])
    
    if (!user) {
      console.log('Invalid credentials for:', email)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    console.log('User verified:', user.email)
    
    await createSession(user)
    console.log('Session created for:', user.email)

    return NextResponse.json({ 
      id: user.id, 
      email: user.email,
      role: user.role 
    })
  } catch (error) {
    console.error('Login error:', error)
    
    if (error instanceof Error && error.message === 'Database timeout') {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable. Please try again.' 
      }, { status: 503 })
    }
    
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
  }
}

