import { create } from 'zustand'

export const useAdminAuthStore = create((set) => ({
  admin: null,
  isAuthenticated: false,
  isChecking: true,
  setAdmin: (admin) => set({ admin, isAuthenticated: true, isChecking: false }),
  clearAdmin: () => set({ admin: null, isAuthenticated: false, isChecking: false }),
  setChecking: (val) => set({ isChecking: val }),
}))
