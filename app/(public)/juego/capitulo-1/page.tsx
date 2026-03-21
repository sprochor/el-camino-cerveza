"use client";

import { supabase } from "@/lib/supabaseClient"; // 👈 Asegurate de que la ruta coincida con tu proyecto
import GameHUD from "./GameHUD";
import "./game.css";
import IntroCinematic from "./IntroCinematic";
import { useState, useRef, useEffect } from "react";
import OutroCinematic from "./OutroCinematic";
import Link from "next/link";
import {
  ActionType,
  Item,
  Hotspot,
  ActionResult,
  DialogueLine,
} from "@/engine/types";
import { ALL_SCENES } from "@/scenes";

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
  const [walkDuration, setWalkDuration] = useState(800);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoverText, setHoverText] = useState("");

  const [currentDialogueQueue, setCurrentDialogueQueue] = useState<
    DialogueLine[]
  >([]);
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const [gameState, setGameState] = useState<"INTRO" | "PLAYING" | "OUTRO">(
    "INTRO",
  );
  const [cargandoJuego, setCargandoJuego] = useState(true);
  const [resetCount, setResetCount] = useState(0);
  const [isDebugMode, setIsDebugMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [responsiveScale, setResponsiveScale] = useState(1);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const puertoAudioRef = useRef<HTMLAudioElement | null>(null);
  const plazaAudioRef = useRef<HTMLAudioElement | null>(null);
  const pulperiaAudioRef = useRef<HTMLAudioElement | null>(null);
  const quintaAudioRef = useRef<HTMLAudioElement | null>(null);
  const finalAudioRef = useRef<HTMLAudioElement | null>(null);
  const walkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const flagsRef = useRef<string[]>(flags);
  const inventoryRef = useRef<Item[]>(inventory);

  // 👈 ESTE ES EL CONTENEDOR PRINCIPAL QUE AHORA ENVUELVE TODO
  const gameWrapperRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const scene = ALL_SCENES[currentSceneId as keyof typeof ALL_SCENES];
  const [maskData, setMaskData] = useState<ImageData | null>(null);

  useEffect(() => {
    flagsRef.current = flags;
  }, [flags]);
  useEffect(() => {
    const inicializarJuego = async () => {
      // 1. Chequeamos si el usuario está logueado
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // 2. Si NO hay sesión, lo pateamos al login
      if (!session) {
        window.location.href = "/login";
      } else {
        // 3. Si SÍ hay sesión, apagamos el Loading y le mostramos el juego
        setCargandoJuego(false);
      }
    };

    // 4. Ejecutamos la función que acabamos de crear
    inicializarJuego();
  }, []);
  useEffect(() => {
    inventoryRef.current = inventory;
  }, [inventory]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const imagesToPreload = [
        // 🚶‍♂️ Personaje principal
        "/images/juego/heinrich-walk-south.png",
        "/images/juego/heinrich-walk-north.png",
        "/images/juego/heinrich-walk-east.png",
        "/images/juego/heinrich-walk-west.png",

        // 🌆 Fondos del juego
        "/images/juego/fondo-puerto.webp",
        "/images/juego/fondo-plaza.webp",
        "/images/juego/fondo-pulperia.webp",
        "/images/juego/fondo-quinta.webp",
        "/images/juego/fondo-pulperia-barra.png",

        // 🎬 Cinemáticas Intro (Para que no haya pantalla negra)
        "/images/juego/intro-mar.webp",
        "/images/juego/intro-bodega.webp",
        "/images/juego/intro-camarote.webp",
        "/images/juego/intro-tormenta.webp",

        // 🎬 Cinemáticas Outro
        "/images/juego/outro-pancho.webp",
        "/images/juego/outro-pulpero.webp",
        "/images/juego/outro-panadera.webp",
        "/images/juego/outro-heinrich-triste.webp",

        // ✨ Sprites de animaciones interactivas (¡Para que no desaparezcan!)
        "/images/juego/galleta-mimos.png",
        "/images/juego/olla-fuego.png",
        "/images/juego/paloma-escape.png",
        "/images/juego/barril-vacio.png",
        "/images/juego/edward-idle.webp",

        // Caras y personajes
        "/images/juego/heinrich-neutral.webp",
        "/images/juego/pulpero-idle.webp",
        "/images/juego/palomas-idle.webp",
        "/images/juego/heinrich-happy.webp",
        "/images/juego/edward-idle.png",
      ];

      imagesToPreload.forEach((src) => {
        const img = new Image();
        img.src = src;
      });
    }
  }, []);
  // === TEMPORIZADOR DE ANIMACIONES ===
  useEffect(() => {
    if (flags.includes("galleta_anim")) {
      const timer = setTimeout(() => {
        // A los 2 segundos (2000ms), borramos la bandera de la memoria
        setFlags((prev) => prev.filter((f) => f !== "galleta_anim"));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [flags]);
  useEffect(() => {
    const updateScale = () => {
      if (screenRef.current) {
        const currentWidth = screenRef.current.clientWidth;
        setResponsiveScale(currentWidth / 1024);
        setWalkDuration(0);
      }
    };
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [currentSceneId]);

  const resetGame = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (window.confirm("¿Seguro que querés reiniciar toda la partida?")) {
      setResetCount((prev) => prev + 1);
      setInventory([]);
      setFlags([]);
      setCurrentSceneId("puerto");
      setCharPos({ x: 40, y: 85 });
      setCharDirection("south");
      setMessage("");
      setPortraitUrl(null);
      setCurrentDialogueQueue([]);
      setDialogueIndex(0);
      setIsDebugMode(false);
      setGameState("INTRO");

      if (puertoAudioRef.current) {
        puertoAudioRef.current.pause();
        puertoAudioRef.current.currentTime = 0;
      }
      if (plazaAudioRef.current) {
        plazaAudioRef.current.pause();
        plazaAudioRef.current.currentTime = 0;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (pulperiaAudioRef.current) {
        pulperiaAudioRef.current.pause();
        pulperiaAudioRef.current.currentTime = 0;
      } // 👈 ¡ESTA LLAVE FALTABA!

      if (quintaAudioRef.current) {
        quintaAudioRef.current.pause();
        quintaAudioRef.current.currentTime = 0;
      }
      if (finalAudioRef.current) {
        finalAudioRef.current.pause();
        finalAudioRef.current.currentTime = 0;
      }
    }
  }; // 👈 ¡Y ESTA OTRA TAMBIÉN FALTABA!

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/audio/intro-theme.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;

      puertoAudioRef.current = new Audio("/audio/puerto-theme.mp3");
      puertoAudioRef.current.loop = true;
      puertoAudioRef.current.volume = 0.4;

      plazaAudioRef.current = new Audio("/audio/plaza-theme.mp3");
      plazaAudioRef.current.loop = true;
      plazaAudioRef.current.volume = 0.4;

      pulperiaAudioRef.current = new Audio("/audio/pulperia-theme.mp3");
      pulperiaAudioRef.current.loop = true;
      pulperiaAudioRef.current.volume = 0.4;

      quintaAudioRef.current = new Audio("/audio/quinta-theme.mp3");
      quintaAudioRef.current.loop = true;
      quintaAudioRef.current.volume = 0.4;

      finalAudioRef.current = new Audio("/audio/final-theme.mp3");
      finalAudioRef.current.loop = true;
      finalAudioRef.current.volume = 0.6; // Un poco más fuerte para darle épica
    }
  }, []);

  // Control dinámico de la música por escena
  useEffect(() => {
    // Si estamos en la cinemática del final...
    if (gameState === "OUTRO") {
      puertoAudioRef.current?.pause();
      plazaAudioRef.current?.pause();
      pulperiaAudioRef.current?.pause();
      quintaAudioRef.current?.pause();
      finalAudioRef.current?.play().catch((e) => console.log(e));
      return;
    }

    // Si estamos jugando normal...
    if (gameState === "PLAYING") {
      finalAudioRef.current?.pause(); // Por si reinició el juego

      if (currentSceneId === "puerto") {
        puertoAudioRef.current?.play().catch((e) => console.log(e));
        plazaAudioRef.current?.pause();
        pulperiaAudioRef.current?.pause();
        quintaAudioRef.current?.pause();
      } else if (currentSceneId === "plaza") {
        plazaAudioRef.current?.play().catch((e) => console.log(e));
        puertoAudioRef.current?.pause();
        pulperiaAudioRef.current?.pause();
        quintaAudioRef.current?.pause();
      } else if (currentSceneId === "pulperia") {
        pulperiaAudioRef.current?.play().catch((e) => console.log(e));
        puertoAudioRef.current?.pause();
        plazaAudioRef.current?.pause();
        quintaAudioRef.current?.pause();
      } else if (currentSceneId === "quinta") {
        // 👇 ENCENDEMOS LA QUINTA 👇
        quintaAudioRef.current?.play().catch((e) => console.log(e));
        puertoAudioRef.current?.pause();
        plazaAudioRef.current?.pause();
        pulperiaAudioRef.current?.pause();
      }
    }
  }, [gameState, currentSceneId]);

  useEffect(() => {
    // Limpiamos la máscara anterior apenas cambiamos de escena
    setMaskData(null);

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

      // Si falla la carga en Vercel, forzamos el límite manual
      img.onerror = () => {
        console.error(
          "Ojo: No se pudo cargar la máscara de colisiones:",
          scene.maskUrl,
        );
        setMaskData(null);
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

  // ==========================================
  // EFECTO 1: Posicionar al personaje al cambiar de escena
  // ==========================================
  useEffect(() => {
    if (scene) {
      setCharPos({ x: scene.startX, y: scene.startY });
    }
  }, [currentSceneId, scene]);
  // ==========================================
  // EFECTO 2: Disparar cinemáticas o diálogos de entrada
  // ==========================================
  useEffect(() => {
    // 👈 REGLA DE ORO: Si seguimos en la intro, no hagas nada.
    if (gameState !== "PLAYING") return;

    // Le damos un respiro de medio segundo al motor para que termine de dibujar todo
    const timer = setTimeout(() => {
      // Si estamos en el puerto y la bandera no está en la memoria...
      if (
        currentSceneId === "puerto" &&
        !flagsRef.current.includes("llegada_buenos_aires")
      ) {
        // 1. Guardamos la bandera inmediatamente
        setFlags((prev) => [...prev, "llegada_buenos_aires"]);

        // 2. Disparamos el mensaje
        parseMessage(
          "/images/juego/heinrich-neutral.webp|Llegaste a Buenos Aires.",
        );
      }
    }, 600); // 600 milisegundos de delay cinemático

    return () => clearTimeout(timer);
  }, [currentSceneId, gameState]); // 👈 ¡Agregamos gameState a las dependencias! // Se ejecuta cada vez que cambiás de escena
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
  };

  const handleScreenClick = (e: React.MouseEvent) => {
    if (currentDialogueQueue.length > 0) {
      if (dialogueIndex < currentDialogueQueue.length - 1) {
        setDialogueIndex((prev) => prev + 1);
        const nextLine = currentDialogueQueue[dialogueIndex + 1];
        setPortraitUrl(nextLine.portrait || null);
        setMessage(nextLine.text);
      } else {
        // Termina el diálogo
        setCurrentDialogueQueue([]);
        setDialogueIndex(0);
        setMessage("");
        setPortraitUrl(null);

        // 👇 NUEVO: SI LA BANDERA SE ACTIVÓ, GUARDAMOS EL LOGRO Y SALTAMOS AL EPÍLOGO 👇
        if (
          flagsRef.current.includes("juego_terminado") &&
          gameState !== "OUTRO"
        ) {
          // Guardar el logro en Supabase sin interrumpir el flujo visual
          const saveAchievement = async () => {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (session) {
              const userId = session.user.id;
              // Obtenemos los logros actuales
              const { data: profile } = await supabase
                .from("profiles")
                .select("logros")
                .eq("id", userId)
                .single();

              const logrosActuales = profile?.logros || [];

              // Si no lo tiene, se lo agregamos
              if (!logrosActuales.includes("heinrich_cap1")) {
                await supabase
                  .from("profiles")
                  .update({ logros: [...logrosActuales, "heinrich_cap1"] })
                  .eq("id", userId);
              }
            }
          };

          saveAchievement(); // Lo lanzamos en segundo plano
          setGameState("OUTRO");
          return; // Cortamos acá para que no camine
        }
      }
      return;
    }

    if (currentAction !== "WALK" || !screenRef.current) return;
    const rect = screenRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    moveCharacter(x, y);
    setMessage("");
    setPortraitUrl(null);
  };

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

    // === ACCIÓN: CAMINAR ===
    if (currentAction === "WALK") {
      moveCharacter(hotspot.walkToX, hotspot.walkToY, () => {
        // 1. SI NO ES UNA SALIDA, NO HACE NADA (Ej: El pozo)
        if (!hotspot.isExit) return;

        // 2. SI ES UNA SALIDA, INTENTA CRUZARLA O PROCESA EL BLOQUEO (Ej: Puerta al patio)
        const result = hotspot.onInteract(
          inventoryRef.current,
          flagsRef.current,
        );

        // Procesamos Banderas (¡Esto faltaba!)
        if (result.setFlag) {
          const flagsToAdd = result.setFlag.split(",");
          setFlags((prev) => {
            const nextFlags = [...prev];
            flagsToAdd.forEach((f) => {
              if (!nextFlags.includes(f)) nextFlags.push(f);
            });
            return nextFlags;
          });
        }

        // Procesamos Ítems (¡Esto faltaba!)
        if (result.addItem) {
          setInventory((prev) => [...prev, result.addItem!]);
        }
        if (result.removeItem) {
          setInventory((prev) =>
            prev.filter((i) => i.id !== result.removeItem),
          );
        }

        // Procesamos Textos y Transiciones
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
      return;
    }

    moveCharacter(hotspot.walkToX, hotspot.walkToY, () => {
      let result: ActionResult;
      const currentFlags = flagsRef.current;
      const currentInventory = inventoryRef.current;

      if (currentAction === "LOOK")
        result = hotspot.onLook(currentInventory, currentFlags);
      else if (currentAction === "INTERACT")
        result = hotspot.onInteract(currentInventory, currentFlags);
      else result = hotspot.onTalk(currentInventory, currentFlags);

      if (
        result.addItem &&
        !currentInventory.some((i) => i?.id === result.addItem?.id)
      ) {
        setInventory((prev) => [...prev, result.addItem!]);
      }
      // 2. Guardar Banderas (AHORA SOPORTA MÚLTIPLES BANDERAS SEPARADAS POR COMA)
      if (result.setFlag) {
        const flagsToAdd = result.setFlag.split(",");
        setFlags((prev) => {
          const nextFlags = [...prev];
          flagsToAdd.forEach((f) => {
            if (!nextFlags.includes(f)) nextFlags.push(f);
          });
          return nextFlags;
        });
      }
      if (result.removeItem) {
        setInventory((prev) => prev.filter((i) => i?.id !== result.removeItem));
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

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (audioRef.current) audioRef.current.muted = newMuted;
    if (puertoAudioRef.current) puertoAudioRef.current.muted = newMuted;
    if (plazaAudioRef.current) plazaAudioRef.current.muted = newMuted;
    if (pulperiaAudioRef.current) pulperiaAudioRef.current.muted = newMuted;
    if (quintaAudioRef.current) quintaAudioRef.current.muted = newMuted;
    if (finalAudioRef.current) finalAudioRef.current.muted = newMuted;
  };
  const handleIntroFinish = () => {
    setInventory([]);
    setFlags([]);
    setMessage("");
    setPortraitUrl(null);
    setGameState("PLAYING");
  };

  // 👈 VOLVIMOS A TU CÓDIGO ORIGINAL DE PANTALLA COMPLETA (QUE ANDABA BIEN)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (gameWrapperRef.current) {
        gameWrapperRef.current.requestFullscreen().catch((err) => {
          console.log("Error pantalla completa:", err);
        });
      }
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // === UN ÚNICO ENVOLTORIO GLOBAL PARA TODO ===
  if (cargandoJuego) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex flex-col items-center justify-center font-retro text-center">
        <div className="animate-bounce mb-6">
          <span className="text-7xl drop-shadow-[0_0_15px_rgba(255,170,0,0.8)]">
            🍺
          </span>
        </div>
        <h2 className="text-[#ffaa00] text-3xl mb-4 tracking-widest animate-pulse drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
          CARGANDO...
        </h2>
        <p className="text-stone-400 text-lg">
          Acondicionando los barriles en la bodega
        </p>
      </div>
    );
  }

  return (
    <div
      ref={gameWrapperRef}
      className={`bg-[#1a1a1a] flex flex-col items-center justify-center selection:bg-transparent overflow-x-hidden overflow-y-auto ${
        isFullscreen
          ? "w-full h-[100dvh] p-0 md:p-2"
          : "min-h-[100dvh] p-2 md:p-6"
      }`}
    >
      {/* 👇 OVERLAY ESTRICTO PARA PC (TAMAÑO CORREGIDO) 👇 */}
      <div className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex-col items-center justify-start text-center p-4 flex lg:hidden overflow-y-auto">
        <div className="my-auto flex flex-col items-center justify-center max-w-sm mx-auto py-8">
          <div className="animate-bounce mb-4">
            <span className="text-6xl">🖥️</span>
          </div>
          <h2 className="text-[#ffaa00] font-retro text-3xl mb-4 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] px-2">
            Experiencia de PC
          </h2>
          <p className="text-white font-retro text-lg mb-6 leading-tight px-2">
            Esta aventura está diseñada con la interfaz clásica de los años 90.
            Las pantallas de los celulares no tienen el espacio suficiente.
          </p>
          <div className="bg-black border-2 border-[#555] p-4 w-full shadow-xl mb-6">
            <p className="text-[#55ff55] font-retro text-base leading-snug">
              💡 Consejo del Maestro:
              <br />
              <br />
              ¡Guardá el enlace y entrá desde tu compu para jugar con pantalla
              completa y todos los detalles!
            </p>
          </div>
          <Link
            href="/juego"
            className="text-amber-500 font-retro text-xl hover:text-white transition p-2"
          >
            [ ← Volver al menú ]
          </Link>
        </div>
      </div>
      {/* 👆 FIN DEL OVERLAY 👆 */}
      <div className="fixed inset-0 pointer-events-none z-50 mix-blend-overlay opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')]"></div>

      {/* SI NO CARGÓ LA ESCENA */}
      {!scene ? (
        <div className="text-white font-retro text-2xl">Cargando escena...</div>
      ) : gameState === "INTRO" ? (
        /* SI ESTAMOS EN LA INTRO */
        <IntroCinematic
          key={resetCount}
          onFinish={handleIntroFinish}
          audioRef={audioRef}
          isMuted={isMuted}
          toggleMute={toggleMute}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
          gameWrapperRef={null}
        />
      ) : gameState === "OUTRO" ? (
        /* 👇 ¡NUEVO: SI ESTAMOS EN EL OUTRO! 👇 */
        <OutroCinematic resetGame={resetGame} />
      ) : (
        /* SI ESTAMOS JUGANDO NORMALMENTE */
        <div
          className={`w-full max-w-5xl mx-auto my-auto bg-[#c0c0c0] rounded-lg border-[#555] shadow-2xl relative z-30 flex flex-col ${
            isFullscreen
              ? "border-0 p-1 md:p-3" 
              : "border-t-4 border-l-4 border-white border-b-4 border-r-4 p-2 md:p-3"
          }`}
        >
          <GameHUD
            sceneName={scene.name}
            isMuted={isMuted}
            toggleMute={toggleMute}
            isFullscreen={isFullscreen}
            toggleFullscreen={toggleFullscreen}
            isDebugMode={isDebugMode}
            setIsDebugMode={setIsDebugMode}
            resetGame={resetGame}
            showInventory={showInventory}
            setShowInventory={setShowInventory}
            inventory={inventory}
            currentAction={currentAction}
            setCurrentAction={setCurrentAction}
            hoverText={hoverText}
            portraitUrl={portraitUrl}
            message={message}
          >
            <div
              ref={screenRef}
              onClick={handleScreenClick}
              onMouseLeave={() => setHoverText("")}
              className={`w-full aspect-video mx-auto ${scene.bgClass} relative overflow-hidden border-4 border-[#555] cursor-crosshair shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]`}
            >
              <div
                className={`absolute inset-0 bg-black z-50 transition-opacity duration-500 pointer-events-none ${isTransitioning ? "opacity-100" : "opacity-0"}`}
              ></div>

              {scene.hotspots.map((hotspot) => {
                if (hotspot.condition && !hotspot.condition(inventory, flags))
                  return null;

                return (
                  <div
                    key={`${currentSceneId}-${hotspot.id}`} // 👈 ESTA ES LA SOLUCIÓN MÁGICA
                    onClick={(e) => handleHotspotClick(e, hotspot)}
                    onMouseEnter={() => setHoverText(hotspot.name)}
                    onMouseLeave={() => setHoverText("")}
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
                    {isDebugMode && (
                      <span className="absolute top-0 left-0 font-retro text-white text-xs bg-black/80 px-1 pointer-events-none whitespace-nowrap z-30">
                        {hotspot.name}
                      </span>
                    )}
                    {/* DIBUJO DE IMAGEN CONDICIONAL (ACTUALIZADO CON ESCALA PRECISA) */}
                    {hotspot.imageUrl &&
                      (hotspot.visible
                        ? hotspot.visible(inventory, flags)
                        : true) && (
                        <img
                          src={hotspot.imageUrl}
                          alt={hotspot.name}
                          // Removemos w-full y h-full porque ahora escalamos a Heinrich
                          className={`absolute object-contain pixelated drop-shadow-md pointer-events-none ${isDebugMode ? "opacity-50" : "opacity-100"}`}
                          style={{
                            // 👇 AGREGAMOS LA ESCALA PRECISA ESPECÍFICA 👇
                            transform: `scale(${hotspot.imageScale || 1.0})`,
                            transformOrigin: "bottom center", // Clave para que apoye bien

                            // Nos aseguramos de que ocupe todo el espacio de la caja de debug
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      )}
                    {/* FUEGO DE LA OLLA */}
                    {hotspot.id === "olla" &&
                      flags.includes("olla_encendida") &&
                      !flags.includes("mosto_enfriando") && ( // 👈 ¡Agregamos esta línea!
                        <div className="w-full h-full flex items-end justify-center pointer-events-none">
                          <div
                            className="olla-fuego-sprite animate-olla-fuego pixelated shrink-0"
                            style={{
                              transform: `scale(${0.4 * responsiveScale})`,
                            }}
                          />
                        </div>
                      )}
                    {/* Animación especial para el Perro Galleta */}
                    {hotspot.id === "galleta" && (
                      <div className="w-full h-full flex items-end justify-center pointer-events-none">
                        {flags.includes("galleta_anim") ? (
                          <div
                            className="galleta-mimos-sprite animate-galleta-mimos pixelated drop-shadow-md shrink-0"
                            style={{
                              transform: `scale(${0.5 * responsiveScale})`,
                            }}
                          />
                        ) : (
                          <div
                            className="galleta-sprite animate-galleta-idle pixelated drop-shadow-md shrink-0"
                            style={{
                              transform: `scale(${0.5 * responsiveScale})`,
                            }}
                          />
                        )}
                      </div>
                    )}
                    {hotspot.id === "gaucho" && (
                      <div className="w-full h-full flex items-end justify-center pointer-events-none">
                        <div
                          className="pancho-sprite animate-pancho-idle pixelated drop-shadow-md shrink-0"
                          style={{
                            transform: `scale(${0.7 * responsiveScale})`,
                          }}
                        />
                      </div>
                    )}
                    {hotspot.id === "pulpero" && (
                      <div className="w-full h-full flex items-end justify-center pointer-events-none">
                        <div
                          className="pulpero-sprite animate-pulpero-idle pixelated drop-shadow-md shrink-0"
                          style={{
                            transform: `scale(${0.8 * responsiveScale})`,
                          }}
                        />
                      </div>
                    )}
                    {hotspot.id === "palomas" && (
                      <div className="w-full h-full flex items-end justify-center pointer-events-none">
                        <div
                          className="palomas-sprite animate-palomas-idle pixelated drop-shadow-md shrink-0"
                          style={{
                            transform: `scale(${0.2 * responsiveScale})`,
                          }}
                        />
                      </div>
                    )}
                    {hotspot.id === "paloma" && (
                      <div className="w-full h-full flex items-end justify-center pointer-events-none">
                        {flags.includes("paloma_escapo") ? (
                          <div
                            className="paloma-escape-sprite animate-paloma-escape pixelated drop-shadow-md shrink-0"
                            style={{
                              transform: `scale(${0.5 * responsiveScale})`,
                            }}
                          />
                        ) : (
                          <div
                            className="paloma-sprite animate-paloma-idle pixelated drop-shadow-md shrink-0"
                            style={{
                              transform: `scale(${0.5 * responsiveScale})`,
                            }}
                          />
                        )}
                      </div>
                    )}
                    {hotspot.id === "gauchos" && (
                      <div className="w-full h-full flex items-end justify-center pointer-events-none">
                        <div
                          className="gauchos-sprite animate-gauchos-idle pixelated drop-shadow-md shrink-0"
                          style={{
                            transform: `scale(${0.6 * responsiveScale})`,
                          }}
                        />
                      </div>
                    )}
                    {hotspot.id === "panadera" && (
                      <div className="w-full h-full flex items-end justify-center pointer-events-none">
                        <div
                          className="panadera-sprite animate-panadera-idle pixelated drop-shadow-md shrink-0"
                          style={{
                            transform: `scaleX(${-0.6 * responsiveScale}) scaleY(${0.6 * responsiveScale})`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}

              {currentSceneId === "pulperia" && (
                <img
                  src="/images/juego/fondo-pulperia-barra.png"
                  alt="Barra"
                  className="absolute inset-0 w-full h-full object-cover z-[25] pointer-events-none pixelated"
                />
              )}

              <div
                className={`absolute z-30 pointer-events-none ${!isTransitioning ? "transition-all ease-linear" : ""}`}
                style={{
                  top: `${charPos.y}%`,
                  left: `${charPos.x}%`,
                  transform: `translate(-50%, -100%)`,
                  transitionDuration: `${walkDuration}ms`,
                }}
              >
                <div
                  className={`heinrich-sprite pixelated facing-${charDirection} ${isWalking ? "animate-walk" : "is-idle"} ${!isTransitioning ? "transition-transform ease-linear" : ""}`}
                  style={{
                    transform: `scale(${(scene.getScale ? scene.getScale(charPos.y) : scene.scale || 0.6) * responsiveScale})`,
                    transitionDuration: `${walkDuration}ms`,
                  }}
                ></div>
              </div>

              {currentSceneId === "puerto" && (
                <div
                  className="absolute z-20 pointer-events-none"
                  style={{
                    top: "95%",
                    left: "80%",
                    transform: `translate(-50%, -100%)`,
                  }}
                >
                  <div
                    className="edward-sprite pixelated animate-edward-idle shrink-0"
                    style={{
                      transform: `scaleX(-1) scale(${1.0 * responsiveScale})`,
                    }}
                  ></div>
                </div>
              )}
            </div>
          </GameHUD>
        </div>
      )}
    </div>
  );
}
