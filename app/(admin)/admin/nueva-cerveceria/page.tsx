"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NuevaCerveceriaAdmin() {
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [pais, setPais] = useState("Argentina");
  const [historia, setHistoria] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);

  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // 👇 1. Agregamos la función creadora de Slugs 👇
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

    if (!nombre) {
      return setMensaje({ tipo: "error", texto: "El nombre de la cervecería es obligatorio." });
    }

    setGuardando(true);

    try {
      let urlFinalImagen = null;

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

      // 👇 2. Generamos el slug a partir del nombre 👇
      const slugGenerado = crearSlug(nombre);

      // 👇 3. Lo incluimos en el insert a Supabase 👇
      const { error: insertError } = await supabase.from("cervecerias").insert({
        nombre,
        slug: slugGenerado, // 👈 Se guarda el slug en la BD
        ciudad,
        pais,
        historia,
        image_url: urlFinalImagen,
      });

      if (insertError) throw insertError;

      setMensaje({ tipo: "exito", texto: "¡Cervecería agregada con éxito! 🏭" });
      setNombre(""); setCiudad(""); setPais("Argentina"); setHistoria(""); setImagenArchivo(null);

    } catch (error: any) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Hubo un error: " + error.message });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-stone-900">Agregar Cervecería</h1>
            <p className="text-stone-500 mt-1">Registrá una nueva fábrica para poder asociarle cervezas.</p>
          </div>
          <Link href="/admin" className="text-amber-700 font-bold hover:underline bg-amber-50 px-4 py-2 rounded-xl">
            Volver al Panel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
          
          {mensaje.texto && (
            <div className={`p-4 rounded-xl font-bold text-center ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>
              {mensaje.texto}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-600 mb-2">Nombre de la Cervecería *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder="Ej: Juguetes Perdidos..." className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Ciudad</label>
              <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Ej: Caseros..." className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">País</label>
              <input type="text" value={pais} onChange={(e) => setPais(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 mb-2">Breve Historia (Opcional)</label>
            <textarea value={historia} onChange={(e) => setHistoria(e.target.value)} rows={4} placeholder="¿Cómo nació esta cervecería?..." className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition resize-none" />
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-bold text-gray-600 mb-2">Logo de la Fábrica (Opcional)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-stone-50 transition cursor-pointer relative overflow-hidden bg-white mb-6">
              <input type="file" accept="image/*" onChange={(e) => setImagenArchivo(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              {imagenArchivo ? (
                <span className="text-green-600 font-bold">✅ {imagenArchivo.name}</span>
              ) : (
                <div className="text-stone-500 flex items-center justify-center gap-3">
                  <span className="text-2xl">📸</span>
                  <span className="font-medium text-sm">Hacé clic para subir el logo</span>
                </div>
              )}
            </div>
            
            <button type="submit" disabled={guardando} className="w-full bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-4 rounded-xl transition shadow-md disabled:opacity-50">
              {guardando ? "Guardando Fábrica..." : "🏭 Guardar Cervecería"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}