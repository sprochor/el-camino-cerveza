"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // 1. Estadísticas
  const [stats, setStats] = useState({
    cervecerias: 0,
    cervezas: 0,
    estilos: 0,
    resenas: 0,
    notas: 0,
  });

  // 2. Listados para las tablas
  const [listas, setListas] = useState({
    cervecerias: [],
    cervezas: [],
    estilos: [], // 👈 Añadimos estilos al estado
    notas: [],
  });

  // 3. Pestaña activa de la tabla
  const [tabActiva, setTabActiva] = useState("cervezas");

  const fetchDashboardData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return router.push("/login");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single();
    if (!profile || (profile.role !== "admin" && profile.role !== "editor")) {
      return router.push("/");
    }

    // Buscamos estadísticas y registros
    const [
      { count: countCervs }, { count: countBeer }, { count: countEst }, { count: countRes }, { count: countNot },
      { data: dataCervecerias }, { data: dataCervezas }, { data: dataEstilos }, { data: dataNotas },
    ] = await Promise.all([
      supabase.from("cervecerias").select("*", { count: "exact", head: true }),
      supabase.from("cervezas").select("*", { count: "exact", head: true }),
      supabase.from("estilos").select("*", { count: "exact", head: true }),
      supabase.from("resenas").select("*", { count: "exact", head: true }),
      supabase.from("noticias").select("*", { count: "exact", head: true }),

      supabase.from("cervecerias").select("id, nombre, ciudad, created_at").order("created_at", { ascending: false }).limit(100),
      supabase.from("cervezas").select("id, nombre, estilos(nombre), cervecerias(nombre)").order("created_at", { ascending: false }).limit(100),
      supabase.from("estilos").select("id, nombre, familia, codigo_bjcp").order("codigo_bjcp", { ascending: true }).limit(100), // 👈 Traemos Estilos
      supabase.from("noticias").select("id, title, created_at").order("created_at", { ascending: false }).limit(100),
    ]);

    setStats({
      cervecerias: countCervs || 0, cervezas: countBeer || 0, estilos: countEst || 0, resenas: countRes || 0, notas: countNot || 0,
    });

    setListas({
      cervecerias: dataCervecerias || [], cervezas: dataCervezas || [], estilos: dataEstilos || [], notas: dataNotas || [],
    });

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  // --- FUNCIÓN PARA BORRAR REGISTROS ---
  const handleBorrar = async (tabla: string, id: string) => {
    const confirmar = window.confirm(`⚠️ ¿Estás súper seguro de que querés borrar esto de la tabla ${tabla}? Esta acción no se puede deshacer.`);
    if (!confirmar) return;

    try {
      const { error } = await supabase.from(tabla).delete().eq("id", id);
      if (error) throw error;
      alert("🗑️ Registro eliminado con éxito.");
      fetchDashboardData(); 
    } catch (error: any) {
      alert("Error al borrar: " + error.message);
    }
  };

  if (loading) return <div className="p-10 text-center text-xl font-bold text-gray-500 animate-pulse">Abriendo el panel de control... 🍺</div>;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 space-y-12">
      {/* CABECERA */}
      <div>
        <h1 className="text-4xl font-black text-stone-900 mb-2 tracking-tight">Tablero del Maestro Cervecero</h1>
        <p className="text-stone-500 text-lg">Administrá las fábricas, estilos, etiquetas y cultura de El Camino.</p>
      </div>

      {/* 1. ESTADÍSTICAS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* ... (Tu código de stats se mantiene intacto) ... */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <span className="text-4xl mb-2">🏭</span><span className="text-3xl font-extrabold text-stone-900">{stats.cervecerias}</span><span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Fábricas</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <span className="text-4xl mb-2">📋</span><span className="text-3xl font-extrabold text-stone-900">{stats.estilos}</span><span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Estilos</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-amber-200 flex flex-col items-center justify-center text-center hover:shadow-md transition relative">
          <span className="text-4xl mb-2">🍺</span><span className="text-3xl font-extrabold text-amber-700">{stats.cervezas}</span><span className="text-xs font-bold text-amber-600 uppercase tracking-widest mt-1">Cervezas</span>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition">
          <span className="text-4xl mb-2">⭐</span><span className="text-3xl font-extrabold text-stone-900">{stats.resenas}</span><span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Reseñas</span>
        </div>
        <div className="bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-800 flex flex-col items-center justify-center text-center hover:shadow-md transition relative">
          <span className="text-4xl mb-2">📰</span><span className="text-3xl font-extrabold text-white">{stats.notas}</span><span className="text-xs font-bold text-stone-400 uppercase tracking-widest mt-1">Notas</span>
        </div>
      </div>

      {/* 2. ACCIONES DE GESTIÓN */}
      <div>
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-2xl font-black text-stone-800 flex items-center gap-2">⚙️ Crear Contenido</h2>
          <Link href="/admin/vasos" className="text-amber-700 font-bold hover:underline">🍷 Gestionar Vasos →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col">
            <h2 className="text-lg font-bold text-stone-800 mb-2">🏭 Cervecerías</h2>
            <p className="text-gray-500 mb-6 flex-grow text-xs">Registrá las fábricas artesanales.</p>
            <Link href="/admin/nueva-cerveceria"><button className="bg-stone-100 text-stone-800 hover:bg-stone-200 px-4 py-3 rounded-xl w-full font-bold transition">+ Nueva Fábrica</button></Link>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col">
            <h2 className="text-lg font-bold text-stone-800 mb-2">📋 Estilos</h2>
            <p className="text-gray-500 mb-6 flex-grow text-xs">Creá las categorías (Ale, Lager...).</p>
            <Link href="/admin/nuevo-estilo"><button className="bg-stone-100 text-stone-800 hover:bg-stone-200 px-4 py-3 rounded-xl w-full font-bold transition">+ Nuevo Estilo</button></Link>
          </div>
          <div className="bg-amber-50 p-6 rounded-2xl shadow-sm border border-amber-200 hover:shadow-md transition flex flex-col">
            <h2 className="text-lg font-bold text-amber-900 mb-2">🍺 Cervezas</h2>
            <p className="text-amber-700/70 mb-6 flex-grow text-xs">Añadí etiquetas combinando fábrica y estilo.</p>
            <Link href="/admin/nueva-cerveza"><button className="bg-amber-500 text-stone-900 hover:bg-amber-400 px-4 py-3 rounded-xl w-full font-black shadow-sm transition">+ Cargar Cerveza</button></Link>
          </div>
          <div className="bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-800 hover:shadow-md transition flex flex-col">
            <h2 className="text-lg font-bold text-white mb-2">📰 Cultura</h2>
            <p className="text-stone-400 mb-6 flex-grow text-xs">Escribí artículos y novedades.</p>
            <Link href="/admin/nueva-nota"><button className="bg-stone-800 text-amber-400 hover:bg-stone-700 border border-stone-700 px-4 py-3 rounded-xl w-full font-bold transition">+ Escribir Nota</button></Link>
          </div>
        </div>
      </div>

      {/* 3. GESTOR DE TABLAS (Lectura y Borrado) */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Pestañas de Navegación */}
        <div className="flex border-b border-gray-200 bg-stone-50 px-4 pt-4 gap-2 overflow-x-auto">
          <button onClick={() => setTabActiva("cervezas")} className={`px-6 py-3 font-bold text-sm rounded-t-xl transition whitespace-nowrap ${tabActiva === "cervezas" ? "bg-white text-amber-700 border-t border-l border-r border-gray-200 shadow-[0_4px_0_0_white]" : "text-gray-500 hover:bg-gray-200"}`}>
            🍺 Etiquetas ({listas.cervezas.length})
          </button>
          <button onClick={() => setTabActiva("cervecerias")} className={`px-6 py-3 font-bold text-sm rounded-t-xl transition whitespace-nowrap ${tabActiva === "cervecerias" ? "bg-white text-stone-900 border-t border-l border-r border-gray-200 shadow-[0_4px_0_0_white]" : "text-gray-500 hover:bg-gray-200"}`}>
            🏭 Fábricas ({listas.cervecerias.length})
          </button>
          <button onClick={() => setTabActiva("estilos")} className={`px-6 py-3 font-bold text-sm rounded-t-xl transition whitespace-nowrap ${tabActiva === "estilos" ? "bg-white text-stone-900 border-t border-l border-r border-gray-200 shadow-[0_4px_0_0_white]" : "text-gray-500 hover:bg-gray-200"}`}>
            📋 Estilos ({listas.estilos.length})
          </button>
          <button onClick={() => setTabActiva("notas")} className={`px-6 py-3 font-bold text-sm rounded-t-xl transition whitespace-nowrap ${tabActiva === "notas" ? "bg-white text-stone-900 border-t border-l border-r border-gray-200 shadow-[0_4px_0_0_white]" : "text-gray-500 hover:bg-gray-200"}`}>
            📰 Notas ({listas.notas.length})
          </button>
        </div>

        {/* Contenido de la Tabla */}
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-white text-gray-400 uppercase text-xs font-bold border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Nombre / Título</th>
                <th className="px-6 py-4">Información Extra</th>
                <th className="px-6 py-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              
              {/* RENDER CERVEZAS */}
              {tabActiva === "cervezas" && listas.cervezas.map((item: any) => (
                <tr key={item.id} className="hover:bg-stone-50 transition">
                  <td className="px-6 py-4 font-bold text-stone-900">{item.nombre}</td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs font-bold text-gray-500">{item.estilos?.nombre || "Sin estilo"}</span>
                    <span className="ml-2 text-xs text-gray-400">🏭 {item.cervecerias?.nombre || "Sin fábrica"}</span>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/editar-cerveza/${item.id}`}><button className="text-amber-700 hover:text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition">Editar</button></Link>
                    <button onClick={() => handleBorrar("cervezas", item.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Borrar</button>
                  </td>
                </tr>
              ))}

              {/* RENDER CERVECERÍAS */}
              {tabActiva === "cervecerias" && listas.cervecerias.map((item: any) => (
                <tr key={item.id} className="hover:bg-stone-50 transition">
                  <td className="px-6 py-4 font-bold text-stone-900">{item.nombre}</td>
                  <td className="px-6 py-4 text-gray-500">📍 {item.ciudad}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/editar-cerveceria/${item.id}`}><button className="text-amber-700 hover:text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition">Editar</button></Link>
                    <button onClick={() => handleBorrar("cervecerias", item.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Borrar</button>
                  </td>
                </tr>
              ))}

              {/* RENDER ESTILOS */}
              {tabActiva === "estilos" && listas.estilos.map((item: any) => (
                <tr key={item.id} className="hover:bg-stone-50 transition">
                  <td className="px-6 py-4 font-bold text-stone-900">{item.nombre}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <span className="font-bold text-stone-700">{item.codigo_bjcp || "S/C"}</span> • {item.familia}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/editar-estilo/${item.id}`}><button className="text-amber-700 hover:text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition">Editar</button></Link>
                    <button onClick={() => handleBorrar("estilos", item.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Borrar</button>
                  </td>
                </tr>
              ))}

              {/* RENDER NOTAS */}
              {tabActiva === "notas" && listas.notas.map((item: any) => (
                <tr key={item.id} className="hover:bg-stone-50 transition">
                  <td className="px-6 py-4 font-bold text-stone-900">{item.title}</td>
                  <td className="px-6 py-4 text-gray-500">📅 {new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <Link href={`/admin/editar-nota/${item.id}`}><button className="text-amber-700 hover:text-amber-800 font-bold bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition">Editar</button></Link>
                    <button onClick={() => handleBorrar("noticias", item.id)} className="text-red-500 hover:text-red-700 font-bold bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">Borrar</button>
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

          {listas[tabActiva as keyof typeof listas].length === 0 && (
            <div className="text-center py-12 text-gray-400">No hay registros en esta sección.</div>
          )}
        </div>
      </div>
    </div>
  );
}