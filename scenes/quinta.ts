import { Scene } from "@/engine/types";

export const quintaScene: Scene = {
  id: "quinta",
  name: "EL PATIO TRASERO",
  bgClass: "bg-[url('/images/juego/fondo-quinta.png')] bg-cover bg-center bg-no-repeat",
  startX: 20,
  startY: 80,
   scale: 0.6,
  limitMovement: (targetX, targetY) => {
    return { x: targetX, y: Math.max(targetY, 55) };
  },
  hotspots: [
    {
      id: "enredadera",
      name: "Enredadera Salvaje",
      top: "10%", left: "60%", width: "20%", height: "50%", walkToX: 60, walkToY: 65,
      onLook: () => ({ text: "/images/juego/heinrich-surprised.png|¡Es lúpulo salvaje! Creciendo como maleza." }),
      onInteract: (inventory) => {
        if (inventory.some(i => i.id === "lupulo")) {
          return { text: "/images/juego/heinrich-neutral.png|Ya arranqué suficientes flores." };
        }
        return { 
          text: "/images/juego/heinrich-happy.png|Perfecto para darle amargor. Guardo unas flores.", 
          addItem: { id: "lupulo", name: "Lúpulo Salvaje", icon: "🌿" } 
        };
      },
      onTalk: () => ({ text: "/images/juego/heinrich-neutral.png|Crece fuerte, amiguito." }),
    },
    {
      id: "olla",
      name: "Olla de Hierro",
      top: "60%", left: "30%", width: "20%", height: "30%", walkToX: 40, walkToY: 85,
      onLook: () => ({ text: "/images/juego/heinrich-neutral.png|Una olla sobre fuego bajo. Ideal para cocinar... o hacer cerveza." }),
      onInteract: (inventory, flags) => {
        const hasMalta = inventory.some(i => i.id === "malta");
        const hasLevadura = inventory.some(i => i.id === "levadura");
        const hasLupulo = inventory.some(i => i.id === "lupulo");
        const hasReceta = inventory.some(i => i.id === "recetas");

        if (!hasMalta || !hasLevadura || !hasLupulo) {
          return { text: "/images/juego/heinrich-concerned.png|Me falta malta, levadura o lúpulo para intentar hacer cerveza." };
        }
        if (!flags.includes("cerveza_arruinada")) {
          return { 
            text: "/images/juego/heinrich-angry.png|Herví todo... ¡pero sabe horrible! Me equivoqué en las medidas. Necesito mi libro de recetas que perdí en el puerto.", 
            setFlag: "cerveza_arruinada" 
          };
        }
        if (!hasReceta) {
          return { text: "/images/juego/heinrich-concerned.png|Aún no recupero mi libro de recetas. Debe estar en mi equipaje tirado en el puerto." };
        }
        
        return { 
          text: "/images/juego/heinrich-happy.png|¡BAM! ¡LA CERVEZA PERFECTA! El aroma inunda el patio. (¡FIN DE LA DEMO!)", 
          setFlag: "juego_terminado" 
        };
      },
      onTalk: () => ({ text: "/images/juego/heinrich-neutral.png|Hierve, olla, hierve." }),
    },
    {
      id: "salida_pulperia",
      name: "Volver adentro",
      top: "20%", left: "0%", width: "15%", height: "70%", walkToX: 10, walkToY: 85,
      onLook: () => ({ text: "/images/juego/heinrich-neutral.png|La pulpería." }),
      onInteract: () => ({ text: "Caminando...", transition: "pulperia" }),
      onTalk: () => ({ text: "..." }),
    },
  ],
};