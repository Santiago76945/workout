// src/data/exercises/pilatesRingRow.ts

import type { Exercise } from "@/types/exercise";

export const pilatesRingRow: Exercise = {
  id: "pilates-ring-row",
  title: "Pilates Ring Row",
  shortTitle: "Ring Row",
  category: "back",
  equipment: ["pilates-ring"],
  positions: [
    {
      id: "pilates-ring-row-start",
      title: "Posición inicial",
      description: [
        "De pie",
        "Aro frente al pecho",
        "Brazos semiflexionados",
        "Hombros relajados"
      ],
      imagePath: "/exercises/pilates-ring-row/01-start.png"
    },
    {
      id: "pilates-ring-row-pull",
      title: "Tirón / apertura",
      description: [
        "Codos yendo hacia atrás",
        "Omóplatos juntándose",
        "Pecho abierto",
        "Aro abriéndose con tensión",
        "Pausa breve apretando espalda"
      ],
      imagePath: "/exercises/pilates-ring-row/02-pull.png"
    }
  ]
};