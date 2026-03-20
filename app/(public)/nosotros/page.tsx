import Link from "next/link";

export default function NosotrosPage() {
  return (
    // 1. Usamos bg-stone-50 para mantener la coherencia con el resto de la web
    <div className="max-w-7xl mx-auto py-16 px-4 md:py-24 bg-stone-50">
      {/* --- SECCIÓN PRINCIPAL (Hero) --- */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20 w-full mb-24">
        {/* COLUMNA IZQUIERDA: Texto */}
        <div className="md:w-1/2 space-y-8 text-center md:text-left bg-white md:bg-transparent p-8 md:p-0 rounded-3xl shadow-sm md:shadow-none border border-gray-100 md:border-transparent">
          <span className="font-mono text-amber-600 font-bold tracking-widest uppercase text-sm">
            No es solo cerveza.
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-stone-900 mb-4 tracking-tight">
            Es tu camino cervecero 🍻
          </h1>

          <div className="space-y-6 text-lg md:text-xl text-stone-600 leading-relaxed">
            <p>
              Bienvenido a una experiencia donde la cerveza no solo se toma: se
              descubre, se comparte… y se vive.
            </p>

            <p>
              Explorá cervecerías, calificá estilos y construí tu propio
              <strong className="text-stone-900"> camino cervecero</strong>.
              Cada elección suma, cada pinta cuenta.
            </p>

            <p>
              Y si querés ir más allá… viajá al Buenos Aires de 1806 y ayudá a
              Heinrich a preparar la primera cerveza del Virreinato.
            </p>
          </div>

          {/* Botones de acción duales */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="/cervezas"
              className="bg-amber-500 text-stone-900 px-8 py-4 rounded-full font-black text-lg hover:bg-amber-400 transition shadow-md text-center flex items-center justify-center gap-2"
            >
              Explorar Cervezas 🍺
            </Link>
            <Link
              href="/cervecerias"
              className="bg-white text-stone-800 border-2 border-stone-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-stone-50 hover:border-stone-300 transition shadow-sm text-center flex items-center justify-center gap-2"
            >
              Ver Cervecerías 🏭
            </Link>
          </div>
        </div>

        {/* COLUMNA DERECHA: Logo Gigante */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-amber-100 group overflow-hidden">
            <img
              src="/logo-cerveza.png"
              alt="Logo Comunidad Cervecera"
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          </div>
        </div>
      </section>

      <section className="text-center my-24">
        <h2 className="text-3xl font-black text-stone-900 mb-6">
          Tu progreso importa
        </h2>
        <p className="text-lg text-stone-600 max-w-2xl mx-auto">
          Cada cerveza que calificás, cada estilo que probás y cada decisión que
          tomás en el juego construyen tu historia. Desbloqueá medallas y
          convertite en un verdadero maestro cervecero.
        </p>
      </section>
      {/* --- NUEVA SECCIÓN: LA CRUZADA DE HEINRICH --- */}
      <section className="relative bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-stone-800">
        {/* Fondo decorativo retro */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-30 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 p-10 md:p-16">
            <span className="font-mono text-amber-500 font-bold tracking-widest uppercase text-sm bg-stone-950 px-3 py-1 rounded-md border border-stone-700">
              Minijuego Exclusivo
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-6 mb-4 font-retro tracking-wide">
              LA CRUZADA DE HEINRICH
            </h2>
            <p className="text-stone-300 text-lg mb-8 leading-relaxed font-serif italic">
              Ayudá a Heinrich a preparar cerveza en el Buenos Aires de 1806.
              <br />
              ¿Qué tan difícil puede ser?
            </p>
            <Link
              href="/juego"
              className="inline-block bg-amber-500 hover:bg-amber-400 text-stone-900 font-black font-mono px-6 py-3 border-b-4 border-r-4 border-amber-700 hover:translate-y-1 hover:translate-x-1 hover:border-b-2 hover:border-r-2 transition-all"
            >
              &gt; JUGAR Y GANAR MEDALLA_
            </Link>
          </div>

          <div className="md:w-1/2 w-full h-64 md:h-auto self-stretch bg-stone-800 relative border-l-4 border-stone-800">
            {/* Podés poner una captura de pantalla del juego acá */}
            <img
              src="/images/juego/fondo-puerto.png"
              alt="La Cruzada de Heinrich"
              className="w-full h-full object-cover pixelated opacity-80 hover:opacity-100 transition duration-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
