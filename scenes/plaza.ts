import { Scene } from "@/engine/types";

export const plazaScene: Scene = {
  id: "plaza",
  name: "PLAZA MAYOR",
  bgClass:
    "bg-[url('/images/juego/fondo-plaza.webp')] bg-cover bg-center bg-no-repeat",
  maskUrl: "/images/juego/fondo-plaza-mask.png",
  startX: 20,
  startY: 80,
  scale: 0.6, // Respaldo estático

  // === LÓGICA DE PERSPECTIVA (Igual que en el puerto) ===
  getScale: (y) => {
    const minY = 50; // El punto más lejano cerca del Cabildo/Recova
    const maxY = 100; // Primer plano
    const minScale = 0.20;
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
      isExit: true,
      top: "31%",
      left: "14%",
      width: "9%",
      height: "26%",
      walkToX: 9,
      walkToY: 40, // Ajustado para que camine hacia la salida
      onLook: () => ({
        text: "/images/juego/heinrich-neutral.webp|El camino embarrado que baja hacia el puerto.",
      }),
      onInteract: () => ({ text: "Caminando...", transition: "puerto" }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|No le hablo a los caminos, ya no estoy tan mareado por el viaje.",
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
        text: "/images/juego/heinrich-neutral.webp|Una mujer vendiendo pan recién horneado. Huele mejor que todo lo que probé en este puerto.",
      }),

      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.webp|Mejor hablarle con respeto. Esa mujer podría amasar… y golpear.",
      }),

      onTalk: (inventory, flags) => {
        const tieneLevadura = inventory.some((i) => i?.id === "masa-madre");

        // 🟢 1. YA TIENE LEVADURA (Bloque final)
        if (tieneLevadura) {
          return {
            text: "/images/juego/panadera-neutral.webp|Más le vale que esa cerveza sea mejor que su acento.",
          };
        }

        // 🔴 2. AÚN NO TIENE MOSTO LISTO
        if (!flags.includes("mosto_listo")) {
          if (!flags.includes("panadera_explico")) {
            return {
              setFlag: "panadera_explico",
              dialogue: [
                { portrait: "/images/juego/panadera-neutral.png", text: "¿Qué quiere, extranjero?" },
                { portrait: "/images/juego/heinrich-neutral.webp", text: "Hallo… estoy buscando algo que haga fermentar." },
                { portrait: "/images/juego/panadera-small-mouth.png", text: "¿Para hacer pan?" },
                { portrait: "/images/juego/heinrich-happy.webp", text: "Para hacer cerveza." },
                { portrait: "/images/juego/panadera-annoyed.png", text: "¿Cerveza? ¿Y ya la tiene?" },
                { portrait: "/images/juego/heinrich-speaking-small.webp", text: "Nein… estoy en eso.." },
                { portrait: "/images/juego/panadera-annoyed.png", text: "Primero consiga algo que fermentar. Después hablamos." },
              ],
            };
          }

          // Si ya te explicó pero seguís sin mosto
          return {
            text: "/images/juego/heinrich-neutral.webp|Mejor preparo el mosto antes de volver a insistirle.",
          };
        }

        // 🟡 3. TIENE EL MOSTO LISTO (Y YA LE HABÍA HABLADO ANTES)
        if (flags.includes("panadera_explico")) {
          return {
            dialogue: [
              { portrait: "/images/juego/panadera-neutral.png", text: "¿Otra vez usted?" },
              { portrait: "/images/juego/heinrich-happy.webp", text: "Ahora sí. Tengo el mosto dulce listo para fermentar." },
              { portrait: "/images/juego/panadera-small-mouth.png", text: "¿Eso es su famosa cerveza?" },
              { portrait: "/images/juego/heinrich-neutral.webp", text: "Todavía no… pero lo será." },
              { portrait: "/images/juego/panadera-annoyed.png", text: "No regalo masa madre para experimentos raros." },
              { portrait: "/images/juego/heinrich-happy.webp", text: "Le prometo que será la mejor cerveza que haya probado." },
              { portrait: "/images/juego/panadera-excited.png", text: "¿Ah, sí? Bueno… si me guarda un vaso… trato hecho." },
              { portrait: "/images/juego/panadera-neutral.png", text: "Aquí tiene la masa madre. Y si eso explota… no vuelva." },
            ],
            addItem: { id: "masa-madre", name: "masa madre", icon: "🍞", imageUrl: "/images/juego/items/masa-madre.png"},
          };
        }

        // 🟠 4. TIENE EL MOSTO LISTO (PERO NUNCA LE HABÍA HABLADO)
        return {
          setFlag: "panadera_explico", // Se la seteamos para que ya quede registrada
          dialogue: [
            { portrait: "/images/juego/panadera-neutral.png", text: "¿Qué se le ofrece, extranjero? Tengo el mejor pan de la Recova." },
            { portrait: "/images/juego/heinrich-happy.webp", text: "No busco pan, señora. Busco el secreto que lo hace crecer. Masa madre." },
            { portrait: "/images/juego/panadera-small-mouth.png", text: "¿Y para qué la quiere si no es para hornear?" },
            { portrait: "/images/juego/heinrich-neutral.webp", text: "Soy maestro cervecero. Tengo una olla llena de mosto esperando a ser fermentado." },
            { portrait: "/images/juego/panadera-annoyed.png", text: "No regalo masa madre para experimentos raros, gringo." },
            { portrait: "/images/juego/heinrich-happy.webp", text: "Le prometo que si me ayuda, probará la mejor cerveza de su vida." },
            { portrait: "/images/juego/panadera-excited.png", text: "¿Ah, sí? Bueno… si me guarda un vaso… trato hecho." },
            { portrait: "/images/juego/panadera-neutral.png", text: "Aquí tiene la masa madre. Y si eso explota… no vuelva." },
          ],
          addItem: { id: "masa-madre", name: "masa madre", icon: "🍞", imageUrl: "/images/juego/items/masa-madre.png"},
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
      walkToX: 50,
      walkToY: 75,
      onLook: () => ({
        text: "/images/juego/heinrich-surprised.webp|Dos hombres con ropas de campo. Están compartiendo una bebida caliente en una especie de calabaza.",
      }),
      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.webp|Tienen cuchillos muy grandes en la cintura. Mejor no los molesto físicamente.",
      }),
      onTalk: (inventory, flags) => {
        if (!flags.includes("conocio_mate")) {
          return {
            setFlag: "conocio_mate",
            dialogue: [
              {
                portrait: "/images/juego/heinrich-neutral.webp",
                text: "Buenas tardes, señores. ¿Qué es esa infusión que beben con tanta devoción?",
              },
              {
                portrait: "/images/juego/gauchos-neutral.png",
                text: "Es mate, amigazo. La sangre de esta tierra. ¿Gusta un amargo?",
              },
              {
                portrait: "/images/juego/heinrich-surprised.webp",
                text: "Oh, danke. (Heinrich da un sorbo)... ¡Es terriblemente amargo y caliente! Sabe a pasto hervido.",
              },
              {
                portrait: "/images/juego/gauchos-neutral.png",
                text: "(Se ríen a carcajadas) ¡Falta costumbre, gringo! Ya le vas a agarrar el gustito.",
              },
            ],
          };
        }
        return {
          text: "/images/juego/heinrich-neutral.webp|Mejor los dejo disfrutar de su 'mate'. Creo que prefiero la cerveza.",
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
        text: "/images/juego/heinrich-neutral.webp|Un grupo de palomas picoteando migas de pan en la tierra.",
      }),
      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.webp|Si trato de agarrar una, se irán volando.",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|Crrru cu cu... No, definitivamente no hablo idioma paloma.",
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
          text: "/images/juego/heinrich-neutral.webp|Una paloma picoteando migas de pan en la tierra.",
        };
      },
      onInteract: (inventory, flags) => {
        // Si ya la asustó, no la puede volver a asustar
        if (flags.includes("paloma_escapo"))
          return { text: "Ya asusté a esa pobre ave." };
        return {
          text: "/images/juego/heinrich-concerned.webp|¡Se fue volando! En Baviera las palomas son más lentas.",
          setFlag: "paloma_escapo", // Esta bandera unificada dispara la animación CSS
        };
      },
      onTalk: (inventory, flags) => {
        if (flags.includes("paloma_escapo")) return { text: "Ya se fue." };
        return {
          text: "/images/juego/heinrich-neutral.webp|Crrru cu cu... No, definitivamente no hablo idioma paloma.",
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
        text: "/images/juego/heinrich-neutral.webp|La bandera del Imperio Español. Parece que esta ciudad aún tiene dueño.",
      }),

      onInteract: () => ({
        text: "/images/juego/heinrich-concerned.webp|No creo que tocar eso sea buena idea.",
      }),

      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|Prefiero no meterme en política... vine a hacer cerveza.",
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
        text: "/images/juego/heinrich-neutral.webp|Un árbol grande que da buena sombra. Perfecto para escapar del calor.",
      }),

      onInteract: () => ({
        text: "/images/juego/heinrich-neutral.webp|No necesito madera... todavía.",
      }),

      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|En Baviera hay árboles así... pero con mejor cerveza cerca.",
      }),
    },
    {
      id: "fuente",
      name: "Fuente de Agua",
      top: "60%",
      left: "28%",
      width: "13%",
      height: "15%",
      walkToX: 40,
      walkToY: 80,

      onLook: () => ({
        text: "/images/juego/heinrich-neutral.webp|Una fuente con agua clara. Mucho mejor que ese río marrón.",
      }),

      onInteract: (inventory) => {
        const tieneBalde = inventory.some((i) => i.id === "balde_vacio");
        const tieneAgua = inventory.some((i) => i.id === "balde_agua");

        if (tieneAgua) {
          return {
            text: "/images/juego/heinrich-neutral.webp|El balde ya está lleno.",
          };
        }

        if (!tieneBalde) {
          return {
            text: "/images/juego/heinrich-concerned.webp|Necesito algo para transportar agua.",
          };
        }

        return {
          text: "/images/juego/heinrich-happy.webp|Lleno el balde con agua limpia de la fuente.",
          addItem: { id: "balde_agua", name: "Balde con Agua", icon: "🪣" , imageUrl: "/images/juego/items/balde-lleno.png"  },
          removeItem: "balde_vacio",
        };
      },

      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|No creo que el agua me responda.",
      }),
    },
    {
      id: "entrada_pulperia",
      name: "La Pulpería",
      isExit: true,
      top: "50%",
      left: "0%",
      width: "5%",
      height: "25%",
      walkToX: 5,
      walkToY: 80,
      onLook: () => ({
        text: "/images/juego/heinrich-surprised.webp|Un cartel de madera reza 'Pulpería El Farol'. Se escucha alboroto y guitarras desde adentro.",
      }),
      onInteract: () => ({
        text: "Entrando a la pulpería...",
        transition: "pulperia",
      }),
      onTalk: () => ({
        text: "/images/juego/heinrich-neutral.webp|Tengo la garganta seca, mejor entro a hablar adentro.",
      }),
    },
  ],
};
