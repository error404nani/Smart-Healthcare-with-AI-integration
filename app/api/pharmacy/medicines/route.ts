import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const db = await getDb()
    const medicines = await db.collection('medicines').find({}).toArray()
    
    const formattedMedicines = medicines.map(med => ({
      ...med,
      id: med._id.toString(),
      _id: med._id.toString()
    }))
    
    return NextResponse.json(formattedMedicines)
  } catch (error: any) {
    console.error('Medicines fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch medicines' }, { status: 500 })
  }
}
