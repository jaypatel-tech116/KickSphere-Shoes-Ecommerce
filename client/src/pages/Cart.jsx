import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCartStore } from '../stores/cartStore'
import { useCart } from '../hooks/useCart'

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

export default function Cart() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const { updateCartMutation } = useCart()

  useEffect(() => { document.title = 'Cart | KickSphere' }, [])

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0) * item.quantity, 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const total = subtotal + shipping

  const handleQty = (item, newQty) => {
    updateCartMutation.mutate({ itemId: item.itemId, size: item.size, color: item.color, quantity: newQty })
  }

  if (items.length === 0) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
        <ShoppingBag size={80} className="text-[#1F1F1F] mx-auto mb-6" />
        <h2 className="font-[Bebas_Neue] text-5xl text-white tracking-wide mb-3">YOUR CART IS EMPTY</h2>
        <p className="text-[#A0A0A0] font-[Barlow] mb-8">Looks like you haven't added any kicks yet.</p>
        <Link to="/collection" className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold px-8 py-4 rounded-xl transition-colors inline-flex items-center gap-2">
          <ShoppingBag size={18} /> Start Shopping
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-[Bebas_Neue] text-4xl text-white tracking-wide mb-8">SHOPPING CART</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, idx) => (
                <motion.div
                  key={`${item.itemId}-${item.size}-${item.color}-${idx}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 flex gap-4"
                >
                  <div className="w-24 h-24 bg-[#0A0A0A] rounded-xl overflow-hidden flex-none">
                    <img
                      src={item.image || '/Small_Logo.png'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/Small_Logo.png'; e.target.className = 'w-full h-full object-contain p-4 opacity-30' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-[Barlow] font-semibold text-sm line-clamp-2">{item.name || 'Product'}</p>
                        <p className="text-[#A0A0A0] font-[Barlow] text-xs mt-0.5">
                          Size: {item.size} · Color: <span className="capitalize">{item.color}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleQty(item, 0)}
                        className="text-[#A0A0A0] hover:text-[#E8000D] transition-colors ml-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#1F1F1F] rounded-lg overflow-hidden">
                        <button onClick={() => handleQty(item, item.quantity - 1)} className="px-2.5 py-1.5 text-white hover:bg-[#1F1F1F] transition-colors">
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-1.5 text-white font-[Barlow] text-sm border-x border-[#1F1F1F]">{item.quantity}</span>
                        <button onClick={() => handleQty(item, item.quantity + 1)} className="px-2.5 py-1.5 text-white hover:bg-[#1F1F1F] transition-colors">
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-white font-bold font-[Barlow]">
                        {formatPrice((item.price || 0) * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 sticky top-24">
              <h2 className="font-[Bebas_Neue] text-2xl text-white tracking-wide mb-5">ORDER SUMMARY</h2>
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-[#A0A0A0] font-[Barlow] text-sm">
                  <span>Subtotal ({items.reduce((a,i) => a+i.quantity,0)} items)</span>
                  <span className="text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#A0A0A0] font-[Barlow] text-sm">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'text-green-400 font-semibold' : 'text-white'}>
                    {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-[#A0A0A0] font-[Barlow]">Add {formatPrice(999 - subtotal)} more for free shipping</p>
                )}
                <div className="border-t border-[#1F1F1F] pt-3 flex justify-between font-bold">
                  <span className="text-white font-[Barlow]">Total</span>
                  <span className="text-white font-[Barlow] text-xl">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Coupon code"
                  className="flex-1 bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg px-3 py-2 text-white font-[Barlow] text-sm placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors"
                />
                <button className="border border-[#1F1F1F] hover:border-[#E8000D] text-[#A0A0A0] hover:text-white font-[Barlow] text-sm px-4 py-2 rounded-lg transition-all">Apply</button>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/checkout')}
                className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-4 rounded-xl transition-colors glow-red-sm"
              >
                Proceed to Checkout
              </motion.button>
              <Link to="/collection" className="block text-center text-[#A0A0A0] hover:text-white font-[Barlow] text-sm mt-3 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
