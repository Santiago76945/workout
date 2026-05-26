// src/data/exercises/pilatesRingFrontPress.ts

import type { Exercise } from "@/types/exercise";

export const pilatesRingFrontPress: Exercise = {
  id: "pilates-ring-front-press",
  title: "Pilates Ring Front Press",
  shortTitle: "Front Press",
  category: "chest",
  equipment: ["pilates-ring"],
  instruction:
    "Sostené el aro frente al pecho o al abdomen con los brazos extendidos de forma cómoda. Apretá el aro lentamente hacia adentro, activando pecho y brazos, y volvé a soltar la presión sin perder el control.",
  workedMuscles: {
    primary: ["pectorales"],
    secondary: ["deltoides anteriores", "tríceps", "core"]
  },
  positions: [
    {
      id: "pilates-ring-front-press-start",
      title: "Posición inicial",
      imagePath: "/exercises/pilates-ring-front-press/01-start.png"
    },
    {
      id: "pilates-ring-front-press-press",
      title: "Presión",
      imagePath: "/exercises/pilates-ring-front-press/02-press.png"
    }
  ]
};