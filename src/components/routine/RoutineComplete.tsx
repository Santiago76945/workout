// src/components/routine/RoutineComplete.tsx

"use client";

import Link from "next/link";
import type { CSSProperties } from "react";

type RoutineCompleteProps = {
  onRestart: () => void;
};

const styles = {
  card: {
    display: "grid",
    gap: "1rem",
    minWidth: 0,
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)",
    textAlign: "center"
  },
  title: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    fontSize: "2rem",
    letterSpacing: "-0.06em"
  },
  text: {
    margin: 0,
    color: "var(--muted)",
    lineHeight: 1.5
  },
  button: {
    minHeight: "3.3rem",
    border: 0,
    borderRadius: "999px",
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    fontWeight: 900
  },
  link: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "3.2rem",
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.55)",
    fontWeight: 900
  }
} satisfies Record<string, CSSProperties>;

export function RoutineComplete({ onRestart }: RoutineCompleteProps) {
  return (
    <section style={styles.card}>
      <h1 style={styles.title}>Rutina completada</h1>
      <p style={styles.text}>
        Se guardó este entrenamiento en tus estadísticas locales.
      </p>

      <button type="button" style={styles.button} onClick={onRestart}>
        Repetir rutina
      </button>

      <Link href="/routines" style={styles.link}>
        Elegir otra rutina
      </Link>

      <Link href="/stats" style={styles.link}>
        Ver estadísticas
      </Link>

      <Link href="/" style={styles.link}>
        Volver al menú
      </Link>
    </section>
  );
}