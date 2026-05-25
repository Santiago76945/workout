// src/lib/storage/goalStorage.ts

import { localStorageKeys } from "@/lib/storage/localStorageKeys";
import type { WeeklyGoal } from "@/types/goal";

const defaultTargetSessionsPerWeek = 3;
const minWeeklyGoal = 1;
const maxWeeklyGoal = 7;

function createDefaultWeeklyGoal(): WeeklyGoal {
  return {
    targetSessionsPerWeek: defaultTargetSessionsPerWeek,
    updatedAt: new Date().toISOString()
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isWeeklyGoal(value: unknown): value is WeeklyGoal {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.targetSessionsPerWeek === "number" &&
    Number.isInteger(value.targetSessionsPerWeek) &&
    value.targetSessionsPerWeek >= minWeeklyGoal &&
    value.targetSessionsPerWeek <= maxWeeklyGoal &&
    typeof value.updatedAt === "string"
  );
}

function normalizeWeeklyGoalTarget(targetSessionsPerWeek: number): number {
  if (!Number.isFinite(targetSessionsPerWeek)) {
    return defaultTargetSessionsPerWeek;
  }

  const roundedTarget = Math.round(targetSessionsPerWeek);

  return Math.min(Math.max(roundedTarget, minWeeklyGoal), maxWeeklyGoal);
}

export function createWeeklyGoal(targetSessionsPerWeek: number): WeeklyGoal {
  return {
    targetSessionsPerWeek: normalizeWeeklyGoalTarget(targetSessionsPerWeek),
    updatedAt: new Date().toISOString()
  };
}

export function getWeeklyGoal(): WeeklyGoal {
  if (typeof window === "undefined") {
    return createDefaultWeeklyGoal();
  }

  const rawValue = window.localStorage.getItem(localStorageKeys.weeklyGoal);

  if (!rawValue) {
    return createDefaultWeeklyGoal();
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isWeeklyGoal(parsedValue)) {
      return createDefaultWeeklyGoal();
    }

    return parsedValue;
  } catch {
    return createDefaultWeeklyGoal();
  }
}

export function saveWeeklyGoal(goal: WeeklyGoal): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(localStorageKeys.weeklyGoal, JSON.stringify(goal));
}

export function saveWeeklyGoalTarget(targetSessionsPerWeek: number): WeeklyGoal {
  const weeklyGoal = createWeeklyGoal(targetSessionsPerWeek);

  saveWeeklyGoal(weeklyGoal);

  return weeklyGoal;
}

export function resetWeeklyGoal(): WeeklyGoal {
  const weeklyGoal = createDefaultWeeklyGoal();

  saveWeeklyGoal(weeklyGoal);

  return weeklyGoal;
}