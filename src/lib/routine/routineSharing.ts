// src/lib/routine/routineSharing.ts

import { getExerciseSetTargetType } from "@/lib/routine/exerciseSetTarget";
import {
  doesRoutineTargetMatchExercise,
  getRestSecondsBetweenSetsFromRecord,
  isExerciseId,
  isIntegerInRange,
  isRecord,
  isRoutineTarget,
  isString,
  normalizeRestSecondsBetweenSets,
  normalizeRoutineTarget,
  normalizeRoutineTitle,
  normalizeSets,
  routineValidationLimits
} from "@/lib/routine/routineValidation";
import type {
  CreateRoutineInput,
  CreateRoutineItemInput,
  Routine
} from "@/types/routine";

export const routineExportSchemaVersion = 1;
export const routineExportAppName = "workout-routine-app";

export type RoutineExportItem = {
  title: string;
  items: CreateRoutineItemInput[];
};

export type RoutineExportPayload = {
  schemaVersion: typeof routineExportSchemaVersion;
  app: typeof routineExportAppName;
  exportedAt: string;
  routines: RoutineExportItem[];
};

export type RoutineImportParseSuccess = {
  ok: true;
  routines: CreateRoutineInput[];
};

export type RoutineImportParseFailure = {
  ok: false;
  errors: string[];
};

export type RoutineImportParseResult =
  | RoutineImportParseSuccess
  | RoutineImportParseFailure;

function getRoutineLabel(routineIndex: number): string {
  return `Rutina ${routineIndex + 1}`;
}

function getItemLabel(routineIndex: number, itemIndex: number): string {
  return `${getRoutineLabel(routineIndex)}, ejercicio ${itemIndex + 1}`;
}

function parseRoutineItems(
  value: unknown,
  routineIndex: number,
  errors: string[]
): CreateRoutineItemInput[] {
  if (!Array.isArray(value)) {
    errors.push(
      `${getRoutineLabel(routineIndex)}: falta la lista de ejercicios.`
    );
    return [];
  }

  return value
    .map((item, itemIndex): CreateRoutineItemInput | null => {
      const itemLabel = getItemLabel(routineIndex, itemIndex);

      if (!isRecord(item)) {
        errors.push(`${itemLabel}: el ejercicio debe ser un objeto.`);
        return null;
      }

      if (!isExerciseId(item.exerciseId)) {
        errors.push(
          `${itemLabel}: el exerciseId no existe en esta app o no es válido.`
        );
        return null;
      }

      if (
        !isIntegerInRange(
          item.sets,
          routineValidationLimits.sets.min,
          routineValidationLimits.sets.max
        )
      ) {
        errors.push(
          `${itemLabel}: sets debe ser un número entero entre ${routineValidationLimits.sets.min} y ${routineValidationLimits.sets.max}.`
        );
        return null;
      }

      if (!isRoutineTarget(item.target)) {
        errors.push(`${itemLabel}: target no tiene un formato válido.`);
        return null;
      }

      const normalizedTarget = normalizeRoutineTarget(item.target);

      if (!doesRoutineTargetMatchExercise(item.exerciseId, normalizedTarget)) {
        const expectedTargetType = getExerciseSetTargetType(item.exerciseId);
        const expectedLabel =
          expectedTargetType === "duration" ? "segundos" : "repeticiones";

        errors.push(
          `${itemLabel}: el ejercicio ${item.exerciseId} debe usar ${expectedLabel} por serie.`
        );
        return null;
      }

      return {
        exerciseId: item.exerciseId,
        sets: normalizeSets(item.sets),
        target: normalizedTarget,
        restSecondsBetweenSets: normalizeRestSecondsBetweenSets(
          getRestSecondsBetweenSetsFromRecord(item)
        )
      };
    })
    .filter((item): item is CreateRoutineItemInput => item !== null);
}

function parseRoutineInput(
  value: unknown,
  routineIndex: number,
  errors: string[]
): CreateRoutineInput | null {
  if (!isRecord(value)) {
    errors.push(
      `${getRoutineLabel(routineIndex)}: la rutina debe ser un objeto.`
    );
    return null;
  }

  if (!isString(value.title)) {
    errors.push(
      `${getRoutineLabel(routineIndex)}: falta el nombre de la rutina.`
    );
    return null;
  }

  const items = parseRoutineItems(value.items, routineIndex, errors);

  if (items.length === 0) {
    errors.push(
      `${getRoutineLabel(routineIndex)}: la rutina necesita al menos un ejercicio válido.`
    );
    return null;
  }

  return {
    title: normalizeRoutineTitle(value.title),
    items
  };
}

function extractRoutinesFromPayload(
  value: unknown,
  errors: string[]
): unknown[] | null {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value)) {
    errors.push(
      "El JSON debe ser un objeto de exportación o un array de rutinas."
    );
    return null;
  }

  if (
    "schemaVersion" in value &&
    value.schemaVersion !== routineExportSchemaVersion
  ) {
    errors.push(
      `La versión del archivo no es compatible. Versión esperada: ${routineExportSchemaVersion}.`
    );
  }

  if ("app" in value && value.app !== routineExportAppName) {
    errors.push("El archivo no parece haber sido exportado desde esta app.");
  }

  if (!Array.isArray(value.routines)) {
    errors.push("El JSON no contiene una lista de rutinas válida.");
    return null;
  }

  return value.routines;
}

export function createRoutineExportPayload(
  routines: Routine[]
): RoutineExportPayload {
  return {
    schemaVersion: routineExportSchemaVersion,
    app: routineExportAppName,
    exportedAt: new Date().toISOString(),
    routines: routines.map((routine) => ({
      title: routine.title,
      items: routine.items.map((item) => ({
        exerciseId: item.exerciseId,
        sets: item.sets,
        target: item.target,
        restSecondsBetweenSets: item.restSecondsBetweenSets
      }))
    }))
  };
}

export function stringifyRoutineExportPayload(routines: Routine[]): string {
  return JSON.stringify(createRoutineExportPayload(routines), null, 2);
}

export function parseRoutineImportPayload(
  value: unknown
): RoutineImportParseResult {
  const errors: string[] = [];
  const rawRoutines = extractRoutinesFromPayload(value, errors);

  if (!rawRoutines) {
    return {
      ok: false,
      errors
    };
  }

  const routines = rawRoutines
    .map((routine, routineIndex) =>
      parseRoutineInput(routine, routineIndex, errors)
    )
    .filter((routine): routine is CreateRoutineInput => routine !== null);

  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }

  if (routines.length === 0) {
    return {
      ok: false,
      errors: ["El archivo no contiene rutinas válidas para importar."]
    };
  }

  return {
    ok: true,
    routines
  };
}