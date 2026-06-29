import { NextRequest, NextResponse } from 'next/server'
import { createUser, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    console.log('Signup API called')
    
    const { email, password } = await req.json()
    console.log('Signup attempt for email:', email)

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 10000) // 10 second timeout
    })

    const userPromise = createUser(email, password)
    
    const user = await Promise.race([userPromise, timeoutPromise])
    
    await createSession(user)
    console.log('User created and session created:', user.email)

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 })
  } catch (error: any) {
    console.error('Signup error:', error)
    
    if (error instanceof Error && error.message === 'Database timeout') {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable. Please try again.' 
      }, { status: 503 })
    }
    
    return NextResponse.json(
      { error: error?.message || 'Failed to sign up' },
      { status: 400 },
    )
  }
}

