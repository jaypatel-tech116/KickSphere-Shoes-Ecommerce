import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, CheckCircle, Package } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useUserOrders } from '../hooks/useOrders'
import Badge from '../components/ui/Badge'

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

export default function Profile() {
  const { user } = useAuthStore()
  const { data } = useUserOrders()
  const orders = (data?.orders || []).slice(0, 3)

  useEffect(() => { document.title = 'Profile | KickSphere' }, [])

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-[Bebas_Neue] text-4xl text-white tracking-wide mb-8">MY PROFILE</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {/* User Card */}
          <div className="md:col-span-1">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 text-center">
              <div className="w-20 h-20 bg-[#E8000D] rounded-full flex items-center justify-center text-white text-3xl font-bold font-[Barlow] mx-auto mb-4">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <h2 className="font-[Bebas_Neue] text-2xl text-white tracking-wide">{user?.name}</h2>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <Mail size={12} className="text-[#A0A0A0]" />
                <p className="text-[#A0A0A0] font-[Barlow] text-sm">{user?.email}</p>
              </div>
              {user?.isVerified && (
                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <CheckCircle size={14} className="text-green-400" />
                  <span className="text-green-400 font-[Barlow] text-xs font-semibold">Verified Account</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* Recent Orders */}
          <div className="md:col-span-2">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}} className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-[Bebas_Neue] text-xl text-white tracking-wide flex items-center gap-2">
                  <Package size={18} className="text-[#E8000D]" /> RECENT ORDERS
                </h2>
                <Link to="/orders" className="text-[#E8000D] font-[Barlow] text-sm hover:text-[#FF1A1A] transition-colors">View All →</Link>
              </div>
              {orders.length === 0 ? (
                <p className="text-[#A0A0A0] font-[Barlow] text-sm">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-[#0A0A0A] rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-[Barlow] font-semibold text-sm">#{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-[#A0A0A0] font-[Barlow] text-xs">{new Date(order.date || order.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold font-[Barlow]">{formatPrice(order.amount)}</p>
                        <Badge text={order.status || 'Order Placed'} className="mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
