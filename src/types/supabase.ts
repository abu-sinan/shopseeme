// Auto-generated Supabase Database Types
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'admin' | 'super_admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'admin' | 'super_admin'
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          gender: 'men' | 'women' | 'kids' | 'unisex'
          is_active: boolean
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          gender: 'men' | 'women' | 'kids' | 'unisex'
          is_active?: boolean
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          gender?: 'men' | 'women' | 'kids' | 'unisex'
          is_active?: boolean
          sort_order?: number
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          short_description: string | null
          category_id: string | null
          gender: 'men' | 'women' | 'kids' | 'unisex'
          price: number
          discount_price: number | null
          sku: string | null
          stock: number
          is_featured: boolean
          is_new_arrival: boolean
          is_best_seller: boolean
          status: 'active' | 'draft' | 'archived'
          meta_title: string | null
          meta_description: string | null
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          gender: 'men' | 'women' | 'kids' | 'unisex'
          price: number
          discount_price?: number | null
          sku?: string | null
          stock?: number
          is_featured?: boolean
          is_new_arrival?: boolean
          is_best_seller?: boolean
          status?: 'active' | 'draft' | 'archived'
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          description?: string | null
          short_description?: string | null
          category_id?: string | null
          gender?: 'men' | 'women' | 'kids' | 'unisex'
          price?: number
          discount_price?: number | null
          sku?: string | null
          stock?: number
          is_featured?: boolean
          is_new_arrival?: boolean
          is_best_seller?: boolean
          status?: 'active' | 'draft' | 'archived'
          meta_title?: string | null
          meta_description?: string | null
          tags?: string[]
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt_text: string | null
          sort_order: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          url?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          size: string | null
          color: string | null
          color_hex: string | null
          stock: number
          price_modifier: number
          sku: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          size?: string | null
          color?: string | null
          color_hex?: string | null
          stock?: number
          price_modifier?: number
          sku?: string | null
          created_at?: string
        }
        Update: {
          size?: string | null
          color?: string | null
          color_hex?: string | null
          stock?: number
          price_modifier?: number
          sku?: string | null
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_method: 'cod' | 'bkash' | 'nagad' | 'sslcommerz'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          shipping_cost: number
          discount_amount: number
          total: number
          shipping_address: Json
          notes: string | null
          bkash_number: string | null
          bkash_transaction_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_method: 'cod' | 'bkash' | 'nagad' | 'sslcommerz'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal: number
          shipping_cost?: number
          discount_amount?: number
          total: number
          shipping_address: Json
          notes?: string | null
          bkash_number?: string | null
          bkash_transaction_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          notes?: string | null
          bkash_transaction_id?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          title: string
          price: number
          quantity: number
          size: string | null
          color: string | null
          image_url: string | null
          subtotal: number
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          title: string
          price: number
          quantity: number
          size?: string | null
          color?: string | null
          image_url?: string | null
          subtotal: number
        }
        Update: never
      }
      banners: {
        Row: {
          id: string
          title: string
          subtitle: string | null
          cta_text: string | null
          cta_url: string | null
          image_url: string
          mobile_image_url: string | null
          is_active: boolean
          sort_order: number
          starts_at: string | null
          ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          subtitle?: string | null
          cta_text?: string | null
          cta_url?: string | null
          image_url: string
          mobile_image_url?: string | null
          is_active?: boolean
          sort_order?: number
          starts_at?: string | null
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          subtitle?: string | null
          cta_text?: string | null
          cta_url?: string | null
          image_url?: string
          mobile_image_url?: string | null
          is_active?: boolean
          sort_order?: number
          starts_at?: string | null
          ends_at?: string | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_orders: number
          pending_orders: number
          total_revenue: number
          total_customers: number
          total_products: number
          low_stock_products: number
        }[]
      }
    }
    Enums: {
      user_role: 'customer' | 'admin' | 'super_admin'
      gender_type: 'men' | 'women' | 'kids' | 'unisex'
      product_status: 'active' | 'draft' | 'archived'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      payment_method: 'cod' | 'bkash' | 'nagad' | 'sslcommerz'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    }
  }
}
