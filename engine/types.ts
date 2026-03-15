// engine/types.ts

export type ActionType = "WALK" | "LOOK" | "INTERACT" | "TALK";

export type Item = { 
  id: string; 
  name: string; 
  icon: string 
};

export type DialogueLine = {
  portrait?: string;
  text: string;
};

// Unificado: Soporta mensajes simples y diálogos largos
export type ActionResult = {
  text?: string;
  dialogue?: DialogueLine[];
  transition?: string;
  addItem?: Item;
  setFlag?: string;
};

// Tipo de función para las acciones
export type ActionFn = (inventory: Item[], flags: string[]) => ActionResult;

// Limpio y sin duplicados
export type Hotspot = {
  id: string;
  name: string;
  top: string;
  left: string;
  width: string;
  height: string;
  walkToX: number;
  walkToY: number;
  
  // Opcionales para renderizar objetos dinámicos
  imageUrl?: string;
  condition?: (inventory: Item[], flags: string[]) => boolean;
  
  onLook: ActionFn;
  onInteract: ActionFn;
  onTalk: ActionFn;
};

export type Scene = {
  id: string;
  name: string;
  bgClass: string;
  maskUrl?: string;
  startX: number;
  startY: number;
  scale?: number; // Lo hacemos opcional (?) por si usamos getScale
  
  // NUEVO: Función opcional para el tamaño por perspectiva
  getScale?: (y: number) => number; 
  
  limitMovement: (x: number, y: number) => { x: number; y: number };
  hotspots: Hotspot[];
};