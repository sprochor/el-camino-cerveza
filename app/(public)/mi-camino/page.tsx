'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { User } from "@supabase/supabase-js"
import Link from 'next/link'

// --- LÓGICA DE NIVEL CERVECERO ÚNICO ---
const NIVELES_CERVECERO = [
  { id: 1, nombre: "Aprendiz de Pinta", min: 0, max: 10, desc: "Iniciando la ruta.", icono: "🍺", color: "bg-amber-50 text-amber-800", borderColor: "border-amber-200" },
  { id: 2, nombre: "Catador Curioso", min: 11, max: 50, desc: "Descubriendo estilos.", icono: "🍻", color: "bg-orange-50 text-orange-800", borderColor: "border-orange-200" },
  { id: 3, nombre: "Amante del Lúpulo", min: 51, max: 150, desc: "Paladar entrenado.", icono: "🌿", color: "bg-green-50 text-green-800", borderColor: "border-green-200" },
  { id: 4, nombre: "Juez Cervecero", min: 151, max: 400, desc: "Reconoce defectos y virtudes.", icono: "⚖️", color: "bg-blue-50 text-blue-800", borderColor: "border-blue-200" },
  { id: 5, nombre: "Maestro Cervecero", min: 401, max: 999, desc: "Domina todos los estilos.", icono: "🧑‍🍳", color: "bg-stone-100 text-stone-800", borderColor: "border-stone-300" },
  { id: 6, nombre: "Leyenda del Barril", min: 1000, max: 99999, desc: "Ha vaciado todas las fábricas.", icono: "👑", color: "bg-yellow-100 text-yellow-900", borderColor: "border-yellow-400" },
];

function obtenerNivel(cantidad: number, arrayNiveles: any[]) {
  const nivelActual = arrayNiveles.find(n => cantidad >= n.min && cantidad <= n.max) || arrayNiveles[0];
  const siguienteNivel = arrayNiveles.find(n => n.id === nivelActual.id + 1);
  const faltantes = siguienteNivel ? siguienteNivel.min - cantidad : 0;
  const porcentaje = siguienteNivel 
    ? ((cantidad - nivelActual.min) / (siguienteNivel.min - nivelActual.min)) * 100 
    : 100;

  return { nivelActual, siguienteNivel, faltantes, porcentaje };
}

