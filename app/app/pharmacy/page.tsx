'use client'

import { useState, useEffect } from 'react'
import { Pill, Search, AlertCircle, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { MedicineCart } from '@/components/medicine-cart'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { motion, AnimatePresence } from 'framer-motion'

interface Medicine {
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  imageUrl: string
}

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

// Ensure window is defined (checking for SSR) before using localStorage
const getInitialCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('smarthealthcare_cart') || '[]')
  }
  return []
}

function ProductImage({ src, alt, category }: { src: string, alt: string, category: string }) {
  const [error, setError] = useState(false)
  return (
    <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden flex items-center justify-center border-b">
      {!error ? (
        <img 
          src={src} 
          alt={alt} 
          onError={() => setError(true)}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 opacity-100"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-500 w-full h-full">
          <Pill className="w-12 h-12 mb-2" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Image Unavailable</span>
        </div>
      )}
      <div className="absolute top-3 right-3 z-10">
        <span className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
          {category}
        </span>
      </div>
    </div>
  )
}

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([])
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>(getInitialCart())
  const [loading, setLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)

  const categories = [
    'all',
    'Cold & Flu',
    'Pain Relief',
    'Antibiotics',
    'Vitamins',
    'Digestive Health',
  ]

  // Mock medicines data
  const mockMedicines: Medicine[] = [
    {
      id: '1',
      name: 'Aspirin 500mg',
      description: 'Pain reliever and fever reducer',
      price: 45,
      stock: 50,
      category: 'Pain Relief',
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5e16d4182?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '2',
      name: 'Cough Syrup 200ml',
      description: 'Effective cough suppressant',
      price: 120,
      stock: 30,
      category: 'Cold & Flu',
      imageUrl: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '3',
      name: 'Vitamin C 1000mg',
      description: 'Immune system booster supplements',
      price: 150,
      stock: 100,
      category: 'Vitamins',
      imageUrl: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '4',
      name: 'Antibacterial Cream 30g',
      description: 'For minor cuts and surface wounds',
      price: 200,
      stock: 45,
      category: 'Antibiotics',
      imageUrl: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '5',
      name: 'Digestive Tablets',
      description: 'Fast-acting antacid and gas relief',
      price: 80,
      stock: 60,
      category: 'Digestive Health',
      imageUrl: 'https://images.unsplash.com/photo-1550572017-edb3dfdfbeaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '6',
      name: 'Cold & Flu Capsules',
      description: 'All-in-one multi-symptom cold medicine',
      price: 95,
      stock: 75,
      category: 'Cold & Flu',
      imageUrl: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '7',
      name: 'Ibuprofen 400mg',
      description: 'Strong Anti-inflammatory pain relief',
      price: 55,
      stock: 80,
      category: 'Pain Relief',
      imageUrl: 'https://images.unsplash.com/photo-1583324113626-70df0f4deaab?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '8',
      name: 'Multivitamin Tablets',
      description: 'Comprehensive daily supplement for wellness',
      price: 180,
      stock: 90,
      category: 'Vitamins',
      imageUrl: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'
    },
  ]

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch('/api/pharmacy/medicines')
        if (!res.ok) throw new Error('Failed to fetch medicines')
        const data = await res.json()
        setMedicines(data)
        setFilteredMedicines(data)
      } catch (error: any) {
        toast.error('Error', {
          description: 'Failed to load medicines catalogue'
        })
        // Fallback to mock data if API fails
        setMedicines(mockMedicines)
        setFilteredMedicines(mockMedicines)
      } finally {
        setLoading(false)
      }
    }
    fetchMedicines()
  }, [])

  useEffect(() => {
    let filtered = medicines

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((m) => m.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredMedicines(filtered)
  }, [searchTerm, selectedCategory, medicines])

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('smarthealthcare_cart', JSON.stringify(cart))
    }
  }, [cart, loading])

  const addToCart = (medicine: Medicine) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === medicine.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { id: medicine.id, name: medicine.name, price: medicine.price, quantity: 1 }]
    })
    toast.success("Added to Cart", {
      description: `${medicine.name} was added to your order.`
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)).filter((item) => item.quantity > 0)
    )
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
    toast.info("Removed from Cart")
  }

  const handleCheckout = async () => {
    console.log('Checkout initiated...', cart)
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    try {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      const deliveryFee = subtotal > 500 ? 0 : 50
      const total = subtotal + deliveryFee

      console.log('Sending checkout request...', { items: cart, total })
      
      const res = await fetch('/api/pharmacy/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total })
      })

      const data = await res.json()
      console.log('Checkout response:', data)

      if (!res.ok) {
        throw new Error(data.error || 'Checkout failed')
      }

      setCart([])
      toast.success('Order Placed Successfully!', {
        description: 'Your medicines are on the way. You can track your order in your profile.',
        duration: 5000
      })
      setIsCartOpen(false)
    } catch (error: any) {
      console.error('Checkout error:', error)
      toast.error('Order Failed', {
        description: error.message
      })
    }
  }

  const totalItemsInCart = cart.length

  // Filter animations setup
  const layoutTransition = { type: 'spring' as const, stiffness: 300, damping: 24 }

  return (
    <div className="space-y-6 md:space-y-8 relative pb-20">
      {/* Header and Floating Cart Trigger */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl">
              <Pill className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Online Pharmacy</h1>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-2xl">Browse and order medicines with fast delivery straight to your door. Genuine medicines guaranteed.</p>
        </div>
        
        {/* Slide-out Cart using Sheet */}
        <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
          <SheetTrigger asChild>
            <Button size="lg" className="fixed bottom-8 right-8 z-40 rounded-full h-16 px-6 shadow-2xl hover:shadow-[0_0_20px_rgba(10,132,255,0.4)] transition-all md:relative md:bottom-auto md:right-auto md:h-12 md:px-5 group">
              <ShoppingCart className="w-5 h-5 mr-0 md:mr-2 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline font-bold">Your Cart</span>
              {totalItemsInCart > 0 && (
                <span className="absolute -top-2 -right-2 md:static md:ml-3 bg-white text-primary text-xs font-black min-w-[24px] h-6 flex items-center justify-center rounded-full shadow-md border-2 border-primary">
                  {totalItemsInCart}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col border-l-0 shadow-2xl">
            <SheetHeader className="p-6 border-b bg-muted/10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-full">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <SheetTitle className="text-2xl font-bold tracking-tight">Your Order</SheetTitle>
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-hidden">
               <MedicineCart
                  items={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeFromCart}
                  onCheckout={handleCheckout}
                />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="space-y-8">
        
        {/* Smart Search & Filter */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border-zinc-200 dark:border-zinc-800 space-y-6"
        >
          <div className="space-y-5">
            {/* Search Bar */}
            <div className="relative group">
              <div className={`absolute -inset-0.5 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500 ${searchTerm ? 'bg-primary opacity-50' : 'bg-primary/50'}`}></div>
              <div className="relative flex items-center bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm focus-within:ring-4 focus-within:ring-primary/20 transition-all">
                <Search className={`absolute left-4 w-5 h-5 transition-colors ${searchTerm ? 'text-primary' : 'text-zinc-500'}`} />
                <input
                  type="text"
                  placeholder="Search medicines, symptoms, or brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-transparent text-zinc-900 dark:text-zinc-50 font-bold placeholder-zinc-500 focus:outline-none"
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4 text-xs font-semibold text-muted-foreground hover:text-foreground">
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border ${
                      isActive
                        ? 'bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(10,132,255,0.3)] ring-2 ring-primary/20 scale-105'
                        : 'bg-muted/30 hover:bg-muted text-muted-foreground border-transparent hover:border-border'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                )
              })}
            </div>
            
            {/* Search Context */}
            <AnimatePresence>
              {(searchTerm || selectedCategory !== 'all') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="pt-2 text-sm text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  Showing {filteredMedicines.length} results
                  {searchTerm && <> for <span className="text-zinc-900 dark:text-zinc-50 font-black">"{searchTerm}"</span></>} 
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="text-center py-32 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-6"></div>
            <p className="text-muted-foreground font-semibold text-lg">Loading pharmacy catalogue...</p>
          </div>
        ) : filteredMedicines.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 px-4 border-2 border-dashed rounded-3xl bg-muted/10 max-w-2xl mx-auto"
          >
            <AlertCircle className="w-16 h-16 text-muted-foreground/40 mx-auto mb-5" />
            <p className="text-foreground font-bold text-2xl mb-2">No medicines found</p>
            <p className="text-muted-foreground mb-6">We couldn't find any match for your current search or category filter.</p>
            <Button onClick={() => {setSearchTerm(''); setSelectedCategory('all')}} size="lg" className="rounded-xl font-bold">
              Clear all filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
            <AnimatePresence>
              {filteredMedicines.map((medicine, index) => (
                <motion.div 
                  key={medicine.id} 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="overflow-hidden border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl group flex flex-col h-full bg-white dark:bg-zinc-900 shadow-lg hover:border-primary/50 transition-all duration-300"
                >
                  <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-950 overflow-hidden flex items-center justify-center border-b border-zinc-200 dark:border-zinc-800">
                    <ProductImage src={medicine.imageUrl} alt={medicine.name} category={medicine.category} />
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-black text-zinc-950 dark:text-white mb-2 group-hover:text-primary transition-colors">{medicine.name}</h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 line-clamp-2 min-h-[40px] font-medium leading-relaxed">{medicine.description}</p>

                    <div className="mt-auto flex flex-col gap-4">
                      <div>
                        <p className="text-3xl font-black text-zinc-950 dark:text-zinc-50 tabular-nums tracking-tighter">₹{medicine.price}</p>
                        <p className={`text-[11px] font-black mt-1 uppercase tracking-widest ${medicine.stock > 10 ? 'text-emerald-600' : 'text-orange-500'}`}>
                          {medicine.stock > 0 ? `${medicine.stock} IN STOCK` : 'OUT OF STOCK'}
                        </p>
                      </div>

                      <Button
                        onClick={() => addToCart(medicine)}
                        disabled={medicine.stock === 0}
                        className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-primary dark:hover:bg-primary transition-colors font-black rounded-xl h-11"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        ADD TO CART
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
