import { Scene } from "@/engine/types";

export const pulperiaScene: Scene = {
  id: "pulperia",
  name: "LA PULPERÍA",
  bgClass:
    "bg-[url('/images/juego/fondo-pulperia.png')] bg-cover bg-center bg-no-repeat",
  maskUrl: "/images/juego/fondo-pulperia-mask.png",
  startX: 50,
  startY: 90,
  scale: 1.0,

  getScale: (y) => {
    const minY = 50;
    const maxY = 100;
    const minScale = 0.55;
    const maxScale = 1.1;

    let s = minScale + ((y - minY) / (maxY - minY)) * (maxScale - minScale);
    return Math.max(minScale, Math.min(maxScale, s));
  },

  limitMovement: (x, y) => {
    if (y < 55) y = 55;
    return { x, y };
  },

  hotspots: [
    // =======================
    // 🧔 PULPERO (PERMISOS)
    // =======================
    {
      id: "pulpero",
      name: "El Pulpero",
      top: "42%",
      left: "20%",
      width: "15%",
      height: "35%",
      walkToX: 35,
      walkToY: 75,

      onTalk: (inventory, flags) => {
        // 🟢 PRIMER ENCUENTRO
        if (!flags.includes("permiso_pulpero")) {
          return {
            setFlag: "permiso_pulpero",
            dialogue: [
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "Hallo… buenas tardes.",
              },
              {
                portrait: "/images/juego/pulpero-serious.png",
                text: "No lo conozco.",
              },
              {
                portrait: "/images/juego/pulpero-serious.png",
                text: "¿Qué busca?",
              },
              {
                portrait: "/images/juego/heinrich-happy.png",
                text: "Soy maestro cervecero. Quiero hacer cerveza.",
              },
              {
                portrait: "/images/juego/pulpero-smirk.png",
                text: "¿Cerveza?",
              },
              {
                portrait: "/images/juego/pulpero-smirk.png",
                text: "Acá tomamos cosas que pegan más fuerte.",
              },
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "La cerveza es una bebida noble.",
              },
              {
                portrait: "/images/juego/pulpero-speaking-medium.png",
                text: "Mientras no me rompa nada…",
              },
              {
                portrait: "/images/juego/pulpero-neutral.png",
                text: "Use lo que necesite.",
              },
              {
                portrait: "/images/juego/pulpero-smirk.png",
                text: "Pero si explota algo… usted limpia.",
              },
            ],
          };
        }

        // 🌾 MOMENTO CEBADA (NUEVO)
        if (
          inventory.some((i) => i.id === "cebada") &&
          !flags.includes("pulpero_comento_cebada")
        ) {
          return {
            setFlag: "pulpero_comento_cebada",
            dialogue: [
              {
                portrait: "/images/juego/pulpero-annoyed.png",
                text: "¿Agarró cebada?",
              },
              {
                portrait: "/images/juego/pulpero-serious.png",
                text: "Eso es comida para caballos.",
              },
              {
                portrait: "/images/juego/heinrich-happy.png",
                text: "¡También sirve para cerveza!",
              },
              {
                portrait: "/images/juego/pulpero-smirk.png",
                text: "Si logra que alguien se la tome… le pago una ronda.",
              },
            ],
          };
        }

        // 🔓 DESBLOQUEA PATIO
        if (flags.includes("mosto_listo") && !flags.includes("permiso_patio")) {
          return {
            setFlag: "permiso_patio",
            dialogue: [
              {
                portrait: "/images/juego/pulpero-neutral.png",
                text: "Eso…",
              },
              {
                portrait: "/images/juego/pulpero-neutral.png",
                text: "ya parece una bebida.",
              },
              {
                portrait: "/images/juego/heinrich-happy.png",
                text: "¡Danke! Es solo el comienzo.",
              },
              {
                portrait: "/images/juego/pulpero-smirk.png",
                text: "No cante victoria todavía.",
              },
              {
                portrait: "/images/juego/pulpero-neutral.png",
                text: "Puede usar el patio de atrás.",
              },
              {
                portrait: "/images/juego/pulpero-smirk.png",
                text: "Si eso fermenta… avíseme.",
              },
            ],
          };
        }

        // 🔁 RESPUESTAS DINÁMICAS

        if (!flags.includes("olla_encendida")) {
          return {
            text: "/images/juego/pulpero-neutral.png|Si va a usar la olla… al menos prenda el fuego. No cocino con milagros.",
          };
        }

        if (
          flags.includes("agua_agregada") &&
          !flags.includes("malta_agregada")
        ) {
          return {
            text: "/images/juego/pulpero-smirk.png|Eso es agua caliente. No impresiona a nadie.",
          };
        }

        if (
          flags.includes("malta_agregada") &&
          !flags.includes("mosto_listo")
        ) {
          return {
            text: "/images/juego/pulpero-neutral.png|Ahora sí… eso huele a algo. Raro… pero algo.",
          };
        }

        if (flags.includes("mosto_listo")) {
          return {
            text: "/images/juego/pulpero-smirk.png|Si eso no lo mata… capaz hasta le compro un vaso.",
          };
        }

        return {
          text: "/images/juego/pulpero-neutral.png|Mientras no incendie la pulpería… estamos bien.",
        };
      },
    },
    {
      id: "galleta",
      name: "Perro Bichón",
      top: "80%",
      left: "15%",
      width: "10%",
      height: "15%",
      walkToX: 40,
      walkToY: 100,

      onLook: () => ({
        text: "/images/juego/heinrich-happy.png|Un pequeño bichón blanco y marrón. Demasiado elegante para este lugar.",
      }),

      onInteract: (inventory, flags) => {
        if (!flags.includes("galleta_saludo")) {
          return {
            setFlag: "galleta_saludo",
            text: "/images/juego/heinrich-happy.png|Le hago mimos. Mueve la cola feliz.",
          };
        }

        if (
          inventory.some((i) => i.id === "cebada") &&
          !flags.includes("galleta_cebada")
        ) {
          return {
            setFlag: "galleta_cebada",
            text: "/images/juego/heinrich-surprised.png|¡Galleta intenta comerse la cebada! ¡No, eso es para cerveza… o para caballos!",
          };
        }

        return {
          text: "/images/juego/heinrich-neutral.png|Galleta me observa como si entendiera todo.",
        };
      },

      onTalk: () => ({
        text: "/images/juego/heinrich-speaking-small.png|Hallo, pequeño amigo.",
      }),
    },
    // =======================
    // 🔥 PANCHO (YESCA)
    // =======================
    {
      id: "gaucho",
      name: "Gaucho Pancho",
      top: "62%",
      left: "75%",
      width: "15%",
      height: "35%",
      walkToX: 65,
      walkToY: 85,

      onTalk: (inventory, flags) => {
        const tieneYesca = inventory.some((i) => i.id === "yesca");

        // 🟢 PRIMER ENCUENTRO
        if (!flags.includes("hablo_pancho")) {
          return {
            setFlag: "hablo_pancho",
            dialogue: [
              {
                portrait: "/images/juego/pancho-neutral.png",
                text: "Buenas, gringo. No sos de por acá, ¿no?",
              },
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "Soy cervecero. Quiero hacer cerveza.",
              },
              {
                portrait: "/images/juego/pancho-amused.png",
                text: "¿Cerveza? Acá tomamos mate… o cosas que te dejan viendo doble.",
              },
              {
                portrait: "/images/juego/pancho-smiling.png",
                text: "Pero me gusta tu idea. Suena a problema… y a diversión.",
              },
            ],
          };
        }

        // 🔥 ENTREGA YESCA (con humor)
        if (!tieneYesca) {
          return {
            dialogue: [
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "Necesito encender la olla… pero no tengo con qué.",
              },
              {
                portrait: "/images/juego/pancho-serious.png",
                text: "Sin chispa no hay fuego, gringo.",
              },
              {
                portrait: "/images/juego/pancho-amused.png",
                text: "Y sin fuego… lo tuyo es sopa triste.",
              },
              {
                portrait: "/images/juego/pancho-smiling.png",
                text: "Tomá, llevate esto. Siempre viene bien.",
              },
            ],
            addItem: { id: "yesca", name: "Yesca", icon: "🔥" },
          };
        }

        // 🔥 AÚN NO PRENDIÓ FUEGO
        if (!flags.includes("olla_encendida")) {
          return {
            text: "/images/juego/pancho-amused.png|¿Y? ¿La olla se va a prender sola o estás esperando un milagro?",
          };
        }

        // 💧 SOLO AGUA
        if (
          flags.includes("agua_agregada") &&
          !flags.includes("malta_agregada")
        ) {
          return {
            text: "/images/juego/pancho-amused.png|Eso es agua caliente, gringo. Hasta mi caballo hace algo más interesante.",
          };
        }

        // 🌾 CON MALTA
        if (
          flags.includes("malta_agregada") &&
          !flags.includes("mosto_listo")
        ) {
          return {
            text: "/images/juego/pancho-smiling.png|Ahora sí… eso ya empieza a oler como algo serio.",
          };
        }

        // 🍺 MOSTO LISTO → PISTA CLAVE
        if (
          flags.includes("mosto_listo") &&
          !flags.includes("pancho_hint_fermento")
        ) {
          return {
            setFlag: "pancho_hint_fermento",
            dialogue: [
              {
                portrait: "/images/juego/pancho-serious.png",
                text: "Ahora viene lo importante.",
              },
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "¿Qué sigue?",
              },
              {
                portrait: "/images/juego/pancho-neutral.png",
                text: "Dejalo descansar… como al mate.",
              },
              {
                portrait: "/images/juego/pancho-smiling.png",
                text: "Buscate un barril… y armate de paciencia.",
              },
            ],
          };
        }

        // 🕵️ WHITMORE (LORE)
        if (!flags.includes("advirtio_whitmore")) {
          return {
            setFlag: "advirtio_whitmore",
            dialogue: [
              {
                portrait: "/images/juego/pancho-serious.png",
                text: "Y ojo con ese inglés…",
              },
              {
                portrait: "/images/juego/pancho-annoyed.png",
                text: "Whitmore no me gusta nada.",
              },
              {
                portrait: "/images/juego/pancho-serious.png",
                text: "Nadie trae tantos barriles porque sí.",
              },
            ],
          };
        }

        // 🔁 DEFAULT
        return {
          text: "/images/juego/pancho-smiling.png|Todo llega, gringo… hasta la buena cerveza.",
        };
      },
    },

    // =======================
    // 🍲 OLLA (CORE GAMEPLAY)
    // =======================
    {
      id: "olla",
      name: "Olla",
      top: "40%",
      left: "50%",
      width: "8%",
      height: "15%",
      walkToX: 55,
      walkToY: 75,

      onInteract: (inventory, flags) => {
        const tieneYesca = inventory.some((i) => i.id === "yesca");
        const tieneAgua = inventory.some((i) => i.id === "balde_agua");
        const tieneCebada = inventory.some((i) => i.id === "cebada");
        const tieneLupulo = inventory.some((i) => i.id === "lupulo");

        // 🔒 SIN PERMISO
        if (!flags.includes("permiso_pulpero")) {
          return {
            text: "/images/juego/heinrich-neutral.png|Mejor pedir permiso antes de usar esto.",
          };
        }

        // 🔥 ENCENDER FUEGO
        if (!flags.includes("olla_encendida")) {
          if (!tieneYesca) {
            return {
              text: "/images/juego/heinrich-concerned.png|Necesito algo para encender el fuego.",
            };
          }

          return {
            text: "/images/juego/heinrich-happy.png|Prendo el fuego debajo de la olla.",
            setFlag: "olla_encendida",
          };
        }

        // 💧 AGREGAR AGUA
        if (!flags.includes("agua_agregada")) {
          if (!tieneAgua) {
            return {
              text: "/images/juego/heinrich-neutral.png|Necesito agua primero.",
            };
          }

          return {
            text: "/images/juego/heinrich-neutral.png|Agrego agua a la olla.",
            setFlag: "agua_agregada",
            removeItem: "balde_agua",
          };
        }

        // 🌾 AGREGAR CEBADA → MACERADO
        if (!flags.includes("macerado")) {
          if (!tieneCebada) {
            return {
              text: "/images/juego/heinrich-neutral.png|Necesito cebada.",
            };
          }

          return {
            text: "/images/juego/heinrich-happy.png|Agrego la cebada. El aroma empieza a cambiar…",
            setFlag: "macerado",
            removeItem: "cebada",
          };
        }

        // 🌿 AGREGAR LÚPULO → HERVOR
        if (!flags.includes("hervido")) {
          if (!tieneLupulo) {
            return {
              text: "/images/juego/heinrich-neutral.png|Necesito algo para darle amargor… el lúpulo.",
            };
          }

          return {
            text: "/images/juego/heinrich-happy.png|Agrego el lúpulo. Ahora sí… esto empieza a ser cerveza.",
            setFlag: "hervido",
            removeItem: "lupulo",
          };
        }

        // 🧊 ENFRIADO
        if (!flags.includes("mosto_enfriando")) {
          return {
            text: "/images/juego/heinrich-neutral.png|El mosto está demasiado caliente. Debo dejarlo enfriar antes de seguir.",
            setFlag: "mosto_enfriando",
          };
        }

        // ⏳ YA LISTO PARA PASAR A BARRIL
        if (!flags.includes("mosto_listo")) {
          return {
            text: "/images/juego/heinrich-happy.png|Perfecto. El mosto ya está listo para fermentarse.",
            setFlag: "mosto_listo",
            setFlag: "necesita_fermentar", // 🔥 conecta con barril
          };
        }

        // 🔁 FINAL
        return {
          text: "/images/juego/heinrich-neutral.png|La olla ya hizo su trabajo.",
        };
      },
    },

    // =======================
    // 🌾 MALTA (CON PERMISO)
    // =======================
    {
      id: "saco_malta",
      name: "Saco de Granos",
      top: "41%",
      left: "75%",
      width: "6%",
      height: "10%",
      walkToX: 75,
      walkToY: 80,

      onInteract: (inventory, flags) => {
        if (!flags.includes("permiso_pulpero")) {
          return {
            text: "No debería tocar esto sin permiso.",
          };
        }

        if (inventory.some((i) => i.id === "malta")) {
          return { text: "Ya tengo malta." };
        }

        return {
          text: "Tomo un poco de malta.",
          addItem: { id: "malta", name: "Malta", icon: "🌾" },
        };
      },
    },

    // =======================
    // 🚪 PATIO (LOCK)
    // =======================
    {
      id: "salida_quinta",
      name: "Patio",
      top: "30%",
      left: "66%",
      width: "7%",
      height: "20%",
      walkToX: 60,
      walkToY: 55,

      onInteract: (inventory, flags) => {
        if (!flags.includes("permiso_patio")) {
          return {
            text: "Mejor pedir permiso antes de ir al patio.",
          };
        }

        return {
          text: "Voy al patio.",
          transition: "quinta",
        };
      },
    },

    // =======================
    // 🚪 SALIDA PLAZA
    // =======================
    {
      id: "salida_plaza",
      name: "plaza mayor",
      top: "95%",
      left: "30%",
      width: "50%",
      height: "5%",
      walkToX: 50,
      walkToY: 95,
      onInteract: () => ({
        text: "Saliendo...",
        transition: "plaza",
      }),
    },
  ],
};
