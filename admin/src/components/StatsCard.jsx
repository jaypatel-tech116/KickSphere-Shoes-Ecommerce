import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatsCard({ label, value, icon, trend, color = '#E8000D', loading = false }) {
  if (loading) return (
    <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5">
      <div className="skeleton h-4 w-24 rounded mb-4" />
      <div className="skeleton h-10 w-32 rounded" />
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5 hover:border-[#E8000D]/30 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[#A0A0A0] font-[Barlow] text-sm">{label}</p>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
          <span style={{ color }}>{icon}</span>
        </div>
      </div>
      <p className="font-[Bebas_Neue] text-4xl text-white tracking-wide">{value}</p>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-[Barlow] font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}% vs last month
        </div>
      )}
    </motion.div>
  )
}
