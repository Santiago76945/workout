// src/data/exercises/plank.ts

import type { Exercise } from "@/types/exercise";

export const plank: Exercise = {
  id: "plank",
  title: "Plank / Plancha",
  shortTitle: "Plancha",
  category: "core",
  equipment: ["bodyweight"],
  instruction:
    "Apoyá los antebrazos en el piso y mantené el cuerpo en línea recta desde la cabeza hasta los talones. Activá abdomen y glúteos, evitando que la cadera caiga o se eleve demasiado.",
  workedMuscles: {
    primary: ["recto abdominal", "transverso abdominal", "oblicuos"],
    secondary: ["glúteos", "deltoides", "espalda baja"]
  },
  positions: [
    {
      id: "plank-correct",
      title: "Posición correcta",
      imagePath: "/exercises/plank/01-correct.png"
    }
  ]
};