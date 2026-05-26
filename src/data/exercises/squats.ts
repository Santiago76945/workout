// src/data/exercises/squats.ts

import type { Exercise } from "@/types/exercise";

export const squats: Exercise = {
  id: "squats",
  title: "Squats / Sentadillas",
  shortTitle: "Sentadillas",
  category: "legs",
  equipment: ["bodyweight"],
  instruction:
    "Colocá los pies al ancho de hombros, llevá la cadera hacia atrás y bajá con control manteniendo la espalda estable. Empujá desde los talones para volver a subir, evitando que las rodillas colapsen hacia adentro.",
  workedMuscles: {
    primary: ["cuádriceps", "glúteos"],
    secondary: ["isquiotibiales", "core", "pantorrillas"]
  },
  positions: [
    {
      id: "squats-start",
      title: "Posición inicial",
      imagePath: "/exercises/squats/01-start.png"
    },
    {
      id: "squats-down",
      title: "Bajada",
      imagePath: "/exercises/squats/02-down.png"
    }
  ]
};