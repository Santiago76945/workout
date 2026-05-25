// src/types/routine.ts

import type { Exercise, ExerciseId } from "@/types/exercise";

export type RoutineRepetitionTarget = {
  type: "repetitions";
  minReps: number;
  maxReps: number;
  unitLabel: string;
};

export type RoutineDurationTarget = {
  type: "duration";
  minSeconds: number;
  maxSeconds: number;
};

export type RoutineTarget = RoutineRepetitionTarget | RoutineDurationTarget;

export type RoutineItem = {
  id: string;
  exerciseId: ExerciseId;
  sets: number;
  target: RoutineTarget;
  restSeconds: number;
};

export type Routine = {
  id: string;
  title: string;
  description: string;
  idealSessionsPerWeek: number;
  estimatedDurationMinutes: {
    min: number;
    max: number;
  };
  defaultRestSecondsRange: {
    minSeconds: number;
    maxSeconds: number;
  };
  items: RoutineItem[];
};

export type RoutineExerciseStep = {
  id: string;
  type: "exercise";
  exerciseId: ExerciseId;
  exercise: Exercise;
  setNumber: number;
  totalSets: number;
  target: RoutineTarget;
};

export type RoutineRestStep = {
  id: string;
  type: "rest";
  exerciseId: ExerciseId;
  exercise: Exercise;
  durationSeconds: number;
  afterSetNumber: number;
  totalSets: number;
};

export type RoutineStep = RoutineExerciseStep | RoutineRestStep;

export type RoutineStepType = RoutineStep["type"];

export type RoutinePlayerStatus = "idle" | "active" | "complete";