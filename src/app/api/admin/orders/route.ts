import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/admin/orders - List all customer orders
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          quantity,
          unit_price,
          product_id,
          products (
            id,
            name,
            images,
            category
          )
        ),
        payments (
          id,
          razorpay_order_id,
          razorpay_payment_id,
          status,
          created_at
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('Orders query returned error/fallback:', error.message)
    }

    return NextResponse.json({ orders: orders || [] })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch orders' }, { status: 500 })
  }
}

// PATCH /api/admin/orders - Update order status or tracking status
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await req.json()
    const { orderId, status, tracking_status } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }
    if (status) updates.status = status
    if (tracking_status) updates.tracking_status = tracking_status

    const { data, error } = await (supabase.from('orders' as any) as any)
      .update(updates)
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, order: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order status' }, { status: 500 })
  }
}
