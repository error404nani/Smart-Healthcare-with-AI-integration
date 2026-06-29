'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Truck, CheckCircle, Clock, Receipt, ChevronDown, Loader2, XCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface OrderItem {
  id: string
  medicine_name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  order_date: string
  total_amount: number
  status: 'pending' | 'accepted' | 'shipped' | 'delivered' | 'declined' | 'cancelled'
  items: OrderItem[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/user/orders')
      if (!res.ok) throw new Error('Failed to fetch orders')
      const data = await res.json()
      setOrders(data)
    } catch (error: any) {
      toast.error('Error', { description: error.message })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-600 dark:text-amber-500" />
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
      case 'declined':
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
      default:
        return <Package className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-700 dark:text-green-300 bg-green-500/10 border-green-500/20'
      case 'shipped':
        return 'text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/20'
      case 'pending':
        return 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
      case 'accepted':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
      case 'declined':
      case 'cancelled':
        return 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/20'
      default:
        return 'text-foreground/70 bg-muted border-border'
    }
  }

  const layoutTransition = { type: 'spring' as const, stiffness: 300, damping: 24 }

  return (
    <div className="space-y-6 md:space-y-8 max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Order History</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl">Track your medicine and healthcare orders, track deliveries, and view invoices.</p>
        </div>
      </div>

      <div className="pt-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-muted-foreground font-semibold">Fetching your orders...</p>
          </div>
        ) : orders.length > 0 ? (
          <motion.div layout className="space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => {
                const isSelected = selectedOrder === order.id;
                return (
                  <motion.div
                    key={order.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={layoutTransition}
                  >
                    <Card
                      className={`overflow-hidden transition-all duration-300 border-border/50 group bg-card cursor-pointer ${
                        isSelected ? 'shadow-[0_10px_40px_-15px_rgba(0,0,0,0.2)] ring-1 ring-primary/40' : 'hover:shadow-md hover:border-primary/20'
                      }`}
                      onClick={() => setSelectedOrder(isSelected ? null : order.id)}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1.5">
                              <Receipt className="w-4 h-4 text-muted-foreground" />
                              <CardTitle className="text-lg font-extrabold group-hover:text-primary transition-colors">{order.id}</CardTitle>
                            </div>
                            <CardDescription className="font-medium text-sm flex items-center gap-2">
                              Ordered on <span className="text-foreground/80 font-bold">{new Date(order.order_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                            </CardDescription>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </div>
                            
                            <motion.div
                              animate={{ rotate: isSelected ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center sm:hidden"
                            >
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            </motion.div>
                          </div>
                        </div>
                      </CardHeader>

                      <AnimatePresence initial={false}>
                        {isSelected ? (
                          <motion.div
                            key="content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={layoutTransition}
                          >
                            <CardContent className="space-y-4 border-t border-border/40 pt-5 mt-2 bg-gradient-to-b from-muted/20 to-transparent">
                              <div>
                                <h4 className="font-bold text-sm tracking-tight mb-3 text-muted-foreground uppercase">Order Contents</h4>
                                <div className="space-y-2.5">
                                  {order.items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-muted/40 rounded-xl border border-border/50">
                                      <div>
                                        <p className="font-bold text-foreground">{item.medicine_name}</p>
                                        <p className="text-xs font-semibold text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                                      </div>
                                      <p className="font-extrabold text-[15px] tabular-nums">₹{item.price.toFixed(2)}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="border-t border-border/60 pt-4 flex justify-between items-end my-4">
                                <span className="font-bold text-muted-foreground text-sm tracking-tight uppercase">Total Amount</span>
                                <span className="text-2xl font-black text-foreground tabular-nums tracking-tight">
                                  ₹{order.total_amount.toFixed(2)}
                                </span>
                              </div>

                              <Button variant="outline" className="w-full font-bold h-11 rounded-xl hover:bg-primary/5 hover:text-primary border-border/80">
                                <Receipt className="w-4 h-4 mr-2" />
                                Download Invoice
                              </Button>
                            </CardContent>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="summary"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <CardContent className="flex justify-between items-center pt-0">
                              <p className="text-sm font-semibold text-muted-foreground">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                              <div className="flex gap-4 items-center">
                                <p className="text-[17px] font-extrabold tabular-nums">₹{order.total_amount.toFixed(2)}</p>
                                <ChevronDown className="w-5 h-5 text-muted-foreground/50 hidden sm:block" />
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-4 border-2 border-dashed rounded-3xl bg-muted/10 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-background shadow-md rounded-full flex items-center justify-center mx-auto mb-6">
               <Package className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <p className="text-foreground font-extrabold text-2xl mb-2 tracking-tight">No Orders Yet</p>
            <p className="text-muted-foreground mb-8">You haven't placed any orders with the pharmacy.</p>
            <Button onClick={() => window.location.href = '/app/pharmacy'} size="lg" className="rounded-xl font-bold h-12 px-8 shadow-md">
              Browse Medicines
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
