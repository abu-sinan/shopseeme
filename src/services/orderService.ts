import { createClient, createMutationClient } from '@/lib/supabase/server'
import { generateOrderNumber } from '@/utils'
import type { Database } from '@/types/supabase'
import type { Order, CartItem, CheckoutFormData } from '@/types'

type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
type OrderUpdate = Database['public']['Tables']['orders']['Update']

/**
 * Create a new order from cart items + checkout form
 */
export async function createOrder(
  items: CartItem[],
  formData: CheckoutFormData,
  userId?: string
): Promise<{ order: Order | null; error: string | null }> {
  if (!items.length) {
    return { order: null, error: 'Cart is empty' }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal >= 2000 ? 0 : 80
  const total = subtotal + shippingCost

  const shippingAddress = {
    full_name: formData.full_name,
    phone: formData.phone,
    email: formData.email || '',
    address_line1: formData.address_line1,
    address_line2: formData.address_line2 || '',
    city: formData.city,
    district: formData.district,
    postal_code: formData.postal_code || '',
    country: 'Bangladesh',
  }

  const orderPayload: OrderInsert = {
    order_number: generateOrderNumber(),
    user_id: userId || null,
    status: 'pending',
    payment_method: formData.payment_method,
    payment_status: 'pending',
    subtotal,
    shipping_cost: shippingCost,
    discount_amount: 0,
    total,
    shipping_address: shippingAddress,
    notes: formData.notes || null,
    bkash_number: formData.bkash_number || null,
    bkash_transaction_id: formData.bkash_transaction_id || null,
  }

  const db = createMutationClient()

  const { data: order, error: orderError } = await db
    .from('orders')
    .insert(orderPayload)
    .select()
    .single()

  if (orderError || !order) {
    console.error('Order creation error:', orderError)
    return { order: null, error: 'Failed to create order. Please try again.' }
  }

  const orderItemsPayload: OrderItemInsert[] = items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id || null,
    title: item.title,
    price: item.price,
    quantity: item.quantity,
    size: item.size || null,
    color: item.color || null,
    image_url: item.image_url || null,
    subtotal: item.price * item.quantity,
  }))

  const { error: itemsError } = await db
    .from('order_items')
    .insert(orderItemsPayload)

  if (itemsError) {
    console.error('Order items error:', itemsError)
    return { order: null, error: 'Failed to process order items.' }
  }

  return { order: order as Order, error: null }
}

/**
 * Get orders for a user
 */
export async function getUserOrders(userId: string): Promise<Order[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return []
  return (data as Order[]) || []
}

/**
 * Get single order by ID (validates ownership)
 */
export async function getOrderById(
  orderId: string,
  userId?: string
): Promise<Order | null> {
  const supabase = await createClient()
  let query = supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)

  if (userId) query = query.eq('user_id', userId)

  const { data, error } = await query.single()
  if (error || !data) return null
  return data as Order
}

/**
 * Admin: Get all orders with pagination
 */
export async function getAdminOrders(
  page = 1,
  limit = 20
): Promise<{ orders: Order[]; total: number }> {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('orders')
    .select('*, order_items(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) return { orders: [], total: 0 }
  return { orders: (data as Order[]) || [], total: count || 0 }
}

/**
 * Admin: Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order['status']
): Promise<{ success: boolean; error?: string }> {
  const updatePayload: OrderUpdate = {
    status,
    updated_at: new Date().toISOString(),
  }

  const db = createMutationClient()
  const { error } = await db
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId)

  if (error) return { success: false, error: error.message }
  return { success: true }
}
