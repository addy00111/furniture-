export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          price: number
          discount_price: number | null
          category: string
          material: string | null
          dimensions: string | null
          colors: string[]
          stock: number
          images: string[]
          featured: boolean
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          price: number
          discount_price?: number | null
          category: string
          material?: string | null
          dimensions?: string | null
          colors?: string[]
          stock?: number
          images: string[]
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          price?: number
          discount_price?: number | null
          category?: string
          material?: string | null
          dimensions?: string | null
          colors?: string[]
          stock?: number
          images?: string[]
          featured?: boolean
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          addresses: Json
          role: 'customer' | 'admin' | 'artisan'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          addresses?: Json
          role?: 'customer' | 'admin' | 'artisan'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          addresses?: Json
          role?: 'customer' | 'admin' | 'artisan'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'pending_payment' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
          total_amount: number
          shipping_address: Json
          tracking_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
          total_amount: number
          shipping_address: Json
          tracking_status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'failed'
          total_amount?: number
          shipping_address?: Json
          tracking_status?: string
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          unit_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          unit_price?: number
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          order_id: string
          razorpay_order_id: string
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          status: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          razorpay_order_id: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          razorpay_order_id?: string
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          status?: 'created' | 'authorized' | 'captured' | 'failed' | 'refunded'
          created_at?: string
          updated_at?: string
        }
      }
      user_carts: {
        Row: {
          id: string
          user_id: string
          items: Json
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          items?: Json
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          items?: Json
          updated_at?: string
        }
      }
      coupons: {
        Row: {
          id: string
          code: string
          discount_percent: number
          max_discount: number | null
          min_order_value: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_percent: number
          max_discount?: number | null
          min_order_value?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_percent?: number
          max_discount?: number | null
          min_order_value?: number | null
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}
