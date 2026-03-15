"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CerveceriaDetailPage() {
  const { id } = useParams();
  const [cerveceria, setCerveceria] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchCerveceria = async () => {
      if (!id) return;

      // Traemos la cervecería y TODAS sus cervezas (incluyendo el estilo de cada una)
      const { data, error } = await supabase
        .from("cervecerias")
        .select(`
          *,
          cervezas (
            id,
            nombre,
            abv,
            ibu,
            imagen_url,
            estilos (nombre)
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error trayendo cervecería:", error);
      } else if (data) {
        setCerveceria(data);
      }
      
      setCargando(false);
    };

    fetchCerveceria();
  }, [id]);

  if (cargando) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-stone-50">
        <div className="text-amber-700 text-xl font-bold animate-pulse">Abriendo las puertas de la fábrica... 🏭</div>
      </div>
    );
  }

  if (!cerveceria) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-stone-50 text-center px-4">
        <div>
          <span className="text-6xl mb-4 block opacity-50">🏜️</span>
          <h1 className="text-2xl font-bold text-stone-800">Fábrica no encontrada</h1>
          <p className="text-stone-500 mt-2 mb-6">Parece que esta cervecería cerró sus puertas o no existe.</p>
          <Link href="/cervecerias" className="bg-amber-500 text-stone-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-400 transition">
            Volver a la Guía
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-16 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* NAVEGACIÓN */}
        <Link href="/cervecerias" className="text-amber-700 font-bold hover:underline flex items-center gap-2 w-fit">
          ← Volver a la Guía de Cervecerías
        </Link>

        {/* HEADER DE LA CERVECERÍA */}
        <div className="bg-stone-900 rounded-3xl p-8 md:p-12 shadow-xl border-b-8 border-amber-500 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
          
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          
          {/* Logo de la cervecería */}
          <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-full p-2 flex-shrink-0 flex items-center justify-center border-4 border-stone-800 shadow-lg z-10">
            {cerveceria.image_url ? (
              <img src={cerveceria.image_url} alt={cerveceria.nombre} className="h-full w-full object-cover rounded-full" />
            ) : (
              <span className="text-6xl opacity-30">🏭</span>
            )}
          </div>

          {/* Info Principal */}
          <div className="flex-1 text-center md:text-left z-10 text-white">
            <span className="bg-stone-800 text-amber-400 font-bold px-3 py-1 rounded-full text-xs tracking-widest uppercase border border-stone-700">
              Fábrica Artesanal
            </span>
            <h1 className="text-4xl md:text-6xl font-black mt-4 mb-2 tracking-tight drop-shadow-md">
              {cerveceria.nombre}
            </h1>
            <p className="text-xl text-stone-400 font-medium mb-6 flex items-center justify-center md:justify-start gap-2">
              📍 {cerveceria.ciudad}, {cerveceria.pais}
            </p>
            
            {cerveceria.historia && (
              <div className="bg-stone-800/50 p-6 rounded-2xl border border-stone-700/50 backdrop-blur-sm">
                <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest mb-2">La Historia</h3>
                <p className="text-stone-300 leading-relaxed text-sm md:text-base">
                  {cerveceria.historia}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* LISTADO DE CERVEZAS DE ESTA FÁBRICA */}
        <div>
          <div className="flex items-center justify-between mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-3xl font-black text-stone-900 flex items-center gap-3">
              🍺 Pizarrón de Cervezas
            </h2>
            <span className="bg-amber-100 text-amber-800 font-bold px-4 py-1.5 rounded-full text-sm">
              {cerveceria.cervezas?.length || 0} Etiquetas
            </span>
          </div>

          {cerveceria.cervezas && cerveceria.cervezas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cerveceria.cervezas.map((cerveza: any) => (
                <Link href={`/cervezas/${cerveza.id}`} key={cerveza.id}>
                  <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 group flex items-center gap-5 cursor-pointer h-full">
                    
                    {/* Imagen de la cerveza */}
                    <div className="w-16 h-24 shrink-0 bg-stone-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-1 group-hover:bg-amber-50 transition">
                      {cerveza.imagen_url ? (
                        <img src={cerveza.imagen_url} alt={cerveza.nombre} className="h-full object-contain group-hover:scale-110 transition duration-300" />
                      ) : (
                        <span className="text-3xl opacity-30">🍻</span>
                      )}
                    </div>
                    
                    {/* Datos de la cerveza */}
                    <div className="flex-1">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-1">
                        {cerveza.estilos?.nombre || "Estilo Desconocido"}
                      </span>
                      <h3 className="font-extrabold text-stone-900 leading-tight group-hover:text-amber-700 transition line-clamp-2 text-lg mb-2">
                        {cerveza.nombre}
                      </h3>
                      <div className="flex gap-3 text-xs font-bold text-gray-500 bg-stone-50 w-fit px-2 py-1 rounded-md border border-gray-100">
                        <span title="Alcohol">ABV: {cerveza.abv}%</span>
                        <span className="text-gray-300">|</span>
                        <span title="Amargor">IBU: {cerveza.ibu}</span>
                      </div>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
              <span className="text-5xl opacity-50 mb-4 block">🧹</span>
              <h3 className="text-xl font-bold text-stone-800">Los barriles están vacíos</h3>
              <p className="text-gray-500 mt-2">Todavía no hay cervezas cargadas para esta fábrica.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}