// src/lib/stats/statsCalculations.ts

import {
    getIsoWeekKey,
    getLocalDateKey,
    getPreviousIsoWeekKey,
    sortDateKeysAscending,
    sortDateKeysDescending,
    sortIsoWeekKeysAscending
} from "@/lib/dates/dateKeys";
import type { WeeklyGoal } from "@/types/goal";
import type {
    GoalStreakStats,
    TrainingSession,
    TrainingStats,
    WeeklyStats
} from "@/types/stats";

function getValidCompletedAtDate(session: TrainingSession): Date | null {
    const completedAtDate = new Date(session.completedAt);

    if (Number.isNaN(completedAtDate.getTime())) {
        return null;
    }

    return completedAtDate;
}

export function getTrainingDateKeys(stats: TrainingStats): string[] {
    const dateKeys = new Set<string>();

    for (const session of stats.sessions) {
        const completedAtDate = getValidCompletedAtDate(session);

        if (!completedAtDate) {
            continue;
        }

        dateKeys.add(getLocalDateKey(completedAtDate));
    }

    return sortDateKeysDescending([...dateKeys]);
}

export function getTrainingDateKeysAscending(stats: TrainingStats): string[] {
    return sortDateKeysAscending(getTrainingDateKeys(stats));
}

export function getSessionsForDate(
    stats: TrainingStats,
    dateKey: string
): TrainingSession[] {
    return stats.sessions.filter((session) => {
        const completedAtDate = getValidCompletedAtDate(session);

        if (!completedAtDate) {
            return false;
        }

        return getLocalDateKey(completedAtDate) === dateKey;
    });
}

export function getSessionsForWeek(
    stats: TrainingStats,
    weekKey: string
): TrainingSession[] {
    return stats.sessions.filter((session) => {
        const completedAtDate = getValidCompletedAtDate(session);

        if (!completedAtDate) {
            return false;
        }

        return getIsoWeekKey(completedAtDate) === weekKey;
    });
}

export function getCompletedSessionsCountForWeek(
    stats: TrainingStats,
    weekKey: string
): number {
    return getSessionsForWeek(stats, weekKey).length;
}

export function getCurrentWeeklyStats(
    stats: TrainingStats,
    goal: WeeklyGoal,
    referenceDate: Date = new Date()
): WeeklyStats {
    const weekKey = getIsoWeekKey(referenceDate);
    const completedSessions = getCompletedSessionsCountForWeek(stats, weekKey);

    return {
        weekKey,
        completedSessions,
        goalTarget: goal.targetSessionsPerWeek,
        isGoalCompleted: completedSessions >= goal.targetSessionsPerWeek
    };
}

export function getWeeklyStatsHistory(
    stats: TrainingStats,
    goal: WeeklyGoal
): WeeklyStats[] {
    const weekKeys = new Set<string>();

    for (const session of stats.sessions) {
        const completedAtDate = getValidCompletedAtDate(session);

        if (!completedAtDate) {
            continue;
        }

        weekKeys.add(getIsoWeekKey(completedAtDate));
    }

    return sortIsoWeekKeysAscending([...weekKeys]).map((weekKey) => {
        const completedSessions = getCompletedSessionsCountForWeek(stats, weekKey);

        return {
            weekKey,
            completedSessions,
            goalTarget: goal.targetSessionsPerWeek,
            isGoalCompleted: completedSessions >= goal.targetSessionsPerWeek
        };
    });
}

export function getGoalStreakStats(
    stats: TrainingStats,
    goal: WeeklyGoal,
    referenceDate: Date = new Date()
): GoalStreakStats {
    const weeklyStatsHistory = getWeeklyStatsHistory(stats, goal);
    const completedGoalWeekKeys = new Set(
        weeklyStatsHistory
            .filter((weeklyStats) => weeklyStats.isGoalCompleted)
            .map((weeklyStats) => weeklyStats.weekKey)
    );

    let longestWeeklyStreak = 0;
    let runningWeeklyStreak = 0;
    let previousWeekKey: string | null = null;

    for (const weekKey of sortIsoWeekKeysAscending([...completedGoalWeekKeys])) {
        const expectedPreviousWeekKey = getPreviousIsoWeekKey(weekKey);
        const isConsecutive =
            previousWeekKey !== null && expectedPreviousWeekKey === previousWeekKey;

        runningWeeklyStreak = isConsecutive ? runningWeeklyStreak + 1 : 1;
        longestWeeklyStreak = Math.max(longestWeeklyStreak, runningWeeklyStreak);
        previousWeekKey = weekKey;
    }

    let currentWeeklyStreak = 0;
    let cursorWeekKey: string | null = getIsoWeekKey(referenceDate);

    while (cursorWeekKey && completedGoalWeekKeys.has(cursorWeekKey)) {
        currentWeeklyStreak += 1;
        cursorWeekKey = getPreviousIsoWeekKey(cursorWeekKey);
    }

    return {
        currentWeeklyStreak,
        longestWeeklyStreak
    };
}

export function getTotalCompletedSessions(stats: TrainingStats): number {
    return stats.sessions.length;
}

export function getLastTrainingDateKey(stats: TrainingStats): string | null {
    const dateKeys = getTrainingDateKeys(stats);

    return dateKeys[0] ?? null;
}