export default function LoadingCerveza() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-4 flex flex-col items-center justify-center min-h-[60vh] bg-stone-50 md:bg-transparent">
      <div className="bg-white p-12 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center animate-pulse w-full max-w-lg mx-auto">
        <div className="w-24 h-24 mb-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-5xl shadow-sm border-2 border-amber-200">
          🍺
        </div>
        <h2 className="text-3xl font-extrabold text-stone-800 mb-3">Sirviendo la pinta...</h2>
        <p className="text-gray-500 font-medium text-lg">
          Enfriando el vaso y buscando el veredicto de la comunidad.
        </p>
        
        {/* Barra de carga animada (color cerveza) */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mt-10 overflow-hidden relative">
          <div className="absolute top-0 left-0 h-full bg-amber-500 w-1/3 animate-[translateX_1.5s_ease-in-out_infinite] rounded-full"></div>
        </div>
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes translateX {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}} />
      </div>
    </div>
  )
}