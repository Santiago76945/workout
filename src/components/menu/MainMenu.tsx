// src/components/menu/MainMenu.tsx

import Link from "next/link";
import type { CSSProperties } from "react";

import { defaultRoutine } from "@/data/routines";

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1.25rem"
  },
  header: {
    display: "grid",
    gap: "0.5rem"
  },
  eyebrow: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.875rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  title: {
    margin: 0,
    fontSize: "2.4rem",
    lineHeight: 1,
    letterSpacing: "-0.06em"
  },
  description: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "1rem",
    lineHeight: 1.5
  },
  card: {
    display: "grid",
    gap: "0.85rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)"
  },
  linkPrimary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "3.4rem",
    borderRadius: "999px",
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    fontSize: "1rem",
    fontWeight: 800
  },
  linkSecondary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "3.2rem",
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.56)",
    fontSize: "0.95rem",
    fontWeight: 800
  },
  meta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem"
  },
  metaItem: {
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.42)",
    padding: "0.9rem"
  },
  metaValue: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 900
  },
  metaLabel: {
    margin: "0.2rem 0 0",
    color: "var(--muted)",
    fontSize: "0.8rem",
    fontWeight: 700
  }
} satisfies Record<string, CSSProperties>;

export function MainMenu() {
  return (
    <main style={styles.wrapper}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>Rutina home</p>
        <h1 style={styles.title}>App de ejercicios</h1>
        <p style={styles.description}>
          Seguí tu rutina paso por paso, registrá tus entrenamientos y medí si
          estás cumpliendo tu objetivo semanal.
        </p>
      </header>

      <section style={styles.card} aria-label="Menú principal">
        <Link href="/routine" style={styles.linkPrimary}>
          Comenzar rutina
        </Link>

        <Link href="/stats" style={styles.linkSecondary}>
          Ver estadísticas
        </Link>

        <Link href="/goals" style={styles.linkSecondary}>
          Establecer objetivo
        </Link>
      </section>

      <section style={styles.meta} aria-label="Resumen de la rutina">
        <article style={styles.metaItem}>
          <p style={styles.metaValue}>
            {defaultRoutine.idealSessionsPerWeek}x
          </p>
          <p style={styles.metaLabel}>por semana</p>
        </article>

        <article style={styles.metaItem}>
          <p style={styles.metaValue}>
            {defaultRoutine.estimatedDurationMinutes.min}-
            {defaultRoutine.estimatedDurationMinutes.max}m
          </p>
          <p style={styles.metaLabel}>duración</p>
        </article>
      </section>
    </main>
  );
}