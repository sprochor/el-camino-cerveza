'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminVinoActions({ vinoId, bodegaId }: { vinoId: number, bodegaId: number }) {
  const [role, setRole] = useState<string>('user')
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
        if (profile) setRole(profile.role)
      }
    }
    checkUser()
  }, [])

  const handleDelete = async () => {
    if (window.confirm('⚠️ ¿Seguro que quieres eliminar este vino? Se borrarán también todas sus notas de cata.')) {
      const { error } = await supabase.from('vinos').delete().eq('id', vinoId)
      if (error) {
        alert('Error al eliminar: ' + error.message)
      } else {
        alert('Vino eliminado correctamente.')
        router.refresh()
        router.push(`/bodegas/${bodegaId}`) // Lo devolvemos a la bodega
      }
    }
  }

  if (role !== 'admin' && role !== 'editor') return null

  return (
    <div className="flex flex-wrap gap-4 mt-8 bg-red-50 p-4 rounded-xl border border-red-100 justify-center md:justify-start w-full">
      <Link href={`/admin/editar-vino/${vinoId}`} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-bold shadow-sm flex items-center gap-2 text-sm">
        ✏️ Editar Vino
      </Link>
      <button onClick={handleDelete} className="bg-white text-red-700 px-5 py-2 rounded-lg hover:bg-red-50 transition font-bold shadow-sm border border-red-200 flex items-center gap-2 text-sm">
        🗑️ Eliminar Vino
      </button>
    </div>
  )
}