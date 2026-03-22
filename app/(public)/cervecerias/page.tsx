"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function CerveceriasPage() {
  const [cervecerias, setCervecerias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchCervecerias = async () => {
      // 1. 👇 Agregamos el 'slug' a la lista de datos que le pedimos a Supabase
      const { data, error } = await supabase
        .from("cervecerias")
        .select(
          `
          *,
          slug, 
          cervezas (id)
        `,
        )
        .order("nombre");

      if (error) {
        console.error("Error trayendo cervecerías:", error);
      } else if (data) {
        setCervecerias(data);
      }
      setCargando(false);
    };

    fetchCervecerias();
  }, []);

  const cerveceriasFiltradas = cervecerias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (c.ciudad && c.ciudad.toLowerCase().includes(busqueda.toLowerCase())),
  );

  if (cargando) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-stone-50">
        <div className="text-amber-700 text-xl font-bold animate-pulse">
          Buscando fábricas... 🏭
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-50 min-h-screen pb-16 pt-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ENCABEZADO */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight">
            Guía de <span className="text-amber-600">Cervecerías</span> 🏭
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Descubrí las fábricas detrás de tus pintas favoritas.
            Conocé su historia, de dónde vienen y qué cervezas producen.
          </p>
        </div>

        {/* BUSCADOR */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nombre o ciudad..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full p-4 pl-12 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-amber-500 outline-none text-stone-800 transition"
            />
            <span className="absolute left-4 top-4 text-xl opacity-50">🔍</span>
          </div>
        </div>

        {/* GRILLA DE CERVECERÍAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {cerveceriasFiltradas.map((cerveceria) => (
            /* 2. 👇 Usamos cerveceria.slug, y si no existe (raro), caemos en el ID viejo */
            <Link href={`/cervecerias/${cerveceria.slug || cerveceria.id}`} key={cerveceria.id}>
              <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 group h-full flex flex-col cursor-pointer relative overflow-hidden">
                {/* Etiqueta de cantidad de cervezas */}
                <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full border border-amber-200 shadow-sm z-10">
                  {cerveceria.cervezas?.length || 0} cervezas
                </div>

                {/* Logo circular */}
                <div className="w-24 h-24 mx-auto bg-stone-50 rounded-full border-2 border-gray-100 p-2 mb-4 flex items-center justify-center relative z-10 group-hover:border-amber-400 transition">
                  {cerveceria.image_url ? (
                    <img
                      src={cerveceria.image_url}
                      alt={cerveceria.nombre}
                      className="w-full h-full object-cover rounded-full group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <span className="text-4xl opacity-30">🍺</span>
                  )}
                </div>

                {/* Info */}
                <div className="text-center flex-grow relative z-10">
                  <h2 className="text-2xl font-extrabold text-stone-900 group-hover:text-amber-700 transition mb-1 line-clamp-1">
                    {cerveceria.nombre}
                  </h2>
                  <p className="text-sm font-bold text-gray-500 mb-3 flex items-center justify-center gap-1">
                    📍 {cerveceria.ciudad || "Ciudad desconocida"},{" "}
                    {cerveceria.pais}
                  </p>

                  {cerveceria.historia && (
                    <p className="text-sm text-stone-600 line-clamp-3 mt-4">
                      {cerveceria.historia}
                    </p>
                  )}
                </div>

                {/* Adorno visual de fondo al hacer hover */}
                <div className="absolute -bottom-10 -right-10 text-9xl opacity-0 group-hover:opacity-5 transform group-hover:-rotate-12 transition duration-500 pointer-events-none">
                  🏭
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ESTADO VACÍO */}
        {!cargando && cerveceriasFiltradas.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
            <span className="text-5xl opacity-50 mb-4 block">🏜️</span>
            <h3 className="text-xl font-bold text-stone-800">
              No encontramos ninguna cervecería
            </h3>
            <p className="text-gray-500 mt-2">
              Intentá con otra búsqueda o sumá una nueva fábrica desde el panel
              de admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}