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
  Loader2
} from 'lucide-react'
import { NORD_JAPANDI_PRODUCTS, FINISH_IMAGE_MAP, FALLBACK_PRODUCT_IMAGE } from '@/data/products'
import { Product } from '@/types'
import { useCartStore } from '@/store/useCartStore'
import { formatPrice } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuthModal } from '@/components/auth/AuthModal'

const CATEGORY_MAP: Record<string, string> = {
  // Living Room
  living: 'Living Room',
  'living-room': 'Living Room',
  'living room': 'Living Room',
  lounge: 'Living Room',
  seating: 'Living Room',
  'lounge-seating': 'Living Room',
  'lounge & seating': 'Living Room',

  // Dining Room
  dining: 'Dining Room',
  'dining-room': 'Dining Room',
  'dining room': 'Dining Room',
  gathering: 'Dining Room',
  'dining-gathering': 'Dining Room',
  'dining & gathering': 'Dining Room',

  // Bedroom
  bedroom: 'Bedroom',
  beds: 'Bedroom',
  sanctuary: 'Bedroom',
  bed: 'Bedroom',
  'sanctuary-beds': 'Bedroom',
  'sanctuary (beds)': 'Bedroom',

  // Home Office
  'home-office': 'Home Office',
  'home office': 'Home Office',
  office: 'Home Office',
  storage: 'Home Office',
  studio: 'Home Office',
  'studio-storage': 'Home Office',
  'studio & storage': 'Home Office',

  // Decor
  decor: 'Decor',
  'decor & objects': 'Decor',
  accents: 'Decor',
  objects: 'Decor',
  'accents-objects': 'Decor',
  'accents & objects': 'Decor',
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
    'Living Room',
    'Dining Room',
    'Bedroom',
    'Home Office',
    'Decor',
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

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-12 w-full space-y-10">
        {/* Header */}
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-sans font-semibold uppercase tracking-widest text-[#B45309]">
            Furniture Collection
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-normal tracking-tight text-[#1C1917]">
            {selectedCategory === 'All' ? 'All Architectural Furniture' : selectedCategory}
          </h1>
          <p className="text-xs md:text-sm text-[#57534E] font-normal leading-relaxed">
            {selectedCategory === 'All'
              ? 'Handcrafted furniture pieces made with solid European ash, white oak, Hinoki cypress, and Italian fabrics.'
              : `Handcrafted ${selectedCategory.toLowerCase()} pieces designed for balance, comfort, and longevity.`}
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#F4EFEA] p-6 rounded-sm border border-[#E5DFD7] space-y-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#78716C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by material, item name, or room..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:ring-1 focus:ring-[#1C1917] outline-none text-[#1C1917] placeholder:text-[#8C827A]"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-3 text-xs text-[#57534E]">
              <SlidersHorizontal className="w-4 h-4 text-[#1C1917]" />
              <span className="uppercase tracking-wider font-semibold text-[11px]">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-[#FAF7F2] border border-[#D6CEC4] px-3 py-2 text-xs text-[#1C1917] outline-none rounded-sm font-medium"
              >
                <option value="featured">Featured Curations</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E5DFD7] text-xs font-sans">
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

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] space-y-3">
            <p className="font-serif text-xl text-[#1C1917]">No furniture pieces match your search.</p>
            <button
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="text-xs uppercase tracking-wider font-semibold underline text-[#B45309] hover:text-[#1C1917]"
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
                  transition={{ duration: 0.35, delay: (idx % 3) * 0.05 }}
                  className="group bg-[#FAF7F2] rounded-sm border border-[#E5DFD7] overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
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

                    <button
                      onClick={() => handleOpenQuickView(product)}
                      className="absolute bottom-3 right-3 bg-[#FAF7F2]/95 hover:bg-white text-[#1C1917] p-2 rounded-sm border border-[#D6CEC4] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1.5 text-[11px] font-sans font-semibold tracking-wider"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Details */}
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

                    {/* Price & Add */}
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
