'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminNoticiaActions({ noticiaId }: { noticiaId: number }) {
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
    if (window.confirm('⚠️ ¿Seguro que quieres eliminar esta noticia?')) {
      await supabase.from('noticias').delete().eq('id', noticiaId)
      alert('Noticia eliminada.')
      router.refresh()
      // 👇 CORRECCIÓN 1: Redirige a /notas después de borrar
      router.push('/notas')
    }
  }

  if (role !== 'admin' && role !== 'editor') return null

  return (
    <div className="flex gap-4 my-8 bg-red-50 p-4 rounded-xl border border-red-100 justify-center">
      {/* 👇 CORRECCIÓN 2: Apunta a la carpeta correcta de editar-nota */}
      <Link href={`/admin/editar-nota/${noticiaId}`} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-bold shadow-sm">
        ✏️ Editar Noticia
      </Link>
      <button onClick={handleDelete} className="bg-white text-red-700 px-5 py-2 rounded-lg hover:bg-red-50 font-bold shadow-sm border border-red-200">
        🗑️ Eliminar
      </button>
    </div>
  )
}