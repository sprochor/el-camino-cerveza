import { useState } from "react";

const INTRO_SCRIPT = [
  {
    bg: "bg-[url('/images/juego/intro-mar.webp')] bg-cover bg-center",
    text: "Europa — 1806\n\nUn joven maestro cervecero bávaro,\ndevoto de la pureza y el buen sabor,\nemprende un viaje hacia el Nuevo Mundo…",
    portrait: null,
  },
  {
    bg: "bg-[url('/images/juego/intro-mar.webp')] bg-cover bg-center",
    text: "Dicen que en América hay oportunidades…\n\nY también gente sedienta.",
    portrait: "/images/juego/heinrich-neutral.webp",
  },
  {
    bg: "bg-[url('/images/juego/intro-bodega.webp')] bg-cover bg-center",
    text: "*Revisa un barril de la bodega, olfatea y hace una mueca*\n\nEsto no es cerveza.",
    portrait: "/images/juego/heinrich-surprised.png",
  },
  {
    bg: "bg-[url('/images/juego/intro-camarote.webp')] bg-cover bg-center",
    text: "— Señor Whitmore… ¿seguro que debemos llevar esta carga?",
    portrait: null,
  },
  {
    bg: "bg-[url('/images/juego/intro-camarote.webp')] bg-cover bg-center",
    text: "— Si, el Imperio Británico siempre tiene… intereses.",
    portrait: "/images/juego/edward-smirk.png",
  },
  {
    bg: "bg-[url('/images/juego/intro-tormenta.webp')] bg-cover bg-center",
    text: "¡CRACK! La tormenta sacude el barco.\nUn barril se suelta… rueda… y se rompe.\n\nMarca: CROWN PROPERTY.",
    portrait: null,
  },
  {
    bg: "bg-[url('/images/juego/fondo-puerto.webp')] bg-cover bg-center",
    text: "Buenos Aires — Virreinato del Río de la Plata\n\nBueno… alguien tiene que enseñarles a beber cerveza.",
    portrait: "/images/juego/heinrich-happy.png",
  },
  {
    bg: "bg-black",
    title: "LA CRUZADA DE HEINRICH",
    subtitle: "CAPÍTULO 1\n\nEL BARRIL EQUIVOCADO",
    text: "[ Haz clic para comenzar ]",
    portrait: null,
  },
];

interface IntroProps {
  onFinish: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isMuted: boolean;
  toggleMute: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  gameWrapperRef: any; // Lo dejamos en la interfaz para que no tire error, pero ya no lo usamos acá
}

export default function IntroCinematic({
  onFinish,
  audioRef,
  isMuted,
  toggleMute,
  isFullscreen,
  toggleFullscreen,
}: IntroProps) {
  const [introStep, setIntroStep] = useState(0);
  const [introFade, setIntroFade] = useState(false);

  // === SALTAR INTRO ===
  const skipIntro = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onFinish(); // Le avisamos a page.tsx que arranque el juego
  };

  const handleNextSlide = () => {
    if (introFade) return;

    // Si es el primer clic, arrancamos la música
    if (introStep === 0 && audioRef.current) {
      audioRef.current.play().catch((e) => console.log("Audio bloqueado", e));
    }

    // Chequeamos si la próxima escena tiene el mismo fondo
    const currentBg = INTRO_SCRIPT[introStep].bg;
    const isLastSlide = introStep === INTRO_SCRIPT.length - 1;
    const nextBg = !isLastSlide ? INTRO_SCRIPT[introStep + 1].bg : null;

    if (currentBg === nextBg) {
      // ⚡ MISMO FONDO: Cambiamos al instante sin fade a negro
      setIntroStep((prev) => prev + 1);
    } else {
      // 🌒 DISTINTO FONDO (O FINAL): Hacemos la transición suave normal
      setIntroFade(true);

      setTimeout(() => {
        if (!isLastSlide) {
          setIntroStep((prev) => prev + 1);
          setIntroFade(false);
        } else {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
          }
          onFinish(); // Terminó la intro, arranca el juego
        }
      }, 700);
    }
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto my-auto bg-[#c0c0c0] p-3 rounded-lg border-t-4 border-l-4 border-white border-b-4 border-r-4 border-[#555] shadow-2xl relative z-30 flex flex-col cursor-pointer"
      onClick={handleNextSlide}
    >
      {/* HEADER DE LA INTRO */}
      <div
        className="flex justify-between items-center bg-[#0000aa] text-white px-2 md:px-3 py-1 mb-3 border-2 border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-retro text-lg md:text-xl uppercase tracking-widest truncate max-w-[30%]">
          LA CRUZADA DE HEINRICH
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
            onClick={skipIntro}
            className="font-retro text-sm md:text-lg text-[#ffff55] hover:text-white"
          >
            Saltar Intro [{">>"}]
          </button>
        </div>
      </div>

      {/* PANTALLA DE LA CINEMÁTICA */}
      <div
        className={`transition-opacity duration-700 ease-in-out w-full flex flex-col ${introFade ? "opacity-0" : "opacity-100"}`}
      >
        <div
          className={`w-full aspect-video ${INTRO_SCRIPT[introStep].bg} relative overflow-hidden border-4 border-[#555] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center`}
        >
          {INTRO_SCRIPT[introStep].title && (
            <>
              <h1 className="font-retro text-6xl md:text-8xl text-[#ffaa00] tracking-widest text-center drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
                {INTRO_SCRIPT[introStep].title}
              </h1>
              <h2 className="font-retro text-3xl md:text-5xl text-white tracking-widest text-center mt-6 whitespace-pre-line drop-shadow-[0_3px_3px_rgba(0,0,0,1)]">
                {INTRO_SCRIPT[introStep].subtitle}
              </h2>
            </>
          )}
        </div>

        {/* CAJA DE TEXTOS INFERIOR */}
        <div className="mt-3 bg-black border-4 border-[#555] p-4 flex gap-6 h-48 md:h-56 items-center">
          {INTRO_SCRIPT[introStep].portrait && (
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 border-2 border-[#555] bg-[#333] overflow-hidden">
              <img 
                src={INTRO_SCRIPT[introStep].portrait} 
                alt="Portrait" 
                className="w-full h-full object-cover pixelated" 
              />
            </div>
          )}
          
          {/* 👇 ACÁ ESTÁ EL TEXT-CENTER APLICADO LIMPIO 👇 */}
          <div className="text-white font-retro text-2xl md:text-4xl leading-tight whitespace-pre-line w-full text-center">
            {INTRO_SCRIPT[introStep].text}
          </div>
        </div>

      </div>
    </div>
  );
}