import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/axios'

export function useUserOrders() {
  return useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await api.get('/order/userorders')
      return res.data
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true,
  })
}

export function usePlaceOrder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/order/placeorder', data),
    onSuccess: () => {
      // Refresh orders and clear cart cache
      queryClient.invalidateQueries({ queryKey: ['userOrders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function usePlaceRazorpayOrder() {
  return useMutation({
    mutationFn: (data) => api.post('/order/placeorderbyrazorpay', data),
  })
}

export function useVerifyRazorpay() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.post('/order/verifyrazorpay', data),
    onSuccess: () => {
      // Refresh orders and clear cart cache
      queryClient.invalidateQueries({ queryKey: ['userOrders'] })
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
