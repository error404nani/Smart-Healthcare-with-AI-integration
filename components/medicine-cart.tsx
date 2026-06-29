'use client'

import { Trash2, Plus, Minus, FileText, ShieldCheck, UserCheck, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface MedicineCartProps {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onCheckout: () => void
}

export function MedicineCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: MedicineCartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <Card className="p-10 text-center flex flex-col items-center justify-center border-dashed border-2 bg-muted/20 h-[50vh] mt-4 shadow-sm">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 shadow-inner">
          <FileText className="w-8 h-8 text-muted-foreground/70" />
        </div>
        <p className="text-lg font-bold text-foreground mb-1">Your prescription pad is empty.</p>
        <p className="text-sm text-muted-foreground">Add some medicines to your cart to continue.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4 flex flex-col h-full py-4 overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {items.map((item) => (
          <Card key={item.id} className="p-3 border-border hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm line-clamp-2">{item.name}</h3>
                <p className="text-primary font-bold mt-1 tabular-nums">₹{item.price.toFixed(2)}</p>
              </div>

              <div className="flex items-center gap-2 bg-muted/40 rounded-full p-1 border border-border/50">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center bg-background rounded-full border shadow-sm hover:bg-muted transition-colors shrink-0"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-5 text-center font-bold text-sm tabular-nums">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center bg-background rounded-full border shadow-sm hover:bg-muted transition-colors shrink-0"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="text-right flex flex-col items-end justify-between h-full min-h-[50px]">
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 hover:bg-destructive/10 rounded-md text-muted-foreground hover:text-destructive transition-colors mt-0.5"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="font-extrabold text-foreground tabular-nums text-sm mt-auto">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5 bg-card border-t-[3px] border-primary/20 shadow-xl mt-auto shrink-0">
        <div className="space-y-3 mb-5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums font-medium">₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Delivery Fee</span>
            <span className="tabular-nums font-medium">₹{(total > 500 ? 0 : 50).toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 flex justify-between font-black text-lg text-foreground">
            <span>Total</span>
            <span className="text-primary tabular-nums">₹{(total + (total > 500 ? 0 : 50)).toFixed(2)}</span>
          </div>
          {total > 500 ? (
             <p className="text-[11px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider text-center bg-green-500/10 py-1.5 rounded-md">Free delivery applied!</p>
          ) : (
            <p className="text-[11px] font-medium text-muted-foreground text-center">Add <strong className="tabular-nums">₹{(500 - total).toFixed(2)}</strong> more for free delivery</p>
          )}
        </div>

        <button 
          onClick={(e) => {
            console.log('Checkout button clicked!')
            e.preventDefault()
            onCheckout()
          }} 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-12 shadow-[0_4px_14px_0_rgba(10,132,255,0.39)] hover:shadow-[0_6px_20px_rgba(10,132,255,0.23)] hover:-translate-y-0.5 transition-all rounded-xl"
        >
          Proceed to Checkout
        </button>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-5 mt-6 mb-1 opacity-80">
          <div className="flex flex-col items-center gap-1.5 group">
             <ShieldCheck className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Secure</span>
          </div>
          <div className="w-px h-6 bg-border/80"></div>
           <div className="flex flex-col items-center gap-1.5 group">
             <UserCheck className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Verified</span>
          </div>
          <div className="w-px h-6 bg-border/80"></div>
           <div className="flex flex-col items-center gap-1.5 group">
             <Truck className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
             <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">Fast</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
