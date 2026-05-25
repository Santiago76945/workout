// src/lib/routine/routineProgress.ts

import type { RoutineStep } from "@/types/routine";

export function getCurrentRoutineStep(
  steps: RoutineStep[],
  currentStepIndex: number
): RoutineStep | null {
  return steps[currentStepIndex] ?? null;
}

export function getNextRoutineStep(
  steps: RoutineStep[],
  currentStepIndex: number
): RoutineStep | null {
  return steps[currentStepIndex + 1] ?? null;
}

export function isRoutineComplete(
  steps: RoutineStep[],
  currentStepIndex: number
): boolean {
  return currentStepIndex >= steps.length;
}

export function getRoutineProgressPercentage(
  steps: RoutineStep[],
  currentStepIndex: number
): number {
  if (steps.length === 0) {
    return 0;
  }

  const completedSteps = Math.min(currentStepIndex, steps.length);

  return Math.round((completedSteps / steps.length) * 100);
}

export function getStepCounterLabel(
  steps: RoutineStep[],
  currentStepIndex: number
): string {
  if (steps.length === 0) {
    return "Paso 0 de 0";
  }

  const visibleStepNumber = Math.min(currentStepIndex + 1, steps.length);

  return `Paso ${visibleStepNumber} de ${steps.length}`;
}

export function shouldFlipExerciseCard(
  currentStep: RoutineStep | null,
  nextStep: RoutineStep | null
): boolean {
  if (!currentStep || !nextStep) {
    return false;
  }

  return currentStep.exerciseId !== nextStep.exerciseId;
}

export function isLastStep(
  steps: RoutineStep[],
  currentStepIndex: number
): boolean {
  return currentStepIndex === steps.length - 1;
}