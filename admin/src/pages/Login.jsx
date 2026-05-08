import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAdminAuthStore } from '../stores/adminAuthStore'
import api from '../lib/axios'

export default function Login() {
  const navigate = useNavigate()
  const { setAdmin, isAuthenticated } = useAdminAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { document.title = 'Admin Login | KickSphere' }, [])
  useEffect(() => { if (isAuthenticated) navigate('/') }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/adminlogin', { email, password })
      setAdmin(res.data.admin || { email })
      toast.success('Welcome, Admin!')
      navigate('/')
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('API Error (404): Please refresh your browser (Ctrl+F5)')
      } else {
        toast.error(err.response?.data?.message || 'Invalid credentials')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-10">
          <img src="/logo.png" alt="KickSphere" className="h-14 mx-auto mb-4 object-contain" onError={(e) => { e.target.src = '/Small_Logo.png'; }} />
          <p className="text-[#E8000D] font-[Barlow] text-lg font-bold tracking-[0.2em] mt-2 uppercase">ADMIN PORTAL</p>
        </div>
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="font-[Bebas_Neue] text-3xl text-white tracking-wide mb-6">SIGN IN</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-zinc-400 font-[Barlow] text-sm font-medium mb-2">Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="jaypatel@gmail.com"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-[Barlow] text-sm placeholder-zinc-600 outline-none focus:border-[#E8000D] focus:ring-1 focus:ring-[#E8000D] transition-all" />
            </div>
            <div>
              <label className="block text-zinc-400 font-[Barlow] text-sm font-medium mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3.5 text-white font-[Barlow] text-sm placeholder-zinc-600 outline-none focus:border-[#E8000D] focus:ring-1 focus:ring-[#E8000D] transition-all" />
            </div>
            <motion.button type="submit" whileTap={{ scale: 0.98 }} disabled={loading}
              className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold text-lg tracking-wide py-4 rounded-xl transition-all disabled:opacity-60 mt-4 shadow-lg shadow-[#E8000D]/20">
              {loading ? 'Signing in...' : 'LOGIN TO DASHBOARD'}
            </motion.button>
          </form>
        </div>
        <p className="text-center text-zinc-600 font-[Barlow] text-sm mt-8">© 2025 KickSphere. All rights reserved.</p>
      </motion.div>
    </div>
  )
}
