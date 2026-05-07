import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useFilterProducts, usePriceBounds } from '../hooks/useProducts'
import ProductCard, { ProductCardSkeleton } from '../components/ui/ProductCard'

const CATEGORIES = ['Men', 'Women', 'Kids', 'Unisex']
const SUBCATEGORIES = ['Sneakers', 'Formal', 'Sports', 'Casual', 'Boots']
const SORT_OPTIONS = [
  { label: 'Newest', value: 'date', order: 'desc' },
  { label: 'Price: Low to High', value: 'price', order: 'asc' },
  { label: 'Price: High to Low', value: 'price', order: 'desc' },
  { label: 'Top Rated', value: 'rating', order: 'desc' },
]
const PAGE_SIZE = 12

export default function Collection() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = new URLSearchParams(location.search)

  const [filters, setFilters] = useState({
    category: params.get('category') || '',
    subcategory: params.get('subcategory') || '',
    minPrice: 0,
    maxPrice: 10000,
    sortBy: 'date',
    order: 'desc',
    search: params.get('search') || '',
  })
  const [page, setPage] = useState(1)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [infiniteMode, setInfiniteMode] = useState(false)
  const [sortLabel, setSortLabel] = useState('Newest')

  const { data: boundsData } = usePriceBounds()
  const { data, isLoading } = useFilterProducts(filters)

  useEffect(() => {
    if (boundsData) {
      setFilters(prev => ({
        ...prev,
        minPrice: prev.minPrice === 0 ? boundsData.minPrice : prev.minPrice,
        maxPrice: prev.maxPrice === 10000 ? boundsData.maxPrice : prev.maxPrice
      }))
    }
  }, [boundsData])

  useEffect(() => { document.title = 'Collection | KickSphere' }, [])

  const allProducts = data?.products || []
  const searchQuery = filters.search.toLowerCase()
  const filtered = searchQuery
    ? allProducts.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery) ||
        p.brand?.toLowerCase().includes(searchQuery) ||
        p.description?.toLowerCase().includes(searchQuery)
      )
    : allProducts

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const displayed = infiniteMode ? filtered.slice(0, page * PAGE_SIZE) : filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const setFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const clearFilter = (key) => setFilter(key, key === 'minPrice' ? (boundsData?.minPrice || 0) : key === 'maxPrice' ? (boundsData?.maxPrice || 10000) : '')

  const activeFilterChips = [
    filters.category && { key: 'category', label: `Category: ${filters.category}` },
    filters.subcategory && { key: 'subcategory', label: `Type: ${filters.subcategory}` },
    filters.search && { key: 'search', label: `Search: "${filters.search}"` },
  ].filter(Boolean)

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <p className="font-[Bebas_Neue] text-white text-lg tracking-wide mb-3">CATEGORY</p>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.category === cat}
                onChange={() => setFilter('category', filters.category === cat ? '' : cat)}
                className="hidden"
              />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${filters.category === cat ? 'bg-[#E8000D] border-[#E8000D]' : 'border-[#1F1F1F] group-hover:border-[#E8000D]/50'}`}>
                {filters.category === cat && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className={`font-[Barlow] text-sm transition-colors ${filters.category === cat ? 'text-white' : 'text-[#A0A0A0] group-hover:text-white'}`}>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Subcategory */}
      <div>
        <p className="font-[Bebas_Neue] text-white text-lg tracking-wide mb-3">TYPE</p>
        <div className="space-y-2">
          {SUBCATEGORIES.map((sub) => (
            <label key={sub} className="flex items-center gap-2.5 cursor-pointer group">
              <input type="checkbox" checked={filters.subcategory === sub} onChange={() => setFilter('subcategory', filters.subcategory === sub ? '' : sub)} className="hidden" />
              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${filters.subcategory === sub ? 'bg-[#E8000D] border-[#E8000D]' : 'border-[#1F1F1F] group-hover:border-[#E8000D]/50'}`}>
                {filters.subcategory === sub && <div className="w-2 h-2 bg-white rounded-sm" />}
              </div>
              <span className={`font-[Barlow] text-sm transition-colors ${filters.subcategory === sub ? 'text-white' : 'text-[#A0A0A0] group-hover:text-white'}`}>{sub}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <p className="font-[Bebas_Neue] text-white text-lg tracking-wide mb-3">PRICE RANGE</p>
        <div className="space-y-2">
          <input
            type="range"
            min={boundsData?.minPrice || 0}
            max={boundsData?.maxPrice || 10000}
            value={filters.maxPrice}
            onChange={(e) => setFilter('maxPrice', Number(e.target.value))}
            className="w-full accent-[#E8000D]"
          />
          <div className="flex justify-between text-xs text-[#A0A0A0] font-[Barlow]">
            <span>₹{(boundsData?.minPrice || 0).toLocaleString('en-IN')}</span>
            <span className="text-white font-semibold">up to ₹{filters.maxPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <button onClick={() => { setFilters({ category: '', subcategory: '', minPrice: boundsData?.minPrice || 0, maxPrice: boundsData?.maxPrice || 10000, sortBy: 'date', order: 'desc', search: '' }); setPage(1) }} className="w-full border border-[#1F1F1F] hover:border-[#E8000D] text-[#A0A0A0] hover:text-white font-[Barlow] text-sm py-2 rounded-lg transition-all">
        Clear All Filters
      </button>
    </div>
  )

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-[Bebas_Neue] text-4xl text-white tracking-wide">ALL COLLECTION</h1>
            <p className="text-[#A0A0A0] font-[Barlow] text-sm mt-0.5">{filtered.length} Products</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative hidden md:block">
              <select
                value={`${filters.sortBy}-${filters.order}`}
                onChange={(e) => {
                  const opt = SORT_OPTIONS.find((o) => `${o.value}-${o.order}` === e.target.value)
                  if (opt) { setFilter('sortBy', opt.value); setFilter('order', opt.order); setSortLabel(opt.label) }
                }}
                className="bg-[#111] border border-[#1F1F1F] text-white font-[Barlow] text-sm px-4 py-2 rounded-lg outline-none appearance-none pr-8 cursor-pointer"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={`${o.value}-${o.order}`} value={`${o.value}-${o.order}`}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#A0A0A0] pointer-events-none" />
            </div>
            {/* Mobile filter */}
            <button onClick={() => setDrawerOpen(true)} className="md:hidden bg-[#111] border border-[#1F1F1F] text-white px-3 py-2 rounded-lg flex items-center gap-2 font-[Barlow] text-sm">
              <SlidersHorizontal size={14} /> Filters
            </button>
            {/* Infinite toggle */}
            <button
              onClick={() => setInfiniteMode(!infiniteMode)}
              className={`text-xs font-[Barlow] font-semibold px-3 py-2 rounded-lg border transition-all ${infiniteMode ? 'bg-[#E8000D] border-[#E8000D] text-white' : 'border-[#1F1F1F] text-[#A0A0A0] hover:text-white'}`}
            >
              {infiniteMode ? '∞ Infinite' : '# Pages'}
            </button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {activeFilterChips.map((chip) => (
              <div key={chip.key} className="flex items-center gap-1.5 bg-[#E8000D]/10 border border-[#E8000D]/30 text-[#E8000D] text-xs font-[Barlow] px-3 py-1 rounded-full">
                {chip.label}
                <button onClick={() => clearFilter(chip.key)}><X size={10} /></button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Sidebar — desktop */}
          <aside className="hidden md:block w-56 flex-none">
            <div className="bg-[#111] border border-[#1F1F1F] rounded-2xl p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <Filter size={14} className="text-[#E8000D]" />
                <span className="font-[Bebas_Neue] text-white text-lg tracking-wide">FILTERS</span>
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : displayed.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">👟</div>
                <h3 className="font-[Bebas_Neue] text-3xl text-white mb-2">NO PRODUCTS FOUND</h3>
                <p className="text-[#A0A0A0] font-[Barlow]">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  <AnimatePresence>
                    {displayed.map((product, i) => (
                      <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Pagination / Load More */}
                {!infiniteMode && totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-9 h-9 rounded-lg font-[Barlow] text-sm font-semibold transition-all ${page === i + 1 ? 'bg-[#E8000D] text-white' : 'bg-[#111] border border-[#1F1F1F] text-[#A0A0A0] hover:text-white hover:border-[#E8000D]/50'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}

                {infiniteMode && page * PAGE_SIZE < filtered.length && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      className="bg-[#E8000D] hover:bg-[#FF1A1A] text-white font-[Barlow] font-semibold px-8 py-3 rounded-xl transition-colors"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-black/70 z-40 md:hidden" />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-[#0A0A0A] border-r border-[#1F1F1F] z-50 md:hidden overflow-y-auto p-5"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="font-[Bebas_Neue] text-white text-xl">FILTERS</span>
                <button onClick={() => setDrawerOpen(false)}><X size={20} className="text-[#A0A0A0]" /></button>
              </div>
              <FilterPanel />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
