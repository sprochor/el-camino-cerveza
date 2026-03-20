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
    // 👇 Actualizamos el asunto del mail que te va a llegar
    formData.append("subject", "🍺 Nuevo mensaje desde El Camino de la Cerveza");

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
    // Forzamos el fondo claro en móviles (bg-stone-50) y lo dejamos normal en PC
    <div className="max-w-5xl mx-auto py-16 px-4 bg-stone-50 md:bg-transparent">
      
      {/* Envolvemos el encabezado en una tarjeta blanca SOLO para celulares */}
      <div className="text-center mb-16 bg-white md:bg-transparent p-8 md:p-0 rounded-3xl shadow-sm md:shadow-none border border-gray-100 md:border-transparent">
        <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight">Contacto</h1>
        <p className="text-stone-600 text-lg max-w-2xl mx-auto">
          ¿Tienes alguna duda, sugerencia o quieres sumar tu cervecería a nuestro club? Escríbenos, nos encantaría leerte.
        </p>
      </div>

      {/* El contenedor principal del formulario */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100">
        
        {/* --- COLUMNA IZQUIERDA: INFO DIRECTA --- */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold text-stone-800 border-b border-stone-100 pb-4">Nuestros canales de Comunicación</h2>
          
          <div className="flex items-center gap-5 text-stone-600 hover:text-amber-600 transition group">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 border border-amber-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-sm">
              ✉️
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Escríbenos directamente</p>
              {/* Ajusté el mail a 'cerveza' pero podés poner el que uses realmente */}
              <a href="mailto:contacto@elcaminodelacerveza.com" className="text-lg font-bold hover:underline break-all text-stone-800">
                contacto@elcaminodelacerveza.com
              </a>
            </div>
          </div>

          <div className="flex items-center gap-5 text-stone-600 hover:text-amber-600 transition group mt-6">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 border border-amber-100 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition shadow-sm">
              📸
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Síguenos en redes</p>
              <a href="https://www.instagram.com/elcaminodelacerveza/" target="_blank" rel="noopener noreferrer" className="text-lg font-bold hover:underline text-stone-800">
                @elcaminodelacerveza
              </a>
            </div>
          </div>
        </div>

        {/* --- COLUMNA DERECHA: FORMULARIO O ÉXITO --- */}
        <div>
          <h2 className="text-2xl font-bold text-stone-800 border-b border-stone-100 pb-4 mb-6">Envíanos un mensaje</h2>
          
          {isSuccess ? (
            <div className="bg-stone-50 p-8 rounded-2xl border border-stone-200 text-center animate-fade-in shadow-inner">
              <div className="text-5xl mb-4">🍻</div>
              <h3 className="text-2xl font-black text-stone-900 mb-2">¡Mensaje enviado!</h3>
              <p className="text-stone-600 font-medium">
                Gracias por escribirnos. Hemos recibido tu mensaje y te responderemos a la brevedad.
              </p>
              <button 
                onClick={() => setIsSuccess(false)}
                className="mt-6 text-sm font-bold text-amber-700 hover:text-amber-600 hover:underline transition"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <input type="checkbox" name="botcheck" className="hidden" />

              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Tu Nombre</label>
                <input type="text" name="name" required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition text-stone-800" placeholder="Ej: Juan Pérez" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Tu Email</label>
                <input type="email" name="email" required className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition text-stone-800" placeholder="ejemplo@correo.com" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-1">Mensaje</label>
                <textarea name="message" required rows={4} className="w-full p-3 bg-stone-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none resize-none transition text-stone-800" placeholder="¿En qué podemos ayudarte?"></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-amber-500 text-stone-900 font-black py-3.5 rounded-xl hover:bg-amber-400 transition shadow-md disabled:opacity-70 flex justify-center items-center gap-2"
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