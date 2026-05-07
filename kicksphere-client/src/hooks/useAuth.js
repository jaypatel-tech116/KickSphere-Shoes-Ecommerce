import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import api from '../lib/axios'
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const { setUser, clearUser, setChecking } = useAuthStore()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await api.get('/user/getcurrentuser')
      return res.data
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  useEffect(() => {
    if (isLoading) {
      setChecking(true)
      return
    }
    if (data) {
      setUser(data)
    } else {
      // Query finished but no data (error/401) — mark as done, not logged in
      clearUser()
    }
  }, [data, isError, isLoading, setUser, clearUser, setChecking])

  return { isLoading }
}
