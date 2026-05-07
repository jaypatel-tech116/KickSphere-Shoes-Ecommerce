import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Package, ShoppingBag, DollarSign, Clock } from 'lucide-react'
import StatsCard from '../components/StatsCard'
import Badge from '../components/Badge'
import api from '../lib/axios'

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

const PIE_COLORS = {
  'Order Placed': '#3B82F6',
  'Packing': '#A855F7',
  'Shipped': '#EAB308',
  'Out for delivery': '#F97316',
  'Delivered': '#22C55E',
  'Cancelled': '#E8000D'
}

export default function Dashboard() {
  useEffect(() => { document.title = 'Dashboard | KickSphere Admin' }, [])

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['allOrders'],
    queryFn: async () => { const res = await api.get('/order/allorders'); return res.data },
  })

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['adminProducts'],
    queryFn: async () => { const res = await api.get('/product/listproduct'); return res.data },
  })

  const orders = ordersData?.orders || []
  const products = productsData?.products || []

  const paidOrders = orders.filter((o) => o.payment)
  const totalRevenue = paidOrders.reduce((acc, o) => acc + (o.amount || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'Order Placed').length

  // Revenue by day (last 14)
  const last30 = orders.filter((o) => {
    const d = new Date(o.date || o.createdAt)
    return Date.now() - d.getTime() < 30 * 24 * 3600 * 1000
  })
  const revenueByDay = {}
  last30.forEach((o) => {
    const day = new Date(o.date || o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
    revenueByDay[day] = (revenueByDay[day] || 0) + (o.amount || 0)
  })
  const revenueChart = Object.entries(revenueByDay).slice(-14).map(([date, revenue]) => ({ date, revenue }))

  // Status distribution
  const statusMap = {}
  orders.forEach((o) => { const s = o.status || 'Order Placed'; statusMap[s] = (statusMap[s] || 0) + 1 })
  const statusChart = Object.entries(statusMap).map(([name, value]) => ({ name, value }))

  // Recent 5 orders
  const recentOrders = [...orders].slice(0, 5)

  const customTooltipStyle = {
    backgroundColor: '#111', border: '1px solid #1F1F1F',
    borderRadius: '8px', color: '#fff',
    fontFamily: 'Barlow, sans-serif', fontSize: '12px'
  }

  return (
    <div className="admin-page-container space-y-5">
      <div>
        <h1 className="font-[Bebas_Neue] text-3xl sm:text-4xl text-white tracking-wide">DASHBOARD</h1>
        <p className="text-[#A0A0A0] font-[Barlow] text-sm mt-0.5">Welcome back, Admin</p>
      </div>

      {/* Stats Grid — 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatsCard label="Total Products" value={products.length} icon={<Package size={18} />} loading={productsLoading} />
        <StatsCard label="Total Orders" value={orders.length} icon={<ShoppingBag size={18} />} color="#3B82F6" loading={ordersLoading} />
        <StatsCard label="Total Revenue" value={formatPrice(totalRevenue)} icon={<DollarSign size={18} />} color="#22C55E" loading={ordersLoading} />
        <StatsCard label="Pending Orders" value={pendingOrders} icon={<Clock size={18} />} color="#EAB308" loading={ordersLoading} />
      </div>

      {/* Charts — stack on mobile, side-by-side on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Revenue Line Chart */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 sm:p-5">
          <h2 className="font-[Bebas_Neue] text-lg sm:text-xl text-white tracking-wide mb-3 sm:mb-4">REVENUE (LAST 14 DAYS)</h2>
          {revenueChart.length === 0 ? (
            <div className="h-40 sm:h-48 flex items-center justify-center text-[#A0A0A0] font-[Barlow] text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={revenueChart} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F1F1F" />
                <XAxis dataKey="date" stroke="#A0A0A0" tick={{ fontSize: 10, fontFamily: 'Barlow' }} interval="preserveStartEnd" />
                <YAxis stroke="#A0A0A0" tick={{ fontSize: 10, fontFamily: 'Barlow' }} tickFormatter={(v) => `₹${v}`} width={55} />
                <Tooltip contentStyle={customTooltipStyle} formatter={(v) => [formatPrice(v), 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#E8000D" strokeWidth={2} dot={{ fill: '#E8000D', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie Chart */}
        <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-4 sm:p-5">
          <h2 className="font-[Bebas_Neue] text-lg sm:text-xl text-white tracking-wide mb-3 sm:mb-4">ORDER STATUS</h2>
          {statusChart.length === 0 ? (
            <div className="h-40 sm:h-48 flex items-center justify-center text-[#A0A0A0] font-[Barlow] text-sm">No data yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={statusChart} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={60}>
                  {statusChart.map((entry) => (
                    <Cell key={entry.name} fill={PIE_COLORS[entry.name] || '#A0A0A0'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend wrapperStyle={{ fontFamily: 'Barlow', fontSize: '10px', color: '#A0A0A0' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-[#1F1F1F]">
          <h2 className="font-[Bebas_Neue] text-lg sm:text-xl text-white tracking-wide">RECENT ORDERS</h2>
        </div>
        <div className="responsive-table-container">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-[#1F1F1F]">
                {['Order ID', 'Items', 'Amount', 'Payment', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 sm:px-5 py-3 text-[#A0A0A0] font-[Barlow] text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-[#1F1F1F]/50">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 sm:px-5 py-3"><div className="skeleton h-4 rounded w-full" /></td>
                  ))}
                </tr>
              )) : recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-[#A0A0A0] font-[Barlow] text-sm">No orders yet</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order._id} className="border-b border-[#1F1F1F]/50 hover:bg-[#1F1F1F]/30 transition-colors">
                  <td className="px-4 sm:px-5 py-3 text-white font-[Barlow] text-sm font-semibold whitespace-nowrap">#{order._id?.slice(-8).toUpperCase()}</td>
                  <td className="px-4 sm:px-5 py-3 text-[#A0A0A0] font-[Barlow] text-sm">{order.items?.length || 0}</td>
                  <td className="px-4 sm:px-5 py-3 text-white font-[Barlow] text-sm font-semibold whitespace-nowrap">{formatPrice(order.amount)}</td>
                  <td className="px-4 sm:px-5 py-3"><Badge text={order.payment ? 'Paid' : 'Pending'} /></td>
                  <td className="px-4 sm:px-5 py-3"><Badge text={order.status || 'Order Placed'} /></td>
                  <td className="px-4 sm:px-5 py-3 text-[#A0A0A0] font-[Barlow] text-sm whitespace-nowrap">{new Date(order.date || order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
