// src/lib/storage/routineStorage.ts

import {
  createId,
  getRestSecondsBetweenSetsFromRecord,
  isExerciseId,
  isIntegerInRange,
  isRecord,
  isString,
  normalizeRestSecondsBetweenSets,
  normalizeRoutineTargetForExercise,
  normalizeRoutineTitle,
  normalizeSets,
  normalizeText,
  parseRoutineTargetForExercise,
  routineValidationLimits
} from "@/lib/routine/routineValidation";
import { localStorageKeys } from "@/lib/storage/localStorageKeys";
import type {
  CreateRoutineInput,
  CreateRoutineItemInput,
  Routine,
  RoutineItem
} from "@/types/routine";

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

function parseRoutineItem(value: unknown): RoutineItem | null {
  if (!isRecord(value)) {
    return null;
  }

  if (!isString(value.id) || !isExerciseId(value.exerciseId)) {
    return null;
  }

  const target = parseRoutineTargetForExercise(value.exerciseId, value.target);

  if (!target) {
    return null;
  }

  const sets = isIntegerInRange(
    value.sets,
    routineValidationLimits.sets.min,
    routineValidationLimits.sets.max
  )
    ? value.sets
    : routineValidationLimits.sets.defaultValue;

  return {
    id: value.id,
    exerciseId: value.exerciseId,
    sets,
    target,
    restSecondsBetweenSets: getRestSecondsBetweenSetsFromRecord(value)
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
    title: normalizeRoutineTitle(value.title),
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
    sets: normalizeSets(itemInput.sets),
    target: normalizeRoutineTargetForExercise(
      itemInput.exerciseId,
      itemInput.target
    ),
    restSecondsBetweenSets: normalizeRestSecondsBetweenSets(
      itemInput.restSecondsBetweenSets
    )
  };
}

function normalizeRoutineItem(item: RoutineItem): RoutineItem {
  return {
    id: normalizeText(item.id, createId("routine-item")),
    exerciseId: item.exerciseId,
    sets: normalizeSets(item.sets),
    target: normalizeRoutineTargetForExercise(item.exerciseId, item.target),
    restSecondsBetweenSets: normalizeRestSecondsBetweenSets(
      item.restSecondsBetweenSets
    )
  };
}

function createRoutineFromInput(
  input: CreateRoutineInput,
  now: string
): Routine {
  return {
    id: createId("routine"),
    title: normalizeRoutineTitle(input.title),
    createdAt: now,
    updatedAt: now,
    items: input.items.map((itemInput) => normalizeRoutineItemInput(itemInput))
  };
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
  const routine = createRoutineFromInput(input, now);

  saveUserRoutines([...routines, routine]);
  saveSelectedRoutineId(routine.id);

  return routine;
}

export function createRoutines(inputs: CreateRoutineInput[]): Routine[] {
  if (inputs.length === 0) {
    return [];
  }

  const now = new Date().toISOString();
  const routines = getUserRoutines();
  const importedRoutines = inputs.map((input) =>
    createRoutineFromInput(input, now)
  );

  saveUserRoutines([...routines, ...importedRoutines]);
  saveSelectedRoutineId(importedRoutines[0]?.id ?? routines[0]?.id ?? "");

  return importedRoutines;
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
    title: normalizeRoutineTitle(routine.title),
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
  if (typeof window === "undefined" || routineId.length === 0) {
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