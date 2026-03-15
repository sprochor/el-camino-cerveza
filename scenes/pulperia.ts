import { Scene } from "@/engine/types";

export const pulperiaScene: Scene = {
  id: "pulperia",
  name: "LA PULPERÍA",
  bgClass: "bg-[url('/images/juego/fondo-pulperia.png')] bg-cover bg-center bg-no-repeat",
  startX: 80,
  startY: 85,
  scale: 1.1, // Heinrich es más grande porque la cámara está cerca
  limitMovement: (targetX, targetY) => {
    let safeX = targetX;
    let safeY = targetY;

    // Límite general del fondo de la habitación
    if (safeY < 65) safeY = 65;

    // Límite de la Barra de madera (Lado derecho del salón)
    if (safeX > 55) {
      // Si está a la derecha, choca contra la base de la barra (no puede subir a la mesada)
      if (safeY < 85) safeY = 85; 
    }

    return { x: safeX, y: safeY };
  },
  hotspots: [
    {
      id: "gaucho",
      name: "Gaucho Pancho",
      top: "30%", left: "20%", width: "20%", height: "55%", walkToX: 45, walkToY: 80,
      onLook: () => ({ text: "/images/juego/heinrich-surprised.png|Tiene un facón inmenso." }),
      onInteract: () => ({ text: "/images/juego/heinrich-concerned.png|No voy a tocarlo." }),
      onTalk: () => ({ text: "/images/juego/heinrich-speaking-medium.png|'Ese Whitmore es un espía inglés, gringo. Tené cuidado'." }),
    },
    {
      id: "galleta",
      name: "Perro Galleta",
      top: "70%", left: "50%", width: "10%", height: "20%", walkToX: 55, walkToY: 85,
      onLook: () => ({ text: "/images/juego/heinrich-happy.png|Un Bichón Habanés. ¿Qué hace un perro de salón aquí?" }),
      onInteract: () => ({ text: "/images/juego/heinrich-happy.png|Le hago mimos. Mueve la cola feliz." }),
      onTalk: () => ({ text: "/images/juego/heinrich-speaking-small.png|¡Guau, guau! Buen chico." }),
    },
    {
      id: "saco_malta",
      name: "Saco de Granos",
      top: "60%", left: "70%", width: "15%", height: "30%", walkToX: 65, walkToY: 90,
      onLook: () => ({ text: "/images/juego/heinrich-neutral.png|Un saco de cebada malteada para alimentar a los caballos." }),
      onInteract: (inventory) => {
        if (inventory.some(i => i.id === "malta")) {
          return { text: "/images/juego/heinrich-neutral.png|Ya tengo suficiente malta." };
        }
        return { 
          text: "/images/juego/heinrich-happy.png|Con esto me alcanza. Agarro un puñado.", 
          addItem: { id: "malta", name: "Malta de Cebada", icon: "🌾" } 
        };
      },
      onTalk: () => ({ text: "/images/juego/heinrich-neutral.png|Hola, granos." }),
    },
    {
      id: "salida_puerto",
      name: "Salir a la calle",
      top: "20%", left: "0%", width: "15%", height: "70%", walkToX: 10, walkToY: 85,
      onLook: () => ({ text: "/images/juego/heinrich-neutral.png|La calle." }),
      onInteract: () => ({ text: "Caminando...", transition: "puerto" }),
      onTalk: () => ({ text: "..." }),
    },
    {
      id: "salida_quinta",
      name: "Ir a la Quinta (Patio)",
      top: "30%", left: "45%", width: "15%", height: "40%", walkToX: 50, walkToY: 70,
      onLook: () => ({ text: "/images/juego/heinrich-neutral.png|El patio trasero de la pulpería." }),
      onInteract: () => ({ text: "Caminando...", transition: "quinta" }),
      onTalk: () => ({ text: "..." }),
    },
  ],
};