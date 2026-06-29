import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const userData = await db.collection('users').findOne(
      { _id: new ObjectId(user.id) },
      { projection: { passwordHash: 0 } }
    )

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: userData._id.toString(),
      email: userData.email,
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      phone: userData.phone || '',
      date_of_birth: userData.date_of_birth || '',
      medical_history: userData.medical_history || '',
    })
  } catch (error: any) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { first_name, last_name, phone, date_of_birth, medical_history } = body

    const db = await getDb()
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(user.id) },
      {
        $set: {
          first_name,
          last_name,
          phone,
          date_of_birth,
          medical_history,
          updatedAt: new Date(),
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch (error: any) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