export default function MiCaminoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  
  // Estados de Identidad
  const [user, setUser] = useState<User | null>(null)
  const [displayName, setDisplayName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("") 
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false) 

  // Estados del Pasaporte
  const [resenas, setResenas] = useState<any[]>([])

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/login')
        return
      }

      setUser(session.user)
      const userId = session.user.id

      // 1. Traer nombre y foto de perfil
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", userId)
        .single();

      if (profile) { 
        setDisplayName(profile.full_name || ""); 
        setAvatarUrl(profile.avatar_url || ""); 
      }

      // 2. Traer reseñas del usuario
      const { data: resenasData } = await supabase
        .from('resenas')
        .select('*, cervezas(id, nombre, imagen_url, cervecerias(nombre))')
        .eq('usuario_id', userId)
        .order('created_at', { ascending: false })

      if (resenasData) setResenas(resenasData);
      setLoading(false)
    }

    fetchUserData()
  }, [router])

  // Subir foto a Supabase Storage
  const handleUploadAvatar = async (event: any) => {
    try {
      setUploadingAvatar(true)
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Debes seleccionar una imagen.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id)

      if (updateError) throw updateError

      setAvatarUrl(publicUrl)
      
    } catch (error: any) {
      alert("Error al subir foto: " + error.message)
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: displayName })
        .eq("id", user?.id);

      if (error) throw error;
      alert("¡Perfil actualizado con éxito!");
      window.location.reload();
    } catch (error: any) {
      alert("Error al guardar: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-amber-400 text-sm drop-shadow-sm">
        {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      </div>
    );
  };

  if (loading) return <div className="p-20 text-center text-xl text-stone-500 font-medium animate-pulse">Abriendo tu bitácora cervecera... 🍺</div>

  const progreso = obtenerNivel(resenas.length, NIVELES_CERVECERO);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 space-y-12">
      <header className="border-b border-gray-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-stone-900 mb-2 tracking-tight">Mi Camino 🍺</h1>
          <p className="text-stone-500 text-lg">Tu bitácora personal de cervezas degustadas y medallas obtenidas.</p>
        </div>
      </header>

      {/* --- SECCIÓN SUPERIOR: NIVEL Y PERFIL --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* TARJETA 1: Gamificación Única */}
        <section className={`bg-white rounded-3xl p-6 md:p-8 shadow-sm border ${progreso.nivelActual.borderColor} flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden transition-all hover:shadow-md`}>
          <div className={`absolute -right-10 -top-10 w-48 h-48 ${progreso.nivelActual.color} rounded-full blur-3xl opacity-30 pointer-events-none`}></div>
          <div className={`w-28 h-28 shrink-0 ${progreso.nivelActual.color} rounded-full border-4 border-white shadow-lg flex items-center justify-center text-5xl relative z-10 transform transition hover:scale-105`}>
            {progreso.nivelActual.icono} 
          </div>
          <div className="flex-1 w-full text-center sm:text-left relative z-10">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 block">Ruta Cervecera • Nivel {progreso.nivelActual.id}</span>
            <h2 className="text-2xl font-black text-stone-900 mb-1">{progreso.nivelActual.nombre}</h2>
            <p className="text-stone-600 text-sm mb-4">
              {progreso.nivelActual.desc} <span className="font-bold text-stone-900">({resenas.length} pintas)</span>
            </p>
            {progreso.siguienteNivel ? (
              <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-100">
                <div className="flex justify-between text-xs font-bold text-stone-600">
                  <span>Hacia Nivel {progreso.siguienteNivel.id}</span>
                  <span className="text-amber-700">¡Faltan {progreso.faltantes}!</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" style={{ width: `${progreso.porcentaje}%` }}></div>
                </div>
              </div>
            ) : (
              <div className="text-amber-800 text-xs font-bold bg-amber-100 px-3 py-2 rounded-lg border border-amber-200 inline-block">🏆 ¡Nivel Máximo Alcanzado!</div>
            )}
          </div>
        </section>

        {/* TARJETA 2: Perfil */}
        <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md shrink-0 group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-800 font-bold uppercase">
                  {displayName ? displayName.charAt(0) : user?.email?.charAt(0)}
                </div>
              )}
              
              <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <span className="text-xs font-bold mt-1">Cambiar</span>
                <input type="file" accept="image/*" onChange={handleUploadAvatar} className="hidden" disabled={uploadingAvatar} />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-stone-900 text-lg">Tu Identidad</h3>
              <p className="text-sm text-stone-500">
                {uploadingAvatar ? <span className="text-amber-700 font-bold animate-pulse">Subiendo...</span> : 'Clic en el círculo para cambiar la foto.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nombre en la comunidad</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Ej: Juan Pérez" className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-stone-50 text-stone-800"/>
            </div>
            <button type="submit" disabled={saving} className="w-full bg-stone-900 text-amber-400 py-3 rounded-xl font-bold hover:bg-stone-800 transition disabled:opacity-50 shadow-md">
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </form>
        </section>

      </div>

      {/* --- SECCIÓN INFERIOR: HISTORIAL Y JUEGO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6 border-t border-gray-200">
        
        {/* COLUMNA 1 y 2: RESEÑAS */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-2">📝 Mis Veredictos</h2>
          {resenas.length === 0 ? (
            <div className="bg-stone-50 p-8 rounded-3xl border border-stone-200 text-center">
              <span className="text-5xl mb-4 block opacity-30">🍻</span>
              <p className="text-stone-600 font-medium">Aún no has dejado tu veredicto en ninguna cerveza.</p>
              <Link href="/cervezas" className="text-amber-700 font-bold hover:underline mt-2 block text-sm">Explorar ranking →</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {resenas.map(resena => (
                <div key={resena.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-5 hover:shadow-md transition">
                  <div className="w-16 h-24 bg-stone-50 rounded-xl overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center p-1">
                    {resena.cervezas?.imagen_url ? (
                      <img src={resena.cervezas.imagen_url} alt="Cerveza" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-3xl opacity-30">🍺</span>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link href={`/cervezas/${resena.cervezas?.id}`} className="font-extrabold text-lg text-stone-900 hover:text-amber-700 transition">
                          {resena.cervezas?.nombre}
                        </Link>
                        <p className="text-xs text-gray-500 font-bold">🏭 {resena.cervezas?.cervecerias?.nombre}</p>
                      </div>
                      <div className="bg-stone-800 text-white px-2 py-1 rounded-lg font-black shadow-sm">
                        {resena.puntaje_general ? Number(resena.puntaje_general).toFixed(1) : "-"}
                      </div>
                    </div>
                    {renderStars(resena.puntaje_general || 0)}
                    {resena.comentario_opcional && (
                      <p className="text-sm text-stone-600 line-clamp-2 mt-2 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                        "{resena.comentario_opcional}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA 3: MEDALLAS DEL JUEGO */}
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-black text-stone-900 mb-6 flex items-center gap-2">🎖️ Medallas</h2>
          <div className="bg-stone-900 p-6 rounded-3xl shadow-md border-4 border-stone-800 relative overflow-hidden">
            {/* Fondo decorativo retro */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-20 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h3 className="text-amber-500 font-mono font-bold text-sm mb-4 border-b border-stone-700 pb-2">
                LA CRUZADA DE HEINRICH
              </h3>
              
              <div className="space-y-4">
                {/* Medalla 1: Bloqueada */}
                <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300">
                  <div className="w-14 h-14 bg-stone-800 rounded-full border-2 border-dashed border-stone-500 flex items-center justify-center text-2xl shrink-0">
                    🔒
                  </div>
                  <div>
                    <h4 className="text-stone-300 font-bold text-sm">El Desembarco</h4>
                    <p className="text-stone-500 text-xs">Completar Capítulo 1.</p>
                  </div>
                </div>

                {/* Medalla 2: Bloqueada */}
                <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300">
                  <div className="w-14 h-14 bg-stone-800 rounded-full border-2 border-dashed border-stone-500 flex items-center justify-center text-2xl shrink-0">
                    🔒
                  </div>
                  <div>
                    <h4 className="text-stone-300 font-bold text-sm">Receta Perfecta</h4>
                    <p className="text-stone-500 text-xs">Completar Capítulo 2.</p>
                  </div>
                </div>

                {/* Medalla 3: Bloqueada */}
                <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition duration-300">
                  <div className="w-14 h-14 bg-stone-800 rounded-full border-2 border-dashed border-stone-500 flex items-center justify-center text-2xl shrink-0">
                    🔒
                  </div>
                  <div>
                    <h4 className="text-stone-300 font-bold text-sm">Rey de la Pulpería</h4>
                    <p className="text-stone-500 text-xs">Completar Capítulo 3.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800 text-center">
                <Link href="/juegos" className="text-amber-600 hover:text-amber-400 font-mono text-xs font-bold tracking-widest transition">
                  [ IR AL JUEGO ]
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}