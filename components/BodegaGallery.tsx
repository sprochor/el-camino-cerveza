'use client'

import { useState, useEffect } from 'react'

export default function BodegaGallery({ urls }: { urls: string[] }) {
  // Guardamos el número de la foto (índice), no la URL. 
  // null significa que la galería está cerrada.
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  // Bloquear el scroll del fondo y permitir usar el teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return
      if (e.key === 'Escape') setSelectedIndex(null)
      if (e.key === 'ArrowRight') nextImage(e as any)
      if (e.key === 'ArrowLeft') prevImage(e as any)
    }
    
    window.addEventListener('keydown', handleKeyDown)
    // Esto evita que la página de atrás se mueva en el celular
    document.body.style.overflow = selectedIndex !== null ? 'hidden' : 'auto'
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'auto'
    }
  }, [selectedIndex])

  // Si no hay fotos, no mostramos nada
  if (!urls || urls.length === 0) return null

  // Funciones para pasar de foto
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita que el clic cierre la galería
    setSelectedIndex((prev) => (prev === null ? null : (prev + 1) % urls.length))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation() // Evita que el clic cierre la galería
    setSelectedIndex((prev) => (prev === null ? null : (prev - 1 + urls.length) % urls.length))
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Galería de Fotos 📸</h3>
      
      {/* --- GRILLA DE FOTOS --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {urls.map((url, index) => (
          <div 
            key={index} 
            className="aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200 cursor-pointer group relative"
            onClick={() => setSelectedIndex(index)} // Guardamos el número al hacer clic
          >
            <img 
              src={url} 
              alt={`Galería ${index + 1}`} 
              className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
            />
            {/* Lupa sutil al pasar el mouse */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
              <span className="text-white opacity-0 group-hover:opacity-100 text-3xl drop-shadow-md transform scale-50 group-hover:scale-100 transition-all duration-300">
                🔍
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* --- CARRUSEL / PANTALLA COMPLETA --- */}
      {selectedIndex !== null && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-0 md:p-4 backdrop-blur-sm transition-all"
          onClick={() => setSelectedIndex(null)} // Clic afuera cierra la galería
        >
          
          {/* CONTADOR ARRIBA A LA IZQUIERDA */}
          <div className="absolute top-6 left-6 text-white font-bold text-sm md:text-base bg-black/50 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md z-[110]">
            {selectedIndex + 1} / {urls.length}
          </div>

          {/* BOTÓN "X" GIGANTE ARRIBA A LA DERECHA */}
          <button 
            className="absolute top-5 right-5 text-white bg-black/50 hover:bg-red-800 border border-white/20 w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all backdrop-blur-md z-[110] shadow-lg"
            onClick={() => setSelectedIndex(null)}
            aria-label="Cerrar galería"
          >
            &times;
          </button>
          
          {/* BOTÓN ANTERIOR (<) */}
          <button 
            onClick={prevImage}
            className="absolute left-2 md:left-8 text-white bg-black/50 hover:bg-black border border-white/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-all backdrop-blur-md z-[110] shadow-lg"
            aria-label="Imagen anterior"
          >
            ‹
          </button>

          {/* IMAGEN CENTRAL */}
          <div className="w-full h-full max-w-6xl max-h-[85vh] p-4 flex items-center justify-center relative select-none">
            <img 
              src={urls[selectedIndex]} 
              alt={`Imagen ampliada ${selectedIndex + 1}`} 
              className="max-w-full max-h-full object-contain drop-shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Evita que se cierre si haces clic en la foto
            />
          </div>

          {/* BOTÓN SIGUIENTE (>) */}
          <button 
            onClick={nextImage}
            className="absolute right-2 md:right-8 text-white bg-black/50 hover:bg-black border border-white/20 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl transition-all backdrop-blur-md z-[110] shadow-lg"
            aria-label="Siguiente imagen"
          >
            ›
          </button>

        </div>
      )}
    </div>
  )
}