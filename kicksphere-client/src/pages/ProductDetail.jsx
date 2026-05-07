import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, ChevronDown, Star, Truck, RefreshCw, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { useSingleProduct } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useAuthStore } from '../stores/authStore'
import { useWishlistStore } from '../stores/wishlistStore'
import StarRating from '../components/ui/StarRating'
import ProductCard, { ProductCardSkeleton } from '../components/ui/ProductCard'
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
    }
  }, [product])

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

  const related = (allData?.products || [])
    .filter((p) => p._id !== product._id && p.subcategory === product.subcategory)
    .slice(0, 6)

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/auth'); return }
    if (!selectedSize) { toast.error('Please select a size'); return }
    addToCartMutation.mutate({ itemId: product._id, size: selectedSize, color: selectedColor })
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
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <motion.div
              key={mainImg}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
              className="aspect-square bg-[#111] rounded-2xl overflow-hidden border border-[#1F1F1F] relative group"
            >
              <img
                src={images[mainImg]}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => { e.target.src = '/Small_Logo.png'; e.target.className = 'w-full h-full object-contain p-12 opacity-30' }}
              />
            </motion.div>
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImg(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${mainImg === i ? 'border-[#E8000D]' : 'border-[#1F1F1F] hover:border-[#E8000D]/50'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.src = '/Small_Logo.png'; e.target.className = 'w-full h-full object-contain p-2 opacity-30' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <span className="text-[#E8000D] font-[Barlow] font-semibold text-sm uppercase tracking-widest">{product.brand}</span>
              <h1 className="font-[Bebas_Neue] text-4xl sm:text-5xl text-white tracking-wide mt-1 leading-tight">{product.name}</h1>
            </div>

            <div className="flex items-center gap-3">
              <StarRating rating={product.avgrating || 0} size={16} />
              <span className="text-[#A0A0A0] font-[Barlow] text-sm">({product.ratings?.length || 0} reviews)</span>
            </div>

            <div className="text-3xl font-bold text-white font-[Barlow]">{formatPrice(product.price)}</div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-2">Color: <span className="text-white capitalize">{selectedColor}</span></p>
                <div className="flex gap-2">
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

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div>
                <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-2">Size (UK): {!selectedSize && <span className="text-[#E8000D]">Please select</span>}</p>
                <div className="grid grid-cols-6 gap-2">
                  {product.sizes.map((size) => {
                    const stock = product.numberofproducts?.[String(size)] || 0
                    const oos = stock === 0
                    return (
                      <button
                        key={size}
                        onClick={() => !oos && setSelectedSize(size)}
                        disabled={oos}
                        className={`relative py-2.5 rounded-lg text-sm font-[Barlow] font-semibold border-2 transition-all ${
                          oos ? 'border-[#1F1F1F] text-[#333] cursor-not-allowed' :
                          selectedSize === size ? 'border-[#E8000D] bg-[#E8000D]/10 text-white' :
                          'border-[#1F1F1F] text-[#A0A0A0] hover:border-[#E8000D]/50 hover:text-white'
                        }`}
                      >
                        {size}
                        {!oos && stock < 3 && (
                          <span className="absolute -top-1 -right-1 text-[8px] bg-orange-500 text-white px-0.5 rounded">LOW</span>
                        )}
                      </button>
                    )
                  })}
                </div>
                {selectedSize && (
                  <p className="text-[#A0A0A0] font-[Barlow] text-xs mt-1">
                    {stockForSize > 0 ? `${stockForSize} in stock` : 'Out of stock'}
                  </p>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <p className="text-[#A0A0A0] font-[Barlow] text-sm">Qty:</p>
              <div className="flex items-center border border-[#1F1F1F] rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-white hover:bg-[#1F1F1F] transition-colors font-[Barlow]">−</button>
                <span className="px-4 py-2 text-white font-[Barlow] text-sm border-x border-[#1F1F1F]">{qty}</span>
                <button onClick={() => setQty(Math.min(maxQty, qty + 1))} className="px-3 py-2 text-white hover:bg-[#1F1F1F] transition-colors font-[Barlow]">+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
                className="flex-1 bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors glow-red-sm"
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
                className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${wishlisted ? 'border-[#E8000D] bg-[#E8000D]/10 text-[#E8000D]' : 'border-[#1F1F1F] text-[#A0A0A0] hover:border-[#E8000D] hover:text-[#E8000D]'}`}
              >
                <Heart size={20} className={wishlisted ? 'fill-[#E8000D]' : ''} />
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: <Truck size={16} />, text: 'Free shipping ₹999+' },
                { icon: <RefreshCw size={16} />, text: '30-day returns' },
                { icon: <Shield size={16} />, text: '100% Authentic' },
              ].map((b) => (
                <div key={b.text} className="bg-[#111] border border-[#1F1F1F] rounded-lg p-2.5 flex flex-col items-center gap-1 text-center">
                  <span className="text-[#E8000D]">{b.icon}</span>
                  <span className="text-[#A0A0A0] text-xs font-[Barlow]">{b.text}</span>
                </div>
              ))}
            </div>

            {/* Accordions */}
            <div className="space-y-2 pt-2">
              {accordions.map((acc) => (
                <div key={acc.id} className="border border-[#1F1F1F] rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === acc.id ? null : acc.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-white font-[Barlow] font-semibold text-sm"
                  >
                    {acc.title}
                    <ChevronDown size={16} className={`text-[#A0A0A0] transition-transform ${openAccordion === acc.id ? 'rotate-180' : ''}`} />
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

        {/* Reviews Section */}
        <div className="mt-16 border-t border-[#1F1F1F] pt-12">
          <h2 className="font-[Bebas_Neue] text-3xl text-white tracking-wide mb-8">RATINGS & REVIEWS</h2>
          <div className="grid md:grid-cols-2 gap-10">
            {/* Rating summary */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <p className="font-[Bebas_Neue] text-6xl text-white">{(product.avgrating || 0).toFixed(1)}</p>
                  <StarRating rating={product.avgrating || 0} size={18} />
                  <p className="text-[#A0A0A0] text-xs font-[Barlow] mt-1">{product.ratings?.length || 0} reviews</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5,4,3,2,1].map((s) => {
                    const count = product.ratings?.filter((r) => Math.round(r.rating) === s).length || 0
                    const pct = product.ratings?.length ? (count / product.ratings.length) * 100 : 0
                    return (
                      <div key={s} className="flex items-center gap-2">
                        <span className="text-xs text-[#A0A0A0] font-[Barlow] w-4">{s}</span>
                        <div className="flex-1 h-1.5 bg-[#1F1F1F] rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-[#A0A0A0] font-[Barlow] w-4">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {product.ratings?.length > 0 ? product.ratings.map((r, i) => (
                  <div key={i} className="bg-[#111] border border-[#1F1F1F] rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-[#E8000D] rounded-full flex items-center justify-center text-white text-xs font-bold font-[Barlow]">
                          {r.userName?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-white text-sm font-semibold font-[Barlow]">{r.userName || 'Anonymous'}</span>
                        <span className="text-[10px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded font-[Barlow] font-bold">VERIFIED BUYER</span>
                      </div>
                      <StarRating rating={r.rating} size={12} />
                    </div>
                    <p className="text-[#A0A0A0] font-[Barlow] text-sm">{r.comment}</p>
                    <p className="text-[#A0A0A0] text-xs font-[Barlow] mt-2">{new Date(r.date || r.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                )) : <p className="text-[#A0A0A0] font-[Barlow] text-sm">No reviews yet. Be the first!</p>}
              </div>
            </div>

            {/* Submit review */}
            <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-6">
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

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-[#1F1F1F] pt-12">
            <h2 className="font-[Bebas_Neue] text-3xl text-white tracking-wide mb-8">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
