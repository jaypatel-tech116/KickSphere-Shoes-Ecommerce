export default function MarqueeBanner() {
  const items = [
    'FREE SHIPPING ABOVE ₹999',
    'EASY RETURNS',
    'AUTHENTIC BRANDS',
    'SECURE CHECKOUT',
    'EXCLUSIVE DEALS',
    'FAST DELIVERY',
  ]

  const doubled = [...items, ...items, ...items, ...items]

  return (
    <div className="bg-[#E8000D] py-3 overflow-hidden">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="font-[Bebas_Neue] text-white tracking-widest text-base whitespace-nowrap px-6 flex items-center gap-6">
            {item}
            <span className="text-white/40 text-xl">•</span>
          </span>
        ))}
      </div>
    </div>
  )
}
