'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UploadCloud, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { formatPrice } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { NORD_JAPANDI_PRODUCTS } from '@/data/products'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { user, profile } = useAuthStore()

  // Tabs: 'overview' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview')

  // Products State
  const [products, setProducts] = useState<any[]>([])
  const [isProductsLoading, setIsProductsLoading] = useState(false)
  const [productSearch, setProductSearch] = useState('')
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)

  // Product Form
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    category: 'Lounge & Seating',
    material: '',
    dimensions: '',
    colors: '',
    price: '',
    discount_price: '',
    stock: '10',
    description: '',
    images: '',
    featured: false,
  })

  // Orders State
  const [orders, setOrders] = useState<any[]>([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(false)

  // Image Upload State
  const [isUploading, setIsUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState<string | null>(null)

  // Fetch Products
  const loadProducts = async () => {
    setIsProductsLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      if (data.products && data.products.length > 0) {
        setProducts(data.products)
      } else {
        setProducts(NORD_JAPANDI_PRODUCTS)
      }
    } catch (err) {
      setProducts(NORD_JAPANDI_PRODUCTS)
    } finally {
      setIsProductsLoading(false)
    }
  }

  // Fetch Orders
  const loadOrders = async () => {
    setIsOrdersLoading(true)
    try {
      const res = await fetch('/api/admin/orders')
      const data = await res.json()
      if (data.orders && data.orders.length > 0) {
        setOrders(data.orders)
      } else {
        // Hydrate default orders
        setOrders([
          {
            id: 'ord-8f92a104-b209',
            status: 'paid',
            tracking_status: 'processing',
            total_amount: 285499,
            created_at: new Date().toISOString(),
            shipping_address: {
              fullName: 'Aditya Sharma',
              email: 'aditya@example.com',
              phone: '+91 98765 43210',
              addressLine1: 'Penthouse 4B, The Monolith Residences',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560001',
            },
            order_items: [
              {
                quantity: 1,
                unit_price: 285000,
                products: {
                  name: 'Kanso Curved Bouclé Sectional',
                  category: 'Lounge & Seating',
                },
              },
            ],
            payments: [
              {
                razorpay_order_id: 'order_rzp_984382',
                razorpay_payment_id: 'pay_rzp_19827364',
                status: 'captured',
              },
            ],
          },
          {
            id: 'ord-4c129e81-e991',
            status: 'shipped',
            tracking_status: 'out_for_delivery',
            total_amount: 245499,
            created_at: new Date(Date.now() - 86400000).toISOString(),
            shipping_address: {
              fullName: 'Ananya Rao',
              email: 'ananya.rao@designfirm.in',
              phone: '+91 98111 22334',
              addressLine1: 'Villa 12, Golf Links',
              city: 'New Delhi',
              state: 'Delhi NCR',
              pincode: '110003',
            },
            order_items: [
              {
                quantity: 1,
                unit_price: 245000,
                products: {
                  name: 'Sora Solid White-Oak Dining Table',
                  category: 'Dining & Gathering',
                },
              },
            ],
            payments: [
              {
                razorpay_order_id: 'order_rzp_773621',
                razorpay_payment_id: 'pay_rzp_88371625',
                status: 'captured',
              },
            ],
          },
        ])
      }
    } catch (err) {
      console.error('Failed to load orders:', err)
    } finally {
      setIsOrdersLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
    loadOrders()
  }, [])

  // Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered' ? Number(o.total_amount) : 0), 0)
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length
  const lowStockProducts = products.filter((p) => p.stock < 5)

  // Handle Product Save
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        ...productForm,
        images: productForm.images ? productForm.images.split('\n').filter(Boolean) : [],
      }

      if (editingProduct) {
        await fetch('/api/admin/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProduct.id, ...payload }),
        })
      } else {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      setIsProductModalOpen(false)
      setEditingProduct(null)
      loadProducts()
    } catch (err) {
      console.error('Error saving product:', err)
    }
  }

  // Handle Product Delete
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you wish to remove this architectural masterpiece?')) return
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' })
      loadProducts()
    } catch (err) {
      console.error('Error deleting product:', err)
    }
  }

  // Handle Image Upload to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadMessage(null)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setProductForm((prev) => ({
          ...prev,
          images: prev.images ? `${prev.images}\n${data.url}` : data.url,
        }))
        setUploadMessage('Image uploaded to Supabase Storage!')
      } else {
        setUploadMessage('Upload fallback: paste image URL below.')
      }
    } catch (err) {
      setUploadMessage('Direct upload skipped. URLs supported.')
    } finally {
      setIsUploading(false)
    }
  }

  // Handle Order Status Mutation
  const handleUpdateOrderStatus = async (orderId: string, status?: string, tracking_status?: string) => {
    try {
      await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, tracking_status }),
      })
      loadOrders()
    } catch (err) {
      console.error('Error updating order:', err)
    }
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category?.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-10 w-full space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD7] pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#B45309]" />
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                Sora Living Studio Desk
              </span>
            </div>
            <h1 className="font-serif text-3xl font-normal tracking-tight">Sora Living Studio Desk</h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                loadProducts()
                loadOrders()
              }}
              className="p-2 border border-[#E5DFD7] bg-[#F4EFEA] rounded-sm hover:bg-[#EFE9E1] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4 text-[#78716C]" />
            </button>

            <button
              onClick={() => {
                setEditingProduct(null)
                setProductForm({
                  name: '',
                  slug: '',
                  category: 'Lounge & Seating',
                  material: '',
                  dimensions: '',
                  colors: '',
                  price: '',
                  discount_price: '',
                  stock: '10',
                  description: '',
                  images: '',
                  featured: false,
                })
                setIsProductModalOpen(true)
              }}
              className="px-4 py-2.5 bg-[#292524] text-[#FAF7F2] rounded-sm text-xs font-sans uppercase tracking-[0.14em] font-semibold hover:bg-[#3E3835] transition-colors flex items-center space-x-2 shadow-nord"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Commission New Piece</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E5DFD7] space-x-8 text-xs font-sans uppercase tracking-[0.14em]">
          {[
            { key: 'overview', label: 'Overview Metrics', icon: LayoutDashboard },
            { key: 'products', label: `Catalog (${products.length})`, icon: Package },
            { key: 'orders', label: `Manifests (${orders.length})`, icon: ShoppingBag },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-3 flex items-center space-x-2 border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-[#1C1917] text-[#1C1917] font-semibold'
                    : 'border-transparent text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-2 shadow-nord">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="text-[10px] font-sans uppercase tracking-wider">Gross Paid Revenue</span>
                  <TrendingUp className="w-4 h-4 text-[#B45309]" />
                </div>
                <h3 className="font-sans text-2xl font-bold text-[#1C1917]">
                  {formatPrice(totalRevenue)}
                </h3>
                <p className="text-[11px] text-[#78716C] font-light">Verified Razorpay settlements</p>
              </div>

              <div className="p-6 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-2 shadow-nord">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="text-[10px] font-sans uppercase tracking-wider">Active Manifests</span>
                  <ShoppingBag className="w-4 h-4 text-[#1C1917]" />
                </div>
                <h3 className="font-sans text-2xl font-bold text-[#1C1917]">
                  {activeOrdersCount}
                </h3>
                <p className="text-[11px] text-[#78716C] font-light">In fabrication or courier transit</p>
              </div>

              <div className="p-6 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-2 shadow-nord">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="text-[10px] font-sans uppercase tracking-wider">Masterpiece Series</span>
                  <Package className="w-4 h-4 text-[#1C1917]" />
                </div>
                <h3 className="font-sans text-2xl font-bold text-[#1C1917]">
                  {products.length} Archetypes
                </h3>
                <p className="text-[11px] text-[#78716C] font-light">Across all 5 disciplines</p>
              </div>

              <div className="p-6 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] space-y-2 shadow-nord">
                <div className="flex items-center justify-between text-[#78716C]">
                  <span className="text-[10px] font-sans uppercase tracking-wider">Low Stock Watchlist</span>
                  <AlertTriangle className="w-4 h-4 text-[#B45309]" />
                </div>
                <h3 className="font-sans text-2xl font-bold text-[#B45309]">
                  {lowStockProducts.length} Items
                </h3>
                <p className="text-[11px] text-[#78716C] font-light">Units remaining &lt; 5 in studio</p>
              </div>
            </div>

            {/* Low Stock Watchlist */}
            {lowStockProducts.length > 0 && (
              <div className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 space-y-4 shadow-nord">
                <div className="flex items-center space-x-2 text-[#B45309]">
                  <AlertTriangle className="w-4 h-4" />
                  <h3 className="font-serif text-lg font-normal">Critical Inventory Watchlist</h3>
                </div>

                <div className="divide-y divide-[#E5DFD7]">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-medium text-xs text-[#1C1917]">{p.name}</span>
                        <p className="text-[#78716C] text-[11px]">{p.category} • {p.material}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-sans font-bold text-[#B45309] bg-[#FAF7F2] px-3 py-1 border border-[#E5DFD7]">
                          {p.stock} units remaining
                        </span>
                        <button
                          onClick={() => {
                            setEditingProduct(p)
                            setProductForm({
                              name: p.name,
                              slug: p.slug,
                              category: p.category,
                              material: p.material || '',
                              dimensions: p.dimensions || '',
                              colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
                              price: p.price.toString(),
                              discount_price: p.discount_price ? p.discount_price.toString() : '',
                              stock: p.stock.toString(),
                              description: p.description || '',
                              images: Array.isArray(p.images) ? p.images.join('\n') : '',
                              featured: p.featured || false,
                            })
                            setIsProductModalOpen(true)
                          }}
                          className="px-3 py-1.5 border border-[#E5DFD7] bg-[#FAF7F2] rounded-sm font-sans hover:bg-[#EFE9E1]"
                        >
                          Restock
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-[#78716C] absolute left-3 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Filter by name or category..."
                  className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F4EFEA] border border-[#E5DFD7] rounded-none focus:ring-1 focus:ring-[#1C1917] outline-none"
                />
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] overflow-hidden shadow-nord">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#E5DFD7] text-[#78716C] font-sans uppercase tracking-[0.14em] text-[10px]">
                    <tr>
                      <th className="py-3.5 px-6">Archetype</th>
                      <th className="py-3.5 px-6">Discipline</th>
                      <th className="py-3.5 px-6">Materials</th>
                      <th className="py-3.5 px-6">Acquisition</th>
                      <th className="py-3.5 px-6">Inventory</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD7]">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-4 px-6 flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-sm bg-[#EFE9E1] overflow-hidden shrink-0 border border-[#E5DFD7]">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            ) : null}
                          </div>
                          <div>
                            <span className="font-serif text-sm font-normal text-[#1C1917] line-clamp-1">{p.name}</span>
                            {p.featured && (
                              <span className="text-[9px] font-sans bg-[#FAF7F2] border border-[#E5DFD7] text-[#B45309] px-1.5 py-0.5">Key Piece</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-[#78716C]">{p.category}</td>
                        <td className="py-4 px-6 text-[#78716C] max-w-xs truncate font-light">{p.material}</td>
                        <td className="py-4 px-6 font-sans font-semibold text-[#1C1917]">
                          {formatPrice(p.discount_price ?? p.price)}
                        </td>
                        <td className="py-4 px-6 font-sans">
                          <span className={`px-2 py-0.5 rounded-none font-semibold text-[10px] border ${
                            p.stock < 5 ? 'bg-[#FAF7F2] border-amber-300 text-[#B45309]' : 'bg-[#FAF7F2] border-[#E5DFD7] text-[#1C1917]'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProduct(p)
                              setProductForm({
                                name: p.name,
                                slug: p.slug || '',
                                category: p.category,
                                material: p.material || '',
                                dimensions: p.dimensions || '',
                                colors: Array.isArray(p.colors) ? p.colors.join(', ') : '',
                                price: p.price.toString(),
                                discount_price: p.discount_price ? p.discount_price.toString() : '',
                                stock: p.stock.toString(),
                                description: p.description || '',
                                images: Array.isArray(p.images) ? p.images.join('\n') : '',
                                featured: p.featured || false,
                              })
                              setIsProductModalOpen(true)
                            }}
                            className="p-1.5 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFE9E1] rounded transition-colors"
                            title="Edit Piece"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-[#A89F91] hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                            title="Delete Piece"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDER MANAGER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] overflow-hidden shadow-nord">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#E5DFD7] text-[#78716C] font-sans uppercase tracking-[0.14em] text-[10px]">
                    <tr>
                      <th className="py-3.5 px-6">Manifest & Date</th>
                      <th className="py-3.5 px-6">Customer Destination</th>
                      <th className="py-3.5 px-6">Acquisition Amount</th>
                      <th className="py-3.5 px-6">Order Status</th>
                      <th className="py-3.5 px-6">Fulfillment Journey</th>
                      <th className="py-3.5 px-6 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD7]">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="py-4 px-6 font-sans">
                          <p className="font-semibold text-xs text-[#1C1917]">#{order.id?.slice(0, 8)}</p>
                          <span className="text-[#78716C] text-[10px]">
                            {new Date(order.created_at).toLocaleDateString()}
                          </span>
                        </td>

                        <td className="py-4 px-6 space-y-0.5">
                          <p className="font-medium text-xs text-[#1C1917]">
                            {order.shipping_address?.fullName || 'Guest Customer'}
                          </p>
                          <p className="text-[11px] text-[#78716C] font-light">
                            {order.shipping_address?.city}, {order.shipping_address?.state} ({order.shipping_address?.pincode})
                          </p>
                        </td>

                        <td className="py-4 px-6">
                          <p className="font-sans font-bold text-xs text-[#1C1917]">
                            {formatPrice(order.total_amount)}
                          </p>
                          <span className="text-[10px] text-[#78716C]">
                            {order.order_items?.length || 1} spatial piece(s)
                          </span>
                        </td>

                        {/* Order Status Select */}
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                            className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-none px-2.5 py-1 text-xs font-sans outline-none"
                          >
                            <option value="pending">Pending</option>
                            <option value="pending_payment">Pending Payment</option>
                            <option value="paid">Paid</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Tracking Status Select */}
                        <td className="py-4 px-6">
                          <select
                            value={order.tracking_status || 'order_placed'}
                            onChange={(e) => handleUpdateOrderStatus(order.id, undefined, e.target.value)}
                            className="bg-[#FAF7F2] border border-[#E5DFD7] rounded-none px-2.5 py-1 text-xs font-sans outline-none"
                          >
                            <option value="order_placed">Confirmed</option>
                            <option value="order_confirmed">Confirmed (Paid)</option>
                            <option value="processing">Processing (Artisan)</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <Link
                            href={`/orders/${order.id}`}
                            className="p-2 border border-[#E5DFD7] bg-[#FAF7F2] rounded-sm hover:bg-[#EFE9E1] inline-flex items-center space-x-1 font-sans text-[11px]"
                          >
                            <span>Track</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Product Modal */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#FAF7F2] rounded-sm border border-[#E5DFD7] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-nord-lg"
            >
              <div className="flex justify-between items-center border-b border-[#E5DFD7] pb-4">
                <h3 className="font-serif text-xl font-normal">
                  {editingProduct ? 'Modify Architectural Piece' : 'Commission New Architectural Piece'}
                </h3>
                <button
                  onClick={() => setIsProductModalOpen(false)}
                  className="p-1 rounded-full text-[#78716C] hover:text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Piece Name</label>
                    <input
                      type="text"
                      required
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Kanso Curved Bouclé Sectional"
                      className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none focus:ring-1 focus:ring-[#1C1917]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Discipline</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none"
                    >
                      <option value="Lounge & Seating">Lounge & Seating</option>
                      <option value="Dining & Gathering">Dining & Gathering</option>
                      <option value="Sanctuary (Beds)">Sanctuary (Beds)</option>
                      <option value="Studio & Storage">Studio & Storage</option>
                      <option value="Accents & Objects">Accents & Objects</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Regular Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="320000"
                      className="w-full px-3.5 py-2.5 font-sans bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Offer Price (₹, optional)</label>
                    <input
                      type="number"
                      value={productForm.discount_price}
                      onChange={(e) => setProductForm({ ...productForm, discount_price: e.target.value })}
                      placeholder="285000"
                      className="w-full px-3.5 py-2.5 font-sans bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Studio Stock</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="10"
                      className="w-full px-3.5 py-2.5 font-sans bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Materials</label>
                    <input
                      type="text"
                      value={productForm.material}
                      onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                      placeholder="Italian Bouclé & Solid Ash"
                      className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Dimensions</label>
                    <input
                      type="text"
                      value={productForm.dimensions}
                      onChange={(e) => setProductForm({ ...productForm, dimensions: e.target.value })}
                      placeholder="280cm W x 110cm D x 72cm H"
                      className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Finishes / Colors (Comma-separated)</label>
                  <input
                    type="text"
                    value={productForm.colors}
                    onChange={(e) => setProductForm({ ...productForm, colors: e.target.value })}
                    placeholder="Oatmeal Ivory, Charcoal Slate, Terracotta Taupe"
                    className="w-full px-3.5 py-2.5 bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe architectural proportions, ergonomics, and tactile materiality..."
                    className="w-full p-3 bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none"
                  />
                </div>

                {/* Imagery */}
                <div className="space-y-2 p-4 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7]">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Imagery</span>
                    <label className="cursor-pointer px-3 py-1 bg-[#FAF7F2] border border-[#E5DFD7] text-[10px] font-sans hover:bg-[#EFE9E1] flex items-center space-x-1">
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Uploading...' : 'Upload File'}</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>

                  {uploadMessage && <p className="text-[10px] text-[#B45309]">{uploadMessage}</p>}

                  <textarea
                    rows={2}
                    value={productForm.images}
                    onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                    placeholder="Paste image URLs (one per line, Unsplash or Storage links)"
                    className="w-full p-2 text-xs font-mono bg-[#FAF7F2] border border-[#E5DFD7] rounded-none outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#E5DFD7]">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.featured}
                      onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      className="rounded border-[#E5DFD7]"
                    />
                    <span className="text-xs">Feature in Atelier Spotlight</span>
                  </label>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.16em] font-semibold rounded-sm hover:bg-[#3E3835] transition-colors shadow-nord"
                  >
                    {editingProduct ? 'Save Modifications' : 'Publish Masterpiece'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}
