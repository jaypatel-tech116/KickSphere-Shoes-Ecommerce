import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, ChevronDown, Star, Truck, RefreshCw, Shield, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSingleProduct } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../stores/authStore'
import { useWishlistStore } from '../stores/wishlistStore'
import StarRating from '../components/ui/StarRating'
import ProductCard from '../components/ui/ProductCard'
import { useProducts } from '../hooks/useProducts'
import api from '../lib/axios'
import { useQuery } from '@tanstack/react-query'
import { useWishlist } from '../hooks/useWishlist'

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, refetch } = useSingleProduct(id)
  const { data: allData } = useProducts()
  const { addToCartMutation } = useCart()
  const { isAuthenticated } = useAuthStore()
  const { isWishlisted } = useWishlistStore()
  const { toggleWishlistMutation } = useWishlist()

  const [mainImg, setMainImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [qty, setQty] = useState(1)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)

  const { data: purchaseData } = useQuery({
    queryKey: ['checkPurchase', id],
    queryFn: async () => {
      const res = await api.get(`/order/check-purchase/${id}`)
      return res.data
    },
    enabled: isAuthenticated
  })

  const product = data?.product || data

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | KickSphere`
      setSelectedColor(product.colors?.[0] || null)
      setSelectedSize(null)
      setMainImg(0) // Reset image index when product changes
    }
  }, [product])

  // Keyboard navigation for zoom modal
  useEffect(() => {
    if (!isZoomed) return
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsZoomed(false)
      if (e.key === 'ArrowRight') setMainImg(i => Math.min(i + 1, images.length - 1))
      if (e.key === 'ArrowLeft') setMainImg(i => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isZoomed])

  if (isLoading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12">
        <div className="skeleton aspect-square rounded-2xl" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-40 rounded" />
          <div className="skeleton h-12 w-full rounded" />
          <div className="skeleton h-8 w-24 rounded" />
          <div className="skeleton h-32 w-full rounded" />
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="text-center py-20">
      <p className="text-[#A0A0A0] font-[Barlow]">Product not found.</p>
    </div>
  )

  const images = [product.image1, product.image2, product.image3, product.image4].filter(Boolean)
  const stockForSize = selectedSize ? (product.numberofproducts?.[String(selectedSize)] || 0) : null
  const maxQty = stockForSize || 10
  const wishlisted = isWishlisted(product._id)

  // FIX: Limit related to 4 for clean grid layout (avoids orphaned items)
  const related = (allData?.products || [])
    .filter((p) => p._id !== product._id && p.subcategory === product.subcategory)
    .slice(0, 4)

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/auth'); return }
    if (!selectedSize) { toast.error('Please select a size'); return }
    addToCartMutation.mutate({ itemId: product._id, size: selectedSize, color: selectedColor, quantity: qty })
  }

  const handleRate = async () => {
    if (!isAuthenticated) { toast.error('Please login to rate'); return }
    if (!rating) { toast.error('Please select a rating'); return }
    setSubmitting(true)
    try {
      await api.post(`/product/rate/${product._id}`, { rating, comment })
      toast.success('Review submitted!')
      setRating(0); setComment('')
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  const accordions = [
    { id: 'desc', title: 'Description', content: product.description || 'No description available.' },
    {
      id: 'material', title: 'Material & Construction',
      content: `Material: ${product.material || 'N/A'} | Sole: ${product.sole || 'N/A'} | Closure: ${product.closure || 'N/A'}`
    },
    { id: 'shipping', title: 'Shipping & Returns', content: 'Free shipping on orders above ₹999. Easy 30-day return policy for unused items in original packaging.' },
  ]

  return (
    <div className="bg-black min-h-screen overflow-x-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 w-full">

          {/* ── Image Gallery ── */}
          <div className="w-full min-w-0 space-y-3">
            {/* Main image */}
            <motion.div
              key={mainImg}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              className="w-full aspect-square bg-[#111] rounded-2xl overflow-hidden border border-[#1F1F1F] relative group cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            >
              <img
                src={images[mainImg]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => { e.target.src = '/Small_Logo.png'; e.target.className = 'w-full h-full object-contain p-12 opacity-30' }}
              />

              {/* Prev / Next arrows — mobile/tablet, hidden on lg */}
              {images.length > 1 && mainImg > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setMainImg(i => Math.max(0, i - 1)) }}
                  className="lg:hidden absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white border border-white/10"
                >
                  <ChevronLeft size={16} />
                </button>
              )}
              {images.length > 1 && mainImg < images.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setMainImg(i => Math.min(images.length - 1, i + 1)) }}
                  className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/70 rounded-full flex items-center justify-center text-white border border-white/10"
                >
                  <ChevronRight size={16} />
                </button>
              )}

              {/* Dot indicators — mobile/tablet */}
              {images.length > 1 && (
                <div className="lg:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setMainImg(i) }}
                      style={{
                        width: mainImg === i ? '16px' : '6px',
                        height: '6px',
                        borderRadius: '9999px',
                        background: mainImg === i ? '#E8000D' : 'rgba(255,255,255,0.4)',
                        transition: 'all 0.3s'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Zoom hint — desktop only */}
              <div className="hidden lg:flex absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full items-center gap-2 text-white text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity border border-white/10">
                <Search size={12} /> Click to Zoom
              </div>
            </motion.div>

            {/* Thumbnails — desktop only */}
            {images.length > 1 && (
              <div className="hidden lg:flex gap-3 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImg(i)}
                    className={`flex-none w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImg === i ? 'border-[#E8000D] scale-105' : 'border-[#1F1F1F] opacity-60 hover:opacity-100 hover:border-[#E8000D]/50'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/Small_Logo.png'; e.target.className = 'w-full h-full object-contain p-2 opacity-30' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="space-y-5 lg:mt-0">
            {/* Brand + Name */}
            <div>
              <span className="text-[#E8000D] font-[Barlow] font-semibold text-xs sm:text-sm uppercase tracking-[0.2em]">{product.brand}</span>
              <h1 className="font-[Bebas_Neue] text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide mt-1 leading-[0.95]">{product.name}</h1>
            </div>

            {/* Rating row */}
            <div className="flex items-center gap-3">
              <StarRating rating={product.avgrating || 0} size={16} />
              <span className="text-[#A0A0A0] font-[Barlow] text-sm">({product.ratings?.length || 0} reviews)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-white font-[Barlow]">{formatPrice(product.price)}</div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-2">
                  Color: <span className="text-white capitalize">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-[#E8000D] scale-110' : 'border-[#1F1F1F] hover:border-white'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes — FIX: better grid that avoids overflow on small screens */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-2">
                  Size (UK):
                  {!selectedSize && <span className="text-[#E8000D] text-xs ml-2 italic">Select to add to cart</span>}
                </p>
                <div className="grid grid-cols-5 xs:grid-cols-6 sm:grid-cols-7 gap-2">
                  {product.sizes.map((size) => {
                    const stock = product.numberofproducts?.[String(size)] || 0
                    const oos = stock === 0
                    return (
                      <button
                        key={size}
                        onClick={() => !oos && setSelectedSize(size)}
                        disabled={oos}
                        className={`relative py-2.5 rounded-lg text-sm font-[Barlow] font-semibold border-2 transition-all ${
                          oos
                            ? 'border-[#1F1F1F] text-[#333] cursor-not-allowed'
                            : selectedSize === size
                              ? 'border-[#E8000D] bg-[#E8000D]/10 text-white'
                              : 'border-[#1F1F1F] text-[#A0A0A0] hover:border-[#E8000D]/50 hover:text-white'
                        }`}
                      >
                        {size}
                        {!oos && stock < 3 && (
                          <span className="absolute -top-1 -right-1 text-[8px] bg-orange-500 text-white px-0.5 rounded leading-tight">LOW</span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {selectedSize && (
                  <p className="text-[#A0A0A0] font-[Barlow] text-xs mt-1.5">
                    {stockForSize > 0 ? `${stockForSize} in stock` : 'Out of stock'}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-[#A0A0A0] font-[Barlow] text-sm">Qty:</p>
              <div className="flex items-center border border-[#1F1F1F] rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-white hover:bg-[#1F1F1F] transition-colors font-[Barlow] text-lg leading-none">−</button>
                <span className="px-4 py-2 text-white font-[Barlow] text-sm border-x border-[#1F1F1F] min-w-[40px] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(maxQty, qty + 1))} className="px-3 py-2 text-white hover:bg-[#1F1F1F] transition-colors font-[Barlow] text-lg leading-none">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="flex-1 bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors glow-red-sm text-sm sm:text-base"
              >
                <ShoppingCart size={18} />
                {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (!isAuthenticated) { toast.error('Please login first'); navigate('/auth'); return }
                  toggleWishlistMutation.mutate(product._id)
                  toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
                }}
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all flex-none ${wishlisted ? 'border-[#E8000D] bg-[#E8000D]/10 text-[#E8000D]' : 'border-[#1F1F1F] text-[#A0A0A0] hover:border-[#E8000D] hover:text-[#E8000D]'}`}
              >
                <Heart size={20} className={wishlisted ? 'fill-[#E8000D]' : ''} />
              </motion.button>
            </div>

            {/* Trust badges — FIX: stack to single col on very small screens */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              {[
                { icon: <Truck size={15} />, text: 'Free shipping ₹999+' },
                { icon: <RefreshCw size={15} />, text: '30-day returns' },
                { icon: <Shield size={15} />, text: '100% Authentic' },
              ].map((b) => (
                <div key={b.text} className="bg-[#111] border border-[#1F1F1F] rounded-lg p-2 sm:p-2.5 flex flex-col items-center gap-1 text-center">
                  <span className="text-[#E8000D]">{b.icon}</span>
                  <span className="text-[#A0A0A0] text-[10px] sm:text-xs font-[Barlow] leading-tight">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="space-y-2 pt-1">
              {accordions.map((acc) => (
                <div key={acc.id} className="border border-[#1F1F1F] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-white font-[Barlow] font-semibold text-sm text-left"
                  >
                    <span>{acc.title}</span>
                    <ChevronDown size={16} className={`text-[#A0A0A0] transition-transform flex-none ml-2 ${openAccordion === acc.id ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openAccordion === acc.id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-[#A0A0A0] font-[Barlow] text-sm leading-relaxed">{acc.content}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Reviews Section ── */}
        <div className="mt-12 sm:mt-16 border-t border-[#1F1F1F] pt-10 sm:pt-12">
          <h2 className="font-[Bebas_Neue] text-3xl text-white tracking-wide mb-6 sm:mb-8">RATINGS & REVIEWS</h2>
          {/* FIX: stack on mobile, side-by-side on md+ */}
          <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-10">

            {/* Rating summary + review cards */}
            <div>
              <div className="flex items-start gap-4 sm:gap-6 mb-6">
                <div className="text-center flex-none">
                  <p className="font-[Bebas_Neue] text-5xl sm:text-6xl text-white leading-none">{(product.avgrating || 0).toFixed(1)}</p>
                  <div className="mt-1"><StarRating rating={product.avgrating || 0} size={16} /></div>
                  <p className="text-[#A0A0A0] text-xs font-[Barlow] mt-1">{product.ratings?.length || 0} reviews</p>
                </div>
                <div className="flex-1 min-w-0 space-y-1.5 pt-1">
                  {[5,4,3,2,1].map((s) => {
                    const count = product.ratings?.filter((r) => Math.round(r.rating) === s).length || 0
                    const pct = product.ratings?.length ? (count / product.ratings.length) * 100 : 0
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-[#A0A0A0] font-[Barlow] w-3 flex-none">{s}</span>
                        <div className="flex-1 h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#A0A0A0] font-[Barlow] w-4 text-right">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-3 max-h-72 sm:max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                {product.ratings?.length > 0 ? product.ratings.map((r, i) => (
                  <div key={i} className="bg-[#111] border border-[#1F1F1F] rounded-xl p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 bg-[#E8000D] rounded-full flex items-center justify-center text-white text-xs font-bold font-[Barlow] flex-none">
                          {r.userName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="min-w-0">
                          <span className="text-white text-sm font-semibold font-[Barlow] block truncate">{r.userName || 'Anonymous'}</span>
                          <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded font-[Barlow] font-bold">VERIFIED</span>
                        </div>
                      </div>
                      <div className="flex-none"><StarRating rating={r.rating} size={12} /></div>
                    </div>
                    <p className="text-[#A0A0A0] font-[Barlow] text-sm leading-relaxed">{r.comment}</p>
                    <p className="text-[#A0A0A0] text-xs font-[Barlow] mt-2">{new Date(r.date || r.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                )) : <p className="text-[#A0A0A0] font-[Barlow] text-sm">No reviews yet. Be the first!</p>}
              </div>
            </div>

            {/* Submit review */}
            <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5 sm:p-6 w-full md:self-start w-full">
              <h3 className="font-[Bebas_Neue] text-xl text-white tracking-wide mb-4">WRITE A REVIEW</h3>
              {!isAuthenticated ? (
                <div className="text-center py-6">
                  <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-3">Login to write a review</p>
                  <button onClick={() => navigate('/auth')} className="bg-[#E8000D] text-white font-[Barlow] font-semibold px-6 py-2 rounded-lg text-sm">Login</button>
                </div>
              ) : purchaseData?.purchased ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-2">Your Rating</p>
                    <StarRating rating={rating} size={24} interactive onRate={setRating} />
                  </div>
                  <div>
                    <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-2">Comment</p>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Share your experience..."
                      className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white font-[Barlow] text-sm placeholder-[#A0A0A0] outline-none focus:border-[#E8000D] transition-colors resize-none"
                    />
                  </div>
                  <button
                    onClick={handleRate}
                    disabled={submitting}
                    className="w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-3 rounded-xl transition-colors disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-[#E8000D]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star size={20} className="text-[#E8000D]" />
                  </div>
                  <p className="text-[#A0A0A0] font-[Barlow] text-sm">
                    Only verified buyers who have received this product can leave a review.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {related.length > 0 && (
          <div className="mt-12 sm:mt-16 border-t border-[#1F1F1F] pt-10 sm:pt-12">
            <h2 className="font-[Bebas_Neue] text-3xl text-white tracking-wide mb-6 sm:mb-8">YOU MAY ALSO LIKE</h2>
            {/* FIX: 2 cols mobile, 4 cols desktop — matches slice(0,4) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* ── Zoom Modal ── */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            {/* Close */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/60 hover:text-white transition-colors z-10"
            >
              <X size={28} />
            </button>

            {/* Prev / Next arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setMainImg(i => Math.max(0, i - 1)) }}
                  className={`absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10 ${mainImg === 0 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMainImg(i => Math.min(images.length - 1, i + 1)) }}
                  className={`absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-10 ${mainImg === images.length - 1 ? 'opacity-30 pointer-events-none' : ''}`}
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl lg:max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[mainImg]}
                alt={product.name}
                className="w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-2xl shadow-2xl shadow-red-500/10"
              />
            </motion.div>

            {/* Thumbnails — FIX: scrollable row, constrained width on mobile */}
            {images.length > 1 && (
              <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-xl p-2 rounded-2xl border border-white/10 max-w-[90vw] overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setMainImg(i) }}
                    className={`flex-none w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden border-2 transition-all ${mainImg === i ? 'border-[#E8000D]' : 'border-transparent opacity-50 hover:opacity-80'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}