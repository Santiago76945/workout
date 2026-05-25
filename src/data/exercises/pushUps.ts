// src/data/exercises/pushUps.ts

import type { Exercise } from "@/types/exercise";

export const pushUps: Exercise = {
    id: "push-ups",
    title: "Push-Ups / Flexiones",
    shortTitle: "Flexiones",
    category: "chest",
    equipment: ["bodyweight"],
    positions: [
        {
            id: "push-ups-top",
            title: "Posición alta",
            description: [
                "Manos debajo de hombros",
                "Cuerpo recto",
                "Core apretado",
                "Piernas extendidas"
            ],
            imagePath: "/exercises/push-ups/01-top.png"
        },
        {
            id: "push-ups-down",
            title: "Bajada",
            description: [
                "Codos flexionados hacia atrás o en diagonal",
                "Pecho acercándose al piso",
                "El cuerpo sigue recto"
            ],
            imagePath: "/exercises/push-ups/02-down.png"
        }
    ]
};