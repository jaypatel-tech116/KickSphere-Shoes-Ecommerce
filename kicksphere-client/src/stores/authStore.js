import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isChecking: true,
  setUser: (user) => set({ user, isAuthenticated: true, isChecking: false }),
  clearUser: () => set({ user: null, isAuthenticated: false, isChecking: false }),
  setChecking: (val) => set({ isChecking: val }),
}))
