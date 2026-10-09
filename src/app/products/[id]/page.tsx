'use client'

import { useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Truck, 
  ShieldCheck, 
  Star, 
  ChevronRight,
  ChevronDown,
  MapPin,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight
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

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string | null>('dimensions')

  const toggleAccordion = (key: string) => {
    setOpenAccordion((prev) => (prev === key ? null : key))
  }

  // Pincode delivery estimator state
  const [pincode, setPincode] = useState('')
  const [pincodeResult, setPincodeResult] = useState<{ status: 'valid' | 'invalid'; message: string } | null>(null)

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanPin = pincode.trim()
    if (/^[1-9][0-9]{5}$/.test(cleanPin)) {
      const isMetro = ['5600', '1100', '4000', '6000', '7000', '5000'].some((prefix) => cleanPin.startsWith(prefix))
      const days = isMetro ? '3–5 business days' : '5–7 business days'
      setPincodeResult({
        status: 'valid',
        message: `Delivery available within ${days} to ${cleanPin}. White-glove assembly included.`,
      })
    } else {
      setPincodeResult({
        status: 'invalid',
        message: 'Please enter a valid 6-digit postal pincode.',
      })
    }
  }

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

  const getCategorySlug = (cat: string) => {
    return cat.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />
      <CartDrawer />
      <AuthModal />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-8 w-full space-y-12">
        {/* Clickable Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-[#57534E] border-b border-[#E5DFD7] pb-4">
          <Link href="/" className="hover:text-[#1C1917] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
          <Link
            href={`/products?category=${getCategorySlug(product.category)}`}
            className="hover:text-[#1C1917] transition-colors"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#8C827A]" />
          <span className="text-[#1C1917] font-semibold truncate max-w-xs sm:max-w-md">
            {product.name}
          </span>
        </nav>

        {/* Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Gallery View */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-[#E5DFD7] bg-[#EFE9E1] shadow-sm">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage] || product.images[0]}
                alt={product.name}
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 bg-[#1C1917] text-[#FAF7F2] text-[10px] font-sans font-semibold px-3 py-1 uppercase tracking-wider rounded-sm">
                  Bestseller
                </div>
              )}
            </div>

            {/* Thumbnail Switcher */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-24 aspect-[4/3] rounded-sm overflow-hidden border transition-all ${
                      selectedImage === idx
                        ? 'border-[#1C1917] ring-2 ring-[#1C1917]'
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
          <div className="lg:col-span-5 space-y-6 bg-[#F4EFEA] p-6 md:p-8 rounded-sm border border-[#E5DFD7] shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#57534E]">
                <span className="font-medium">{product.material}</span>
                <div className="flex items-center space-x-1 text-[#B45309] font-bold">
                  <Star className="w-4 h-4 fill-[#B45309] text-[#B45309]" />
                  <span>{product.rating} / 5.0</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#1C1917] leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline space-x-3 pt-1">
                <span className="font-sans text-2xl md:text-3xl font-bold text-[#1C1917]">
                  {formatPrice(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="font-sans text-sm text-[#8C827A] line-through font-medium">
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs md:text-sm text-[#57534E] font-normal leading-relaxed">
              {product.description}
            </p>

            {/* Finishes Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-[#E5DFD7]">
                <span className="text-xs font-sans font-semibold text-[#57534E] block">
                  Select Finish: <strong className="text-[#1C1917]">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3.5 py-1.5 text-xs rounded-sm border transition-all font-medium ${
                        selectedColor === color
                          ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917]'
                          : 'bg-[#FAF7F2] text-[#57534E] border-[#D6CEC4] hover:text-[#1C1917]'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability */}
            <div className="flex items-center space-x-2 text-xs text-[#57534E] pt-2 border-t border-[#E5DFD7]">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>In Stock: <strong className="text-[#1C1917]">{product.stock} units</strong> ready for dispatch</span>
            </div>

            {/* Quantity & CTA */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-[#D6CEC4] bg-[#FAF7F2] rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-[#EAE3D9] transition-colors disabled:opacity-40"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4 text-[#1C1917]" />
                  </button>
                  <span className="px-4 text-xs font-sans font-bold text-[#1C1917]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-[#EAE3D9] transition-colors disabled:opacity-40"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4 text-[#1C1917]" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524] transition-all flex items-center justify-center space-x-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdded ? 'Added to Bag ✓' : 'Add to Bag'}</span>
                </button>
              </div>

              <Link
                href="/checkout"
                className="block text-center w-full py-3 border border-[#1C1917] text-[#1C1917] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#1C1917] hover:text-[#FAF7F2] transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>

            {/* Pincode Delivery Estimator */}
            <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-3">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#1C1917]">
                <MapPin className="w-4 h-4 text-[#B45309]" />
                <span>Estimate Delivery Timeline</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 6-digit Pincode"
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#D6CEC4] rounded-sm outline-none focus:border-[#1C1917] text-[#1C1917]"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1C1917] text-[#FAF7F2] text-xs font-semibold rounded-sm hover:bg-[#292524] transition-colors"
                >
                  Verify
                </button>
              </form>
              {pincodeResult && (
                <p
                  className={`text-xs ${
                    pincodeResult.status === 'valid' ? 'text-emerald-800' : 'text-red-700'
                  }`}
                >
                  {pincodeResult.message}
                </p>
              )}
            </div>

            {/* Accordion Panels for Realistic Specs */}
            <div className="border-t border-[#E5DFD7] pt-2 divide-y divide-[#E5DFD7]">
              {/* Dimensions & Weight */}
              <div>
                <button
                  onClick={() => toggleAccordion('dimensions')}
                  className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#1C1917] text-left hover:text-[#B45309] transition-colors"
                >
                  <span>Dimensions & Weight</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordion === 'dimensions' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'dimensions' && (
                  <div className="pb-3 text-xs text-[#57534E] space-y-1.5 leading-relaxed">
                    <p><strong>Dimensions:</strong> {product.dimensions}</p>
                    <p><strong>Weight:</strong> Approx. 45–65 kg depending on configuration</p>
                    <p><strong>Primary Material:</strong> {product.material}</p>
                  </div>
                )}
              </div>

              {/* Assembly & Care */}
              <div>
                <button
                  onClick={() => toggleAccordion('care')}
                  className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#1C1917] text-left hover:text-[#B45309] transition-colors"
                >
                  <span>Assembly & Care</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordion === 'care' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'care' && (
                  <div className="pb-3 text-xs text-[#57534E] space-y-1.5 leading-relaxed">
                    <p>• <strong>White-Glove Setup:</strong> Our trained handlers unpack and fully assemble in your room of choice.</p>
                    <p>• <strong>Wood Care:</strong> Dust with a soft microfibre cloth. Apply natural beeswax once every 12 months.</p>
                    <p>• <strong>Fabric Care:</strong> Spot clean with a damp white cloth. Professional upholstery cleaning recommended.</p>
                  </div>
                )}
              </div>

              {/* Delivery Timelines */}
              <div>
                <button
                  onClick={() => toggleAccordion('delivery')}
                  className="w-full py-3 flex items-center justify-between text-xs font-semibold text-[#1C1917] text-left hover:text-[#B45309] transition-colors"
                >
                  <span>Delivery Timelines & Warranty</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openAccordion === 'delivery' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'delivery' && (
                  <div className="pb-3 text-xs text-[#57534E] space-y-1.5 leading-relaxed">
                    <p>• <strong>Delivery:</strong> 3–7 business days via dedicated climate-controlled furniture transport.</p>
                    <p>• <strong>Free Shipping:</strong> Automatically applied on orders over ₹1,00,000.</p>
                    <p>• <strong>Warranty:</strong> 10-year comprehensive structural warranty covering frame and joinery.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="pt-12 border-t border-[#E5DFD7] space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#B45309]">
                  You May Also Like
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#1C1917] mt-0.5">
                  Complementary Pieces
                </h2>
              </div>
              <Link
                href={`/products?category=${getCategorySlug(product.category)}`}
                className="text-xs uppercase tracking-wider font-semibold text-[#1C1917] hover:underline"
              >
                View More in {product.category} →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.id}`}
                  className="group bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] overflow-hidden hover:shadow-md transition-all block"
                >
                  <div className="aspect-[4/3] bg-[#EFE9E1] overflow-hidden">
                    <img
                      src={rel.images[0]}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#B45309]">{rel.category}</span>
                    <h4 className="font-sans text-sm font-bold text-[#1C1917] group-hover:underline">
                      {rel.name}
                    </h4>
                    <p className="font-sans text-xs font-bold text-[#1C1917]">
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
