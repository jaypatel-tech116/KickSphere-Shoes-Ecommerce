import { motion } from 'framer-motion'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Sparkles } from 'lucide-react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('🎉 You\'re in! Check your inbox for 10% off.')
    setEmail('')
  }

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-[#E8000D] to-[#8B0000] rounded-3xl p-10 md:p-16 overflow-hidden text-center"
        >
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
            </div>
            <h2 className="font-[Bebas_Neue] text-5xl sm:text-6xl text-white tracking-wide mb-3">
              GET 10% OFF
            </h2>
            <p className="text-white/80 font-[Barlow] text-lg mb-8 max-w-md mx-auto">
              Subscribe to our newsletter and get an exclusive discount on your first order.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-black/30 border border-white/20 rounded-xl pl-10 pr-4 py-3.5 text-white placeholder-white/50 font-[Barlow] text-sm outline-none focus:border-white/60 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="bg-white text-[#E8000D] font-[Barlow] font-bold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-colors text-sm whitespace-nowrap"
              >
                Get My 10% Off
              </button>
            </form>
            <p className="text-white/40 font-[Barlow] text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
