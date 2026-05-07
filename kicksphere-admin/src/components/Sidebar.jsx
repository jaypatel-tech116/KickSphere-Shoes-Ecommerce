import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Package, ShoppingBag, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAdminAuthStore } from '../stores/adminAuthStore'
import api from '../lib/axios'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/products', icon: <Package size={18} />, label: 'Products' },
  { to: '/orders', icon: <ShoppingBag size={18} />, label: 'Orders' },
]

function NavContent({ onClose }) {
  const navigate = useNavigate()
  const { clearAdmin, admin } = useAdminAuthStore()

  const handleLogout = async () => {
    try { await api.get('/auth/logout') } catch {}
    clearAdmin()
    toast.success('Logged out')
    navigate('/login')
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-[#1F1F1F] flex-shrink-0">
        <img src="/logo.png" alt="KickSphere" className="h-7 w-auto" onError={(e) => e.target.style.display='none'} />
        <div>
          <p className="font-[Bebas_Neue] text-white text-lg tracking-widest leading-none">KICKSPHERE</p>
          <p className="font-[Barlow] text-[#E8000D] text-xs font-semibold">ADMIN</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-[Barlow] font-medium text-sm ${
                  isActive
                    ? 'bg-[#E8000D]/10 text-[#E8000D] border border-[#E8000D]/20'
                    : 'text-[#A0A0A0] hover:text-white hover:bg-[#1F1F1F]'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-[#1F1F1F] flex-shrink-0">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 bg-[#E8000D] rounded-full flex items-center justify-center text-white text-sm font-bold font-[Barlow] flex-shrink-0">A</div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-[Barlow] text-sm font-semibold truncate">Admin</p>
            <p className="text-[#A0A0A0] font-[Barlow] text-xs truncate">{admin?.email || 'admin@kicksphere.com'}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#A0A0A0] hover:text-red-400 hover:bg-[#1F1F1F] transition-all font-[Barlow] font-medium text-sm">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 flex-none bg-[#0A0A0A] border-r border-[#1F1F1F] h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile top header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0A0A0A] border-b border-[#1F1F1F] sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src="/Small_Logo.png" alt="" className="h-7 w-7 object-contain" onError={(e) => e.target.style.display='none'} />
          <span className="font-[Bebas_Neue] text-white text-xl tracking-widest">KICKSPHERE</span>
          <span className="font-[Barlow] text-[#E8000D] text-xs font-bold">ADMIN</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-9 h-9 flex items-center justify-center text-[#A0A0A0] hover:text-white transition-colors bg-[#111] rounded-lg border border-[#1F1F1F]"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/70 z-40"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 bottom-0 w-64 bg-[#0A0A0A] border-r border-[#1F1F1F] z-50"
            >
              <NavContent onClose={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
