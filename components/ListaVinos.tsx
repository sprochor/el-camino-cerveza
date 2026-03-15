import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default async function ListaVinos({ bodegaId }: { bodegaId: number }) {
  const { data: vinos } = await supabase
    .from('vinos')
    .select('*, resenas_vinos(rating)')
    .eq('bodega_id', bodegaId)
    .order('name')

  if (!vinos || vinos.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Vinos de la Bodega</h2>
        <p className="text-gray-500 italic bg-slate-50 p-4 rounded-lg">Esta bodega aún no tiene vinos cargados en el sistema.</p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      {/* 👇 Título actualizado */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Vinos de la Bodega 🍷</h2>
      
      {/* 👇 Agregamos max-h-[600px] y overflow-y-auto para crear la caja con scroll */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[600px] overflow-y-auto pr-2">
        {vinos.map((vino) => {
          const resenas = vino.resenas_vinos || []
          const cantidadResenas = resenas.length
          const promedio = cantidadResenas > 0
            ? (resenas.reduce((suma: number, resena: any) => suma + resena.rating, 0) / cantidadResenas).toFixed(1)
            : '--'

          return (
            <div key={vino.id} className="border border-red-100 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition flex flex-col group">
              
              <div className="flex gap-4 mb-4">
                {/* --- 👇 MINIATURA DE LA BOTELLA AJUSTADA --- */}
                <div className="w-20 h-24 shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                  {vino.image_url ? (
                    // 👇 Cambiamos object-cover por object-contain y agregamos padding (p-2)
                    <img src={vino.image_url} alt={vino.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition duration-300" />
                  ) : (
                    <span className="text-3xl opacity-50">🍷</span>
                  )}
                </div>

                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-extrabold text-lg text-gray-900 leading-tight group-hover:text-red-800 transition">{vino.name}</h4>
                  </div>
                  <span className="inline-block bg-red-50 text-red-800 text-xs px-2 py-1 rounded-md border border-red-100 font-bold uppercase tracking-wider mb-2">
                    {vino.cepa}
                  </span>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {vino.description}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-3">
                <div className="text-sm font-bold text-gray-700 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                  {cantidadResenas > 0 ? (
                    <>
                      <span className="text-red-800 text-lg">🍷</span> 
                      <span className="text-base">{promedio}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-400 text-lg opacity-50">🍷</span> 
                      <span className="text-gray-400 font-normal">--</span>
                    </>
                  )}
                  <span className="text-xs text-gray-400 font-medium ml-1">
                    ({cantidadResenas})
                  </span>
                </div>

                <Link href={`/vinos/${vino.id}`} className="text-sm text-red-800 font-bold hover:text-red-900 hover:underline">
                  Ver ficha y calificar →
                </Link>
              </div>

            </div>
          )
        })}
      </div>
    </div>
  )
}