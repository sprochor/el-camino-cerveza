"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NuevaCervezaAdmin() {
  const [cervecerias, setCervecerias] = useState<any[]>([]);
  const [estilos, setEstilos] = useState<any[]>([]);
  const [vasos, setVasos] = useState<any[]>([]); 
  const [cargandoDatos, setCargandoDatos] = useState(true);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [cerveceriaId, setCerveceriaId] = useState("");
  const [estiloId, setEstiloId] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("Todo el año");
  const [abv, setAbv] = useState("");
  const [ibu, setIbu] = useState("");
  const [srm, setSrm] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [vasoId, setVasoId] = useState(""); 
  const [descripcion, setDescripcion] = useState("");
  const [notasCata, setNotasCata] = useState("");
  const [historia, setHistoria] = useState("");
  const [premios, setPremios] = useState(""); // 👈 NUEVO: Estado de Premios
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);

  // Estados de la UI
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const fetchSelects = async () => {
      const { data: cervs } = await supabase.from("cervecerias").select("id, nombre").order("nombre");
      const { data: ests } = await supabase.from("estilos").select("id, nombre, familia").order("nombre");
      const { data: vs } = await supabase.from("vasos").select("id, nombre").order("nombre"); 
      
      if (cervs) setCervecerias(cervs);
      if (ests) setEstilos(ests);
      if (vs) setVasos(vs);
      
      setCargandoDatos(false);
    };
    fetchSelects();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    if (!nombre || !cerveceriaId || !estiloId) {
      setMensaje({ tipo: "error", texto: "El nombre, la cervecería y el estilo son obligatorios." });
      return;
    }

    setGuardando(true);

    try {
      let urlFinalImagen = null;

      if (imagenArchivo) {
        const fileExt = imagenArchivo.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`; 

        const { error: uploadError } = await supabase.storage
          .from("cervezas")
          .upload(filePath, imagenArchivo);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("cervezas").getPublicUrl(filePath);
        urlFinalImagen = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("cervezas").insert({
        nombre,
        cerveceria_id: cerveceriaId,
        estilo_id: estiloId,
        vaso_id: vasoId || null,
        disponibilidad,
        abv: abv ? parseFloat(abv) : null,
        ibu: ibu ? parseInt(ibu) : null,
        srm: srm ? parseInt(srm) : null,
        temperatura_ideal: temperatura,
        descripcion_general: descripcion,
        notas_cata: notasCata,
        historia_cerveza: historia,
        premios, // 👈 Se guarda el premio en la BD
        imagen_url: urlFinalImagen,
      });

      if (insertError) throw insertError;

      setMensaje({ tipo: "exito", texto: "¡Cerveza agregada al barril con éxito! 🍻" });
      
      setNombre(""); setCerveceriaId(""); setEstiloId(""); setDisponibilidad("Todo el año");
      setAbv(""); setIbu(""); setSrm(""); setTemperatura(""); setVasoId("");
      setDescripcion(""); setNotasCata(""); setHistoria(""); setPremios(""); setImagenArchivo(null);
      
    } catch (error: any) {
      console.error("Error al guardar:", error);
      setMensaje({ tipo: "error", texto: "Hubo un error: " + error.message });
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoDatos) {
    return <div className="p-10 text-center font-bold text-stone-500 animate-pulse">Cargando catálogo... 🍻</div>;
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-stone-900">Agregar Nueva Cerveza</h1>
            <p className="text-stone-500 mt-1">Completá la ficha técnica para sumar una nueva etiqueta al ranking.</p>
          </div>
          <Link href="/admin" className="text-amber-700 font-bold hover:underline bg-amber-50 px-4 py-2 rounded-xl text-center">
            Volver al Panel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-8">
          
          {mensaje.texto && (
            <div className={`p-4 rounded-xl font-bold text-center ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {mensaje.texto}
            </div>
          )}

          {/* INFO PRINCIPAL */}
          <div>
            <h3 className="text-lg font-bold text-stone-800 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              🍺 Información Principal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-bold text-gray-600 mb-2">Nombre de la Cerveza *</label>
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej: Upside Down Stout..." className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Cervecería *</label>
                <select value={cerveceriaId} onChange={(e) => setCerveceriaId(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="">Seleccionar...</option>
                  {cervecerias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Estilo *</label>
                <select value={estiloId} onChange={(e) => setEstiloId(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="">Seleccionar...</option>
                  {estilos.map(e => <option key={e.id} value={e.id}>{e.nombre} ({e.familia})</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* RADIOGRAFÍA TÉCNICA Y SERVICIO */}
          <div>
            <h3 className="text-lg font-bold text-stone-800 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              🔬 Radiografía Técnica y Servicio
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">ABV (%)</label>
                <input type="number" step="0.1" value={abv} onChange={(e) => setAbv(e.target.value)} placeholder="Ej: 5.5" className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">IBU</label>
                <input type="number" value={ibu} onChange={(e) => setIbu(e.target.value)} placeholder="Ej: 40" className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">Color (SRM)</label>
                <input type="number" value={srm} onChange={(e) => setSrm(e.target.value)} placeholder="Ej: 6" className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">Temp. Ideal</label>
                <input type="text" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} placeholder="Ej: 4°C - 7°C" className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">Vaso Especial</label>
                <select value={vasoId} onChange={(e) => setVasoId(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none">
                  <option value="">Usar del estilo...</option>
                  {vasos.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                </select>
              </div>

              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">Disponibilidad</label>
                <select value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-bold text-amber-700">
                  <option value="Todo el año">Todo el año</option>
                  <option value="Estacional">Estacional</option>
                  <option value="Edición Limitada">Edición Limitada</option>
                </select>
              </div>
            </div>
          </div>

          {/* TEXTOS, PREMIOS Y LORE */}
          <div>
            <h3 className="text-lg font-bold text-stone-800 border-b border-gray-100 pb-2 mb-4 flex items-center gap-2">
              📜 Descripciones, Premios y Lore
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Premios (Opcional)</label>
                <input type="text" value={premios} onChange={(e) => setPremios(e.target.value)} placeholder="Ej: Medalla de Oro - Copa Cervezas de América 2025" className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium text-amber-900" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Descripción General</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Notas de Cata</label>
                <textarea value={notasCata} onChange={(e) => setNotasCata(e.target.value)} rows={2} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Historia de la Cerveza (Opcional)</label>
                <textarea value={historia} onChange={(e) => setHistoria(e.target.value)} rows={2} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none" />
              </div>
            </div>
          </div>

          {/* IMAGEN Y BOTÓN */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t border-gray-100 pt-6">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-bold text-gray-600 mb-2">Foto de la Cerveza (Lata/Pinta)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-stone-50 transition cursor-pointer relative overflow-hidden bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImagenArchivo(e.target.files ? e.target.files[0] : null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imagenArchivo ? (
                  <span className="text-green-600 font-bold flex items-center justify-center gap-2 text-sm truncate px-2">
                    ✅ {imagenArchivo.name}
                  </span>
                ) : (
                  <div className="text-stone-500 flex items-center justify-center gap-3">
                    <span className="text-2xl">📸</span>
                    <span className="font-medium text-sm">Hacé clic para subir foto</span>
                  </div>
                )}
              </div>
            </div>
            
            <button type="submit" disabled={guardando} className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-10 py-4 rounded-xl transition shadow-md disabled:opacity-50">
              {guardando ? "Acondicionando el barril..." : "💾 Guardar Cerveza"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}