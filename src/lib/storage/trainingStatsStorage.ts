// src/lib/storage/trainingStatsStorage.ts

import { getLocalDateKey } from "@/lib/dates/dateKeys";
import { localStorageKeys } from "@/lib/storage/localStorageKeys";
import type { TrainingSession, TrainingStats } from "@/types/stats";

type RegisterTrainingSessionInput = {
  routineId: string;
  routineTitle: string;
};

function createEmptyTrainingStats(): TrainingStats {
  return {
    sessions: []
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function isTrainingSession(value: unknown): value is TrainingSession {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isString(value.id) &&
    isString(value.completedAt) &&
    isString(value.routineId) &&
    isString(value.routineTitle)
  );
}

function isTrainingStats(value: unknown): value is TrainingStats {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.sessions) &&
    value.sessions.every((session) => isTrainingSession(session))
  );
}

function createTrainingSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `training-session-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function getTrainingStats(): TrainingStats {
  if (typeof window === "undefined") {
    return createEmptyTrainingStats();
  }

  const rawValue = window.localStorage.getItem(localStorageKeys.trainingStats);

  if (!rawValue) {
    return createEmptyTrainingStats();
  }

  try {
    const parsedValue: unknown = JSON.parse(rawValue);

    if (!isTrainingStats(parsedValue)) {
      return createEmptyTrainingStats();
    }

    return parsedValue;
  } catch {
    return createEmptyTrainingStats();
  }
}

export function saveTrainingStats(stats: TrainingStats): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    localStorageKeys.trainingStats,
    JSON.stringify(stats)
  );
}

export function registerCompletedTrainingSession(
  input: RegisterTrainingSessionInput
): TrainingSession {
  const currentStats = getTrainingStats();

  const newSession: TrainingSession = {
    id: createTrainingSessionId(),
    completedAt: new Date().toISOString(),
    routineId: input.routineId,
    routineTitle: input.routineTitle
  };

  saveTrainingStats({
    sessions: [...currentStats.sessions, newSession]
  });

  return newSession;
}

export function removeTrainingSession(sessionId: string): void {
  const currentStats = getTrainingStats();

  saveTrainingStats({
    sessions: currentStats.sessions.filter((session) => session.id !== sessionId)
  });
}

export function clearTrainingStats(): void {
  saveTrainingStats(createEmptyTrainingStats());
}

export function hasTrainingSessionToday(stats: TrainingStats): boolean {
  const todayKey = getLocalDateKey();

  return stats.sessions.some((session) => {
    const completedAtDate = new Date(session.completedAt);

    if (Number.isNaN(completedAtDate.getTime())) {
      return false;
    }

    return getLocalDateKey(completedAtDate) === todayKey;
  });
}