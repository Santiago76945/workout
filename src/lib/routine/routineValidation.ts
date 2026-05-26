// src/lib/routine/routineValidation.ts

import { getExerciseSetTargetType } from "@/lib/routine/exerciseSetTarget";
import { exerciseIds, type ExerciseId } from "@/types/exercise";
import type {
  RoutineDurationTarget,
  RoutineRepetitionTarget,
  RoutineTarget
} from "@/types/routine";

export const routineValidationLimits = {
  sets: {
    min: 1,
    max: 99,
    defaultValue: 3
  },
  repetitions: {
    min: 1,
    max: 999,
    defaultValue: 10
  },
  durationSeconds: {
    min: 1,
    max: 3600,
    defaultValue: 30
  },
  restSeconds: {
    min: 0,
    max: 3600,
    defaultValue: 0
  }
} as const;

export const defaultRoutineTitle = "Mi rutina";
export const defaultRepetitionUnitLabel = "repeticiones";

const validExerciseIds = new Set<ExerciseId>(exerciseIds);

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isExerciseId(value: unknown): value is ExerciseId {
  return isString(value) && validExerciseIds.has(value as ExerciseId);
}

export function isIntegerInRange(
  value: unknown,
  minValue: number,
  maxValue: number
): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= minValue &&
    value <= maxValue
  );
}

export function clampInteger(
  value: number,
  minValue: number,
  maxValue: number,
  fallbackValue: number
): number {
  if (!Number.isFinite(value)) {
    return fallbackValue;
  }

  const roundedValue = Math.round(value);

  return Math.min(Math.max(roundedValue, minValue), maxValue);
}

export function normalizeText(value: string, fallbackValue: string): string {
  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : fallbackValue;
}

export function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizeRoutineTitle(value: string): string {
  return normalizeText(value, defaultRoutineTitle);
}

export function normalizeSets(value: number): number {
  return clampInteger(
    value,
    routineValidationLimits.sets.min,
    routineValidationLimits.sets.max,
    routineValidationLimits.sets.defaultValue
  );
}

export function normalizeRestSecondsBetweenSets(value: number): number {
  return clampInteger(
    value,
    routineValidationLimits.restSeconds.min,
    routineValidationLimits.restSeconds.max,
    routineValidationLimits.restSeconds.defaultValue
  );
}

export function normalizeRepetitions(value: number): number {
  return clampInteger(
    value,
    routineValidationLimits.repetitions.min,
    routineValidationLimits.repetitions.max,
    routineValidationLimits.repetitions.defaultValue
  );
}

export function normalizeDurationSeconds(value: number): number {
  return clampInteger(
    value,
    routineValidationLimits.durationSeconds.min,
    routineValidationLimits.durationSeconds.max,
    routineValidationLimits.durationSeconds.defaultValue
  );
}

export function isRoutineRepetitionTarget(
  value: unknown
): value is RoutineRepetitionTarget {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.type === "repetitions" &&
    isIntegerInRange(
      value.repetitions,
      routineValidationLimits.repetitions.min,
      routineValidationLimits.repetitions.max
    ) &&
    isString(value.unitLabel)
  );
}

export function isRoutineDurationTarget(
  value: unknown
): value is RoutineDurationTarget {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.type === "duration" &&
    isIntegerInRange(
      value.seconds,
      routineValidationLimits.durationSeconds.min,
      routineValidationLimits.durationSeconds.max
    )
  );
}

export function isRoutineTarget(value: unknown): value is RoutineTarget {
  return isRoutineRepetitionTarget(value) || isRoutineDurationTarget(value);
}

export function normalizeRoutineTarget(target: RoutineTarget): RoutineTarget {
  if (target.type === "duration") {
    return {
      type: "duration",
      seconds: normalizeDurationSeconds(target.seconds)
    };
  }

  return {
    type: "repetitions",
    repetitions: normalizeRepetitions(target.repetitions),
    unitLabel: normalizeText(target.unitLabel, defaultRepetitionUnitLabel)
  };
}

export function createDefaultRoutineTargetForExercise(
  exerciseId: ExerciseId
): RoutineTarget {
  const targetType = getExerciseSetTargetType(exerciseId);

  if (targetType === "duration") {
    return {
      type: "duration",
      seconds: routineValidationLimits.durationSeconds.defaultValue
    };
  }

  return {
    type: "repetitions",
    repetitions: routineValidationLimits.repetitions.defaultValue,
    unitLabel: defaultRepetitionUnitLabel
  };
}

export function doesRoutineTargetMatchExercise(
  exerciseId: ExerciseId,
  target: RoutineTarget
): boolean {
  return getExerciseSetTargetType(exerciseId) === target.type;
}

export function normalizeRoutineTargetForExercise(
  exerciseId: ExerciseId,
  target: RoutineTarget
): RoutineTarget {
  const normalizedTarget = normalizeRoutineTarget(target);

  if (doesRoutineTargetMatchExercise(exerciseId, normalizedTarget)) {
    return normalizedTarget;
  }

  return createDefaultRoutineTargetForExercise(exerciseId);
}

export function parseRoutineTargetForExercise(
  exerciseId: ExerciseId,
  value: unknown
): RoutineTarget | null {
  if (!isRoutineTarget(value)) {
    return null;
  }

  return normalizeRoutineTargetForExercise(exerciseId, value);
}

export function getRestSecondsBetweenSetsFromRecord(
  value: Record<string, unknown>
): number {
  if (
    isIntegerInRange(
      value.restSecondsBetweenSets,
      routineValidationLimits.restSeconds.min,
      routineValidationLimits.restSeconds.max
    )
  ) {
    return value.restSecondsBetweenSets;
  }

  if (
    isIntegerInRange(
      value.restSecondsAfter,
      routineValidationLimits.restSeconds.min,
      routineValidationLimits.restSeconds.max
    )
  ) {
    return value.restSecondsAfter;
  }

  return routineValidationLimits.restSeconds.defaultValue;
}