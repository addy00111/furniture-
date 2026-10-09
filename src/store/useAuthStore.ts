import { create } from 'zustand'
import { User } from '@supabase/supabase-js'
import { Profile } from '@/types'
import { createClient } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalView: 'login' | 'signup' | 'magic_link'

  openAuthModal: (view?: 'login' | 'signup' | 'magic_link') => void
  closeAuthModal: () => void
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  initialize: () => () => void
  fetchProfile: (userId: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isLoading: true,
  isAuthModalOpen: false,
  authModalView: 'login',

  openAuthModal: (view = 'login') => set({ isAuthModalOpen: true, authModalView: view }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),

  fetchProfile: async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data && !error) {
        set({ profile: data })
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  },

  signOut: async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      set({ user: null, profile: null })
    } catch (err) {
      console.error('Sign out error:', err)
    }
  },

  initialize: () => {
    let supabase: ReturnType<typeof createClient>
    try {
      supabase = createClient()
    } catch {
      set({ isLoading: false })
      return () => {}
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      set({ user, isLoading: false })
      if (user) {
        get().fetchProfile(user.id)
      }
    }).catch(() => {
      set({ isLoading: false })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null
        set({ user: currentUser })
        if (currentUser) {
          get().fetchProfile(currentUser.id)
        } else {
          set({ profile: null })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  },
}))
