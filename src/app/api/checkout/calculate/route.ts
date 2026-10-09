import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { OrderCalculationSummary } from '@/types'
import { NORD_JAPANDI_PRODUCTS } from '@/data/products'

const COUPON_DISCOUNTS: Record<string, number> = {
  ARCHITECT10: 10,
  NOBLE15: 15,
  WELCOME5: 5,
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, deliveryMethod = 'standard', couponCode } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart items are required for calculation.' }, { status: 400 })
    }

    const productIds = items.map((i: any) => i.productId || i.id)
    let verifiedProducts: any[] = []

    try {
      const supabase = await createClient()
      const { data: dbProducts, error } = await supabase
        .from('products')
        .select('id, name, price, discount_price, stock')
        .in('id', productIds)

      if (!error && dbProducts && dbProducts.length > 0) {
        verifiedProducts = dbProducts
      }
    } catch (err) {
      console.warn('Supabase product query fallback to Nord-Japandi catalog:', err)
    }

    // Merge with master catalog for complete resilience
    const productMap = new Map<string, any>()
    NORD_JAPANDI_PRODUCTS.forEach((p) => productMap.set(p.id, p))
    verifiedProducts.forEach((p) => productMap.set(p.id, p))

    const allVerifiedList = Array.from(productMap.values())

    return NextResponse.json(computeOrderSummary(items, allVerifiedList, deliveryMethod, couponCode))
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server calculation failed' }, { status: 500 })
  }
}

function computeOrderSummary(
  clientItems: any[],
  verifiedProducts: any[],
  deliveryMethod: string,
  couponCode?: string
): OrderCalculationSummary {
  let subtotal = 0
  const validatedItems: OrderCalculationSummary['items'] = []

  const productMap = new Map(verifiedProducts.map((p) => [p.id, p]))

  for (const item of clientItems) {
    const pId = item.productId || item.id
    let product = productMap.get(pId)

    // If not found by ID, match by item payload if price is present
    if (!product && item.product) {
      product = item.product
    }

    if (!product) continue

    const quantity = Math.max(1, parseInt(item.quantity) || 1)
    const unitPrice = Number(product.discount_price ?? product.price ?? item.price ?? 0)
    const itemTotal = unitPrice * quantity
    subtotal += itemTotal

    validatedItems.push({
      productId: product.id || pId,
      name: product.name || 'Architectural Piece',
      quantity,
      unitPrice,
      itemTotal,
      selectedColor: item.selectedColor,
    })
  }

  // Server-side Coupon validation
  let discountAmount = 0
  let appliedCoupon: string | null = null
  if (couponCode) {
    const cleanCode = couponCode.trim().toUpperCase()
    if (COUPON_DISCOUNTS[cleanCode]) {
      const discountPercent = COUPON_DISCOUNTS[cleanCode]
      discountAmount = Math.round((subtotal * discountPercent) / 100)
      appliedCoupon = cleanCode
    }
  }

  // Shipping Fee calculation (Free Standard vs Express ₹499)
  const shippingFee = deliveryMethod === 'express' ? 499 : 0

  // 18% GST calculation on discounted taxable subtotal
  const taxableAmount = Math.max(0, subtotal - discountAmount)
  const taxAmount = Math.round(taxableAmount * 0.18)

  const totalAmount = taxableAmount + taxAmount + shippingFee

  return {
    subtotal,
    discountAmount,
    appliedCoupon,
    taxAmount,
    shippingFee,
    totalAmount,
    items: validatedItems,
  }
}
