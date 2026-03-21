import { useState } from "react";

const OUTRO_SCRIPT = [
  {
    bg: "bg-black",
    title: "🕒 2 SEMANAS DESPUÉS...",
    subtitle: "El gran día de la degustación ha llegado.\nHeinrich da a probar su cerveza a los locales...",
    text: "",
    portrait: null,
  },
  {
    bg: "bg-[url('/images/juego/outro-pancho.webp')] bg-cover bg-center",
    text: "Gringo... te aprecio, pero esto tiene gusto a agua de zanja. Y de las malas.",
    portrait: "/images/juego/pancho-annoyed.webp",
  },
  {
    bg: "bg-[url('/images/juego/outro-pulpero.webp')] bg-cover bg-center",
    text: "Se lo advertí. Y ahora va a tener que limpiar mi pulperia!",
    portrait: "/images/juego/pulpero-serious.webp",
  },
  {
    // 💡 ACÁ PODÉS PONER OTRA (ej: 'outro-panadera.png')
    bg: "bg-[url('/images/juego/outro-panadera.webp')] bg-cover bg-center",
    text: "¡Mi pobre masa madre! No merecía terminar en esta bebida tan mala...",
    portrait: "/images/juego/panadera-annoyed.png",
  },
  {
    // 💡 ACÁ PODÉS PONER EL DESASTRE FINAL (ej: 'outro-heinrich-triste.png')
    bg: "bg-[url('/images/juego/outro-heinrich-triste.webp')] bg-cover bg-center",
    text: "Ach du lieber... ¡Sabe a rayos! Esto es un desastre.\n\ Pero aun no me ire de este lugar, con mi libro de recetas y lupulo verdadero volvere a intentarlo",
    portrait: "/images/juego/heinrich-surprised.webp",
  },
  {
    bg: "bg-black",
    title: "🍻 CONTINUARÁ...",
    subtitle: "PRÓXIMAMENTE CAPÍTULO 2\n\n¿Podrá Heinrich mejorar la cerveza? ¿El pueblo le dará otra oportunidad?\n¿Qué estarán tramando los ingleses en el puerto?\n¿Whitmore solo comercia cerveza Porter?",
    text: "[ Haz clic para volver al inicio ]",
    portrait: null,
  }
];

interface OutroProps {
  resetGame: () => void;
}

export default function OutroCinematic({ resetGame }: OutroProps) {
  const [step, setStep] = useState(0);
  const [fade, setFade] = useState(false);

  // 👇 LA MISMA MAGIA DE LA INTRO PARA NO PARPADEAR SI EL FONDO ES EL MISMO 👇
  const handleNextSlide = () => {
    if (fade) return;

    const currentBg = OUTRO_SCRIPT[step].bg;
    const isLastSlide = step === OUTRO_SCRIPT.length - 1;
    const nextBg = !isLastSlide ? OUTRO_SCRIPT[step + 1].bg : null;

    if (currentBg === nextBg) {
      // ⚡ MISMO FONDO: Cambiamos el texto al instante
      setStep((prev) => prev + 1);
    } else {
      // 🌒 DISTINTO FONDO (O FINAL): Hacemos fundido a negro
      setFade(true);
      setTimeout(() => {
        if (!isLastSlide) {
          setStep((prev) => prev + 1);
          setFade(false);
        } else {
          // Al terminar la última diapositiva, reiniciamos el juego
          resetGame();
        }
      }, 700);
    }
  };

  return (
    <div
      className="w-full max-w-5xl mx-auto my-auto bg-[#c0c0c0] p-3 rounded-lg border-t-4 border-l-4 border-white border-b-4 border-r-4 border-[#555] shadow-2xl relative z-30 flex flex-col cursor-pointer"
      onClick={handleNextSlide}
    >
      {/* HEADER DE LA OUTRO */}
      <div className="flex justify-between items-center bg-[#0000aa] text-white px-2 md:px-3 py-1 mb-3 border-2 border-white/20">
        <span className="font-retro text-lg md:text-xl uppercase tracking-widest truncate max-w-[50%]">
          EPÍLOGO
        </span>
      </div>

      {/* PANTALLA DE LA CINEMÁTICA */}
      <div className={`transition-opacity duration-700 ease-in-out w-full flex flex-col ${fade ? "opacity-0" : "opacity-100"}`}>
        <div className={`w-full aspect-video ${OUTRO_SCRIPT[step].bg} relative overflow-hidden border-4 border-[#555] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-4 md:p-10`}>
          {OUTRO_SCRIPT[step].title && (
            <>
              <h1 className="font-retro text-4xl md:text-7xl text-[#ffaa00] tracking-widest text-center drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
                {OUTRO_SCRIPT[step].title}
              </h1>
              <h2 className="font-retro text-2xl md:text-4xl text-white tracking-widest text-center mt-6 whitespace-pre-line drop-shadow-[0_3px_3px_rgba(0,0,0,1)]">
                {OUTRO_SCRIPT[step].subtitle}
              </h2>
            </>
          )}
        </div>

        {/* CAJA DE TEXTOS INFERIOR */}
        <div className="mt-3 bg-black border-4 border-[#555] p-4 flex gap-6 h-48 md:h-56 items-center">
          {OUTRO_SCRIPT[step].portrait && (
            <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 border-2 border-[#555] bg-[#333] overflow-hidden">
              <img src={OUTRO_SCRIPT[step].portrait} alt="Portrait" className="w-full h-full object-cover pixelated" />
            </div>
          )}
          {/* 👇 ELIMINAMOS EL 'md:text-left' PARA QUE QUEDE 100% CENTRADO 👇 */}
          <div className="text-[#55ff55] font-retro text-2xl md:text-4xl leading-tight whitespace-pre-line w-full text-center">
            {OUTRO_SCRIPT[step].text || ""}
          </div>
        </div>
      </div>
    </div>
  );
}