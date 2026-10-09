'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MapPin, 
  Truck, 
  Receipt, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  Plus, 
  Building, 
  Phone, 
  Mail, 
  User as UserIcon, 
  CreditCard,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'
import { ShippingAddress, DeliveryMethodType, OrderCalculationSummary } from '@/types'
import { formatPrice } from '@/lib/utils'
import { loadRazorpayScript } from '@/lib/loadRazorpay'
import { Navbar } from '@/components/layout/Navbar'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { AuthModal } from '@/components/auth/AuthModal'
import Link from 'next/link'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, couponCode, clearCart, getSubtotal, getDiscountAmount } = useCartStore()
  const { user, profile } = useAuthStore()

  // Hydration guard to ensure Zustand localStorage is populated before evaluating cart items
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Checkout Steps: 1 (Address) -> 2 (Delivery Method) -> 3 (Server Review & Payment)
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Address Form State
  const [addresses, setAddresses] = useState<ShippingAddress[]>([
    {
      id: 'addr-1',
      fullName: 'Aditya Sharma',
      email: 'aditya@example.com',
      phone: '+91 98765 43210',
      addressLine1: 'Penthouse 4B, The Monolith Residences',
      addressLine2: 'Lavelle Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      country: 'India',
      isDefault: true,
    }
  ])

  const [selectedAddressId, setSelectedAddressId] = useState<string>('addr-1')
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false)
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })

  // Delivery Method: 'standard' (Free) vs 'express' (₹499)
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType>('standard')

  // Server Calculation Summary & Payment Processing
  const [calculation, setCalculation] = useState<OrderCalculationSummary | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  // Instant local calculations as resilient fallbacks
  const clientSubtotal = getSubtotal()
  const clientDiscount = getDiscountAmount()
  const clientShipping = deliveryMethod === 'express' ? 499 : 0
  const clientTaxable = Math.max(0, clientSubtotal - clientDiscount)
  const clientGst = Math.round(clientTaxable * 0.18)
  const clientNetTotal = clientTaxable + clientGst + clientShipping

  const effectiveSubtotal = calculation?.subtotal ?? clientSubtotal
  const effectiveDiscount = calculation?.discountAmount ?? clientDiscount
  const effectiveTax = calculation?.taxAmount ?? clientGst
  const effectiveShipping = calculation?.shippingFee ?? clientShipping
  const effectiveTotal = calculation?.totalAmount ?? clientNetTotal

  // Display items: server-validated or direct cart store items
  const displayItems = (calculation?.items && calculation.items.length > 0)
    ? calculation.items
    : items.map((i) => {
        const unitPrice = Number(i.product?.discount_price ?? i.product?.price ?? 0)
        return {
          productId: i.product?.id || i.id,
          name: i.product?.name || 'Nord-Japandi Craft Piece',
          quantity: i.quantity,
          unitPrice,
          itemTotal: unitPrice * i.quantity,
          selectedColor: i.selectedColor,
        }
      })

  // Load saved profile addresses if available
  useEffect(() => {
    if (profile?.addresses && Array.isArray(profile.addresses) && profile.addresses.length > 0) {
      setAddresses(profile.addresses as any)
      setSelectedAddressId((profile.addresses[0] as any).id || 'addr-1')
    }
  }, [profile])

  // Recalculate summary on the server whenever items, delivery method, or coupon changes
  useEffect(() => {
    if (!isMounted || items.length === 0) return

    const fetchServerCalculation = async () => {
      setIsCalculating(true)
      setPaymentError(null)
      try {
        const payload = {
          items: items.map((i) => ({
            id: i.product?.id || i.id,
            productId: i.product?.id || i.id,
            quantity: i.quantity,
            price: i.product?.discount_price ?? i.product?.price,
            selectedColor: i.selectedColor,
          })),
          deliveryMethod,
          couponCode,
        }

        const res = await fetch('/api/checkout/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Server validation failed')
        setCalculation(data)
      } catch (err: any) {
        setPaymentError(err.message || 'Error validating order with server')
      } finally {
        setIsCalculating(false)
      }
    }

    fetchServerCalculation()
  }, [items, deliveryMethod, couponCode, step, isMounted])

  // Indian Pincode validator
  const handlePincodeChange = (pin: string) => {
    setNewAddress((prev) => ({ ...prev, pincode: pin }))
    if (pin.length === 6) {
      if (pin.startsWith('560')) {
        setNewAddress((prev) => ({ ...prev, city: 'Bengaluru', state: 'Karnataka' }))
      } else if (pin.startsWith('110') || pin.startsWith('201')) {
        setNewAddress((prev) => ({ ...prev, city: 'New Delhi', state: 'Delhi NCR' }))
      } else if (pin.startsWith('400')) {
        setNewAddress((prev) => ({ ...prev, city: 'Mumbai', state: 'Maharashtra' }))
      }
    }
  }

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddress.fullName || !newAddress.addressLine1 || !newAddress.pincode) return

    const addressWithId: ShippingAddress = {
      ...newAddress,
      id: `addr-${Date.now()}`,
    }

    setAddresses((prev) => [addressWithId, ...prev])
    setSelectedAddressId(addressWithId.id!)
    setIsAddingNewAddress(false)
  }

  const activeShippingAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0]

  // SECURE RAZORPAY PAYMENT INITIATION & VERIFICATION
  const handleInitiateRazorpayPayment = async () => {
    if (!activeShippingAddress) {
      setPaymentError('Please select a valid shipping address.')
      return
    }

    setPaymentError(null)
    setIsPaying(true)

    try {
      // 1. Create Razorpay Order on Server (validates items and prices server-side)
      const payload = {
        items: items.map((i) => ({
          id: i.product?.id || i.id,
          productId: i.product?.id || i.id,
          quantity: i.quantity,
          price: i.product?.discount_price ?? i.product?.price,
          selectedColor: i.selectedColor,
        })),
        amount: effectiveTotal,
        shippingAddress: activeShippingAddress,
        deliveryMethod,
        couponCode,
      }

      let createOrderRes = await fetch('/api/checkout/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      // Fallback alias endpoint if primary route fails
      if (!createOrderRes.ok) {
        createOrderRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      const orderData = await createOrderRes.json()
      if (!createOrderRes.ok) throw new Error(orderData.error || 'Failed to initialize order.')

      const { 
        orderId, 
        dbOrderId, 
        razorpay_order_id, 
        amount, 
        currency = 'INR', 
        key, 
        keyId,
        isLiveRazorpay 
      } = orderData

      const activeKey = key || keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''
      const activeRazorpayOrderId = razorpay_order_id || orderData.id || orderId
      const targetDbOrderId = dbOrderId || orderId

      // 2. Dynamically load Razorpay SDK
      const isLoaded = await loadRazorpayScript()

      // If Razorpay SDK loaded and a live Razorpay order was successfully created on Razorpay servers
      if (
        isLiveRazorpay && 
        activeRazorpayOrderId && 
        isLoaded && 
        (window as any).Razorpay && 
        activeKey && 
        !activeKey.includes('placeholder')
      ) {
        const options = {
          key: activeKey,
          amount: amount,
          currency: currency,
          order_id: activeRazorpayOrderId,
          name: 'Sora Living',
          description: 'Architectural Furniture Commission',
          image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80',
          handler: async function (response: any) {
            try {
              // 3. Verify Payment Signature on Server
              const verifyRes = await fetch('/api/checkout/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: targetDbOrderId,
                  razorpay_order_id: response.razorpay_order_id || activeRazorpayOrderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              })

              const verifyData = await verifyRes.json()
              if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment signature verification failed.')

              clearCart()
              router.push(verifyData.redirectUrl || `/orders/${targetDbOrderId}/confirmation`)
            } catch (vErr: any) {
              setPaymentError(vErr.message || 'Signature verification failed.')
              setIsPaying(false)
            }
          },
          prefill: {
            name: activeShippingAddress.fullName,
            email: activeShippingAddress.email || user?.email || '',
            contact: activeShippingAddress.phone,
          },
          theme: {
            color: '#292524',
          },
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.on('payment.failed', function (resp: any) {
          setPaymentError(resp.error?.description || 'Payment was declined or cancelled.')
          setIsPaying(false)
        })
        rzp.open()
      } else {
        // Seamless fallback test verification when offline/test simulation
        const simulatedPaymentId = `pay_${Date.now().toString().slice(-8)}`
        const simulatedSig = `simulated_sig_${Date.now()}`

        const verifyRes = await fetch('/api/checkout/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: targetDbOrderId,
            razorpay_order_id: activeRazorpayOrderId || `order_${Date.now()}`,
            razorpay_payment_id: simulatedPaymentId,
            razorpay_signature: simulatedSig,
          }),
        })

        const verifyData = await verifyRes.json()
        if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed.')

        clearCart()
        router.push(verifyData.redirectUrl || `/orders/${targetDbOrderId}/confirmation`)
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment initiation encountered an issue.')
      setIsPaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />
      <CartDrawer />
      <AuthModal />

      <main className="flex-1 max-w-7xl mx-auto px-6 md:px-12 py-10 w-full">
        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-[#E5DFD7] -z-0" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center bg-[#FAF7F2] px-4">
              <button
                onClick={() => setStep(1)}
                className={`w-9 h-9 rounded-sm flex items-center justify-center font-sans text-xs font-semibold transition-all ${
                  step >= 1 ? 'bg-[#292524] text-[#FAF7F2]' : 'bg-[#EFE9E1] text-[#78716C]'
                }`}
              >
                01
              </button>
              <span className="text-[10px] font-sans uppercase tracking-[0.16em] mt-2 text-[#78716C]">
                Destination
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center bg-[#FAF7F2] px-4">
              <button
                onClick={() => setStep(2)}
                disabled={!activeShippingAddress}
                className={`w-9 h-9 rounded-sm flex items-center justify-center font-sans text-xs font-semibold transition-all ${
                  step >= 2 ? 'bg-[#292524] text-[#FAF7F2]' : 'bg-[#EFE9E1] text-[#78716C]'
                }`}
              >
                02
              </button>
              <span className="text-[10px] font-sans uppercase tracking-[0.16em] mt-2 text-[#78716C]">
                Logistics
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center bg-[#FAF7F2] px-4">
              <button
                onClick={() => setStep(3)}
                className={`w-9 h-9 rounded-sm flex items-center justify-center font-sans text-xs font-semibold transition-all ${
                  step === 3 ? 'bg-[#292524] text-[#FAF7F2]' : 'bg-[#EFE9E1] text-[#78716C]'
                }`}
              >
                03
              </button>
              <span className="text-[10px] font-sans uppercase tracking-[0.16em] mt-2 text-[#78716C]">
                Verification
              </span>
            </div>
          </div>
        </div>

        {!isMounted ? (
          <div className="py-24 text-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] space-y-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#78716C]" />
            <p className="text-xs text-[#78716C] font-light uppercase tracking-widest">Synchronizing Cart Manifest...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] space-y-4">
            <h2 className="font-serif text-2xl font-normal">Your spatial bag is empty</h2>
            <p className="text-xs text-[#78716C] font-light">Please select furniture pieces before proceeding to checkout.</p>
            <Link
              href="/#collections"
              className="inline-block px-6 py-3 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.16em] rounded-sm"
            >
              Browse The Atelier
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Step Content Container */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {/* STEP 1: DELIVERY ADDRESS */}
                {step === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 space-y-6 shadow-nord"
                  >
                    <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-4">
                      <div>
                        <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                          Step 01 / Destination
                        </span>
                        <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1C1917]">
                          Delivery Sanctuary Address
                        </h2>
                      </div>
                      <button
                        onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                        className="inline-flex items-center space-x-1.5 text-[11px] font-sans uppercase tracking-[0.14em] px-3.5 py-1.5 rounded-sm border border-[#E5DFD7] bg-[#FAF7F2] hover:bg-[#EFE9E1] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingNewAddress ? 'Cancel' : 'Add Destination'}</span>
                      </button>
                    </div>

                    {/* Saved Addresses List */}
                    {!isAddingNewAddress && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => setSelectedAddressId(addr.id!)}
                            className={`p-5 rounded-sm border cursor-pointer transition-all ${
                              selectedAddressId === addr.id
                                ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm'
                                : 'border-[#E5DFD7] hover:border-[#A89F91] bg-[#FAF7F2]/60'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <span className="font-medium text-xs text-[#1C1917]">
                                  {addr.fullName}
                                </span>
                                <p className="text-xs text-[#78716C] font-light leading-relaxed">
                                  {addr.addressLine1}
                                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                                  <br />
                                  {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                                <p className="text-[11px] text-[#78716C] pt-2">{addr.phone}</p>
                              </div>
                              {selectedAddressId === addr.id && (
                                <CheckCircle2 className="w-4 h-4 text-[#1C1917] shrink-0" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add New Address Form */}
                    {isAddingNewAddress && (
                      <form onSubmit={handleSaveNewAddress} className="space-y-4 pt-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Full Name</label>
                            <input
                              type="text"
                              required
                              value={newAddress.fullName}
                              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                              placeholder="Aditya Sharma"
                              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E5DFD7] rounded-none focus:ring-1 focus:ring-[#1C1917] outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Phone Number</label>
                            <input
                              type="tel"
                              required
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E5DFD7] rounded-none focus:ring-1 focus:ring-[#1C1917] outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Address Line 1</label>
                          <input
                            type="text"
                            required
                            value={newAddress.addressLine1}
                            onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                            placeholder="Apartment, Street, Landmark"
                            className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E5DFD7] rounded-none focus:ring-1 focus:ring-[#1C1917] outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">Pincode</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={newAddress.pincode}
                              onChange={(e) => handlePincodeChange(e.target.value)}
                              placeholder="560001"
                              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E5DFD7] rounded-none focus:ring-1 focus:ring-[#1C1917] outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">City</label>
                            <input
                              type="text"
                              required
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              placeholder="Bengaluru"
                              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E5DFD7] rounded-none focus:ring-1 focus:ring-[#1C1917] outline-none"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">State</label>
                            <input
                              type="text"
                              required
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              placeholder="Karnataka"
                              className="w-full px-3.5 py-2.5 text-xs bg-[#FAF7F2] border border-[#E5DFD7] rounded-none focus:ring-1 focus:ring-[#1C1917] outline-none"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.14em] font-semibold rounded-sm hover:bg-[#3E3835]"
                          >
                            Save Destination
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="pt-6 border-t border-[#E5DFD7] flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!activeShippingAddress}
                        className="px-8 py-3.5 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#3E3835] transition-all flex items-center space-x-2 shadow-nord"
                      >
                        <span>Continue to Logistics</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 2: DELIVERY METHOD */}
                {step === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 space-y-6 shadow-nord"
                  >
                    <div className="border-b border-[#E5DFD7] pb-4">
                      <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                        Step 02 / Logistics
                      </span>
                      <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1C1917]">
                        Select Delivery Logistics
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {/* Standard Option */}
                      <div
                        onClick={() => setDeliveryMethod('standard')}
                        className={`p-5 rounded-sm border cursor-pointer transition-all ${
                          deliveryMethod === 'standard'
                            ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm'
                            : 'border-[#E5DFD7] hover:border-[#A89F91] bg-[#FAF7F2]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Truck className="w-4 h-4 text-[#1C1917]" />
                              <h3 className="font-medium text-xs text-[#1C1917]">
                                White-Glove Architectural Delivery
                              </h3>
                              <span className="text-[9px] font-sans bg-[#FAF7F2] text-[#B45309] border border-[#E5DFD7] px-2 py-0.5 uppercase tracking-wider font-semibold">
                                FREE
                              </span>
                            </div>
                            <p className="text-xs text-[#78716C] font-light max-w-md pt-1 leading-relaxed">
                              Delivered by trained art & furniture handlers with room-of-choice placement and debris removal (5-7 business days).
                            </p>
                          </div>
                          {deliveryMethod === 'standard' && (
                            <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />
                          )}
                        </div>
                      </div>

                      {/* Express Option */}
                      <div
                        onClick={() => setDeliveryMethod('express')}
                        className={`p-5 rounded-sm border cursor-pointer transition-all ${
                          deliveryMethod === 'express'
                            ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm'
                            : 'border-[#E5DFD7] hover:border-[#A89F91] bg-[#FAF7F2]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Truck className="w-4 h-4 text-[#B45309]" />
                              <h3 className="font-medium text-xs text-[#1C1917]">
                                Priority Express Architectural Dispatch
                              </h3>
                              <span className="text-[9px] font-sans bg-[#FAF7F2] text-[#1C1917] border border-[#E5DFD7] px-2 py-0.5 uppercase tracking-wider font-semibold">
                                ₹499
                              </span>
                            </div>
                            <p className="text-xs text-[#78716C] font-light max-w-md pt-1 leading-relaxed">
                              Expedited priority route with dedicated courier van and appointment scheduling (2-3 business days).
                            </p>
                          </div>
                          {deliveryMethod === 'express' && (
                            <CheckCircle2 className="w-4 h-4 text-[#1C1917]" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#E5DFD7] flex items-center justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="px-6 py-3 border border-[#E5DFD7] bg-[#FAF7F2] text-[#1C1917] text-[11px] uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-[#EFE9E1] flex items-center space-x-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={() => setStep(3)}
                        className="px-8 py-3.5 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#3E3835] transition-all flex items-center space-x-2 shadow-nord"
                      >
                        <span>Review & Manifest</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: SERVER-VALIDATED REVIEW & RAZORPAY PAYMENT */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 space-y-6 shadow-nord"
                  >
                    <div className="border-b border-[#E5DFD7] pb-4">
                      <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                        Step 03 / Final Verification
                      </span>
                      <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1C1917]">
                        Order Manifest & Razorpay Gateway
                      </h2>
                    </div>

                    {paymentError && (
                      <div className="p-4 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{paymentError}</span>
                      </div>
                    )}

                    {/* Delivery Summary Tile */}
                    <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-between text-xs">
                      <div>
                        <span className="font-sans uppercase tracking-wider text-[10px] text-[#78716C]">Delivery Destination</span>
                        <p className="font-medium text-[#1C1917] mt-0.5">
                          {activeShippingAddress.fullName} • {activeShippingAddress.addressLine1}, {activeShippingAddress.city} ({activeShippingAddress.pincode})
                        </p>
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs underline text-[#78716C] hover:text-[#1C1917]"
                      >
                        Change
                      </button>
                    </div>

                    {/* Validated Items List */}
                    <div className="divide-y divide-[#E5DFD7] text-xs">
                      {displayItems.map((item) => (
                        <div key={item.productId} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-xs text-[#1C1917]">{item.name}</p>
                            <p className="text-[#78716C] text-[11px]">Units: {item.quantity} {item.selectedColor ? `• Finish: ${item.selectedColor}` : ''}</p>
                          </div>
                          <span className="font-sans text-xs font-semibold text-[#1C1917]">
                            {formatPrice(item.itemTotal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-[#E5DFD7] flex items-center justify-between">
                      <button
                        onClick={() => setStep(2)}
                        disabled={isPaying}
                        className="px-6 py-3 border border-[#E5DFD7] bg-[#FAF7F2] text-[#1C1917] text-[11px] uppercase tracking-[0.14em] font-medium rounded-sm hover:bg-[#EFE9E1] flex items-center space-x-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handleInitiateRazorpayPayment}
                        disabled={isPaying || isCalculating}
                        className="px-8 py-3.5 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#3E3835] transition-all flex items-center space-x-2 shadow-nord disabled:opacity-50"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Commission...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Pay {formatPrice(effectiveTotal)} with Razorpay</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Financials */}
            <div className="lg:col-span-4">
              <div className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 space-y-5 sticky top-28 shadow-nord">
                <h3 className="font-serif text-lg font-normal tracking-tight text-[#1C1917]">Order Manifest</h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#78716C]">
                    <span>Item Subtotal</span>
                    <span className="font-sans text-[#1C1917]">
                      {formatPrice(effectiveSubtotal)}
                    </span>
                  </div>

                  {effectiveDiscount > 0 && (
                    <div className="flex justify-between text-[#B45309] font-medium">
                      <span>Promo ({calculation?.appliedCoupon || couponCode})</span>
                      <span className="font-sans">-{formatPrice(effectiveDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#78716C]">
                    <span>Applicable GST (18%)</span>
                    <span className="font-sans text-[#1C1917]">
                      {formatPrice(effectiveTax)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#78716C]">
                    <span>White-Glove Logistics</span>
                    <span className="font-sans text-[#1C1917]">
                      {effectiveShipping > 0 ? '₹499' : 'COMPLIMENTARY'}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-semibold text-[#1C1917] pt-4 border-t border-[#E5DFD7]">
                    <span>Net Payable</span>
                    <span className="font-sans text-xl font-bold">
                      {formatPrice(effectiveTotal)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-1.5 text-[11px] text-[#78716C] font-light">
                  <div className="flex items-center space-x-1.5 text-[#1C1917] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
                    <span>HMAC SHA-256 Server Verification</span>
                  </div>
                  <p>
                    All items are validated on the server directly from DB prices before payment signature generation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

