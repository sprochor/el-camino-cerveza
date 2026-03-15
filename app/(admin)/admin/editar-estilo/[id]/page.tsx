"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditarEstiloAdmin() {
  const { id } = useParams();
  const router = useRouter();

  const [codigoBjcp, setCodigoBjcp] = useState("");
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [familia, setFamilia] = useState("");
  const [descripcion, setDescripcion] = useState("");

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const fetchEstilo = async () => {
      const { data, error } = await supabase.from("estilos").select("*").eq("id", id).single();
      
      if (data) {
        setCodigoBjcp(data.codigo_bjcp || "");
        setNombre(data.nombre || "");
        setCategoria(data.categoria || "");
        setFamilia(data.familia || "");
        setDescripcion(data.descripcion || "");
      } else {
        setMensaje({ tipo: "error", texto: "No se encontró el estilo." });
      }
      setCargando(false);
    };
    fetchEstilo();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });
    setGuardando(true);

    const slugGenerado = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const { error } = await supabase.from("estilos").update({
      codigo_bjcp: codigoBjcp,
      nombre,
      categoria,
      familia,
      slug: slugGenerado,
      descripcion,
    }).eq("id", id);

    if (error) {
      setMensaje({ tipo: "error", texto: "Error al actualizar: " + error.message });
    } else {
      setMensaje({ tipo: "exito", texto: "¡Estilo actualizado! Volviendo al panel..." });
      setTimeout(() => router.push("/admin"), 1500);
    }
    setGuardando(false);
  };

  if (cargando) return <div className="p-10 text-center font-bold text-stone-500 animate-pulse">Buscando pergaminos... 📜</div>;

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-stone-900">✏️ Editar Estilo</h1>
          <Link href="/admin" className="text-amber-700 font-bold hover:underline bg-amber-50 px-4 py-2 rounded-xl">Volver al Panel</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200 space-y-6">
          {mensaje.texto && <div className={`p-4 rounded-xl font-bold text-center ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>{mensaje.texto}</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-bold text-gray-600 mb-2">Código BJCP</label>
              <input type="text" value={codigoBjcp} onChange={(e) => setCodigoBjcp(e.target.value)} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl outline-none uppercase" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-600 mb-2">Nombre del Estilo *</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Categoría *</label>
              <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Familia *</label>
              <select value={familia} onChange={(e) => setFamilia(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl outline-none">
                <option value="Ale">Ale (Alta Fermentación)</option>
                <option value="Lager">Lager (Baja Fermentación)</option>
                <option value="Sour">Sour / Salvaje</option>
                <option value="Especialidad">Especialidad / Frutas</option>
              </select>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <label className="block text-sm font-bold text-gray-600 mb-2">Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={4} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl outline-none mb-6 resize-none" />
            <button type="submit" disabled={guardando} className="w-full bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold py-4 rounded-xl transition shadow-md disabled:opacity-50">
              {guardando ? "Actualizando..." : "💾 Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}