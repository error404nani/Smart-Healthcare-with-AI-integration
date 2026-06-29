import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const admin = await getUserFromRequest(req)
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.email.split('@')[0],
      email: user.email,
      role: user.role || 'patient',
      status: user.status || 'active',
      joined: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A'
    }))

    return NextResponse.json(formattedUsers)
  } catch (error: any) {
    console.error('Users fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
