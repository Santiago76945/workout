// src/lib/storage/routineStorage.ts

import { exerciseIds, type ExerciseId } from "@/types/exercise";
import type {
  CreateRoutineInput,
  CreateRoutineItemInput,
  Routine,
  RoutineDurationTarget,
  RoutineItem,
  RoutineRepetitionTarget,
  RoutineTarget
} from "@/types/routine";

import { localStorageKeys } from "@/lib/storage/localStorageKeys";

const minSets = 1;
const maxSets = 99;
const defaultSets = 3;

const minRepetitions = 1;
const maxRepetitions = 999;
const minDurationSeconds = 1;
const maxDurationSeconds = 3600;
const minRestSeconds = 0;
const maxRestSeconds = 3600;

const defaultRoutineTitle = "Mi rutina";
const defaultUnitLabel = "repeticiones";

const validExerciseIds = new Set<ExerciseId>(exerciseIds);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isExerciseId(value: unknown): value is ExerciseId {
  return isString(value) && validExerciseIds.has(value as ExerciseId);
}

function isIntegerInRange(
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

function clampInteger(
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

function normalizeText(value: string, fallbackValue: string): string {
  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : fallbackValue;
}

function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function isRoutineRepetitionTarget(
  value: unknown
): value is RoutineRepetitionTarget {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.type === "repetitions" &&
    isIntegerInRange(value.repetitions, minRepetitions, maxRepetitions) &&
    isString(value.unitLabel)
  );
}

function isRoutineDurationTarget(value: unknown): value is RoutineDurationTarget {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.type === "duration" &&
    isIntegerInRange(value.seconds, minDurationSeconds, maxDurationSeconds)
  );
}

function isRoutineTarget(value: unknown): value is RoutineTarget {
  return isRoutineRepetitionTarget(value) || isRoutineDurationTarget(value);
}

function normalizeRoutineTarget(target: RoutineTarget): RoutineTarget {
  if (target.type === "duration") {
    return {
      type: "duration",
      seconds: clampInteger(
        target.seconds,
        minDurationSeconds,
        maxDurationSeconds,
        minDurationSeconds
      )
    };
  }

  return {
    type: "repetitions",
    repetitions: clampInteger(
      target.repetitions,
      minRepetitions,
      maxRepetitions,
      minRepetitions
    ),
    unitLabel: normalizeText(target.unitLabel, defaultUnitLabel)
  };
}

function getRestSecondsBetweenSets(value: Record<string, unknown>): number {
  if (
    isIntegerInRange(
      value.restSecondsBetweenSets,
      minRestSeconds,
      maxRestSeconds
    )
  ) {
    return value.restSecondsBetweenSets;
  }

  if (isIntegerInRange(value.restSecondsAfter, minRestSeconds, maxRestSeconds)) {
    return value.restSecondsAfter;
  }

  return minRestSeconds;
}

function parseRoutineItem(value: unknown): RoutineItem | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isString(value.id) ||
    !isExerciseId(value.exerciseId) ||
    !isRoutineTarget(value.target)
  ) {
    return null;
  }

  const sets = isIntegerInRange(value.sets, minSets, maxSets)
    ? value.sets
    : defaultSets;

  return {
    id: value.id,
    exerciseId: value.exerciseId,
    sets,
    target: normalizeRoutineTarget(value.target),
    restSecondsBetweenSets: getRestSecondsBetweenSets(value)
  };
}

function parseRoutine(value: unknown): Routine | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    !isString(value.id) ||
    !isString(value.title) ||
    !isString(value.createdAt) ||
    !isString(value.updatedAt) ||
    !Array.isArray(value.items)
  ) {
    return null;
  }

  const items = value.items
    .map((item) => parseRoutineItem(item))
    .filter((item): item is RoutineItem => item !== null);

  return {
    id: value.id,
    title: normalizeText(value.title, defaultRoutineTitle),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    items
  };
}

function normalizeRoutineItemInput(
  itemInput: CreateRoutineItemInput
): RoutineItem {
  return {
    id: createId("routine-item"),
    exerciseId: itemInput.exerciseId,
    sets: clampInteger(itemInput.sets, minSets, maxSets, defaultSets),
    target: normalizeRoutineTarget(itemInput.target),
    restSecondsBetweenSets: clampInteger(
      itemInput.restSecondsBetweenSets,
      minRestSeconds,
      maxRestSeconds,
      minRestSeconds
    )
  };
}

