import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean

  // Actions
  addItem: (item: Omit<CartItem, 'id'> & { id?: string }) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Computed
  getTotalItems: () => number
  getTotalPrice: () => number
  getSubtotal: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        set((state) => {
          // Check if item with same product+variant already exists
          const existingIndex = state.items.findIndex(
            (i) =>
              i.product_id === item.product_id &&
              i.size === item.size &&
              i.color === item.color
          )

          if (existingIndex >= 0) {
            // Update quantity, respecting max stock
            const existingItem = state.items[existingIndex]
            const newQuantity = Math.min(
              existingItem.quantity + (item.quantity || 1),
              existingItem.max_stock
            )

            const updatedItems = [...state.items]
            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
            }

            return { items: updatedItems, isOpen: true }
          }

          // Add new item
          const newItem: CartItem = {
            id: item.id || `${item.product_id}-${item.size || ''}-${item.color || ''}-${Date.now()}`,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            title: item.title,
            slug: item.slug,
            price: item.price,
            quantity: Math.min(item.quantity || 1, item.max_stock),
            size: item.size || null,
            color: item.color || null,
            color_hex: item.color_hex || null,
            image_url: item.image_url || null,
            max_stock: item.max_stock,
          }

          return { items: [...state.items, newItem], isOpen: true }
        })
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },

      updateQuantity: (itemId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== itemId) }
          }

          return {
            items: state.items.map((item) =>
              item.id === itemId
                ? { ...item, quantity: Math.min(quantity, item.max_stock) }
                : item
            ),
          }
        })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      },
    }),
    {
      name: 'shopseeme-cart',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }),
      // Only persist cart items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
)
