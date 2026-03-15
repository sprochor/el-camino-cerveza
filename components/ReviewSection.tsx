'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { User } from '@supabase/supabase-js'

// 👇 AGREGAMOS LA LÓGICA DE NIVELES AQUÍ
const NIVELES_BODEGA = [
  { min: 0, max: 2, nombre: "Turista de Fin de Semana", icono: "📸" },
  { min: 3, max: 7, nombre: "Viajero del Valle", icono: "🚗" },
  { min: 8, max: 15, nombre: "Explorador de Viñedos", icono: "🗺️" },
  { min: 16, max: 30, nombre: "Embajador del Enoturismo", icono: "🥂" },
  { min: 31, max: 50, nombre: "Gurú de las Rutas", icono: "🧭" },
  { min: 51, max: 9999, nombre: "Nómada del Vino", icono: "🏕️" },
];

function getNivelBodega(cantidad: number) {
  return NIVELES_BODEGA.find(n => cantidad >= n.min && cantidad <= n.max) || NIVELES_BODEGA[0];
}

export default function ReviewSection({ bodegaId }: { bodegaId: number }) {
  const [reviews, setReviews] = useState<any[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchReviews()
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  const fetchReviews = async () => {
    // 👇 AHORA PEDIMOS TAMBIÉN EL bodegas_count
    const { data } = await supabase
      .from('resenas')
      .select('*, profiles(full_name, email, avatar_url, bodegas_count)')
      .eq('bodega_id', bodegaId)
      .order('created_at', { ascending: false })

    if (data) setReviews(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Debes iniciar sesión')
    setLoading(true)

    const { error } = await supabase.from('resenas').insert({
      bodega_id: bodegaId,
      user_id: user.id,
      rating: rating,
      comment: comment
    })

    if (error) {
      alert('Error al guardar: ' + error.message)
    } else {
      setComment('')
      fetchReviews() 
    }
    setLoading(false)
  }

  const yaComento = user ? reviews.some(r => r.user_id === user.id) : false;

  return (
    <div className="mt-8 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-2xl font-bold mb-8 text-gray-900 flex items-center gap-2">
        ⭐ Opiniones de la comunidad
      </h3>

      {/* --- FORMULARIO DE NUEVA RESEÑA --- */}
      {user ? (
        yaComento ? (
          <div className="bg-green-50 text-green-800 p-5 rounded-xl mb-10 text-center border border-green-200 font-medium shadow-sm">
            Ya has calificado esta bodega. ¡Gracias por compartir tu experiencia! 🍇
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm mb-10 border border-gray-200 transition-all hover:shadow-md">
            <h4 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">Deja tu opinión</h4>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-5">
              <label className="text-gray-700 font-bold">Puntuación:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-3xl transition-transform hover:scale-110 ${star <= rating ? 'text-yellow-400 drop-shadow-sm' : 'text-gray-200'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <textarea
              className="w-full border border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-red-800 focus:outline-none text-gray-700 resize-none shadow-inner"
              rows={3}
              placeholder="¿Qué te pareció la visita? ¿Qué vinos probaste?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <div className="mt-4 text-right">
              <button 
                disabled={loading}
                className="bg-red-800 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-red-900 transition shadow-sm disabled:opacity-50"
              >
                {loading ? 'Publicando...' : 'Publicar reseña'}
              </button>
            </div>
          </form>
        )
      ) : (
        <div className="bg-slate-100 text-slate-600 p-6 rounded-xl mb-10 text-center border border-slate-200 border-dashed">
          <p className="mb-3">Debes iniciar sesión para dejar una opinión y calificar esta bodega.</p>
          <a href="/login" className="inline-block bg-white text-gray-800 font-bold px-6 py-2 rounded-xl border border-gray-200 shadow-sm hover:shadow transition">
            Ingresar con Google
          </a>
        </div>
      )}

      {/* --- LISTADO DE RESEÑAS CON AVATARES Y NIVELES REALES --- */}
      <div className="space-y-5">
        {reviews.length === 0 && (
          <div className="text-center py-8">
            <span className="text-4xl block mb-3 opacity-30">🍷</span>
            <p className="text-gray-500 italic">Aún no hay reseñas. ¡Sé el primero en calificar!</p>
          </div>
        )}

        {reviews.map((review) => {
          const autor = review.profiles?.full_name || review.profiles?.email?.split('@')[0] || 'Usuario'
          const fotoPerfil = review.profiles?.avatar_url
          
          // 👇 AQUÍ CALCULAMOS EL NIVEL REAL
          const cantidadBodegas = review.profiles?.bodegas_count || 0
          const nivel = getNivelBodega(cantidadBodegas)

          return (
            <div key={review.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex gap-4 transition hover:shadow-md">
              
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
                    {new Date(review.created_at).toLocaleDateString('es-AR')}
                  </span>
                </div>

                <div className="text-yellow-400 text-lg tracking-widest mb-2 drop-shadow-sm">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}