import { motion } from 'framer-motion'

export default function About() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black z-10" />
        <img 
          src="https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=2000" 
          alt="Luxury Sneakers" 
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-20 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[Bebas_Neue] text-6xl md:text-8xl tracking-tighter mb-4"
          >
            OUR <span className="text-[#E8000D]">STORY</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-[Barlow] text-lg text-zinc-400 max-w-2xl mx-auto"
          >
            Redefining the sneaker landscape through curated luxury and uncompromised authenticity.
          </motion.p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-[Bebas_Neue] text-4xl mb-6">MORE THAN A <span className="text-[#E8000D]">MARKETPLACE</span></h2>
            <div className="space-y-6 font-[Barlow] text-zinc-400 leading-relaxed">
              <p>
                KickSphere was born from a simple obsession: the perfect pair of sneakers. We believe that footwear is not just an accessory, but a form of self-expression and a testament to craftsmanship.
              </p>
              <p>
                Founded in 2024, we set out to build a destination where enthusiasts and collectors could find the most sought-after releases and timeless classics, all verified by our rigorous multi-point inspection process.
              </p>
              <p>
                Our team consists of lifelong sneakerheads, designers, and industry experts who live and breathe street culture. Every product on our platform is hand-selected for its quality, rarity, and style.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=800" alt="Sneaker Detail" className="rounded-2xl w-full h-64 object-cover" />
            <img src="https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=800" alt="Sneaker Detail" className="rounded-2xl w-full h-64 object-cover mt-8" />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-zinc-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-[Bebas_Neue] text-4xl">OUR CORE <span className="text-[#E8000D]">VALUES</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { title: 'AUTHENTICITY', desc: '100% genuine products, guaranteed through expert verification.' },
              { title: 'COMMUNITY', desc: 'Building a home for sneaker enthusiasts worldwide.' },
              { title: 'EXCELLENCE', desc: 'Unparalleled service and premium packaging for every order.' },
            ].map((v) => (
              <div key={v.title} className="p-8 border border-zinc-900 rounded-3xl bg-black/50 hover:border-[#E8000D]/50 transition-colors group">
                <h3 className="font-[Bebas_Neue] text-2xl mb-4 text-white group-hover:text-[#E8000D] transition-colors">{v.title}</h3>
                <p className="font-[Barlow] text-zinc-500 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
