import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '../../../../lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    const facilities = db.collection('facilities')

    const hospitals = await facilities
      .find({ facility_type: 'hospital' })
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json(hospitals)
  } catch (error) {
    console.error('Error fetching hospitals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch hospitals' },
      { status: 500 }
    )
  }
}