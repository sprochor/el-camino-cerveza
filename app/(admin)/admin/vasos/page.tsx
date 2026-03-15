"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function GestionVasosAdmin() {
  const [vasos, setVasos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados del Formulario
  const [nombre, setNombre] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Cargar vasos existentes
  const fetchVasos = async () => {
    setCargando(true);
    const { data } = await supabase.from("vasos").select("*").order("nombre");
    if (data) setVasos(data);
    setCargando(false);
  };

  useEffect(() => {
    fetchVasos();
  }, []);

  // Función para guardar un nuevo vaso
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });

    if (!nombre) {
      return setMensaje({
        tipo: "error",
        texto: "El nombre del vaso es obligatorio.",
      });
    }

    setGuardando(true);

    try {
      let urlFinalImagen = null;

      if (imagenArchivo) {
        const fileExt = imagenArchivo.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("vasos")
          .upload(filePath, imagenArchivo);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("vasos").getPublicUrl(filePath);
        urlFinalImagen = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("vasos").insert({
        nombre,
        imagen_url: urlFinalImagen,
      });

      if (insertError) throw insertError;

      setMensaje({
        tipo: "exito",
        texto: "¡Vaso agregado a la cristalería! 🍻",
      });
      setNombre("");
      setImagenArchivo(null);
      fetchVasos(); // Recargamos la lista
    } catch (error: any) {
      console.error(error);
      setMensaje({ tipo: "error", texto: "Hubo un error: " + error.message });
    } finally {
      setGuardando(false);
    }
  };

  // Función para borrar un vaso
  const handleBorrar = async (id: string, nombreVaso: string) => {
    const confirmar = window.confirm(
      `⚠️ ¿Seguro que querés romper el vaso "${nombreVaso}"?`,
    );
    if (!confirmar) return;

    try {
      const { error } = await supabase.from("vasos").delete().eq("id", id);
      if (error) throw error;
      fetchVasos();
    } catch (error: any) {
      alert("Error al borrar: " + error.message);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* CABECERA */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-stone-900">
              Cristalería (Vasos)
            </h1>
            <p className="text-stone-500 mt-1">
              Gestioná los íconos y copas recomendadas para cada estilo.
            </p>
          </div>
          <Link
            href="/admin"
            className="text-amber-700 font-bold hover:underline bg-amber-50 px-4 py-2 rounded-xl text-center"
          >
            Volver al Panel
          </Link>
        </div>

        {/* FORMULARIO DE NUEVO VASO */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-bold text-stone-800 border-b border-gray-100 pb-2 mb-6">
            ➕ Agregar Nuevo Vaso
          </h2>

          {mensaje.texto && (
            <div
              className={`p-4 rounded-xl font-bold text-center mb-6 ${mensaje.tipo === "error" ? "bg-red-50 text-red-800" : "bg-green-50 text-green-800"}`}
            >
              {mensaje.texto}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                Nombre del Vaso (Ej: Pinta Nonick)
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">
                Ícono / Imagen (PNG sin fondo ideal)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-3 text-center hover:bg-stone-50 transition cursor-pointer relative overflow-hidden bg-white">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setImagenArchivo(e.target.files ? e.target.files[0] : null)
                  }
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {imagenArchivo ? (
                  <span className="text-green-600 font-bold text-sm truncate px-2">
                    ✅ {imagenArchivo.name}
                  </span>
                ) : (
                  <span className="text-stone-500 font-medium text-sm">
                    📸 Clic para subir foto
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={guardando}
              className="bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold px-8 py-3 rounded-xl transition shadow-md disabled:opacity-50"
            >
              {guardando ? "Guardando..." : "💾 Guardar Vaso"}
            </button>
          </div>
        </form>

        {/* GALERÍA DE VASOS EXISTENTES */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-stone-800 border-b border-gray-100 pb-2 mb-6">
            🍻 Vasos Disponibles ({vasos.length})
          </h2>

          {cargando ? (
            <div className="text-center py-10 text-stone-500 font-bold animate-pulse">
              Cargando cristalería...
            </div>
          ) : vasos.length === 0 ? (
            <div className="text-center py-10 text-stone-400">
              Todavía no cargaste ningún vaso.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {vasos.map((vaso) => (
                <div
                  key={vaso.id}
                  className="bg-stone-50 p-4 rounded-2xl border border-stone-100 flex flex-col items-center text-center relative group"
                >
                  <div className="w-20 h-20 bg-white rounded-xl shadow-sm mb-3 flex items-center justify-center overflow-hidden p-2">
                    {vaso.imagen_url ? (
                      <img
                        src={vaso.imagen_url}
                        alt={vaso.nombre}
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-4xl opacity-20">🍺</span>
                    )}
                  </div>
                  <span className="font-bold text-stone-800 text-sm leading-tight">
                    {vaso.nombre}
                  </span>

                  {/* Botón borrar que aparece al pasar el mouse */}
                  <Link
                    href={`/admin/editar-vaso/${vaso.id}`}
                    className="bg-amber-100 text-amber-700 w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-amber-500 hover:text-white shadow-sm"
                  >
                    ✏️
                  </Link>
                  <button
                    onClick={() => handleBorrar(vaso.id, vaso.nombre)}
                    className="bg-red-100 text-red-600 w-8 h-8 rounded-full flex items-center justify-center font-bold hover:bg-red-500 hover:text-white shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
