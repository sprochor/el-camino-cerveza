import { Scene } from "@/engine/types";

export const plazaScene: Scene = {
  id: "plaza",
  name: "PLAZA MAYOR",
  bgClass:
    "bg-[url('/images/juego/fondo-plaza.png')] bg-cover bg-center bg-no-repeat",
  maskUrl: "/images/juego/fondo-plaza-mask.png",
  startX: 20,
  startY: 80,
  scale: 0.6, // Respaldo estático

  // === LÓGICA DE PERSPECTIVA (Igual que en el puerto) ===
  getScale: (y) => {
    const minY = 50; // El punto más lejano cerca del Cabildo/Recova
    const maxY = 100; // Primer plano
    const minScale = 0.45;
    const maxScale = 0.8;

    let dynamicScale =
      minScale + ((y - minY) / (maxY - minY)) * (maxScale - minScale);

    if (dynamicScale < minScale) return minScale;
    if (dynamicScale > maxScale) return maxScale;

    return dynamicScale;
  },
  // ========================================================

  limitMovement: (targetX, targetY) => {
    // Plan B si la máscara no carga: no puede caminar por encima del horizonte
    return { x: targetX, y: Math.max(targetY, 55) };
  },

  hotspots: [
    {
      id: "salida_puerto",
      name: "Volver al Puerto",
      top: "31%",
      left: "14%",
      width: "9%",
      height: "26%",
      walkToX: 9,
      walkToY: 60, // Ajustado para que camine hacia la salida
      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|El camino embarrado que baja hacia el puerto.",
      }),
      onInteract: () => ({ text: "Caminando...", transition: "puerto" }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|No le hablo a los caminos, ya no estoy tan mareado por el viaje.",
      }),
    },
    {
      id: "panadera",
      name: "Señora Panadera",
      top: "55%",
      left: "83%",
      width: "10%",
      height: "27%",
      walkToX: 78,
      walkToY: 83,

      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|Una mujer vendiendo pan recién horneado. Huele mejor que todo lo que probé en este puerto.",
      }),

      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.png|Mejor hablarle con respeto. Esa mujer podría amasar… y golpear.",
      }),

      onTalk: (inventory, flags) => {
        const tieneLevadura = inventory.some((i) => i.id === "levadura");

        // 🟢 YA TIENE LEVADURA
        if (tieneLevadura) {
          return {
            text: "/images/juego/panadera-neutral.png|Más le vale que esa cerveza sea mejor que su acento.",
          };
        }

        // 🔴 NO TIENE MOSTO
        if (!flags.includes("mosto_listo")) {
          if (!flags.includes("panadera_explico")) {
            return {
              setFlag: "panadera_explico",
              dialogue: [
                {
                  portrait: "/images/juego/panadera-neutral.png",
                  text: "¿Qué quiere, extranjero?",
                },
                {
                  portrait: "/images/juego/heinrich-neutral.png",
                  text: "Hallo… estoy buscando levadura.",
                },
                {
                  portrait: "/images/juego/panadera-small-mouth.png",
                  text: "¿Para hacer pan?",
                },
                {
                  portrait: "/images/juego/heinrich-happy.png",
                  text: "Para hacer cerveza.",
                },
                {
                  portrait: "/images/juego/panadera-annoyed.png",
                  text: "¿Cerveza? Eso no es cosa seria.",
                },
                {
                  portrait: "/images/juego/panadera-annoyed.png",
                  text: "Primero consiga algo que fermentar. Después hablamos.",
                },
              ],
            };
          }

          return {
            text: "/images/juego/heinrich-neutral.png|Mejor termino la cerveza antes de volver a hablarle.",
          };
        }

        // 🟡 TIENE MOSTO → NEGOCIACIÓN
        if (!flags.includes("panadera_acuerdo")) {
          return {
            setFlag: "panadera_acuerdo",
            dialogue: [
              {
                portrait: "/images/juego/panadera-neutral.png",
                text: "¿Otra vez usted?",
              },
              {
                portrait: "/images/juego/heinrich-happy.png",
                text: "Ahora sí. Tengo algo listo para fermentar.",
              },
              {
                portrait: "/images/juego/panadera-small-mouth.png",
                text: "¿Eso es su famosa cerveza?",
              },
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "Todavía no… pero lo será.",
              },
              {
                portrait: "/images/juego/panadera-annoyed.png",
                text: "No regalo levadura para experimentos raros.",
              },
              {
                portrait: "/images/juego/heinrich-happy.png",
                text: "Le prometo que será la mejor cerveza que haya probado.",
              },
              {
                portrait: "/images/juego/panadera-excited.png",
                text: "¿Ah, sí?",
              },
              {
                portrait: "/images/juego/panadera-smiling.png",
                text: "Bueno… si me guarda un vaso… trato hecho.",
              },
            ],
          };
        }

        // 🟢 ENTREGA FINAL
        return {
          dialogue: [
            {
              portrait: "/images/juego/panadera-small-mouth.png",
              text: "Más le vale cumplir, extranjero.",
            },
            {
              portrait: "/images/juego/panadera-neutral.png",
              text: "Aquí tiene la levadura.",
            },
            {
              portrait: "/images/juego/panadera-annoyed.png",
              text: "Y si eso explota… no vuelva.",
            },
          ],
          addItem: { id: "levadura", name: "Levadura Fresca", icon: "🍞" },
        };
      },
    },
    {
      id: "gauchos",
      name: "Gauchos",
      top: "53%",
      left: "45%", // Ubicados a la derecha de la plaza
      width: "11%",
      height: "17%",
      walkToX: 75,
      walkToY: 75,
      onLook: () => ({
        text: "/images/juego/heinrich-surprised.png|Dos hombres con ropas de campo. Están compartiendo una bebida caliente en una especie de calabaza.",
      }),
      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.png|Tienen cuchillos muy grandes en la cintura. Mejor no los molesto físicamente.",
      }),
      onTalk: (inventory, flags) => {
        if (!flags.includes("conocio_mate")) {
          return {
            setFlag: "conocio_mate",
            dialogue: [
              {
                portrait: "/images/juego/heinrich-neutral.png",
                text: "Buenas tardes, señores. ¿Qué es esa infusión que beben con tanta devoción?",
              },
              {
                portrait: "/images/juego/Gauchos-neutral.png",
                text: "Es mate, amigazo. La sangre de esta tierra. ¿Gusta un amargo?",
              },
              {
                portrait: "/images/juego/heinrich-surprised.png",
                text: "Oh, danke. (Heinrich da un sorbo)... ¡Es terriblemente amargo y caliente! Sabe a pasto hervido.",
              },
              {
                portrait: "/images/juego/Gauchos-neutral.png",
                text: "(Se ríen a carcajadas) ¡Falta costumbre, gringo! Ya le vas a agarrar el gustito.",
              },
            ],
          };
        }
        return {
          text: "/images/juego/heinrich-neutral.png|Mejor los dejo disfrutar de su 'mate'. Creo que prefiero la cerveza.",
        };
      },
    },
    {
      id: "palomas", // EL GRUPO DE PALOMAS
      name: "Palomas",
      top: "53%",
      left: "23%",
      width: "10%",
      height: "10%",
      walkToX: 25, // Lo ajusté para que camine cerca de ellas y no al centro
      walkToY: 60,
      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|Un grupo de palomas picoteando migas de pan en la tierra.",
      }),
      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.png|Si trato de agarrar una, se irán volando.",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|Crrru cu cu... No, definitivamente no hablo idioma paloma.",
      }),
    },
    {
      id: "paloma", // LA PALOMA INDIVIDUAL QUE ESCAPA
      name: "Paloma",
      top: "93%",
      left: "81%",
      width: "15%",
      height: "10%",
      walkToX: 75, // ¡Ahora sí camina a la derecha, cerca de la paloma!
      walkToY: 100,
      // ELIMINAMOS EL CONDITION PARA PODER ANIMARLA
      onLook: (inventory, flags) => {
        // Si ya se fue, Heinrich dice otra cosa
        if (flags.includes("paloma_escapo")) return { text: "Ya se fue." };
        return {
          text: "/images/juego/heinrich-neutral.png|Una paloma picoteando migas de pan en la tierra.",
        };
      },
      onInteract: (inventory, flags) => {
        // Si ya la asustó, no la puede volver a asustar
        if (flags.includes("paloma_escapo"))
          return { text: "Ya asusté a esa pobre ave." };
        return {
          text: "/images/juego/heinrich-concerned.png|¡Se fue volando! En Baviera las palomas son más lentas.",
          setFlag: "paloma_escapo", // Esta bandera unificada dispara la animación CSS
        };
      },
      onTalk: (inventory, flags) => {
        if (flags.includes("paloma_escapo")) return { text: "Ya se fue." };
        return {
          text: "/images/juego/heinrich-neutral.png|Crrru cu cu... No, definitivamente no hablo idioma paloma.",
        };
      },
    },
    {
      id: "bandera_espanola",
      name: "Bandera Española",
      top: "5%",
      left: "37%",
      width: "3%",
      height: "7%",
      walkToX: 50,
      walkToY: 65,

      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|La bandera del Imperio Español. Parece que esta ciudad aún tiene dueño.",
      }),

      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.png|No creo que tocar eso sea buena idea.",
      }),

      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|Prefiero no meterme en política... vine a hacer cerveza.",
      }),
    },
    {
      id: "arbol_plaza",
      name: "Árbol",
      top: "20%",
      left: "53%",
      width: "15%",
      height: "35%",
      walkToX: 60,
      walkToY: 60,

      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|Un árbol grande que da buena sombra. Perfecto para escapar del calor.",
      }),

      onInteract: () => ({
        text: "/images/juego/heinrich-neutral.png|No necesito madera... todavía.",
      }),

      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|En Baviera hay árboles así... pero con mejor cerveza cerca.",
      }),
    },
    {
      id: "fuente",
      name: "Fuente de Agua",
      top: "60%",
      left: "28%",
      width: "13%",
      height: "15%",
      walkToX: 50,
      walkToY: 80,

      onLook: () => ({
        text: "/images/juego/heinrich-neutral.png|Una fuente con agua clara. Mucho mejor que ese río marrón.",
      }),

      onInteract: (inventory) => {
        const tieneBalde = inventory.some((i) => i.id === "balde_vacio");
        const tieneAgua = inventory.some((i) => i.id === "balde_agua");

        if (tieneAgua) {
          return {
            text: "/images/juego/heinrich-neutral.png|El balde ya está lleno.",
          };
        }

        if (!tieneBalde) {
          return {
            text: "/images/juego/heinrich-concerned.png|Necesito algo para transportar agua.",
          };
        }

        return {
          text: "/images/juego/heinrich-happy.png|Lleno el balde con agua limpia de la fuente.",
          addItem: { id: "balde_agua", name: "Balde con Agua", icon: "🪣" },
          removeItem: "balde_vacio",
        };
      },

      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|No creo que el agua me responda.",
      }),
    },
    {
      id: "entrada_pulperia",
      name: "La Pulpería",
      top: "50%",
      left: "0%",
      width: "5%",
      height: "25%",
      walkToX: 5,
      walkToY: 80,
      onLook: () => ({
        text: "/images/juego/heinrich-surprised.png|Un cartel de madera reza 'Pulpería El Farol'. Se escucha alboroto y guitarras desde adentro.",
      }),
      onInteract: () => ({
        text: "Entrando a la pulpería...",
        transition: "pulperia",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.png|Tengo la garganta seca, mejor entro a hablar adentro.",
      }),
    },
  ],
};
