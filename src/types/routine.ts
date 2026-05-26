// src/types/routine.ts

import type { Exercise, ExerciseId } from "@/types/exercise";

export type RoutineRepetitionTarget = {
  type: "repetitions";
  repetitions: number;
  unitLabel: string;
};

export type RoutineDurationTarget = {
  type: "duration";
  seconds: number;
};

export type RoutineTarget = RoutineRepetitionTarget | RoutineDurationTarget;

export type RoutineItem = {
  id: string;
  exerciseId: ExerciseId;
  sets: number;
  target: RoutineTarget;
  restSecondsBetweenSets: number;
};

export type CreateRoutineItemInput = {
  exerciseId: ExerciseId;
  sets: number;
  target: RoutineTarget;
  restSecondsBetweenSets: number;
};

export type CreateRoutineInput = {
  title: string;
  items: CreateRoutineItemInput[];
};

export type Routine = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  items: RoutineItem[];
};

export type RoutineExerciseStep = {
  id: string;
  type: "exercise";
  routineItemId: string;
  exerciseId: ExerciseId;
  exercise: Exercise;
  exerciseStepNumber: number;
  totalExerciseSteps: number;
  setNumber: number;
  totalSets: number;
  target: RoutineTarget;
};

export type RoutineRestStep = {
  id: string;
  type: "rest";
  routineItemId: string;
  exerciseId: ExerciseId;
  exercise: Exercise;
  durationSeconds: number;
  afterExerciseStepNumber: number;
  totalExerciseSteps: number;
  afterSetNumber: number;
  totalSets: number;
};

export type RoutineStep = RoutineExerciseStep | RoutineRestStep;

export type RoutineStepType = RoutineStep["type"];

export type RoutinePlayerStatus = "idle" | "active" | "complete";