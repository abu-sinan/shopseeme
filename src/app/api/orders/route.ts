import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkoutSchema } from '@/lib/validations'
import { generateOrderNumber } from '@/utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, formData, userId } = body

    // Validate form data
    const parsed = checkoutSchema.safeParse(formData)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Validate max items
    if (items.length > 50) {
      return NextResponse.json({ error: 'Too many items in cart' }, { status: 400 })
    }

    const supabase = await createClient()
    const data = parsed.data

    const subtotal = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    )
    const shippingCost = subtotal >= 2000 ? 0 : 80
    const total = subtotal + shippingCost

    // Sanity check on total
    if (total <= 0 || total > 1000000) {
      return NextResponse.json({ error: 'Invalid order total' }, { status: 400 })
    }

    const shippingAddress = {
      full_name: data.full_name,
      phone: data.phone,
      email: data.email || '',
      address_line1: data.address_line1,
      address_line2: data.address_line2 || '',
      city: data.city,
      district: data.district,
      postal_code: data.postal_code || '',
      country: 'Bangladesh',
    }

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: generateOrderNumber(),
        user_id: userId || null,
        status: 'pending',
        payment_method: data.payment_method,
        payment_status: 'pending',
        subtotal,
        shipping_cost: shippingCost,
        discount_amount: 0,
        total,
        shipping_address: shippingAddress,
        notes: data.notes || null,
        bkash_number: data.bkash_number || null,
        bkash_transaction_id: data.bkash_transaction_id || null,
      })
      .select()
      .single()

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    // Create order items
    const orderItems = items.map((item: {
      product_id: string
      variant_id?: string | null
      title: string
      price: number
      quantity: number
      size?: string | null
      color?: string | null
      image_url?: string | null
    }) => ({
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

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items error:', itemsError)
      // Try to clean up the order
      await supabase.from('orders').delete().eq('id', order.id)
      return NextResponse.json({ error: 'Failed to process order items' }, { status: 500 })
    }

    return NextResponse.json({ order }, { status: 201 })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
    }

    return NextResponse.json({ orders })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
