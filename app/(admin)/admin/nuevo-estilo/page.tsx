"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function NuevoEstiloAdmin() {
  // Estados del formulario (ahora con los campos BJCP)
  const [codigoBjcp, setCodigoBjcp] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [familia, setFamilia] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Estados de la UI
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    if (!nombre || !familia || !categoria) {
      setMensaje({ tipo: "error", texto: "El nombre, la categoría y la familia son obligatorios." });
      return;
    }

    setGuardando(true);

    // Generamos el "slug" automáticamente para las URLs amigables
    // Ej: "American IPA" -> "american-ipa"
    const slugGenerado = nombre
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Saca los tildes
      .replace(/[^a-z0-9]+/g, "-") // Reemplaza espacios y símbolos por guiones
      .replace(/(^-|-$)+/g, ""); // Saca guiones al principio o al final

    const { error } = await supabase.from("estilos").insert({
      codigo_bjcp: codigoBjcp,
      nombre,
      categoria,
      familia,
      slug: slugGenerado,
      descripcion,
    });

    if (error) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Hubo un error al guardar el estilo." });
    } else {
      setMensaje({ tipo: "exito", texto: "¡Estilo agregado correctamente al catálogo! 🍺" });
      // Limpiar formulario
      setCodigoBjcp(""); setNombre(""); setCategoria(""); setFamilia(""); setDescripcion("");
    }
    
    setGuardando(false);
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-stone-900">Agregar Estilo BJCP</h1>
            <p className="text-stone-500 mt-1">Definí los estilos cerveceros oficiales para el ranking.</p>
          </div>
          <Link href="/admin" className="text-amber-700 font-bold hover:underline bg-amber-50 px-4 py-2 rounded-xl text-center">
            Volver al Panel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
          
          {mensaje.texto && (
            <div className={`p-4 rounded-xl font-bold text-center ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
              {mensaje.texto}
            </div>
          )}

          {/* FILA 1: Código y Nombre */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-600 mb-2">Código BJCP</label>
              <input 
                type="text" 
                value={codigoBjcp} 
                onChange={(e) => setCodigoBjcp(e.target.value)} 
                placeholder="Ej: 21A" 
                className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition uppercase" 
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-600 mb-2">Nombre del Estilo *</label>
              <input 
                type="text" 
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)} 
                required 
                placeholder="Ej: American IPA, Dry Stout..." 
                className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" 
              />
            </div>
          </div>

          {/* FILA 2: Categoría y Familia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Categoría (Agrupación) *</label>
              <input 
                type="text" 
                value={categoria} 
                onChange={(e) => setCategoria(e.target.value)} 
                required 
                placeholder="Ej: IPA, Stout, Porter..." 
                className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Familia de Fermentación *</label>
              <select 
                value={familia} 
                onChange={(e) => setFamilia(e.target.value)} 
                required 
                className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition"
              >
                <option value="">Seleccionar familia...</option>
                <option value="Ale">Ale (Alta Fermentación)</option>
                <option value="Lager">Lager (Baja Fermentación)</option>
                <option value="Sour">Sour / Salvaje</option>
                <option value="Especialidad">Especialidad / Frutas / Especias</option>
              </select>
            </div>
          </div>

          {/* FILA 3: Descripción */}
          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-bold text-gray-600 mb-2">Descripción (Opcional pero recomendada)</label>
            <textarea 
              value={descripcion} 
              onChange={(e) => setDescripcion(e.target.value)} 
              rows={4} 
              placeholder="Explicación breve del estilo para educar al usuario (Ej: Cerveza intensamente lupulada...)" 
              className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition resize-none mb-6" 
            />
            
            <button 
              type="submit" 
              disabled={guardando} 
              className="w-full bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-4 rounded-xl transition shadow-md disabled:opacity-50"
            >
              {guardando ? "Guardando en el catálogo..." : "📋 Guardar Estilo"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}