'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// 👇 1. TRAEMOS LA LÓGICA DE NIVELES 👇
const NIVELES_CERVECERO = [
  { id: 1, nombre: "Aprendiz de la Pinta", min: 0, max: 10 },
  { id: 2, nombre: "Catador Curioso", min: 11, max: 50 },
  { id: 3, nombre: "Amante del Lúpulo", min: 51, max: 150 },
  { id: 4, nombre: "Juez Cervecero", min: 151, max: 400 },
  { id: 5, nombre: "Maestro Cervecero", min: 401, max: 999 },
  { id: 6, nombre: "Leyenda del Barril", min: 1000, max: 99999 },
];

function obtenerNombreNivel(cantidad: number) {
  const nivel = NIVELES_CERVECERO.find(n => cantidad >= n.min && cantidad <= n.max) || NIVELES_CERVECERO[0];
  return nivel.nombre;
}

export default function Comentarios({ notaId }: { notaId: string | number }) {
  const [comentarios, setComentarios] = useState<any[]>([])
  const [comment, setComment] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [cargandoComentarios, setCargandoComentarios] = useState(true)

  const fetchDatos = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
    
    // 1. Traemos los comentarios apuntando a la tabla nueva y a los perfiles
    const { data: comentariosData } = await supabase
      .from('comentarios_notas')
      .select('*, profiles(full_name, avatar_url)')
      .eq('nota_id', notaId)
      .order('created_at', { ascending: false })
    
    if (comentariosData && comentariosData.length > 0) {
      // 2. Extraemos los IDs únicos de los usuarios que comentaron
      const userIds = [...new Set(comentariosData.map((c: any) => c.usuario_id))];
      
      // 3. Buscamos rápidamente cuántas reseñas tiene cada uno
      const { data: resenasData } = await supabase
        .from('resenas')
        .select('usuario_id')
        .in('usuario_id', userIds);

      // Contamos las reseñas por usuario
      const conteoResenas: Record<string, number> = {};
      if (resenasData) {
        resenasData.forEach((r: any) => {
          conteoResenas[r.usuario_id] = (conteoResenas[r.usuario_id] || 0) + 1;
        });
      }

      // 4. Le inyectamos el nivel calculado a cada comentario
      const comentariosConNivel = comentariosData.map((c: any) => ({
        ...c,
        nivel_nombre: obtenerNombreNivel(conteoResenas[c.usuario_id] || 0)
      }));

      setComentarios(comentariosConNivel);
    } else {
      setComentarios([]);
    }
    setCargandoComentarios(false);
  }

  useEffect(() => {
    fetchDatos()
  }, [notaId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return alert('Debes iniciar sesión para comentar.')
    setLoading(true)
    
    // Insertamos el comentario
    const { error } = await supabase
      .from('comentarios_notas')
      .insert({ 
        nota_id: notaId, 
        usuario_id: user.id, 
        contenido: comment 
      });
    
    if (error) {
      alert("Error al publicar: " + error.message)
    } else {
      setComment('')
      // Recargamos los datos para que calcule el nivel del nuevo comentario
      await fetchDatos() 
    }

    setLoading(false)
  }

  if (cargandoComentarios) {
    return <div className="mt-16 text-center text-stone-500 animate-pulse">Cargando comentarios... 🍻</div>
  }

  return (
    <div className="mt-16 pt-10 border-t border-stone-200">
      <h3 className="text-2xl font-black mb-6 text-stone-900">Comentarios ({comentarios.length})</h3>
      
      {/* CAJA DE COMENTARIOS */}
      <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200 mb-8 shadow-sm">
        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea 
              required 
              rows={3} 
              value={comment} 
              onChange={(e) => setComment(e.target.value)} 
              placeholder="¿Qué opinás sobre esta nota? Sumá tu voz a la ronda..." 
              className="w-full p-4 border border-stone-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none shadow-inner text-stone-800 bg-white" 
            />
            <div className="flex justify-end">
              <button 
                type="submit" 
                disabled={loading || !comment.trim()} 
                className="bg-amber-500 text-stone-900 px-6 py-2.5 rounded-xl font-black hover:bg-amber-400 shadow-[2px_2px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:translate-x-1 active:shadow-none disabled:opacity-50 transition-all"
              >
                {loading ? 'Publicando...' : 'Publicar comentario'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-stone-600 font-medium">
              Debes <Link href={`/login?next=/notas/${notaId}`} className="text-amber-700 font-black hover:underline">iniciar sesión</Link> para unirte a la charla.
            </p>
          </div>
        )}
      </div>

      {/* LISTA DE COMENTARIOS */}
      <div className="space-y-6">
        {comentarios.length === 0 ? (
          <p className="text-center text-stone-500 italic">La barra está vacía. ¡Sé el primero en levantar la copa!</p>
        ) : (
          comentarios.map((c) => {
            const autor = c.profiles?.full_name || 
              (c.usuario_id === user?.id && user?.email ? user.email.split('@')[0] : 'Socio Cervecero')
            
            const fotoPerfil = c.profiles?.avatar_url
            // 👇 AHORA USAMOS EL NIVEL DINÁMICO CALCULADO 👇
            const nivelUsuario = c.nivel_nombre 

            return (
              <div key={c.id} className="bg-white p-5 rounded-xl border border-stone-100 shadow-sm flex gap-4 transition hover:shadow-md hover:border-stone-200">
                
                {/* 1. SECCIÓN DEL AVATAR */}
                <div className="shrink-0">
                  {fotoPerfil ? (
                    <img 
                      src={fotoPerfil} 
                      alt={autor} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-amber-100 shadow-sm"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 flex items-center justify-center text-amber-800 font-black text-xl uppercase shadow-sm">
                      {autor.charAt(0)}
                    </div>
                  )}
                </div>

                {/* 2. SECCIÓN DEL TEXTO */}
                <div className="flex-grow">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                    <h4 className="font-bold text-stone-900">{autor}</h4>
                    <span className="bg-stone-100 text-stone-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide w-fit border border-stone-200 shadow-sm">
                      🍺 {nivelUsuario}
                    </span>
                  </div>
                  
                  <div className="text-xs text-stone-400 mb-2 font-medium">
                    {new Date(c.created_at).toLocaleDateString('es-AR', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                  
                  <p className="text-stone-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                    {c.contenido}
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