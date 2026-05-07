import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useWishlist } from '../hooks/useWishlist'
import { useWishlistStore } from '../stores/wishlistStore'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

function formatPrice(p) { return `₹${Number(p).toLocaleString('en-IN')}` }

export default function Wishlist() {
  const { items } = useWishlistStore()
  const { toggleWishlistMutation, isLoading } = useWishlist()
  const { addToCartMutation } = useCart()
  const { isAuthenticated } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => { document.title = 'Wishlist | KickSphere' }, [])

  const handleMoveToCart = (product) => {
    if (!isAuthenticated) { toast.error('Please login first'); navigate('/auth'); return }
    const firstSize = product.sizes?.[0]
    if (!firstSize) { toast.error('No sizes available'); return }
    addToCartMutation.mutate({ itemId: product._id, size: firstSize, color: product.colors?.[0] })
    toggleWishlistMutation.mutate(product._id)
  }

  if (items.length === 0) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-center py-20">
        <Heart size={80} className="text-[#1F1F1F] mx-auto mb-4" />
        <h2 className="font-[Bebas_Neue] text-4xl text-white tracking-wide mb-2">YOUR WISHLIST IS EMPTY</h2>
        <p className="text-[#A0A0A0] font-[Barlow] mb-8">Save your favourite kicks for later.</p>
        <Link to="/collection" className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-bold px-8 py-4 rounded-xl transition-colors inline-block">
          Explore Collection
        </Link>
      </motion.div>
    </div>
  )

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-[Bebas_Neue] text-4xl text-white tracking-wide mb-2">MY WISHLIST</h1>
        <p className="text-[#A0A0A0] font-[Barlow] text-sm mb-8">{items.length} items saved</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <AnimatePresence>
            {items.map((product) => (
              <motion.div key={product._id} initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.9}}
                className="bg-[#111] border border-[#1F1F1F] rounded-xl overflow-hidden">
                <div className="relative aspect-square bg-[#0A0A0A] cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                  <img src={product.image1} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {e.target.src='/Small_Logo.png'; e.target.className='w-full h-full object-contain p-8 opacity-30'}} />
                  <button onClick={(e) => {e.stopPropagation(); toggleWishlistMutation.mutate(product._id); toast.success('Removed from wishlist')}}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-[#E8000D] rounded-full flex items-center justify-center text-white transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-[#A0A0A0] font-[Barlow] text-xs uppercase tracking-wider">{product.brand}</p>
                  <p className="text-white font-[Barlow] font-semibold text-sm mt-0.5 line-clamp-1">{product.name}</p>
                  <p className="text-white font-bold font-[Barlow] mt-1">{formatPrice(product.price)}</p>
                  <button onClick={() => handleMoveToCart(product)}
                    className="mt-3 w-full bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-semibold text-sm py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5">
                    <ShoppingCart size={13} /> Move to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
