import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Don't log out during initial auth check — only after hydration is complete
      const { isChecking } = useAuthStore.getState()
      if (!isChecking) {
        useAuthStore.getState().clearUser()
      }
    }
    return Promise.reject(err)
  }
)

export default api
