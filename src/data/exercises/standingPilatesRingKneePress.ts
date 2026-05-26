// src/data/exercises/standingPilatesRingKneePress.ts

import type { Exercise } from "@/types/exercise";

export const standingPilatesRingKneePress: Exercise = {
  id: "standing-pilates-ring-knee-press",
  title: "Aro entre rodillas",
  shortTitle: "Aro entre rodillas",
  category: "legs",
  equipment: ["pilates-ring"],
  instruction:
    "Colocá el aro entre las rodillas, mantené los pies paralelos y flexioná apenas las piernas. Apretá el aro hacia adentro con control, activando aductores y glúteos sin perder la postura estable.",
  workedMuscles: {
    primary: ["aductores", "glúteos"],
    secondary: ["cuádriceps", "core", "isquiotibiales"]
  },
  positions: [
    {
      id: "standing-pilates-ring-knee-press-start",
      title: "Posición inicial",
      imagePath: "/exercises/standing-pilates-ring-knee-press/01-start.png"
    },
    {
      id: "standing-pilates-ring-knee-press-press",
      title: "Presión",
      imagePath: "/exercises/standing-pilates-ring-knee-press/02-press.png"
    }
  ]
};