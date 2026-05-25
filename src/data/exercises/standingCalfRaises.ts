// src/data/exercises/standingCalfRaises.ts

import type { Exercise } from "@/types/exercise";

export const standingCalfRaises: Exercise = {
  id: "standing-calf-raises",
  title: "Standing Calf Raises",
  shortTitle: "Calf Raises",
  category: "legs",
  equipment: ["bodyweight"],
  positions: [
    {
      id: "standing-calf-raises-start",
      title: "Posición inicial",
      description: [
        "De pie",
        "Talones apoyados",
        "Espalda recta"
      ],
      imagePath: "/exercises/standing-calf-raises/01-start.png"
    },
    {
      id: "standing-calf-raises-up",
      title: "Elevación",
      description: [
        "Subir talones",
        "Peso sobre punta de pies",
        "Tobillos extendidos",
        "Pantorrillas contraídas",
        "Equilibrio controlado"
      ],
      imagePath: "/exercises/standing-calf-raises/02-up.png"
    }
  ]
};