// src/data/exercises/pushUps.ts

import type { Exercise } from "@/types/exercise";

export const pushUps: Exercise = {
  id: "push-ups",
  title: "Push-Ups / Flexiones",
  shortTitle: "Flexiones",
  category: "chest",
  equipment: ["bodyweight"],
  instruction:
    "Apoyá las manos debajo de los hombros y mantené el cuerpo en línea recta. Bajá el pecho hacia el piso con control, llevando los codos hacia atrás o en diagonal, y empujá el suelo para volver a la posición alta.",
  workedMuscles: {
    primary: ["pectorales", "tríceps"],
    secondary: ["deltoides anteriores", "core", "serrato anterior"]
  },
  positions: [
    {
      id: "push-ups-top",
      title: "Posición alta",
      imagePath: "/exercises/push-ups/01-top.png"
    },
    {
      id: "push-ups-down",
      title: "Bajada",
      imagePath: "/exercises/push-ups/02-down.png"
    }
  ]
};