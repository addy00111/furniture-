import { NextRequest, NextResponse } from 'next/server'
import { getRazorpayInstance } from '@/lib/razorpay'
import { createClient } from '@/lib/supabase/server'
import { NORD_JAPANDI_PRODUCTS } from '@/data/products'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
    const key_secret = process.env.RAZORPAY_KEY_SECRET || ''

    const body = await req.json()
    const { items, shippingAddress, deliveryMethod = 'standard', couponCode, amount: passedAmount } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required.' }, { status: 400 })
    }

    // Build master product catalog map
    const productMap = new Map<string, any>()
    NORD_JAPANDI_PRODUCTS.forEach((p) => productMap.set(p.id, p))

    let subtotal = 0
    for (const item of items) {
      const pId = item.productId || item.id || item.product?.id
      let product = productMap.get(pId) || item.product
      const quantity = Math.max(1, parseInt(item.quantity) || 1)
      const unitPrice = Number(product?.discount_price ?? product?.price ?? item.price ?? 0)
      subtotal += unitPrice * quantity
    }

    if (subtotal <= 0 && passedAmount) {
      subtotal = Number(passedAmount)
    }

    const shippingFee = deliveryMethod === 'express' ? 499 : 0
    const taxAmount = Math.round(subtotal * 0.18) // 18% GST
    const netTotal = subtotal + taxAmount + shippingFee

    // Calculate amount in paise: (amount * 100)
    const amountInPaise = Math.round(Number(netTotal) * 100)

    let orderId: string
    let isLiveRazorpay = false

    if (key_id && key_secret && !key_id.includes('placeholder')) {
      try {
        const razorpay = getRazorpayInstance()
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            itemCount: items.length.toString(),
          },
        })

        orderId = order.id
        isLiveRazorpay = true
      } catch (rzpErr: any) {
        console.error('Razorpay API orders.create failed:', rzpErr?.error || rzpErr?.message || rzpErr)
        orderId = `order_${crypto.randomBytes(8).toString('hex')}`
        isLiveRazorpay = false
      }
    } else {
      orderId = `order_${crypto.randomBytes(8).toString('hex')}`
      isLiveRazorpay = false
    }

    const dbOrderId = crypto.randomUUID()
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      await (supabase.from('orders' as any) as any).insert({
        id: dbOrderId,
        user_id: user?.id || null,
        status: 'pending_payment',
        total_amount: netTotal,
        shipping_address: shippingAddress as any,
        tracking_status: 'order_placed',
      })
    } catch (insertErr) {
      console.warn('Orders DB record noted:', insertErr)
    }

    return NextResponse.json({
      orderId: orderId,
      dbOrderId: dbOrderId,
      razorpay_order_id: orderId,
      amount: amountInPaise,
      currency: 'INR',
      key: key_id,
      keyId: key_id,
      netTotal,
      isLiveRazorpay,
    })
  } catch (err: any) {
    console.error('Error in /api/payment/create-order:', err)
    return NextResponse.json({ error: err.message || 'Order creation failed' }, { status: 500 })
  }
}
