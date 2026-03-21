export default function LoadingNota() {
  return (
    <div className="max-w-3xl mx-auto py-20 px-4 sm:px-6 flex flex-col items-center justify-center min-h-[60vh] bg-stone-50 md:bg-transparent">
      <div className="bg-white p-10 md:p-14 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center text-center animate-pulse w-full">
        
        {/* Ícono animado */}
        <div className="w-24 h-24 mb-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center text-5xl shadow-inner border border-amber-200">
          🗞️
        </div>
        
        <h2 className="text-3xl font-black text-stone-900 mb-3 tracking-tight">Imprimiendo la nota...</h2>
        <p className="text-stone-500 font-medium text-lg">
          Buscando en los archivos de cultura cervecera.
        </p>
        
        {/* Líneas falsas simulando texto cargando */}
        <div className="w-full mt-10 space-y-3 opacity-50">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded-full w-full mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded-full w-5/6 mx-auto"></div>
        </div>

        {/* Barra de progreso fluida (estilo tinta/cerveza) */}
        <div className="w-full max-w-xs h-1.5 bg-gray-100 rounded-full mt-10 overflow-hidden relative">
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