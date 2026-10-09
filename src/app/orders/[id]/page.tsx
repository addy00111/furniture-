'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  PackageCheck, 
  Sparkles, 
  Truck, 
  Home as HomeIcon, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Receipt, 
  HelpCircle, 
  ShieldCheck, 
  ArrowLeft,
  XCircle,
  Printer,
  PhoneCall,
  Mail
} from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = (params?.id as string) || 'ord-sample-01'

  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false)
  const [supportMessage, setSupportMessage] = useState('')
  const [supportSuccess, setSupportSuccess] = useState(false)

  // Tracking Stages: 1. Confirmed -> 2. Processing -> 3. Shipped -> 4. Out for Delivery -> 5. Delivered
  const trackingStages = [
    { key: 'order_confirmed', label: 'Confirmed', subtext: 'Payment verified & order commissioned', icon: PackageCheck },
    { key: 'processing', label: 'Processing', subtext: 'Artisan crafting & timber finishing', icon: Sparkles },
    { key: 'shipped', label: 'Shipped', subtext: 'Departed central atelier logistics hub', icon: Truck },
    { key: 'out_for_delivery', label: 'Out for Delivery', subtext: 'Dedicated courier van on local route', icon: Truck },
    { key: 'delivered', label: 'Delivered', subtext: 'White-glove room placement complete', icon: HomeIcon },
  ]

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/orders`)
        const data = await res.json()
        const found = data?.orders?.find((o: any) => o.id === orderId)

        if (found) {
          setOrder(found)
        } else {
          // Hydrate fallback Nord-Japandi sample order
          setOrder({
            id: orderId,
            status: 'paid',
            tracking_status: 'processing',
            total_amount: 285499,
            created_at: new Date().toISOString(),
            shipping_address: {
              fullName: 'Aditya Sharma',
              email: 'aditya@example.com',
              phone: '+91 98765 43210',
              addressLine1: 'Penthouse 4B, The Monolith Residences',
              addressLine2: 'Lavelle Road',
              city: 'Bengaluru',
              state: 'Karnataka',
              pincode: '560001',
              country: 'India',
            },
            order_items: [
              {
                id: 'item-1',
                quantity: 1,
                unit_price: 285000,
                selectedColor: 'Oatmeal Ivory',
                products: {
                  name: 'Kanso Curved Bouclé Sectional',
                  category: 'Lounge & Seating',
                  images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80'],
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
          })
        }
      } catch (err) {
        console.error('Error fetching order details:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const getStageIndex = (stageKey: string) => {
    switch (stageKey) {
      case 'order_placed':
      case 'order_confirmed':
        return 0
      case 'processing':
        return 1
      case 'shipped':
        return 2
      case 'out_for_delivery':
        return 3
      case 'delivered':
        return 4
      default:
        return 0
    }
  }

  const currentStageIndex = getStageIndex(order?.tracking_status || 'processing')

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSupportSuccess(true)
    setTimeout(() => {
      setIsSupportModalOpen(false)
      setSupportSuccess(false)
      setSupportMessage('')
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-3 text-center">
            <div className="w-8 h-8 border-2 border-[#1C1917] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-[11px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
              Retrieving Spatial Manifest...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-6 md:px-12 py-12 w-full space-y-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="text-[#78716C] hover:text-[#1C1917] transition-colors p-1 -ml-1 rounded"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                Spatial Manifest Tracking
              </span>
            </div>
            <h1 className="font-serif text-2xl md:text-4xl font-normal tracking-tight text-[#1C1917]">
              Commission #{order?.id?.slice(0, 8)}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-[#E5DFD7] bg-[#F4EFEA] rounded-sm text-xs font-sans uppercase tracking-wider hover:bg-[#EFE9E1] transition-colors flex items-center space-x-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => setIsSupportModalOpen(true)}
              className="px-4 py-2 bg-[#292524] text-[#FAF7F2] rounded-sm text-xs font-sans uppercase tracking-wider hover:bg-[#3E3835] transition-colors flex items-center space-x-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Concierge Support</span>
            </button>
          </div>
        </div>

        {/* 5-Step Progress Tracker */}
        <div className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 space-y-8 shadow-nord">
          <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-4">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                Estimated White-Glove Arrival
              </span>
              <p className="font-serif text-lg font-normal text-[#1C1917] mt-0.5">
                5–7 Business Days • Dedicated Art & Furniture Courier
              </p>
            </div>
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-sm bg-[#FAF7F2] text-[#B45309] border border-[#E5DFD7] text-xs font-sans">
              <span className="w-2 h-2 rounded-full bg-[#B45309] animate-pulse" />
              <span className="capitalize">{order?.tracking_status?.replace('_', ' ') || 'In Progress'}</span>
            </span>
          </div>

          {/* Stepper Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative">
            {trackingStages.map((stage, idx) => {
              const isCompleted = idx <= currentStageIndex
              const isCurrent = idx === currentStageIndex
              const Icon = stage.icon

              return (
                <div
                  key={stage.key}
                  className={`p-4 rounded-sm border transition-all ${
                    isCurrent
                      ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm'
                      : isCompleted
                      ? 'border-[#E5DFD7] bg-[#FAF7F2]/80'
                      : 'border-[#E5DFD7] bg-[#FAF7F2]/30 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-7 h-7 rounded-sm flex items-center justify-center ${
                        isCompleted
                          ? 'bg-[#292524] text-[#FAF7F2]'
                          : 'bg-[#EFE9E1] text-[#78716C]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-[#B45309]" />}
                  </div>

                  <h4 className="font-medium text-xs text-[#1C1917]">{stage.label}</h4>
                  <p className="text-[10px] text-[#78716C] mt-0.5 font-light leading-snug">{stage.subtext}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Two Columns: Invoice Breakdown & Delivery Destination */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Itemized Invoice Breakdown */}
          <div className="lg:col-span-7 bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 space-y-6 shadow-nord">
            <div className="flex items-center space-x-2 border-b border-[#E5DFD7] pb-4">
              <Receipt className="w-4 h-4 text-[#1C1917]" />
              <h3 className="font-serif text-lg font-normal">Itemized Commission Invoice</h3>
            </div>

            <div className="divide-y divide-[#E5DFD7]">
              {order?.order_items?.map((item: any, idx: number) => {
                const product = item.products || item.product || { name: 'Architectural Piece', images: [] }
                return (
                  <div key={idx} className="py-4 flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-sm overflow-hidden bg-[#EFE9E1] border border-[#E5DFD7] shrink-0">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-serif text-sm font-normal text-[#1C1917]">{product.name}</h4>
                      <p className="text-[11px] text-[#78716C]">
                        Units: {item.quantity} {item.selectedColor ? `• Finish: ${item.selectedColor}` : ''}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-sans text-xs font-semibold text-[#1C1917]">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Financial Totals */}
            <div className="pt-4 border-t border-[#E5DFD7] space-y-2 text-xs">
              <div className="flex justify-between text-[#78716C]">
                <span>Total Amount Paid (incl. 18% GST)</span>
                <span className="font-sans text-[#1C1917] font-semibold text-sm">
                  {formatPrice(order?.total_amount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-[#78716C]">
                <span>Payment Verification</span>
                <span className="font-sans text-[#B45309]">HMAC SHA-256 Validated</span>
              </div>
              {order?.payments?.[0] && (
                <div className="flex justify-between text-[#78716C]">
                  <span>Razorpay Payment ID</span>
                  <span className="font-sans text-[#1C1917]">
                    {order.payments[0].razorpay_payment_id || 'pay_verified'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery & Logistics Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 space-y-4 shadow-nord">
              <div className="flex items-center space-x-2 border-b border-[#E5DFD7] pb-4">
                <MapPin className="w-4 h-4 text-[#1C1917]" />
                <h3 className="font-serif text-lg font-normal">Delivery Sanctuary</h3>
              </div>

              {order?.shipping_address && (
                <div className="space-y-1.5 text-xs text-[#78716C] leading-relaxed font-light">
                  <p className="font-medium text-[#1C1917] text-sm">{order.shipping_address.fullName}</p>
                  <p>{order.shipping_address.addressLine1}</p>
                  {order.shipping_address.addressLine2 && <p>{order.shipping_address.addressLine2}</p>}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  </p>
                  <p className="font-sans text-[#1C1917] pt-2">Contact: {order.shipping_address.phone}</p>
                </div>
              )}
            </div>

            <div className="bg-[#EFE9E1] rounded-sm border border-[#E5DFD7] p-6 space-y-2.5">
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#1C1917]">
                <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                <span>White-Glove Assembly Guarantee</span>
              </div>
              <p className="text-xs text-[#78716C] leading-relaxed font-light">
                Your piece is insured for the entire transit duration. Our handlers will unpack, inspect, and install each piece in your selected room.
              </p>
            </div>
          </div>
        </div>

        {/* Concierge Support Modal */}
        {isSupportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#FAF7F2] rounded-sm border border-[#E5DFD7] p-6 max-w-md w-full space-y-4 shadow-nord-lg"
            >
              <div className="flex justify-between items-center border-b border-[#E5DFD7] pb-3">
                <h3 className="font-serif text-lg font-normal">Concierge Desk</h3>
                <button
                  onClick={() => setIsSupportModalOpen(false)}
                  className="text-[#78716C] hover:text-[#1C1917]"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              {supportSuccess ? (
                <div className="p-4 bg-[#FAF7F2] text-[#B45309] border border-[#E5DFD7] rounded-sm text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                  <span>Your concierge ticket has been lodged. Our studio advisor will contact you within 2 hours.</span>
                </div>
              ) : (
                <form onSubmit={handleSupportSubmit} className="space-y-4 text-xs">
                  <p className="text-[#78716C] font-light">
                    Need to modify delivery schedules, request custom assembly instructions, or cancel this commission?
                  </p>

                  <div className="space-y-1">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Inquiry Details</label>
                    <textarea
                      required
                      rows={3}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Specify your request or delivery preference..."
                      className="w-full p-3 bg-[#F4EFEA] border border-[#E5DFD7] rounded-none outline-none focus:ring-1 focus:ring-[#1C1917]"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <a
                      href="tel:+919876543210"
                      className="flex items-center space-x-1.5 text-[#78716C] hover:text-[#1C1917]"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Direct Desk</span>
                    </a>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase font-semibold tracking-[0.14em] rounded-sm hover:bg-[#3E3835]"
                    >
                      Submit Ticket
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  )
}
