'use client'

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle2, PackageCheck, ShieldCheck, ArrowRight, Printer, Sparkles, Truck, Home as HomeIcon } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = (params?.id as string) || 'ord-architectural-sample'

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1C1917] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 md:px-12 py-16 w-full space-y-10">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-sm bg-[#F4EFEA] border border-[#E5DFD7] mx-auto flex items-center justify-center text-[#B45309]">
            <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
              Payment Verified • HMAC SHA-256 Validated
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-normal tracking-tight text-[#1C1917]">
              Payment Confirmed
            </h1>
          </div>

          <p className="text-sm text-[#78716C] max-w-md mx-auto font-light leading-relaxed">
            Thank you for choosing SORA LIVING. Your order has been placed and is being prepared with our master craftsmen.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-[#F4EFEA] rounded-sm border border-[#E5DFD7] p-8 space-y-8 shadow-nord"
        >
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-[#E5DFD7] gap-4">
            <div>
              <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                Order Reference ID
              </span>
              <p className="font-sans text-sm font-semibold text-[#1C1917] mt-0.5">{orderId}</p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-sm bg-[#FAF7F2] text-[#B45309] border border-[#E5DFD7] text-xs font-sans">
                <span className="w-2 h-2 rounded-full bg-[#B45309] animate-pulse" />
                <span>Status: Paid (Razorpay Gateway)</span>
              </span>
            </div>
          </div>

          {/* Timeline / Tracking Stepper */}
          <div className="space-y-4">
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
              Fulfillment Journey
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#1C1917] space-y-1">
                <div className="flex items-center space-x-1.5 text-[#1C1917] font-semibold">
                  <PackageCheck className="w-4 h-4" />
                  <span>01. Order Placed</span>
                </div>
                <p className="text-[10px] text-[#78716C] font-light">Order confirmed & verified</p>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-1 opacity-70">
                <div className="flex items-center space-x-1.5 text-[#78716C] font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>02. Curation</span>
                </div>
                <p className="text-[10px] text-[#78716C] font-light">Artisan finishing & QA</p>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-1 opacity-70">
                <div className="flex items-center space-x-1.5 text-[#78716C] font-semibold">
                  <Truck className="w-4 h-4" />
                  <span>03. Logistics</span>
                </div>
                <p className="text-[10px] text-[#78716C] font-light">White-glove courier dispatch</p>
              </div>

              <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] space-y-1 opacity-70">
                <div className="flex items-center space-x-1.5 text-[#78716C] font-semibold">
                  <HomeIcon className="w-4 h-4" />
                  <span>04. Placement</span>
                </div>
                <p className="text-[10px] text-[#78716C] font-light">Room-of-choice installation</p>
              </div>
            </div>
          </div>

          {/* Logistics & Security Guarantees */}
          <div className="p-4 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <ShieldCheck className="w-5 h-5 text-[#B45309] shrink-0" />
              <div>
                <p className="font-medium text-[#1C1917]">Complimentary White-Glove Assembly Included</p>
                <p className="text-[#78716C] text-[11px] font-light">
                  Our delivery team uncrates, positions, and cleans the installation site to museum standards.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-6 py-3 border border-[#E5DFD7] bg-[#FAF7F2] text-[#1C1917] text-[11px] uppercase tracking-[0.14em] font-semibold rounded-sm hover:bg-[#EFE9E1] flex items-center justify-center space-x-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Spatial Manifest</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.2em] font-semibold rounded-sm hover:bg-[#3E3835] flex items-center justify-center space-x-2 transition-all shadow-nord"
            >
              <span>Return to Atelier</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
