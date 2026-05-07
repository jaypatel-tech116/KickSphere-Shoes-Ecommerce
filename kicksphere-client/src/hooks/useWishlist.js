import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import api from '../lib/axios'
import { useWishlistStore } from '../stores/wishlistStore'
import { useAuthStore } from '../stores/authStore'

export function useWishlist() {
  const { setItems } = useWishlistStore()
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const res = await api.get('/wishlist/get')
      return res.data
    },
    enabled: isAuthenticated,
  })

  useEffect(() => {
    if (data?.products) {
      setItems(data.products)
    } else if (!isAuthenticated) {
      setItems([])
    }
  }, [data, setItems, isAuthenticated])

  const toggleWishlistMutation = useMutation({
    mutationFn: (productId) => api.post('/wishlist/toggle', { productId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] })
    },
  })

  return { isLoading, toggleWishlistMutation }
}
