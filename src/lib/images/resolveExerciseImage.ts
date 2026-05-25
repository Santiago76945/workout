// src/lib/images/resolveExerciseImage.ts

export const fallbackExerciseImagePath = "/exercises/fallback.png";

export function resolveExerciseImage(
  imagePath: string | null | undefined
): string {
  if (!imagePath) {
    return fallbackExerciseImagePath;
  }

  return imagePath;
}

export function getFallbackExerciseImage(): string {
  return fallbackExerciseImagePath;
}