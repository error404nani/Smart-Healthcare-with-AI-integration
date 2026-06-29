import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()
    const facilities = await db.collection('facilities').find({}).toArray()
    
    const formattedFacilities = facilities.map(fac => ({
      ...fac,
      id: fac._id.toString(),
      _id: fac._id.toString()
    }))
    
    return NextResponse.json(formattedFacilities)
  } catch (error: any) {
    console.error('Facilities fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 })
  }
}
