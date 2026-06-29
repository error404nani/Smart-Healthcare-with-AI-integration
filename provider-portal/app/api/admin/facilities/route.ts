import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

const mockFacilities = [
  {
    name: 'City Medical Center',
    address: '123 Main St, Downtown',
    phone: '+1 (555) 123-4567',
    specialties: ['General Practice', 'Cardiology', 'Orthopedics'],
    hours: '8:00 AM - 8:00 PM',
    rating: 4.8,
    type: 'Hospital',
    lat: 40.7128,
    lng: -74.0060
  },
  {
    name: 'Green Valley Clinic',
    address: '456 Oak Ave, Suburbs',
    phone: '+1 (555) 234-5678',
    specialties: ['Pediatrics', 'Family Medicine', 'Dermatology'],
    hours: '9:00 AM - 6:00 PM',
    rating: 4.6,
    type: 'Clinic',
    lat: 40.7200,
    lng: -74.0100
  },
  {
    name: 'Downtown Pharmacy Plus',
    address: '100 Main St, Downtown',
    phone: '+1 (555) 999-1111',
    specialties: ['Prescriptions', 'Over-the-counter', 'Consultations'],
    hours: '8:00 AM - 10:00 PM',
    rating: 4.7,
    type: 'Pharmacy',
    lat: 40.7135,
    lng: -74.0055
  }
]

export async function GET(req: NextRequest) {
  try {
    const admin = await getUserFromRequest(req)
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const count = await db.collection('facilities').countDocuments()

    // Seed if empty
    if (count === 0) {
      await db.collection('facilities').insertMany(mockFacilities)
    }

    const facilities = await db.collection('facilities').find({}).toArray()
    return NextResponse.json(facilities)
  } catch (error: any) {
    console.error('Facilities fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getUserFromRequest(req)
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()
    const body = await req.json()

    const { name, address, phone, specialties, hours, type, lat, lng } = body

    if (!name || !address || !type || !lat || !lng) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const newFacility = {
      name,
      address,
      phone: phone || '',
      specialties: Array.isArray(specialties) ? specialties : (specialties ? specialties.split(',').map((s: string) => s.trim()) : []),
      hours: hours || '9:00 AM - 5:00 PM',
      rating: 5.0,
      type,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      createdAt: new Date()
    }

    const result = await db.collection('facilities').insertOne(newFacility)
    return NextResponse.json({ ...newFacility, _id: result.insertedId }, { status: 201 })
  } catch (error: any) {
    console.error('Facility creation error:', error)
    return NextResponse.json({ error: 'Failed to create facility' }, { status: 500 })
  }
}
