// src/types/stats.ts

export type TrainingSession = {
  id: string;
  completedAt: string;
  routineId: string;
  routineTitle: string;
};

export type TrainingStats = {
  sessions: TrainingSession[];
};

export type WeeklyStats = {
  weekKey: string;
  completedSessions: number;
  goalTarget: number;
  isGoalCompleted: boolean;
};

export type GoalStreakStats = {
  currentWeeklyStreak: number;
  longestWeeklyStreak: number;
};