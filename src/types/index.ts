// ============================================================
// ShopSeeMe - Core Application Types
// ============================================================

// ---- User & Auth ----
export type UserRole = 'customer' | 'admin' | 'super_admin'

export interface UserProfile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

// ---- Category ----
export type Gender = 'men' | 'women' | 'kids' | 'unisex'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image_url: string | null
  gender: Gender
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// ---- Product ----
export type ProductStatus = 'active' | 'draft' | 'archived'

export interface Product {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  gender: Gender
  price: number
  discount_price: number | null
  sku: string | null
  stock: number
  is_featured: boolean
  is_new_arrival: boolean
  is_best_seller: boolean
  status: ProductStatus
  meta_title: string | null
  meta_description: string | null
  tags: string[]
  created_at: string
  updated_at: string
  // Joined
  category?: Category
  images?: ProductImage[]
  variants?: ProductVariant[]
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  alt_text: string | null
  sort_order: number
  is_primary: boolean
  created_at: string
}

export interface ProductVariant {
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

// For product listing cards
export interface ProductCard {
  id: string
  title: string
  slug: string
  price: number
  discount_price: number | null
  gender: Gender
  is_featured: boolean
  is_new_arrival: boolean
  is_best_seller: boolean
  primary_image: string | null
  category_name: string | null
}

// ---- Cart ----
export interface CartItem {
  id: string
  product_id: string
  variant_id: string | null
  title: string
  slug: string
  price: number
  quantity: number
  size: string | null
  color: string | null
  color_hex: string | null
  image_url: string | null
  max_stock: number
}

export interface CartState {
  items: CartItem[]
  isOpen: boolean
}

// ---- Order ----
export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded'

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'sslcommerz'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface ShippingAddress {
  full_name: string
  phone: string
  email: string
  address_line1: string
  address_line2?: string
  city: string
  district: string
  postal_code?: string
  country: string
}

export interface Order {
  id: string
  order_number: string
  user_id: string | null
  status: OrderStatus
  payment_method: PaymentMethod
  payment_status: PaymentStatus
  subtotal: number
  shipping_cost: number
  discount_amount: number
  total: number
  shipping_address: ShippingAddress
  notes: string | null
  bkash_number: string | null
  bkash_transaction_id: string | null
  created_at: string
  updated_at: string
  // Joined
  items?: OrderItem[]
  user?: UserProfile
}

export interface OrderItem {
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

// ---- Banner ----
export interface Banner {
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

// ---- Filters ----
export interface ProductFilters {
  gender?: Gender
  category_id?: string
  min_price?: number
  max_price?: number
  sizes?: string[]
  colors?: string[]
  is_featured?: boolean
  is_new_arrival?: boolean
  is_best_seller?: boolean
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
  page?: number
  limit?: number
  search?: string
}

// ---- API Responses ----
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// ---- Form Types ----
export interface CheckoutFormData {
  full_name: string
  phone: string
  email: string
  address_line1: string
  address_line2?: string
  city: string
  district: string
  postal_code?: string
  payment_method: PaymentMethod
  bkash_number?: string
  bkash_transaction_id?: string
  notes?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// ---- Dashboard Analytics ----
export interface DashboardStats {
  total_orders: number
  pending_orders: number
  total_revenue: number
  total_customers: number
  total_products: number
  low_stock_products: number
}

// ---- Size & Color Options ----
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y', '8-9Y', '9-10Y', '10-11Y', '11-12Y'] as const
export type Size = typeof SIZES[number]

export const DISTRICTS = [
  'Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Barishal', 
  'Sylhet', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur',
  'Narayanganj', 'Narsingdi', 'Tangail', 'Faridpur', 'Jessore',
  'Bogra', 'Dinajpur', 'Cox\'s Bazar'
] as const
export type District = typeof DISTRICTS[number]

// ---- Navigation ----
export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}
