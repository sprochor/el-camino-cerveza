"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams } from "next/navigation";
import Comentarios from "@/components/Comentarios"; 

export default function NotaDetailPage() {
  const { slug } = useParams(); // 👈 1. Ahora atrapamos el "slug" de la URL
  const [nota, setNota] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchNota = async () => {
      if (!slug) return;

      // Intentamos buscar primero por la columna SLUG
      let { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("slug", slug)
        .single();

      // Si no la encuentra (quizás es un link viejo usando el ID)
      if (error) {
        // 2. Verificamos si lo que hay en la URL tiene formato de ID (UUID)
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug as string);
        
        if (isUUID) {
           // Si es un ID, buscamos por la columna ID para no romper notas viejas
           const fallback = await supabase
            .from("noticias")
            .select("*")
            .eq("id", slug)
            .single();
           
           if (fallback.data) {
             data = fallback.data;
           }
        }
      }

      if (data) {
        setNota(data);
      }

      setCargando(false);
    };

    fetchNota();
  }, [slug]); // 👈 3. Actualizamos la dependencia del useEffect

  // Formateador de fecha
  const formatearFecha = (fechaString: string) => {
    const opciones: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(fechaString).toLocaleDateString("es-ES", opciones);
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-stone-50">
        <div className="text-amber-700 text-xl font-bold animate-pulse">
          Sirviendo la nota... 📝
        </div>
      </div>
    );
  }

  if (!nota) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-stone-50 text-center px-4">
        <div>
          <span className="text-6xl mb-4 block opacity-50">📰</span>
          <h1 className="text-2xl font-bold text-stone-800">
            Nota no encontrada
          </h1>
          <p className="text-stone-500 mt-2 mb-6">
            Parece que este artículo fue borrado o el enlace es incorrecto.
          </p>
          <Link
            href="/notas"
            className="bg-amber-500 text-stone-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-400 transition"
          >
            Volver a Cultura Cervecera
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-20 pt-8">
      {/* NAVEGACIÓN */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          href="/notas"
          className="text-amber-700 font-bold hover:underline flex items-center gap-2 w-fit"
        >
          ← Volver a Cultura Cervecera
        </Link>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* CABECERA DEL ARTÍCULO */}
        <header className="text-center mb-10">
          <time className="text-amber-600 font-bold tracking-widest uppercase text-sm mb-4 block">
            {formatearFecha(nota.created_at)}
          </time>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 leading-tight mb-6 tracking-tight">
            {nota.title}
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full"></div>
        </header>

        {/* IMAGEN DE PORTADA */}
        {nota.image_url && (
          <div className="w-full h-64 md:h-96 rounded-3xl overflow-hidden shadow-lg mb-12 border border-gray-200 bg-stone-100">
            <img
              src={nota.image_url}
              alt={nota.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* CONTENIDO DEL ARTÍCULO */}
        <div
          className="text-lg md:text-xl text-stone-700 leading-relaxed prose-cervecero max-w-none"
          dangerouslySetInnerHTML={{ __html: nota.content ? nota.content.replace(/&nbsp;/g, ' ') : "" }}
        />

        {/* CSS PERSONALIZADO */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .prose-cervecero { 
            word-break: normal; 
            overflow-wrap: break-word; 
          }
          .prose-cervecero * { max-width: 100% !important; }
          .prose-cervecero img { 
            height: auto !important; 
            border-radius: 1rem; 
            margin: 2.5rem auto; 
            display: block; 
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
          }
          .prose-cervecero p { margin-bottom: 1.5rem; line-height: 1.8; }
          .prose-cervecero h2 { font-size: 1.75rem; font-weight: 900; color: #1c1917; margin-top: 2.5rem; margin-bottom: 1rem; line-height: 1.2; }
          .prose-cervecero h3 { font-size: 1.5rem; font-weight: 800; color: #292524; margin-top: 2rem; margin-bottom: 0.75rem; }
          .prose-cervecero strong { font-weight: 800; color: #1c1917; }
          .prose-cervecero ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; color: #b45309; }
          .prose-cervecero ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.5rem; color: #b45309; }
          .prose-cervecero li { margin-bottom: 0.5rem; color: #44403c; }
          .prose-cervecero blockquote { border-left: 4px solid #f59e0b; padding-left: 1rem; font-style: italic; background: #fafaf9; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; }
          .prose-cervecero a { color: #b45309; text-decoration: underline; font-weight: bold; word-break: break-all; }
          .prose-cervecero a:hover { color: #d97706; }
        `,
          }}
        />

        {/* PIE DEL ARTÍCULO */}
        <footer className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-stone-500 font-medium">Compartir artículo:</p>
          <div className="flex gap-3">
            <button
              onClick={() =>
                navigator.clipboard
                  .writeText(window.location.href)
                  .then(() => alert("¡Enlace copiado! 🍻"))
              }
              className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold px-4 py-2 rounded-xl transition flex items-center gap-2"
            >
              🔗 Copiar Enlace
            </button>
          </div>
        </footer>

        {/* 👇 4. MAGIA FINAL: Le pasamos el ID real de la base de datos a los comentarios 👇 */}
        <Comentarios notaId={nota.id} />
        
      </article>
    </div>
  );
}