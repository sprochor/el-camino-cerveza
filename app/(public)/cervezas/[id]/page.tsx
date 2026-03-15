"use client";

import ReviewModal from "@/components/ReviewModal";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CervezaDetailPage() {
  const { id } = useParams();
  
  const [cerveza, setCerveza] = useState<any>(null);
  const [resenas, setResenas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  const [usuario, setUsuario] = useState<any>(null);
  const [yaReseno, setYaReseno] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCerveza = async () => {
      if (!id) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUsuario(session.user);

      const { data: cerv } = await supabase
        .from("cervezas")
        .select(`
          *,
          cervecerias (id, nombre, ciudad, pais),
          estilos (id, nombre, familia, categoria, descripcion, codigo_bjcp),
          vasos (id, nombre, imagen_url)
        `)
        .eq("id", id)
        .single();

      if (cerv) setCerveza(cerv);

      const { data: revs, error: errorRevs } = await supabase
        .from("resenas")
        .select("*, profiles(full_name, avatar_url)")
        .eq("cerveza_id", id)
        .order("created_at", { ascending: false });

      if (errorRevs) {
        const { data: revsSimples } = await supabase
          .from("resenas")
          .select("*")
          .eq("cerveza_id", id)
          .order("created_at", { ascending: false });

        if (revsSimples) {
          setResenas(revsSimples);
          if (session && revsSimples.some((r) => r.usuario_id === session.user.id)) setYaReseno(true);
        }
      } else if (revs) {
        setResenas(revs);
        if (session && revs.some((r) => r.usuario_id === session.user.id)) setYaReseno(true);
      }

      setCargando(false);
    };

    fetchCerveza();
  }, [id]);

  const renderStars = (promedio: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i <= Math.round(promedio) ? "text-amber-400" : "text-stone-600"}`}>★</span>
      );
    }
    return stars;
  };

  const promedioGeneral = resenas.length > 0
    ? (resenas.reduce((acc, curr) => acc + Number(curr.puntaje_general || curr.promedio_resena || 0), 0) / resenas.length).toFixed(1)
    : "S/P";

  const calcularPromedioCategoria = (categoria: string) => {
    if (resenas.length === 0) return 0;
    return resenas.reduce((acc, curr) => acc + Number(curr[categoria] || 0), 0) / resenas.length;
  };

  const vasoFinal = cerveza?.vasos || cerveza?.estilos?.vasos;

  if (cargando) return <div className="min-h-screen flex justify-center items-center bg-stone-50"><div className="text-amber-700 text-xl font-bold animate-pulse">Sirviendo pinta... 🍺</div></div>;
  if (!cerveza) return <div className="min-h-screen flex justify-center items-center bg-stone-50"><h1 className="text-2xl text-stone-800">Ups, se vació el barril.</h1></div>;

  return (
    <div className="bg-stone-50 min-h-screen pb-16 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link href="/cervezas" className="text-amber-700 font-bold hover:underline flex items-center gap-2 w-fit">
          ← Volver al Ranking
        </Link>

        {/* 1. HEADER */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden">
          
          <div className="w-48 h-64 md:w-64 md:h-80 bg-stone-100 rounded-2xl p-4 flex-shrink-0 flex items-center justify-center border border-gray-200">
            {cerveza.imagen_url ? (
              <img src={cerveza.imagen_url} alt={cerveza.nombre} className="h-full w-full object-contain" />
            ) : <span className="text-7xl opacity-30">🍺</span>}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4 mb-2">
              <div>
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                  <span className="bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full text-xs tracking-wide uppercase border border-amber-200">
                    {cerveza.estilos?.nombre || "Estilo Desconocido"}
                  </span>
                  {cerveza.estilos?.codigo_bjcp && (
                    <span className="bg-stone-800 text-amber-400 font-bold px-3 py-1 rounded-full text-xs tracking-wide uppercase">
                      BJCP {cerveza.estilos.codigo_bjcp}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 mt-2 mb-2 leading-tight">
                  {cerveza.nombre}
                </h1>
                <Link href={`/cervecerias/${cerveza.cerveceria_id || cerveza.cervecerias?.id}`} className="text-lg text-gray-500 font-medium hover:text-amber-700 transition flex items-center justify-center md:justify-start gap-2">
                  🏭 {cerveza.cervecerias?.nombre} <span className="text-sm">📍 {cerveza.cervecerias?.ciudad}</span>
                </Link>
              </div>

              {/* Puntaje General */}
              <div className="bg-stone-800 text-white rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] shadow-md transform rotate-2">
                <span className="text-3xl font-black text-amber-400">{promedioGeneral}</span>
                <span className="text-xs uppercase tracking-widest mt-1 opacity-80">General</span>
                <span className="text-[10px] mt-1 text-gray-400">{resenas.length} reseñas</span>
              </div>
            </div>

            {cerveza.premios && (
              <div className="mt-5 inline-flex items-start md:items-center gap-3 bg-gradient-to-r from-amber-100 to-amber-50 border border-amber-300 text-amber-900 px-4 py-3 rounded-xl shadow-sm text-sm font-bold w-full md:w-auto text-left">
                <span className="text-2xl leading-none">🏆</span> 
                <span>{cerveza.premios}</span>
              </div>
            )}

            <p className="text-stone-600 mt-6 leading-relaxed text-lg">
              {cerveza.descripcion_general}
            </p>
          </div>
        </div>

        {/* 2. RADIOGRAFÍA TÉCNICA Y VASO */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-stone-800 mb-6 flex items-center gap-2">📊 Radiografía Técnica</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-50 p-4 rounded-xl border border-gray-100 text-center">
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Alcohol (ABV)</span>
              <span className="text-2xl font-black text-stone-800">{cerveza.abv ? `${cerveza.abv}%` : "-"}</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-gray-100 text-center">
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Amargor (IBU)</span>
              <span className="text-2xl font-black text-stone-800">{cerveza.ibu || "-"}</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-gray-100 text-center">
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Color (SRM)</span>
              <span className="text-2xl font-black text-stone-800">{cerveza.srm || "-"}</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-gray-100 text-center">
              <span className="block text-gray-500 text-xs font-bold uppercase mb-1">Temp. Ideal</span>
              <span className="text-xl font-black text-stone-800">{cerveza.temperatura_ideal || "-"}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row gap-6 border-t border-gray-100 pt-6">
            <div className="flex-1 flex justify-between items-center text-sm bg-stone-50 p-4 rounded-xl border border-gray-100">
              <span className="text-gray-500 font-bold">Disponibilidad</span>
              <span className="text-stone-800 font-medium bg-white px-3 py-1 rounded shadow-sm">
                {cerveza.disponibilidad || "Todo el año"}
              </span>
            </div>

            {/* Vaso Recomendado Luminoso */}
            {vasoFinal && (
              <div className="flex-1 flex items-center gap-4 bg-amber-50 p-4 rounded-xl border border-amber-200 text-stone-900">
                <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center p-1 shrink-0">
                  {vasoFinal.imagen_url ? (
                    <img src={vasoFinal.imagen_url} alt={vasoFinal.nombre} className="h-full object-contain" />
                  ) : (
                    <span className="text-xl">🍺</span>
                  )}
                </div>
                <div>
                  <span className="block text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                    Idealmente servir en
                  </span>
                  <span className="text-base font-black text-stone-900">
                    {vasoFinal.nombre}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. NOTAS DE CATA E HISTORIA */}
        {(cerveza.notas_cata || cerveza.historia_cerveza || cerveza.estilos?.descripcion) && (
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-8">
            {cerveza.notas_cata && (
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">👅 Notas de Cata</h3>
                <p className="text-stone-600 leading-relaxed bg-stone-50 p-5 rounded-xl border-l-4 border-amber-500 text-lg">
                  {cerveza.notas_cata}
                </p>
              </div>
            )}

            {cerveza.historia_cerveza && (
              <div>
                <h3 className="text-xl font-bold text-stone-800 mb-3 flex items-center gap-2">📜 La Historia</h3>
                <p className="text-stone-600 leading-relaxed text-lg">{cerveza.historia_cerveza}</p>
              </div>
            )}

            {cerveza.estilos?.descripcion && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  📖 Sobre el estilo {cerveza.estilos.nombre}
                </h3>
                <p className="text-stone-500 italic text-sm">{cerveza.estilos.descripcion}</p>
              </div>
            )}
          </div>
        )}

        {/* 4. PIZARRÓN DE COMUNIDAD */}
        <div className="bg-stone-800 rounded-3xl p-6 md:p-10 shadow-sm text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-2">⭐ Veredicto del Público</h3>
            
            {!usuario ? (
              <Link href="/login" className="bg-stone-700 hover:bg-stone-600 text-white font-bold px-4 py-2 rounded-xl transition text-sm">
                Iniciar sesión para opinar
              </Link>
            ) : yaReseno ? (
              <div className="bg-green-500/20 text-green-400 font-bold px-4 py-2 rounded-xl border border-green-500/30 flex items-center gap-2">
                🏆 ¡Ya dejaste tu veredicto!
              </div>
            ) : (
              <button onClick={() => setIsModalOpen(true)} className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-black px-6 py-2 rounded-xl transition shadow-md w-full sm:w-auto">
                Dejar mi reseña
              </button>
            )}
          </div>

          {resenas.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex justify-between items-center border-b border-stone-700 pb-2">
                <span className="font-medium text-stone-300">Aroma</span>
                <div className="flex gap-1">{renderStars(calcularPromedioCategoria("puntos_aroma"))}</div>
              </div>
              <div className="flex justify-between items-center border-b border-stone-700 pb-2">
                <span className="font-medium text-stone-300">Sabor</span>
                <div className="flex gap-1">{renderStars(calcularPromedioCategoria("puntos_sabor"))}</div>
              </div>
              <div className="flex justify-between items-center border-b border-stone-700 pb-2">
                <span className="font-medium text-stone-300">Cuerpo</span>
                <div className="flex gap-1">{renderStars(calcularPromedioCategoria("puntos_cuerpo"))}</div>
              </div>
              <div className="flex justify-between items-center border-b border-stone-700 pb-2">
                <span className="font-medium text-stone-300">Apariencia</span>
                <div className="flex gap-1">{renderStars(calcularPromedioCategoria("puntos_apariencia"))}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-stone-700/50 rounded-2xl border border-stone-600 border-dashed">
              <p className="text-stone-300 mb-2">Todavía nadie puntuó esta cerveza.</p>
              <p className="text-amber-400 font-bold">¡Sé el primero en destaparla!</p>
            </div>
          )}
        </div>

        {/* 5. COMENTARIOS INDIVIDUALES */}
        {resenas.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-2xl font-black text-stone-800 mb-6">Comentarios de la comunidad</h3>
            {resenas.map((resena) => (
              <div key={resena.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-xl shrink-0 overflow-hidden border border-gray-200">
                  {resena.profiles?.avatar_url ? <img src={resena.profiles.avatar_url} alt="Avatar" className="w-full h-full object-cover" /> : "👤"}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-stone-900">{resena.profiles?.full_name || "Usuario Cervecero"}</span>
                    <span className="text-xs font-bold text-stone-400 bg-stone-50 px-2 py-1 rounded-md">
                      {new Date(resena.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-amber-400 text-sm drop-shadow-sm">
                      {'★'.repeat(Math.round(resena.puntaje_general || resena.promedio_resena || 5))}
                      {'☆'.repeat(5 - Math.round(resena.puntaje_general || resena.promedio_resena || 5))}
                    </div>
                    <span className="font-black text-stone-800 text-sm ml-1">
                      {Number(resena.puntaje_general || resena.promedio_resena || 5).toFixed(1)}
                    </span>
                  </div>
                  {resena.comentario_opcional && (
                    <p className="text-stone-600 text-base leading-relaxed bg-stone-50 p-4 rounded-xl">
                      "{resena.comentario_opcional}"
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} cervezaId={id as string} />
    </div>
  );
}