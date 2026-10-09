'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  ShoppingBag, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Star, 
  Layers, 
  Compass,
  Maximize2
} from 'lucide-react'
import { NORD_JAPANDI_PRODUCTS } from '@/data/products'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuthModal } from '@/components/auth/AuthModal'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem, openCart } = useCartStore()

  const productId = params?.id as string

  // Match by id or slug
  const product = useMemo(() => {
    return (
      NORD_JAPANDI_PRODUCTS.find((p) => p.id === productId || p.slug === productId) ||
      NORD_JAPANDI_PRODUCTS[0]
    )
  }, [productId])

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : ''
  )
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const displayPrice = product.discount_price ?? product.price
  const hasDiscount = product.discount_price && product.discount_price < product.price

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2500)
    openCart()
  }

  // Related products in the same category
  const relatedProducts = NORD_JAPANDI_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.featured)
  ).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />
      <CartDrawer />
      <AuthModal />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-10 w-full space-y-16">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-4 text-xs text-[#78716C]">
          <Link
            href="/#collections"
            className="inline-flex items-center space-x-2 text-[11px] uppercase tracking-[0.16em] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Atelier Collections</span>
          </Link>
          <span className="text-[10px] font-mono uppercase tracking-widest bg-[#F4EFEA] px-2.5 py-1 border border-[#E5DFD7]">
            {product.category}
          </span>
        </div>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery View */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#E5DFD7] bg-[#EFE9E1] shadow-nord">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-[#292524] text-[#FAF7F2] text-[9px] font-sans px-3 py-1 uppercase tracking-widest">
                  Atelier Key Commission
                </div>
              )}
            </div>

            {/* Thumbnail Switcher */}
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 aspect-[4/3] rounded-sm overflow-hidden border transition-all ${
                      selectedImage === idx
                        ? 'border-[#1C1917] ring-1 ring-[#1C1917]'
                        : 'border-[#E5DFD7] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Specifications & Order Action */}
          <div className="lg:col-span-5 space-y-8 bg-[#F4EFEA] p-8 rounded-sm border border-[#E5DFD7] shadow-nord">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#78716C]">
                <span>{product.material}</span>
                <div className="flex items-center space-x-1 text-[#B45309]">
                  <Star className="w-3.5 h-3.5 fill-[#B45309] text-[#B45309]" />
                  <span className="font-medium text-xs">{product.rating} / 5.0</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#1C1917] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline space-x-3 pt-1">
                <span className="font-sans text-2xl font-bold text-[#1C1917]">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="font-sans text-sm text-[#78716C] line-through">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs text-[#78716C] font-light leading-relaxed">
              {product.description}
            </p>

            {/* Finishes */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E5DFD7]">
                <span className="text-[10px] font-sans uppercase tracking-[0.16em] text-[#78716C] block">
                  Material Finish / Tone: <strong className="text-[#1C1917] font-semibold">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1.5 text-xs rounded-none border transition-all ${
                        selectedColor === color
                          ? 'bg-[#292524] text-[#FAF7F2] border-[#292524]'
                          : 'bg-[#FAF7F2] text-[#78716C] border-[#E5DFD7] hover:text-[#1C1917]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dimensions & Specs */}
            <div className="space-y-3 pt-4 border-t border-[#E5DFD7] text-xs text-[#78716C]">
              <div className="flex justify-between">
                <span className="uppercase tracking-wider text-[10px]">Architectural Dimensions</span>
                <span className="text-[#1C1917] font-mono text-[11px]">{product.dimensions}</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase tracking-wider text-[10px]">Stock Availability</span>
                <span className="text-[#1C1917] font-medium">{product.stock} units available in Atelier</span>
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="pt-4 border-t border-[#E5DFD7] space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-[#E5DFD7] bg-[#FAF7F2] rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2.5 hover:bg-[#EFE9E1] transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 text-[#1C1917]" />
                  </button>
                  <span className="px-4 text-xs font-mono font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2.5 hover:bg-[#EFE9E1] transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#1C1917]" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#3E3835] transition-all flex items-center justify-center space-x-2 shadow-nord"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdded ? 'Added to Bag ✓' : 'Acquire Commission'}</span>
                </button>
              </div>

              <Link
                href="/checkout"
                className="block text-center w-full py-3 border border-[#292524] text-[#292524] text-[11px] uppercase tracking-[0.16em] font-medium rounded-sm hover:bg-[#292524] hover:text-[#FAF7F2] transition-colors"
              >
                Proceed Directly to Checkout
              </Link>
            </div>

            {/* Logistics Assurance */}
            <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-2 text-[11px] text-[#78716C] font-light">
              <div className="flex items-center space-x-2 text-[#1C1917] font-medium">
                <Truck className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Complimentary White-Glove Installation</span>
              </div>
              <p>
                Delivered by trained art and furniture handlers with room-of-choice placement and packaging debris removal.
              </p>
            </div>
          </div>
        </div>

        {/* Complementary Works */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t border-[#E5DFD7] space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                  Harmonizing Works
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#1C1917] mt-0.5">
                  Complementary Atelier Pieces
                </h2>
              </div>
              <Link href="/#collections" className="text-xs uppercase tracking-widest text-[#78716C] hover:text-[#1C1917] underline underline-offset-4">
                View Full Catalog →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.id}`}
                  className="group bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] overflow-hidden hover:shadow-nord transition-all block"
                >
                  <div className="aspect-[4/3] bg-[#EFE9E1] overflow-hidden">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-[#78716C]">{rel.category}</span>
                    <h4 className="font-serif text-base font-normal text-[#1C1917] group-hover:underline">
                      {rel.name}
                    </h4>
                    <p className="font-sans text-xs font-semibold text-[#1C1917]">
                      {formatPrice(rel.discount_price ?? rel.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
