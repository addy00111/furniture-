'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Minus, Trash2, ArrowRight, Tag, ShieldCheck, ShoppingBag, Check, AlertCircle } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuthModal } from '@/components/auth/AuthModal'

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    couponCode,
    discountPercent,
    applyCoupon,
    removeCoupon,
  } = useCartStore()

  const [inputCoupon, setInputCoupon] = useState('')
  const [couponFeedback, setCouponFeedback] = useState<{ success?: boolean; message?: string } | null>(null)

  const subtotal = getSubtotal()
  const discountAmount = getDiscountAmount()
  const total = getTotal()

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCoupon.trim()) return

    const res = applyCoupon(inputCoupon)
    setCouponFeedback(res)
    if (res.success) {
      setInputCoupon('')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />
      <CartDrawer />
      <AuthModal />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 w-full">
        <div className="space-y-2 mb-8">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
            Atelier Manifest
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-[#1C1917]">
            Your Spatial Bag
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-24 text-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] space-y-5">
            <div className="w-16 h-16 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] mx-auto flex items-center justify-center text-[#78716C]">
              <ShoppingBag className="w-7 h-7 stroke-[1.2]" />
            </div>
            <h2 className="font-serif text-2xl font-normal">Your spatial bag is currently empty</h2>
            <p className="text-xs text-[#78716C] max-w-md mx-auto font-light leading-relaxed">
              Our architectural masterpieces are handcrafted in limited batches. Explore the catalog to discover timeless pieces for your interior.
            </p>
            <div className="pt-2">
              <Link
                href="/#collections"
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.16em] font-semibold hover:bg-[#3E3835] transition-all rounded-sm shadow-nord"
              >
                <span>Browse The Atelier</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Items List */}
            <div className="lg:col-span-8 bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 divide-y divide-[#E5DFD7]">
              <div className="pb-4 hidden sm:grid grid-cols-12 text-[11px] font-sans uppercase tracking-[0.14em] text-[#78716C]">
                <div className="col-span-6">Archetype & Details</div>
                <div className="col-span-3 text-center">Units</div>
                <div className="col-span-3 text-right">Subtotal</div>
              </div>

              {items.map((item) => {
                const unitPrice = item.product.discount_price ?? item.product.price
                const itemTotal = unitPrice * item.quantity

                return (
                  <motion.div
                    key={`${item.product.id}-${item.selectedColor}`}
                    layout
                    className="py-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                  >
                    {/* Item Details */}
                    <div className="col-span-6 flex gap-4 w-full">
                      <div className="w-24 h-24 rounded-sm overflow-hidden bg-[#EFE9E1] border border-[#E5DFD7] shrink-0">
                        {item.product.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="flex-1 space-y-1">
                        <span className="text-[9px] font-sans uppercase tracking-[0.16em] text-[#78716C]">
                          {item.product.category}
                        </span>
                        <h3 className="font-serif text-base font-normal text-[#1C1917] leading-snug">
                          {item.product.name}
                        </h3>
                        {item.selectedColor && (
                          <p className="text-[11px] text-[#78716C]">Finish: {item.selectedColor}</p>
                        )}
                        <p className="text-xs font-sans font-semibold text-[#1C1917] pt-1">
                          {formatPrice(unitPrice)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="col-span-3 flex sm:justify-center items-center gap-3 w-full sm:w-auto">
                      <div className="flex items-center border border-[#E5DFD7] rounded-none bg-[#FAF7F2]">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)
                          }
                          className="p-2 hover:bg-[#EFE9E1] text-[#78716C] transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3.5 text-xs font-sans font-semibold text-[#1C1917]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)
                          }
                          className="p-2 hover:bg-[#EFE9E1] text-[#78716C] transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id, item.selectedColor)}
                        className="p-2 text-[#A89F91] hover:text-red-700 transition-colors"
                        title="Remove piece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Line Total */}
                    <div className="col-span-3 text-right w-full sm:w-auto">
                      <span className="font-sans text-sm font-semibold text-[#1C1917]">
                        {formatPrice(itemTotal)}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Order Summary & Coupons */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 space-y-6 shadow-nord">
                <h2 className="font-serif text-xl font-normal tracking-tight text-[#1C1917]">
                  Acquisition Financials
                </h2>

                {/* Promo Code Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-sans uppercase tracking-[0.14em] text-[#78716C]">
                    Atelier Promo Code
                  </label>
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-[#A89F91] absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={(e) => setInputCoupon(e.target.value)}
                        placeholder="ARCHITECT10 / NOBLE15"
                        className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-[#FAF7F2] border border-[#E5DFD7] rounded-none focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#292524] text-[#FAF7F2] text-[10px] uppercase tracking-[0.14em] font-semibold rounded-sm hover:bg-[#3E3835] transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {couponFeedback && (
                    <p
                      className={`text-xs flex items-center gap-1.5 ${
                        couponFeedback.success ? 'text-[#B45309]' : 'text-red-700'
                      }`}
                    >
                      {couponFeedback.success ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{couponFeedback.message}</span>
                    </p>
                  )}

                  {couponCode && (
                    <div className="inline-flex items-center space-x-2 bg-[#FAF7F2] text-[#B45309] border border-[#E5DFD7] px-2.5 py-1 text-xs font-sans">
                      <span>{couponCode} ({discountPercent}% applied)</span>
                      <button
                        onClick={removeCoupon}
                        className="text-[#1C1917] hover:text-red-700 font-bold ml-1"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-[#E5DFD7] text-xs">
                  <div className="flex justify-between text-[#78716C]">
                    <span>Subtotal</span>
                    <span className="font-sans text-[#1C1917]">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#B45309] font-medium">
                      <span>Promo Discount</span>
                      <span className="font-sans">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#78716C]">
                    <span>White-Glove Placement</span>
                    <span className="font-sans text-[#B45309] font-medium">COMPLIMENTARY</span>
                  </div>

                  <div className="flex justify-between text-base font-medium text-[#1C1917] pt-4 border-t border-[#E5DFD7]">
                    <span>Estimated Total</span>
                    <span className="font-sans text-xl font-semibold">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#3E3835] transition-all flex items-center justify-center space-x-2 shadow-nord"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="flex items-center justify-center space-x-2 text-[11px] text-[#78716C] pt-2 font-light">
                  <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                  <span>256-bit Encrypted Checkout Verification</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
