'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const RolContext = createContext({ rol: null, email: null, loading: true })

export function RolProvider({ children }) {
  const [rol, setRol]     = useState(null)
  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRol() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setEmail(user.email)
      const { data } = await supabase
        .from('usuarios_autorizados')
        .select('rol')
        .eq('email', user.email)
        .maybeSingle()
      setRol(data?.rol || 'user')
      setLoading(false)
    }
    fetchRol()
  }, [])

  return (
    <RolContext.Provider value={{ rol, email, loading }}>
      {children}
    </RolContext.Provider>
  )
}

export function useRol() {
  return useContext(RolContext)
}
