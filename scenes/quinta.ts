import { Scene } from "@/engine/types";

export const quintaScene: Scene = {
  id: "quinta",
  name: "EL PATIO TRASERO",
  bgClass:
    "bg-[url('/images/juego/fondo-quinta.webp')] bg-cover bg-center bg-no-repeat",
  maskUrl: "/images/juego/fondo-quinta-mask.png",
  startX: 37,
  startY: 80,

  // 👇 REEMPLAZAMOS 'scale: 0.9' POR ESTO 👇

  // === LÓGICA DE PERSPECTIVA DEL PATIO ===
  getScale: (y) => {
    // Definimos los rangos de la escena
    const minY = 55; // El horizonte (cerca de la pared de la pulpería)
    const maxY = 100; // El primer plano (cerca del pozo)

    // Definimos las escalas deseadas
    const minScale = 0.5; // Tamaño pequeño al fondo
    const maxScale = 1.0; // Tamaño grande al frente

    // Calculamos el porcentaje de la distancia recorrida
    let dynamicScale =
      minScale + ((y - minY) / (maxY - minY)) * (maxScale - minScale);

    // Limitamos el resultado por seguridad
    if (dynamicScale < minScale) return minScale;
    if (dynamicScale > maxScale) return maxScale;

    return dynamicScale;
  },

  hotspots: [
    // =======================
    // 🚪 SALIDA A LA PULPERÍA
    // =======================
    {
      id: "salida_pulperia",
      name: "Volver adentro",
      isExit: true,
      top: "32%",
      left: "11%",
      width: "10%",
      height: "45%",
      walkToX: 10,
      walkToY: 85,
      onLook: () => ({
        text: "/images/juego/heinrich-neutral.webp|La puerta trasera de la pulpería. Desde acá se escucha el murmullo de los parroquianos.",
      }),
      onInteract: () => ({
        text: "Entrando a la pulpería...",
        transition: "pulperia",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|No hay necesidad de golpear, ya me dieron permiso.",
      }),
    },

    // =======================
    // 🌿 ENREDADERA (FALSO LÚPULO)
    // =======================
    {
      id: "enredadera",
      name: "Enredadera Salvaje",
      top: "25%",
      left: "25%",
      width: "13%",
      height: "42%",
      walkToX: 20,
      walkToY: 70,
      onLook: () => ({
        text: "/images/juego/heinrich-surprised.webp|¡Parece lúpulo salvaje! Creciendo como maleza por las paredes.",
      }),
      onInteract: (inventory) => {
        if (inventory.some((i) => i.id === "lupulo")) {
          return {
            text: "/images/juego/heinrich-neutral.webp|Ya arranqué suficientes flores. No quiero deforestar la pared entera.",
          };
        }
        return {
          text: "/images/juego/heinrich-happy.webp|Perfecto para darle amargor. Guardo unas flores… con suerte no envenenan a nadie.",
          addItem: {
            id: "lupulo",
            name: "Lúpulo sospechoso",
            icon: "🌿",
            imageUrl: "/images/juego/items/flores-sospechosas.png",
          },
        };
      },
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|Crecé fuerte, amiguito. Vas a terminar en un buen barril.",
      }),
    },

    // =======================
    // 🪣 POZO SECO Y BALDE (VISUAL CONDICIONAL)
    // =======================
    {
      id: "pozo",
      name: "Pozo Viejo",
      // Tus coordenadas originales, pero ajustadas para la imagen visual
      top: "71%",
      left: "85%",
      width: "15%",
      height: "30%",
      walkToX: 85,
      walkToY: 95,

      // 👇 AGREGAMOS LA VISUALIZACIÓN 👇
      imageUrl: "/images/juego/balde_suelo.webp", // La imagen del balde
      visible: (inventory: Item[], flags: string[]) =>
        !flags.includes("balde_recogido"), // Solo es visible si NO se recogió
      imageScale: 1.1, // 80% de tamaño (achicarlo un poco)
      // Tus diálogos originales (mantenidos)
      onLook: (inventory, flags) => {
        if (!flags.includes("balde_recogido")) {
          return {
            text: "/images/juego/heinrich-neutral.webp|Un viejo pozo de ladrillos. Hay un balde de hojalata.",
          };
        }
        return {
          text: "/images/juego/heinrich-neutral.webp|Un viejo pozo. Seco. Perfecto. Justo lo que necesitaba… nada.",
        };
      },
      onInteract: (inventory, flags) => {
        if (!flags.includes("balde_recogido")) {
          return {
            text: "/images/juego/heinrich-happy.webp|Me llevo este balde vacío. El pozo está sequísimo, así que tendré que buscar agua en otro lado.",
            setFlag: "balde_recogido",
            // Removemos removeItem porque es el único hotspot y la visual se controla con el visible
            addItem: {
              id: "balde_vacio",
              name: "Balde Vacío",
              icon: "🪣",
              imageUrl: "/images/juego/items/balde-vacio.png",
            },
          };
        }
        return {
          text: "/images/juego/heinrich-neutral.webp|Asomarse no tiene sentido. Si tiro una moneda, probablemente me devuelva arena.",
        };
      },
      onTalk: () => ({
        text: "/images/juego/heinrich-speaking-small.webp|¡HAAALLO!... (hallo... hallo...). Tiene eco, pero no agua.",
      }),
    },
    // =======================
    // 🪢 SOGA (CHISTE INVENTARIO)
    // =======================
    {
      id: "soga",
      name: "Soga Gruesa",
      top: "63%",
      left: "79%",
      width: "7%",
      height: "10%",
      walkToX: 85,
      walkToY: 75,
      onLook: () => ({
        text: "/images/juego/heinrich-neutral.webp|Una soga marinera bastante resistente y algo sucia.",
      }),
      onInteract: () => ({
        text: "/images/juego/heinrich-speaking-small.webp|Mmm... 'Podría serme útil en el futuro'. Todavá no la necesito… todavía.",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|Mejor No preguntaré para qué la usan.",
      }),
    },

    // =======================
    // 🥃 BARRIL DE CAÑA
    // =======================
    {
      id: "barril_cana",
      name: "Barril Misterioso",
      top: "45%",
      left: "68%",
      width: "7%",
      height: "10%",
      walkToX: 75,
      walkToY: 65,
      onLook: () => ({
        text: "/images/juego/heinrich-surprised.webp|Un barril de caña, el aroma es… contundente. Esto no es bebida, es una advertencia.",
      }),
      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.webp|Mejor no. Prefiero cerveza. Esto parece combustible.",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|Hola, veneno.",
      }),
    },

    // =======================
    // 🌳 ÁRBOL FRONDOSO
    // =======================
    {
      id: "arbol",
      name: "Árbol Rústico",
      top: "4%",
      left: "50%",
      width: "43%",
      height: "35%",
      walkToX: 55,
      walkToY: 65,
      onLook: () => ({
        text: "/images/juego/heinrich-neutral.webp|Un árbol bastante generoso. Sombra, temperatura estable… casi perfecto para una fermentación decente.",
      }),
      onInteract: () => ({
        text: "/images/juego/heinrich-neutral.webp|No soy leñador, soy cervecero. Mi relación con la madera se limita estrictamente a los barriles.",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-happy.webp|No sos un roble bávaro, pero tenés tu encanto sureño.",
      }),
    },

    // =======================
    // 🪵 MESA PARA FERMENTAR (EL GRAN FINAL)
    // =======================
    {
      id: "mesa",
      name: "Mesa a la sombra",
      top: "52%",
      left: "55%",
      width: "17%",
      height: "15%",
      walkToX: 55,
      walkToY: 70, // 👈 Volvió a 50%

      imageUrl: "/images/juego/items/barril.png",
      visible: (inventory, flags) =>
        flags.includes("barril_en_mesa") || flags.includes("juego_terminado"),
      imageScale: 0.7,

      onLook: (inventory, flags) => {
        if (flags.includes("juego_terminado"))
          return {
            text: "/images/juego/heinrich-sad.png|Ahí quedó el barril de la vergüenza. Necesito mi libro de recetas urgentemente.",
          };
        if (flags.includes("barril_en_mesa"))
          return {
            text: "/images/juego/heinrich-thinking.webp|El mosto está en el barril. Le falta la chispa de la vida: algo que la haga cobrar vida.",
          };
        return {
          text: "/images/juego/heinrich-neutral.webp|Una mesa vieja bajo la sombra. El lugar perfecto para dejar reposar un buen barril.",
        };
      },

      onInteract: (inventory, flags) => {
        const tieneMasaMadre = inventory.some((i) => i.id === "masa-madre");
        const tieneBarrilLleno = inventory.some((i) => i.id === "barril_lleno");

        // FASE INTERMEDIA: El barril está en la mesa
        if (flags.includes("barril_en_mesa")) {
          if (!tieneMasaMadre) {
            return {
              text: "/images/juego/heinrich-thinking.webp|El mosto dulce ya está en el barril, pero necesita fermentar.",
            };
          }

          // 🎬🎬🎬 ¡SE DISPARA EL OUTRO! 🎬🎬🎬
          return {
            setFlag: "juego_terminado",
            removeItem: "masa-madre",
            dialogue: [
              {
                portrait: "/images/juego/heinrich-happy.webp",
                text: "Agrego la masa madre al mosto y cierro el barril herméticamente.",
              },
              {
                portrait: "/images/juego/heinrich-thinking.webp",
                text: "Ahora solo queda esperar… y confiar en que no explote.",
              },
            ],
          };
        }

        // FASE INICIAL: No está en la mesa y tampoco lo tiene encima
        if (!tieneBarrilLleno) {
          return {
            text: "/images/juego/heinrich-thinking.webp|Es un lugar fresco, ideal para fermentar una cerveza",
          };
        }

        // TRANSICIÓN: Apoya el barril lleno en la mesa
        return {
          text: "/images/juego/heinrich-happy.webp|Apoyo el barril bajo la mesa, a la sombra. Pesa bastante. Ahora necesito algo para hacerlo fermentar...",
          setFlag: "barril_en_mesa",
          removeItem: "barril_lleno",
        };
      },
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|Mesa, llevemosnos bien.",
      }),
    },
  ],
};
