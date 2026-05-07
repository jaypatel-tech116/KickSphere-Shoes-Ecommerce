import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Orders from './pages/Orders'
import NotFound from './pages/NotFound'
import { useAdminAuthStore } from './stores/adminAuthStore'
import api from './lib/axios'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

function useAdminAuth() {
  const { setAdmin, clearAdmin, setChecking } = useAdminAuthStore()
  useEffect(() => {
    setChecking(true)
    api.get('/user/getcurrentadmin')
      .then((res) => {
        // API returns { email, role } directly
        setAdmin(res.data || {})
      })
      .catch(() => clearAdmin())
  }, [setAdmin, clearAdmin, setChecking])
}

function PageWrapper({ children, title }) {
  const location = useLocation()
  useEffect(() => {
    document.title = title ? `${title} | KickSphere Admin` : 'KickSphere Admin'
  }, [title])

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

function AdminRoute({ children }) {
  const { isAuthenticated, isChecking } = useAdminAuthStore()
  if (isChecking) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-12 h-12 border-4 border-[#1F1F1F] border-t-[#E8000D] rounded-full animate-spin"></div>
    </div>
  )
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return children
}

function AdminLayout() {
  useAdminAuth()
  const location = useLocation()
  const isLogin = location.pathname === '/login'

  if (isLogin) return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageWrapper title="Login"><Login /></PageWrapper>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AnimatePresence>
  )

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 overflow-auto min-w-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<AdminRoute><PageWrapper title="Dashboard"><Dashboard /></PageWrapper></AdminRoute>} />
            <Route path="/products" element={<AdminRoute><PageWrapper title="Products"><Products /></PageWrapper></AdminRoute>} />
            <Route path="/orders" element={<AdminRoute><PageWrapper title="Orders"><Orders /></PageWrapper></AdminRoute>} />
            <Route path="*" element={<PageWrapper title="404 Not Found"><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AdminLayout />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#111', color: '#fff', border: '1px solid #1F1F1F', fontFamily: 'Barlow, sans-serif' },
            success: { iconTheme: { primary: '#E8000D', secondary: '#fff' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
