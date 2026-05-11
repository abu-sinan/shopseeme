// Auto-generated Supabase Database Types (compatible with @supabase/supabase-js v2.47+)
// Run: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
        Relationships: []
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
        Relationships: []
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
          id?: string
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
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
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
          id?: string
          product_id?: string
          url?: string
          alt_text?: string | null
          sort_order?: number
          is_primary?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
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
          id?: string
          product_id?: string
          size?: string | null
          color?: string | null
          color_hex?: string | null
          stock?: number
          price_modifier?: number
          sku?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
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
          id?: string
          order_number?: string
          user_id?: string | null
          status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
          payment_method?: 'cod' | 'bkash' | 'nagad' | 'sslcommerz'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          subtotal?: number
          shipping_cost?: number
          discount_amount?: number
          total?: number
          shipping_address?: Json
          notes?: string | null
          bkash_number?: string | null
          bkash_transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
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
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          title?: string
          price?: number
          quantity?: number
          size?: string | null
          color?: string | null
          image_url?: string | null
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            referencedRelation: 'products'
            referencedColumns: ['id']
          }
        ]
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
          id?: string
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'admin' | 'super_admin'
      gender_type: 'men' | 'women' | 'kids' | 'unisex'
      product_status: 'active' | 'draft' | 'archived'
      order_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
      payment_method: 'cod' | 'bkash' | 'nagad' | 'sslcommerz'
      payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type helpers matching auto-generated Supabase output
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
