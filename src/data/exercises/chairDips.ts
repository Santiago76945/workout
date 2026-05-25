// src/data/exercises/chairDips.ts

import type { Exercise } from "@/types/exercise";

export const chairDips: Exercise = {
  id: "chair-dips",
  title: "Chair Dips",
  shortTitle: "Fondos con silla",
  category: "arms",
  equipment: ["bodyweight", "chair"],
  positions: [
    {
      id: "chair-dips-top",
      title: "Posición inicial",
      description: [
        "Manos apoyadas en borde de silla",
        "Brazos extendidos",
        "Cadera fuera de la silla",
        "Piernas flexionadas o extendidas"
      ],
      imagePath: "/exercises/chair-dips/01-top.png"
    },
    {
      id: "chair-dips-down",
      title: "Bajada",
      description: [
        "Codos doblándose hacia atrás",
        "Cuerpo descendiendo recto",
        "Hombros bajan hasta aproximadamente 90 grados"
      ],
      imagePath: "/exercises/chair-dips/02-down.png"
    }
  ]
};