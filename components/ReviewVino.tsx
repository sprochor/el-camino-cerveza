'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

// 👇 AGREGAMOS LA LÓGICA DE NIVELES AQUÍ
const NIVELES_VINO = [
  { min: 0, max: 5, nombre: "Novato de la Copa", icono: "🍷" },
  { min: 6, max: 15, nombre: "Catador Curioso", icono: "👅" },
  { min: 16, max: 40, nombre: "Experto en Cepas", icono: "🍇" },
  { min: 41, max: 80, nombre: "Sommelier Aficionado", icono: "👃" },
  { min: 81, max: 150, nombre: "Maestro Bodeguero", icono: "🍾" },
  { min: 151, max: 9999, nombre: "Leyenda del Vino", icono: "👑" },
];

function getNivelVino(cantidad: number) {
  return NIVELES_VINO.find(n => cantidad >= n.min && cantidad <= n.max) || NIVELES_VINO[0];
}

export default function ReviewVino({ vinoId }: { vinoId: number }) {
  const [resenas, setResenas] = useState<any[]>([])
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchDatos = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)

      // 👇 AHORA PEDIMOS TAMBIÉN EL vinos_count
      const { data } = await supabase
        .from('resenas_vinos')
        .select('*, profiles(full_name, email, avatar_url, vinos_count)')
        .eq('vino_id', vinoId)
        .order('created_at', { ascending: false })

      if (data) setResenas(data)
    }
    fetchDatos()
  }, [vinoId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Debes iniciar sesión para dejar una nota de cata.')
      return
    }
    if (rating === 0) {
      alert('Por favor, selecciona una calificación en copas.')
      return
    }

    setLoading(true)
    
    const { error } = await supabase.from('resenas_vinos').insert({
      vino_id: vinoId,
      user_id: user.id,
      rating,
      comment
    })

    if (error) {
      alert('Error al publicar: ' + error.message)
    } else {
      setRating(0)
      setComment('')
      router.refresh() 
      
      const { data } = await supabase
        .from('resenas_vinos')
        .select('*, profiles(full_name, email, avatar_url, vinos_count)')
        .eq('vino_id', vinoId)
        .order('created_at', { ascending: false })
        
      if (data) setResenas(data)
    }
    setLoading(false)
  }

  const yaCalifico = user ? resenas.some(r => r.user_id === user.id) : false;

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        🍷 Notas de cata de la comunidad
      </h3>
      
      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 mb-8 shadow-sm">
        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Deja tu opinión</h4>
        
        {user ? (
          yaCalifico ? (
            <div className="bg-green-50 text-green-800 p-5 rounded-xl border border-green-200 text-center font-medium shadow-sm">
              Ya dejaste tu nota de cata para este vino. ¡Salud! 🍷
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <label className="text-sm font-bold text-gray-700">Calificación:</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`text-3xl text-red-800 transition-transform hover:scale-110 ${rating >= num ? 'drop-shadow-sm' : 'opacity-20 hover:opacity-100'}`}
                    >
                      🍷
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿A qué sabe este vino? Escribe tus notas de cata..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-800 focus:outline-none resize-none shadow-inner text-gray-700"
              />
              
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-800 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-red-900 transition shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Publicando...' : 'Publicar nota de cata'}
                </button>
              </div>
            </form>
          )
        ) : (
          <div className="bg-slate-100 text-slate-600 p-6 rounded-xl mb-4 text-center border border-slate-200 border-dashed">
            <p className="mb-3">Debes iniciar sesión para dejar tu nota de cata.</p>
            <a href="/login" className="inline-block bg-white text-gray-800 font-bold px-6 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow transition">
              Ingresar con Google
            </a>
          </div>
        )}
      </div>

      <div className="space-y-5">
        {resenas.length === 0 ? (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3 opacity-30">🍷</span>
            <p className="text-gray-500 italic">Aún no hay notas de cata. ¡Sé el primero en probarlo!</p>
          </div>
        ) : (
          resenas.map((resena) => {
            const autor = resena.profiles?.full_name || resena.profiles?.email?.split('@')[0] || 'Usuario anónimo'
            const fotoPerfil = resena.profiles?.avatar_url
            
            // 👇 AQUÍ CALCULAMOS EL NIVEL REAL
            const cantidadVinos = resena.profiles?.vinos_count || 0
            const nivel = getNivelVino(cantidadVinos)

            return (
              <div key={resena.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 transition hover:shadow-md">
                
                <div className="shrink-0">
                  {fotoPerfil ? (
                    <img 
                      src={fotoPerfil} 
                      alt={autor} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 flex items-center justify-center text-red-800 font-bold text-xl uppercase">
                      {autor.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-gray-900">{autor}</h4>
                      {/* 👇 MOSTRAMOS EL NIVEL REAL */}
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide hidden sm:inline-block border border-slate-200">
                        {nivel.icono} {nivel.nombre}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(resena.created_at).toLocaleDateString('es-AR')}
                    </span>
                  </div>

                  <div className="flex gap-1 text-red-800 text-sm mb-2 drop-shadow-sm">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <span key={num} className={resena.rating >= num ? '' : 'opacity-20'}>
                        🍷
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {resena.comment}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}