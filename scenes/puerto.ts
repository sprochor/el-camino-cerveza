import { Scene } from "@/engine/types";

export const puertoScene: Scene = {
  id: "puerto",
  name: "PUERTO DE BUENOS AIRES",
  bgClass:
    "bg-[url('/images/juego/fondo-puerto.png')] bg-cover bg-center bg-no-repeat",
  maskUrl: "/images/juego/fondo-puerto-mask.png",
  startX: 40,
  startY: 85,
  scale: 0.6, // Dejamos esto como respaldo

  // === NUEVA LÓGICA DE PERSPECTIVA ===
  getScale: (y) => {
    const minY = 60; // El punto más lejano en el fondo
    const maxY = 100; // El punto más cercano a la pantalla
    const minScale = 0.35; // Tamaño cuando está lejos
    const maxScale = 0.8; // Tamaño cuando está cerca

    // Interpolación lineal (Calcula el tamaño exacto según la posición)
    let dynamicScale =
      minScale + ((y - minY) / (maxY - minY)) * (maxScale - minScale);

    // Por seguridad, evitamos que crezca o se achique más de los límites
    if (dynamicScale < minScale) return minScale;
    if (dynamicScale > maxScale) return maxScale;

    return dynamicScale;
  },
  // ===================================

  limitMovement: (targetX, targetY) => {
    let safeX = targetX;
    let safeY = targetY;

    if (safeY < 60) safeY = 60;

    if (safeX < 35) {
      if (safeY < 85) safeY = 85;
    }

    if (safeX > 50) {
      if (safeY > 65 && safeY < 85) {
        safeY = safeY < 75 ? 65 : 85;
      }
    }
    return { x: safeX, y: safeY };
  },
  hotspots: [
    {
      id: "barriles",
      name: "Cargamento Inglés",
      top: "60%",
      left: "11%",
      width: "20%",
      height: "17%",
      walkToX: 25,
      walkToY: 85,
      onLook: () => ({
        text: "/images/juego/heinrich-surprised.png|Barriles ingleses... pero no huelen a cerveza.",
      }),
      onInteract: (inventory, flags) => {
        if (!flags.includes("sospecha_polvora")) {
          return {
            text: "/images/juego/heinrich-concerned.png|Esto no es cerveza negra. La textura... el olor... Es pólvora.",
            setFlag: "sospecha_polvora",
          };
        }
        return {
          text: "/images/juego/heinrich-neutral.png|Están repletos de pólvora. Alguien planea un asedio.",
        };
      },
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|Shhh. Los barriles no hablan, pero a veces explotan.",
      }),
    },
    {
      id: "edward_whitmore",
      name: "Edward Whitmore",
      top: "63%",
      left: "75%",
      width: "10%",
      height: "30%",
      walkToX: 70,
      walkToY: 100,

      onLook: (inventory, flags) => {
        if (flags.includes("conocio_whitmore")) {
          if (flags.includes("sospecha_polvora")) {
            return {
              text: "/images/juego/heinrich-concerned.png|Ese inglés es peligroso. Y esos barriles… no son cerveza.",
            };
          }
          return {
            text: "/images/juego/heinrich-neutral.png|Edward Whitmore. Comerciante… o algo peor.",
          };
        }
        return {
          text: "/images/juego/heinrich-neutral.png|Un hombre elegante. Demasiado elegante para este puerto.",
        };
      },

      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.png|No creo que tocar a un inglés bien vestido termine bien.",
      }),

      onTalk: (inventory, flags) => {
        // 🟢 PRIMER ENCUENTRO
        if (!flags.includes("conocio_whitmore")) {
          return {
            setFlag: "conocio_whitmore",
            dialogue: [
              {
                portrait: "/images/juego/edward-neutral.png",
                text: "Adler… no esperaba verte con vida en Buenos Aires.",
              },
              {
                portrait: "/images/juego/heinrich-surprised.png",
                text: "¿Nos conocemos?",
              },
              {
                portrait: "/images/juego/edward-smirk.png",
                text: "Digamos que nuestros intereses comerciales… colisionaron en alta mar.",
              },
              {
                portrait: "/images/juego/heinrich-angry.png",
                text: "¡Tú ordenaste tirar mi cargamento por la borda!",
              },
              {
                portrait: "/images/juego/edward-neutral.png",
                text: "Era necesario aligerar la carga. Supervivencia básica.",
              },
              {
                portrait: "/images/juego/heinrich-angry.png",
                text: "Para usted tal vez. Para mí era mi trabajo.",
              },
              {
                portrait: "/images/juego/edward-smirk.png",
                text: "El mundo recompensa a quienes saben adaptarse, Adler.",
              },
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "Yo prefiero perfeccionar las cosas. Como la cerveza.",
              },
              {
                portrait: "/images/juego/edward-smirk.png",
                text: "¿Cerveza? Yo solo comercio porter inglesa.",
              },
              {
                portrait: "/images/juego/heinrich-surprised.png",
                text: "¿Porter? ¿Cerveza negra? Nein… las cervezas deben ser rubias.",
              },
              {
                portrait: "/images/juego/edward-smirk.png",
                text: "El mercado parece pensar lo contrario.",
              },
              {
                portrait: "/images/juego/heinrich-happy.png",
                text: "Entonces el mercado necesita educación.",
              },
              {
                portrait: "/images/juego/edward-neutral.png",
                text: "Ten cuidado, Adler… Buenos Aires no es Baviera.",
              },
            ],
          };
        }

        // 🔴 SI DESCUBRE LA PÓLVORA → NO HABLAR MÁS
        if (flags.includes("sospecha_polvora")) {
          return {
            text: "/images/juego/heinrich-concerned.png|No debería llamar su atención otra vez. Ese hombre es peligroso.",
          };
        }

        // 🟡 SEGUNDA INTERACCIÓN (antes de pólvora)
        if (!flags.includes("hablo_whitmore_extra")) {
          return {
            setFlag: "hablo_whitmore_extra",
            dialogue: [
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "¿Siempre arruina el negocio de otros?",
              },
              {
                portrait: "/images/juego/edward-smirk.png",
                text: "Solo cuando es conveniente.",
              },
              {
                portrait: "/images/juego/heinrich-annoyed.png",
                text: "Algún día probará una cerveza de verdad.",
              },
              {
                portrait: "/images/juego/edward-smirk.png",
                text: "Y tú, Adler… algún día entenderás el poder.",
              },
            ],
          };
        }

        // 🔁 DEFAULT (antes de pólvora)
        return {
          text: "/images/juego/edward-smirk.png|Disfruta tu pequeño proyecto, cervecero.",
        };
      },
    },
    {
      id: "equipaje",
      name: "Mi Equipaje",
      top: "88%",
      left: "26%",
      width: "10%",
      height: "12%",
      walkToX: 30,
      walkToY: 85,
      onLook: () => ({
        text: "/images/juego/heinrich-concerned.png|Mis cosas. Las tiraron del barco como si fueran basura.",
      }),
      onInteract: (inventory, flags) => {
        if (inventory.some((i) => i.id === "recetas"))
          return {
            text: "/images/juego/heinrich-neutral.png|Ya no queda nada útil aquí.",
          };

        if (flags.includes("cerveza_arruinada")) {
          return {
            text: "/images/juego/heinrich-happy.png|¡Lo encontré! Mi libro de recetas familiar. Ahora podré hacer la cerveza bien.",
            addItem: { id: "recetas", name: "Libro de Recetas", icon: "📖" },
          };
        }
        return {
          text: "/images/juego/heinrich-neutral.png|Solo hay ropa vieja. Primero debo buscar los ingredientes.",
        };
      },
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|No hablo con maletas.",
      }),
    },
    {
      id: "barco_ingles",
      name: "Galeón Inglés",
      top: "22%",
      left: "55%",
      width: "18%",
      height: "25%",
      walkToX: 55,
      walkToY: 65,

      onLook: (inventory, flags) => {
        if (flags.includes("sospecha_polvora")) {
          return {
            text: "/images/juego/heinrich-concerned.png|Ese galeón inglés está demasiado armado para ser un simple barco mercante.",
          };
        }

        return {
          text: "/images/juego/heinrich-neutral.png|Un galeón mercante inglés anclado en el puerto. Parece recién llegado de Europa.",
        };
      },

      onInteract: () => ({
        text: "/images/juego/heinrich-neutral.png|Intento acercarme, pero el muelle no llega hasta el barco.",
      }),

      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|— ¿Hola?\n\nEl barco no responde. Supongo que eso es buena señal.",
      }),
    },
    {
      id: "cielo",
      name: "Cielo",
      top: "0%",
      left: "10%",
      width: "89%",
      height: "20%",
      walkToX: 40,
      walkToY: 65,

      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|Un día soleado en Buenos Aires. En Baviera el cielo suele ser mucho más gris.",
      }),

      onInteract: () => ({
        text: "/images/juego/heinrich-neutral.png|No creo que pueda alcanzar el cielo.",
      }),

      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|Hola cielo.\n\nSigue sin responder.",
      }),
    },
    {
      id: "rio_plata",
      name: "Río",
      top: "40%",
      left: "75%",
      width: "20%",
      height: "20%",
      walkToX: 50,
      walkToY: 65,
      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|El famoso Río de la Plata. Parece más un mar marrón que un río.",
      }),
      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.png|No creo que esta agua sirva para hacer cerveza.",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|He visto sopas más claras que este río.",
      }),
    },
    {
      id: "barril_vacio",
      name: "Barriles Vacíos",
      top: "74%",
      left: "66%",
      width: "8%",
      height: "12%",
      walkToX: 60,
      walkToY: 85,
      imageUrl: "/images/juego/barril-vacio.png",
      condition: (inventory) => !inventory.some((i) => i.id === "barril_vacio"),

      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|Unos pequeños barriles de madera vacío. Perfecto para fermentar mi primera tanda.",
      }),
      onInteract: (inventory, flags) => {
        // 1. Si NO está enfriando y TAMPOCO está listo
        if (!flags.includes("mosto_enfriando") && !flags.includes("necesita_fermentar")) {
          return {
            text: "/images/juego/heinrich-concerned.png|Mejor no andar cargando un barril inútilmente. Solo lo llevaré cuando tenga mosto cocinándose o listo.",
          };
        }

        // 2. Si el mosto se estaba enfriando, aprovechamos el viaje para darlo por terminado
        if (flags.includes("mosto_enfriando") && !flags.includes("mosto_listo")) {
          return {
            text: "/images/juego/heinrich-happy.png|¡Me llevo uno! Con la caminata hasta acá y la vuelta, el mosto de la olla ya debería estar perfectamente frío.",
            addItem: { id: "barril_vacio", name: "Barril Vacío", icon: "🛢️" , imageUrl: "/images/juego/items/barril.png" },
            setFlag: "mosto_listo,necesita_fermentar" // 👈 ¡La magia del tiempo acá!
          };
        }

        // 3. Si por casualidad el jugador ya lo había dejado enfriar del todo antes de venir
        return {
          text: "/images/juego/heinrich-happy.png|¡Me llevo uno! Esto es exactamente lo que necesito para dejar fermentando mi cerveza.",
          addItem: { id: "barril_vacio", name: "Barril Vacío", icon: "🛢️" , imageUrl: "/images/juego/items/barril.png" },
          setFlag: "necesita_fermentar"
        };
      },
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|Si le hablo adentro, solo escucharé el eco de mi propia voz.",
      }),
    },
    {
      id: "salida_plaza",
      name: "la Plaza Mayor",
      isExit: true,
      top: "35%",
      left: "30%",
      width: "5%",
      height: "15%",
      walkToX: 30,
      walkToY: 60,
      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|El camino se curva hacia el centro de la ciudad. Se ve el Cabildo a lo lejos.",
      }),
      onInteract: () => ({ text: "Caminando...", transition: "plaza" }),
      onTalk: () => ({ text: "..." }),
    },
  ],
};
