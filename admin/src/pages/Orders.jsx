import { useEffect, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronDown, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import Badge from '../components/Badge'
import api from '../lib/axios'

const ORDER_STATUSES = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered', 'Cancelled']
const PAYMENT_METHODS = ['All', 'COD', 'Razorpay']

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

export default function Orders() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('All')
  const [payFilter, setPayFilter] = useState('All')
  const [detailOrder, setDetailOrder] = useState(null)

  useEffect(() => { document.title = 'Orders | KickSphere Admin' }, [])

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['allOrders', statusFilter, payFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'All') params.append('status', statusFilter)
      if (payFilter !== 'All') params.append('paymentmethod', payFilter)
      const url = (statusFilter !== 'All' || payFilter !== 'All')
        ? `/order/orderfilterforadmin?${params.toString()}`
        : '/order/allorders'
      const res = await api.get(url)
      return res.data
    },
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => api.patch('/order/updatestatus', { orderId, status }),
    onSuccess: () => { toast.success('Status updated'); queryClient.invalidateQueries({ queryKey: ['allOrders'] }) },
    onError: (err) => toast.error(err.response?.data?.message || 'Update failed'),
  })

  const orders = data?.orders || []

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="font-[Bebas_Neue] text-3xl sm:text-4xl text-white tracking-wide">ORDERS</h1>
          <p className="text-[#A0A0A0] font-[Barlow] text-sm">{orders.length} orders</p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isRefetching}
          className="flex items-center gap-2 text-[#A0A0A0] hover:text-white transition-all text-xs font-[Barlow] border border-[#1F1F1F] px-4 py-2 rounded-xl bg-[#111] self-start sm:self-auto"
        >
          <RefreshCw size={12} className={isRefetching ? 'animate-spin text-[#E8000D]' : ''} />
          {isRefetching ? 'Refreshing...' : 'Refresh Orders'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 sm:gap-3 mb-5">
        <div className="relative">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#111] border border-[#1F1F1F] text-white font-[Barlow] text-sm px-3 sm:px-4 py-2 rounded-xl outline-none appearance-none pr-7 cursor-pointer focus:border-[#E8000D] transition-colors text-xs sm:text-sm">
            <option value="All">All Status</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A0] pointer-events-none" />
        </div>
        <div className="relative">
          <select value={payFilter} onChange={(e) => setPayFilter(e.target.value)}
            className="bg-[#111] border border-[#1F1F1F] text-white font-[Barlow] text-sm px-3 sm:px-4 py-2 rounded-xl outline-none appearance-none pr-7 cursor-pointer focus:border-[#E8000D] transition-colors text-xs sm:text-sm">
            {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m === 'All' ? 'All Payments' : m}</option>)}
          </select>
          <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A0] pointer-events-none" />
        </div>
        {(statusFilter !== 'All' || payFilter !== 'All') && (
          <button onClick={() => { setStatusFilter('All'); setPayFilter('All') }}
            className="flex items-center gap-1.5 text-[#A0A0A0] hover:text-white border border-[#1F1F1F] hover:border-[#E8000D]/50 px-3 py-2 rounded-xl text-xs font-[Barlow] transition-all">
            <X size={11} /> Clear
          </button>
        )}
      </div>

      {/* Table — hidden on mobile, shown on md+ */}
      <div className="hidden md:block bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        <div className="responsive-table-container">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#1F1F1F]">
                {['Order ID', 'Customer', 'Items', 'Amount', 'Payment', 'Method', 'Status', 'Date', 'Action'].map((h, i) => (
                  <th key={h} className={`text-left px-4 py-3 text-[#A0A0A0] font-[Barlow] text-xs uppercase tracking-wider whitespace-nowrap ${i === 1 ? 'hide-on-tablet' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1F1F1F]/50">
                  {Array.from({ length: 9 }).map((_, j) => (
                    <td key={j} className={`px-4 py-3 ${j === 1 ? 'hide-on-tablet' : ''}`}><div className="skeleton h-4 rounded" /></td>
                  ))}
                </tr>
              )) : orders.length === 0 ? (
                <tr><td colSpan={9} className="text-center py-10 text-[#A0A0A0] font-[Barlow] text-sm">No orders found</td></tr>
              ) : orders.map((order) => (
                <tr key={order._id} className="border-b border-[#1F1F1F]/50 hover:bg-[#1F1F1F]/30 transition-colors">
                  <td className="px-4 py-3 text-white font-[Barlow] text-sm font-semibold whitespace-nowrap">#{order._id?.slice(-8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-[Barlow] text-sm hide-on-tablet max-w-[120px]">
                    <span className="truncate block">{order.address?.firstName ? `${order.address.firstName} ${order.address.lastName}` : (order.userId?.slice(-8) || 'Guest')}</span>
                  </td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-[Barlow] text-sm">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 text-white font-[Barlow] text-sm font-semibold whitespace-nowrap">{formatPrice(order.amount)}</td>
                  <td className="px-4 py-3"><Badge text={order.payment ? 'Paid' : 'Pending'} /></td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-[Barlow] text-sm whitespace-nowrap">{order.paymentmethod || 'COD'}</td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <select
                        value={order.status || 'Order Placed'}
                        onChange={(e) => updateStatusMutation.mutate({ orderId: order._id, status: e.target.value })}
                        className="bg-[#0A0A0A] border border-[#1F1F1F] text-white font-[Barlow] text-xs px-2 py-1.5 rounded-lg outline-none appearance-none cursor-pointer hover:border-[#E8000D]/50 transition-colors pr-6 max-w-[130px]"
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#A0A0A0] pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#A0A0A0] font-[Barlow] text-sm whitespace-nowrap">{new Date(order.date || order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setDetailOrder(order)} className="text-[#A0A0A0] hover:text-white text-xs font-[Barlow] underline transition-colors whitespace-nowrap">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {isLoading ? Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-28 rounded-2xl" />
        )) : orders.length === 0 ? (
          <div className="text-center py-10 text-[#A0A0A0] font-[Barlow] text-sm">No orders found</div>
        ) : orders.map((order) => (
          <motion.div key={order._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-white font-[Barlow] font-semibold text-sm">#{order._id?.slice(-10).toUpperCase()}</p>
                <p className="text-[#A0A0A0] font-[Barlow] text-xs mt-0.5">
                  {order.address?.firstName ? `${order.address.firstName} ${order.address.lastName}` : 'Guest'}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-[Barlow] font-bold text-sm">{formatPrice(order.amount)}</p>
                <p className="text-[#A0A0A0] font-[Barlow] text-xs">{new Date(order.date || order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge text={order.payment ? 'Paid' : 'Pending'} />
              <span className="text-[#A0A0A0] font-[Barlow] text-xs">{order.paymentmethod || 'COD'}</span>
              <span className="text-[#A0A0A0] font-[Barlow] text-xs">{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}</span>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-[#1F1F1F]">
              <div className="relative flex-1">
                <select
                  value={order.status || 'Order Placed'}
                  onChange={(e) => updateStatusMutation.mutate({ orderId: order._id, status: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white font-[Barlow] text-xs px-2 py-2 rounded-lg outline-none appearance-none cursor-pointer hover:border-[#E8000D]/50 transition-colors pr-6"
                >
                  {ORDER_STATUSES.map((s) => <option key={s} value={s} className="bg-[#111]">{s}</option>)}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A0] pointer-events-none" />
              </div>
              <button onClick={() => setDetailOrder(order)} className="flex-shrink-0 text-[#A0A0A0] hover:text-white text-xs font-[Barlow] border border-[#1F1F1F] hover:border-[#E8000D]/50 px-3 py-2 rounded-lg transition-all">View</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {detailOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailOrder(null)} className="fixed inset-0 bg-black/80 z-40" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-3 sm:inset-4 md:inset-x-1/4 md:top-16 md:bottom-16 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl z-50 overflow-y-auto"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-[Bebas_Neue] text-xl sm:text-2xl text-white tracking-wide">ORDER DETAILS</h2>
                  <button onClick={() => setDetailOrder(null)} className="text-[#A0A0A0] hover:text-white transition-colors p-1"><X size={20} /></button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 p-4 bg-[#111] rounded-xl">
                    {[
                      ['Order ID', `#${detailOrder._id?.slice(-10).toUpperCase()}`],
                      ['Amount', formatPrice(detailOrder.amount)],
                      ['Payment', detailOrder.payment ? 'Paid' : 'Pending'],
                      ['Method', detailOrder.paymentmethod || 'COD'],
                      ['Status', detailOrder.status || 'Order Placed'],
                      ['Date', new Date(detailOrder.date || detailOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[#A0A0A0] font-[Barlow] text-xs">{label}</p>
                        <p className="text-white font-[Barlow] font-semibold text-sm break-words">{value}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="font-[Bebas_Neue] text-white text-lg tracking-wide mb-3">ITEMS</p>
                    <div className="space-y-2">
                      {(detailOrder.items || []).map((item, i) => (
                        <div key={i} className="flex gap-3 items-center bg-[#111] rounded-xl p-3">
                          <div className="w-11 h-11 bg-[#0A0A0A] rounded-lg overflow-hidden flex-none">
                            <img src={item.image || '/Small_Logo.png'} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/Small_Logo.png'; e.target.className = 'w-full h-full object-contain p-2 opacity-30' }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-[Barlow] font-semibold text-sm truncate">{item.name}</p>
                            <p className="text-[#A0A0A0] font-[Barlow] text-xs">Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                          </div>
                          <span className="text-white font-bold font-[Barlow] text-sm flex-shrink-0">{formatPrice(item.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {detailOrder.address && (
                    <div>
                      <p className="font-[Bebas_Neue] text-white text-lg tracking-wide mb-3">SHIPPING ADDRESS</p>
                      <div className="bg-[#111] rounded-xl p-4 text-[#A0A0A0] font-[Barlow] text-sm space-y-1">
                        <p className="text-white font-semibold">{detailOrder.address.firstName} {detailOrder.address.lastName}</p>
                        <p>{detailOrder.address.street}</p>
                        <p>{detailOrder.address.city}, {detailOrder.address.state} - {detailOrder.address.zipcode}</p>
                        <p>{detailOrder.address.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
