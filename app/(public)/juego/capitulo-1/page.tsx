"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ActionType,
  Item,
  Hotspot,
  ActionResult,
  DialogueLine,
} from "@/engine/types";
import { ALL_SCENES } from "@/scenes";
// app/(public)/juego/capitulo-1/page.tsx (Pegar arriba del componente principal)

const INTRO_SCRIPT = [
  {
    // Escena 1 (A) - El Mar
    bg: "bg-[url('/images/juego/intro-mar.png')] bg-cover bg-center",
    text: "Europa — 1806\n\nUn joven maestro cervecero bávaro\nemprende un viaje hacia el Nuevo Mundo…",
    portrait: null,
  },
  {
    // Escena 1 (B) - El Mar
    bg: "bg-[url('/images/juego/intro-mar.png')] bg-cover bg-center",
    text: "Dicen que en América hay oportunidades…\n\nY también gente sedienta.",
    portrait: "/images/juego/heinrich-neutral.png",
  },
  {
    // Escena 2 - La Bodega
    bg: "bg-[url('/images/juego/intro-bodega.png')] bg-cover bg-center",
    text: "*Abre un barril de la bodega, olfatea y hace una mueca*\n\nEsto no es cerveza.",
    portrait: "/images/juego/heinrich-surprised.png",
  },
  {
    // Escena 3 - El Camarote
    bg: "bg-[url('/images/juego/intro-camarote.png')] bg-cover bg-center",
    text: "— Señor Whitmore, ¿seguro que debemos llevar esta carga?\n\n— El Imperio Británico siempre tiene… negocios.",
    portrait: "/images/juego/edward-smirk.png",
  },
  {
    // Escena 4 - La Tormenta
    bg: "bg-[url('/images/juego/intro-tormenta.png')] bg-cover bg-center",
    text: "¡CRACK! La tormenta azota el barco. \nUn barril rueda y se rompe.\n\nMarca: CROWN PROPERTY... Está lleno de pólvora.",
    portrait: "/images/juego/heinrich-concerned.png",
  },
  {
    bg: "bg-[url('/images/juego/fondo-puerto.png')] bg-cover bg-center", // Escena 5 - Llegada
    text: "Buenos Aires — Virreinato del Río de la Plata\n\nBueno… alguien tiene que enseñarles a beber cerveza.",
    portrait: "/images/juego/heinrich-happy.png",
  },
  {
    bg: "bg-black",
    title: "LA CRUZADA DE HEINRICH",
    subtitle: "CAPÍTULO 1\n\nEL BARRIL EQUIVOCADO", // <-- NUEVO
    text: "[ Haz clic para comenzar ]",
    portrait: null,
  },
];

