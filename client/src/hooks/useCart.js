import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/axios'
import { useCartStore } from '../stores/cartStore'
import { useAuthStore } from '../stores/authStore'

export function useCart() {
  const { setCart, addItem, updateItem, removeItem } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart/get')
      return res.data
    },
    enabled: isAuthenticated,
    retry: false,
  })

  useEffect(() => {
    if (data?.cart?.items) setCart(data.cart.items)
  }, [data, setCart])

  const addToCartMutation = useMutation({
    mutationFn: (item) => api.post('/cart/add', item),
    onMutate: (item) => {
      addItem(item) // optimistic
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.success('Added to cart!')
    },
    onError: (err) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      toast.error(err.response?.data?.message || 'Failed to add to cart')
    },
  })

  const updateCartMutation = useMutation({
    mutationFn: (data) => api.patch('/cart/update', data),
    onMutate: ({ itemId, size, color, quantity }) => {
      if (quantity <= 0) removeItem(itemId, size, color)
      else updateItem(itemId, size, color, quantity)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  return { isLoading, addToCartMutation, updateCartMutation }
}
