import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletter = (e) => {
    e.preventDefault()
    if (!email) return
    toast.success('Thanks for subscribing! 🎉')
    setEmail('')
  }

  return (
    <footer className="bg-[#0A0A0A] border-t border-[#1F1F1F] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="KickSphere" className="h-12 w-auto" onError={(e) => { e.target.style.display = 'none' }} />
            </Link>
            <p className="text-[#A0A0A0] text-sm font-[Barlow] max-w-xs leading-relaxed mb-4">
              The ultimate destination for premium footwear. Authentic brands. Unbeatable style.
            </p>
            <div className="flex gap-3">
              {[
                { label: 'Instagram', svg: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg> },
                { label: 'Twitter', svg: <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.737-8.835L1.254 2.25H8.08l4.259 5.63z" /></svg> },
                { label: 'WhatsApp', svg: <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 .017C5.373.017.017 5.373.017 12c0 2.091.537 4.057 1.476 5.773L0 24l6.418-1.673A11.98 11.98 0 0012 24c6.627 0 11.983-5.356 11.983-11.983 0-6.626-5.356-11.982-11.983-11.982z" /></svg> },
              ].map((s) => (
                <button key={s.label} aria-label={s.label} className="w-9 h-9 bg-[#111] border border-[#1F1F1F] rounded-lg flex items-center justify-center text-[#A0A0A0] hover:text-white hover:border-[#E8000D] hover:bg-[#E8000D]/10 transition-all">
                  {s.svg}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="font-[Bebas_Neue] text-white text-lg tracking-wider mb-4">COMPANY</p>
            <div className="space-y-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop', to: '/collection' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map((link) => (
                <Link key={link.to} to={link.to} className="block text-[#A0A0A0] hover:text-white text-sm font-[Barlow] transition-colors">{link.label}</Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="font-[Bebas_Neue] text-white text-lg tracking-wider mb-4">NEWSLETTER</p>
            <p className="text-[#A0A0A0] text-sm font-[Barlow] mb-3">Get exclusive deals & style updates.</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-[#111] border border-[#1F1F1F] rounded-lg px-3 py-2 text-white text-sm font-[Barlow] placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors"
              />
              <button type="submit" className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white text-sm font-semibold py-2 rounded-lg transition-colors font-[Barlow]">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[#1F1F1F] pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#A0A0A0] text-sm font-[Barlow]">© 2025 KickSphere. All rights reserved.</p>
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'UPI', 'RazorPay'].map((p) => (
              <span key={p} className="text-[10px] font-[Barlow] text-[#A0A0A0] border border-[#1F1F1F] px-2 py-0.5 rounded">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
