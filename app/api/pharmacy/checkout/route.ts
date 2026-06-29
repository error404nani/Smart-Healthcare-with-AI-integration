import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { items, total } = await req.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const db = await getDb()

    // 1. Create the order
    const order = {
      userId: new ObjectId(user.id),
      userEmail: user.email,
      items: items.map((item: any) => ({
        medicineId: new ObjectId(item.id),
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('orders').insertOne(order)

    // 2. Update stock for each item (Optional but good practice)
    for (const item of items) {
      await db.collection('medicines').updateOne(
        { _id: new ObjectId(item.id) },
        { $inc: { stock: -item.quantity } }
      )
    }

    return NextResponse.json({ 
      message: 'Order placed successfully', 
      orderId: result.insertedId.toString() 
    }, { status: 201 })

  } catch (error: any) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
  }
}
