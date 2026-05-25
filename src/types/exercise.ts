// src/types/exercise.ts

export type ExerciseId =
  | "squats"
  | "push-ups"
  | "pilates-ring-row"
  | "chair-dips"
  | "pilates-ring-overhead-press"
  | "pilates-ring-front-press"
  | "plank"
  | "standing-pilates-ring-knee-press"
  | "standing-calf-raises";

export type ExercisePosition = {
  id: string;
  title: string;
  description: string[];
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

export type ExerciseEquipment =
  | "bodyweight"
  | "chair"
  | "pilates-ring";

export type Exercise = {
  id: ExerciseId;
  title: string;
  shortTitle: string;
  category: ExerciseCategory;
  equipment: ExerciseEquipment[];
  positions: ExercisePosition[];
};