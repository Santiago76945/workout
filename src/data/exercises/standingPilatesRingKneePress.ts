// src/data/exercises/standingPilatesRingKneePress.ts

import type { Exercise } from "@/types/exercise";

export const standingPilatesRingKneePress: Exercise = {
  id: "standing-pilates-ring-knee-press",
  title: "Aro entre rodillas",
  shortTitle: "Aro entre rodillas",
  category: "legs",
  equipment: ["pilates-ring"],
  positions: [
    {
      id: "standing-pilates-ring-knee-press-start",
      title: "Posición inicial",
      description: [
        "De pie",
        "Aro entre rodillas",
        "Pies paralelos",
        "Rodillas apenas flexionadas"
      ],
      imagePath: "/exercises/standing-pilates-ring-knee-press/01-start.png"
    },
    {
      id: "standing-pilates-ring-knee-press-press",
      title: "Presión",
      description: [
        "Rodillas apretando hacia adentro",
        "Glúteos y aductores activos",
        "Aro comprimido",
        "Postura estable",
        "Core firme"
      ],
      imagePath: "/exercises/standing-pilates-ring-knee-press/02-press.png"
    }
  ]
};