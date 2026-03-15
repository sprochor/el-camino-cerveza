'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // 1. Intentamos iniciar sesión con Magic Link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Redirige al usuario al inicio después de hacer clic en el mail
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setMessage('Error al destapar la cuenta: ' + error.message)
    } else {
      setMessage('¡Revisá tu correo! Te enviamos el enlace mágico para entrar.')
    }
    setLoading(false)
  }

  // Función para Google
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-stone-50 md:bg-transparent">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🍺</span>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Ingresar al Club</h1>
          <p className="text-stone-500 mt-2 text-sm">Entrá para guardar tus cervezas favoritas y dejar tus reseñas.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">Correo electrónico</label>
            <input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-stone-900 font-bold py-3 rounded-xl hover:bg-amber-400 transition shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? 'Enviando...' : 'Enviar enlace mágico ✨'}
          </button>
        </form>

        {/* Mensaje de estado */}
        {message && (
          <div className={`mt-6 p-4 rounded-xl text-center text-sm font-bold ${message.includes('Error') ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
            {message}
          </div>
        )}

        <div className="mt-8 border-t border-gray-100 pt-6">
          <p className="text-center text-gray-500 text-sm font-medium mb-4">O ingresá más rápido con</p>
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50 transition shadow-sm flex items-center justify-center gap-3"
          >
            {/* Icono de Google */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  )
}