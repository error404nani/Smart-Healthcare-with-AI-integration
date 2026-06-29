import { getDb } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const appointments = await db
      .collection('appointments')
      .find({ user_id: user.id })
      .sort({ appointment_date: 1 })
      .toArray()

    const normalized = appointments.map((doc) => ({
      ...doc,
      id: doc._id?.toString(),
    }))

    return NextResponse.json(normalized)
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { clinic_id, appointment_date, appointment_time, reason } = body

    const db = await getDb()
    const result = await db.collection('appointments').insertOne({
      user_id: user.id,
      clinic_id,
      appointment_date,
      appointment_time,
      reason,
      status: 'pending',
    })

    const created = {
      _id: result.insertedId,
      id: result.insertedId.toString(),
      user_id: user.id,
      clinic_id,
      appointment_date,
      appointment_time,
      reason,
      status: 'pending',
    }

    return NextResponse.json(created)
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
