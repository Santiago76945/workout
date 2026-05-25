// src/data/exercises/plank.ts

import type { Exercise } from "@/types/exercise";

export const plank: Exercise = {
  id: "plank",
  title: "Plank / Plancha",
  shortTitle: "Plancha",
  category: "core",
  equipment: ["bodyweight"],
  positions: [
    {
      id: "plank-correct",
      title: "Posición correcta",
      description: [
        "Antebrazos en el piso",
        "Cuerpo recto",
        "Glúteos alineados",
        "Abdomen firme"
      ],
      imagePath: "/exercises/plank/01-correct.png"
    }
  ]
};