'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Star, 
  Search, 
  SlidersHorizontal, 
  ShoppingBag, 
  Eye, 
  X,
  ArrowRight,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { NORD_JAPANDI_PRODUCTS } from '@/data/products'
import { Product } from '@/types'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuthModal } from '@/components/auth/AuthModal'

const CATEGORY_MAP: Record<string, string> = {
  lounge: 'Lounge & Seating',
  seating: 'Lounge & Seating',
  'lounge-seating': 'Lounge & Seating',
  'lounge & seating': 'Lounge & Seating',
  beds: 'Sanctuary (Beds)',
  sanctuary: 'Sanctuary (Beds)',
  bed: 'Sanctuary (Beds)',
  'sanctuary-beds': 'Sanctuary (Beds)',
  'sanctuary (beds)': 'Sanctuary (Beds)',
  dining: 'Dining & Gathering',
  gathering: 'Dining & Gathering',
  'dining-gathering': 'Dining & Gathering',
  'dining & gathering': 'Dining & Gathering',
  storage: 'Studio & Storage',
  studio: 'Studio & Storage',
  'studio-storage': 'Studio & Storage',
  'studio & storage': 'Studio & Storage',
  accents: 'Accents & Objects',
  objects: 'Accents & Objects',
  'accents-objects': 'Accents & Objects',
  'accents & objects': 'Accents & Objects',
}

function CatalogContent() {
  const searchParams = useSearchParams()
  const { addItem, openCart } = useCartStore()
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured')
  const [activeFinish, setActiveFinish] = useState<Record<string, string>>({})
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null)
  const [selectedQuickViewColor, setSelectedQuickViewColor] = useState<string>('')

  const categories = [
    'All',
    'Lounge & Seating',
    'Dining & Gathering',
    'Sanctuary (Beds)',
    'Studio & Storage',
    'Accents & Objects',
  ]

  // Read URL query parameters and filter category automatically
  useEffect(() => {
    const rawCategory = searchParams.get('category')
    if (rawCategory) {
      const normalized = rawCategory.toLowerCase().trim()
      const mapped = CATEGORY_MAP[normalized] || categories.find((c) => c.toLowerCase() === normalized)
      if (mapped) {
        setSelectedCategory(mapped)
      } else {
        setSelectedCategory('All')
      }
    } else {
      setSelectedCategory('All')
    }
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    let list = [...NORD_JAPANDI_PRODUCTS]

    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => (a.discount_price ?? a.price) - (b.discount_price ?? b.price))
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => (b.discount_price ?? b.price) - (a.discount_price ?? a.price))
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating)
    }

    return list
  }, [selectedCategory, searchQuery, sortBy])

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

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 w-full space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <span className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
            The Master Catalogue
          </span>
          <h1 className="font-serif text-4xl md:text-6xl font-normal tracking-tight text-[#1C1917]">
            {selectedCategory === 'All' ? 'Architectural Pieces & Archetypes' : selectedCategory}
          </h1>
          <p className="text-sm text-[#78716C] font-light leading-relaxed">
            {selectedCategory === 'All'
              ? 'Explore handcrafted heirloom commissions sculpted from noble ash, white oak, Hinoki cypress, and Roman travertine stone.'
              : `Handcrafted ${selectedCategory.toLowerCase()} sculpted with tactile organic materials and pure architectural silhouettes.`}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#F4EFEA] p-6 rounded-sm border border-[#E5DFD7] space-y-4 shadow-nord">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by material, piece name or archetype..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF7F2] border border-[#E5DFD7] rounded-none focus:ring-1 focus:ring-[#1C1917] outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3 text-xs text-[#78716C]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1C1917]" />
              <span className="uppercase tracking-wider text-[10px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#FAF7F2] border border-[#E5DFD7] px-3 py-1.5 text-xs text-[#1C1917] outline-none rounded-none"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Ascending</option>
                <option value="price-desc">Price: Descending</option>
                <option value="rating">Atelier Rating</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E5DFD7] text-[11px] font-sans">
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

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] space-y-3">
            <p className="font-serif text-xl">No architectural pieces match your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="text-xs uppercase tracking-wider underline text-[#78716C] hover:text-[#1C1917]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, idx) => {
              const displayPrice = product.discount_price ?? product.price
              const chosenFinish = activeFinish[product.id] || (product.colors && product.colors[0]) || ''

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: (idx % 3) * 0.08 }}
                  className="group bg-[#FAF7F2] rounded-sm border border-[#E5DFD7] overflow-hidden flex flex-col justify-between hover:shadow-nord-lg transition-all duration-300"
                >
                  {/* Image */}
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

                    <button
                      onClick={() => handleOpenQuickView(product)}
                      className="absolute bottom-3 right-3 bg-[#FAF7F2]/95 hover:bg-white text-[#1C1917] p-2 rounded-sm border border-[#E5DFD7] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 text-[10px] font-sans uppercase tracking-wider"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Details */}
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

                      {/* Finishes */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">
                            Finishes:
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

                    {/* Price & Add */}
                    <div className="pt-4 border-t border-[#E5DFD7] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-sans text-[#78716C] uppercase tracking-wider">Price</span>
                        <p className="font-sans text-base font-semibold text-[#1C1917]">
                          {formatPrice(displayPrice)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="px-3 py-2.5 bg-[#FAF7F2] border border-[#E5DFD7] text-[#1C1917] rounded-sm hover:bg-[#EFE9E1] transition-colors text-xs font-sans"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => {
                            addItem(product, 1, chosenFinish)
                            openCart()
                          }}
                          className="px-4 py-2.5 bg-[#292524] text-[#FAF7F2] rounded-sm hover:bg-[#3E3835] transition-all text-xs font-sans uppercase tracking-[0.14em] flex items-center space-x-1.5 shadow-sm"
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
        )}
      </main>

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

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-[#78716C]" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  )
}
