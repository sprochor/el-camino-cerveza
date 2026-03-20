import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 md:py-24 text-stone-800">
      <div className="text-center mb-12">
        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">Legal</span>
        <h1 className="text-4xl md:text-5xl font-black text-stone-900 mt-2 mb-4 tracking-tight">Términos y Condiciones</h1>
        <p className="text-stone-500">Última actualización: Marzo 2026</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200 space-y-8 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">1. Aceptación de los Términos</h2>
          <p className="text-stone-600">Al acceder y utilizar "El Camino de la Cerveza", aceptas cumplir con estos términos. Si no estás de acuerdo con alguna parte de los mismos, no podrás acceder a la plataforma.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">2. Mayoría de Edad</h2>
          <p className="text-stone-600">El acceso a este sitio web está estrictamente limitado a personas mayores de 18 años (o la edad legal para consumir alcohol en tu jurisdicción). Nos reservamos el derecho de eliminar cuentas de usuarios que infrinjan esta norma.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">3. Contenido de Usuarios</h2>
          <p className="text-stone-600">Nuestra plataforma permite publicar reseñas, puntajes y comentarios ("Contenido"). Eres el único responsable del Contenido que publiques. Te comprometes a no publicar material ofensivo, difamatorio o que promueva el consumo irresponsable de alcohol.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">4. El Minijuego</h2>
          <p className="text-stone-600">El minijuego "La Cruzada de Heinrich" se proporciona con fines de entretenimiento. Las recompensas virtuales ("Medallas") obtenidas en el juego no tienen valor monetario real ni pueden canjearse por bienes físicos.</p>
        </section>

        <div className="mt-12 pt-8 border-t border-stone-200 text-center">
          <Link href="/" className="text-amber-600 font-bold hover:text-amber-700 transition">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}