'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag, Truck } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import { FINISH_IMAGE_MAP, FALLBACK_PRODUCT_IMAGE } from '@/data/products'
import Link from 'next/link'

const FREE_SHIPPING_THRESHOLD = 100000

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    discountPercent,
    couponCode,
  } = useCartStore()

  const subtotal = getSubtotal()
  const discountAmount = getDiscountAmount()
  const total = getTotal()

  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className="w-screen max-w-md bg-[#FAF7F2] text-[#1C1917] shadow-2xl flex flex-col border-l border-[#E5DFD7]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#E5DFD7] flex items-center justify-between bg-[#F4EFEA]">
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-5 h-5 text-[#1C1917]" />
                  <h2 className="font-sans text-base font-bold tracking-tight text-[#1C1917]">Shopping Bag</h2>
                  <span className="text-[11px] font-sans font-semibold bg-[#EAE3D9] px-2.5 py-0.5 rounded-full text-[#44403C] border border-[#D6CEC4]">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} {items.reduce((acc, i) => acc + i.quantity, 0) === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-[#57534E] hover:text-[#1C1917] hover:bg-[#EAE3D9] rounded-sm transition-colors"
                  aria-label="Close Bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              {items.length > 0 && (
                <div className="bg-[#FAF7F2] px-6 py-3 border-b border-[#E5DFD7] space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-[#44403C]">
                      <Truck className="w-3.5 h-3.5 text-[#B45309]" />
                      {remainingForFreeShipping === 0 ? (
                        <span className="text-[#B45309] font-semibold">You unlocked Free White-Glove Delivery!</span>
                      ) : (
                        <span>
                          Add <strong className="text-[#1C1917] font-semibold">{formatPrice(remainingForFreeShipping)}</strong> for Free Delivery
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-[11px] text-[#57534E]">{freeShippingProgress}%</span>
                  </div>
                  <div className="w-full bg-[#E5DFD7] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#B45309] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E5DFD7]">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#F4EFEA] border border-[#E5DFD7] flex items-center justify-center text-[#57534E]">
                      <ShoppingBag className="w-7 h-7 stroke-[1.5]" />
                    </div>
                    <p className="font-serif text-xl font-normal text-[#1C1917]">Your shopping bag is empty</p>
                    <p className="text-xs text-[#57534E] max-w-xs leading-relaxed">
                      Discover our architectural furniture collections crafted from solid timber, stone, and noble fabrics.
                    </p>
                    <Link
                      href="/catalog"
                      onClick={closeCart}
                      className="mt-4 px-6 py-3 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524] transition-colors inline-block"
                    >
                      Shop Collection
                    </Link>
                  </div>
                ) : (
                  items.map((item) => {
                    const price = item.product.discount_price ?? item.product.price
                    return (
                      <div key={`${item.product.id}-${item.selectedColor}`} className="py-4 flex gap-4">
                        <Link
                          href={`/products/${item.product.id}`}
                          onClick={closeCart}
                          className="w-20 h-20 rounded-sm overflow-hidden bg-[#EFE9E1] border border-[#E5DFD7] relative shrink-0 block"
                        >
                          <img
                            src={
                              (item.selectedColor && FINISH_IMAGE_MAP[item.selectedColor]) ||
                              item.product.images?.[0] ||
                              FALLBACK_PRODUCT_IMAGE
                            }
                            alt={item.product.name}
                            onError={(e) => {
                              e.currentTarget.src = FALLBACK_PRODUCT_IMAGE
                            }}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                          />
                        </Link>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <Link
                                href={`/products/${item.product.id}`}
                                onClick={closeCart}
                                className="text-xs font-semibold text-[#1C1917] hover:underline line-clamp-1"
                              >
                                {item.product.name}
                              </Link>
                              <button
                                onClick={() => removeItem(item.product.id, item.selectedColor)}
                                className="text-[#8C827A] hover:text-red-700 transition-colors p-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            {item.selectedColor && (
                              <p className="text-[11px] text-[#57534E] mt-0.5">Finish: <span className="font-medium text-[#1C1917]">{item.selectedColor}</span></p>
                            )}
                            <p className="text-xs font-sans text-[#1C1917] font-bold mt-1">
                              {formatPrice(price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-[#D6CEC4] rounded-sm bg-[#FAF7F2]">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)
                                }
                                className="p-1.5 hover:bg-[#EAE3D9] text-[#44403C] transition-colors disabled:opacity-40"
                                disabled={item.quantity <= 1}
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-3 text-xs font-sans font-bold text-[#1C1917]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)
                                }
                                className="p-1.5 hover:bg-[#EAE3D9] text-[#44403C] transition-colors disabled:opacity-40"
                                disabled={item.quantity >= item.product.stock}
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="text-xs font-sans font-bold text-[#1C1917]">
                              {formatPrice(price * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer / Summary */}
              {items.length > 0 && (
                <div className="p-6 border-t border-[#E5DFD7] bg-[#F4EFEA] space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-[#57534E]">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-sans font-semibold text-[#1C1917]">{formatPrice(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#B45309] font-medium">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5" />
                          Discount ({couponCode})
                        </span>
                        <span className="font-sans font-bold">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#57534E]">
                      <span className="font-medium">White-Glove Delivery</span>
                      <span className="font-sans font-semibold text-[#B45309]">
                        {remainingForFreeShipping === 0 ? 'FREE' : 'Calculated at checkout'}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-semibold text-[#1C1917] pt-2 border-t border-[#E5DFD7]">
                      <span>Estimated Total</span>
                      <span className="font-sans text-base font-bold text-[#1C1917]">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="py-3 px-4 text-center border border-[#D6CEC4] bg-[#FAF7F2] text-[#1C1917] text-xs uppercase tracking-wider font-semibold hover:bg-[#EAE3D9] transition-colors rounded-sm"
                    >
                      View Cart
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="py-3 px-4 text-center bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#292524] transition-colors rounded-sm flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-center space-x-1.5 text-[11px] text-[#57534E] pt-1">
                    <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                    <span className="font-medium">Secure Checkout • 10-Year Warranty</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
