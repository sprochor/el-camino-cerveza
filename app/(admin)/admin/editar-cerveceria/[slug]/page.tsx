"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditarCerveceriaAdmin() {
  const { slug } = useParams(); // 👈 1. Ahora atrapamos el slug
  const router = useRouter();

  const [cerveceriaId, setCerveceriaId] = useState(""); // 👈 2. Guardamos el ID real en secreto para actualizar después
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState("Argentina");
  const [historia, setHistoria] = useState("");
  
  const [imagenActualUrl, setImagenActualUrl] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const fetchCerveceria = async () => {
      if (!slug) return;

      // Intentamos buscar por SLUG
      let { data, error } = await supabase.from("cervecerias").select("*").eq("slug", slug).single();
      
      // Sistema de rescate: verificamos si la URL era un ID viejo
      if (error) {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug as string);
        if (isUUID) {
          const fallback = await supabase.from("cervecerias").select("*").eq("id", slug).single();
          if (fallback.data) data = fallback.data;
        }
      }

      if (data) {
        setCerveceriaId(data.id); // Guardamos el ID real oculto
        setNombre(data.nombre || "");
        setCiudad(data.ciudad || "");
        setPais(data.pais || "Argentina");
        setHistoria(data.historia || "");
        setImagenActualUrl(data.image_url || "");
      } else {
        setMensaje({ tipo: "error", texto: "No se encontró la fábrica." });
      }
      setCargando(false);
    };
    fetchCerveceria();
  }, [slug]);

  // 👇 3. Función para generar el slug actualizado 👇
  const crearSlug = (texto: string) => {
    return texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    if (!nombre || !ciudad) {
      return setMensaje({ tipo: "error", texto: "El nombre y la ciudad son obligatorios." });
    }

    setGuardando(true);

    try {
      let urlFinalImagen = imagenActualUrl;

      // Subir nueva imagen si la hay
      if (imagenArchivo) {
        const fileExt = imagenArchivo.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("cervecerias")
          .upload(fileName, imagenArchivo);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("cervecerias").getPublicUrl(fileName);
        urlFinalImagen = data.publicUrl;
      }

      // Generamos el slug por si el nombre cambió
      const slugActualizado = crearSlug(nombre);

      // Actualizamos en la base de datos usando el ID REAL que teníamos oculto
      const { error } = await supabase.from("cervecerias").update({
        nombre,
        slug: slugActualizado, // 👈 Guardamos el slug
        ciudad,
        pais,
        historia,
        image_url: urlFinalImagen,
      }).eq("id", cerveceriaId); // 👈 Buscamos por el ID verdadero, no por el slug

      if (error) throw error;

      setMensaje({ tipo: "exito", texto: "¡Fábrica actualizada! Volviendo al panel..." });
      setTimeout(() => router.push("/admin"), 1500);

    } catch (error: any) {
      setMensaje({ tipo: "error", texto: "Error: " + error.message });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="p-10 text-center font-bold text-stone-500 animate-pulse">Viajando a la fábrica... 🏭</div>;

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-stone-900">✏️ Editar Fábrica</h1>
            <p className="text-stone-500 mt-1">Actualizá los datos y el logo de esta cervecería.</p>
          </div>
          <Link href="/admin" className="text-amber-700 font-bold hover:underline bg-amber-50 px-4 py-2 rounded-xl">Volver al Panel</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
          {mensaje.texto && <div className={`p-4 rounded-xl font-bold text-center ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>{mensaje.texto}</div>}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Nombre de la Cervecería *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">Ciudad *</label>
                <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">País</label>
                <input type="text" value={pais} onChange={(e) => setPais(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none" />
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-sm font-bold text-gray-600 mb-2">Descripción o Historia (Opcional)</label>
              <textarea value={historia} onChange={(e) => setHistoria(e.target.value)} rows={4} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none mb-4" />
            </div>

            <div className="border-t border-gray-100 pt-6">
              <label className="block text-sm font-bold text-gray-600 mb-2">Logo de la Fábrica (Subí uno nuevo para reemplazar)</label>
              <div className="flex items-center gap-4 mb-6">
                {imagenActualUrl && !imagenArchivo && (
                  <div className="w-16 h-16 bg-stone-100 rounded-xl border border-gray-200 flex items-center justify-center p-2 shrink-0">
                    <img src={imagenActualUrl} alt="Logo actual" className="h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer relative bg-white">
                  <input type="file" accept="image/*" onChange={(e) => setImagenArchivo(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {imagenArchivo ? <span className="text-green-600 font-bold">✅ {imagenArchivo.name}</span> : <span className="text-stone-500 font-medium text-sm">📸 Elegir nueva foto</span>}
                </div>
              </div>

              <button type="submit" disabled={guardando} className="w-full bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-4 rounded-xl transition shadow-md disabled:opacity-50">
                {guardando ? "Ajustando los barriles..." : "💾 Guardar Cambios"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}