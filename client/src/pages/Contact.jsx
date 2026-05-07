import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, MessageSquare } from 'lucide-react'

export default function Contact() {
  const contactInfo = [
    { icon: <Phone size={24} />, title: 'Phone', detail: '+91 98765 43210', subtitle: 'Mon-Sat 9am - 6pm' },
    { icon: <Mail size={24} />, title: 'Email', detail: 'support@kicksphere.com', subtitle: '24/7 Response time' },
    { icon: <MapPin size={24} />, title: 'Visit Us', detail: 'Luxury Hub, Mumbai', subtitle: 'Maharashtra, India' },
  ]

  return (
    <div className="bg-black text-white min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-[Bebas_Neue] text-6xl tracking-tight mb-4"
          >
            GET IN <span className="text-[#E8000D]">TOUCH</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-[Barlow] text-zinc-400 text-lg"
          >
            Have a question? We're here to help you find your perfect pair.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {contactInfo.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 flex flex-col items-center text-center group hover:border-[#E8000D]/30 transition-colors"
            >
              <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-[#E8000D] mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-[Bebas_Neue] text-xl mb-2">{item.title}</h3>
              <p className="font-[Barlow] text-white font-semibold mb-1">{item.detail}</p>
              <p className="font-[Barlow] text-zinc-500 text-sm">{item.subtitle}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="font-[Bebas_Neue] text-3xl mb-8">SEND US A <span className="text-[#E8000D]">MESSAGE</span></h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-zinc-400 font-[Barlow] text-sm mb-2">Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#E8000D] transition-colors" />
                </div>
                <div>
                  <label className="block text-zinc-400 font-[Barlow] text-sm mb-2">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#E8000D] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-zinc-400 font-[Barlow] text-sm mb-2">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#E8000D] transition-colors" />
              </div>
              <div>
                <label className="block text-zinc-400 font-[Barlow] text-sm mb-2">Message</label>
                <textarea rows={5} placeholder="Write your message here..." className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-white outline-none focus:border-[#E8000D] transition-colors resize-none"></textarea>
              </div>
              <button className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-4 rounded-xl transition-all shadow-lg shadow-[#E8000D]/20">
                SEND MESSAGE
              </button>
            </form>
          </motion.div>

          {/* FAQ/Info */}
          <div className="space-y-8">
            <div className="bg-[#111] border border-zinc-900 rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <MessageSquare className="text-[#E8000D]" />
                <h3 className="font-[Bebas_Neue] text-2xl">FREQUENTLY ASKED</h3>
              </div>
              <div className="space-y-6">
                {[
                  { q: 'How do you verify authenticity?', a: 'Every pair undergoes a rigorous multi-point inspection by our team of expert authenticators before shipping.' },
                  { q: 'What is your return policy?', a: 'We offer a 30-day return policy for unused items in their original packaging.' },
                  { q: 'Do you ship internationally?', a: 'Currently we ship within India, with plans to expand to international markets soon.' },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-zinc-900 pb-6 last:border-0 last:pb-0">
                    <p className="font-[Barlow] font-semibold text-white mb-2">{faq.q}</p>
                    <p className="font-[Barlow] text-zinc-500 text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social Links */}
            <div className="bg-[#E8000D] rounded-3xl p-8 text-center">
              <h3 className="font-[Bebas_Neue] text-2xl mb-4 text-white">JOIN OUR COMMUNITY</h3>
              <p className="font-[Barlow] text-white/80 text-sm mb-6">Follow us for exclusive drops, news, and more.</p>
              <div className="flex justify-center gap-4">
                {['Instagram', 'Twitter', 'Facebook'].map(s => (
                  <button key={s} className="bg-white text-black font-[Barlow] font-bold px-4 py-2 rounded-lg text-xs hover:bg-black hover:text-white transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
