// src/data/exercises/pilatesRingFrontPress.ts

import type { Exercise } from "@/types/exercise";

export const pilatesRingFrontPress: Exercise = {
  id: "pilates-ring-front-press",
  title: "Pilates Ring Front Press",
  shortTitle: "Front Press",
  category: "chest",
  equipment: ["pilates-ring"],
  positions: [
    {
      id: "pilates-ring-front-press-start",
      title: "Posición inicial",
      description: [
        "Aro frente al abdomen o pecho bajo",
        "Brazos al frente",
        "Postura recta"
      ],
      imagePath: "/exercises/pilates-ring-front-press/01-start.png"
    },
    {
      id: "pilates-ring-front-press-press",
      title: "Presión",
      description: [
        "Apretar el aro lentamente",
        "Pecho y brazos activos",
        "Codos suaves",
        "Core contraído",
        "Respiración controlada"
      ],
      imagePath: "/exercises/pilates-ring-front-press/02-press.png"
    }
  ]
};