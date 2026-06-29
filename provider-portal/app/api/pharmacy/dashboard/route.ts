import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req)
    if (!user || user.role !== 'pharmacy') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()

    // 1. Get Inventory
    const inventory = await db.collection('medicines').find({}).toArray()

    // 2. Get Recent Orders
    const recentOrders = await db.collection('orders')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    // 3. Calculate Stats
    const pendingOrders = await db.collection('orders').countDocuments({ status: 'pending' })
    const outOfStockItems = await db.collection('medicines').countDocuments({ stock: { $lte: 0 } })
    
    // Total Sales Today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const salesToday = await db.collection('orders').aggregate([
      { $match: { createdAt: { $gte: today } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]).toArray()

    const totalSales = salesToday.length > 0 ? salesToday[0].total : 0

    return NextResponse.json({
      inventory: inventory.map(item => ({
        ...item,
        id: item._id.toString(),
        status: item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'
      })),
      orders: recentOrders.map(order => ({
        ...order,
        id: order._id.toString(),
        time: order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'
      })),
      stats: {
        pendingOrders,
        totalSalesToday: `₹${totalSales}`,
        outOfStockItems,
        deliveriesOut: 0 // Placeholder for now
      }
    })

  } catch (error: any) {
    console.error('Pharmacy dashboard fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
}
