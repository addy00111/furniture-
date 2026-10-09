'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="absolute inset-0 bg-[#1C1917]/40 backdrop-blur-sm"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FAF7F2] text-[#1C1917] shadow-nord-lg flex flex-col border-l border-[#E5DFD7]"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-[#E5DFD7] flex items-center justify-between bg-[#F4EFEA]">
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#1C1917]" />
                  <h2 className="font-serif text-lg font-normal tracking-wide">Spatial Bag</h2>
                  <span className="text-[10px] font-sans bg-[#EFE9E1] px-2 py-0.5 rounded-none text-[#78716C] border border-[#E5DFD7]">
                    {items.reduce((acc, i) => acc + i.quantity, 0)} Pieces
                  </span>
                </div>
                <button
                  onClick={closeCart}
                  className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFE9E1] rounded-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#E5DFD7]">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                    <div className="w-14 h-14 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] flex items-center justify-center text-[#78716C]">
                      <ShoppingBag className="w-6 h-6 stroke-[1.2]" />
                    </div>
                    <p className="font-serif text-lg font-normal text-[#1C1917]">Your spatial bag is empty</p>
                    <p className="text-xs text-[#78716C] max-w-xs font-light leading-relaxed">
                      Discover our architectural furniture collections and select curated forms for your home.
                    </p>
                    <button
                      onClick={closeCart}
                      className="mt-4 px-6 py-3 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.16em] font-medium rounded-sm hover:bg-[#3E3835] transition-colors"
                    >
                      Browse Atelier
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const price = item.product.discount_price ?? item.product.price
                    return (
                      <div key={`${item.product.id}-${item.selectedColor}`} className="py-4 flex gap-4">
                        <div className="w-20 h-20 rounded-sm overflow-hidden bg-[#EFE9E1] border border-[#E5DFD7] relative shrink-0">
                          {item.product.images?.[0] ? (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-medium text-[#1C1917] line-clamp-1">
                                {item.product.name}
                              </h3>
                              <button
                                onClick={() => removeItem(item.product.id, item.selectedColor)}
                                className="text-[#A89F91] hover:text-red-700 transition-colors ml-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {item.selectedColor && (
                              <p className="text-[11px] text-[#78716C] mt-0.5">Finish: {item.selectedColor}</p>
                            )}
                            <p className="text-xs font-sans text-[#1C1917] font-semibold mt-1">
                              {formatPrice(price)}
                            </p>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-[#E5DFD7] rounded-none bg-[#F4EFEA]">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity - 1, item.selectedColor)
                                }
                                className="p-1 hover:bg-[#EFE9E1] text-[#78716C] transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="px-3 text-xs font-sans font-medium text-[#1C1917]">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.quantity + 1, item.selectedColor)
                                }
                                className="p-1 hover:bg-[#EFE9E1] text-[#78716C] transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-xs font-sans font-medium text-[#78716C]">
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
                    <div className="flex justify-between text-[#78716C]">
                      <span>Item Subtotal</span>
                      <span className="font-sans text-[#1C1917]">{formatPrice(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#B45309]">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          Promo ({couponCode})
                        </span>
                        <span className="font-sans">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm font-medium text-[#1C1917] pt-2 border-t border-[#E5DFD7]">
                      <span>Estimated Subtotal</span>
                      <span className="font-sans text-base font-semibold">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href="/cart"
                      onClick={closeCart}
                      className="py-3 px-4 text-center border border-[#E5DFD7] text-[#1C1917] text-[11px] uppercase tracking-[0.14em] font-medium hover:bg-[#EFE9E1] transition-colors rounded-sm"
                    >
                      View Spatial Bag
                    </Link>
                    <Link
                      href="/checkout"
                      onClick={closeCart}
                      className="py-3 px-4 text-center bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.14em] font-semibold hover:bg-[#3E3835] transition-colors rounded-sm flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#78716C] pt-1 font-light">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>Complimentary White-Glove Room Placement Included</span>
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
