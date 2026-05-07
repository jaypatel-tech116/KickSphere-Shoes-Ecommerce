import axios from 'axios'
import { useAdminAuthStore } from '../stores/adminAuthStore'

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  return url.endsWith('/api') ? url : `${url.replace(/\/$/, '')}/api`
}

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Don't log out during initial auth check — only after hydration is complete
      const { isChecking } = useAdminAuthStore.getState()
      if (!isChecking) {
        useAdminAuthStore.getState().clearAdmin()
      }
    }
    return Promise.reject(err)
  }
)

export default api
