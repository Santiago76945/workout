// src/data/exercises/index.ts

import type { Exercise, ExerciseId } from "@/types/exercise";

import { chairDips } from "@/data/exercises/chairDips";
import { pilatesRingFrontPress } from "@/data/exercises/pilatesRingFrontPress";
import { pilatesRingOverheadPress } from "@/data/exercises/pilatesRingOverheadPress";
import { pilatesRingRow } from "@/data/exercises/pilatesRingRow";
import { plank } from "@/data/exercises/plank";
import { pushUps } from "@/data/exercises/pushUps";
import { squats } from "@/data/exercises/squats";
import { standingCalfRaises } from "@/data/exercises/standingCalfRaises";
import { standingPilatesRingKneePress } from "@/data/exercises/standingPilatesRingKneePress";

export const exercises = [
  squats,
  pushUps,
  pilatesRingRow,
  chairDips,
  pilatesRingOverheadPress,
  pilatesRingFrontPress,
  plank,
  standingPilatesRingKneePress,
  standingCalfRaises
] satisfies Exercise[];

export const exercisesById = {
  squats,
  "push-ups": pushUps,
  "pilates-ring-row": pilatesRingRow,
  "chair-dips": chairDips,
  "pilates-ring-overhead-press": pilatesRingOverheadPress,
  "pilates-ring-front-press": pilatesRingFrontPress,
  plank,
  "standing-pilates-ring-knee-press": standingPilatesRingKneePress,
  "standing-calf-raises": standingCalfRaises
} satisfies Record<ExerciseId, Exercise>;

export function getExerciseById(exerciseId: ExerciseId): Exercise {
  return exercisesById[exerciseId];
}

export {
  chairDips,
  pilatesRingFrontPress,
  pilatesRingOverheadPress,
  pilatesRingRow,
  plank,
  pushUps,
  squats,
  standingCalfRaises,
  standingPilatesRingKneePress
};