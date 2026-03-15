"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cervezaId: string;
  onReviewAdded: () => void;
}

export default function ReviewModal({
  isOpen,
  onClose,
  cervezaId,
  onReviewAdded,
}: ReviewModalProps) {
  const [aroma, setAroma] = useState(0);
  const [sabor, setSabor] = useState(0);
  const [cuerpo, setCuerpo] = useState(0);
  const [apariencia, setApariencia] = useState(0);
  const [comentario, setComentario] = useState("");

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validación básica: El usuario DEBE puntuar todo
    if (aroma === 0 || sabor === 0 || cuerpo === 0 || apariencia === 0) {
      setError("¡No te olvides de puntuar todas las categorías! ⭐");
      return;
    }

    setCargando(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setError("Tenés que iniciar sesión para dejar tu veredicto.");
        setCargando(false);
        return;
      }

      const promedioDeResena = (aroma + sabor + cuerpo + apariencia) / 4;

      const { error: insertError } = await supabase.from("resenas").insert({
        cerveza_id: cervezaId,
        usuario_id: session.user.id,
        puntos_aroma: aroma,
        puntos_sabor: sabor,
        puntos_cuerpo: cuerpo,
        puntos_apariencia: apariencia,
        promedio_resena: promedioDeResena,
        comentario_opcional: comentario,
      });

      if (insertError) throw insertError;

      // ÉXITO: Recargamos la página a la fuerza para que aparezca la reseña sí o sí.
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      setError("Error al guardar: " + err.message);
    } finally {
      setCargando(false);
    }
  };

  // Subcomponente interactivo para las estrellas (TU DISEÑO INTACTO)
  const StarRating = ({
    label,
    rating,
    setRating,
  }: {
    label: string;
    rating: number;
    setRating: (val: number) => void;
  }) => {
    const [hover, setHover] = useState(0);

    return (
      <div className="flex justify-between items-center bg-stone-50 p-3 rounded-xl border border-gray-100">
        <span className="font-bold text-stone-700">{label}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-2xl transition-transform hover:scale-110 focus:outline-none ${
                (hover || rating) >= star
                  ? "text-amber-400 drop-shadow-sm"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
            >
              ★
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* HEADER MODAL */}
        <div className="bg-stone-800 p-6 flex justify-between items-center text-white">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            📝 Tu Veredicto
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* BODY MODAL */}
        <div className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-800 p-3 rounded-xl text-sm font-bold border border-red-200 text-center">
                {error}
              </div>
            )}

            {/* ZONA DE ESTRELLITAS INTERACTIVAS */}
            <div className="space-y-3">
              <StarRating label="Aroma" rating={aroma} setRating={setAroma} />
              <StarRating label="Sabor" rating={sabor} setRating={setSabor} />
              <StarRating
                label="Cuerpo"
                rating={cuerpo}
                setRating={setCuerpo}
              />
              <StarRating
                label="Apariencia"
                rating={apariencia}
                setRating={setApariencia}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold text-stone-700">
                Notas de Cata (Opcional)
              </label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="¿Qué te pareció? ¿Sentiste notas a caramelo, pino, cítricos?..."
                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition bg-stone-50 h-28 resize-none text-stone-800"
                maxLength={500}
              />
            </div>

            {/* BOTONES */}
            <div className="flex gap-4 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl font-bold text-stone-600 bg-gray-100 hover:bg-gray-200 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={cargando}
                className="w-full py-3 rounded-xl font-bold text-stone-900 bg-amber-500 hover:bg-amber-400 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {cargando ? "Guardando..." : "Publicar Reseña"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
