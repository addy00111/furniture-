'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, User as UserIcon, LogOut, Compass, Sparkles } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useAuthStore } from '@/store/useAuthStore'

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { toggleCart, getItemCount, loadFromSupabase } = useCartStore()
  const { user, profile, openAuthModal, signOut, initialize } = useAuthStore()

  useEffect(() => {
    setMounted(true)
    const unsub = initialize()
    return () => unsub()
  }, [initialize])

  useEffect(() => {
    if (user?.id) {
      loadFromSupabase(user.id)
    }
  }, [user?.id, loadFromSupabase])

  const itemCount = getItemCount()

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF7F2]/90 border-b border-[#E5DFD7] transition-all">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.25em] text-lg md:text-xl font-normal uppercase text-[#1C1917] group-hover:opacity-80 transition-opacity">
              SORA LIVING
            </span>
            <span className="text-[9px] tracking-[0.22em] font-sans font-medium uppercase text-[#78716C] -mt-0.5">
              Architectural Forms & Living
            </span>
          </div>
        </Link>

        {/* Navigation Categories */}
        <nav className="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-[0.16em] font-medium text-[#78716C]">
          <Link href="/catalog" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>Catalogue</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/#collections" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>Collections</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/#materiality" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>Materiality</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/cart" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>Spatial Bag</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/admin" className="hover:text-[#1C1917] transition-colors relative py-1 group font-semibold text-[#1C1917]">
            <span>Atelier Desk</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          {/* Member Auth */}
          {mounted && user ? (
            <div className="flex items-center space-x-3 text-xs">
              <span className="font-sans text-[#78716C] hidden sm:inline-block">
                {profile?.full_name || user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOut()}
                title="Sign Out"
                className="p-2 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFE9E1] rounded-sm transition-colors border border-transparent hover:border-[#E5DFD7]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center space-x-1.5 text-[11px] font-sans uppercase tracking-[0.14em] text-[#1C1917] hover:text-black transition-all px-4 py-2 rounded-sm border border-[#E5DFD7] bg-[#F4EFEA] hover:bg-[#EFE9E1]"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Spatial Bag Trigger */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 bg-[#292524] text-[#FAF7F2] rounded-sm hover:bg-[#3E3835] transition-colors shadow-sm flex items-center space-x-2 px-3.5"
            aria-label="Open Spatial Bag"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
            <span className="text-xs font-sans font-medium tracking-wider hidden sm:inline">Bag</span>
            {mounted && itemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#B45309] text-white font-sans text-[10px] font-semibold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
