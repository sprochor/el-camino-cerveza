"use client";

import Link from "next/link";

export default function JuegoLandingPage() {
  return (
    <div className="bg-stone-900 min-h-screen pb-20 font-sans selection:bg-amber-500 selection:text-stone-900">
      
      {/* HERO SECTION - ESTILO RETRO */}
      <div className="relative border-b-4 border-amber-600 bg-stone-950 overflow-hidden">
        {/* Efecto de scanlines (líneas de TV vieja) muy sutil */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] pointer-events-none z-10"></div>
        
        <div className="max-w-5xl mx-auto px-4 py-20 md:py-32 relative z-20 text-center">
          <span className="font-mono text-amber-500 text-sm md:text-base tracking-widest uppercase mb-4 block">
            Próximamente • Aventura Gráfica Point & Click
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-amber-400 mb-6 tracking-tight drop-shadow-[0_4px_0_rgba(180,83,9,1)]">
            La Cruzada de Heinrich
          </h1>
          <p className="text-xl md:text-2xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-serif italic">
            "Convertir a Buenos Aires en una ciudad cervecera... o morir en el intento."
          </p>
          
          <div className="mt-10">
            <Link href="/juego/capitulo-1">
              <button className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-black font-mono text-xl px-8 py-4 rounded-none border-b-4 border-r-4 border-amber-700 hover:border-amber-600 hover:translate-y-1 hover:translate-x-1 transition-all">
                &gt; JUGAR CAPÍTULO 1 (PRONTO)_
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        
        {/* LA HISTORIA */}
        <section className="bg-stone-800 border-2 border-stone-700 p-8 md:p-12 shadow-2xl relative">
          <div className="absolute -top-5 left-8 bg-amber-500 text-stone-900 font-black font-mono px-4 py-1 text-lg uppercase tracking-wider">
            Contexto Histórico
          </div>
          <div className="text-stone-300 text-lg md:text-xl leading-relaxed space-y-6 mt-4">
            <p>
              <strong className="text-amber-400 font-mono text-2xl">AÑO 1806.</strong> Después de cruzar el turbulento Atlántico, <strong>Heinrich Adler</strong>, un joven y orgulloso maestro cervecero bávaro, llega al Puerto de Buenos Aires.
            </p>
            <p>
              Está convencido de que su receta perfecta conquistará el Nuevo Mundo. Pero al bajar del barco, la realidad lo golpea con dureza:
            </p>
            <ul className="font-mono text-amber-200 bg-stone-900 p-6 border border-stone-700 space-y-3">
              <li>&gt; Los porteños toman MATE.</li>
              <li>&gt; Los gauchos toman CAÑA.</li>
              <li>&gt; Los comerciantes toman VINO.</li>
              <li className="text-red-400 mt-4">&gt; NADIE entiende por qué alguien bebería "agua amarga con espuma".</li>
            </ul>
            <p className="border-t border-stone-700 pt-6">
              Para empeorar las cosas, vientos de guerra asedian el Virreinato. Las Invasiones Inglesas están a punto de comenzar, y el puerto está lleno de espías, comerciantes turbios y secretos que huelen a pólvora.
            </p>
          </div>
        </section>

        {/* FICHA DE PERSONAJES (Heinrich y Edward) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* EL PROTAGONISTA */}
          <section className="bg-stone-800 border-2 border-stone-700 p-8 relative flex flex-col">
            <div className="absolute -top-5 left-8 bg-amber-500 text-stone-900 font-black font-mono px-4 py-1 text-lg uppercase tracking-wider">
              El Héroe
            </div>
            
            <div className="flex gap-6 mt-4 border-b border-stone-700 pb-6 mb-6">
              <div className="w-24 h-24 bg-stone-900 border-2 border-stone-600 flex items-center justify-center flex-shrink-0">
                <span className="text-5xl">🧑🏼‍🍳</span>
              </div>
              <div className="font-mono text-stone-300 space-y-2 text-sm md:text-base">
                <p><span className="text-stone-500">NOMBRE:</span> <span className="text-amber-400 font-bold">Heinrich Adler</span></p>
                <p><span className="text-stone-500">ORIGEN:</span> Baviera</p>
                <p><span className="text-stone-500">PROFESIÓN:</span> Maestro Cervecero</p>
                <p><span className="text-stone-500">PERSONALIDAD:</span> Perfeccionista, obstinado.</p>
              </div>
            </div>

            <div>
              <h3 className="text-amber-500 font-mono font-bold mb-4">INVENTARIO INICIAL:</h3>
              <div className="grid grid-cols-2 gap-4 font-mono text-sm text-stone-300">
                <div className="bg-stone-900 p-3 border border-stone-700 flex items-center gap-3">
                  <span className="text-2xl">📜</span> Libro de recetas
                </div>
                <div className="bg-stone-900 p-3 border border-stone-700 flex items-center gap-3">
                  <span className="text-2xl">🍺</span> Levadura bávara
                </div>
                <div className="bg-stone-900 p-3 border border-stone-700 flex items-center gap-3">
                  <span className="text-2xl">🛢️</span> Pequeño barril
                </div>
                <div className="bg-stone-900 p-3 border border-stone-700 flex items-center gap-3">
                  <span className="text-2xl">🧭</span> Carta navegación
                </div>
              </div>
            </div>
          </section>

          {/* EL RIVAL */}
          <section className="bg-stone-800 border-2 border-stone-700 p-8 relative flex flex-col">
            <div className="absolute -top-5 left-8 bg-red-600 text-stone-900 font-black font-mono px-4 py-1 text-lg uppercase tracking-wider">
              El Antagonista
            </div>
            
            <div className="flex gap-6 mt-4 border-b border-stone-700 pb-6 mb-6">
              <div className="w-24 h-24 bg-stone-900 border-2 border-red-900 flex items-center justify-center flex-shrink-0">
                <span className="text-5xl grayscale opacity-80">🎩</span>
              </div>
              <div className="font-mono text-stone-300 space-y-2 text-sm md:text-base">
                <p><span className="text-stone-500">NOMBRE:</span> <span className="text-red-400 font-bold">Edward Whitmore</span></p>
                <p><span className="text-stone-500">ORIGEN:</span> Londres</p>
                <p><span className="text-stone-500">PROFESIÓN:</span> Comerciante de cerveza</p>
                <p><span className="text-red-500/70">EL RUMOR:</span> <span className="text-stone-400 italic">"Algunos dicen que es un espía..."</span></p>
              </div>
            </div>

            <div>
              <h3 className="text-red-500 font-mono font-bold mb-4">INFO CLASIFICADA:</h3>
              <p className="text-stone-400 font-mono text-sm leading-relaxed bg-stone-900 p-4 border border-stone-700">
                Controla el mercado clandestino de la Porter inglesa en el puerto. Sus barriles llegan extrañamente pesados y nunca deja que los inspectores aduaneros los abran. Se acerca la flota de Beresford y Edward está muy confiado.
              </p>
            </div>
          </section>

        </div>

        {/* ESCENARIOS Y MECÁNICAS */}
        <section className="bg-stone-800 border-2 border-stone-700 p-8 relative">
          <div className="absolute -top-5 left-8 bg-amber-500 text-stone-900 font-black font-mono px-4 py-1 text-lg uppercase tracking-wider">
            El Mundo de 1806
          </div>
          
          <div className="mt-4 space-y-6 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            
            <div className="bg-stone-900 p-4 border-l-4 border-amber-500">
              <h4 className="text-amber-400 font-bold mb-1">⚓ Puerto de Buenos Aires</h4>
              <p className="text-stone-400 text-sm mb-2">Primer escenario. Marineros, comerciantes y estibadores. Aquí comienza el choque cultural y el dominio de Whitmore.</p>
            </div>

            <div className="bg-stone-900 p-4 border-l-4 border-amber-500">
              <h4 className="text-amber-400 font-bold mb-1">🍷 La Pulpería</h4>
              <p className="text-stone-400 text-sm mb-2">Centro social. Hogar del Gaucho Pancho (quien siempre está acompañado por Galleta, un pequeño perro cachorro Bichón Habanés que correteando hace tropezar a los clientes).</p>
              <div className="bg-stone-950 p-3 mt-2 font-mono text-xs text-stone-300">
                <span className="text-red-400">Gaucho Pancho:</span> "Si tu bebida extranjera no tumba a un caballo, no sirve p'a nada."
              </div>
            </div>

            <div className="bg-stone-900 p-4 border-l-4 border-amber-500">
              <h4 className="text-amber-400 font-bold mb-1">🌾 La Quinta</h4>
              <p className="text-stone-400 text-sm mb-2">Lugar de recolección (Crafting). Cebada, hierbas y agua de lluvia limpia para el fermento.</p>
            </div>

          </div>
        </section>

        {/* EJEMPLO DE GAMEPLAY (DIÁLOGO) */}
        <section className="bg-black border-4 border-stone-700 p-6 relative flex flex-col items-center">
          <div className="w-full max-w-2xl bg-blue-900 border-4 border-gray-300 p-4 shadow-[8px_8px_0_rgba(0,0,0,1)]">
            <p className="font-mono text-white text-lg mb-4">
              <span className="text-yellow-400">&gt; Examinar</span> Barril_Inglés
            </p>
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-stone-800 border-2 border-white flex items-center justify-center flex-shrink-0 text-3xl">
                🧑🏼‍🍳
              </div>
              <p className="font-mono text-white text-md leading-relaxed">
                "Huele a malta tostada, sí... Pero si golpeo la madera, no suena a líquido. Suena a pólvora seca. El Señor Whitmore nos está mintiendo a todos."
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}