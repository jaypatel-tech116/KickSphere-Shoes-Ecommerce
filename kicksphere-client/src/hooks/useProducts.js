import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import api from '../lib/axios'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/product/listproduct')
      return res.data
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useSingleProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/product/singleproduct/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export function useFilterProducts(filters) {
  return useQuery({
    queryKey: ['filterProducts', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.category) params.append('category', filters.category)
      if (filters.subcategory) params.append('subcategory', filters.subcategory)
      if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice)
      if (filters.sortBy) params.append('sortBy', filters.sortBy)
      if (filters.order) params.append('order', filters.order)
      const res = await api.get(`/product/filterproduct?${params.toString()}`)
      return res.data
    },
    staleTime: 1000 * 60 * 2,
  })
}

export function useBestsellers() {
  return useQuery({
    queryKey: ['bestsellers'],
    queryFn: async () => {
      const res = await api.get('/product/filterproduct?sortBy=soldCount&order=desc')
      const products = res.data?.products || []
      return products.slice(0, 10)
    },
    staleTime: 1000 * 60 * 5,
  })
}
export function usePriceBounds() {
  return useQuery({
    queryKey: ['priceBounds'],
    queryFn: async () => {
      const res = await api.get('/product/price-bounds')
      return res.data
    },
    staleTime: 1000 * 60 * 10,
  })
}
