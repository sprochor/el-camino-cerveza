'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css' 

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false, loading: () => <p className="p-4 text-gray-500">Cargando editor...</p> })

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    ['link', 'image'], 
    ['clean']
  ],
}

export default function EditarNoticiaPage() {
  const router = useRouter()
  const params = useParams()
  const noticiaId = params.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('') 
  const [imagenVieja, setImagenVieja] = useState<string | null>(null)
  const [imagenNueva, setImagenNueva] = useState<File | null>(null) 

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.push('/login')

      const { data: noticia } = await supabase.from('noticias').select('*').eq('id', noticiaId).single()
      if (noticia) {
        setTitle(noticia.title || '')
        setContent(noticia.content || '')
        setImagenVieja(noticia.image_url || null)
      }
      setLoading(false)
    }
    cargarDatos()
  }, [noticiaId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      let imageUrl = imagenVieja
      if (imagenNueva) {
        const fileName = `noticia-cover-${Date.now()}-${imagenNueva.name}`
        const { error: uploadError } = await supabase.storage.from('bodegas-cover').upload(fileName, imagenNueva)
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('bodegas-cover').getPublicUrl(fileName)
        imageUrl = publicUrl
      }

      const { error } = await supabase.from('noticias').update({ title, content, image_url: imageUrl }).eq('id', noticiaId)
      if (error) throw error

      alert('¡Noticia actualizada con éxito!')
      // 👇 CORRECCIÓN 1: Redirige a /notas/ después de guardar
      router.push(`/notas/${noticiaId}`) 
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center p-20 text-xl font-bold">Cargando noticia...</div>

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center gap-4 mb-8">
        {/* 👇 CORRECCIÓN 2: El botón de cancelar apunta a /notas/ */}
        <Link href={`/notas/${noticiaId}`} className="text-gray-500 hover:text-red-800 font-bold text-xl">← Cancelar</Link>
        <h1 className="text-3xl font-bold text-blue-800">Editar Noticia</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Noticia *</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-800" />
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 flex flex-col md:flex-row gap-6 items-center">
             {imagenVieja && (
               <div className="w-40 h-24 shrink-0 rounded-lg overflow-hidden shadow-sm border border-gray-200 bg-black">
                 <img src={imagenVieja} alt="Actual" className="w-full h-full object-cover opacity-80" />
               </div>
             )}
             <div className="flex-grow w-full">
                <label className="block text-sm font-bold text-blue-900 mb-2">Reemplazar Foto de Portada (Opcional)</label>
                <input type="file" accept="image/*" onChange={(e) => setImagenNueva(e.target.files?.[0] || null)} className="w-full p-2 border rounded-md bg-white" />
             </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contenido *</label>
          <div className="bg-white rounded-lg overflow-hidden border border-gray-300">
            <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} className="h-96 mb-12" />
          </div>
        </div>

        <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white py-4 rounded-xl hover:bg-blue-700 transition font-extrabold text-lg mt-8 shadow-md">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </form>
    </div>
  )
}