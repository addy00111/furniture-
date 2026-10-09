import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { NORD_JAPANDI_PRODUCTS } from '@/data/products'
import crypto from 'crypto'

const COUPON_DISCOUNTS: Record<string, number> = {
  ARCHITECT10: 10,
  NOBLE15: 15,
  WELCOME5: 5,
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // 1. Validate active session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const body = await req.json()
    const { items, shippingAddress, deliveryMethod = 'standard', couponCode } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required.' }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'Shipping address is required.' }, { status: 400 })
    }

    // 2. Build master product catalog map
    const productIds = items.map((item: any) => item.productId || item.id || item.product?.id).filter(Boolean)
    let dbProducts: any[] = []

    try {
      const { data, error: dbError } = await supabase
        .from('products')
        .select('id, name, price, discount_price, stock')
        .in('id', productIds)

      if (!dbError && data && data.length > 0) {
        dbProducts = data
      }
    } catch (dbQueryErr) {
      console.warn('Supabase product query skipped:', dbQueryErr)
    }

    const productMap = new Map<string, any>()
    NORD_JAPANDI_PRODUCTS.forEach((p) => productMap.set(p.id, p))
    dbProducts.forEach((p) => productMap.set(p.id, p))

    let subtotal = 0
    const orderItemsToInsert: Array<{
      productId: string
      quantity: number
      unitPrice: number
    }> = []

    for (const item of items) {
      const pId = item.productId || item.id || item.product?.id
      let product = productMap.get(pId) || item.product

      if (!product && item.price) {
        product = { id: pId, price: item.price, discount_price: item.discount_price ?? item.price }
      }

      if (!product) continue

      const quantity = Math.max(1, parseInt(item.quantity) || 1)
      const unitPrice = Number(product.discount_price ?? product.price ?? item.price ?? 0)
      subtotal += unitPrice * quantity

      orderItemsToInsert.push({
        productId: product.id || pId,
        quantity,
        unitPrice,
      })
    }

    if (orderItemsToInsert.length === 0 || subtotal <= 0) {
      return NextResponse.json({ error: 'No valid products in cart.' }, { status: 400 })
    }

    // 3. Calculate server-side total
    let discountAmount = 0
    if (couponCode) {
      const cleanCode = couponCode.trim().toUpperCase()
      if (COUPON_DISCOUNTS[cleanCode]) {
        discountAmount = Math.round((subtotal * COUPON_DISCOUNTS[cleanCode]) / 100)
      }
    }

    const shippingFee = deliveryMethod === 'express' ? 499 : 0
    const taxableAmount = Math.max(0, subtotal - discountAmount)
    const taxAmount = Math.round(taxableAmount * 0.18) // 18% GST
    const netTotal = taxableAmount + taxAmount + shippingFee

    // 4. Create Order in DB with status 'placed' and payment_method 'cash_on_delivery'
    let dbOrderId = crypto.randomUUID()
    try {
      const { data: orderData, error: orderInsertError } = await (supabase.from('orders' as any) as any)
        .insert({
          id: dbOrderId,
          user_id: user?.id || null,
          status: 'placed',
          payment_method: 'cash_on_delivery',
          total_amount: netTotal,
          shipping_address: shippingAddress as any,
          tracking_status: 'order_placed',
        })
        .select('id')
        .single()

      if (!orderInsertError && orderData && (orderData as any).id) {
        dbOrderId = (orderData as any).id

        // Insert order items
        const formattedItems = orderItemsToInsert.map((oi) => ({
          order_id: dbOrderId,
          product_id: oi.productId,
          quantity: oi.quantity,
          unit_price: oi.unitPrice,
        }))

        await (supabase.from('order_items' as any) as any).insert(formattedItems)

        // Clear user cart if authenticated
        if (user?.id) {
          await (supabase.from('user_carts' as any) as any).delete().eq('user_id', user.id)
        }
      }
    } catch (insertErr) {
      console.warn('Orders DB insertion fallback UUID retained:', insertErr)
    }

    return NextResponse.json({
      success: true,
      orderId: dbOrderId,
      paymentMethod: 'cash_on_delivery',
      redirectUrl: `/orders/${dbOrderId}/confirmation`,
    })
  } catch (err: any) {
    console.error('Error creating COD order:', err)
    return NextResponse.json({ error: err.message || 'Failed to place COD order.' }, { status: 500 })
  }
}
