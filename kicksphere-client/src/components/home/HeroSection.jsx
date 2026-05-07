import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Zap } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-black">
      {/* Abstract bg elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] opacity-10 blur-3xl rounded-full bg-[#E8000D]" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] opacity-5 blur-2xl rounded-full bg-[#E8000D]" />
        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(232,0,13,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(232,0,13,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={16} className="text-[#E8000D] fill-[#E8000D]" />
              <span className="text-[#E8000D] text-sm font-semibold font-[Barlow] uppercase tracking-widest">New Season 2025</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-[Bebas_Neue] text-7xl sm:text-8xl lg:text-9xl text-white leading-none tracking-tight"
          >
            BUILT TO<br />
            <span className="relative inline-block">
              MOVE.
              <motion.span
                className="absolute -bottom-2 left-0 h-1.5 bg-[#E8000D] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 0.8 }}
              />
            </span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-[Bebas_Neue] text-7xl sm:text-8xl lg:text-9xl text-[#E8000D] leading-none tracking-tight mt-2"
          >
            MADE TO<br />LAST.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-[#A0A0A0] font-[Barlow] text-lg mt-6 max-w-md leading-relaxed"
          >
            Premium footwear for those who refuse to slow down. Authentic brands. Uncompromising quality.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4 mt-8"
          >
            <Link
              to="/collection"
              className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold px-8 py-4 rounded-xl text-base transition-all duration-200 flex items-center gap-2 glow-red-sm"
            >
              Shop Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/collection"
              className="border border-white/20 hover:border-[#E8000D] text-white hover:text-[#E8000D] font-[Barlow] font-semibold px-8 py-4 rounded-xl text-base transition-all duration-200"
            >
              Explore Collection
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="flex gap-8 mt-12 pt-8 border-t border-[#1F1F1F]"
          >
            {[
              { val: '100%', label: 'Authentic' },
              { val: 'Premium', label: 'Quality' },
              { val: 'Fast', label: 'Shipping' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-[Bebas_Neue] text-3xl text-[#E8000D]">{s.val}</p>
                <p className="font-[Barlow] text-[#A0A0A0] text-sm">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 60 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, type: 'spring', stiffness: 80 }}
          className="relative hidden lg:flex items-center justify-center"
        >
          {/* Big red circle BG */}
          <div className="absolute w-[450px] h-[450px] rounded-full border border-[#E8000D]/20" />
          <div className="absolute w-[380px] h-[380px] rounded-full bg-[#E8000D]/5 blur-xl" />

          {/* Floating shoe placeholder graphic */}
          <motion.div
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10 w-80 h-80 flex items-center justify-center"
          >
            <div className="relative">
              <img src="/Small_Logo.png" alt="KickSphere" className="w-64 h-64 object-contain opacity-80 drop-shadow-2xl" onError={(e) => e.target.style.display = 'none'} />
              {/* Red glow under */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-8 bg-[#E8000D]/30 blur-2xl rounded-full" />
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div
            animate={{ x: [-5, 5, -5], y: [-3, 3, -3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-10 left-0 glass rounded-xl px-3 py-2"
          >
            <p className="font-[Bebas_Neue] text-lg text-[#E8000D]">FREE SHIPPING</p>
            <p className="font-[Barlow] text-xs text-[#A0A0A0]">On orders above ₹999</p>
          </motion.div>

          <motion.div
            animate={{ x: [5, -5, 5], y: [3, -3, 3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-10 right-0 glass rounded-xl px-3 py-2"
          >
            <p className="font-[Bebas_Neue] text-lg text-white">EASY RETURNS</p>
            <p className="font-[Barlow] text-xs text-[#A0A0A0]">30-day return policy</p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  )
}
