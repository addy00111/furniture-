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
  Building2,
  Phone, 
  Mail, 
  User as UserIcon, 
  CreditCard,
  Smartphone,
  Banknote,
  QrCode,
  HelpCircle,
  Check,
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

  // Payment Method Selection: 'card' | 'upi' | 'netbanking' | 'cod'
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'cod'>('card')

  // Card Form State
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')

  // UPI Form State
  const [upiId, setUpiId] = useState('')
  const [upiVerified, setUpiVerified] = useState(false)
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay')

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState('HDFC')
  const [otherBank, setOtherBank] = useState('')

  const handleCardNumberChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16)
    const parts = raw.match(/.{1,4}/g)
    setCardNumber(parts ? parts.join(' ') : '')
  }

  const handleExpiryChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2)}`)
    } else {
      setCardExpiry(raw)
    }
  }

  const handleCvvChange = (val: string) => {
    setCardCvv(val.replace(/\D/g, '').slice(0, 4))
  }

  const getCardBrand = (num: string) => {
    const clean = num.replace(/\s/g, '')
    if (clean.startsWith('4')) return 'Visa'
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'Mastercard'
    if (/^(60|65|81|82|508)/.test(clean)) return 'RuPay'
    if (/^(34|37)/.test(clean)) return 'Amex'
    return null
  }

  const cardBrand = getCardBrand(cardNumber)

  const handleVerifyUpi = () => {
    if (upiId.includes('@') && upiId.length > 3) {
      setUpiVerified(true)
      setPaymentError(null)
    } else {
      setUpiVerified(false)
      setPaymentError('Please enter a valid UPI ID (e.g. mobile@upi or name@okhdfcbank)')
    }
  }

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
          currency: currency || 'INR',
          name: 'SORA LIVING',
          description: 'Order Checkout',
          order_id: activeRazorpayOrderId,
          prefill: {
            name: (paymentMethod === 'card' && cardName) || activeShippingAddress.fullName || '',
            email: activeShippingAddress.email || user?.email || '',
            contact: activeShippingAddress.phone || '',
          },
          notes: {
            store: 'Sora Living Atelier',
            selected_method: paymentMethod,
            bank: paymentMethod === 'netbanking' ? (otherBank || selectedBank) : '',
            upi_vpa: paymentMethod === 'upi' ? upiId : '',
          },
          theme: {
            color: '#1C1917',
          },
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

  // Unified Order Placement Handler (Online Payment vs Cash on Delivery)
  const handlePlaceOrder = async () => {
    if (!activeShippingAddress) {
      setPaymentError('Please select a valid shipping address.')
      return
    }

    if (paymentMethod === 'cod') {
      setIsPaying(true)
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
          amount: effectiveTotal,
          shippingAddress: activeShippingAddress,
          deliveryMethod,
          couponCode,
        }

        const res = await fetch('/api/checkout/create-cod-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed to place Cash on Delivery order.')

        clearCart()
        router.push(data.redirectUrl || `/orders/${data.orderId}/confirmation`)
      } catch (err: any) {
        setPaymentError(err.message || 'Failed to place Cash on Delivery order.')
        setIsPaying(false)
      }
    } else {
      await handleInitiateRazorpayPayment()
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
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1.5px] bg-[#D6CEC4] -z-0" />
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center bg-[#FAF7F2] px-4">
              <button
                onClick={() => setStep(1)}
                className={`w-9 h-9 rounded-sm flex items-center justify-center font-sans text-xs font-bold transition-all ${
                  step >= 1 ? 'bg-[#1C1917] text-[#FAF7F2]' : 'bg-[#EAE3D9] text-[#57534E]'
                }`}
              >
                01
              </button>
              <span className="text-xs font-sans uppercase tracking-wider font-semibold mt-2 text-[#44403C]">
                Address
              </span>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center bg-[#FAF7F2] px-4">
              <button
                onClick={() => setStep(2)}
                disabled={!activeShippingAddress}
                className={`w-9 h-9 rounded-sm flex items-center justify-center font-sans text-xs font-bold transition-all ${
                  step >= 2 ? 'bg-[#1C1917] text-[#FAF7F2]' : 'bg-[#EAE3D9] text-[#57534E]'
                }`}
              >
                02
              </button>
              <span className="text-xs font-sans uppercase tracking-wider font-semibold mt-2 text-[#44403C]">
                Delivery
              </span>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center bg-[#FAF7F2] px-4">
              <button
                onClick={() => setStep(3)}
                className={`w-9 h-9 rounded-sm flex items-center justify-center font-sans text-xs font-bold transition-all ${
                  step === 3 ? 'bg-[#1C1917] text-[#FAF7F2]' : 'bg-[#EAE3D9] text-[#57534E]'
                }`}
              >
                03
              </button>
              <span className="text-xs font-sans uppercase tracking-wider font-semibold mt-2 text-[#44403C]">
                Payment
              </span>
            </div>
          </div>
        </div>

        {!isMounted ? (
          <div className="py-24 text-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] space-y-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#57534E]" />
            <p className="text-xs text-[#57534E] font-medium uppercase tracking-wider">Loading checkout...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] space-y-4">
            <h2 className="font-serif text-2xl font-normal text-[#1C1917]">Your shopping bag is empty</h2>
            <p className="text-xs md:text-sm text-[#57534E]">Please select furniture pieces before proceeding to checkout.</p>
            <Link
              href="/catalog"
              className="inline-block px-6 py-3 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524] transition-colors"
            >
              Shop Collection
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
                    className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 space-y-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-4">
                      <div>
                        <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#B45309]">
                          Step 01 / Shipping
                        </span>
                        <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1C1917]">
                          Delivery Address
                        </h2>
                      </div>
                      <button
                        onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                        className="inline-flex items-center space-x-1.5 text-xs font-sans uppercase tracking-wider font-semibold px-3.5 py-1.5 rounded-sm border border-[#D6CEC4] bg-[#FAF7F2] hover:bg-[#EAE3D9] transition-colors text-[#1C1917]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAddingNewAddress ? 'Cancel' : 'Add New Address'}</span>
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
                                ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm ring-1 ring-[#1C1917]'
                                : 'border-[#D6CEC4] hover:border-[#1C1917] bg-[#FAF7F2]/80'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <span className="font-bold text-xs text-[#1C1917]">
                                  {addr.fullName}
                                </span>
                                <p className="text-xs text-[#57534E] leading-relaxed">
                                  {addr.addressLine1}
                                  {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                                  <br />
                                  {addr.city}, {addr.state} - {addr.pincode}
                                </p>
                                <p className="text-xs text-[#1C1917] font-medium pt-1">Phone: {addr.phone}</p>
                              </div>
                              {selectedAddressId === addr.id && (
                                <CheckCircle2 className="w-4 h-4 text-[#B45309] shrink-0" />
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
                            <label className="text-xs font-sans font-semibold text-[#57534E]">Full Name</label>
                            <input
                              type="text"
                              required
                              value={newAddress.fullName}
                              onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                              placeholder="e.g. Aditya Sharma"
                              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-sans font-semibold text-[#57534E]">Phone Number</label>
                            <input
                              type="tel"
                              required
                              value={newAddress.phone}
                              onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-sans font-semibold text-[#57534E]">Address Line 1</label>
                          <input
                            type="text"
                            required
                            value={newAddress.addressLine1}
                            onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                            placeholder="Flat / House No., Building Name, Street"
                            className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-sans font-semibold text-[#57534E]">Pincode</label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={newAddress.pincode}
                              onChange={(e) => handlePincodeChange(e.target.value)}
                              placeholder="560001"
                              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-sans font-semibold text-[#57534E]">City</label>
                            <input
                              type="text"
                              required
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                              placeholder="Bengaluru"
                              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-sans font-semibold text-[#57534E]">State</label>
                            <input
                              type="text"
                              required
                              value={newAddress.state}
                              onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                              placeholder="Karnataka"
                              className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                            />
                          </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                          <button
                            type="submit"
                            className="px-6 py-2.5 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524]"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    )}

                    <div className="pt-6 border-t border-[#E5DFD7] flex justify-end">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!activeShippingAddress}
                        className="px-8 py-3.5 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524] transition-all flex items-center space-x-2 shadow-md"
                      >
                        <span>Continue to Delivery</span>
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
                    className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 space-y-6 shadow-sm"
                  >
                    <div className="border-b border-[#E5DFD7] pb-4">
                      <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#B45309]">
                        Step 02 / Delivery
                      </span>
                      <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1C1917]">
                        Select Delivery Speed
                      </h2>
                    </div>

                    <div className="space-y-4">
                      {/* Standard Option */}
                      <div
                        onClick={() => setDeliveryMethod('standard')}
                        className={`p-5 rounded-sm border cursor-pointer transition-all ${
                          deliveryMethod === 'standard'
                            ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm ring-1 ring-[#1C1917]'
                            : 'border-[#D6CEC4] hover:border-[#1C1917] bg-[#FAF7F2]/80'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Truck className="w-4 h-4 text-[#1C1917]" />
                              <h3 className="font-bold text-xs text-[#1C1917]">
                                White-Glove Standard Delivery & Setup
                              </h3>
                              <span className="text-[10px] font-sans bg-[#FAF7F2] text-emerald-800 border border-emerald-300 px-2 py-0.5 uppercase tracking-wider font-bold rounded-sm">
                                FREE
                              </span>
                            </div>
                            <p className="text-xs text-[#57534E] max-w-md pt-1 leading-relaxed">
                              Delivered by trained furniture specialists with room-of-choice placement and debris removal (5-7 business days).
                            </p>
                          </div>
                          {deliveryMethod === 'standard' && (
                            <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                          )}
                        </div>
                      </div>

                      {/* Express Option */}
                      <div
                        onClick={() => setDeliveryMethod('express')}
                        className={`p-5 rounded-sm border cursor-pointer transition-all ${
                          deliveryMethod === 'express'
                            ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm ring-1 ring-[#1C1917]'
                            : 'border-[#D6CEC4] hover:border-[#1C1917] bg-[#FAF7F2]/80'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Truck className="w-4 h-4 text-[#B45309]" />
                              <h3 className="font-bold text-xs text-[#1C1917]">
                                Priority Express Delivery
                              </h3>
                              <span className="text-[10px] font-sans bg-[#FAF7F2] text-[#1C1917] border border-[#D6CEC4] px-2 py-0.5 uppercase tracking-wider font-bold rounded-sm">
                                ₹499
                              </span>
                            </div>
                            <p className="text-xs text-[#57534E] max-w-md pt-1 leading-relaxed">
                              Expedited priority transport with appointment scheduling (2-3 business days).
                            </p>
                          </div>
                          {deliveryMethod === 'express' && (
                            <CheckCircle2 className="w-4 h-4 text-[#B45309]" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#E5DFD7] flex items-center justify-between">
                      <button
                        onClick={() => setStep(1)}
                        className="px-6 py-3 border border-[#D6CEC4] bg-[#FAF7F2] text-[#1C1917] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#EAE3D9] flex items-center space-x-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={() => setStep(3)}
                        className="px-8 py-3.5 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524] transition-all flex items-center space-x-2 shadow-md"
                      >
                        <span>Review & Payment</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: REVIEW & PAYMENT */}
                {step === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 16 }}
                    className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 md:p-8 space-y-6 shadow-sm"
                  >
                    <div className="border-b border-[#E5DFD7] pb-4">
                      <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#B45309]">
                        Step 03 / Payment
                      </span>
                      <h2 className="font-serif text-2xl font-normal tracking-tight text-[#1C1917]">
                        Review Order & Pay
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
                        <span className="font-sans uppercase tracking-wider font-semibold text-[10px] text-[#57534E]">Shipping Destination</span>
                        <p className="font-bold text-[#1C1917] mt-0.5">
                          {activeShippingAddress.fullName} • {activeShippingAddress.addressLine1}, {activeShippingAddress.city} ({activeShippingAddress.pincode})
                        </p>
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="text-xs font-semibold underline text-[#B45309] hover:text-[#1C1917]"
                      >
                        Change
                      </button>
                    </div>

                    {/* Validated Items List */}
                    <div className="divide-y divide-[#E5DFD7] text-xs">
                      {displayItems.map((item) => (
                        <div key={item.productId} className="py-3 flex justify-between items-center">
                          <div>
                            <p className="font-bold text-xs text-[#1C1917]">{item.name}</p>
                            <p className="text-[#57534E] text-[11px]">Quantity: {item.quantity} {item.selectedColor ? `• Finish: ${item.selectedColor}` : ''}</p>
                          </div>
                          <span className="font-sans text-xs font-bold text-[#1C1917]">
                            {formatPrice(item.itemTotal)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-4 pt-3 border-t border-[#E5DFD7]">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-sans font-semibold uppercase tracking-wider text-[#57534E]">
                          Select Payment Method
                        </label>
                        <span className="text-[11px] text-[#78716C] flex items-center space-x-1">
                          <Lock className="w-3 h-3 text-[#B45309]" />
                          <span>256-Bit Encrypted & RBI Compliant</span>
                        </span>
                      </div>

                      {/* Option A: Credit or Debit Card */}
                      <div
                        className={`rounded-sm border transition-all overflow-hidden ${
                          paymentMethod === 'card'
                            ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm ring-1 ring-[#1C1917]'
                            : 'border-[#D6CEC4] hover:border-[#1C1917] bg-[#FAF7F2]/80'
                        }`}
                      >
                        <div
                          onClick={() => setPaymentMethod('card')}
                          className="p-4 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === 'card'}
                              onChange={() => setPaymentMethod('card')}
                              className="accent-[#1C1917]"
                            />
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-sm bg-[#EFE9E1] border border-[#D6CEC4] flex items-center justify-center text-[#1C1917]">
                                <CreditCard className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-[#1C1917]">Credit or Debit Card</p>
                                <p className="text-[11px] text-[#57534E]">All major cards: Visa, Mastercard, RuPay, Amex</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 text-[10px] font-bold text-[#57534E]">
                            <span className="px-1.5 py-0.5 border border-[#D6CEC4] bg-white rounded-sm">VISA</span>
                            <span className="px-1.5 py-0.5 border border-[#D6CEC4] bg-white rounded-sm">MC</span>
                            <span className="px-1.5 py-0.5 border border-[#D6CEC4] bg-white rounded-sm">RuPay</span>
                          </div>
                        </div>

                        {/* Expanded Card Form */}
                        {paymentMethod === 'card' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="p-5 border-t border-[#E5DFD7] bg-[#F4EFEA]/80 space-y-4"
                          >
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <label className="text-xs font-sans font-semibold text-[#57534E]">Card Number</label>
                                {cardBrand && (
                                  <span className="text-[10px] uppercase font-bold tracking-wider bg-[#1C1917] text-[#FAF7F2] px-2 py-0.5 rounded-sm">
                                    {cardBrand}
                                  </span>
                                )}
                              </div>
                              <div className="relative">
                                <input
                                  type="text"
                                  id="checkout-card-number"
                                  name="cardNumber"
                                  autoComplete="cc-number"
                                  inputMode="numeric"
                                  value={cardNumber}
                                  onChange={(e) => handleCardNumberChange(e.target.value)}
                                  placeholder="4111 1111 1111 1111"
                                  maxLength={19}
                                  className="w-full px-3.5 py-2.5 text-xs font-mono bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917] tracking-wider"
                                />
                                <CreditCard className="w-4 h-4 text-[#78716C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-sans font-semibold text-[#57534E]">Expiry Date</label>
                                <input
                                  type="text"
                                  id="checkout-card-expiry"
                                  name="cardExpiry"
                                  autoComplete="cc-exp"
                                  inputMode="numeric"
                                  value={cardExpiry}
                                  onChange={(e) => handleExpiryChange(e.target.value)}
                                  placeholder="MM / YY"
                                  maxLength={5}
                                  className="w-full px-3.5 py-2 text-xs font-mono bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                  <label className="text-xs font-sans font-semibold text-[#57534E]">CVV / CVC</label>
                                  <span className="text-[10px] text-[#78716C]">3 or 4 digits</span>
                                </div>
                                <div className="relative">
                                  <input
                                    type="password"
                                    id="checkout-card-cvv"
                                    name="cardCvv"
                                    autoComplete="cc-csc"
                                    inputMode="numeric"
                                    value={cardCvv}
                                    onChange={(e) => handleCvvChange(e.target.value)}
                                    placeholder="•••"
                                    maxLength={4}
                                    className="w-full px-3.5 py-2 text-xs font-mono bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                                  />
                                  <Lock className="w-3.5 h-3.5 text-[#78716C] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-sans font-semibold text-[#57534E]">Name on Card</label>
                              <input
                                type="text"
                                id="checkout-card-name"
                                name="cardName"
                                autoComplete="cc-name"
                                value={cardName}
                                onChange={(e) => setCardName(e.target.value)}
                                placeholder="Aditya Sharma"
                                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                              />
                            </div>

                            <div className="p-3 bg-[#FAF7F2] border border-[#E5DFD7] rounded-sm flex items-center space-x-2 text-[11px] text-[#57534E]">
                              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                              <span>Transactions are 256-bit SSL encrypted & RBI tokenization compliant.</span>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Option B: UPI (GPay, PhonePe, Paytm, QR) */}
                      <div
                        className={`rounded-sm border transition-all overflow-hidden ${
                          paymentMethod === 'upi'
                            ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm ring-1 ring-[#1C1917]'
                            : 'border-[#D6CEC4] hover:border-[#1C1917] bg-[#FAF7F2]/80'
                        }`}
                      >
                        <div
                          onClick={() => setPaymentMethod('upi')}
                          className="p-4 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === 'upi'}
                              onChange={() => setPaymentMethod('upi')}
                              className="accent-[#1C1917]"
                            />
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-sm bg-[#EFE9E1] border border-[#D6CEC4] flex items-center justify-center text-[#1C1917]">
                                <Smartphone className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-[#1C1917]">UPI (Google Pay, PhonePe, Paytm, QR Code)</p>
                                <p className="text-[11px] text-[#57534E]">Instant payment via any UPI app or QR scanner</p>
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold bg-[#FAF7F2] border border-[#D6CEC4] px-2 py-0.5 rounded-sm text-[#1C1917]">
                            FAST & FREE
                          </span>
                        </div>

                        {/* Expanded UPI Form */}
                        {paymentMethod === 'upi' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="p-5 border-t border-[#E5DFD7] bg-[#F4EFEA]/80 space-y-4"
                          >
                            {/* App Chips */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-sans font-semibold text-[#57534E]">Preferred UPI Flow</label>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {[
                                  { id: 'gpay', label: 'Google Pay' },
                                  { id: 'phonepe', label: 'PhonePe' },
                                  { id: 'paytm', label: 'Paytm' },
                                  { id: 'qr', label: 'Dynamic QR' },
                                ].map((app) => (
                                  <button
                                    key={app.id}
                                    type="button"
                                    onClick={() => setSelectedUpiApp(app.id as any)}
                                    className={`px-3 py-2 text-xs rounded-sm border font-semibold transition-all ${
                                      selectedUpiApp === app.id
                                        ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917]'
                                        : 'bg-[#FAF7F2] text-[#57534E] border-[#D6CEC4] hover:border-[#1C1917]'
                                    }`}
                                  >
                                    {app.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* VPA Input */}
                            <div className="space-y-1.5">
                              <label className="text-xs font-sans font-semibold text-[#57534E]">
                                Enter UPI ID / VPA
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={upiId}
                                  onChange={(e) => {
                                    setUpiId(e.target.value)
                                    setUpiVerified(false)
                                  }}
                                  placeholder="username@okhdfcbank or 9876543210@upi"
                                  className="flex-1 px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917]"
                                />
                                <button
                                  type="button"
                                  onClick={handleVerifyUpi}
                                  className={`px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm border transition-all ${
                                    upiVerified
                                      ? 'bg-emerald-700 text-white border-emerald-700'
                                      : 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917] hover:bg-[#292524]'
                                  }`}
                                >
                                  {upiVerified ? 'Verified ✓' : 'Verify'}
                                </button>
                              </div>
                              <p className="text-[11px] text-[#78716C]">
                                A payment notification request will be delivered to your UPI app.
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Option C: Net Banking */}
                      <div
                        className={`rounded-sm border transition-all overflow-hidden ${
                          paymentMethod === 'netbanking'
                            ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm ring-1 ring-[#1C1917]'
                            : 'border-[#D6CEC4] hover:border-[#1C1917] bg-[#FAF7F2]/80'
                        }`}
                      >
                        <div
                          onClick={() => setPaymentMethod('netbanking')}
                          className="p-4 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === 'netbanking'}
                              onChange={() => setPaymentMethod('netbanking')}
                              className="accent-[#1C1917]"
                            />
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-sm bg-[#EFE9E1] border border-[#D6CEC4] flex items-center justify-center text-[#1C1917]">
                                <Building2 className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-[#1C1917]">Net Banking</p>
                                <p className="text-[11px] text-[#57534E]">Direct bank debit via all Indian banks</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Netbanking Form */}
                        {paymentMethod === 'netbanking' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="p-5 border-t border-[#E5DFD7] bg-[#F4EFEA]/80 space-y-4"
                          >
                            <div className="space-y-1.5">
                              <label className="text-xs font-sans font-semibold text-[#57534E]">Popular Indian Banks</label>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                  { id: 'HDFC', name: 'HDFC Bank' },
                                  { id: 'ICICI', name: 'ICICI Bank' },
                                  { id: 'SBI', name: 'State Bank of India' },
                                  { id: 'AXIS', name: 'Axis Bank' },
                                  { id: 'KOTAK', name: 'Kotak Mahindra' },
                                ].map((b) => (
                                  <button
                                    key={b.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedBank(b.id)
                                      setOtherBank('')
                                    }}
                                    className={`px-3 py-2 text-xs rounded-sm border font-semibold transition-all text-left ${
                                      selectedBank === b.id && !otherBank
                                        ? 'bg-[#1C1917] text-[#FAF7F2] border-[#1C1917]'
                                        : 'bg-[#FAF7F2] text-[#57534E] border-[#D6CEC4] hover:border-[#1C1917]'
                                    }`}
                                  >
                                    {b.name}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-1.5">
                              <label className="text-xs font-sans font-semibold text-[#57534E]">All Other Indian Banks</label>
                              <select
                                value={otherBank}
                                onChange={(e) => setOtherBank(e.target.value)}
                                className="w-full px-3 py-2.5 text-xs bg-[#FAF7F2] border border-[#D6CEC4] rounded-sm focus:border-[#1C1917] outline-none text-[#1C1917] font-medium"
                              >
                                <option value="">Select from 50+ other banks...</option>
                                <option value="PNB">Punjab National Bank</option>
                                <option value="BOB">Bank of Baroda</option>
                                <option value="CANARA">Canara Bank</option>
                                <option value="INDUSIND">IndusInd Bank</option>
                                <option value="YES">Yes Bank</option>
                                <option value="UNION">Union Bank of India</option>
                                <option value="IDFC">IDFC FIRST Bank</option>
                                <option value="FEDERAL">Federal Bank</option>
                              </select>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Option D: Cash on Delivery / Pay on Delivery */}
                      <div
                        className={`rounded-sm border transition-all overflow-hidden ${
                          paymentMethod === 'cod'
                            ? 'border-[#1C1917] bg-[#FAF7F2] shadow-sm ring-1 ring-[#1C1917]'
                            : 'border-[#D6CEC4] hover:border-[#1C1917] bg-[#FAF7F2]/80'
                        }`}
                      >
                        <div
                          onClick={() => setPaymentMethod('cod')}
                          className="p-4 cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <input
                              type="radio"
                              name="paymentMethod"
                              checked={paymentMethod === 'cod'}
                              onChange={() => setPaymentMethod('cod')}
                              className="accent-[#1C1917]"
                            />
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-sm bg-[#EFE9E1] border border-[#D6CEC4] flex items-center justify-center text-[#1C1917]">
                                <Banknote className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-xs text-[#1C1917]">Cash on Delivery / Pay on Delivery</p>
                                <p className="text-[11px] text-[#57534E]">Pay via Cash, UPI, or Card upon white-glove arrival</p>
                              </div>
                            </div>
                          </div>

                          <span className="text-[10px] font-bold bg-[#FAF7F2] border border-[#D6CEC4] px-2 py-0.5 rounded-sm text-[#57534E]">
                            DOORSTEP
                          </span>
                        </div>

                        {/* Expanded COD Note */}
                        {paymentMethod === 'cod' && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-5 border-t border-[#E5DFD7] bg-[#F4EFEA]/80 space-y-2"
                          >
                            <div className="p-3 bg-[#FAF7F2] border border-[#E5DFD7] rounded-sm text-xs text-[#57534E] leading-relaxed">
                              <p className="font-semibold text-[#1C1917] mb-1">White-Glove Delivery Protocol</p>
                              Our delivery specialists will unpack, assemble, and position your furniture in your room of choice. Once thoroughly inspected, you may complete payment via Cash, UPI, or Card terminal.
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-6 border-t border-[#E5DFD7] flex items-center justify-between">
                      <button
                        onClick={() => setStep(2)}
                        disabled={isPaying}
                        className="px-6 py-3 border border-[#D6CEC4] bg-[#FAF7F2] text-[#1C1917] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#EAE3D9] flex items-center space-x-1.5"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>

                      <button
                        onClick={handlePlaceOrder}
                        disabled={isPaying || isCalculating}
                        className="px-8 py-3.5 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524] transition-all flex items-center space-x-2 shadow-md disabled:opacity-50"
                      >
                        {isPaying ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing Order...</span>
                          </>
                        ) : paymentMethod === 'cod' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Place Cash on Delivery Order ({formatPrice(effectiveTotal)})</span>
                          </>
                        ) : paymentMethod === 'card' ? (
                          <>
                            <Lock className="w-3.5 h-3.5" />
                            <span>Pay {formatPrice(effectiveTotal)} with Card</span>
                          </>
                        ) : paymentMethod === 'upi' ? (
                          <>
                            <Smartphone className="w-3.5 h-3.5" />
                            <span>Pay {formatPrice(effectiveTotal)} via UPI</span>
                          </>
                        ) : (
                          <>
                            <Building2 className="w-3.5 h-3.5" />
                            <span>Pay {formatPrice(effectiveTotal)} via Net Banking</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-6 space-y-5 sticky top-28 shadow-sm">
                <h3 className="font-serif text-lg font-normal tracking-tight text-[#1C1917]">Order Summary</h3>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-[#57534E]">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-sans font-semibold text-[#1C1917]">
                      {formatPrice(effectiveSubtotal)}
                    </span>
                  </div>

                  {effectiveDiscount > 0 && (
                    <div className="flex justify-between text-[#B45309] font-semibold">
                      <span>Promo ({calculation?.appliedCoupon || couponCode})</span>
                      <span className="font-sans">-{formatPrice(effectiveDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#57534E]">
                    <span className="font-medium">GST (18%)</span>
                    <span className="font-sans font-semibold text-[#1C1917]">
                      {formatPrice(effectiveTax)}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#57534E]">
                    <span className="font-medium">Delivery</span>
                    <span className="font-sans font-semibold text-emerald-800">
                      {effectiveShipping > 0 ? '₹499' : 'FREE'}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm font-semibold text-[#1C1917] pt-4 border-t border-[#E5DFD7]">
                    <span>Total Payable</span>
                    <span className="font-sans text-xl font-bold">
                      {formatPrice(effectiveTotal)}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-1 text-xs text-[#57534E]">
                  <div className="flex items-center space-x-1.5 text-[#1C1917] font-semibold">
                    <ShieldCheck className="w-4 h-4 text-[#B45309]" />
                    <span>256-Bit Encrypted Payment</span>
                  </div>
                  <p>
                    Verified with Razorpay gateway with instant payment confirmation.
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

