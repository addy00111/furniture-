'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, PackageCheck, ShieldCheck, ArrowRight, Printer, Sparkles, Truck, Home as HomeIcon } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const params = useParams()
  const rawId = (params?.id as string) || 'ord-sample-01'
  const displayOrderId = rawId.toUpperCase().startsWith('SORA-') ? rawId.toUpperCase() : `SORA-${rawId.slice(0, 8).toUpperCase()}`

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-16 w-full space-y-10">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-[#F4EFEA] border border-[#E5DFD7] mx-auto flex items-center justify-center text-[#B45309]">
            <CheckCircle2 className="w-8 h-8 stroke-[1.75]" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-sans uppercase tracking-widest text-[#B45309] font-semibold">
              Payment Verified • Order Confirmed
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-[#1C1917]">
              Order Confirmed
            </h1>
          </div>

          <p className="text-xs md:text-sm text-[#57534E] max-w-md mx-auto font-normal leading-relaxed">
            Thank you for choosing SORA LIVING. We have received your order and are preparing it for shipment.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-8 space-y-8 shadow-sm"
        >
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E5DFD7] gap-4">
            <div>
              <span className="text-[11px] font-sans uppercase tracking-wider font-semibold text-[#57534E]">
                Order Reference
              </span>
              <p className="font-sans text-base font-bold text-[#1C1917] mt-0.5">Order #{displayOrderId}</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-sm bg-[#FAF7F2] text-[#B45309] border border-[#E5DFD7] text-xs font-sans font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#B45309] animate-pulse" />
                <span>Status: Paid & Confirmed</span>
              </span>
            </div>
          </div>

          {/* Timeline / Tracking Stepper */}
          <div className="space-y-4">
            <span className="text-xs font-sans uppercase tracking-wider font-semibold text-[#57534E]">
              Fulfillment Journey
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#1C1917] space-y-1">
                <div className="flex items-center space-x-1.5 text-[#1C1917] font-bold">
                  <PackageCheck className="w-4 h-4 text-[#B45309]" />
                  <span>01. Order Placed</span>
                </div>
                <p className="text-[11px] text-[#57534E]">Payment verified & logged</p>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-1 opacity-80">
                <div className="flex items-center space-x-1.5 text-[#57534E] font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>02. Preparation</span>
                </div>
                <p className="text-[11px] text-[#57534E]">Packaging & inspection</p>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-1 opacity-80">
                <div className="flex items-center space-x-1.5 text-[#57534E] font-semibold">
                  <Truck className="w-4 h-4" />
                  <span>03. Shipped</span>
                </div>
                <p className="text-[11px] text-[#57534E]">Dedicated courier transit</p>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-1 opacity-80">
                <div className="flex items-center space-x-1.5 text-[#57534E] font-semibold">
                  <HomeIcon className="w-4 h-4" />
                  <span>04. Room Placement</span>
                </div>
                <p className="text-[11px] text-[#57534E]">White-glove assembly</p>
              </div>
            </div>
          </div>

          {/* Logistics & Security Guarantees */}
          <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#B45309] shrink-0" />
              <div>
                <p className="font-semibold text-[#1C1917]">White-Glove Delivery & Assembly Included</p>
                <p className="text-[#57534E] text-xs font-normal">
                  Our delivery specialists will unpack, assemble, and position each piece in your room of choice.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 border border-[#D6CEC4] bg-[#FAF7F2] text-[#1C1917] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#EAE3D9] flex items-center justify-center space-x-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Order Receipt</span>
            </button>

            <Link
              href="/catalog"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1C1917] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-[#292524] flex items-center justify-center space-x-2 transition-all shadow-md"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
