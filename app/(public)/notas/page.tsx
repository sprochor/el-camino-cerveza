"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NotasPage() {
  const [notas, setNotas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchNotas = async () => {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error trayendo notas:", error);
      } else if (data) {
        setNotas(data);
      }
      setCargando(false);
    };

    fetchNotas();
  }, []);

  // Función para formatear la fecha al español
  const formatearFecha = (fechaString: string) => {
    const opciones: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(fechaString).toLocaleDateString('es-ES', opciones);
  };

  if (cargando) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-stone-50">
        <div className="text-amber-700 text-xl font-bold animate-pulse">Imprimiendo el diario cervecero... 🗞️</div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-16 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO */}
        <div className="text-center mb-16">
          <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-2 block">Blog y Novedades</span>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight">
            Cultura <span className="text-amber-600">Cervecera</span> 📰
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Descubrí la historia detrás de cada estilo, enterate de los nuevos lanzamientos y aprendé los secretos de los maestros cerveceros.
          </p>
        </div>

        {/* GRILLA DE NOTAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {notas.map((nota) => (
            {/* 👇 ACÁ ESTÁ EL CAMBIO: Usamos nota.slug (y si no tiene, usamos nota.id para no romper notas viejas) 👇 */}
            <Link 
              href={`/notas/${nota.slug || nota.id}`} 
              key={nota.id} 
              className="group bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden cursor-pointer h-full"
            >
              {/* Imagen de Portada */}
              <div className="w-full h-56 bg-stone-100 overflow-hidden relative border-b border-gray-100">
                {nota.image_url ? (
                  <img src={nota.image_url} alt={nota.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl opacity-20">🍻</div>
                )}
                {/* Etiqueta de fecha flotante */}
                <div className="absolute top-4 left-4 bg-stone-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  {formatearFecha(nota.created_at)}
                </div>
              </div>

              {/* Contenido */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-extrabold text-stone-900 mb-3 group-hover:text-amber-700 transition line-clamp-2 leading-tight">
                  {nota.title}
                </h2>
                
                {/* Extraemos texto plano del HTML (si usas un editor de texto enriquecido) */}
                <p className="text-stone-600 text-sm line-clamp-3 mb-6 flex-grow">
                  {nota.content?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ")}
                </p>
                
                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center text-amber-600 font-bold text-sm group-hover:text-amber-500 transition">
                  Leer artículo completo <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

            </Link>
          ))}
        </div>

        {/* ESTADO VACÍO */}
        {notas.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm">
            <span className="text-6xl opacity-30 mb-4 block">🗞️</span>
            <h3 className="text-2xl font-bold text-stone-800">La redacción está tranquila</h3>
            <p className="text-gray-500 mt-2 text-lg">Pronto publicaremos artículos, historias y novedades cerveceras.</p>
          </div>
        )}

      </div>
    </div>
  );
}