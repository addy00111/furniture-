'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingBag, User as UserIcon, LogOut } from 'lucide-react'
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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#FAF7F2]/95 border-b border-[#E5DFD7] transition-all">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="flex flex-col">
            <span className="font-serif tracking-[0.25em] text-lg md:text-xl font-normal uppercase text-[#1C1917] group-hover:opacity-80 transition-opacity">
              SORA LIVING
            </span>
            <span className="text-[9px] tracking-[0.22em] font-sans font-semibold uppercase text-[#57534E] -mt-0.5">
              Architectural Forms & Living
            </span>
          </div>
        </Link>

        {/* Navigation Categories */}
        <nav className="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-[0.16em] font-semibold text-[#44403C]">
          <Link href="/catalog" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>All Furniture</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/products?category=living-room" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>Living</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/products?category=dining-room" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>Dining</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/products?category=bedroom" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>Bedroom</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/#materials" className="hover:text-[#1C1917] transition-colors relative py-1 group">
            <span>Materials & Craft</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#1C1917] transition-all duration-300 group-hover:w-full" />
          </Link>
          <Link href="/admin" className="hover:text-[#1C1917] transition-colors relative py-1 group text-[#B45309]">
            <span>Admin</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#B45309] transition-all duration-300 group-hover:w-full" />
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          {/* Member Auth */}
          {mounted && user ? (
            <div className="flex items-center space-x-3 text-xs">
              <span className="font-sans text-[#44403C] font-medium hidden sm:inline-block">
                {profile?.full_name || user.email?.split('@')[0]}
              </span>
              <button
                onClick={() => signOut()}
                title="Sign Out"
                className="p-2 text-[#57534E] hover:text-[#1C1917] hover:bg-[#EFE9E1] rounded-sm transition-colors border border-[#E5DFD7]"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center space-x-1.5 text-[11px] font-sans uppercase tracking-[0.14em] font-semibold text-[#1C1917] hover:text-black transition-all px-4 py-2 rounded-sm border border-[#D6CEC4] bg-[#F4EFEA] hover:bg-[#EFE9E1]"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}

          {/* Cart Trigger */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 bg-[#1C1917] text-[#FAF7F2] rounded-sm hover:bg-[#292524] transition-colors shadow-sm flex items-center space-x-2 px-4"
            aria-label="Open Cart"
          >
            <ShoppingBag className="w-4 h-4 stroke-[1.75]" />
            <span className="text-xs font-sans font-semibold tracking-wider hidden sm:inline">Bag</span>
            {mounted && itemCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#B45309] text-white font-sans text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
