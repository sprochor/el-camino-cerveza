"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
// 👇 IMPORTANTE: Cambiamos "react-quill" por "react-quill-new" en estas dos líneas
import "react-quill-new/dist/quill.snow.css"; 
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function NuevaNotaPage() {
  const router = useRouter();
  
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagenPortada, setImagenPortada] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);

  // Configuración de las herramientas que queremos en el editor
  const modulosQuill = {
    toolbar: [
      [{ header: [2, 3, false] }], // Permite Título 2, Título 3 y texto normal
      ["bold", "italic", "underline", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"], // 👈 ¡Acá está el botón para agregar imágenes dentro de la nota!
      ["clean"], // Botón para borrar formato
    ],
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo || !contenido) {
      alert("El título y el contenido son obligatorios.");
      return;
    }

    setGuardando(true);

    try {
      let imageUrl = null;

      // 1. Subir imagen de portada a Supabase Storage (si el usuario seleccionó una)
      if (imagenPortada) {
        // Asegurate de tener un bucket llamado 'noticias' en Supabase Storage
        const fileExt = imagenPortada.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("noticias")
          .upload(filePath, imagenPortada);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("noticias").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      // 2. Guardar la nota en la base de datos
      const { error: insertError } = await supabase.from("noticias").insert([
        {
          title: titulo,
          content: contenido, // Quill nos devuelve HTML puro, lo guardamos tal cual
          image_url: imageUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert("¡Nota publicada con éxito! 🍻");
      router.push("/notas"); // Llevamos al usuario a ver su obra de arte
      
    } catch (error: any) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al publicar: " + error.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900">Escribir Nueva Nota 📝</h1>
          <p className="text-stone-500 mt-1">Compartí cultura cervecera con la comunidad.</p>
        </div>
        <Link href="/admin" className="text-amber-700 font-bold hover:underline">
          Cancelar
        </Link>
      </div>

      <form onSubmit={handleGuardar} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        
        {/* TÍTULO */}
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
            Título del Artículo
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: La historia oculta de la IPA..."
            className="w-full p-4 text-xl font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-stone-50 text-stone-900"
            required
          />
        </div>

        {/* IMAGEN DE PORTADA */}
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
            Imagen de Portada (Opcional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-stone-50 transition cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagenPortada(e.target.files ? e.target.files[0] : null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {imagenPortada ? (
              <span className="text-green-600 font-bold flex items-center justify-center gap-2">
                ✅ {imagenPortada.name}
              </span>
            ) : (
              <div className="text-stone-500">
                <span className="text-3xl block mb-2">📸</span>
                <span className="font-medium">Hacé clic o arrastrá una imagen acá</span>
              </div>
            )}
          </div>
        </div>

        {/* EDITOR DE TEXTO ENRIQUECIDO (QUILL) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
            Cuerpo de la Nota
          </label>
          {/* Le damos una altura mínima para que sea cómodo escribir */}
          <div className="h-96 md:h-[500px] mb-12">
            <ReactQuill
              theme="snow"
              value={contenido}
              onChange={setContenido}
              modules={modulosQuill}
              className="h-full bg-white"
              placeholder="Érase una vez en un bar de Múnich..."
            />
          </div>
        </div>

        {/* BOTÓN GUARDAR */}
        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="bg-stone-900 text-amber-400 font-black px-10 py-4 rounded-xl hover:bg-stone-800 transition disabled:opacity-50 shadow-md flex items-center gap-2"
          >
            {guardando ? "Publicando en la imprenta..." : "Publicar Nota 📰"}
          </button>
        </div>
      </form>
    </div>
  );
}