function normalizeRoutineItem(item: RoutineItem): RoutineItem {
  return {
    id: normalizeText(item.id, createId("routine-item")),
    exerciseId: item.exerciseId,
    sets: clampInteger(item.sets, minSets, maxSets, defaultSets),
    target: normalizeRoutineTarget(item.target),
    restSecondsBetweenSets: clampInteger(
      item.restSecondsBetweenSets,
      minRestSeconds,
      maxRestSeconds,
      minRestSeconds
    )
  };
}

function createEmptyRoutineList(): Routine[] {
  return [];
}

function readRawUserRoutines(): unknown {
  if (typeof window === "undefined") {
    return createEmptyRoutineList();
  }

  const rawValue = window.localStorage.getItem(localStorageKeys.userRoutines);

  if (!rawValue) {
    return createEmptyRoutineList();
  }

  try {
    return JSON.parse(rawValue) as unknown;
  } catch {
    return createEmptyRoutineList();
  }
}

export function getUserRoutines(): Routine[] {
  const parsedValue = readRawUserRoutines();

  if (!Array.isArray(parsedValue)) {
    return createEmptyRoutineList();
  }

  return parsedValue
    .map((routine) => parseRoutine(routine))
    .filter((routine): routine is Routine => routine !== null);
}

export function saveUserRoutines(routines: Routine[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    localStorageKeys.userRoutines,
    JSON.stringify(routines)
  );

  const selectedRoutineId = getSelectedRoutineId();

  if (
    selectedRoutineId &&
    !routines.some((routine) => routine.id === selectedRoutineId)
  ) {
    clearSelectedRoutineId();
  }
}

export function getRoutineById(routineId: string): Routine | null {
  const routines = getUserRoutines();

  return routines.find((routine) => routine.id === routineId) ?? null;
}

export function createRoutine(input: CreateRoutineInput): Routine {
  const now = new Date().toISOString();
  const routines = getUserRoutines();

  const routine: Routine = {
    id: createId("routine"),
    title: normalizeText(input.title, defaultRoutineTitle),
    createdAt: now,
    updatedAt: now,
    items: input.items.map((itemInput) => normalizeRoutineItemInput(itemInput))
  };

  saveUserRoutines([...routines, routine]);
  saveSelectedRoutineId(routine.id);

  return routine;
}

export function updateRoutine(routine: Routine): Routine | null {
  const routines = getUserRoutines();
  const routineIndex = routines.findIndex(
    (storedRoutine) => storedRoutine.id === routine.id
  );

  if (routineIndex < 0) {
    return null;
  }

  const previousRoutine = routines[routineIndex];

  if (!previousRoutine) {
    return null;
  }

  const updatedRoutine: Routine = {
    id: previousRoutine.id,
    title: normalizeText(routine.title, defaultRoutineTitle),
    createdAt: previousRoutine.createdAt,
    updatedAt: new Date().toISOString(),
    items: routine.items.map((item) => normalizeRoutineItem(item))
  };

  const updatedRoutines = [...routines];

  updatedRoutines[routineIndex] = updatedRoutine;

  saveUserRoutines(updatedRoutines);

  return updatedRoutine;
}

export function deleteRoutine(routineId: string): void {
  const routines = getUserRoutines();
  const updatedRoutines = routines.filter((routine) => routine.id !== routineId);

  saveUserRoutines(updatedRoutines);

  if (getSelectedRoutineId() === routineId) {
    const fallbackRoutine = updatedRoutines[0] ?? null;

    if (fallbackRoutine) {
      saveSelectedRoutineId(fallbackRoutine.id);
      return;
    }

    clearSelectedRoutineId();
  }
}

export function getSelectedRoutineId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  const selectedRoutineId = window.localStorage.getItem(
    localStorageKeys.selectedRoutineId
  );

  if (!selectedRoutineId) {
    return null;
  }

  return selectedRoutineId;
}

export function saveSelectedRoutineId(routineId: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(localStorageKeys.selectedRoutineId, routineId);
}

export function clearSelectedRoutineId(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(localStorageKeys.selectedRoutineId);
}

export function getSelectedRoutine(): Routine | null {
  const selectedRoutineId = getSelectedRoutineId();

  if (!selectedRoutineId) {
    return null;
  }

  return getRoutineById(selectedRoutineId);
}