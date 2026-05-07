import { create } from 'zustand'

export const useCartStore = create((set, get) => ({
  items: [],
  count: 0,

  setCart: (items) =>
    set({ items, count: items.reduce((acc, i) => acc + i.quantity, 0) }),

  addItem: (item) => {
    const items = [...get().items]
    const existingIdx = items.findIndex(
      (i) => i.itemId === item.itemId && i.size === item.size && i.color === item.color
    )
    if (existingIdx > -1) {
      items[existingIdx] = { ...items[existingIdx], quantity: items[existingIdx].quantity + 1 }
    } else {
      items.push({ ...item, quantity: 1 })
    }
    set({ items, count: items.reduce((acc, i) => acc + i.quantity, 0) })
  },

  updateItem: (itemId, size, color, quantity) => {
    const items = get().items.map((i) =>
      i.itemId === itemId && i.size === size && i.color === color
        ? { ...i, quantity }
        : i
    ).filter((i) => i.quantity > 0)
    set({ items, count: items.reduce((acc, i) => acc + i.quantity, 0) })
  },

  removeItem: (itemId, size, color) => {
    const items = get().items.filter(
      (i) => !(i.itemId === itemId && i.size === size && i.color === color)
    )
    set({ items, count: items.reduce((acc, i) => acc + i.quantity, 0) })
  },

  clearCart: () => set({ items: [], count: 0 }),
}))
