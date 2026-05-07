import { create } from 'zustand'

export const useWishlistStore = create((set, get) => ({
  items: [],
  setItems: (items) => set({ items }),
  isWishlisted: (id) => get().items.some((i) => i._id === id),
}))
