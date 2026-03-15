"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function HomePage() {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [cervezas, setCervezas] = useState<any[]>([]);
  const [cervecerias, setCervecerias] = useState<any[]>([]);
  
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchDatos = async () => {
      // 1. Traemos SOLO las ÚLTIMAS 4 cervezas
      const { data: cervs } = await supabase
        .from("cervezas")
        .select("*, cervecerias(nombre), estilos(nombre, familia)")
        .order("created_at", { ascending: false })
        .limit(4);
      if (cervs) setCervezas(cervs);

      // 2. Traemos las últimas 3 notas/noticias
      const { data: notis } = await supabase
        .from("noticias")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (notis) setNoticias(notis);

      // 3. Traemos las últimas 4 cervecerías
      const { data: cervsList } = await supabase
        .from("cervecerias")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);
      if (cervsList) setCervecerias(cervsList);

      setCargando(false);
    };
    fetchDatos();
  }, []);

  return (
    <div className="bg-stone-50 md:bg-transparent min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-12 md:space-y-16">
        
        {/* 1. ENCABEZADO (HERO) LIMPIO */}
        <section className="relative rounded-3xl overflow-hidden shadow-md">
          <img src="/hero-cerveza.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Mundo Cervecero" />
          <div className="absolute inset-0 bg-black/60"></div>

          <div className="relative text-center py-20 md:py-32 px-4 md:px-6 text-white max-w-3xl mx-auto">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">Bienvenido al club</span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white drop-shadow-lg leading-tight">
              El Camino <span className="italic font-serif text-amber-400">de la Cerveza</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium">
              Descubrí fábricas artesanales, explorá cientos de estilos y registrá tus experiencias pinta a pinta.
            </p>
          </div>
        </section>

        {/* 2. ÚLTIMAS CERVEZAS */}
        <section className="bg-white md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-transparent">
          <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-3">
            <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">
              🍺 Recién pinchadas
            </h2>
            <Link href="/cervezas" className="text-amber-700 text-sm font-bold hover:underline">Ver ranking →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cargando ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                  <div className="w-full h-40 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              cervezas.map((cerveza) => (
                <Link href={`/cervezas/${cerveza.id}`} key={cerveza.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 group flex flex-col cursor-pointer">
                  <div className="w-full h-40 bg-stone-50 rounded-xl mb-4 overflow-hidden relative border border-gray-100 flex items-center justify-center">
                    {cerveza.imagen_url ? (
                      <img src={cerveza.imagen_url} alt={cerveza.nombre} className="h-full object-contain p-2 group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl opacity-20">🍻</div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    {cerveza.estilos?.nombre || "Estilo Desconocido"}
                  </span>
                  <h3 className="font-extrabold text-stone-900 group-hover:text-amber-700 transition truncate text-lg">{cerveza.nombre}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1 font-medium truncate">
                    🏭 {cerveza.cervecerias?.nombre}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* 3. MENCIÓN ESPECIAL DEL JUEGO (BANNER RETRO) */}
        <section className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-stone-900 bg-stone-900 group cursor-pointer" onClick={() => window.location.href = '/juegos'}>
          {/* Fondo pixelado sutil y efecto scanline */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-50 z-10"></div>
          
          <div className="relative z-20 flex flex-col md:flex-row items-center justify-between p-8 md:p-12 gap-8">
            <div className="flex-1 text-center md:text-left">
              <span className="font-mono text-amber-500 font-bold tracking-widest uppercase text-xs mb-2 block">
                [ PROYECTO EN DESARROLLO ]
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-amber-400 mb-4 drop-shadow-[0_2px_0_rgba(180,83,9,1)]">
                La Cruzada de Heinrich 🎮
              </h2>
              <p className="text-stone-300 text-lg md:text-xl font-serif italic">
                Ayudá a un testarudo maestro cervecero bávaro a conquistar el Buenos Aires de 1806, dominado por el mate y la caña.
              </p>
            </div>
            
            <div className="shrink-0 z-30">
              <Link href="/juegos" className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-900 font-black font-mono px-6 py-4 rounded-none border-b-4 border-r-4 border-amber-700 hover:border-amber-600 hover:translate-y-1 hover:translate-x-1 transition-all">
                &gt; EXPLORAR EL JUEGO_
              </Link>
            </div>
          </div>
        </section>

        {/* 4. NOVEDADES Y CERVECERÍAS (2 COLUMNAS) */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
          
          {/* COLUMNA IZQUIERDA: ÚLTIMAS NOTICIAS */}
          <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-transparent">
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-3">
              <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">📰 Cultura Cervecera</h2>
              <Link href="/notas" className="text-amber-700 text-sm font-bold hover:underline">Ver todas →</Link>
            </div>

            <div className="space-y-4">
              {cargando ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4 md:gap-5 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 animate-pulse">
                    <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-200 rounded-xl shrink-0"></div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="h-5 bg-gray-200 rounded w-full mb-3"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    </div>
                  </div>
                ))
              ) : noticias.length > 0 ? (
                noticias.map((noticia) => (
                  <Link href={`/notas/${noticia.id}`} key={noticia.id} className="group flex gap-4 md:gap-5 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-300 border border-gray-100 cursor-pointer">
                    <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 rounded-xl overflow-hidden bg-stone-100 border border-gray-200">
                      {noticia.image_url ? (
                        <img src={noticia.image_url} alt={noticia.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">🗞️</div>
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="font-extrabold text-stone-900 leading-tight group-hover:text-amber-700 transition line-clamp-2 mb-2 text-sm md:text-base">{noticia.title}</h3>
                      <p className="text-xs md:text-sm text-gray-500 line-clamp-2">{noticia.content?.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ")}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">Pronto subiremos nuevas notas y novedades.</p>
                </div>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: NUEVAS CERVECERÍAS */}
          <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-3xl md:rounded-none shadow-sm md:shadow-none border border-gray-100 md:border-transparent">
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-3">
              <h2 className="text-2xl font-black text-stone-900 flex items-center gap-2">🏭 Nuevas Cervecerías</h2>
              <Link href="/cervecerias" className="text-amber-700 text-sm font-bold hover:underline">Ver todas →</Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cargando ? (
                [1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))
              ) : cervecerias.length > 0 ? (
                cervecerias.map((cerveceria) => (
                  <Link href={`/cervecerias/${cerveceria.id}`} key={cerveceria.id} className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-300 border border-gray-100 flex items-center gap-4 cursor-pointer">
                    <div className="w-16 h-16 shrink-0 bg-stone-50 rounded-full overflow-hidden border border-gray-200 flex items-center justify-center p-1">
                      {cerveceria.image_url ? (
                        <img src={cerveceria.image_url} alt={cerveceria.nombre} className="h-full w-full object-cover rounded-full group-hover:scale-105 transition duration-300" />
                      ) : (
                        <span className="text-2xl opacity-30">🍺</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 leading-tight group-hover:text-amber-700 transition line-clamp-1 text-sm md:text-base">{cerveceria.nombre}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1 flex items-center gap-1">📍 {cerveceria.ciudad}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-1 sm:col-span-2 text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 text-sm">Todavía no hay cervecerías registradas.</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}