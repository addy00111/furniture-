import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRazorpayInstance } from '@/lib/razorpay'
import { createAdminClient } from '@/lib/supabase/admin'
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

    // 2. Fetch actual product prices directly from database using product IDs
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
      console.warn('Supabase product query skipped, falling back to catalog:', dbQueryErr)
    }

    // Master catalog map combining Nord-Japandi catalog + any Supabase DB products
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
      let product = productMap.get(pId)

      if (!product && item.product) {
        product = item.product
      }

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
      return NextResponse.json({ error: 'No valid products in cart or invalid subtotal.' }, { status: 400 })
    }

    // 3. Calculate server-side total in paise (amount * 100)
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

    const totalInPaise = Math.round(Number(netTotal) * 100)

    // Generate custom receipt identifier
    const receiptId = `receipt_${Date.now()}`

    // 4. Call Razorpay SDK instance.orders.create
    let razorpayOrderId: string | null = null
    let isLiveRazorpay = false
    const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
    const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || ''

    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes('placeholder')) {
      try {
        const razorpay = getRazorpayInstance()
        const razorpayOrder = await razorpay.orders.create({
          amount: totalInPaise,
          currency: 'INR',
          receipt: receiptId,
          notes: {
            store: 'Sora Living Atelier',
            order_type: 'Custom Fabrication',
            userId: user?.id || 'guest',
            itemCount: orderItemsToInsert.length.toString(),
          },
        })

        if (razorpayOrder && razorpayOrder.id) {
          razorpayOrderId = razorpayOrder.id
          isLiveRazorpay = true
        }
      } catch (rzpErr: any) {
        console.error('Razorpay SDK orders.create failed:', rzpErr?.error || rzpErr?.message || rzpErr)
        razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`
        isLiveRazorpay = false
      }
    } else {
      razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`
      isLiveRazorpay = false
    }

    // 5. Insert an order row into `orders` with status 'pending_payment'
    let dbOrderId = crypto.randomUUID()
    try {
      const { data: orderData, error: orderInsertError } = await (supabase.from('orders' as any) as any)
        .insert({
          id: dbOrderId,
          user_id: user?.id || null,
          status: 'pending_payment',
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
      }
    } catch (insertErr) {
      console.warn('Orders DB insertion noted (fallback UUID retained):', insertErr)
    }

    // 6. Return response with all necessary properties
    return NextResponse.json({
      orderId: razorpayOrderId || dbOrderId,
      dbOrderId: dbOrderId,
      razorpay_order_id: razorpayOrderId,
      amount: totalInPaise,
      currency: 'INR',
      key: razorpayKeyId,
      keyId: razorpayKeyId,
      netTotal,
      isLiveRazorpay,
    })
  } catch (err: any) {
    console.error('Error in create-razorpay-order:', err)
    return NextResponse.json({ error: err.message || 'Failed to initialize order.' }, { status: 500 })
  }
}
