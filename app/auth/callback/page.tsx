'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Esta función se ejecuta apenas carga la página
    const finalizarLogin = async () => {
      // 1. Verificamos si el login trajo instrucciones de hacia dónde ir
      // Si no hay parámetro 'next', lo mandamos al inicio ('/')
      const next = searchParams.get('next') || '/'

      // 2. Verificamos que Supabase haya procesado el enlace
      await supabase.auth.getSession()
      
      // 3. Redirigimos al usuario exactamente a donde quería ir
      router.push(next)
    }

    finalizarLogin()
  }, [router, searchParams])

  return (
    <div className="flex h-screen w-full items-center justify-center bg-stone-50">
      <div className="text-center">
        <h2 className="text-3xl font-black text-amber-600 mb-2 tracking-tight">Entrando al Club... 🍺</h2>
        <p className="text-stone-500 font-medium">Estamos verificando tu cuenta.</p>
      </div>
    </div>
  )
}