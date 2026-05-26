// src/types/exercise.ts

export const exerciseIds = [
  "squats",
  "push-ups",
  "pilates-ring-row",
  "chair-dips",
  "pilates-ring-overhead-press",
  "pilates-ring-front-press",
  "plank",
  "standing-pilates-ring-knee-press",
  "standing-calf-raises"
] as const;

export type ExerciseId = (typeof exerciseIds)[number];

export type ExercisePosition = {
  id: string;
  title: string;
  imagePath: string;
};

export type ExerciseCategory =
  | "legs"
  | "chest"
  | "back"
  | "arms"
  | "shoulders"
  | "core"
  | "full-body";

export type ExerciseEquipment = "bodyweight" | "chair" | "pilates-ring";

export type ExerciseSetTargetType = "repetitions" | "duration";

export type ExerciseWorkedMuscles = {
  primary: string[];
  secondary: string[];
};

export type Exercise = {
  id: ExerciseId;
  title: string;
  shortTitle: string;
  category: ExerciseCategory;
  equipment: ExerciseEquipment[];
  instruction: string;
  workedMuscles: ExerciseWorkedMuscles;
  positions: ExercisePosition[];
  setTargetType?: ExerciseSetTargetType;
};