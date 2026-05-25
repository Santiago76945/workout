// src/data/exercises/squats.ts

import type { Exercise } from "@/types/exercise";

export const squats: Exercise = {
  id: "squats",
  title: "Squats / Sentadillas",
  shortTitle: "Sentadillas",
  category: "legs",
  equipment: ["bodyweight"],
  positions: [
    {
      id: "squats-start",
      title: "Posición inicial",
      description: [
        "De pie",
        "Pies al ancho de hombros",
        "Punta de pies apenas hacia afuera",
        "Espalda recta",
        "Pecho abierto",
        "Brazos al frente o cruzados"
      ],
      imagePath: "/exercises/squats/01-start.png"
    },
    {
      id: "squats-down",
      title: "Bajada",
      description: [
        "Cadera hacia atrás como sentándose",
        "Rodillas doblándose siguiendo la línea de los pies",
        "Muslos acercándose a paralelo con el suelo",
        "Talones apoyados",
        "Tronco ligeramente inclinado pero recto"
      ],
      imagePath: "/exercises/squats/02-down.png"
    }
  ]
};