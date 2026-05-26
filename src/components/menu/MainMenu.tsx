// src/components/menu/MainMenu.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import { formatRoutineEstimatedDuration } from "@/lib/routine/estimateRoutineDuration";
import {
  getSelectedRoutineId,
  getUserRoutines,
  saveSelectedRoutineId
} from "@/lib/storage/routineStorage";
import type { Routine } from "@/types/routine";

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    justifyContent: "center",
    gap: "1.25rem",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden"
  },
  header: {
    display: "grid",
    gap: "0.5rem",
    minWidth: 0
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
    minWidth: 0,
    overflowWrap: "anywhere",
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
    minWidth: 0,
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)"
  },
  currentRoutineCard: {
    display: "grid",
    gap: "0.4rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.48)",
    padding: "0.9rem"
  },
  currentRoutineLabel: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.78rem",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  currentRoutineTitle: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    fontSize: "1.1rem",
    fontWeight: 950,
    letterSpacing: "-0.03em"
  },
  buttonPrimary: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "3.4rem",
    width: "100%",
    border: 0,
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
  emptyText: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.95rem",
    lineHeight: 1.45
  },
  meta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    minWidth: 0
  },
  metaItem: {
    minWidth: 0,
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.42)",
    padding: "0.9rem"
  },
  metaValue: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
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

function getRoutineTotalSets(routine: Routine | null): number {
  if (!routine) {
    return 0;
  }

  return routine.items.reduce((totalSets, item) => totalSets + item.sets, 0);
}

export function MainMenu() {
  const router = useRouter();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState("");

  useEffect(() => {
    const storedRoutines = getUserRoutines();
    const storedSelectedRoutineId = getSelectedRoutineId();

    const selectedRoutine =
      storedRoutines.find((routine) => routine.id === storedSelectedRoutineId) ??
      storedRoutines[0] ??
      null;

    setRoutines(storedRoutines);
    setSelectedRoutineId(selectedRoutine?.id ?? "");

    if (selectedRoutine) {
      saveSelectedRoutineId(selectedRoutine.id);
    }
  }, []);

  const selectedRoutine = useMemo(
    () => routines.find((routine) => routine.id === selectedRoutineId) ?? null,
    [routines, selectedRoutineId]
  );

  const selectedRoutineTotalSets = useMemo(
    () => getRoutineTotalSets(selectedRoutine),
    [selectedRoutine]
  );

  function handleStartRoutine(): void {
    if (!selectedRoutine) {
      return;
    }

    saveSelectedRoutineId(selectedRoutine.id);
    router.push("/routine");
  }

  return (
    <main style={styles.wrapper}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>Rutinas personalizadas</p>
        <h1 style={styles.title}>App de ejercicios</h1>
        <p style={styles.description}>
          Creá tus propias rutinas, elegí ejercicios, configurá series,
          repeticiones o segundos por serie y registrá tus entrenamientos.
        </p>
      </header>

      <section style={styles.card} aria-label="Menú principal">
        {selectedRoutine ? (
          <section style={styles.currentRoutineCard}>
            <p style={styles.currentRoutineLabel}>Rutina seleccionada</p>
            <p style={styles.currentRoutineTitle}>{selectedRoutine.title}</p>
          </section>
        ) : (
          <p style={styles.emptyText}>
            Todavía no tenés rutinas creadas. Entrá en Mis rutinas para crear o
            importar una.
          </p>
        )}

        <button
          type="button"
          style={styles.buttonPrimary}
          onClick={handleStartRoutine}
          disabled={!selectedRoutine}
        >
          Comenzar rutina
        </button>

        <Link href="/routines" style={styles.linkSecondary}>
          Mis rutinas
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
          <p style={styles.metaValue}>{selectedRoutine?.items.length ?? 0}</p>
          <p style={styles.metaLabel}>ejercicios</p>
        </article>

        <article style={styles.metaItem}>
          <p style={styles.metaValue}>{selectedRoutineTotalSets}</p>
          <p style={styles.metaLabel}>series</p>
        </article>

        <article style={styles.metaItem}>
          <p style={styles.metaValue}>
            {selectedRoutine
              ? formatRoutineEstimatedDuration(selectedRoutine)
              : "-"}
          </p>
          <p style={styles.metaLabel}>duración aprox.</p>
        </article>
      </section>
    </main>
  );
}