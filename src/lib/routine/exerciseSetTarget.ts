// src/lib/routine/exerciseSetTarget.ts

import { getExerciseById } from "@/data/exercises";
import type { ExerciseId, ExerciseSetTargetType } from "@/types/exercise";

export const defaultExerciseSetTargetType: ExerciseSetTargetType =
  "repetitions";

export function getExerciseSetTargetType(
  exerciseId: ExerciseId
): ExerciseSetTargetType {
  return (
    getExerciseById(exerciseId).setTargetType ?? defaultExerciseSetTargetType
  );
}