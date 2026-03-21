"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function RankingCervezasPage() {
  const [cervezas, setCervezas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // 👇 NUEVOS ESTADOS PARA BUSCADOR Y FILTRO 👇
  const [orden, setOrden] = useState("mejor_puntuadas");
  const [busqueda, setBusqueda] = useState("");
  const [estiloFiltro, setEstiloFiltro] = useState("todos");

  useEffect(() => {
    const fetchRanking = async () => {
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

  // 👇 1. EXTRAER ESTILOS ÚNICOS PARA EL SELECTOR 👇
  const estilosUnicos = Array.from(
    new Set(cervezas.map((c) => c.estilos?.nombre).filter(Boolean))
  ).sort();

  // 👇 2. EL MOTOR DE BÚSQUEDA, FILTRO Y ORDENAMIENTO ENCADENADO 👇
  const cervezasProcesadas = cervezas
    .filter((cerveza) => {
      // Filtro por texto (busca en nombre de cerveza o en nombre de fábrica)
      const textoBusqueda = busqueda.toLowerCase();
      const coincideBusqueda = 
        cerveza.nombre.toLowerCase().includes(textoBusqueda) ||
        cerveza.cervecerias?.nombre.toLowerCase().includes(textoBusqueda);
      
      // Filtro por estilo
      const coincideEstilo = estiloFiltro === "todos" || cerveza.estilos?.nombre === estiloFiltro;

      return coincideBusqueda && coincideEstilo;
    })
    .sort((a, b) => {
      // Ordenamiento final
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
            Descubrí cuáles son las cervezas favoritas de la comunidad. Buscá, filtrá y ordená para encontrar tu próxima pinta ideal.
          </p>
        </div>

        {/* 👇 NUEVO PANEL DE HERRAMIENTAS (Buscador, Filtros y Orden) 👇 */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-8 space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Buscador de Texto */}
            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Buscar</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">🔍</span>
                <input 
                  type="text" 
                  placeholder="Nombre o fábrica..." 
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50 text-stone-800 font-medium"
                />
              </div>
            </div>

            {/* Filtro por Estilo */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Estilo</label>
              <select 
                value={estiloFiltro} 
                onChange={(e) => setEstiloFiltro(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50 text-stone-800 font-medium cursor-pointer"
              >
                <option value="todos">🍺 Todos los estilos</option>
                {estilosUnicos.map((estilo) => (
                  <option key={estilo as string} value={estilo as string}>{estilo as string}</option>
                ))}
              </select>
            </div>

            {/* Ordenamiento */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Ordenar por</label>
              <select 
                value={orden} 
                onChange={(e) => setOrden(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none bg-stone-50 text-stone-800 font-medium cursor-pointer"
              >
                <option value="mejor_puntuadas">⭐ Mejor Puntuadas</option>
                <option value="mas_alcohol">🔥 Mayor Alcohol (ABV)</option>
                <option value="mas_amargas">🌿 Más Amargas (IBU)</option>
                <option value="az">🔤 Alfabético (A-Z)</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-stone-500 font-medium pt-2 border-t border-gray-100 flex items-center justify-between">
            <span>Mostrando <strong>{cervezasProcesadas.length}</strong> resultados</span>
            {(busqueda !== "" || estiloFiltro !== "todos") && (
              <button 
                onClick={() => { setBusqueda(""); setEstiloFiltro("todos"); }}
                className="text-amber-600 hover:text-amber-700 font-bold transition"
              >
                Limpiar filtros ✕
              </button>
            )}
          </div>
        </div>

        {/* LISTA DEL RANKING */}
        <div className="space-y-4">
          {cervezasProcesadas.map((cerveza, index) => {
            // Estilos especiales para el Top 3 (Solo se aplican si estamos viendo el ranking general sin filtros raros)
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
                      <span title="International Bitterness Units"><strong>IBU:</strong> {cerveza.ibu || "N/A"}</span>
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

          {/* ESTADO VACÍO CUANDO NO HAY RESULTADOS DE BÚSQUEDA */}
          {cervezasProcesadas.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
              <span className="text-4xl">🕵️‍♂️</span>
              <h3 className="text-xl font-bold text-stone-800 mt-4">No encontramos lo que buscás</h3>
              <p className="text-gray-500 mt-1">Probá cambiando los filtros o borrando el texto de búsqueda.</p>
              <button 
                onClick={() => { setBusqueda(""); setEstiloFiltro("todos"); }}
                className="mt-6 bg-amber-100 text-amber-800 font-bold px-6 py-2 rounded-xl border border-amber-200 hover:bg-amber-200 transition"
              >
                Ver todo el ranking
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}