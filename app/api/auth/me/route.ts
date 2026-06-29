import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    console.log('Auth me API called')
    
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database timeout')), 5000) // 5 second timeout
    })

    const userPromise = getUserFromRequest(req)
    
    const user = await Promise.race([userPromise, timeoutPromise])
    
    if (!user) {
      console.log('No user found in request')
      return NextResponse.json({ user: null }, { status: 401 })
    }

    console.log('User found:', user.email)
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth me error:', error)
    
    if (error instanceof Error && error.message === 'Database timeout') {
      return NextResponse.json({ 
        error: 'Service temporarily unavailable. Please try again.' 
      }, { status: 503 })
    }
    
    return NextResponse.json({ user: null }, { status: 401 })
  }
}

