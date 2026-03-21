"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JuegoLandingPage() {
  const router = useRouter(); // 👈 Inicializamos el router
  const [zarpando, setZarpando] = useState(false); // 👈 El estado del botón

  // Esta función reemplaza al clásico <Link>
  const handleEmpezarAventura = (e: React.MouseEvent) => {
    e.preventDefault();
    setZarpando(true); // 1. Al instante, cambiamos el texto del botón
    
    // 2. Le decimos a Next que nos lleve al juego (cambiá la ruta por la tuya exacta)
    router.push("/juego/capitulo-1"); 
  };
  return (
    <div className="bg-stone-900 min-h-screen pb-20 font-sans selection:bg-amber-500 selection:text-stone-900">
      {/* HERO SECTION - ESTILO RETRO */}
      <div className="relative border-b-4 border-amber-600 bg-stone-950 overflow-hidden">
        {/* Efecto de scanlines (líneas de TV vieja) muy sutil */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] pointer-events-none z-10"></div>

        <div className="max-w-5xl mx-auto px-4 py-20 md:py-32 relative z-20 text-center">
          <span className="font-mono text-amber-500 text-sm md:text-base tracking-widest uppercase mb-4 block">
            Una Aventura Gráfica Clásica Point & Click
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-amber-400 mb-6 tracking-tight drop-shadow-[0_4px_0_rgba(180,83,9,1)] font-retro uppercase">
            La Cruzada de Heinrich
          </h1>
          <p className="text-xl md:text-2xl text-stone-300 max-w-2xl mx-auto leading-relaxed font-serif italic drop-shadow-md">
            "Convertir a Buenos Aires en una ciudad cervecera... o morir en el
            intento."
          </p>

          <div className="mt-12">
            <button 
              onClick={handleEmpezarAventura}
              disabled={zarpando}
              className={`font-black font-mono text-xl px-8 py-4 rounded-none border-t-2 border-l-2 border-amber-300 border-b-4 border-r-4 border-amber-700 active:translate-y-1 active:translate-x-1 active:border-b-2 active:border-r-2 transition-all shadow-[4px_4px_0_rgba(0,0,0,0.5)] ${
                zarpando 
                  ? "bg-stone-600 text-stone-400 cursor-not-allowed border-stone-800 shadow-none translate-y-1 translate-x-1" 
                  : "bg-amber-500 hover:bg-amber-400 text-stone-900 hover:border-amber-600"
              }`}
            >
              {zarpando ? "> ZARPANDO AL VIRREINATO..." : "> JUGAR CAPÍTULO 1 AHORA"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-16">
        {/* LA HISTORIA */}
        <section className="bg-stone-800 border-4 border-stone-600 border-b-stone-950 border-r-stone-950 p-8 md:p-12 shadow-2xl relative">
          <div className="absolute -top-5 left-8 bg-amber-500 text-stone-900 font-black font-mono px-4 py-1 text-lg uppercase tracking-wider shadow-[4px_4px_0_rgba(0,0,0,1)]">
            Contexto Histórico
          </div>
          <div className="text-stone-300 text-lg md:text-xl leading-relaxed space-y-6 mt-4">
            <p>
              <strong className="text-amber-400 font-mono text-2xl drop-shadow-md">
                AÑO 1806.
              </strong>{" "}
              Después de cruzar el turbulento Atlántico,{" "}
              <strong>Heinrich Adler</strong>, un joven y orgulloso maestro
              cervecero bávaro, llega al Puerto de Buenos Aires.
            </p>
            <p>
              Está convencido de que sus cervezas perfectas conquistarán el
              Nuevo Mundo. Pero al bajar del barco, la realidad lo golpea con
              dureza:
            </p>
            <ul className="font-mono text-amber-200 bg-stone-950 p-6 border-2 border-stone-700 shadow-inner space-y-3">
              <li>&gt; Los porteños toman CAÑA.</li>
              <li>&gt; Los gauchos toman MATE.</li>
              <li>&gt; Los comerciantes toman VINO.</li>
              <li className="text-red-400 mt-4">
                &gt; NADIE entiende por qué alguien bebería "agua amarga con
                espuma".
              </li>
            </ul>
            <p className="border-t-2 border-stone-700 pt-6">
              Para empeorar las cosas, vientos de guerra asedian el Virreinato.
              Las Invasiones Inglesas están a punto de comenzar, y el puerto
              está lleno de espías, comerciantes turbios y secretos que huelen a
              pólvora.
            </p>
          </div>
        </section>

        {/* FICHA DE PERSONAJES (Heinrich y Edward) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* EL PROTAGONISTA */}
          <section className="bg-stone-800 border-4 border-stone-600 border-b-stone-950 border-r-stone-950 p-8 relative flex flex-col shadow-xl">
            <div className="absolute -top-5 left-8 bg-amber-500 text-stone-900 font-black font-mono px-4 py-1 text-lg uppercase tracking-wider shadow-[4px_4px_0_rgba(0,0,0,1)]">
              El Héroe
            </div>

            <div className="flex gap-6 mt-4 border-b-2 border-stone-700 pb-6 mb-6">
              {/* REEMPLAZO DE EMOJI POR IMAGEN REAL */}
              <div className="w-24 h-24 bg-stone-900 border-4 border-stone-600 overflow-hidden flex-shrink-0 shadow-inner relative">
                <img
                  src="/images/juego/heinrich-neutral.png"
                  alt="Heinrich Adler"
                  className="absolute top-0 left-0 w-full h-full object-cover pixelated scale-125 origin-top"
                />
              </div>
              <div className="font-mono text-stone-300 space-y-2 text-sm md:text-base">
                <p>
                  <span className="text-stone-500">NOMBRE:</span>{" "}
                  <span className="text-amber-400 font-bold">
                    Heinrich Adler
                  </span>
                </p>
                <p>
                  <span className="text-stone-500">ORIGEN:</span> Baviera
                </p>
                <p>
                  <span className="text-stone-500">PROFESIÓN:</span> Maestro
                  Cervecero
                </p>
                <p>
                  <span className="text-stone-500">PERSONALIDAD:</span>{" "}
                  Perfeccionista, obstinado.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-amber-500 font-mono font-bold mb-4">
                SU OBJETIVO:
              </h3>
              <p className="text-stone-400 font-mono text-sm leading-relaxed bg-stone-950 p-4 border-2 border-stone-700 shadow-inner">
                Demostrar que la cerveza puede conquistar el Nuevo Mundo… aunque
                nadie entienda qué está intentando hacer.
              </p>
            </div>
          </section>

          {/* EL RIVAL */}
          <section className="bg-stone-800 border-4 border-stone-600 border-b-stone-950 border-r-stone-950 p-8 relative flex flex-col shadow-xl">
            <div className="absolute -top-5 left-8 bg-red-600 text-stone-900 font-black font-mono px-4 py-1 text-lg uppercase tracking-wider shadow-[4px_4px_0_rgba(0,0,0,1)]">
              El Rival
            </div>

            <div className="flex gap-6 mt-4 border-b-2 border-stone-700 pb-6 mb-6">
              {/* REEMPLAZO DE EMOJI POR IMAGEN REAL */}
              <div className="w-24 h-24 bg-stone-900 border-4 border-red-900 overflow-hidden flex-shrink-0 shadow-inner relative">
                <img
                  src="/images/juego/edward-smirk.png"
                  alt="Edward Whitmore"
                  className="absolute top-0 left-0 w-full h-full object-cover pixelated scale-125 origin-top grayscale hover:grayscale-0 transition-all"
                />
              </div>
              <div className="font-mono text-stone-300 space-y-2 text-sm md:text-base">
                <p>
                  <span className="text-stone-500">NOMBRE:</span>{" "}
                  <span className="text-red-400 font-bold">
                    Edward Whitmore
                  </span>
                </p>
                <p>
                  <span className="text-stone-500">ORIGEN:</span> Londres
                </p>
                <p>
                  <span className="text-stone-500">PROFESIÓN:</span> Comerciante
                </p>
                <p>
                  <span className="text-red-500/70">EL RUMOR:</span>{" "}
                  <span className="text-stone-400 italic">
                    "Dicen que es un espía..."
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-red-500 font-mono font-bold mb-4">
                INFO CLASIFICADA:
              </h3>
              <p className="text-stone-400 font-mono text-sm leading-relaxed bg-stone-950 p-4 border-2 border-stone-700 shadow-inner">
                Controla el mercado clandestino de la Porter inglesa en el
                puerto. Sus barriles llegan extrañamente pesados y nunca deja
                que los inspectores aduaneros los abran. Se acerca la flota de
                Beresford y Edward está muy confiado.
              </p>
            </div>
          </section>
        </div>

        {/* ESCENARIOS Y MECÁNICAS */}
        <section className="bg-stone-800 border-4 border-stone-600 border-b-stone-950 border-r-stone-950 p-8 relative shadow-xl">
          <div className="absolute -top-5 left-8 bg-amber-500 text-stone-900 font-black font-mono px-4 py-1 text-lg uppercase tracking-wider shadow-[4px_4px_0_rgba(0,0,0,1)]">
            El Mundo de 1806
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-stone-950 p-5 border-l-4 border-amber-500 shadow-md">
              <h4 className="text-amber-400 font-bold mb-2 text-xl font-mono">
                ⚓ El Puerto
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                El punto de llegada. Entre marineros, cargamentos y rumores, algo en el puerto no termina de encajar.
              </p>
            </div>
            <div className="bg-stone-950 p-5 border-l-4 border-amber-500 shadow-md">
              <h4 className="text-amber-400 font-bold mb-2 text-xl font-mono">
                🏛️ La Plaza
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Frente al Cabildo, la vida del Virreinato sigue su curso. Soldados, vecinos y vendedores observan a Heinrich con cierta sospecha.
              </p>
            </div>

            <div className="bg-stone-950 p-5 border-l-4 border-amber-500 shadow-md">
              <h4 className="text-amber-400 font-bold mb-2 text-xl font-mono">
                🍷 La Pulpería
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                Centro social del lugar. Mate, caña y miradas desconfiadas hacia cualquiera.
              </p>
            </div>

            <div className="bg-stone-950 p-5 border-l-4 border-amber-500 shadow-md">
              <h4 className="text-amber-400 font-bold mb-2 text-xl font-mono">
                🌾 La Quinta
              </h4>
              <p className="text-stone-400 text-sm leading-relaxed">
                El patio trasero. Un rincón tranquilo lejos del bullicio. Aquí, Heinrich cree que podría empezar algo… si logra encontrar lo que necesita.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
