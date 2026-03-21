'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ComentariosNoticia({ noticiaId }: { noticiaId: number }) {
  const [comentarios, setComentarios] = useState<any[]>([])
  const [comment, setComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchDatos = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
      
      // 👇 AHORA PEDIMOS: email, full_name y avatar_url
      const { data } = await supabase
        .from('comentarios_noticias')
        .select('*, profiles(email, full_name, avatar_url)')
        .eq('noticia_id', noticiaId)
        .order('created_at', { ascending: false })
      
      if (data) setComentarios(data)
    }
    fetchDatos()
  }, [noticiaId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Debes iniciar sesión para comentar.')
    setLoading(true)
    
    await supabase.from('comentarios_noticias').insert({ noticia_id: noticiaId, user_id: user.id, comment })
    
    setComment('')
    router.refresh()
    
    // 👇 También actualizamos la consulta aquí después de publicar
    const { data } = await supabase
      .from('comentarios_noticias')
      .select('*, profiles(email, full_name, avatar_url)')
      .eq('noticia_id', noticiaId)
      .order('created_at', { ascending: false })
    
    if (data) setComentarios(data)
    setLoading(false)
  }

  return (
    <div className="mt-16 pt-10 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Comentarios ({comentarios.length})</h3>
      
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-8">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea required rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="¿Qué opinas sobre esta noticia?" className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-800 resize-none shadow-inner" />
            <button type="submit" disabled={loading} className="bg-red-800 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-red-900 shadow-sm disabled:opacity-50">
              {loading ? 'Publicando...' : 'Publicar comentario'}
            </button>
          </form>
        ) : (
          <p className="text-gray-600">Debes <a href="/login" className="text-red-800 font-bold hover:underline">iniciar sesión</a> para comentar.</p>
        )}
      </div>

      <div className="space-y-6">
        {comentarios.map((c) => {
          // 👇 LÓGICA DE AVATAR: Si no hay full_name, usa la primera parte del email
          const autor = c.profiles?.full_name || c.profiles?.email?.split('@')[0] || 'Usuario'
          const fotoPerfil = c.profiles?.avatar_url
          const nivelUsuario = "Catador" // Podrás hacerlo dinámico en el futuro

          return (
            <div key={c.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex gap-4 transition hover:shadow-md">
              
              {/* 1. SECCIÓN DEL AVATAR */}
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

              {/* 2. SECCIÓN DEL TEXTO */}
              <div className="flex-grow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                  <h4 className="font-bold text-gray-900">{autor}</h4>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide w-fit">
                    🍷 {nivelUsuario}
                  </span>
                </div>
                
                <div className="text-xs text-gray-400 mb-2 font-medium">
                  {new Date(c.created_at).toLocaleDateString()}
                </div>
                
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {c.comment}
                </p>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}