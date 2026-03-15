'use client';

import { useState } from 'react';

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Recolectamos los datos del formulario
    const formData = new FormData(e.currentTarget);
    
    // Agregamos tu llave y configuraciones de Web3Forms
    formData.append("access_key", "0365789e-3bfa-418c-a236-b27983f6b3b9");
    formData.append("subject", "🍷 Nuevo mensaje desde El Camino de las Bodegas");

    try {
      // Enviamos en segundo plano
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true); // Cambiamos la pantalla a éxito
      } else {
        alert("Hubo un problema al enviar. Por favor intenta de nuevo.");
      }
    } catch (error) {
      alert("Error de conexión. Revisa tu internet y vuelve a intentar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // 👇 1. Forzamos el fondo claro en móviles (bg-slate-50) y lo dejamos normal en PC
    <div className="max-w-5xl mx-auto py-16 px-4 bg-slate-50 md:bg-transparent">
      
      {/* 👇 2. Envolvemos el encabezado en una tarjeta blanca SOLO para celulares */}
      <div className="text-center mb-16 bg-white md:bg-transparent p-8 md:p-0 rounded-3xl shadow-sm md:shadow-none border border-gray-100 md:border-transparent">
        <h1 className="text-4xl md:text-5xl font-extrabold text-red-800 mb-4 tracking-tight">Contacto</h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          ¿Tienes alguna duda, sugerencia o quieres sumar tu bodega a nuestro camino? Escríbenos, nos encantaría leerte.
        </p>
      </div>

      {/* El formulario ya estaba protegido con su propio bg-white */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        
        {/* --- COLUMNA IZQUIERDA: INFO DIRECTA --- */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-4">Nuestros canales de Comunicacion</h2>
          
          <div className="flex items-center gap-5 text-gray-700 hover:text-red-800 transition group">
            <div className="w-14 h-14 bg-red-50 text-red-800 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-sm">
              ✉️
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Escríbenos directamente</p>
              <a href="mailto:contacto@elcaminodelasbodegas.com" className="text-lg font-bold hover:underline break-all">
                contacto@elcaminodelasbodegas.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-5 text-gray-700 hover:text-pink-600 transition group mt-6">
            <div className="w-14 h-14 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-sm">
              📸
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Síguenos en redes</p>
              <a href="https://www.instagram.com/elcaminodelasbodegas/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline">
                @elcaminodelasbodegas
              </a>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO O ÉXITO --- */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-4 mb-6">Envíanos un mensaje</h2>
          
          {isSuccess ? (
            <div className="bg-green-50 p-8 rounded-2xl border border-green-100 text-center animate-fade-in">
              <div className="text-5xl mb-4">🍷</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">¡Mensaje enviado!</h3>
              <p className="text-green-700 font-medium">
                Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos a la brevedad.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-6 text-sm font-bold text-green-800 hover:underline"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <input type="checkbox" name="botcheck" className="hidden" />

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tu Nombre</label>
                <input type="text" name="name" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-800 outline-none transition" placeholder="Ej: Juan Pérez" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tu Email</label>
                <input type="email" name="email" required className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-800 outline-none transition" placeholder="ejemplo@correo.com" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mensaje</label>
                <textarea name="message" required rows={4} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-800 outline-none resize-none transition" placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-red-800 text-white font-bold py-3.5 rounded-xl hover:bg-red-900 transition shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? 'Enviando mensaje...' : 'Enviar Mensaje'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}