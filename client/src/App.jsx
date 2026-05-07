import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Collection from './pages/Collection'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'
import Auth from './pages/Auth'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import { useAuth } from './hooks/useAuth'
import { useAuthStore } from './stores/authStore'
import { useWishlist } from './hooks/useWishlist'
import { useCart } from './hooks/useCart'
import ScrollToTop from './components/ui/ScrollToTop'
import GoToTop from './components/ui/GoToTop'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 30 * 1000, // 30 seconds
    }
  },
})

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'

function PageWrapper({ children, title }) {
  const location = useLocation()
  useEffect(() => {
    document.title = title ? `${title} | KickSphere` : 'KickSphere'
  }, [title])

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  )
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isChecking } = useAuthStore()
  if (isChecking) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-12 h-12 border-4 border-[#1F1F1F] border-t-[#E8000D] rounded-full animate-spin"></div>
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/auth" replace />
  return children
}

function AppInner() {
  useAuth() // hydrate auth store on mount
  useWishlist() // sync wishlist
  useCart() // sync cart
  const location = useLocation()
  const noFooterRoutes = ['/auth']
  const showFooter = !noFooterRoutes.includes(location.pathname)

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper title="Home"><Home /></PageWrapper>} />
            <Route path="/collection" element={<PageWrapper title="Collection"><Collection /></PageWrapper>} />
            <Route path="/product/:id" element={<PageWrapper title="Product"><ProductDetail /></PageWrapper>} />
            <Route path="/auth" element={<PageWrapper title="Sign In"><Auth /></PageWrapper>} />
            <Route path="/cart" element={<PageWrapper title="Cart"><Cart /></PageWrapper>} />
            <Route path="/checkout" element={<ProtectedRoute><PageWrapper title="Checkout"><Checkout /></PageWrapper></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><PageWrapper title="Orders"><Orders /></PageWrapper></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><PageWrapper title="Wishlist"><Wishlist /></PageWrapper></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageWrapper title="Profile"><Profile /></PageWrapper></ProtectedRoute>} />
            <Route path="/about" element={<PageWrapper title="About"><About /></PageWrapper>} />
            <Route path="/contact" element={<PageWrapper title="Contact"><Contact /></PageWrapper>} />
            <Route path="*" element={<PageWrapper title="404 Not Found"><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
      <GoToTop />
    </div>
  )
}

export default function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <AppInner />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#111', color: '#fff', border: '1px solid #1F1F1F', fontFamily: 'Barlow, sans-serif' },
              success: { iconTheme: { primary: '#E8000D', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  )
}
