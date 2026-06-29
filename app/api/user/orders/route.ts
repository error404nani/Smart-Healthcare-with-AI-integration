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
    const orders = await db.collection('orders')
      .find({ userId: new ObjectId(user.id) })
      .sort({ createdAt: -1 })
      .toArray()

    const formattedOrders = orders.map(order => ({
      id: `ORD-${order._id.toString().slice(-6).toUpperCase()}`,
      order_date: order.createdAt || new Date(),
      total_amount: order.total,
      status: order.status || 'pending',
      items: (order.items || []).map((item: any, idx: number) => ({
        id: item.medicineId?.toString() || idx.toString(),
        medicine_name: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    }))

    return NextResponse.json(formattedOrders)
  } catch (error: any) {
    console.error('Fetch user orders error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
