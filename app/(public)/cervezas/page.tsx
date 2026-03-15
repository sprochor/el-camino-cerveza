"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RankingCervezasPage() {
  const [cervezas, setCervezas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [orden, setOrden] = useState("mejor_puntuadas"); // mejor_puntuadas, mas_alcohol, mas_amargas, az

  useEffect(() => {
    const fetchRanking = async () => {
      // Traemos las cervezas con su cervecería, estilo y TODAS sus reseñas para promediar
      const { data, error } = await supabase
        .from("cervezas")
        .select(`
          *,
          cervecerias (nombre),
          estilos (nombre),
          resenas (puntaje_general)
        `);

      if (error) {
        console.error("Error trayendo el ranking:", error);
        setCargando(false);
        return;
      }

      if (data) {
        // Calculamos el promedio de cada cerveza y se lo agregamos al objeto
        const cervezasConPromedio = data.map((cerv) => {
          const totalResenas = cerv.resenas?.length || 0;
          const sumaPuntajes = cerv.resenas?.reduce((acc: number, curr: any) => acc + Number(curr.puntaje_general), 0) || 0;
          const promedio = totalResenas > 0 ? (sumaPuntajes / totalResenas) : 0;
          
          return {
            ...cerv,
            promedioGeneral: promedio,
            totalResenas
          };
        });

        setCervezas(cervezasConPromedio);
      }
      setCargando(false);
    };

    fetchRanking();
  }, []);

  // Función para ordenar el array de cervezas según el selector
  const cervezasOrdenadas = [...cervezas].sort((a, b) => {
    if (orden === "mejor_puntuadas") return b.promedioGeneral - a.promedioGeneral;
    if (orden === "mas_alcohol") return b.abv - a.abv;
    if (orden === "mas_amargas") return b.ibu - a.ibu;
    if (orden === "az") return a.nombre.localeCompare(b.nombre);
    return 0;
  });

  if (cargando) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-stone-50">
        <div className="text-amber-700 text-xl font-bold animate-pulse">Armando la tabla de posiciones... 🏆</div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-16 pt-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ENCABEZADO DEL RANKING */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight">
            Ranking <span className="text-amber-600">Cervecero</span> 🏆
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Descubrí cuáles son las cervezas favoritas de la comunidad. Ordená por puntaje, nivel de alcohol o el amargor que tu paladar resista.
          </p>
        </div>

        {/* BARRA DE HERRAMIENTAS (Filtros y Orden) */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
          <div className="text-stone-600 font-bold flex items-center gap-2">
            📊 Mostrando {cervezas.length} cervezas
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <label className="text-sm font-bold text-gray-500 uppercase">Ordenar por:</label>
            <select 
              value={orden} 
              onChange={(e) => setOrden(e.target.value)}
              className="p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50 text-stone-800 font-medium flex-1 md:flex-none cursor-pointer"
            >
              <option value="mejor_puntuadas">⭐ Mejor Puntuadas</option>
              <option value="mas_alcohol">🔥 Mayor Alcohol (ABV)</option>
              <option value="mas_amargas">🌿 Más Amargas (IBU)</option>
              <option value="az">🔤 Alfabético (A-Z)</option>
            </select>
          </div>
        </div>

        {/* LISTA DEL RANKING (Estilo Leaderboard) */}
        <div className="space-y-4">
          {cervezasOrdenadas.map((cerveza, index) => {
            // Estilos especiales para el Top 3
            const isTop1 = orden === "mejor_puntuadas" && index === 0 && cerveza.promedioGeneral > 0;
            const isTop2 = orden === "mejor_puntuadas" && index === 1 && cerveza.promedioGeneral > 0;
            const isTop3 = orden === "mejor_puntuadas" && index === 2 && cerveza.promedioGeneral > 0;

            return (
              <Link href={`/cervezas/${cerveza.id}`} key={cerveza.id}>
                <div className={`group relative bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition duration-300 border flex flex-col sm:flex-row items-center gap-6 cursor-pointer overflow-hidden ${isTop1 ? 'border-amber-400 border-2' : 'border-gray-100'}`}>
                  
                  {/* Posición (Ranking Number) */}
                  <div className="absolute top-0 left-0 bottom-0 w-12 flex items-center justify-center bg-stone-50 border-r border-gray-100">
                    <span className={`font-black text-xl ${isTop1 ? 'text-amber-500 text-3xl' : isTop2 ? 'text-gray-400 text-2xl' : isTop3 ? 'text-amber-800 text-2xl' : 'text-stone-300'}`}>
                      #{index + 1}
                    </span>
                  </div>

                  {/* Foto */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 ml-10 shrink-0 bg-stone-100 rounded-xl p-2 flex items-center justify-center">
                    {cerveza.imagen_url ? (
                      <img src={cerveza.imagen_url} alt={cerveza.nombre} className="h-full object-contain group-hover:scale-110 transition duration-300" />
                    ) : (
                      <span className="text-4xl opacity-30">🍺</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-2 py-1 rounded-md">
                      {cerveza.estilos?.nombre || "Estilo Desconocido"}
                    </span>
                    <h2 className="text-2xl font-extrabold text-stone-900 mt-2 mb-1 group-hover:text-amber-600 transition">
                      {cerveza.nombre}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">
                      🏭 {cerveza.cervecerias?.nombre}
                    </p>
                    
                    {/* Datos Duros Rápidos */}
                    <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-stone-600">
                      <span title="Alcohol By Volume"><strong>ABV:</strong> {cerveza.abv}%</span>
                      <span className="text-gray-300">|</span>
                      <span title="International Bitterness Units"><strong>IBU:</strong> {cerveza.ibu}</span>
                    </div>
                  </div>

                  {/* Puntaje (Derecha) */}
                  <div className="shrink-0 flex flex-col items-center bg-stone-800 text-white rounded-2xl p-4 min-w-[100px] shadow-sm transform transition group-hover:scale-105 group-hover:bg-stone-900">
                    <span className="text-3xl font-black text-amber-400">
                      {cerveza.promedioGeneral > 0 ? cerveza.promedioGeneral.toFixed(1) : "-"}
                    </span>
                    <div className="text-amber-400 text-xs mt-1">
                      {cerveza.promedioGeneral > 0 ? "★★★★★" : "Sin rating"}
                    </div>
                    <span className="text-[10px] mt-2 text-gray-400 uppercase tracking-wider">
                      {cerveza.totalResenas} reseñas
                    </span>
                  </div>

                </div>
              </Link>
            );
          })}

          {cervezas.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
              <span className="text-4xl">🏜️</span>
              <h3 className="text-xl font-bold text-stone-800 mt-4">Todavía no hay cervezas en el ranking</h3>
              <p className="text-gray-500">Sé el primero en agregar una desde el panel de administración.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}