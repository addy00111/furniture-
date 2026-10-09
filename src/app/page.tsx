'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  ShoppingBag, 
  Plus, 
  Star, 
  Layers, 
  Compass, 
  CheckCircle2, 
  Eye, 
  Feather,
  SunMedium,
  Trees,
  X
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuthModal } from '@/components/auth/AuthModal'
import { NORD_JAPANDI_PRODUCTS } from '@/data/products'
import { Product } from '@/types'
import Link from 'next/link'

export default function Home() {
  const { addItem, openCart } = useCartStore()
  const [products, setProducts] = useState<Product[]>(NORD_JAPANDI_PRODUCTS)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeFinish, setActiveFinish] = useState<Record<string, string>>({})
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [selectedQuickViewColor, setSelectedQuickViewColor] = useState<string>('')

  // Attempt async live products fetch with guaranteed static fallback
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
        console.warn('Using static Nord-Japandi product catalog:', e)
      }
    }
    fetchLiveProducts()
  }, [])

  const categories = [
    'All',
    'Lounge & Seating',
    'Dining & Gathering',
    'Sanctuary (Beds)',
    'Studio & Storage',
    'Accents & Objects',
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

      {/* 1. ATMOSPHERIC HERO SECTION */}
      <section className="relative px-6 md:px-12 pt-12 pb-24 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            {/* Editorial Badge */}
            <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-none bg-[#F4EFEA] border border-[#E5DFD7] text-[11px] font-sans tracking-[0.2em] uppercase text-[#78716C]">
              <span className="w-1.5 h-1.5 bg-[#B45309] rounded-full" />
              <span>Collection 01 / Autumn–Winter Atelier</span>
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-normal tracking-[-0.02em] text-[#1C1917] leading-[1.05]">
              Curated forms for <span className="italic font-light">mindful</span> living.
            </h1>

            <p className="text-base md:text-lg text-[#78716C] max-w-xl font-light leading-relaxed">
              Rooted in the quiet stillness of Japanese wabi-sabi and Scandinavian architectural purity. Handcrafted in limited series from noble, tactile materials.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-5 pt-4">
              <a
                href="#collections"
                className="px-8 py-4 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#3E3835] transition-all rounded-sm shadow-nord flex items-center space-x-3 group"
              >
                <span>Explore The Atelier</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#materiality"
                className="px-8 py-4 border border-[#E5DFD7] bg-[#F4EFEA] text-[#1C1917] text-[11px] uppercase tracking-[0.2em] font-semibold hover:bg-[#EFE9E1] transition-all rounded-sm"
              >
                <span>Material Manifesto</span>
              </a>
            </div>
          </motion.div>

          {/* Hero Atmospheric Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-sm overflow-hidden aspect-[4/5] shadow-nord-lg border border-[#E5DFD7] bg-[#EFE9E1]">
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=85"
                alt="Kanso Curved Bouclé Sectional"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-[#FAF7F2] flex items-end justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#FAF7F2]/75">
                    Signature Centerpiece
                  </span>
                  <h3 className="font-serif text-xl font-normal">Kanso Bouclé Sectional</h3>
                  <p className="text-xs font-sans text-[#FAF7F2]/90">₹2,85,000 • Italian Bouclé & Solid Ash</p>
                </div>

                <button
                  onClick={() => addItem(NORD_JAPANDI_PRODUCTS[0])}
                  className="px-4 py-2 bg-[#FAF7F2] text-[#1C1917] text-[10px] font-sans uppercase tracking-[0.14em] font-semibold hover:bg-white transition-colors rounded-sm shadow-sm"
                >
                  Acquire +
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. ASYMMETRICAL EDITORIAL CATEGORY MOSAIC */}
      <section className="px-6 md:px-12 py-20 bg-[#F4EFEA] border-y border-[#E5DFD7]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                Atelier Spatial Archetypes
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mt-1 text-[#1C1917]">
                The Five Design Disciplines
              </h2>
            </div>
            <p className="text-xs text-[#78716C] max-w-md font-light leading-relaxed">
              Every archetype is sculpted with continuous grain matching, tactile textures, and architectural silhouettes intended to outlive transient trends.
            </p>
          </div>

          {/* Editorial Mosaic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Tall Card 1: Lounge & Seating */}
            <div 
              onClick={() => setSelectedCategory('Lounge & Seating')}
              className="md:col-span-7 group cursor-pointer relative rounded-sm overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[420px] border border-[#E5DFD7] bg-[#EFE9E1]"
            >
              <img
                src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=85"
                alt="Lounge & Seating"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Discipline 01</span>
                  <h3 className="font-serif text-2xl font-normal mt-0.5">Lounge & Seating</h3>
                  <p className="text-xs text-white/80 font-light mt-0.5">Curved bouclé, aniline saddle leather, linen daybeds</p>
                </div>
                <span className="text-xs font-sans uppercase tracking-widest text-white/90 underline underline-offset-4">
                  View Series →
                </span>
              </div>
            </div>

            {/* Tall Card 2: Sanctuary Beds */}
            <div 
              onClick={() => setSelectedCategory('Sanctuary (Beds)')}
              className="md:col-span-5 group cursor-pointer relative rounded-sm overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[420px] border border-[#E5DFD7] bg-[#EFE9E1]"
            >
              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=85"
                alt="Sanctuary (Beds)"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-[#1C1917]/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Discipline 02</span>
                  <h3 className="font-serif text-2xl font-normal mt-0.5">Sanctuary (Beds)</h3>
                  <p className="text-xs text-white/80 font-light mt-0.5">Japanese Hinoki platforms & flax linen</p>
                </div>
                <span className="text-xs font-sans uppercase tracking-widest text-white/90 underline underline-offset-4">
                  View Series →
                </span>
              </div>
            </div>

            {/* Wide Card 3: Dining & Gathering */}
            <div 
              onClick={() => setSelectedCategory('Dining & Gathering')}
              className="md:col-span-4 group cursor-pointer relative rounded-sm overflow-hidden aspect-[4/3] border border-[#E5DFD7] bg-[#EFE9E1]"
            >
              <img
                src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=85"
                alt="Dining & Gathering"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Discipline 03</span>
                <h3 className="font-serif text-xl font-normal mt-0.5">Dining & Gathering</h3>
                <p className="text-xs text-white/80 font-light">White oak trestles & travertine slabs</p>
              </div>
            </div>

            {/* Wide Card 4: Studio & Storage */}
            <div 
              onClick={() => setSelectedCategory('Studio & Storage')}
              className="md:col-span-4 group cursor-pointer relative rounded-sm overflow-hidden aspect-[4/3] border border-[#E5DFD7] bg-[#EFE9E1]"
            >
              <img
                src="https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=85"
                alt="Studio & Storage"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Discipline 04</span>
                <h3 className="font-serif text-xl font-normal mt-0.5">Studio & Storage</h3>
                <p className="text-xs text-white/80 font-light">Fluted glass credenzas & linear desks</p>
              </div>
            </div>

            {/* Wide Card 5: Accents & Objects */}
            <div 
              onClick={() => setSelectedCategory('Accents & Objects')}
              className="md:col-span-4 group cursor-pointer relative rounded-sm overflow-hidden aspect-[4/3] border border-[#E5DFD7] bg-[#EFE9E1]"
            >
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=85"
                alt="Accents & Objects"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/70">Discipline 05</span>
                <h3 className="font-serif text-xl font-normal mt-0.5">Accents & Objects</h3>
                <p className="text-xs text-white/80 font-light">Natural alabaster & wabi-sabi vessels</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MATERIALITY SPOTLIGHT BANNER */}
      <section id="materiality" className="px-6 md:px-12 py-24 max-w-7xl mx-auto w-full space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
            Noble Raw Materials
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight text-[#1C1917]">
            Materiality & Tactile Integrity
          </h2>
          <p className="text-xs md:text-sm text-[#78716C] font-light leading-relaxed">
            We reject synthetic veneers. Every surface is chosen for its organic grain, textural warmth, and capacity to age gracefully with natural patina.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-8 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-4">
            <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-center text-[#B45309]">
              <Trees className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg font-normal">Japanese Hinoki Cypress</h3>
            <p className="text-xs text-[#78716C] font-light leading-relaxed">
              Harvested sustainably in Nagano, offering natural aromatic resins, silken tactile touch, and structural lightness.
            </p>
          </div>

          <div className="p-8 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-4">
            <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-center text-[#B45309]">
              <Feather className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg font-normal">Italian Heavy Bouclé</h3>
            <p className="text-xs text-[#78716C] font-light leading-relaxed">
              Spun in Como from virgin wool and organic cotton slubs, delivering multidimensional cloud-like comfort.
            </p>
          </div>

          <div className="p-8 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-4">
            <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-center text-[#B45309]">
              <SunMedium className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg font-normal">Roman Silver Travertine</h3>
            <p className="text-xs text-[#78716C] font-light leading-relaxed">
              Quarried in Tivoli with unfilled fissures that celebrate the millions of years of geothermal sedimentation.
            </p>
          </div>

          <div className="p-8 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-4">
            <div className="w-10 h-10 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-center text-[#B45309]">
              <Layers className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="font-serif text-lg font-normal">American Black Walnut</h3>
            <p className="text-xs text-[#78716C] font-light leading-relaxed">
              Hand-rubbed with natural organic waxes to enhance rich deep espresso hues and continuous grain flows.
            </p>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATALOG GRID */}
      <section id="collections" className="px-6 md:px-12 py-20 bg-[#F4EFEA] border-t border-[#E5DFD7]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header & Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                The Complete Collection
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-normal tracking-tight mt-1 text-[#1C1917]">
                Architectural Masterpieces
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 text-[11px] font-sans">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-sm border transition-all uppercase tracking-wider ${
                    selectedCategory === cat
                      ? 'bg-[#292524] text-[#FAF7F2] border-[#292524] font-medium'
                      : 'bg-[#FAF7F2] text-[#78716C] border-[#E5DFD7] hover:text-[#1C1917]'
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
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
                  className="group bg-[#FAF7F2] rounded-sm border border-[#E5DFD7] overflow-hidden flex flex-col justify-between hover:shadow-nord-lg transition-all duration-300"
                >
                  {/* Product Image Box */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE9E1]">
                    <Link href={`/products/${product.id}`}>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                      />
                    </Link>
                    <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-sm text-[9px] font-sans px-2.5 py-1 uppercase tracking-[0.14em] text-[#1C1917] border border-[#E5DFD7]">
                      {product.category}
                    </div>

                    {product.featured && (
                      <div className="absolute top-3 right-3 bg-[#292524] text-[#FAF7F2] text-[9px] font-sans px-2 py-0.5 uppercase tracking-widest">
                        Atelier Key Piece
                      </div>
                    )}

                    <button
                      onClick={() => handleOpenQuickView(product)}
                      className="absolute bottom-3 right-3 bg-[#FAF7F2]/95 hover:bg-white text-[#1C1917] p-2 rounded-sm border border-[#E5DFD7] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 text-[10px] font-sans uppercase tracking-wider"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Product Content Details */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[11px] font-sans text-[#78716C]">{product.material}</span>
                        <div className="flex items-center space-x-1 text-[#B45309] text-[11px] font-sans">
                          <Star className="w-3 h-3 fill-[#B45309] text-[#B45309]" />
                          <span>{product.rating}</span>
                        </div>
                      </div>

                      <Link href={`/products/${product.id}`} className="block">
                        <h3 className="font-serif text-lg font-normal text-[#1C1917] leading-snug hover:underline">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-xs text-[#78716C] font-light line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Finish / Color Selector */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">
                            Available Finishes:
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {product.colors.map((color) => (
                              <button
                                key={color}
                                onClick={() => handleSelectFinish(product.id, color)}
                                className={`text-[10px] px-2 py-0.5 border transition-colors rounded-none ${
                                  chosenFinish === color
                                    ? 'bg-[#292524] text-[#FAF7F2] border-[#292524]'
                                    : 'bg-[#F4EFEA] text-[#78716C] border-[#E5DFD7] hover:text-[#1C1917]'
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
                        <span className="text-[10px] font-sans text-[#78716C] uppercase tracking-wider">Acquisition</span>
                        <p className="font-sans text-base font-semibold text-[#1C1917]">
                          {formatPrice(displayPrice)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="px-3 py-2.5 bg-[#FAF7F2] border border-[#E5DFD7] text-[#1C1917] rounded-sm hover:bg-[#EFE9E1] transition-colors text-xs"
                        >
                          Inspect
                        </Link>
                        <button
                          onClick={() => {
                            addItem(product, 1, chosenFinish)
                            openCart()
                          }}
                          className="px-4 py-2.5 bg-[#292524] text-[#FAF7F2] rounded-sm hover:bg-[#3E3835] transition-all text-xs font-sans uppercase tracking-[0.14em] flex items-center space-x-1.5 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Acquire</span>
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

      {/* 5. CRAFTSMANSHIP & WHITE-GLOVE MANIFESTO */}
      <section className="px-6 md:px-12 py-24 max-w-7xl mx-auto w-full space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-8 md:p-14">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
              The Atelier Standard
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-[#1C1917] leading-tight">
              Museum-grade delivery, assembly & preservation.
            </h2>
            <p className="text-sm text-[#78716C] font-light leading-relaxed max-w-xl">
              Every commission arrives via dedicated, climate-controlled transport. Our white-glove handlers unpack, assemble with precision torque, and place each piece in your exact room of choice.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                <span>Complimentary Room-of-Choice Placement</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                <span>Zero Synthetic Core Materials</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                <span>HMAC SHA-256 Verified Transactions</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                <span>Lifetime Structural Guarantee</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-sm overflow-hidden border border-[#E5DFD7]">
            <img
              src="https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1000&q=85"
              alt="Atelier Craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. REFINED MINIMALIST FOOTER */}
      <footer className="border-t border-[#E5DFD7] py-16 px-6 md:px-12 bg-[#FAF7F2] text-xs text-[#78716C]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-3">
            <span className="font-serif uppercase tracking-[0.22em] text-lg text-[#1C1917] block">
              ANTIGRAVITI
            </span>
            <p className="text-xs text-[#78716C] font-light max-w-sm leading-relaxed">
              An architectural furniture studio dedicated to proportion, honest materiality, and spatial clarity. Handcrafted across Japan and Northern Europe.
            </p>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h4 className="font-sans font-semibold text-[#1C1917] text-[11px] uppercase tracking-wider">Disciplines</h4>
            <ul className="space-y-1.5 font-light text-xs">
              <li><a href="#collections" className="hover:text-[#1C1917]">Lounge & Seating</a></li>
              <li><a href="#collections" className="hover:text-[#1C1917]">Dining & Gathering</a></li>
              <li><a href="#collections" className="hover:text-[#1C1917]">Sanctuary (Beds)</a></li>
              <li><a href="#collections" className="hover:text-[#1C1917]">Studio & Storage</a></li>
              <li><a href="#collections" className="hover:text-[#1C1917]">Accents & Objects</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-2">
            <h4 className="font-sans font-semibold text-[#1C1917] text-[11px] uppercase tracking-wider">Platform</h4>
            <ul className="space-y-1.5 font-light text-xs">
              <li><Link href="/cart" className="hover:text-[#1C1917]">Spatial Bag</Link></li>
              <li><Link href="/checkout" className="hover:text-[#1C1917]">Checkout</Link></li>
              <li><Link href="/admin" className="hover:text-[#1C1917]">Atelier Operations</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="font-sans font-semibold text-[#1C1917] text-[11px] uppercase tracking-wider">Atelier Concierge</h4>
            <p className="font-light text-xs leading-relaxed">
              The Monolith Pavilion, Lavelle Road, Bengaluru.<br />
              concierge@antigraviti.studio
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-[#E5DFD7] flex flex-col sm:flex-row items-center justify-between text-[11px] font-light">
          <p>© 2026 ANTIGRAVITI ATELIER. All architectural rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">Next.js 16 • Supabase SSR • Razorpay Verified</p>
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
                className="absolute top-4 right-4 p-2 text-[#78716C] hover:text-[#1C1917] rounded-sm hover:bg-[#F4EFEA] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="aspect-[4/3] rounded-sm overflow-hidden border border-[#E5DFD7] bg-[#EFE9E1]">
                  <img
                    src={quickViewProduct.images[0]}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                    {quickViewProduct.category}
                  </span>
                  <h2 className="font-serif text-2xl font-normal text-[#1C1917]">
                    {quickViewProduct.name}
                  </h2>
                  <p className="font-sans text-xl font-bold text-[#1C1917]">
                    {formatPrice(quickViewProduct.discount_price ?? quickViewProduct.price)}
                  </p>
                  <p className="text-xs text-[#78716C] font-light leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-[#78716C] pt-2 border-t border-[#E5DFD7]">
                    <p><strong>Material:</strong> {quickViewProduct.material}</p>
                    <p><strong>Dimensions:</strong> {quickViewProduct.dimensions}</p>
                  </div>

                  <div className="pt-4 flex items-center space-x-3">
                    <button
                      onClick={() => {
                        addItem(quickViewProduct, 1, selectedQuickViewColor)
                        setQuickViewProduct(null)
                        openCart()
                      }}
                      className="flex-1 py-3 px-6 bg-[#292524] text-[#FAF7F2] text-xs font-sans uppercase tracking-[0.16em] font-semibold rounded-sm hover:bg-[#3E3835] transition-all flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Bag</span>
                    </button>

                    <Link
                      href={`/products/${quickViewProduct.id}`}
                      className="py-3 px-4 border border-[#E5DFD7] text-[#1C1917] text-xs uppercase tracking-wider font-medium rounded-sm hover:bg-[#EFE9E1] transition-colors"
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

