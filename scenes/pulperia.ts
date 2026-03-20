import { Scene, ActionResult, Item } from "@/engine/types";

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
    // 🧔 PULPERO (DIÁLOGOS DINÁMICOS)
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
        // 1. PRIMER ENCUENTRO
        if (!flags.includes("conocio_pulpero")) {
          return {
            setFlag: "conocio_pulpero",
            dialogue: [
              { portrait: "/images/juego/heinrich-neutral.png", text: "Hallo… buenas tardes." },
              { portrait: "/images/juego/pulpero-serious.png", text: "No lo conozco. ¿Qué busca?" },
              { portrait: "/images/juego/heinrich-happy.png", text: "Soy Heinrich, un maestro cervecero. Solo estoy conociendo el lugar." },
              { portrait: "/images/juego/pulpero-smirk.png", text: "Acá tomamos cosas fuertes, gringo. Si va a consumir, siéntese. Si no, no estorbe el paso." }
            ],
          };
        }

        // 2. PEDIR LA OLLA
        if (flags.includes("quiere_usar_olla") && !flags.includes("permiso_pulpero")) {
          return {
            setFlag: "permiso_pulpero",
            dialogue: [
              { portrait: "/images/juego/heinrich-neutral.png", text: "Señor, ¿me permite usar esa olla de hierro? Quiero hacer cerveza." },
              { portrait: "/images/juego/pulpero-smirk.png", text: "¿Cerveza? Ya le dije que la gente acá no toma eso." },
              { portrait: "/images/juego/heinrich-happy.png", text: "La cerveza es una bebida noble. Déjeme demostrarlo." },
              { portrait: "/images/juego/pulpero-speaking-medium.png", text: "Mientras no me rompa nada… use lo que necesite." },
              { portrait: "/images/juego/pulpero-neutral.png", text: "Pero si explota algo… usted limpia." }
            ]
          };
        }

        // 3. PEDIR EL PATIO
        if (flags.includes("quiere_ir_patio") && !flags.includes("permiso_patio")) {
          return {
            setFlag: "permiso_patio",
            dialogue: [
              { portrait: "/images/juego/heinrich-neutral.png", text: "¿Puedo pasar al patio trasero?" },
              { portrait: "/images/juego/pulpero-serious.png", text: "¿Al patio? ¿A qué?" },
              { portrait: "/images/juego/heinrich-happy.png", text: "Necesito un lugar fresco o quizás algo de vegetación para mi receta." },
              { portrait: "/images/juego/pulpero-neutral.png", text: "Pase. Pero cierre la puerta al salir para que no se escape el perro." }
            ]
          };
        }

        // 4. MOMENTO CEBADA
        if (inventory.some((i) => i.id === "cebada") && !flags.includes("pulpero_comento_cebada")) {
          return {
            setFlag: "pulpero_comento_cebada",
            dialogue: [
              { portrait: "/images/juego/pulpero-serious.png", text: "¿Agarró cebada?" },
              { portrait: "/images/juego/pulpero-speaking-medium.png", text: "Eso es comida para caballos." },
              { portrait: "/images/juego/heinrich-happy.png", text: "¡También sirve para cerveza!" },
              { portrait: "/images/juego/pulpero-surprised.png", text: "Si logra que alguien se la tome… le pago una ronda." },
            ],
          };
        }

        // 5. RESPUESTAS DINÁMICAS GENERALES
        if (!flags.includes("olla_encendida")) {
          return { text: "/images/juego/pulpero-smirk.png|Si va a consumir, siéntese. Si no, no estorbe el paso." };
        }
        if (flags.includes("olla_encendida") && !flags.includes("agua_agregada")) {
          return { text: "/images/juego/pulpero-speaking-medium.png|Trate de no explotar nada con ese fuego." };
        }
        if (flags.includes("agua_agregada") && !flags.includes("macerando")) {
          return { text: "/images/juego/pulpero-smirk.png|Eso es agua caliente. No impresiona a nadie." };
        }
        if (flags.includes("macerando") && !flags.includes("mosto_listo")) {
          return { text: "/images/juego/pulpero-surprised.png|Le puso comida para caballos… Si logra que alguien se la tome… le pago una ronda." };
        }
        if (flags.includes("mosto_listo")) {
          return { text: "/images/juego/pulpero-smirk.png|Si eso no lo mata… capaz hasta le compro un vaso." };
        }

        return { text: "/images/juego/pulpero-neutral.png|Mientras no incendie la pulpería… estamos bien." };
      },
    },

    // =======================
    // 🐶 GALLETA
    // =======================
    {
      id: "galleta",
      name: "Perro Bichón",
      top: "80%",
      left: "15%",
      width: "10%",
      height: "15%",
      walkToX: 40,
      walkToY: 100,
      onLook: () => ({ text: "/images/juego/heinrich-happy.png|Un pequeño bichón blanco y marrón. Demasiado elegante para este lugar." }),
      onInteract: (inventory, flags) => {
        if (!flags.includes("galleta_saludo")) {
          return { 
            setFlag: "galleta_saludo,galleta_anim", 
            text: "/images/juego/heinrich-happy.png|Le hago mimos. Al principio se le escapa un pequeño gruñido, pero enseguida se relaja y mueve la cola feliz." 
          };
        }
        if (inventory.some((i) => i.id === "cebada") && !flags.includes("galleta_cebada")) {
          return { 
            setFlag: "galleta_cebada,galleta_anim", 
            text: "/images/juego/heinrich-surprised.png|El perro intenta comerse la cebada! ¡No, eso es para cerveza… o para caballos!" 
          };
        }
        return { 
          setFlag: "galleta_anim", 
          text: "/images/juego/heinrich-neutral.png|El perro disfruta de los mimos." 
        };
      },
      onTalk: () => ({ text: "/images/juego/heinrich-speaking-small.png|Hallo, pequeño amigo." }),
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
      walkToY: 100,
      onLook: () => ({ text: "/images/juego/heinrich-surprised.png|Un gaucho con un facón enorme. Parece tranquilo… pero no lo probaría." }),
      onInteract: () => ({ text: "/images/juego/heinrich-concerned.png|Prefiero hablarle antes que tocarlo." }),
      onTalk: (inventory, flags) => {
        const tieneYesca = inventory.some((i) => i.id === "yesca");

        if (!flags.includes("hablo_pancho")) {
          return {
            setFlag: "hablo_pancho",
            dialogue: [
              { portrait: "/images/juego/pancho-neutral.png", text: "Buenas, gringo. No sos de por acá, ¿no?" },
              { portrait: "/images/juego/heinrich-neutral.png", text: "Soy cervecero. Quiero hacer cerveza." },
              { portrait: "/images/juego/pancho-amused.png", text: "¿Cerveza? Acá tomamos mate… o cosas que te tumban." },
              { portrait: "/images/juego/pancho-smiling.png", text: "Pero me gusta tu idea. Suena a problema… y a diversión." },
            ],
          };
        }

        if (!flags.includes("permiso_pulpero") && !flags.includes("quiere_usar_olla")) {
           return { text: "/images/juego/pancho-smiling.png|Linda pulpería, ¿no? El dueño tiene pocas pulgas, así que portate bien." };
        }

        if (flags.includes("quiere_usar_olla") && !flags.includes("permiso_pulpero")) {
          if (!flags.includes("pancho_reto_permiso")) {
            return {
              setFlag: "pancho_reto_permiso",
              dialogue: [
                { portrait: "/images/juego/heinrich-neutral.png", text: "Necesito encender esa olla…" },
                { portrait: "/images/juego/pancho-serious.png", text: "Pará, gringo. ¿Ya hablaste con el pulpero?" },
                { portrait: "/images/juego/heinrich-surprised.png", text: "Eh… no exactamente." },
                { portrait: "/images/juego/pancho-serious.png", text: "Acá no se prende fuego sin permiso. A menos que quieras terminar afuera… o peor." },
              ],
            };
          } else {
            return { text: "/images/juego/pancho-serious.png|Hablá con el pulpero primero, gringo. Las cosas se hacen por derecha." };
          }
        }

        if (flags.includes("permiso_pulpero") && !flags.includes("olla_encendida") && !tieneYesca) {
          return {
            dialogue: [
              { portrait: "/images/juego/heinrich-neutral.png", text: "El pulpero me dejó usar la olla. Pero no tengo cómo encender el fuego." },
              { portrait: "/images/juego/pancho-serious.png", text: "Sin chispa no hay fuego, gringo. Y sin fuego… lo tuyo es sopa triste." },
              { portrait: "/images/juego/pancho-smiling.png", text: "Tomá, llevate esto. Pero no me incendies el rancho." },
            ],
            addItem: { id: "yesca", name: "Yesca", icon: "🔥", imageUrl: "/images/juego/items/yesca.png" },
          };
        }

        if (!flags.includes("olla_encendida")) {
          return { text: "/images/juego/pancho-amused.png|¿Y? ¿La olla se prende sola en tu país? Usá la yesca." };
        }

        if (flags.includes("agua_agregada") && !flags.includes("macerando")) {
          return { text: "/images/juego/pancho-amused.png|Eso es agua caliente, gringo. Hasta mi caballo hace algo más interesante." };
        }

        if (flags.includes("macerando") && !flags.includes("hirviendo")) {
          return {
            dialogue: [
              { portrait: "/images/juego/pancho-smiling.png", text: "Ahora sí… eso ya empieza a oler como algo serio. Pero le falta algo." },
              { portrait: "/images/juego/heinrich-neutral.png", text: "¿El qué?" },
              { portrait: "/images/juego/pancho-smiling.png", text: "Algo que le dé carácter. Atrás, en el patio… hay unas flores enredadas." },
              { portrait: "/images/juego/pancho-neutral.png", text: "Los caballos no las comen… así que deben servir para algo." },
              { portrait: "/images/juego/heinrich-happy.png", text: "Interesante… podría funcionar." },
            ],
          };
        }

        if (flags.includes("mosto_listo") && !flags.includes("pancho_hint_fermento")) {
          return {
            setFlag: "pancho_hint_fermento",
            dialogue: [
              { portrait: "/images/juego/pancho-serious.png", text: "Ahora viene lo importante." },
              { portrait: "/images/juego/heinrich-neutral.png", text: "¿Qué sigue?" },
              { portrait: "/images/juego/pancho-neutral.png", text: "Dejalo descansar… como al mate." },
              { portrait: "/images/juego/pancho-smiling.png", text: "Buscate un barril… y armate de paciencia." },
            ],
          };
        }

        if (!flags.includes("advirtio_whitmore")) {
          if (flags.includes("conocio_whitmore")) {
            return {
              setFlag: "advirtio_whitmore",
              dialogue: [
                { portrait: "/images/juego/pancho-serious.png", text: "Te vi mirando hacia el puerto antes. ¿Conocés al inglés?" },
                { portrait: "/images/juego/heinrich-angry.png", text: "Demasiado. Me arruinó la vida en alta mar." },
                { portrait: "/images/juego/pancho-annoyed.png", text: "Whitmore no me gusta nada. Nadie trae tantos barriles porque sí." },
                { portrait: "/images/juego/pancho-serious.png", text: "Andá con cuidado por ahí." },
              ],
            };
          } else {
            return {
              setFlag: "advirtio_whitmore",
              dialogue: [
                { portrait: "/images/juego/pancho-serious.png", text: "Y ojo si vas para el puerto... cuidado con ese inglés." },
                { portrait: "/images/juego/heinrich-neutral.png", text: "¿Qué inglés?" },
                { portrait: "/images/juego/pancho-annoyed.png", text: "Un tal Whitmore. No me gusta nada. Nadie trae tantos barriles porque sí." },
              ],
            };
          }
        }

        return { text: "/images/juego/pancho-smiling.png|Todo llega, gringo… hasta la buena cerveza." };
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
      
      onLook: (inventory, flags) => {
        if (!flags.includes("olla_encendida")) return { text: "/images/juego/heinrich-neutral.png|Una olla de hierro. Está apagada." };
        if (!flags.includes("agua_agregada")) return { text: "/images/juego/heinrich-neutral.png|El fuego está encendido, pero la olla está vacía." };
        if (!flags.includes("macerando")) return { text: "/images/juego/heinrich-neutral.png|El agua está caliente. Lista para agregar la cebada." };
        if (!flags.includes("macerado_listo")) return { text: "/images/juego/heinrich-neutral.png|La cebada se está macerando en el agua caliente. Hay que darle un rato." };
        if (!flags.includes("hirviendo")) return { text: "/images/juego/heinrich-neutral.png|El macerado terminó. Falta agregarle algo para darle carácter…" };
        if (!flags.includes("hervido_listo")) return { text: "/images/juego/heinrich-neutral.png|El mosto está hirviendo con el lúpulo. Esto lleva un rato." };
        if (!flags.includes("mosto_enfriando")) return { text: "/images/juego/heinrich-neutral.png|El hervido terminó. Huele fantástico, pero hierve con fuerza." };
        if (!flags.includes("mosto_listo")) return { text: "/images/juego/heinrich-neutral.png|Está enfriándose. Todavía no puedo usarlo." };
        if (!flags.includes("mosto_en_barril")) return { text: "/images/juego/heinrich-neutral.png|El mosto está listo y frío. Tengo que pasarlo a un barril." };
        
        return { text: "/images/juego/heinrich-neutral.png|La olla ya cumplió su función." };
      },
      
      onTalk: () => ({ text: "/images/juego/heinrich-neutral.png|Nada más que decir. Es una olla." }),
      
      onInteract: (inventory, flags) => {
        const tieneYesca = inventory.some((i) => i.id === "yesca");
        const tieneAgua = inventory.some((i) => i.id === "balde_agua");
        const tieneCebada = inventory.some((i) => i.id === "cebada");
        const tieneLupulo = inventory.some((i) => i.id === "lupulo");
        const tieneBarrilVacio = inventory.some((i) => i.id === "barril_vacio");

        // 🔒 SIN PERMISO
        if (!flags.includes("permiso_pulpero")) {
          return {
            text: "/images/juego/heinrich-concerned.png|Mejor le pido permiso al dueño antes de empezar a encender fuegos.",
            setFlag: "quiere_usar_olla"
          };
        }

        // 🔥 ENCENDER
        if (!flags.includes("olla_encendida")) {
          if (!tieneYesca) return { text: "/images/juego/heinrich-concerned.png|Necesito algo para encender el fuego." };
          return { text: "/images/juego/heinrich-happy.png|Prendo el fuego debajo de la olla.", 
            setFlag: "olla_encendida",
          removeItem: "yesca" };
        }

        // 💧 AGUA
        if (!flags.includes("agua_agregada")) {
          if (!tieneAgua) return { text: "/images/juego/heinrich-neutral.png|Necesito agua primero." };
          return { text: "/images/juego/heinrich-neutral.png|Agrego agua a la olla.", setFlag: "agua_agregada", removeItem: "balde_agua" };
        }

        // 🌾 CEBADA (INICIA MACERADO)
        if (!flags.includes("macerando")) {
          if (!tieneCebada) return { text: "/images/juego/heinrich-neutral.png|Necesito conseguir cebada para hacer el mosto." };
          return { text: "/images/juego/heinrich-happy.png|Agrego la cebada. El aroma empieza a cambiar…", setFlag: "macerando", removeItem: "cebada" };
        }

        // ⏳ ESPERAR MACERADO
        if (!flags.includes("macerado_listo")) {
          return { text: "/images/juego/heinrich-thinking.png|Esperemos un rato mas que acabe el macerado antes de echar el lupulo. Podría dar una vuelta mientras tanto." };
        }

        // 🌿 LÚPULO (INICIA HERVIDO)
        if (!flags.includes("hirviendo")) {
          if (!tieneLupulo) return { text: "/images/juego/heinrich-neutral.png|Necesito algo para darle amargor…" };
          return { 
            text: "/images/juego/heinrich-happy.png|Listo el macerado, agrego estas flores silvestres. Espero le de amargor.", 
            setFlag: "hirviendo,lupulo_agregado",
            removeItem: "lupulo" 
          };
        }

        // ⏳ ESPERAR HERVIDO
        if (!flags.includes("hervido_listo")) {
          return { text: "/images/juego/heinrich-thinking.png|Un rato mas de hervido y estamos. Un buen cervecero sabe tener paciencia." };
        }

        // 🧊 ENFRIAR
        if (!flags.includes("mosto_enfriando")) {
          return { text: "/images/juego/heinrich-neutral.png|El hervido terminó y la receta está completa. Pero el mosto está demasiado caliente. Mejor dejarlo enfriar.", setFlag: "mosto_enfriando" };
        }

        // ⏳ ESPERAR ENFRIADO (Viaje al puerto)
        if (!flags.includes("mosto_listo")) {
          return { text: "/images/juego/heinrich-thinking.png|Aún sigue caliente. Debería buscar un barril vacío mientras se enfría." };
        }

        // 🛢️ PASAR AL BARRIL
        if (!flags.includes("mosto_en_barril")) {
          if (!tieneBarrilVacio) {
            return { text: "/images/juego/heinrich-thinking.png|El mosto está listo y frío. Ahora necesito buscar un barril vacío para poder volcarlo ahí." };
          }
          return { 
            text: "/images/juego/heinrich-happy.png|Vuelco cuidadosamente el mosto frío dentro del barril. Huele fantástico.", 
            setFlag: "mosto_en_barril", 
            removeItem: "barril_vacio",
            addItem: { id: "barril_lleno", name: "Barril con Mosto", icon: "🛢️", imageUrl: "/images/juego/items/barril.png" } 
          };
        }

        return { text: "/images/juego/heinrich-neutral.png|La olla ya cumplió su función. Ahora todo depende del barril." };
      },
    },

    // =======================
    // 🌾 CEBADA
    // =======================
    {
      id: "saco_cebada",
      name: "Saco con comida para caballos",
      top: "41%",
      left: "75%",
      width: "6%",
      height: "10%",
      walkToX: 75,
      walkToY: 80,
      
      onLook: () => ({ 
        text: "/images/juego/heinrich-neutral.png|Un saco lleno de cebada. Los locales se la dan a los caballos, pero es oro puro para un cervecero." 
      }),

      onInteract: (inventory, flags) => {
        if (!flags.includes("permiso_pulpero")) {
          return { text: "/images/juego/heinrich-neutral.png|No debería tocar esto sin permiso." };
        }
        if (inventory.some((i) => i.id === "cebada")) {
          return { text: "/images/juego/heinrich-neutral.png|Ya tengo suficiente cebada." };
        }
        if (!flags.includes("agua_agregada")) {
           return { text: "/images/juego/heinrich-neutral.png|La cebada podría ser para el macerado. Pero primero necesito tener agua caliente en la olla." };
        }
        
        return {
          text: "/images/juego/heinrich-happy.png|Me llevo una buena cantidad de cebada.",
          addItem: { id: "cebada", name: "Cebada", icon: "🌾", imageUrl: "/images/juego/items/cebada.png"}, 
        };
      },
    },

    // =======================
    // 🚪 PATIO (MAGIA DEL TIEMPO)
    // =======================
    {
      id: "salida_quinta",
      name: "Puerta al Patio",
      isExit: true,
      top: "30%",
      left: "66%",
      width: "7%",
      height: "20%",
      walkToX: 70, 
      walkToY: 60,
      onLook: (inventory, flags) => {
        if (!flags.includes("permiso_patio")) {
          return { text: "/images/juego/heinrich-neutral.png|Una puerta trasera que da a un patio. El pulpero no me saca los ojos de encima." };
        }
        return { text: "/images/juego/heinrich-neutral.png|La puerta al patio. El pulpero me dio permiso para usarlo." };
      },
      onInteract: (inventory, flags): ActionResult => {
        if (!flags.includes("permiso_patio")) {
          return {
            text: "/images/juego/heinrich-concerned.png|Mejor le pregunto al pulpero si puedo salir al patio.",
            setFlag: "quiere_ir_patio" 
          };
        }
        
        // 👇 ESTO ES LO QUE HACE AVANZAR EL TIEMPO AL SALIR 👇
        const flagsToSet = [];
        if (flags.includes("macerando") && !flags.includes("macerado_listo")) flagsToSet.push("macerado_listo");
        if (flags.includes("hirviendo") && !flags.includes("hervido_listo")) flagsToSet.push("hervido_listo");

        const result: ActionResult = { text: "Saliendo al patio...", transition: "quinta" };
        if (flagsToSet.length > 0) result.setFlag = flagsToSet.join(",");
        
        return result;
      },
      onTalk: () => ({ text: "/images/juego/heinrich-neutral.png|No suelo conversar con puertas." }),
    },

    // =======================
    // 🚪 SALIDA PLAZA (MAGIA DEL TIEMPO)
    // =======================
    {
      id: "salida_plaza",
      name: "Plaza Mayor",
      isExit: true,
      top: "95%",
      left: "30%",
      width: "50%",
      height: "5%",
      walkToX: 50,
      walkToY: 95,
      onInteract: (inventory, flags): ActionResult => {
        // 👇 ESTO ES LO QUE HACE AVANZAR EL TIEMPO AL SALIR 👇
        const flagsToSet = [];
        if (flags.includes("macerando") && !flags.includes("macerado_listo")) flagsToSet.push("macerado_listo");
        if (flags.includes("hirviendo") && !flags.includes("hervido_listo")) flagsToSet.push("hervido_listo");

        const result: ActionResult = { text: "Saliendo...", transition: "plaza" };
        if (flagsToSet.length > 0) result.setFlag = flagsToSet.join(",");
        
        return result;
      },
    },
  ],
};