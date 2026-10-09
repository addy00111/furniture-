'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { createClient } from '@/lib/supabase/client'

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalView, openAuthModal } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)
    setLoading(true)

    try {
      const supabase = createClient()

      if (authModalView === 'magic_link') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
          },
        })
        if (error) throw error
        setSuccessMsg(`Secure magic sign-in link dispatched to ${email}. Please check your inbox.`)
      } else if (authModalView === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              role: 'customer',
            },
          },
        })
        if (error) throw error
        setSuccessMsg('Account created successfully! You are now authenticated.')
        setTimeout(() => closeAuthModal(), 1500)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        setSuccessMsg('Authenticated successfully.')
        setTimeout(() => closeAuthModal(), 1000)
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAuthModal}
            className="absolute inset-0 bg-[#1C1917]/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full max-w-md bg-[#FAF7F2] text-[#1C1917] rounded-sm shadow-nord-lg border border-[#E5DFD7] overflow-hidden z-10"
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-[#E5DFD7] flex items-center justify-between bg-[#F4EFEA]">
              <div>
                <span className="text-[9px] font-sans uppercase tracking-[0.2em] text-[#78716C]">
                  Atelier Member Portal
                </span>
                <h3 className="font-serif text-xl font-normal tracking-tight text-[#1C1917]">
                  {authModalView === 'signup'
                    ? 'Create Atelier Profile'
                    : authModalView === 'magic_link'
                    ? 'Passwordless Access'
                    : 'Welcome Back'}
                </h3>
              </div>
              <button
                onClick={closeAuthModal}
                className="p-1.5 -mr-1 text-[#78716C] hover:text-[#1C1917] hover:bg-[#EFE9E1] rounded-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab selector */}
            <div className="flex border-b border-[#E5DFD7] bg-[#EFE9E1] text-[11px] font-medium uppercase tracking-[0.14em]">
              <button
                onClick={() => {
                  setErrorMsg(null)
                  setSuccessMsg(null)
                  openAuthModal('login')
                }}
                className={`flex-1 py-3 text-center transition-colors ${
                  authModalView === 'login'
                    ? 'bg-[#FAF7F2] text-[#1C1917] border-b-2 border-[#1C1917] font-semibold'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setErrorMsg(null)
                  setSuccessMsg(null)
                  openAuthModal('signup')
                }}
                className={`flex-1 py-3 text-center transition-colors ${
                  authModalView === 'signup'
                    ? 'bg-[#FAF7F2] text-[#1C1917] border-b-2 border-[#1C1917] font-semibold'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Sign Up
              </button>
              <button
                onClick={() => {
                  setErrorMsg(null)
                  setSuccessMsg(null)
                  openAuthModal('magic_link')
                }}
                className={`flex-1 py-3 text-center transition-colors ${
                  authModalView === 'magic_link'
                    ? 'bg-[#FAF7F2] text-[#1C1917] border-b-2 border-[#1C1917] font-semibold'
                    : 'text-[#78716C] hover:text-[#1C1917]'
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3.5 rounded-sm bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 rounded-sm bg-[#FAF7F2] border border-[#E5DFD7] text-[#B45309] text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {authModalView === 'signup' && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[#A89F91] absolute left-3 top-3.5" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Aditya Sharma"
                        className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F4EFEA] border border-[#E5DFD7] rounded-none focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 text-xs bg-[#F4EFEA] border border-[#E5DFD7] rounded-none focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#A89F91] absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aditya@example.com"
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F4EFEA] border border-[#E5DFD7] rounded-none focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                  />
                </div>
              </div>

              {authModalView !== 'magic_link' && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-sans uppercase tracking-wider text-[#78716C]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#A89F91] absolute left-3 top-3.5" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2.5 text-xs bg-[#F4EFEA] border border-[#E5DFD7] rounded-none focus:outline-none focus:ring-1 focus:ring-[#1C1917]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 bg-[#292524] text-[#FAF7F2] text-[11px] uppercase tracking-[0.16em] font-semibold rounded-sm hover:bg-[#3E3835] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-nord"
              >
                <span>
                  {loading
                    ? 'Authenticating...'
                    : authModalView === 'magic_link'
                    ? 'Dispatch Magic Link'
                    : authModalView === 'signup'
                    ? 'Create Atelier Profile'
                    : 'Sign In'}
                </span>
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
