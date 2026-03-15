import Link from 'next/link'

export default function NosotrosPage() {
  return (
    // 👇 1. Agregamos bg-slate-50 para forzar el fondo claro en toda la vista
    <div className="max-w-7xl mx-auto py-16 px-4 md:py-24 bg-slate-50">
      
      {/* --- SECCIÓN PRINCIPAL (Hero) --- */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-20 w-full mb-24">
        
        {/* COLUMNA IZQUIERDA: Texto 
            👇 2. En celular, el texto ahora vive en una tarjeta blanca. En PC, es transparente. */}
        <div className="md:w-1/2 space-y-8 text-center md:text-left bg-white md:bg-transparent p-8 md:p-0 rounded-3xl shadow-sm md:shadow-none border border-gray-100 md:border-transparent">
          <h1 className="text-4xl md:text-5xl font-extrabold text-red-800 mb-4 tracking-tight">
            Nuestra Historia
          </h1>
          
          <div className="space-y-6 text-lg md:text-xl text-gray-600 leading-relaxed">
            <p>
              Bienvenido a <strong className="text-gray-900">El Camino de las Bodegas</strong>, tu brújula digital para descubrir las mejores experiencias de enoturismo y vitivinicultura en Argentina.
            </p>
            <p>
              Nuestra misión es conectar a los amantes del vino con la tierra, las cepas y las personas detrás de cada botella. Transformamos las opiniones individuales en una <strong className="text-gray-900">historia colectiva</strong>, creando un mapa vivo basado en experiencias reales donde cada usuario puede descubrir y calificar sus favoritos.
            </p>
            <p>
              Ya sea que busques armar tu próxima ruta por Mendoza o la Patagonia, o simplemente quieras saber a qué sabe ese Malbec que te recomendaron, aquí tienes una comunidad lista para brindar contigo.
            </p>
          </div>

          {/* Botones de acción duales */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/vinos" className="bg-red-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-red-900 transition shadow-lg text-center">
              Explorar Vinos 🍷
            </Link>
            <Link href="/bodegas" className="bg-white text-red-800 border-2 border-red-800 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition shadow-sm text-center">
              Ver Bodegas 🍇
            </Link>
          </div>
        </div>

        {/* COLUMNA DERECHA: Logo Gigante */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-50 group overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Logo El Camino de las Bodegas" 
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
              loading="eager" 
            />
          </div>
        </div>
      </section>

      {/* --- NUEVA SECCIÓN: Los 3 Pilares --- */}
      <section className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 md:p-16">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-12">
          ¿Cómo funciona nuestra comunidad?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-800 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800">1. Descubre</h3>
            <p className="text-gray-600">Navega por nuestro mapa interactivo y encuentra bodegas ocultas en las mejores regiones vitivinícolas del país.</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-800 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm">🍷</div>
            <h3 className="text-xl font-bold text-gray-800">2. Cata</h3>
            <p className="text-gray-600">Lleva un registro personal en "Mi Camino" de cada vino que pruebas y cada bodega que visitas.</p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 text-red-800 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-sm">✍️</div>
            <h3 className="text-xl font-bold text-gray-800">3. Comparte</h3>
            <p className="text-gray-600">Deja tus notas de cata y reseñas para ayudar a otros miembros a tomar la mejor decisión en su próxima copa.</p>
          </div>

        </div>
      </section>
      
    </div>
  )
}