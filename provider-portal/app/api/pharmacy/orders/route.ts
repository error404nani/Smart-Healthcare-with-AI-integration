import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user || user.role !== 'pharmacy') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, action, all } = await req.json()
    const db = await getDb()

    if (all) {
      // Process all pending orders
      const status = action === 'accept' ? 'accepted' : 'declined'
      await db.collection('orders').updateMany(
        { status: 'pending' },
        { $set: { status, updatedAt: new Date() } }
      )
      return NextResponse.json({ message: `All pending orders ${status}` })
    }

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const status = action === 'accept' ? 'accepted' : 'declined'
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: { status, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ message: `Order ${status}` })

  } catch (error: any) {
    console.error('Order update error:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
