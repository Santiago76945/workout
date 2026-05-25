// src/data/routines/defaultRoutine.ts

import type { Routine } from "@/types/routine";

export const defaultRoutine: Routine = {
  id: "home-routine",
  title: "Rutina home",
  description:
    "Rutina full body para hacer en casa, combinando peso corporal, silla y aro de pilates.",
  idealSessionsPerWeek: 3,
  estimatedDurationMinutes: {
    min: 30,
    max: 40
  },
  defaultRestSecondsRange: {
    minSeconds: 60,
    maxSeconds: 90
  },
  items: [
    {
      id: "home-routine-squats",
      exerciseId: "squats",
      sets: 3,
      target: {
        type: "repetitions",
        minReps: 12,
        maxReps: 20,
        unitLabel: "sentadillas"
      },
      restSeconds: 90
    },
    {
      id: "home-routine-push-ups",
      exerciseId: "push-ups",
      sets: 3,
      target: {
        type: "repetitions",
        minReps: 8,
        maxReps: 15,
        unitLabel: "flexiones"
      },
      restSeconds: 90
    },
    {
      id: "home-routine-pilates-ring-row",
      exerciseId: "pilates-ring-row",
      sets: 3,
      target: {
        type: "repetitions",
        minReps: 12,
        maxReps: 15,
        unitLabel: "repeticiones"
      },
      restSeconds: 90
    },
    {
      id: "home-routine-chair-dips",
      exerciseId: "chair-dips",
      sets: 3,
      target: {
        type: "repetitions",
        minReps: 10,
        maxReps: 15,
        unitLabel: "fondos"
      },
      restSeconds: 90
    },
    {
      id: "home-routine-pilates-ring-overhead-press",
      exerciseId: "pilates-ring-overhead-press",
      sets: 3,
      target: {
        type: "repetitions",
        minReps: 15,
        maxReps: 20,
        unitLabel: "apretones"
      },
      restSeconds: 90
    },
    {
      id: "home-routine-pilates-ring-front-press",
      exerciseId: "pilates-ring-front-press",
      sets: 3,
      target: {
        type: "repetitions",
        minReps: 15,
        maxReps: 20,
        unitLabel: "apretones"
      },
      restSeconds: 90
    },
    {
      id: "home-routine-plank",
      exerciseId: "plank",
      sets: 3,
      target: {
        type: "duration",
        minSeconds: 30,
        maxSeconds: 60
      },
      restSeconds: 90
    },
    {
      id: "home-routine-standing-pilates-ring-knee-press",
      exerciseId: "standing-pilates-ring-knee-press",
      sets: 3,
      target: {
        type: "repetitions",
        minReps: 20,
        maxReps: 20,
        unitLabel: "apretones"
      },
      restSeconds: 90
    },
    {
      id: "home-routine-standing-calf-raises",
      exerciseId: "standing-calf-raises",
      sets: 3,
      target: {
        type: "repetitions",
        minReps: 20,
        maxReps: 20,
        unitLabel: "repeticiones"
      },
      restSeconds: 90
    }
  ]
};