import Link from "next/link";

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 md:py-24 text-stone-800">
      <div className="text-center mb-12">
        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-stone-900 mt-2 mb-4 tracking-tight">
          Términos y Condiciones
        </h1>
        <p className="text-stone-500">Última actualización: Marzo 2026</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200 space-y-8 text-lg leading-relaxed">

        {/* 1 */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            1. Aceptación de los Términos
          </h2>
          <p className="text-stone-600">
            Al acceder y utilizar "El Camino de la Cerveza", aceptás cumplir con estos términos y condiciones. Si no estás de acuerdo con alguna parte de los mismos, no podrás utilizar la plataforma.
          </p>
        </section>

        {/* 2 */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            2. Mayoría de Edad
          </h2>
          <p className="text-stone-600">
            El acceso a este sitio está limitado a personas mayores de 18 años (o la edad legal para consumir alcohol en tu jurisdicción). Nos reservamos el derecho de suspender o eliminar cuentas que incumplan esta condición.
          </p>
        </section>

        {/* 3 */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            3. Uso de la Plataforma
          </h2>
          <p className="text-stone-600">
            El usuario se compromete a utilizar la plataforma de forma responsable, respetando a otros usuarios y el propósito del sitio. Queda prohibido el uso del sitio para actividades ilegales, fraudulentas o que perjudiquen su funcionamiento.
          </p>
        </section>

        {/* 4 */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            4. Contenido Generado por Usuarios
          </h2>
          <p className="text-stone-600">
            La plataforma permite publicar reseñas, puntajes y comentarios ("Contenido"). Sos responsable del contenido que publiques. No está permitido subir contenido ofensivo, discriminatorio, difamatorio o que promueva el consumo irresponsable de alcohol.
          </p>
          <p className="text-stone-600 mt-2">
            Nos reservamos el derecho de moderar, editar o eliminar contenido que incumpla estas normas, sin previo aviso.
          </p>
        </section>

        {/* 5 */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            5. Propiedad Intelectual
          </h2>
          <p className="text-stone-600">
            Todo el contenido del sitio, incluyendo diseño, textos, imágenes y el minijuego, pertenece a "El Camino de la Cerveza" o a sus respectivos autores. No está permitido reproducir, distribuir o utilizar este contenido sin autorización.
          </p>
        </section>

        {/* 6 */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            6. El Minijuego
          </h2>
          <p className="text-stone-600">
            El minijuego "La Cruzada de Heinrich" se ofrece con fines de entretenimiento. Las recompensas virtuales (como medallas o logros) no tienen valor económico ni pueden ser canjeadas por bienes o servicios reales.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            7. Limitación de Responsabilidad
          </h2>
          <p className="text-stone-600">
            La información sobre cervezas, estilos y cervecerías es de carácter informativo y puede no ser exacta o estar actualizada en todos los casos. El uso de la plataforma es bajo tu propia responsabilidad.
          </p>
        </section>

        {/* 8 */}
        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            8. Modificaciones
          </h2>
          <p className="text-stone-600">
            Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán publicados en esta página y entrarán en vigencia desde su publicación.
          </p>
        </section>

        {/* FRASE DE MARCA */}
        <p className="text-stone-600 italic text-center">
          Este proyecto nace del amor por la cerveza. Disfrutá, explorá y compartí con responsabilidad.
        </p>

        {/* FOOTER */}
        <div className="mt-12 pt-8 border-t border-stone-200 text-center space-y-2">
          <p className="text-stone-500 text-sm">
            Para consultas, podés escribirnos a: contacto@elcaminodelacerveza.com
          </p>
          <Link
            href="/"
            className="text-amber-600 font-bold hover:text-amber-700 transition"
          >
            ← Volver al inicio
          </Link>
        </div>

      </div>
    </div>
  );
}