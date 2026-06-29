import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest, createUser } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const admin = await getUserFromRequest(req)
    
    // Security Check: Only admins can create new staff
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, password, role } = await req.json()

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const newUser = await createUser(email, password, role)

    return NextResponse.json({ 
      message: 'Staff created successfully',
      user: { id: newUser.id, email: newUser.email, role: newUser.role } 
    })
  } catch (error: any) {
    console.error('Create staff error:', error)
    return NextResponse.json({ error: error.message || 'Failed to create staff' }, { status: 500 })
  }
}
