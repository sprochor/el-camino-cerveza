"use client";

import { useEffect, useState } from "react";

export default function AgeModal() {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Revisamos si ya verificó su edad anteriormente
    const isVerified = localStorage.getItem("age_verified");
    if (!isVerified) {
      // Pequeño delay para que no aparezca tan de golpe
      const timer = setTimeout(() => setShowModal(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleYes = () => {
    localStorage.setItem("age_verified", "true");
    setShowModal(false);
  };

  const handleNo = () => {
    setError(true);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/90 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 text-center border-4 border-amber-500 relative overflow-hidden">
        
        {/* Fondo decorativo */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-5 pointer-events-none"></div>

        <div className="relative z-10">
          <span className="text-6xl mb-4 block">🍻</span>
          <h2 className="text-3xl font-black text-stone-900 mb-2">¿Eres mayor de 18 años?</h2>
          <p className="text-stone-600 mb-8 font-medium">
            Para ingresar a El Camino de la Cerveza debes tener la edad legal para consumir alcohol en tu país.
          </p>

          {error ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-xl font-bold border border-red-200">
              Lo sentimos, debes ser mayor de edad para ingresar a esta plataforma.
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleYes}
                className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-black px-8 py-3 rounded-xl transition shadow-[4px_4px_0_rgba(0,0,0,0.8)] active:translate-y-1 active:translate-x-1 active:shadow-none w-full sm:w-auto"
              >
                SÍ, TENGO 18 O MÁS
              </button>
              <button 
                onClick={handleNo}
                className="bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold px-8 py-3 rounded-xl transition w-full sm:w-auto"
              >
                NO, SOY MENOR
              </button>
            </div>
          )}
          
          <p className="text-xs text-stone-400 mt-8 uppercase tracking-widest">
            Beber con moderación. Prohibida su venta a menores de 18 años.
          </p>
        </div>
      </div>
    </div>
  );
}