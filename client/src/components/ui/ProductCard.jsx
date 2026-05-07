import { motion } from 'framer-motion'
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useWishlistStore } from '../../stores/wishlistStore'
import { useWishlist } from '../../hooks/useWishlist'
import { useAuthStore } from '../../stores/authStore'
import QuickViewModal from './QuickViewModal'

function formatPrice(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`
}

function StarRating({ rating = 0, size = 12 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600 fill-gray-600'}
        />
      ))}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-[#111111] rounded-xl overflow-hidden border border-[#1F1F1F]">
      <div className="skeleton aspect-square w-full" />
      <div className="p-4 space-y-2">
        <div className="skeleton h-3 w-16 rounded" />
        <div className="skeleton h-5 w-full rounded" />
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-9 w-full rounded-lg mt-3" />
      </div>
    </div>
  )
}

export default function ProductCard({ product }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const { isWishlisted } = useWishlistStore()
  const { toggleWishlistMutation } = useWishlist()
  const { isAuthenticated } = useAuthStore()
  const wishlisted = isWishlisted(product._id)

  const img1 = product.image1 || '/placeholder.png'
  const img2 = product.image2 || img1

  const handleWishlist = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/auth'); return }
    toggleWishlistMutation.mutate(product._id)
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist!')
  }

  return (
    <>
      <motion.div
        className="group bg-[#111111] rounded-xl overflow-hidden border border-[#1F1F1F] cursor-pointer relative"
        whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(232,0,13,0.15)' }}
        transition={{ duration: 0.25 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={() => navigate(`/product/${product._id}`)}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-square bg-[#0a0a0a]">
          <img
            src={hovered && img2 ? img2 : img1}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-500"
            onError={(e) => { e.target.src = '/Small_Logo.png'; e.target.className = 'w-full h-full object-contain p-8 opacity-30 transition-all duration-500' }}
          />
          {product.bestseller && (
            <div className="absolute top-2 left-2 bg-[#E8000D] text-white text-xs font-bold px-2 py-0.5 rounded font-[Barlow]">
              BESTSELLER
            </div>
          )}
          {/* Wishlist button */}
          <motion.button
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10
              ${wishlisted ? 'bg-[#E8000D] text-white' : 'bg-black/60 text-white hover:bg-[#E8000D]'}`}
            whileTap={{ scale: 0.85 }}
            onClick={handleWishlist}
          >
            <Heart size={14} className={wishlisted ? 'fill-white' : ''} />
          </motion.button>
          
          {/* Quick view overlay - Desktop Only */}
          <motion.div
            className="absolute inset-0 bg-black/40 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={(e) => { e.stopPropagation(); setQuickViewOpen(true) }}
          >
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs px-4 py-2 rounded-full flex items-center gap-1.5 font-[Barlow] hover:bg-white hover:text-black transition-all">
              <Eye size={14} /> Quick View
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[#A0A0A0] text-[10px] font-semibold uppercase tracking-widest font-[Barlow]">{product.brand}</p>
          <p className="text-white font-[Barlow] font-medium mt-0.5 line-clamp-1 text-sm">{product.name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={product.avgrating || 0} />
            <span className="text-[#A0A0A0] text-[10px]">({product.ratings?.length || 0})</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-white font-bold font-[Barlow] text-lg">{formatPrice(product.price)}</span>
          </div>
          
          <motion.button
            className="mt-4 w-full bg-white text-black hover:bg-[#E8000D] hover:text-white text-xs font-bold py-3 rounded-lg font-[Barlow] transition-all"
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`) }}
          >
            VIEW DETAILS
          </motion.button>
        </div>
      </motion.div>

      <QuickViewModal 
        product={product} 
        isOpen={quickViewOpen} 
        onClose={() => setQuickViewOpen(false)} 
      />
    </>
  )
}
