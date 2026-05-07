import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const categories = [
  {
    name: 'Men',
    label: "Men's Collection",
    description: 'Bold styles for the modern man',
    color: '#E8000D',
    emoji: '👟',
  },
  {
    name: 'Women',
    label: "Women's Collection",
    description: 'Elegance meets performance',
    color: '#FF6B6B',
    emoji: '👠',
  },
  {
    name: 'Kids',
    label: "Kids' Collection",
    description: 'Durable & fun for little feet',
    color: '#FF8C42',
    emoji: '👶',
  },
  {
    name: 'Unisex',
    label: 'Unisex Styles',
    description: 'For everyone who loves great shoes',
    color: '#A0A0A0',
    emoji: '✨',
  },
]

export default function CategorySection() {
  const navigate = useNavigate()

  return (
    <section className="py-20 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-[#E8000D] font-[Barlow] text-sm font-semibold uppercase tracking-widest mb-2">Browse By</p>
          <h2 className="font-[Bebas_Neue] text-5xl sm:text-6xl text-white tracking-wide">SHOP CATEGORIES</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.03, y: -4 }}
              onClick={() => navigate(`/collection?category=${cat.name}`)}
              className="group relative bg-[#111] border border-[#1F1F1F] rounded-2xl p-6 cursor-pointer overflow-hidden transition-all duration-300"
              style={{ '--cat-color': cat.color }}
            >
              {/* Hover shimmer */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(circle at 50% 50%, ${cat.color}15 0%, transparent 70%)` }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ background: cat.color }}
              />

              <div className="relative z-10">
                <div className="text-5xl mb-4">{cat.emoji}</div>
                <h3 className="font-[Bebas_Neue] text-2xl text-white tracking-wide">{cat.name}</h3>
                <p className="text-[#A0A0A0] font-[Barlow] text-sm mt-1">{cat.description}</p>
                <div
                  className="mt-4 text-xs font-semibold font-[Barlow] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: cat.color }}
                >
                  Shop Now →
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
