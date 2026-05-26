// src/data/exercises/chairDips.ts

import type { Exercise } from "@/types/exercise";

export const chairDips: Exercise = {
  id: "chair-dips",
  title: "Chair Dips",
  shortTitle: "Fondos con silla",
  category: "arms",
  equipment: ["bodyweight", "chair"],
  instruction:
    "Apoyá las manos en el borde de la silla y dejá la cadera apenas por delante del asiento. Bajá el cuerpo flexionando los codos hacia atrás y empujá con los brazos para volver a subir, manteniendo el movimiento controlado.",
  workedMuscles: {
    primary: ["tríceps"],
    secondary: ["pectorales", "deltoides anteriores", "core"]
  },
  positions: [
    {
      id: "chair-dips-top",
      title: "Posición inicial",
      imagePath: "/exercises/chair-dips/01-top.png"
    },
    {
      id: "chair-dips-down",
      title: "Bajada",
      imagePath: "/exercises/chair-dips/02-down.png"
    }
  ]
};