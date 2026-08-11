import { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser()

      setUser(currentUser)

      if (currentUser) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single()
        setProfile(profileData ?? null)
      } else {
        setProfile(null)
      }

      setLoading(false)
    }

    loadUser()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)

      if (currentUser) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single()
        setProfile(profileData ?? null)
      } else {
        setProfile(null)
      }

      setLoading(false)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return useMemo(() => ({ user, profile, loading }), [user, profile, loading])
}
