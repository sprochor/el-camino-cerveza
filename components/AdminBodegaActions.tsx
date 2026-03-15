'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminBodegaActions({ bodegaId }: { bodegaId: number }) {
  const [role, setRole] = useState<string>('user')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile) setRole(profile.role)
      }
    }
    checkUser()
  }, [])

  const handleDelete = async () => {
    // Le pedimos confirmación al usuario por las dudas
    if (window.confirm('⚠️ ¿Estás totalmente seguro de que deseas eliminar esta bodega? Esta acción no se puede deshacer y borrará también sus reseñas y vinos.')) {
      const { error } = await supabase.from('bodegas').delete().eq('id', bodegaId)
      
      if (error) {
        alert('Error al eliminar: ' + error.message)
      } else {
        alert('Bodega eliminada correctamente.')
        router.push('/') // Lo devolvemos al inicio
      }
    }
  }

  // Si no es admin ni editor, no mostramos NADA
  if (role !== 'admin' && role !== 'editor') return null

  return (
    <div className="flex flex-wrap gap-4 mt-8 bg-red-50 p-4 rounded-xl border border-red-100">
      <div className="w-full text-xs font-bold text-red-800 uppercase tracking-wider mb-1">Panel de Administrador</div>
      <Link 
        href={`/admin/editar-bodega/${bodegaId}`} 
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-bold shadow-sm flex items-center gap-2"
      >
        ✏️ Editar Ficha
      </Link>
      <button 
        onClick={handleDelete} 
        className="bg-white text-red-700 px-5 py-2 rounded-lg hover:bg-red-50 transition font-bold shadow-sm border border-red-200 flex items-center gap-2"
      >
        🗑️ Eliminar Bodega
      </button>
    </div>
  )
}