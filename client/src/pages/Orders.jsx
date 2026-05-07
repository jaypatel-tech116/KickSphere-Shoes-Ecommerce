import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, ChevronDown, Star, RefreshCw } from 'lucide-react'
import { useUserOrders } from '../hooks/useOrders'
import { useNavigate } from 'react-router-dom'
import Badge from '../components/ui/Badge'

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

export default function Orders() {
  const { data, isLoading, refetch, isRefetching } = useUserOrders()
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  useEffect(() => { document.title = 'My Orders | KickSphere' }, [])

  const handleRefresh = async () => {
    await refetch()
  }

  const orders = data?.orders || []

  if (isLoading) return (
    <div className="bg-black min-h-screen max-w-4xl mx-auto px-4 py-8">
      <div className="skeleton h-10 w-48 rounded mb-8" />
      {[1,2,3].map((i) => <div key={i} className="skeleton h-32 rounded-2xl mb-4" />)}
    </div>
  )

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-[Bebas_Neue] text-4xl text-white tracking-wide">MY ORDERS</h1>
          <button
            onClick={handleRefresh}
            disabled={isRefetching}
            className="flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-all text-sm font-[Barlow] border border-[#1F1F1F] px-4 py-2 rounded-xl bg-[#111]"
          >
            <RefreshCw size={14} className={isRefetching ? 'animate-spin text-[#E8000D]' : ''} />
            {isRefetching ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>
        {orders.length === 0 ? (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-center py-20">
            <Package size={80} className="text-[#1F1F1F] mx-auto mb-4" />
            <h2 className="font-[Bebas_Neue] text-4xl text-white tracking-wide mb-2">NO ORDERS YET</h2>
            <p className="text-[#A0A0A0] font-[Barlow]">Your orders will appear here once you make a purchase.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => (
              <motion.div key={order._id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                className="bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
                <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-[#A0A0A0] font-[Barlow] text-xs">Order ID</p>
                    <p className="text-white font-[Barlow] font-semibold text-sm">{order._id?.slice(-10).toUpperCase()}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#A0A0A0] font-[Barlow] text-xs">Date</p>
                    <p className="text-white font-[Barlow] text-sm">{new Date(order.date || order.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#A0A0A0] font-[Barlow] text-xs">Total</p>
                    <p className="text-white font-bold font-[Barlow]">{formatPrice(order.amount)}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#A0A0A0] font-[Barlow] text-xs">Payment</p>
                    <Badge text={order.payment ? 'Paid' : 'Pending'} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[#A0A0A0] font-[Barlow] text-xs">Status</p>
                    <Badge text={order.status || 'Order Placed'} />
                  </div>
                  <button onClick={() => setExpanded(expanded === order._id ? null : order._id)}
                    className="text-[#A0A0A0] hover:text-white transition-colors">
                    <ChevronDown size={20} className={`transition-transform ${expanded === order._id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <AnimatePresence>
                  {expanded === order._id && (
                    <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className="overflow-hidden border-t border-[#1F1F1F]">
                      <div className="p-5 space-y-3">
                        <p className="text-[#A0A0A0] font-[Barlow] text-xs uppercase tracking-wide mb-3">Items</p>
                        {(order.items || []).map((item, j) => (
                          <div key={j} className="flex gap-3 items-center bg-[#0A0A0A] rounded-xl p-3">
                            <div className="w-12 h-12 bg-[#111] rounded-lg overflow-hidden flex-none">
                              <img src={item.image || '/Small_Logo.png'} alt="" className="w-full h-full object-cover"
                                onError={(e) => {e.target.src='/Small_Logo.png'; e.target.className='w-full h-full object-contain p-2 opacity-30'}} />
                            </div>
                            <div className="flex-1">
                              <p className="text-white font-[Barlow] font-semibold text-sm">{item.name}</p>
                              <p className="text-[#A0A0A0] font-[Barlow] text-xs">Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className="text-white font-bold font-[Barlow] text-sm">{formatPrice(item.price)}</span>
                              {order.status === 'Delivered' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/product/${item.productId || item._id}`);
                                  }}
                                  className="flex items-center gap-1 text-[#E8000D] hover:text-[#FF1A1A] text-[10px] font-bold font-[Barlow] uppercase tracking-wider"
                                >
                                  <Star size={10} fill="currentColor" /> Rate Product
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                        {order.address && (
                          <div className="mt-4 p-3 bg-[#0A0A0A] rounded-xl">
                            <p className="text-[#A0A0A0] font-[Barlow] text-xs uppercase tracking-wide mb-1">Delivery Address</p>
                            <p className="text-white font-[Barlow] text-sm">
                              {order.address.firstName} {order.address.lastName} · {order.address.street}, {order.address.city}, {order.address.state} - {order.address.zipcode}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
