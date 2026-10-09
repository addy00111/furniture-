'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  Plus, 
  Star, 
  Layers, 
  CheckCircle2, 
  Eye, 
  Feather,
  SunMedium,
  Trees,
  Truck,
  X
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuthModal } from '@/components/auth/AuthModal'
import { NORD_JAPANDI_PRODUCTS, FINISH_IMAGE_MAP, FALLBACK_PRODUCT_IMAGE } from '@/data/products'
import { Product } from '@/types'
import Link from 'next/link'

export default function Home() {
  const { addItem, openCart } = useCartStore()
  const [products, setProducts] = useState<Product[]>(NORD_JAPANDI_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeFinish, setActiveFinish] = useState<Record<string, string>>({})
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [selectedQuickViewColor, setSelectedQuickViewColor] = useState<string>('')

  // Attempt live products fetch with guaranteed static fallback
  useEffect(() => {
    const fetchLiveProducts = async () => {
      try {
        const res = await fetch('/api/products')
        if (res.ok) {
          const data = await res.json()
          if (data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products)
          }
        }
      } catch (e) {
        console.warn('Using static Sora Living product catalog:', e)
      }
    }
    fetchLiveProducts()
  }, [])

  const categories = [
    'All',
    'Living Room',
    'Dining Room',
    'Bedroom',
    'Home Office',
    'Decor',
  ]

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter((p) => p.category === selectedCategory)

  const handleSelectFinish = (productId: string, finish: string) => {
    setActiveFinish((prev) => ({ ...prev, [productId]: finish }))
  }

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product)
    setSelectedQuickViewColor(product.colors?.[0] || '')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />
      <CartDrawer />
      <AuthModal />

      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative px-6 md:px-12 pt-12 pb-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-7"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-[#F4EFEA] border border-[#D6CEC4] text-xs font-sans font-semibold tracking-wider uppercase text-[#44403C]">
              <span className="w-2 h-2 bg-[#B45309] rounded-full" />
              <span>Autumn–Winter 2026 Collection</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-tight text-[#1C1917] leading-[1.05]">
              Architectural furniture for <span className="italic font-light">mindful</span> living.
            </h1>

            <p className="text-base md:text-lg text-[#57534E] max-w-xl font-normal leading-relaxed">
              Rooted in Japanese wabi-sabi principles and Scandinavian design clarity. Handcrafted in limited series using solid European hardwoods, natural stone, and heavy Italian bouclé.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/catalog"
                className="px-8 py-4 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold hover:bg-[#292524] transition-all rounded-sm shadow-md flex items-center space-x-2.5 group"
              >
                <span>Shop Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#materials"
                className="px-8 py-4 border border-[#D6CEC4] bg-[#F4EFEA] text-[#1C1917] text-xs uppercase tracking-wider font-semibold hover:bg-[#EAE3D9] transition-all rounded-sm"
              >
                <span>Materials & Craft</span>
              </a>
            </div>
          </motion.div>

          {/* Hero Feature Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-sm overflow-hidden aspect-[4/5] shadow-xl border border-[#E5DFD7] bg-[#EFE9E1]">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85"
                alt="Kanso Curved Bouclé Sectional"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-[#FAF7F2] flex items-end justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-[#FAF7F2]/80">
                    Featured Design
                  </span>
                  <h3 className="font-serif text-xl font-normal text-white">Kanso Bouclé Sectional</h3>
                  <p className="text-xs font-sans font-medium text-white/90">₹2,85,000 • Italian Bouclé & Ash</p>
                </div>

                <button
                  onClick={() => {
                    addItem(NORD_JAPANDI_PRODUCTS[0])
                    openCart()
                  }}
                  className="px-4 py-2.5 bg-[#FAF7F2] text-[#1C1917] text-xs font-sans uppercase tracking-wider font-bold hover:bg-white transition-colors rounded-sm shadow-sm flex items-center space-x-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SHOP BY ROOM CATEGORIES */}
      <section className="px-6 md:px-12 py-20 bg-[#F4EFEA] border-y border-[#E5DFD7]">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#B45309]">
                Browse by Category
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mt-1 text-[#1C1917]">
                Shop by Room
              </h2>
            </div>
            <p className="text-xs md:text-sm text-[#57534E] max-w-md font-normal leading-relaxed">
              Every piece is engineered with continuous grain matching, tactile natural finishes, and architectural proportions.
            </p>
          </div>

          {/* Clean Category Mosaic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Living Room */}
            <Link 
              href="/products?category=living-room"
              className="md:col-span-7 group cursor-pointer relative rounded-sm overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[400px] border border-[#E5DFD7] bg-[#EFE9E1] block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85"
                alt="Living Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-white">Living Room</h3>
                  <p className="text-xs text-white/90 font-normal mt-1">Sectionals, walnut lounge chairs & daybeds</p>
                </div>
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-sm group-hover:bg-white group-hover:text-[#1C1917] transition-all inline-flex items-center space-x-1.5">
                  <span>Explore</span>
                  <span>→</span>
                </span>
              </div>
            </Link>

            {/* Bedroom */}
            <Link 
              href="/products?category=bedroom"
              className="md:col-span-5 group cursor-pointer relative rounded-sm overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[400px] border border-[#E5DFD7] bg-[#EFE9E1] block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85"
                alt="Bedroom"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-[#1C1917]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-white">Bedroom</h3>
                  <p className="text-xs text-white/90 font-normal mt-1">Platform beds, headboards & nightstands</p>
                </div>
                <span className="text-xs font-sans font-semibold uppercase tracking-wider text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-sm group-hover:bg-white group-hover:text-[#1C1917] transition-all inline-flex items-center space-x-1.5">
                  <span>Explore</span>
                  <span>→</span>
                </span>
              </div>
            </Link>

            {/* Dining Room */}
            <Link 
              href="/products?category=dining-room"
              className="md:col-span-4 group cursor-pointer relative rounded-sm overflow-hidden aspect-[4/3] border border-[#E5DFD7] bg-[#EFE9E1] block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=85"
                alt="Dining Room"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white flex justify-between items-end">
                <div>
                  <h3 className="font-serif text-xl font-normal text-white">Dining Room</h3>
                  <p className="text-xs text-white/90 font-normal">Solid white oak & travertine tables</p>
                </div>
                <span className="text-xs font-sans font-semibold text-white group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>

            {/* Home Office */}
            <Link 
              href="/products?category=home-office"
              className="md:col-span-4 group cursor-pointer relative rounded-sm overflow-hidden aspect-[4/3] border border-[#E5DFD7] bg-[#EFE9E1] block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=85"
                alt="Home Office"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white flex justify-between items-end">
                <div>
                  <h3 className="font-serif text-xl font-normal text-white">Home Office</h3>
                  <p className="text-xs text-white/90 font-normal">Writing desks & fluted glass credenzas</p>
                </div>
                <span className="text-xs font-sans font-semibold text-white group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>

            {/* Decor */}
            <Link 
              href="/products?category=decor"
              className="md:col-span-4 group cursor-pointer relative rounded-sm overflow-hidden aspect-[4/3] border border-[#E5DFD7] bg-[#EFE9E1] block shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=85"
                alt="Decor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white flex justify-between items-end">
                <div>
                  <h3 className="font-serif text-xl font-normal text-white">Decor & Accents</h3>
                  <p className="text-xs text-white/90 font-normal">Spanish alabaster & ceramic vessels</p>
                </div>
                <span className="text-xs font-sans font-semibold text-white group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. MATERIALS & CRAFT */}
      <section id="materials" className="px-6 md:px-12 py-24 max-w-7xl mx-auto w-full space-y-14">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#B45309]">
            Noble Raw Materials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-[#1C1917]">
            Materials & Craft
          </h2>
          <p className="text-xs md:text-sm text-[#57534E] font-normal leading-relaxed">
            We use only solid hardwoods, natural stone, and organic fibers. Each material is selected for durability, natural warmth, and the beauty of natural aging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-7 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-center text-[#B45309]">
              <Trees className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-normal text-[#1C1917]">Japanese Hinoki Cypress</h3>
            <p className="text-xs text-[#57534E] font-normal leading-relaxed">
              Sustainably harvested in Nagano, prized for its natural aromatic scent, silken touch, and structural longevity.
            </p>
          </div>

          <div className="p-7 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-center text-[#B45309]">
              <Feather className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-normal text-[#1C1917]">Italian Heavy Bouclé</h3>
            <p className="text-xs text-[#57534E] font-normal leading-relaxed">
              Woven in Como from virgin wool and organic cotton slubs for deep texture and luxurious cloud-like comfort.
            </p>
          </div>

          <div className="p-7 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-center text-[#B45309]">
              <SunMedium className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-normal text-[#1C1917]">Roman Silver Travertine</h3>
            <p className="text-xs text-[#57534E] font-normal leading-relaxed">
              Quarried in Tivoli with natural open pores and unique veining that celebrate genuine mineral geology.
            </p>
          </div>

          <div className="p-7 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-center text-[#B45309]">
              <Layers className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="font-serif text-lg font-normal text-[#1C1917]">American Black Walnut</h3>
            <p className="text-xs text-[#57534E] font-normal leading-relaxed">
              Finished with organic hardwax oils to highlight continuous grain patterns and rich natural espresso tones.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATALOG GRID */}
      <section id="collection" className="px-6 md:px-12 py-20 bg-[#F4EFEA] border-t border-[#E5DFD7]">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header & Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#B45309]">
                Featured Products
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mt-1 text-[#1C1917]">
                The Sora Living Collection
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-xs font-sans">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-sm border transition-all uppercase tracking-wider font-semibold ${
                    selectedCategory === cat
                      ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917]'
                      : 'bg-[#FAF7F2] text-[#57534E] border-[#D6CEC4] hover:text-[#1C1917] hover:border-[#1C1917]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Catalog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => {
              const displayPrice = product.discount_price ?? product.price
              const chosenFinish = activeFinish[product.id] || (product.colors && product.colors[0]) || ''

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
                  className="group bg-[#FAF7F2] rounded-sm border border-[#E5DFD7] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                >
                  {/* Product Image Box */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE9E1]">
                    <Link href={`/products/${product.id}`}>
                      <img
                        src={(chosenFinish && FINISH_IMAGE_MAP[chosenFinish]) || product.images[0] || FALLBACK_PRODUCT_IMAGE}
                        alt={product.name}
                        onError={(e) => {
                          e.currentTarget.src = FALLBACK_PRODUCT_IMAGE
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                      />
                    </Link>
                    <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur-sm text-[10px] font-sans font-semibold px-2.5 py-1 uppercase tracking-wider text-[#1C1917] border border-[#D6CEC4] rounded-sm">
                      {product.category}
                    </div>

                    {product.featured && (
                      <div className="absolute top-3 right-3 bg-[#1C1917] text-[#FAF7F2] text-[10px] font-sans font-semibold px-2.5 py-1 uppercase tracking-wider rounded-sm">
                        Bestseller
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenQuickView(product)}
                      className="absolute bottom-3 right-3 bg-[#FAF7F2]/95 hover:bg-white text-[#1C1917] p-2 rounded-sm border border-[#D6CEC4] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1.5 text-[11px] font-sans font-semibold tracking-wider"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Product Content Details */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-xs font-sans font-medium text-[#57534E]">{product.material}</span>
                        <div className="flex items-center space-x-1 text-[#B45309] text-xs font-sans font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#B45309] text-[#B45309]" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-sans text-base font-bold text-[#1C1917] leading-snug hover:underline">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#57534E] font-normal line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Finishes */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="pt-1">
                          <span className="text-[11px] font-sans font-semibold text-[#57534E]">
                            Finishes:
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {product.colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => handleSelectFinish(product.id, color)}
                                className={`text-[11px] px-2 py-0.5 border transition-colors rounded-sm font-medium ${
                                  chosenFinish === color
                                    ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917]'
                                    : 'bg-[#F4EFEA] text-[#57534E] border-[#D6CEC4] hover:text-[#1C1917]'
                                }`}
                              >
                                {color}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Price & Add CTA */}
                    <div className="pt-4 border-t border-[#E5DFD7] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-sans text-[#57534E] uppercase tracking-wider font-semibold">Price</span>
                        <p className="font-sans text-base font-bold text-[#1C1917]">
                          {formatPrice(displayPrice)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="px-3 py-2 bg-[#FAF7F2] border border-[#D6CEC4] text-[#1C1917] rounded-sm hover:bg-[#EAE3D9] transition-colors text-xs font-sans font-semibold"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => {
                            addItem(product, 1, chosenFinish)
                            openCart()
                          }}
                          className="px-4 py-2 bg-[#1C1917] text-[#FAF7F2] rounded-sm hover:bg-[#292524] transition-all text-xs font-sans font-semibold tracking-wide flex items-center space-x-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. DELIVERY & SERVICES */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-8 md:p-12">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#B45309]">
              White-Glove Service
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-[#1C1917] leading-tight">
              Carefully delivered, assembled & placed in your home.
            </h2>
            <p className="text-xs md:text-sm text-[#57534E] font-normal leading-relaxed max-w-xl">
              Every order includes dedicated transport and trained delivery handlers who unpack, inspect, and position each piece in your room of choice with debris removal included.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="flex items-center space-x-2.5 font-medium text-[#1C1917]">
                <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                <span>Complimentary Room-of-Choice Setup</span>
              </div>
              <div className="flex items-center space-x-2.5 font-medium text-[#1C1917]">
                <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                <span>100% Solid Hardwoods & Stone</span>
              </div>
              <div className="flex items-center space-x-2.5 font-medium text-[#1C1917]">
                <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                <span>10-Year Structural Guarantee</span>
              </div>
              <div className="flex items-center space-x-2.5 font-medium text-[#1C1917]">
                <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                <span>Secure Razorpay Checkout</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-sm overflow-hidden border border-[#E5DFD7]">
            <img
              src="https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=85"
              alt="Craftsmanship & White-Glove Setup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. CLEAN FOOTER */}
      <footer className="border-t border-[#E5DFD7] py-16 px-6 md:px-12 bg-[#FAF7F2] text-xs text-[#57534E]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-3">
            <span className="font-serif uppercase tracking-[0.25em] text-lg text-[#1C1917] block">
              SORA LIVING
            </span>
            <p className="text-xs text-[#57534E] font-normal max-w-sm leading-relaxed">
              Architectural furniture handcrafted with Japanese wabi-sabi principles and Scandinavian clarity. Built from solid timber, natural stone, and organic textiles.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h4 className="font-sans font-bold text-[#1C1917] text-xs uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/products?category=living-room" className="hover:text-[#1C1917]">Living Room</Link></li>
              <li><Link href="/products?category=dining-room" className="hover:text-[#1C1917]">Dining Room</Link></li>
              <li><Link href="/products?category=bedroom" className="hover:text-[#1C1917]">Bedroom</Link></li>
              <li><Link href="/products?category=home-office" className="hover:text-[#1C1917]">Home Office</Link></li>
              <li><Link href="/products?category=decor" className="hover:text-[#1C1917]">Decor & Objects</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h4 className="font-sans font-bold text-[#1C1917] text-xs uppercase tracking-wider">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/cart" className="hover:text-[#1C1917]">Shopping Bag</Link></li>
              <li><Link href="/checkout" className="hover:text-[#1C1917]">Checkout</Link></li>
              <li><Link href="/admin" className="hover:text-[#1C1917]">Admin Desk</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-sans font-bold text-[#1C1917] text-xs uppercase tracking-wider">Contact & Studio</h4>
            <p className="text-xs leading-relaxed">
              Sora Living Studio, Lavelle Road, Bengaluru.<br />
              care@soraliving.studio • +91 98765 43210
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-[#E5DFD7] flex flex-col sm:flex-row items-center justify-between text-xs">
          <p>© 2026 Sora Living Studio. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-sans">Handcrafted with Japanese & Scandinavian Precision</p>
        </div>
      </footer>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF7F2] rounded-sm border border-[#E5DFD7] max-w-3xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 p-2 text-[#57534E] hover:text-[#1C1917] rounded-sm hover:bg-[#F4EFEA] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/3] rounded-sm overflow-hidden border border-[#E5DFD7] bg-[#EFE9E1]">
                  <img
                    src={
                      (selectedQuickViewColor && FINISH_IMAGE_MAP[selectedQuickViewColor]) ||
                      quickViewProduct.images[0] ||
                      FALLBACK_PRODUCT_IMAGE
                    }
                    alt={quickViewProduct.name}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_PRODUCT_IMAGE
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-sans font-semibold uppercase tracking-wider text-[#B45309]">
                    {quickViewProduct.category}
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#1C1917]">
                    {quickViewProduct.name}
                  </h2>
                  <p className="font-sans text-xl font-bold text-[#1C1917]">
                    {formatPrice(quickViewProduct.discount_price ?? quickViewProduct.price)}
                  </p>
                  <p className="text-xs text-[#57534E] font-normal leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#57534E] pt-2 border-t border-[#E5DFD7]">
                    <p><strong>Material:</strong> {quickViewProduct.material}</p>
                    <p><strong>Dimensions:</strong> {quickViewProduct.dimensions}</p>
                  </div>

                  {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-xs font-sans font-semibold text-[#57534E] block">
                        Finish: <strong className="text-[#1C1917]">{selectedQuickViewColor}</strong>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {quickViewProduct.colors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedQuickViewColor(color)}
                            className={`px-3 py-1 text-xs rounded-sm border transition-all ${
                              selectedQuickViewColor === color
                                ? 'bg-[#1C1917] text-white border-[#1C1917] shadow-sm font-semibold'
                                : 'bg-transparent text-[#57534E] border-[#D6CEC4] hover:border-[#1C1917] hover:text-[#1C1917] font-medium'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-3 flex items-center space-x-3">
                    <button
                      onClick={() => {
                        addItem(quickViewProduct, 1, selectedQuickViewColor)
                        setQuickViewProduct(null)
                        openCart()
                      }}
                      className="flex-1 py-3 px-6 bg-[#1C1917] text-[#FAF7F2] text-xs font-sans uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524] transition-all flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>

                    <Link
                      href={`/products/${quickViewProduct.id}`}
                      className="py-3 px-4 border border-[#D6CEC4] text-[#1C1917] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#EAE3D9] transition-colors"
                    >
                      Full Details →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
