// src/data/exercises/pilatesRingRow.ts

import type { Exercise } from "@/types/exercise";

export const pilatesRingRow: Exercise = {
  id: "pilates-ring-row",
  title: "Pilates Ring Row",
  shortTitle: "Ring Row",
  category: "back",
  equipment: ["pilates-ring"],
  instruction:
    "Sostené el aro frente al pecho con los hombros relajados y el torso estable. Llevá los codos hacia atrás como si quisieras juntar los omóplatos, manteniendo tensión en el aro y volviendo con control.",
  workedMuscles: {
    primary: ["romboides", "trapecio medio", "dorsal ancho"],
    secondary: ["deltoides posteriores", "bíceps", "core"]
  },
  positions: [
    {
      id: "pilates-ring-row-start",
      title: "Posición inicial",
      imagePath: "/exercises/pilates-ring-row/01-start.png"
    },
    {
      id: "pilates-ring-row-pull",
      title: "Tirón / apertura",
      imagePath: "/exercises/pilates-ring-row/02-pull.png"
    }
  ]
};