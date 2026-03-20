import Link from "next/link";

export default function PrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 md:py-24 text-stone-800">
      <div className="text-center mb-12">
        <span className="text-amber-600 font-bold tracking-widest uppercase text-sm">
          Legal
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-stone-900 mt-2 mb-4 tracking-tight">
          Políticas de Privacidad
        </h1>
        <p className="text-stone-500">Última actualización: Marzo 2026</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-stone-200 space-y-8 text-lg leading-relaxed">

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            1. Información que recopilamos
          </h2>
          <p className="text-stone-600">
            Al registrarte en "El Camino de la Cerveza", recopilamos tu dirección de correo electrónico, nombre de perfil (opcional), imagen de avatar y el historial de tus reseñas y puntajes otorgados a las cervezas.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            2. Uso de la Información
          </h2>
          <p className="text-stone-600">Utilizamos tus datos para:</p>
          <ul className="list-disc ml-6 mt-2 text-stone-600 space-y-2">
            <li>Mantener y mostrar tu bitácora personal en la sección "Mi Camino".</li>
            <li>Calcular el promedio colectivo de las cervezas y cervecerías.</li>
            <li>Otorgarte medallas por tu progreso y por completar "La Cruzada de Heinrich".</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            3. Protección de Datos
          </h2>
          <p className="text-stone-600">
            Tus datos están protegidos y almacenados mediante servicios seguros. No vendemos ni compartimos tu información personal con terceros con fines comerciales o publicitarios sin tu consentimiento expreso.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            4. Autenticación y Servicios Externos
          </h2>
          <p className="text-stone-600">
            El registro y autenticación de usuarios se gestiona a través de Supabase, una plataforma que cumple con estándares modernos de seguridad y protección de datos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            5. Cookies y almacenamiento local
          </h2>
          <p className="text-stone-600">
            Utilizamos cookies esenciales y almacenamiento local (localStorage) para mantener tu sesión activa y recordar si verificaste ser mayor de edad para acceder a la plataforma.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            6. Derechos del Usuario
          </h2>
          <p className="text-stone-600">
            Podés solicitar en cualquier momento la actualización o eliminación de tu información personal. Para hacerlo, podés contactarnos a través de los canales disponibles en la sección de contacto.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-stone-900 mb-3 border-b border-stone-100 pb-2">
            7. Uso Responsable
          </h2>
          <p className="text-stone-600">
            Este sitio está destinado a personas mayores de edad según la legislación vigente. Promovemos el consumo responsable de alcohol.
          </p>
        </section>

        <p className="text-stone-600 italic text-center">
          Así como cuidamos cada cerveza que probás, también cuidamos tus datos.
        </p>

        <div className="mt-12 pt-8 border-t border-stone-200 text-center space-y-2">
          <p className="text-stone-500 text-sm">
            Para consultas sobre privacidad, podés escribirnos a: contacto@elcaminodelacerveza .com
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