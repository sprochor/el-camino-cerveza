import { Scene } from "@/engine/types";

export const plazaScene: Scene = {
  id: "plaza",
  name: "PLAZA MAYOR",
  bgClass: "bg-[url('/images/juego/fondo-plaza.png')] bg-cover bg-center bg-no-repeat",
  startX: 20,
  startY: 80,
   scale: 0.6,
  limitMovement: (targetX, targetY) => {
    // No puede caminar por encima del horizonte (Y: 55)
    return { x: targetX, y: Math.max(targetY, 55) };
  },
  hotspots: [
    {
      id: "panadera",
      name: "Señora Panadera",
      top: "40%", left: "60%", width: "20%", height: "50%", walkToX: 55, walkToY: 85,
      onLook: () => ({ text: "/images/juego/heinrich-neutral.png|Una mujer vendiendo pan fresco. Huele delicioso." }),
      onInteract: () => ({ text: "/images/juego/heinrich-concerned.png|Mejor le hablo con respeto." }),
      onTalk: (inventory) => {
        if (inventory.some(i => i.id === "levadura")) {
          return { text: "/images/juego/heinrich-happy.png|Gracias por la levadura, señora." };
        }
        return { 
          text: "/images/juego/heinrich-speaking-small.png|Disculpe... ¿le sobraría un poco de levadura? 'Tome, gringo', me dice.", 
          addItem: { id: "levadura", name: "Levadura Fresca", icon: "🍞" } 
        };
      },
    },
    {
      id: "salida_puerto",
      name: "Volver al Puerto",
      top: "20%", left: "0%", width: "15%", height: "70%", walkToX: 10, walkToY: 85,
      onLook: () => ({ text: "/images/juego/heinrich-neutral.png|El puerto está por allá." }),
      onInteract: () => ({ text: "Caminando...", transition: "puerto" }),
      onTalk: () => ({ text: "..." }),
    },
  ],
};