export default function GameEngine() {
  const [currentSceneId, setCurrentSceneId] = useState("puerto");
  const [currentAction, setCurrentAction] = useState<ActionType>("WALK");
  const [inventory, setInventory] = useState<Item[]>([]);
  const [flags, setFlags] = useState<string[]>([]);
  const [showInventory, setShowInventory] = useState(false);

  const [message, setMessage] = useState("");
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);
  const [charPos, setCharPos] = useState({ x: 40, y: 85 });
  const [charDirection, setCharDirection] = useState<
    "south" | "east" | "west" | "north"
  >("south");
  const [isWalking, setIsWalking] = useState(false);
  const [walkDuration, setWalkDuration] = useState(800); // <-- NUEVO ESTADO
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const [currentDialogueQueue, setCurrentDialogueQueue] = useState<
    DialogueLine[]
  >([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [gameState, setGameState] = useState<"INTRO" | "PLAYING">("INTRO");
  const [introStep, setIntroStep] = useState(0);
  const [introFade, setIntroFade] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  // === 1. PRIMERO DECLARAMOS LAS REFERENCIAS DE AUDIO ===
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const puertoAudioRef = useRef<HTMLAudioElement | null>(null);
  const walkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flagsRef = useRef<string[]>(flags);
  const inventoryRef = useRef<Item[]>(inventory);

  const screenRef = useRef<HTMLDivElement>(null);
  const scene = ALL_SCENES[currentSceneId as keyof typeof ALL_SCENES];
  const [maskData, setMaskData] = useState<ImageData | null>(null);

  // === 2. DESPUÉS DECLARAMOS LA FUNCIÓN DE REINICIO (Que ahora sí sabe qué es puertoAudioRef) ===
  const resetGame = (e?: React.MouseEvent) => {
    // Esto evita que el clic en "Reiniciar" dispare clics por accidente en el fondo
    if (e) e.stopPropagation();

    setInventory([]);
    setFlags([]);
    setCurrentSceneId("puerto");
    setCharPos({ x: 40, y: 85 });
    setCharDirection("south");
    setMessage("");
    setPortraitUrl(null);
    setCurrentDialogueQueue([]);
    setDialogueIndex(0);
    setIntroStep(0);
    setIntroFade(false);
    setIsDebugMode(false); // Apagamos el debug por las dudas
    setGameState("INTRO");

    // Reiniciamos AMBAS pistas de música para que el juego quede en silencio total
    if (puertoAudioRef.current) {
      puertoAudioRef.current.pause();
      puertoAudioRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };
  useEffect(() => {
    flagsRef.current = flags;
  }, [flags]);
  useEffect(() => {
    inventoryRef.current = inventory;
  }, [inventory]);
  // === 3. FINALMENTE INICIALIZAMOS LOS AUDIOS ===
  useEffect(() => {
    // Solo creamos las instancias si estamos del lado del cliente (Navegador)
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/audio/intro-theme.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;

      puertoAudioRef.current = new Audio("/audio/puerto-theme.mp3");
      puertoAudioRef.current.loop = true;
      puertoAudioRef.current.volume = 0.4;
    }
  }, []);

  // Control de la música del puerto
  useEffect(() => {
    if (gameState === "PLAYING" && currentSceneId === "puerto") {
      puertoAudioRef.current
        ?.play()
        .catch((e) => console.log("Audio bloqueado", e));
    } else {
      if (puertoAudioRef.current) {
        puertoAudioRef.current.pause();
      }
    }
  }, [gameState, currentSceneId]);
  useEffect(() => {
    if (scene && scene.maskUrl) {
      const img = new Image();
      img.src = scene.maskUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setMaskData(ctx.getImageData(0, 0, img.width, img.height));
        }
      };
    } else {
      setMaskData(null);
    }
  }, [currentSceneId, scene]);

  const parseMessage = (rawText: string) => {
    if (rawText.includes("|")) {
      const parts = rawText.split("|");
      setPortraitUrl(parts[0]);
      setMessage(parts[1]);
    } else {
      setPortraitUrl(null);
      setMessage(rawText);
    }
  };

  useEffect(() => {
    if (scene) {
      setCharPos({ x: scene.startX, y: scene.startY });
      if (currentSceneId === "puerto" && !message) {
        parseMessage(
          "/images/juego/heinrich-neutral.png|Llegaste a Buenos Aires.",
        );
      }
    }
  }, [currentSceneId]);

  const moveCharacter = (
    targetX: number,
    targetY: number,
    callback?: () => void,
  ) => {
    let finalX = targetX;
    let finalY = targetY;

    if (maskData) {
      const steps = 50;
      let lastValidX = charPos.x;
      let lastValidY = charPos.y;

      for (let i = 1; i <= steps; i++) {
        const testX = charPos.x + (targetX - charPos.x) * (i / steps);
        const testY = charPos.y + (targetY - charPos.y) * (i / steps);
        const px = Math.floor((testX / 100) * maskData.width);
        const py = Math.floor((testY / 100) * maskData.height);
        const index = (py * maskData.width + px) * 4;

        if (maskData.data[index] > 128) {
          lastValidX = testX;
          lastValidY = testY;
        } else {
          break;
        }
      }
      finalX = lastValidX;
      finalY = lastValidY;
    } else {
      const safePos = scene.limitMovement(targetX, targetY);
      finalX = safePos.x;
      finalY = safePos.y;
    }

    const diffX = finalX - charPos.x;
    const diffY = finalY - charPos.y;

    if (Math.abs(diffX) > Math.abs(diffY))
      setCharDirection(diffX < 0 ? "west" : "east");
    else setCharDirection(diffY < 0 ? "north" : "south");

    // === CÁLCULO DE VELOCIDAD CONSTANTE ===
    const distance = Math.sqrt(diffX * diffX + diffY * diffY);
    const calculatedDuration = Math.max(300, Math.floor(distance * 40));

    setWalkDuration(calculatedDuration);
    setCharPos({ x: finalX, y: finalY });
    setIsWalking(true);

    if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);

    walkTimeoutRef.current = setTimeout(() => {
      setIsWalking(false);
      setCharDirection("south");
      if (callback) callback();
    }, calculatedDuration);
  }; // <-- ¡ESTA ES LA LLAVE QUE FALTABA!
  const handleScreenClick = (e: React.MouseEvent) => {
    // Si hay un diálogo en curso, el clic solo avanza al siguiente mensaje
    if (currentDialogueQueue.length > 0) {
      if (dialogueIndex < currentDialogueQueue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
        const nextLine = currentDialogueQueue[dialogueIndex + 1];
        setPortraitUrl(nextLine.portrait || null);
        setMessage(nextLine.text);
      } else {
        // Fin del diálogo
        setCurrentDialogueQueue([]);
        setDialogueIndex(0);
        setMessage("");
        setPortraitUrl(null);
      }
      return; // Detenemos la ejecución aquí para que no camine
    }

    if (currentAction !== "WALK" || !screenRef.current) return;
    const rect = screenRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    moveCharacter(x, y);
    setMessage("");
    setPortraitUrl(null);
  };

  // Función unificada para el fundido a negro
  const triggerTransition = (newSceneId: string) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSceneId(newSceneId);
      setPortraitUrl(null);
      setMessage("");
      setTimeout(() => setIsTransitioning(false), 500);
    }, 500);
  };

  const handleHotspotClick = (e: React.MouseEvent, hotspot: Hotspot) => {
    e.stopPropagation();

    if (currentDialogueQueue.length > 0) return;

    if (currentAction === "WALK") {
      moveCharacter(hotspot.walkToX, hotspot.walkToY, () => {
        // Usamos la memoria fresca
        const result = hotspot.onInteract(
          inventoryRef.current,
          flagsRef.current,
        );
        if (result.transition) triggerTransition(result.transition);
      });

      return;
    }

    moveCharacter(hotspot.walkToX, hotspot.walkToY, () => {
      let result: ActionResult;

      // USAMOS LA MEMORIA FRESCA DE LOS REFS EN VEZ DEL ESTADO VIEJO
      const currentFlags = flagsRef.current;
      const currentInventory = inventoryRef.current;

      if (currentAction === "LOOK")
        result = hotspot.onLook(currentInventory, currentFlags);
      else if (currentAction === "INTERACT")
        result = hotspot.onInteract(currentInventory, currentFlags);
      else result = hotspot.onTalk(currentInventory, currentFlags);

      if (
        result.addItem &&
        !currentInventory.some((i) => i.id === result.addItem?.id)
      ) {
        setInventory((prev) => [...prev, result.addItem!]);
      }
      if (result.setFlag && !currentFlags.includes(result.setFlag)) {
        setFlags((prev) => [...prev, result.setFlag!]);
      }

      if (result.transition) {
        triggerTransition(result.transition);
      } else if (result.dialogue && result.dialogue.length > 0) {
        setCurrentDialogueQueue(result.dialogue);
        setDialogueIndex(0);
        setPortraitUrl(result.dialogue[0].portrait || null);
        setMessage(result.dialogue[0].text);
      } else if (result.text) {
        parseMessage(result.text);
      }
    });
  };
  const actionVerb = {
    WALK: "Ir a",
    LOOK: "Mirar",
    INTERACT: "Tocar",
    TALK: "Hablar a",
  };
  // === CONTROL DE AUDIO Y PANTALLA COMPLETA ===
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) audioRef.current.muted = newMuted;
    if (puertoAudioRef.current) puertoAudioRef.current.muted = newMuted;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log("Error al intentar pantalla completa:", err);
      });
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  // Escuchar si el usuario sale de pantalla completa con la tecla ESC
  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);
  if (!scene) return <div className="text-white">Cargando escena...</div>;

  // === RENDERIZADO DE LA INTRO CINEMÁTICA ===
  if (gameState === "INTRO") {
    const currentSlide = INTRO_SCRIPT[introStep];

    const handleNextSlide = () => {
      if (introFade) return;

      // NUEVO: Reproducir música en el primer clic
      if (introStep === 0 && audioRef.current) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio bloqueado por el navegador", e));
      }

      setIntroFade(true);

      setTimeout(() => {
        if (introStep < INTRO_SCRIPT.length - 1) {
          setIntroStep((prev) => prev + 1);
          setIntroFade(false);
        } else {
          // NUEVO: Detener la música al terminar la intro
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reiniciar la pista
          }

          setInventory([]);
          setFlags([]);
          setMessage("");
          setPortraitUrl(null);
          setGameState("PLAYING");
          setIntroFade(false);
        }
      }, 700);
    };
    return (
      <div
        className="bg-[#1a1a1a] min-h-screen flex flex-col items-center justify-center p-2 md:p-6 selection:bg-transparent"
        onClick={handleNextSlide}
      >
        {/* CSS y Fuentes */}
        <style
          dangerouslySetInnerHTML={{
            __html: `@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap'); .font-retro { font-family: 'VT323', monospace; } .pixelated { image-rendering: pixelated; }`,
          }}
        />

        {/* EFECTO CRT */}
        <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"></div>

        {/* MONITOR DE LA INTRO */}
        <div className="w-full max-w-5xl bg-[#c0c0c0] p-3 rounded-lg border-t-4 border-l-4 border-white border-b-4 border-r-4 border-[#555] shadow-2xl relative z-30 flex flex-col cursor-pointer">
          {/* === ENVOLTORIO CON FADE === */}
          <div
            className={`transition-opacity duration-700 ease-in-out w-full flex flex-col ${introFade ? "opacity-0" : "opacity-100"}`}
          >
            {/* PANTALLA DE LA CINEMÁTICA */}
            <div
              className={`w-full aspect-video ${currentSlide.bg} relative overflow-hidden border-4 border-[#555] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center`}
            >
              {currentSlide.title && (
                <>
                  <h1 className="font-retro text-6xl md:text-8xl text-[#ffaa00] tracking-widest text-center drop-shadow-[0_5px_5px_rgba(0,0,0,1)]">
                    {currentSlide.title}
                  </h1>
                  <h2 className="font-retro text-3xl md:text-5xl text-white tracking-widest text-center mt-6 whitespace-pre-line drop-shadow-[0_3px_3px_rgba(0,0,0,1)]">
                    {currentSlide.subtitle}
                  </h2>
                </>
              )}
            </div>

            {/* CAJA DE TEXTO (SUBTÍTULOS) */}
            <div className="mt-3 bg-black border-4 border-[#555] p-4 flex gap-6 h-48 md:h-56 items-center">
              {currentSlide.portrait && (
                <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 border-2 border-[#555] bg-[#333] overflow-hidden">
                  <img
                    src={currentSlide.portrait}
                    alt="Portrait"
                    className="w-full h-full object-cover pixelated"
                  />
                </div>
              )}
              <div className="text-white font-retro text-2xl md:text-4xl leading-tight whitespace-pre-line">
                {currentSlide.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // === RENDERIZADO DEL JUEGO NORMAL ===
  return (
    <div className="bg-[#1a1a1a] min-h-screen flex flex-col items-center justify-center p-2 md:p-6 selection:bg-transparent">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        .font-retro { font-family: 'VT323', monospace; }
        .pixelated { image-rendering: pixelated; }
        :root { --frame-width: 125px; --frame-height: 250px; --sheet-width: calc(var(--frame-width) * -8); }
        .heinrich-sprite { 
          width: var(--frame-width); 
          height: var(--frame-height); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes walk-anim { to { background-position-x: var(--sheet-width); } }
        .animate-walk { animation: walk-anim 0.6s steps(8) infinite; }
        .facing-south { background-image: url('/images/juego/heinrich-walk-south.png'); background-position-y: 0px; }
        .facing-east  { background-image: url('/images/juego/heinrich-walk-east.png');  background-position-y: 0px; }
        .facing-west  { background-image: url('/images/juego/heinrich-walk-west.png');  background-position-y: 0px; }
        .facing-north { background-image: url('/images/juego/heinrich-walk-north.png'); background-position-y: 0px; }
        .is-idle { background-position-x: 0px; animation: none; }
        :root {
          /* REEMPLAZÁ 125px POR (ANCHO TOTAL DE TU IMAGEN / 8) */
          --edward-frame-width: 129px; 
          --edward-frame-height: 192px; 
          
          /* Le decimos al motor que la hoja tiene 8 frames de largo */
          --edward-sheet-width: calc(var(--edward-frame-width) * -8); 
        }

        .edward-sprite { 
          width: var(--edward-frame-width); 
          height: var(--edward-frame-height); 
          background-image: url('/images/juego/edward-idle.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }

        /* Ahora la animación recorre toda la tira completa de corrido */
        @keyframes edward-idle-anim { 
          to { background-position-x: var(--edward-sheet-width); } 
        }

        .animate-edward-idle { 
          /* steps(8) hace que salte justo 8 veces. 
             Podés cambiar el "4s" a "6s" si querés que se mueva más lento */
          animation: edward-idle-anim 15s steps(8) infinite; 
        }
          /* === ANIMACIÓN PALOMAS === */
        :root {
          /* Dividimos el ancho total (1708px) por los 4 cuadros */
          --palomas-frame-width: calc(1708px / 4); 
          --palomas-frame-height: 146px;
          --palomas-sheet-width: -1708px; 
        }
        .palomas-sprite { 
          width: var(--palomas-frame-width); 
          height: var(--palomas-frame-height); 
          background-image: url('/images/juego/palomas-idle.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes palomas-idle-anim { 
          to { background-position-x: var(--palomas-sheet-width); } 
        }
        .animate-palomas-idle { 
          /* ¡Acá ajustamos a steps(4)! */
          animation: palomas-idle-anim 3s steps(4) infinite; 
        }
            /* === ANIMACIÓN PALOMA === */
        :root {
          /* Dividimos el ancho total (1336px) por los 8 cuadros */
          --paloma-frame-width: calc(1336px / 8); 
          --paloma-frame-height: 186px;
          --paloma-sheet-width: -1336px; 

          /* NUEVO: Variables para la paloma escapando (Ajustá 1128px al ancho real de paloma-escape.png) */
          --paloma-escape-width: calc(1128px / 8); 
          --paloma-escape-height: 204px; /* Ajustá si es distinto */
          --paloma-escape-sheet: -1128px;
        }

        .paloma-sprite { 
          width: var(--paloma-frame-width); 
          height: var(--paloma-frame-height); 
          background-image: url('/images/juego/paloma-idle.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes paloma-idle-anim { 
          to { background-position-x: var(--paloma-sheet-width); } 
        }
        .animate-paloma-idle { 
          animation: paloma-idle-anim 3s steps(8) infinite; 
        }

        /* === NUEVO: CÓDIGO DE ESCAPE === */
        .paloma-escape-sprite { 
          width: var(--paloma-escape-width); 
          height: var(--paloma-escape-height); 
          background-image: url('/images/juego/paloma-escape.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes paloma-escape-anim { 
          to { background-position-x: var(--paloma-escape-sheet); } 
        }
        @keyframes fly-away {
          to { 
            transform: translate(300px, -400px) scale(0.5); /* Vuela arriba y a la izquierda */
            opacity: 0; /* Desaparece */
          }
        }
        .animate-paloma-escape { 
          /* Aletea rápido (0.3s) y a la vez se desplaza (fly-away) */
          animation: 
            paloma-escape-anim 0.3s steps(4) infinite, 
            fly-away 1.5s ease-out forwards; 
        }
            /* === ANIMACIÓN GAUCHO PANCHO === */
        :root {
          /* 874px dividido en los 5 cuadros que me pasaste */
          --pancho-frame-width: calc(870px / 5); 
          --pancho-frame-height: 289px;
          --pancho-sheet-width: -870px; 
        }
        .pancho-sprite { 
          width: var(--pancho-frame-width); 
          height: var(--pancho-frame-height); 
          /* Cambiá el nombre si tu archivo se llama distinto */
          background-image: url('/images/juego/gaucho-pancho-idle.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes pancho-idle-anim { 
          to { background-position-x: var(--pancho-sheet-width); } 
        }
        .animate-pancho-idle { 
          /* steps(5) por los 5 cuadros. 5 segundos le da un ritmo relajado para tomar mate */
          animation: pancho-idle-anim 25s steps(5) infinite; 
        }
          /* === ANIMACIÓN OLLA FUEGO === */
        :root {
          /* 1288px dividido en 7 cuadros */
          --olla-frame-width: calc(1288px / 7); 
          --olla-frame-height: 69px;
          --olla-sheet-width: -1288px; 
        }
        .olla-fuego-sprite { 
          width: var(--olla-frame-width); 
          height: var(--olla-frame-height); 
          /* Chequeá que el nombre de tu imagen coincida */
          background-image: url('/images/juego/olla-fuego.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes olla-fuego-anim { 
          to { background-position-x: var(--olla-sheet-width); } 
        }
        .animate-olla-fuego { 
          /* steps(7) para los 7 frames. Animación rápida para el efecto de llamas */
          animation: olla-fuego-anim 2s steps(7) infinite; 
        }
          /* === ANIMACIÓN PERRO GALLETA === */
        :root {
          /* 1464px dividido en 6 cuadros */
          --galleta-frame-width: calc(1464px / 6); 
          --galleta-frame-height: 170px;
          --galleta-sheet-width: -1464px; 
        }
        .galleta-sprite { 
          width: var(--galleta-frame-width); 
          height: var(--galleta-frame-height); 
          /* Chequeá que el nombre de tu imagen coincida */
          background-image: url('/images/juego/galleta-idle.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes galleta-idle-anim { 
          to { background-position-x: var(--galleta-sheet-width); } 
        }
        .animate-galleta-idle { 
          /* steps(6) por los 6 cuadros. 3s lo hace un perrito con energía */
          animation: galleta-idle-anim 12s steps(6) infinite; 
        }
            /* === ANIMACIÓN PULPERO === */
        :root {
          /* 930px dividido en 6 cuadros exactos */
          --pulpero-frame-width: calc(930px / 6); 
          --pulpero-frame-height: 267px;
          --pulpero-sheet-width: -930px; 
        }
        .pulpero-sprite { 
          width: var(--pulpero-frame-width); 
          height: var(--pulpero-frame-height); 
          /* ¡Asegurate de que tu imagen se llame exactamente así! */
          background-image: url('/images/juego/pulpero-idle.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes pulpero-idle-anim { 
          to { background-position-x: var(--pulpero-sheet-width); } 
        }
        .animate-pulpero-idle { 
          /* steps(6) por los 6 cuadros. 4 segundos es un buen ritmo para que limpie el vaso tranquilo */
          animation: pulpero-idle-anim 12s steps(6) infinite; 
        }
          /* === ANIMACIÓN PANADERA === */
        :root {
          /* Dejamos que CSS calcule el ancho exacto con decimales */
          --panadera-frame-width: calc(1038px / 8); 
          --panadera-frame-height: 240px;
          --panadera-sheet-width: -1038px; 
        }
        .panadera-sprite { 
          width: var(--panadera-frame-width); 
          height: var(--panadera-frame-height); 
          background-image: url('/images/juego/panadera-idle.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes panadera-idle-anim { 
          to { background-position-x: var(--panadera-sheet-width); } 
        }
        .animate-panadera-idle { 
          /* steps(8) porque son 8 cuadros */
          animation: panadera-idle-anim 14s steps(8) infinite; 
        }

        /* === ANIMACIÓN GAUCHOS === */
        :root {
          --gauchos-frame-width: calc(1369px / 8); 
          --gauchos-frame-height: 182px;
          --gauchos-sheet-width: -1369px;
        }
        .gauchos-sprite { 
          width: var(--gauchos-frame-width); 
          height: var(--gauchos-frame-height); 
          background-image: url('/images/juego/gauchos-mate.png'); 
          background-repeat: no-repeat; 
          transform-origin: bottom center; 
        }
        @keyframes gauchos-idle-anim { to { background-position-x: var(--gauchos-sheet-width); } }
        .animate-gauchos-idle { 
          animation: gauchos-idle-anim 15s steps(8) infinite; 
        }
      `,
        }}
      />

      {/* EFECTO CRT */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"></div>

      {/* MONITOR */}
      <div className="w-full max-w-5xl bg-[#c0c0c0] p-3 rounded-lg border-t-4 border-l-4 border-white border-b-4 border-r-4 border-[#555] shadow-2xl relative z-30 flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center bg-[#0000aa] text-white px-2 md:px-3 py-1 mb-3 border-2 border-white/20">
          <span className="font-retro text-lg md:text-xl uppercase tracking-widest truncate max-w-[30%]">
            {scene.name}
          </span>
          {/* BOTONERA SUPERIOR */}
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
            <Link
              href="/juego"
              className="font-retro text-sm md:text-lg hover:text-[#ff5555]"
            >
              Cerrar [X]
            </Link>
          </div>
        </div>

        {/* PANTALLA PRINCIPAL */}
        <div
          ref={screenRef}
          onClick={handleScreenClick}
          onMouseLeave={() => setHoverText("")}
          className={`w-full aspect-video ${scene.bgClass} relative overflow-hidden border-4 border-[#555] cursor-crosshair shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]`}
        >
          {/* PANTALLA DE TRANSICIÓN (FADE TO BLACK) */}
          <div
            className={`absolute inset-0 bg-black z-50 transition-opacity duration-500 pointer-events-none ${isTransitioning ? "opacity-100" : "opacity-0"}`}
          ></div>

          {/* OVERLAY INVENTARIO */}
          {showInventory && (
            <div className="absolute inset-0 bg-black/80 z-40 flex items-center justify-center">
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
                        <span className="text-4xl drop-shadow-md">
                          {item.icon}
                        </span>
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

          {/* HOTSPOTS (CON SOPORTE PARA IMÁGENES Y MODO DEBUG) */}
          {scene.hotspots.map((hotspot) => {
            // Si el hotspot tiene una condición y no se cumple, ¡desaparece!
            if (hotspot.condition && !hotspot.condition(inventory, flags))
              return null;

            return (
              <div
                key={hotspot.id}
                onClick={(e) => handleHotspotClick(e, hotspot)}
                onMouseEnter={() => setHoverText(hotspot.name)}
                onMouseLeave={() => setHoverText("")}
                /* ACÁ ESTÁ LA MAGIA: Si es Galleta, le damos z-30 para que esté delante de la barra. Al resto, z-20. */
                className={`absolute cursor-pointer flex items-end justify-center ${
                  hotspot.id === "galleta" ? "z-30" : "z-20"
                } ${
                  isDebugMode
                    ? "border-2 border-red-500 bg-red-500/40 hover:bg-yellow-500/50 transition-colors"
                    : ""
                }`}
                style={{
                  top: hotspot.top,
                  left: hotspot.left,
                  width: hotspot.width,
                  height: hotspot.height,
                }}
              >
                {/* Etiqueta de texto (Solo visible en Modo Debug) */}
                {isDebugMode && (
                  <span className="absolute top-0 left-0 font-retro text-white text-xs bg-black/80 px-1 pointer-events-none whitespace-nowrap z-30">
                    {hotspot.name}
                  </span>
                )}

                {/* Si el hotspot tiene imagen (como el barril), la dibujamos */}
                {hotspot.imageUrl && (
                  <img
                    src={hotspot.imageUrl}
                    alt={hotspot.name}
                    className={`w-full h-full object-contain pixelated drop-shadow-md ${isDebugMode ? "opacity-50" : "opacity-100"}`}
                  />
                )}
                {/* Animación del Fuego en la Olla */}
                {hotspot.id === "olla" && flags.includes("olla_encendida") && (
                  <div className="w-full h-full flex items-end justify-center pointer-events-none">
                    {/* Ajustá el scale si el fuego se ve muy grande o chico */}
                    <div className="olla-fuego-sprite animate-olla-fuego pixelated scale-[0.4] shrink-0" />
                  </div>
                )}
                {/* Animación especial para el Perro Galleta */}
                {hotspot.id === "galleta" && (
                  <div className="w-full h-full flex items-end justify-center pointer-events-none">
                    {/* Como es un perro chico, probá con un scale-[0.6] para empezar, 
                        y ajustalo para que se vea bien frente a Heinrich */}
                    <div className="galleta-sprite animate-galleta-idle pixelated drop-shadow-md scale-[0.4] shrink-0" />
                  </div>
                )}
                {/* Animación especial para el Gaucho Pancho */}
                {hotspot.id === "gaucho" && (
                  <div className="w-full h-full flex items-end justify-center pointer-events-none">
                    {/* Al igual que el pulpero, podés jugar con el scale-[...] para ajustar su tamaño real en la escena */}
                    <div className="pancho-sprite animate-pancho-idle pixelated drop-shadow-md scale-[0.8] shrink-0" />
                  </div>
                )}
                {/* Animación especial para el Pulpero */}
                {hotspot.id === "pulpero" && (
                  <div className="w-full h-full flex items-end justify-center pointer-events-none">
                    {/* ACÁ CONTROLÁS LA ESCALA: 
                        Cambiá el scale-[0.8] por scale-[1.2], scale-[0.5], etc., según necesites. 
                        Le dejé el shrink-0 para que no se te corte la imagen. */}
                    <div className="pulpero-sprite animate-pulpero-idle pixelated drop-shadow-md scale-[0.8] shrink-0" />
                  </div>
                )}
                {/* Animación especial para las Palomas */}
                {hotspot.id === "palomas" && (
                  <div className="w-full h-full flex items-end justify-center pointer-events-none">
                    {/* ¡El secreto es agregar shrink-0 al final de esta línea! */}
                    <div className="palomas-sprite animate-palomas-idle pixelated drop-shadow-md scale-[0.2] shrink-0" />
                  </div>
                )}
                {/* Animación especial para la Paloma Individual */}
                {hotspot.id === "paloma" && (
                  <div className="w-full h-full flex items-end justify-center pointer-events-none">
                    {flags.includes("paloma_escapo") ? (
                      /* Si tiene la bandera (la tocaste), sale volando */
                      <div className="paloma-escape-sprite animate-paloma-escape pixelated drop-shadow-md scale-[0.5] shrink-0" />
                    ) : (
                      /* Si no, se queda picoteando */
                      <div className="paloma-sprite animate-paloma-idle pixelated drop-shadow-md scale-[0.5] shrink-0" />
                    )}
                  </div>
                )}
                {/* Animación especial para los Gauchos */}
                {hotspot.id === "gauchos" && (
                  <div className="w-full h-full flex items-end justify-center pointer-events-none">
                    {/* ACÁ ESTÁ LA MAGIA: Agregamos scale-[0.7] al final */}
                    <div className="gauchos-sprite animate-gauchos-idle pixelated drop-shadow-md scale-[0.6] shrink-0" />
                  </div>
                )}
                {/* Animación especial para la Panadera */}
                {hotspot.id === "panadera" && (
                  <div className="w-full h-full flex items-end justify-center pointer-events-none">
                    {/* scaleX en negativo la da vuelta, y scaleY mantiene su altura */}
                    <div
                      className="panadera-sprite animate-panadera-idle pixelated drop-shadow-md"
                      style={{ transform: "scaleX(-0.6) scaleY(0.6)" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
          {/* === CAPA DE LA BARRA (ENTRE EL PULPERO Y HEINRICH) === */}
          {currentSceneId === "pulperia" && (
            <img
              src="/images/juego/fondo-pulperia-barra.png"
              alt="Barra"
              /* z-[25] tapa a los hotspots (z-20) pero deja a Heinrich por delante (z-30) */
              className="absolute inset-0 w-full h-full object-cover z-[25] pointer-events-none pixelated"
            />
          )}
          {/* PERSONAJE CON ESCALA DINÁMICA Y VELOCIDAD CONSTANTE */}
          <div
            // Borramos el duration-[800ms] de acá
            className={`absolute z-30 pointer-events-none ${!isTransitioning ? "transition-all ease-linear" : ""}`}
            style={{
              top: `${charPos.y}%`,
              left: `${charPos.x}%`,
              transform: `translate(-50%, -100%)`,
              transitionDuration: `${walkDuration}ms`, // <-- SE LO PASAMOS DINÁMICAMENTE ACÁ
            }}
          >
            <div
              // Y también borramos el duration-[800ms] de acá
              className={`heinrich-sprite pixelated facing-${charDirection} ${isWalking ? "animate-walk" : "is-idle"} ${!isTransitioning ? "transition-transform ease-linear" : ""}`}
              style={{
                transform: `scale(${scene.getScale ? scene.getScale(charPos.y) : scene.scale || 0.6})`,
                transitionDuration: `${walkDuration}ms`, // <-- SE LO PASAMOS DINÁMICAMENTE ACÁ
              }}
            ></div>
          </div>
          {/* === EL RIVAL EDWARD === */}
          {currentSceneId === "puerto" && (
            <div
              className="absolute z-20 pointer-events-none"
              style={{
                top: "95%",
                left: "80%",
                transform: `translate(-50%, -100%)`,
              }}
            >
              {/* Le agregamos scaleX(-1) para darlo vuelta como un espejo */}
              <div
                className="edward-sprite pixelated animate-edward-idle"
                style={{ transform: `scaleX(-1) scale(1.00)` }}
              ></div>
            </div>
          )}
        </div>

        {/* FIN PANTALLA PRINCIPAL */}

        {/* INTERFAZ INFERIOR */}
        <div className="mt-3 bg-black border-4 border-[#555] p-3 md:p-4 flex flex-col md:flex-row gap-4 h-48 md:h-56">
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
                  className={`font-retro text-2xl md:text-3xl uppercase tracking-wider text-left pl-2 transition-colors ${currentAction === action.type ? "text-[#55ffff]" : "text-[#aaaaaa] hover:text-white"}`}
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
      </div>
    </div>
  );
}
