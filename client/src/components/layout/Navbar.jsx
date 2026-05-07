import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, Package } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { useCartStore } from '../../stores/cartStore'
import api from '../../lib/axios'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/collection', label: 'Collection' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, clearUser } = useAuthStore()
  const count = useCartStore((s) => s.count)
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const handleLogout = async () => {
    try {
      await api.get('/auth/logout')
      clearUser()
      toast.success('Logged out successfully')
      navigate('/')
    } catch {
      clearUser()
      navigate('/')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="KickSphere" className="h-auto w-42" onError={(e) => { e.target.style.display = 'none' }} />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-[Barlow] font-medium text-sm transition-colors ${location.pathname === link.to ? 'text-[#E8000D]' : 'text-[#A0A0A0] hover:text-white'}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button onClick={() => setSearchOpen(!searchOpen)} className="text-[#A0A0A0] hover:text-white transition-colors p-1.5">
                <Search size={20} />
              </button>
              <Link to="/wishlist" className="hidden xs:block text-[#A0A0A0] hover:text-white transition-colors p-1.5">
                <Heart size={20} />
              </Link>
              <Link to="/cart" className="relative text-[#A0A0A0] hover:text-white transition-colors p-1.5">
                <ShoppingCart size={20} />
                {count > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#E8000D] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-8 h-8 bg-[#E8000D] rounded-full flex items-center justify-center text-white font-bold text-sm font-[Barlow]"
                  >
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-48 bg-[#111] border border-[#1F1F1F] rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-[#1F1F1F]">
                          <p className="text-white text-sm font-semibold font-[Barlow]">{user?.name}</p>
                          <p className="text-[#A0A0A0] text-xs font-[Barlow] truncate">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[#A0A0A0] hover:text-white hover:bg-[#1F1F1F] transition-colors text-sm font-[Barlow]">
                          <User size={14} /> Profile
                        </Link>
                        <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-[#A0A0A0] hover:text-white hover:bg-[#1F1F1F] transition-colors text-sm font-[Barlow]">
                          <Package size={14} /> My Orders
                        </Link>
                        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2.5 text-[#A0A0A0] hover:text-red-400 hover:bg-[#1F1F1F] transition-colors text-sm font-[Barlow]">
                          <LogOut size={14} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/auth" className="hidden sm:block bg-[#E8000D] hover:bg-[#FF1A1A] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors font-[Barlow]">
                  Login
                </Link>
              )}

              <button className="md:hidden text-[#A0A0A0] hover:text-white transition-colors p-1" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-[#1F1F1F] bg-[#0A0A0A] overflow-hidden"
            >
              <form onSubmit={handleSearch} className="max-w-7xl mx-auto px-4 py-3 flex gap-2">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shoes, brands..."
                  className="flex-1 bg-[#111] border border-[#1F1F1F] rounded-lg px-4 py-2 text-white text-sm font-[Barlow] placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors"
                />
                <button type="submit" className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white px-4 py-2 rounded-lg text-sm font-[Barlow] transition-colors">
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-[#1F1F1F] bg-[#0A0A0A] overflow-hidden"
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block text-[#A0A0A0] hover:text-white font-[Barlow] font-medium py-1 transition-colors">
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="block text-[#A0A0A0] hover:text-white font-[Barlow] font-medium py-1">Profile</Link>
                    <Link to="/orders" className="block text-[#A0A0A0] hover:text-white font-[Barlow] font-medium py-1">My Orders</Link>
                    <button onClick={handleLogout} className="block w-full text-left text-red-400 font-[Barlow] font-medium py-1">Logout</button>
                  </>
                ) : (
                  <Link to="/auth" className="block bg-[#E8000D] text-white text-center py-2 rounded-lg font-[Barlow] font-semibold">Login / Register</Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16" />
    </>
  )
}
