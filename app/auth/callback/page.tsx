'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    // Esta función se ejecuta apenas carga la página
    const finalizarLogin = async () => {
      // 1. Verificamos que Supabase haya procesado el enlace
      await supabase.auth.getSession()
      
      // 2. Redirigimos al usuario al mapa (Home)
      router.push('/')
    }

    finalizarLogin()
  }, [router])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-red-800 mb-2">Entrando... 🍷</h2>
        <p className="text-gray-500">Estamos verificando tu cuenta.</p>
      </div>
    </div>
  )
}