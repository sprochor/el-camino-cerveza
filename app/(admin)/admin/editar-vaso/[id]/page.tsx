"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function EditarVasoAdmin() {
  const { id } = useParams();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [imagenActualUrl, setImagenActualUrl] = useState("");
  const [imagenArchivo, setImagenArchivo] = useState<File | null>(null);

  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const fetchVaso = async () => {
      const { data } = await supabase.from("vasos").select("*").eq("id", id).single();
      if (data) {
        setNombre(data.nombre || "");
        setImagenActualUrl(data.imagen_url || "");
      }
      setCargando(false);
    };
    fetchVaso();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje({ tipo: "", texto: "" });
    setGuardando(true);

    try {
      let urlFinalImagen = imagenActualUrl;

      if (imagenArchivo) {
        const fileExt = imagenArchivo.name.split(".").pop();
        const filePath = `${Date.now()}.${fileExt}`; 

        const { error: uploadError } = await supabase.storage.from("vasos").upload(filePath, imagenArchivo);
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("vasos").getPublicUrl(filePath);
        urlFinalImagen = data.publicUrl;
      }

      const { error } = await supabase.from("vasos").update({ nombre, imagen_url: urlFinalImagen }).eq("id", id);
      if (error) throw error;

      setMensaje({ tipo: "exito", texto: "¡Cristalería actualizada! 🍻 Volviendo..." });
      setTimeout(() => router.push("/admin/vasos"), 1500);

    } catch (error: any) {
      setMensaje({ tipo: "error", texto: "Error: " + error.message });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) return <div className="p-10 text-center font-bold text-stone-500 animate-pulse">Buscando copa... 🍷</div>;

  return (
    <div className="bg-stone-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-stone-900">✏️ Editar Vaso</h1>
          <Link href="/admin/vasos" className="text-amber-700 font-bold hover:underline bg-amber-50 px-4 py-2 rounded-xl">Volver a Vasos</Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          {mensaje.texto && <div className={`p-4 rounded-xl font-bold text-center mb-6 ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>{mensaje.texto}</div>}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Nombre del Vaso</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-600 mb-2">Foto / Ícono</label>
              <div className="flex items-center gap-4">
                {imagenActualUrl && !imagenArchivo && (
                  <div className="w-16 h-16 bg-stone-100 rounded-xl border border-gray-200 flex items-center justify-center p-2 shrink-0">
                    <img src={imagenActualUrl} alt="Vaso" className="h-full object-contain" />
                  </div>
                )}
                <div className="flex-1 border-2 border-dashed border-gray-300 rounded-xl p-3 text-center cursor-pointer relative bg-white">
                  <input type="file" accept="image/*" onChange={(e) => setImagenArchivo(e.target.files ? e.target.files[0] : null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {imagenArchivo ? <span className="text-green-600 font-bold">✅ {imagenArchivo.name}</span> : <span className="text-stone-500 font-medium text-sm">📸 Subir nueva imagen (PNG transparente)</span>}
                </div>
              </div>
            </div>

            <button type="submit" disabled={guardando} className="w-full bg-stone-900 text-amber-400 font-bold py-4 rounded-xl shadow-md disabled:opacity-50">
              {guardando ? "Guardando..." : "💾 Actualizar Vaso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}