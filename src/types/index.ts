import { Database } from './database'

export type Product = Database['public']['Tables']['products']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']

export interface CartItem {
  id: string // Product ID
  product: Product
  quantity: number
  selectedColor?: string
}

export interface Coupon {
  code: string
  discountPercent: number
  maxDiscount?: number
  minOrderValue?: number
}

export interface ShippingAddress {
  id?: string
  fullName: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault?: boolean
}

export type DeliveryMethodType = 'standard' | 'express'

export interface DeliveryMethod {
  id: DeliveryMethodType
  name: string
  description: string
  price: number
  estimatedDays: string
}

export interface OrderCalculationSummary {
  subtotal: number
  discountAmount: number
  appliedCoupon: string | null
  taxAmount: number
  shippingFee: number
  totalAmount: number
  items: {
    productId: string
    name: string
    quantity: number
    unitPrice: number
    itemTotal: number
    selectedColor?: string
  }[]
}

export interface CheckoutState {
  step: 1 | 2 | 3
  shippingAddress: ShippingAddress | null
  deliveryMethod: DeliveryMethodType
  appliedCouponCode: string | null
}
