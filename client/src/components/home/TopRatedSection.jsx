import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Eye, ShoppingCart, ArrowRight } from 'lucide-react'
import { useProducts } from '../../hooks/useProducts'
import QuickViewModal from '../ui/QuickViewModal'
import { useNavigate } from 'react-router-dom'

export default function TopRatedSection() {
  const { data, isLoading } = useProducts()
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const navigate = useNavigate()

  if (isLoading) return null

  const products = data?.products || []
  if (products.length === 0) return null

  // Get the top rated product
  const topRated = [...products]
    .filter(p => (p.avgrating || 0) > 0)
    .sort((a, b) => (b.avgrating || 0) - (a.avgrating || 0))[0]

  if (!topRated) return null

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E8000D]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-[#E8000D]/10 border border-[#E8000D]/20 px-4 py-1.5 rounded-full mb-6"
            >
              <Star size={14} className="text-[#E8000D] fill-[#E8000D]" />
              <span className="text-[#E8000D] font-[Barlow] font-bold text-xs uppercase tracking-widest">Top Rated Choice</span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-[Bebas_Neue] text-6xl sm:text-7xl text-white tracking-wide mb-6 leading-none"
            >
              CROWNED BY <br /> <span className="text-[#E8000D]">THE COMMUNITY</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[#A0A0A0] font-[Barlow] text-lg max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0"
            >
              The {topRated.name} has been voted as the highest-rated sneaker by our community for its unparalleled comfort and iconic design.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start gap-4"
            >
              <button
                onClick={() => setQuickViewProduct(topRated)}
                className="hidden md:flex bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold px-8 py-4 rounded-xl items-center gap-2 transition-all glow-red-sm"
              >
                <Eye size={20} /> QUICK VIEW
              </button>
              <button
                onClick={() => navigate(`/product/${topRated._id}`)}
                className="bg-[#111] hover:bg-[#1A1A1A] border border-[#1F1F1F] text-white font-[Barlow] font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all"
              >
                LEARN MORE <ArrowRight size={20} />
              </button>
            </motion.div>
          </div>

          {/* Product Image Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="flex-1 w-full max-w-lg"
          >
            <div className="relative group cursor-pointer" onClick={() => { if(window.innerWidth > 768) setQuickViewProduct(topRated) }}>
              <div className="absolute inset-0 bg-[#E8000D] blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl" />
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-[40px] p-8 relative overflow-hidden group-hover:border-[#E8000D]/30 transition-all duration-500">
                <img
                  src={topRated.image1}
                  alt={topRated.name}
                  className="w-full h-auto object-contain transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700"
                />
                
                <div className="mt-8 flex justify-between items-end">
                  <div>
                    <p className="text-[#E8000D] font-[Barlow] font-bold text-sm tracking-widest uppercase mb-1">{topRated.brand}</p>
                    <h3 className="font-[Bebas_Neue] text-3xl text-white tracking-wide">{topRated.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1 justify-end">
                      <Star size={14} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-bold font-[Barlow]">{(topRated.avgrating || 0).toFixed(1)}</span>
                    </div>
                    <p className="text-white font-[Barlow] font-bold text-xl">₹{topRated.price?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  )
}
