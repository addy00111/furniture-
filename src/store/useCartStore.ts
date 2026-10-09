import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { CartItem, Product } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  couponCode: string | null
  discountPercent: number
  isLoading: boolean

  // Drawer controls
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  // Cart item mutations
  addItem: (product: Product, quantity?: number, selectedColor?: string) => void
  removeItem: (productId: string, selectedColor?: string) => void
  updateQuantity: (productId: string, quantity: number, selectedColor?: string) => void
  clearCart: () => void

  // Coupons
  applyCoupon: (code: string) => { success: boolean; message: string }
  removeCoupon: () => void

  // Computed / Helpers
  getSubtotal: () => number
  getItemCount: () => number
  getDiscountAmount: () => number
  getTotal: () => number

  // Cloud Sync
  syncWithSupabase: (userId: string) => Promise<void>
  loadFromSupabase: (userId: string) => Promise<void>
}

// Available promo codes for client previews (strictly re-verified on the server during checkout)
const VALID_COUPONS: Record<string, number> = {
  ARCHITECT10: 10,
  NOBLE15: 15,
  WELCOME5: 5,
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      couponCode: null,
      discountPercent: 0,
      isLoading: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (product: Product, quantity = 1, selectedColor?: string) => {
        const colorToUse = selectedColor || (product.colors && product.colors[0]) || undefined
        const currentItems = get().items
        const existingIndex = currentItems.findIndex(
          (item) => item.product.id === product.id && item.selectedColor === colorToUse
        )

        let newItems: CartItem[]
        if (existingIndex > -1) {
          newItems = currentItems.map((item, index) => {
            if (index === existingIndex) {
              const newQty = Math.min(item.quantity + quantity, product.stock)
              return { ...item, quantity: newQty }
            }
            return item
          })
        } else {
          newItems = [
            ...currentItems,
            {
              id: product.id,
              product,
              quantity: Math.min(quantity, product.stock),
              selectedColor: colorToUse,
            },
          ]
        }

        set({ items: newItems, isOpen: true })
      },

      removeItem: (productId: string, selectedColor?: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedColor === selectedColor)
          ),
        }))
      },

      updateQuantity: (productId: string, quantity: number, selectedColor?: string) => {
        if (quantity <= 0) {
          get().removeItem(productId, selectedColor)
          return
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.selectedColor === selectedColor) {
              const maxStock = item.product.stock || 99
              return { ...item, quantity: Math.min(quantity, maxStock) }
            }
            return item
          }),
        }))
      },

      clearCart: () => {
        set({ items: [], couponCode: null, discountPercent: 0 })
      },

      applyCoupon: (code: string) => {
        const cleanCode = code.trim().toUpperCase()
        if (VALID_COUPONS[cleanCode]) {
          const discount = VALID_COUPONS[cleanCode]
          set({ couponCode: cleanCode, discountPercent: discount })
          return { success: true, message: `Applied ${cleanCode} (${discount}% off)` }
        }
        return { success: false, message: 'Invalid or expired promotional code' }
      },

      removeCoupon: () => {
        set({ couponCode: null, discountPercent: 0 })
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          const unitPrice = item.product.discount_price ?? item.product.price
          return total + unitPrice * item.quantity
        }, 0)
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getDiscountAmount: () => {
        const subtotal = get().getSubtotal()
        const { discountPercent } = get()
        return (subtotal * discountPercent) / 100
      },

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscountAmount()
        return Math.max(0, subtotal - discount)
      },

      syncWithSupabase: async (userId: string) => {
        if (!userId) return
        try {
          const supabase = createClient()
          const items = get().items
          await (supabase.from('user_carts' as any) as any).upsert({
            user_id: userId,
            items: items as any,
            updated_at: new Date().toISOString(),
          })
        } catch (err) {
          console.error('Error syncing cart with Supabase:', err)
        }
      },

      loadFromSupabase: async (userId: string) => {
        if (!userId) return
        try {
          set({ isLoading: true })
          const supabase = createClient()
          const { data } = await (supabase.from('user_carts' as any) as any)
            .select('items')
            .eq('user_id', userId)
            .single()

          if (data && data.items && Array.isArray(data.items) && (data.items as any[]).length > 0) {
            // Merge local and remote
            set({ items: data.items as CartItem[] })
          }
        } catch (err) {
          console.error('Error loading cart from Supabase:', err)
        } finally {
          set({ isLoading: false })
        }
      },
    }),
    {
      name: 'sora-living-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        couponCode: state.couponCode,
        discountPercent: state.discountPercent,
      }),
    }
  )
)
