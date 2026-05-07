import { useEffect } from 'react'
import { motion } from 'framer-motion'
import HeroSection from '../components/home/HeroSection'
import MarqueeBanner from '../components/home/MarqueeBanner'
import CategorySection from '../components/home/CategorySection'
import BestsellerSection from '../components/home/BestsellerSection'
import TopRatedSection from '../components/home/TopRatedSection'
import NewsletterSection from '../components/home/NewsletterSection'
import { Star } from 'lucide-react'

const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'New Balance']

export default function Home() {
  useEffect(() => { document.title = 'Home | KickSphere' }, [])

  return (
    <div className="bg-black">
      <HeroSection />
      <MarqueeBanner />
      <CategorySection />
      <BestsellerSection />
      <TopRatedSection />

      {/* Featured Brands */}
      <section className="py-16 bg-[#0A0A0A] border-y border-[#1F1F1F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[#A0A0A0] font-[Barlow] text-sm uppercase tracking-widest mb-10">Featured Brands</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {brands.map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.05, borderColor: '#E8000D' }}
                className="glass rounded-xl p-5 flex items-center justify-center cursor-pointer transition-all"
              >
                <span className="font-[Bebas_Neue] text-xl text-[#A0A0A0] hover:text-white tracking-widest transition-colors">{brand}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <NewsletterSection />
    </div>
  )
}
