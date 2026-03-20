import Link from "next/link";
import { ActionType, Item } from "@/engine/types";

interface GameHUDProps {
  sceneName: string;
  isMuted: boolean;
  toggleMute: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  isDebugMode: boolean;
  setIsDebugMode: (val: boolean) => void;
  resetGame: (e?: React.MouseEvent) => void;
  showInventory: boolean;
  setShowInventory: (val: boolean) => void;
  inventory: Item[];
  currentAction: ActionType;
  setCurrentAction: (action: ActionType) => void;
  hoverText: string;
  portraitUrl: string | null;
  message: string;
  children: React.ReactNode;
}

const actionVerb = {
  WALK: "Ir a",
  LOOK: "Mirar",
  INTERACT: "Tocar",
  TALK: "Hablar a",
};

export default function GameHUD({
  sceneName,
  isMuted,
  toggleMute,
  isFullscreen,
  toggleFullscreen,
  isDebugMode,
  setIsDebugMode,
  resetGame,
  showInventory,
  setShowInventory,
  inventory,
  currentAction,
  setCurrentAction,
  hoverText,
  portraitUrl,
  message,
  children,
}: GameHUDProps) {
  return (
    <>
      {/* === HEADER (BOTONERA SUPERIOR) === */}
      <div className="flex justify-between items-center bg-[#0000aa] text-white px-2 md:px-3 py-1 mb-3 border-2 border-white/20">
        <span className="font-retro text-lg md:text-xl uppercase tracking-widest truncate max-w-[30%]">
          {sceneName}
        </span>
        <div className="flex gap-2 md:gap-4 flex-wrap justify-end">
          <button
            onClick={toggleMute}
            className={`font-retro text-sm md:text-lg hover:text-[#55ffff] ${isMuted ? "text-[#aaaaaa]" : "text-white"}`}
          >
            Audio [{isMuted ? "OFF" : "ON"}]
          </button>
          <button
            onClick={toggleFullscreen}
            className="font-retro text-sm md:text-lg hover:text-[#55ffff] text-white hidden sm:block"
          >
            Pantalla [{isFullscreen ? "><" : "[]"}]
          </button>
          <button
            onClick={() => setIsDebugMode(!isDebugMode)}
            className={`font-retro text-sm md:text-lg hover:text-[#55ff55] ${isDebugMode ? "text-[#55ff55]" : "text-white"}`}
          >
            Debug [{isDebugMode ? "ON" : "OFF"}]
          </button>
          <button
            onClick={resetGame}
            className="font-retro text-sm md:text-lg hover:text-[#ffff55]"
          >
            Reiniciar [↺]
          </button>
          {/* Reemplazamos el <Link> por este botón */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (
                window.confirm(
                  "¿Seguro que querés cerrar el juego y perder tu progreso?",
                )
              ) {
                window.location.href = "/juego"; // O la ruta a tu menú principal
              }
            }}
            className="font-retro text-sm md:text-lg hover:text-[#ff5555]"
          >
            Cerrar [X]
          </button>
        </div>
      </div>

      {/* === OVERLAY DEL INVENTARIO === */}
      {showInventory && (
        <div className="absolute inset-0 bg-black/80 z-40 flex items-center justify-center pointer-events-auto">
          <div className="bg-[#c0c0c0] border-4 border-white border-b-[#555] border-r-[#555] p-6 w-3/4 max-w-md">
            <div className="flex justify-between items-center mb-4 border-b-2 border-[#555] pb-2">
              <h2 className="font-retro text-3xl text-black">INVENTARIO</h2>
              <button
                onClick={() => setShowInventory(false)}
                className="font-retro text-2xl text-red-600"
              >
                X
              </button>
            </div>
            {inventory.length === 0 ? (
              <p className="font-retro text-xl text-[#333]">
                La mochila está vacía.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-4">
                {inventory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-black/10 border-2 border-black/20 flex flex-col items-center justify-center p-2 h-24"
                    title={item.name}
                  >
                    {/* 👇 SI TIENE IMAGEN, LA MUESTRA. SI NO, USA EL EMOJI 👇 */}
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 object-contain pixelated drop-shadow-md"
                      />
                    ) : (
                      <span className="text-4xl drop-shadow-md">
                        {item.icon}
                      </span>
                    )}

                    <span className="font-retro text-xs text-black mt-2 leading-none text-center">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {children}
      {/* === INTERFAZ INFERIOR (ACCIONES Y DIÁLOGOS) === */}
      <div className="mt-3 bg-black border-4 border-[#555] p-3 md:p-4 flex flex-col md:flex-row gap-4 h-48 md:h-56">
        {/* Panel de Botones */}
        <div className="w-full md:w-1/3 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 content-start">
            {[
              { type: "WALK", label: "Caminar" },
              { type: "LOOK", label: "Mirar" },
              { type: "INTERACT", label: "Tocar" },
              { type: "TALK", label: "Hablar" },
            ].map((action) => (
              <button
                key={action.type}
                onClick={() => setCurrentAction(action.type as ActionType)}
                className={`font-retro text-2xl md:text-3xl uppercase tracking-wider text-left pl-2 transition-colors ${
                  currentAction === action.type
                    ? "text-[#55ffff]"
                    : "text-[#aaaaaa] hover:text-white"
                }`}
              >
                {action.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowInventory(!showInventory)}
            className="mt-2 bg-[#555] hover:bg-[#777] text-white border-2 border-[#888] border-b-black border-r-black font-retro text-2xl py-1 flex justify-center items-center gap-2"
          >
            🎒 VER MOCHILA ({inventory.length})
          </button>
        </div>

        {/* Panel de Texto */}
        <div className="w-full md:w-2/3 flex flex-col border-l-4 border-[#333] pl-4">
          <div className="h-8 text-[#55ff55] font-retro text-2xl uppercase tracking-wide mb-2">
            {hoverText ? `${actionVerb[currentAction]} ${hoverText}` : ""}
          </div>
          <div className="flex-1 flex items-start gap-4 mt-2">
            {portraitUrl && portraitUrl !== "null" && (
              <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 border-2 border-[#555] bg-[#333] overflow-hidden">
                <img
                  src={portraitUrl}
                  alt="Hablando"
                  className="w-full h-full object-cover pixelated"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
            <div className="text-white font-retro text-2xl md:text-[1.7rem] leading-none pt-1">
              {message}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
