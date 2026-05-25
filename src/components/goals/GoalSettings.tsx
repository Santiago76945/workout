// src/components/goals/GoalSettings.tsx

"use client";

import Link from "next/link";
import type { CSSProperties, FormEvent } from "react";
import { useEffect, useState } from "react";

import {
  getWeeklyGoal,
  saveWeeklyGoalTarget
} from "@/lib/storage/goalStorage";
import type { WeeklyGoal } from "@/types/goal";

const initialGoal: WeeklyGoal = {
  targetSessionsPerWeek: 3,
  updatedAt: ""
};

const styles = {
  wrapper: {
    display: "grid",
    minHeight: "100vh",
    alignContent: "center",
    gap: "1rem"
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
  card: {
    display: "grid",
    gap: "1rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)"
  },
  label: {
    display: "grid",
    gap: "0.45rem",
    color: "var(--muted)",
    fontSize: "0.88rem",
    fontWeight: 850
  },
  input: {
    minHeight: "3.2rem",
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.62)",
    color: "var(--foreground)",
    padding: "0 0.9rem",
    fontSize: "1.1rem",
    fontWeight: 900
  },
  button: {
    minHeight: "3.3rem",
    border: 0,
    borderRadius: "999px",
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    fontWeight: 900
  },
  current: {
    margin: 0,
    color: "var(--muted)",
    lineHeight: 1.5
  },
  strong: {
    color: "var(--foreground)",
    fontWeight: 950
  }
} satisfies Record<string, CSSProperties>;

export function GoalSettings() {
  const [goal, setGoal] = useState<WeeklyGoal>(initialGoal);
  const [targetSessionsPerWeek, setTargetSessionsPerWeek] = useState(
    initialGoal.targetSessionsPerWeek
  );

  useEffect(() => {
    const storedGoal = getWeeklyGoal();

    setGoal(storedGoal);
    setTargetSessionsPerWeek(storedGoal.targetSessionsPerWeek);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const updatedGoal = saveWeeklyGoalTarget(targetSessionsPerWeek);

    setGoal(updatedGoal);
    setTargetSessionsPerWeek(updatedGoal.targetSessionsPerWeek);
  }

  return (
    <main style={styles.wrapper}>
      <header style={styles.topBar}>
        <Link href="/" style={styles.backLink}>
          Volver
        </Link>

        <h1 style={styles.title}>Objetivo</h1>
      </header>

      <form style={styles.card} onSubmit={handleSubmit}>
        <p style={styles.current}>
          Objetivo actual:{" "}
          <span style={styles.strong}>
            {goal.targetSessionsPerWeek} entrenamientos por semana
          </span>
        </p>

        <label style={styles.label}>
          Entrenamientos por semana
          <input
            type="number"
            min={1}
            max={7}
            step={1}
            value={targetSessionsPerWeek}
            style={styles.input}
            onChange={(event) => {
              setTargetSessionsPerWeek(Number(event.target.value));
            }}
          />
        </label>

        <button type="submit" style={styles.button}>
          Guardar objetivo
        </button>
      </form>
    </main>
  );
}