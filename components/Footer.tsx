import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-300 py-12 md:py-16 border-t-4 border-amber-600 mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* --- ESTRUCTURA EN GRILLA PARA PC (3 Columnas) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 text-center md:text-left">
          
          {/* COLUMNA 1: Marca y Descripción */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="text-2xl font-black text-white tracking-tight hover:text-amber-500 transition flex items-center gap-2">
              <span className="text-3xl">🍻</span> El Camino
            </Link>
            <p className="text-sm text-stone-400 mt-4 max-w-sm leading-relaxed">
              Tu guía definitiva para la cultura cervecera.
            </p>
          </div>

          {/* COLUMNA 2: Navegación Sincronizada con el Navbar */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-stone-800 pb-2 w-full max-w-[150px] mx-auto md:mx-0">
              Ruta de la Pinta
            </h3>
            <ul className="flex flex-col gap-3 text-sm font-medium">
              <li>
                <Link href="/" className="hover:text-amber-500 transition">Inicio</Link>
              </li>
              <li>
                <Link href="/cervecerias" className="hover:text-amber-500 transition">Cervecerías</Link>
              </li>
              <li>
                <Link href="/cervezas" className="hover:text-amber-500 transition">Ranking Cervezas</Link>
              </li>
              <li>
                <Link href="/notas" className="hover:text-amber-500 transition">Cultura y Notas</Link>
              </li>
              <li>
                <Link href="/juego" className="hover:text-amber-500 transition font-bold text-amber-600">
                  La Cruzada de Heinrich 🎮
                </Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-amber-500 transition">Nosotros</Link>
              </li>
            </ul>
          </div>

          {/* COLUMNA 3: Redes y Contacto Directo */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-white font-bold mb-4 uppercase tracking-widest text-sm border-b border-stone-800 pb-2 w-full max-w-[200px] mx-auto md:mx-0">
              Brindá con nosotros
            </h3>
            
            <div className="flex gap-4 mb-6">
              <a 
                href="https://www.instagram.com/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-xl hover:bg-amber-600 hover:text-white hover:border-amber-500 transition shadow-sm"
                title="Instagram"
              >
                📸
              </a>
              <a 
                href="mailto:contacto@elcaminodelacerveza.com" 
                className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-xl hover:bg-amber-600 hover:text-white hover:border-amber-500 transition shadow-sm"
                title="Email"
              >
                ✉️
              </a>
            </div>

            <p className="text-sm text-stone-400">
              Escribinos a:<br />
              <a href="mailto:contacto@elcaminodelacerveza.com" className="text-white hover:text-amber-500 font-bold transition break-all mt-1 inline-block">
                contacto@elcaminodelacerveza.com
              </a>
            </p>
          </div>

        </div>

        {/* --- LÍNEA DIVISORIA Y COPYRIGHT --- */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            &copy; {currentYear} El Camino de la Cerveza. Creado con malta, lúpulo y código.
          </p>
          
          {/* 👇 ACÁ PUSIMOS LOS LINKS REALES 👇 */}
          <div className="flex gap-6 font-medium">
            <Link href="/privacidad" className="hover:text-white transition cursor-pointer">Políticas de Privacidad</Link>
            <Link href="/terminos" className="hover:text-white transition cursor-pointer">Términos y Condiciones</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}