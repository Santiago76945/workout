// src/data/exercises/pilatesRingOverheadPress.ts

import type { Exercise } from "@/types/exercise";

export const pilatesRingOverheadPress: Exercise = {
  id: "pilates-ring-overhead-press",
  title: "Pilates Ring Overhead Press",
  shortTitle: "Overhead Press",
  category: "shoulders",
  equipment: ["pilates-ring"],
  positions: [
    {
      id: "pilates-ring-overhead-press-start",
      title: "Posición inicial",
      description: [
        "Aro arriba de la cabeza",
        "Brazos elevados",
        "Codos apenas flexionados"
      ],
      imagePath: "/exercises/pilates-ring-overhead-press/01-start.png"
    },
    {
      id: "pilates-ring-overhead-press-press",
      title: "Presión",
      description: [
        "Apretar el aro hacia adentro",
        "Mantener hombros bajos",
        "Core firme",
        "Presión sostenida",
        "Espalda neutra"
      ],
      imagePath: "/exercises/pilates-ring-overhead-press/02-press.png"
    }
  ]
};