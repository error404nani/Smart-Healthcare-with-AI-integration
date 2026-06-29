'use client'

import { useEffect, useState } from 'react'
import ProviderLayout from '../portal-layout'
import { Pill, ShoppingBag, Package, Truck, AlertTriangle, ArrowUpRight, Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PharmacyPortal() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch('/api/pharmacy/dashboard')
        if (!res.ok) throw new Error('Failed to fetch dashboard data')
        const data = await res.json()
        setDashboardData(data)
      } catch (error: any) {
        toast.error('Dashboard Error', {
          description: error.message
        })
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <ProviderLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-semibold">Loading Pharmacy Management Dashboard...</p>
        </div>
      </ProviderLayout>
    )
  }

  const handleOrderAction = async (orderId: string, action: 'accept' | 'decline') => {
    try {
      const res = await fetch('/api/pharmacy/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, action })
      })

      if (!res.ok) throw new Error('Failed to update order')

      toast.success(`Order ${action === 'accept' ? 'Accepted' : 'Declined'}`)
      
      // Refresh dashboard data
      const dashboardRes = await fetch('/api/pharmacy/dashboard')
      const data = await dashboardRes.json()
      setDashboardData(data)
    } catch (error: any) {
      toast.error('Error', { description: error.message })
    }
  }

  const handleProcessAll = async () => {
    try {
      const res = await fetch('/api/pharmacy/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept', all: true })
      })

      if (!res.ok) throw new Error('Failed to process all orders')

      toast.success('All pending orders processed')
      
      // Refresh dashboard data
      const dashboardRes = await fetch('/api/pharmacy/dashboard')
      const data = await dashboardRes.json()
      setDashboardData(data)
    } catch (error: any) {
      toast.error('Error', { description: error.message })
    }
  }

  const { inventory, orders, stats: dashboardStats } = dashboardData

  const stats = [
    { label: 'Pending Orders', value: dashboardStats.pendingOrders, icon: ShoppingBag, color: 'text-amber-500' },
    { label: 'Total Sales Today', value: dashboardStats.totalSalesToday, icon: ArrowUpRight, color: 'text-emerald-500' },
    { label: 'Out of Stock Items', value: dashboardStats.outOfStockItems, icon: AlertTriangle, color: 'text-rose-500' },
    { label: 'Deliveries Out', value: dashboardStats.deliveriesOut, icon: Truck, color: 'text-blue-500' },
  ]

  return (
    <ProviderLayout>
      <div className="space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pharmacy Management</h1>
            <p className="text-muted-foreground mt-2">Manage inventory, orders, and sales</p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 font-medium hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Add New Medicine
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
              </div>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Table */}
          <section className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Pill className="w-5 h-5 text-primary" />
                Inventory Status
              </h2>
              <button className="text-sm text-primary font-medium hover:underline">Manage All Inventory</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-sm">Medicine Name</th>
                    <th className="px-6 py-4 font-semibold text-sm">Category</th>
                    <th className="px-6 py-4 font-semibold text-sm">Stock</th>
                    <th className="px-6 py-4 font-semibold text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {inventory.map((item: any, i: number) => (
                    <tr key={i} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{item.name}</td>
                      <td className="px-6 py-4 text-sm">{item.category}</td>
                      <td className="px-6 py-4 text-sm font-bold">{item.stock}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 
                          item.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 
                          'bg-rose-100 text-rose-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Orders List */}
          <section className="bg-card rounded-xl border border-border shadow-sm flex flex-col">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                New Orders
              </h2>
              <span className="text-xs font-bold px-2 py-1 bg-primary text-primary-foreground rounded-full">
                {orders.length} Total
              </span>
            </div>
            <div className="p-4 space-y-4 flex-1 overflow-y-auto max-h-[400px]">
              {orders.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground italic">No orders found.</p>
              ) : (
                orders.map((order: any, i: number) => (
                  <div key={i} className="p-4 bg-muted/30 rounded-lg border border-transparent hover:border-primary/20 hover:bg-muted/50 transition-all cursor-pointer">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-primary">#{order.id.slice(-6).toUpperCase()}</span>
                      <span className="text-[10px] font-medium text-muted-foreground">{order.time}</span>
                    </div>
                    <p className="text-sm font-medium">{order.userEmail}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • ₹{order.total}
                    </p>
                    <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
                      {order.items.map((item: any, idx: number) => (
                        <span key={idx} className="text-[9px] bg-background px-1.5 py-0.5 rounded border whitespace-nowrap">
                          {item.quantity}x {item.name}
                        </span>
                      ))}
                    </div>
                    
                    {order.status === 'pending' && (
                      <div className="flex gap-2 mt-3 pt-3 border-t">
                        <button 
                          onClick={() => handleOrderAction(order.id, 'accept')}
                          className="flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider bg-emerald-500 hover:bg-emerald-600 text-white rounded transition-colors"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleOrderAction(order.id, 'decline')}
                          className="flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white rounded transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {order.status !== 'pending' && (
                      <div className="mt-3 pt-3 border-t">
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          order.status === 'accepted' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t">
              <button 
                onClick={handleProcessAll}
                disabled={orders.filter((o: any) => o.status === 'pending').length === 0}
                className="w-full py-2 text-sm font-bold bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Process All Orders
              </button>
            </div>
          </section>
        </div>
      </div>
    </ProviderLayout>
  )
}
