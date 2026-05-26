// src/components/stats/StatsDashboard.tsx

"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import {
  getCurrentWeeklyStats,
  getGoalStreakStats,
  getLastTrainingDateKey,
  getTotalCompletedSessions,
  getTrainingDateKeys
} from "@/lib/stats/statsCalculations";
import { getWeeklyGoal } from "@/lib/storage/goalStorage";
import { getTrainingStats } from "@/lib/storage/trainingStatsStorage";
import type { WeeklyGoal } from "@/types/goal";
import type { TrainingStats } from "@/types/stats";

const emptyStats: TrainingStats = {
  sessions: []
};

const initialGoal: WeeklyGoal = {
  targetSessionsPerWeek: 3,
  updatedAt: ""
};

const styles = {
  wrapper: {
    display: "grid",
    gap: "1rem",
    alignContent: "start"
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem"
  },
  backLink: {
    color: "var(--muted)",
    fontSize: "0.9rem",
    fontWeight: 800
  },
  title: {
    margin: 0,
    fontSize: "1.7rem",
    letterSpacing: "-0.05em"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem"
  },
  card: {
    display: "grid",
    gap: "0.35rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)"
  },
  value: {
    margin: 0,
    fontSize: "2rem",
    fontWeight: 950,
    letterSpacing: "-0.08em"
  },
  label: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.83rem",
    fontWeight: 800,
    lineHeight: 1.35
  },
  wideCard: {
    display: "grid",
    gap: "0.7rem",
    gridColumn: "1 / -1",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)"
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.45rem",
    margin: 0,
    padding: 0,
    listStyle: "none"
  },
  pill: {
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.58)",
    padding: "0.45rem 0.7rem",
    fontSize: "0.82rem",
    fontWeight: 850
  },
  empty: {
    margin: 0,
    color: "var(--muted)",
    lineHeight: 1.45
  },
  linkButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "3.2rem",
    borderRadius: "999px",
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    fontWeight: 900
  }
} satisfies Record<string, CSSProperties>;

export function StatsDashboard() {
  const [stats, setStats] = useState<TrainingStats>(emptyStats);
  const [goal, setGoal] = useState<WeeklyGoal>(initialGoal);

  useEffect(() => {
    setStats(getTrainingStats());
    setGoal(getWeeklyGoal());
  }, []);

  const currentWeeklyStats = useMemo(
    () => getCurrentWeeklyStats(stats, goal),
    [stats, goal]
  );

  const streakStats = useMemo(
    () => getGoalStreakStats(stats, goal),
    [stats, goal]
  );

  const trainingDateKeys = useMemo(() => getTrainingDateKeys(stats), [stats]);
  const totalCompletedSessions = getTotalCompletedSessions(stats);
  const lastTrainingDateKey = getLastTrainingDateKey(stats);

  return (
    <main style={styles.wrapper}>
      <header style={styles.topBar}>
        <Link href="/" style={styles.backLink}>
          Volver
        </Link>

        <h1 style={styles.title}>Estadísticas</h1>
      </header>

      <section style={styles.grid} aria-label="Resumen de estadísticas">
        <article style={styles.card}>
          <p style={styles.value}>{currentWeeklyStats.completedSessions}</p>
          <p style={styles.label}>
            entrenamientos esta semana de {currentWeeklyStats.goalTarget}
          </p>
        </article>

        <article style={styles.card}>
          <p style={styles.value}>
            {currentWeeklyStats.isGoalCompleted ? "Sí" : "No"}
          </p>
          <p style={styles.label}>objetivo semanal cumplido</p>
        </article>

        <article style={styles.card}>
          <p style={styles.value}>{streakStats.currentWeeklyStreak}</p>
          <p style={styles.label}>semanas seguidas cumpliendo</p>
        </article>

        <article style={styles.card}>
          <p style={styles.value}>{streakStats.longestWeeklyStreak}</p>
          <p style={styles.label}>mejor racha semanal</p>
        </article>

        <article style={styles.card}>
          <p style={styles.value}>{totalCompletedSessions}</p>
          <p style={styles.label}>entrenamientos totales</p>
        </article>

        <article style={styles.card}>
          <p style={styles.value}>{lastTrainingDateKey ?? "-"}</p>
          <p style={styles.label}>último día entrenado</p>
        </article>

        <section style={styles.wideCard}>
          <p style={styles.label}>Días entrenados</p>

          {trainingDateKeys.length > 0 ? (
            <ul style={styles.list}>
              {trainingDateKeys.map((dateKey) => (
                <li key={dateKey} style={styles.pill}>
                  {dateKey}
                </li>
              ))}
            </ul>
          ) : (
            <p style={styles.empty}>
              Todavía no hay entrenamientos registrados. Completá una rutina
              para que aparezca acá.
            </p>
          )}
        </section>
      </section>

      <Link href="/" style={styles.linkButton}>
        Volver al menú
      </Link>
    </main>
  );
}