// src/data/exercises/standingCalfRaises.ts

import type { Exercise } from "@/types/exercise";

export const standingCalfRaises: Exercise = {
  id: "standing-calf-raises",
  title: "Standing Calf Raises",
  shortTitle: "Calf Raises",
  category: "legs",
  equipment: ["bodyweight"],
  instruction:
    "Parate con la espalda estable y los pies apoyados en el suelo. Elevá los talones hasta quedar sobre la punta de los pies, contraé las pantorrillas arriba y bajá lentamente sin perder el equilibrio.",
  workedMuscles: {
    primary: ["gemelos", "sóleo"],
    secondary: ["tibial posterior", "peroneos", "core"]
  },
  positions: [
    {
      id: "standing-calf-raises-start",
      title: "Posición inicial",
      imagePath: "/exercises/standing-calf-raises/01-start.png"
    },
    {
      id: "standing-calf-raises-up",
      title: "Elevación",
      imagePath: "/exercises/standing-calf-raises/02-up.png"
    }
  ]
};