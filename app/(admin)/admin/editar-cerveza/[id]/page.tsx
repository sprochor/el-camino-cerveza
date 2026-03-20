"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const OPCIONES_PRESENTACIONES = ["Lata", "Botella", "Barril", "Growler"];
const OPCIONES_TAMANOS = ["354ml", "473ml", "500ml", "710ml", "Pinta", "Media Pinta", "Litro"];

export default function EditarCervezaAdmin() {
  const { id } = useParams();
  const router = useRouter();

  // Estados para los desplegables dinámicos
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
  const [premios, setPremios] = useState("");
  const [presentaciones, setPresentaciones] = useState<string[]>([]); // 👈
  const [tamanos, setTamanos] = useState<string[]>([]); // 👈
  
  // Imagen existente vs Imagen Nueva
  const [imagenActualUrl, setImagenActualUrl] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);

  // Estados de la UI
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Cargar datos al abrir la página
  useEffect(() => {
    const fetchDatos = async () => {
      if (!id) return;

      // 1. Traer catálogos para los selectores
      const { data: cervs } = await supabase.from("cervecerias").select("id, nombre").order("nombre");
      const { data: ests } = await supabase.from("estilos").select("id, nombre, familia").order("nombre");
      const { data: vs } = await supabase.from("vasos").select("id, nombre").order("nombre"); 
      
      if (cervs) setCervecerias(cervs);
      if (ests) setEstilos(ests);
      if (vs) setVasos(vs);

      // 2. Traer los datos actuales de la cerveza a editar
      const { data: cervezaActual, error } = await supabase
        .from("cervezas")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setMensaje({ tipo: "error", texto: "No se encontró la cerveza." });
      } else if (cervezaActual) {
        setNombre(cervezaActual.nombre || "");
        setCerveceriaId(cervezaActual.cerveceria_id || "");
        setEstiloId(cervezaActual.estilo_id || "");
        setDisponibilidad(cervezaActual.disponibilidad || "Todo el año");
        setAbv(cervezaActual.abv?.toString() || "");
        setIbu(cervezaActual.ibu?.toString() || "");
        setSrm(cervezaActual.srm?.toString() || "");
        setTemperatura(cervezaActual.temperatura_ideal || "");
        setVasoId(cervezaActual.vaso_id || "");
        setDescripcion(cervezaActual.descripcion_general || "");
        setNotasCata(cervezaActual.notas_cata || "");
        setHistoria(cervezaActual.historia_cerveza || "");
        setPremios(cervezaActual.premios || "");
        setPresentaciones(cervezaActual.presentaciones || []); // 👈
        setTamanos(cervezaActual.tamanos || []);               // 👈
        setImagenActualUrl(cervezaActual.imagen_url || "");
      }
      
      setCargandoDatos(false);
    };

    fetchDatos();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    if (!nombre || !cerveceriaId || !estiloId) {
      setMensaje({ tipo: "error", texto: "El nombre, la cervecería y el estilo son obligatorios." });
      return;
    }

    setGuardando(true);

    try {
      let urlFinalImagen = imagenActualUrl; // Por defecto mantenemos la vieja

      // Si el usuario seleccionó una foto nueva, la subimos
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

      // 3. Actualizar la cerveza en la base de datos (Usamos UPDATE en vez de INSERT)
      const { error: updateError } = await supabase
        .from("cervezas")
        .update({
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
          premios,
          presentaciones, // 👈
          tamanos,        // 👈
          imagen_url: urlFinalImagen,
        })
        .eq("id", id); // ¡CRUCIAL PARA NO PISAR TODA LA BASE DE DATOS!

      if (updateError) throw updateError;

      setMensaje({ tipo: "exito", texto: "¡Cerveza actualizada con éxito! 🍻 Volviendo al panel..." });
      
      // Redirigimos al panel de admin después de 2 segundos
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error al guardar:", error);
      setMensaje({ tipo: "error", texto: "Hubo un error: " + error.message });
    } finally {
      setGuardando(false);
    }
  };

  if (cargandoDatos) {
    return <div className="p-10 text-center font-bold text-stone-500 animate-pulse">Buscando receta en los archivos... 🍻</div>;
  }

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-stone-900">✏️ Editar Cerveza</h1>
            <p className="text-stone-500 mt-1">Modificá la ficha técnica de esta etiqueta.</p>
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
                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
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
                <input type="number" step="0.1" value={abv} onChange={(e) => setAbv(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">IBU</label>
                <input type="number" value={ibu} onChange={(e) => setIbu(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">Color (SRM)</label>
                <input type="number" value={srm} onChange={(e) => setSrm(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-bold text-gray-600 mb-2">Temp. Ideal</label>
                <input type="text" value={temperatura} onChange={(e) => setTemperatura(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
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
              {/* 👇 NUEVOS BOTONES DE PRESENTACIÓN Y TAMAÑO 👇 */}
              <div className="col-span-2 md:col-span-3">
                <label className="block text-sm font-bold text-gray-600 mb-2">Formatos (Click para seleccionar varios)</label>
                <div className="flex flex-wrap gap-2">
                  {OPCIONES_PRESENTACIONES.map(p => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => setPresentaciones(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])}
                      className={`px-3 py-1 rounded-xl text-sm font-bold transition-all border ${presentaciones.includes(p) ? 'bg-amber-500 text-stone-900 border-amber-600 shadow-inner' : 'bg-white text-stone-500 border-gray-300 hover:bg-stone-100'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="col-span-2 md:col-span-3">
                <label className="block text-sm font-bold text-gray-600 mb-2">Tamaños / Volúmenes</label>
                <div className="flex flex-wrap gap-2">
                  {OPCIONES_TAMANOS.map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTamanos(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])}
                      className={`px-3 py-1 rounded-xl text-sm font-bold transition-all border ${tamanos.includes(t) ? 'bg-amber-500 text-stone-900 border-amber-600 shadow-inner' : 'bg-white text-stone-500 border-gray-300 hover:bg-stone-100'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              {/* 👆 FIN NUEVOS BOTONES 👆 */}
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
                <input type="text" value={premios} onChange={(e) => setPremios(e.target.value)} placeholder="Ej: Medalla de Oro..." className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none font-medium text-amber-900" />
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
              <label className="block text-sm font-bold text-gray-600 mb-2">Foto de la Cerveza (Subí una para reemplazar)</label>
              
              <div className="flex items-center gap-4">
                {imagenActualUrl && !imagenArchivo && (
                  <div className="w-16 h-16 bg-stone-50 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center p-1 shrink-0">
                    <img src={imagenActualUrl} alt="Actual" className="h-full object-contain" />
                  </div>
                )}
                
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-stone-50 transition cursor-pointer relative overflow-hidden bg-white">
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
                      <span className="font-medium text-sm">Elegir nueva foto</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <button type="submit" disabled={guardando} className="w-full md:w-auto bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-10 py-4 rounded-xl transition shadow-md disabled:opacity-50">
              {guardando ? "Acondicionando el barril..." : "💾 Actualizar Cerveza"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}