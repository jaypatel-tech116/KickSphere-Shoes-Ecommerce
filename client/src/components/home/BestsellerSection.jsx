import { motion } from 'framer-motion'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBestsellers } from '../../hooks/useProducts'
import ProductCard, { ProductCardSkeleton } from '../ui/ProductCard'

export default function BestsellerSection() {
  const { data, isLoading } = useBestsellers()
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' })
    }
  }

  const products = data || []

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="text-[#E8000D] font-[Barlow] text-sm font-semibold uppercase tracking-widest mb-2">Top Picks</p>
            <h2 className="font-[Bebas_Neue] text-5xl sm:text-6xl text-white tracking-wide">BESTSELLERS</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll('left')} className="w-10 h-10 bg-[#111] border border-[#1F1F1F] hover:border-[#E8000D] rounded-full flex items-center justify-center text-[#A0A0A0] hover:text-white transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 bg-[#E8000D] hover:bg-[#FF1A1A] rounded-full flex items-center justify-center text-white transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex-none w-64 snap-start"><ProductCardSkeleton /></div>
              ))
            : products.length > 0
            ? products.map((product) => (
                <div key={product._id} className="flex-none w-64 snap-start">
                  <ProductCard product={product} />
                </div>
              ))
            : (
              <div className="w-full py-10 text-center">
                <p className="text-[#A0A0A0] font-[Barlow]">No bestsellers yet — check back soon!</p>
              </div>
            )
          }
        </div>
      </div>
    </section>
  )
}
