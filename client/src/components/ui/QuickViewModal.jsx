import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Heart, Star, Truck, Shield } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { useAuthStore } from '../../stores/authStore'
import { useWishlistStore } from '../../stores/wishlistStore'

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

export default function QuickViewModal({ product, isOpen, onClose }) {
  const navigate = useNavigate()
  const { addToCartMutation } = useCart()
  const { isAuthenticated } = useAuthStore()
  const { isWishlisted } = useWishlistStore()
  const { toggleWishlistMutation } = useWishlist()
  
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null)

  if (!product) return null

  const handleAddToCart = (e) => {
    e.stopPropagation()
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/auth'); return }
    if (!selectedSize) { toast.error('Please select a size'); return }
    addToCartMutation.mutate({ itemId: product._id, size: selectedSize, color: selectedColor })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-[#0A0A0A] border border-[#1F1F1F] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-[#E8000D] transition-colors">
              <X size={20} />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 aspect-square bg-[#111]">
              <img src={product.image1} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-8 overflow-y-auto max-h-[80vh] md:max-h-full">
              <div className="mb-6">
                <span className="text-[#E8000D] font-[Barlow] font-semibold text-xs uppercase tracking-widest">{product.brand}</span>
                <h2 className="font-[Bebas_Neue] text-3xl text-white tracking-wide mt-1">{product.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex text-yellow-400"><Star size={14} fill="currentColor" /></div>
                  <span className="text-[#A0A0A0] font-[Barlow] text-xs">{(product.avgrating || 0).toFixed(1)} ({product.ratings?.length || 0} reviews)</span>
                </div>
              </div>

              <div className="text-2xl font-bold text-white font-[Barlow] mb-6">{formatPrice(product.price)}</div>

              {/* Sizes */}
              <div className="mb-6">
                <p className="text-[#A0A0A0] font-[Barlow] text-xs mb-3 uppercase tracking-wider">Select Size (UK)</p>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 rounded-lg text-xs font-[Barlow] font-bold border-2 transition-all ${selectedSize === size ? 'border-[#E8000D] bg-[#E8000D]/10 text-white' : 'border-[#1F1F1F] text-[#A0A0A0] hover:border-white'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-8">
                  <p className="text-[#A0A0A0] font-[Barlow] text-xs mb-3 uppercase tracking-wider">Color</p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-[#E8000D] scale-110' : 'border-[#1F1F1F]'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="flex-1 bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all glow-red-sm"
                >
                  <ShoppingCart size={18} /> {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
                </button>
                 <button 
                  onClick={() => {
                    if (!isAuthenticated) { toast.error('Please login first'); navigate('/auth'); return }
                    toggleWishlistMutation.mutate(product._id)
                  }}
                  className={`w-14 h-14 border-2 rounded-xl flex items-center justify-center transition-all ${isWishlisted(product._id) ? 'border-[#E8000D] text-[#E8000D] bg-[#E8000D]/10' : 'border-[#1F1F1F] text-[#A0A0A0] hover:text-white'}`}
                >
                  <Heart size={20} className={isWishlisted(product._id) ? 'fill-[#E8000D]' : ''} />
                </button>
              </div>

              <button 
                onClick={() => navigate(`/product/${product._id}`)}
                className="w-full text-center text-[#A0A0A0] hover:text-white font-[Barlow] text-sm underline underline-offset-4"
              >
                View Full Product Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
