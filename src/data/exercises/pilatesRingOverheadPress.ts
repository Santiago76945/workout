// src/data/exercises/pilatesRingOverheadPress.ts

import type { Exercise } from "@/types/exercise";

export const pilatesRingOverheadPress: Exercise = {
  id: "pilates-ring-overhead-press",
  title: "Pilates Ring Overhead Press",
  shortTitle: "Overhead Press",
  category: "shoulders",
  equipment: ["pilates-ring"],
  instruction:
    "Sostené el aro por encima de la cabeza con los codos apenas flexionados y los hombros lejos de las orejas. Apretá el aro hacia adentro con control, manteniendo el abdomen firme y la espalda neutra.",
  workedMuscles: {
    primary: ["deltoides", "trapecio superior"],
    secondary: ["tríceps", "pectorales", "core"]
  },
  positions: [
    {
      id: "pilates-ring-overhead-press-start",
      title: "Posición inicial",
      imagePath: "/exercises/pilates-ring-overhead-press/01-start.png"
    },
    {
      id: "pilates-ring-overhead-press-press",
      title: "Presión",
      imagePath: "/exercises/pilates-ring-overhead-press/02-press.png"
    }
  ]
};