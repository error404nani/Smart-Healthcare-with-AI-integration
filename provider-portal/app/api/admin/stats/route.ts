import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getDb } from '@/lib/mongodb'

export async function GET(req: NextRequest) {
  try {
    const admin = await getUserFromRequest(req)
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = await getDb()

    // 1. Total Users
    const totalUsers = await db.collection('users').countDocuments()

    // 2. Pending Approvals (Users with role other than 'patient' and no status field, or specifically 'pending')
    // For now, let's assume all newly created staff via the dashboard are 'active' by default.
    // We'll count users who might need approval if we add that logic later.
    const pendingApprovals = await db.collection('users').countDocuments({ status: 'pending' })

    // 3. Active Sessions
    const activeSessions = await db.collection('sessions').countDocuments()

    // 4. System Alerts (Example: count of recent errors if we had an error log, otherwise 0)
    const systemAlerts = 0 

    // 5. Recent User Activity (Last 10 users to ensure patients are visible)
    const recentUsers = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray()

    const formattedRecentUsers = recentUsers.map(user => ({
      name: user.email.split('@')[0], // Simplified name since we don't have full name yet
      email: user.email,
      role: user.role || 'patient',
      status: user.status || 'Active',
      time: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'
    }))

    return NextResponse.json({
      stats: [
        { label: 'Total Users', value: totalUsers.toString(), icon: 'Users', color: 'text-blue-500' },
        { label: 'Pending Approvals', value: pendingApprovals.toString(), icon: 'ShieldCheck', color: 'text-amber-500' },
        { label: 'Active Sessions', value: activeSessions.toString(), icon: 'Activity', color: 'text-emerald-500' },
        { label: 'System Alerts', value: systemAlerts.toString(), icon: 'Bell', color: 'text-rose-500' },
      ],
      recentUsers: formattedRecentUsers
    })
  } catch (error: any) {
    console.error('Stats fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
  }
}
