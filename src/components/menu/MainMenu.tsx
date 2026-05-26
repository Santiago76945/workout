// src/components/menu/MainMenu.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ChangeEvent, CSSProperties } from "react";
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
  label: {
    display: "grid",
    gap: "0.45rem",
    color: "var(--muted)",
    fontSize: "0.88rem",
    fontWeight: 850
  },
  select: {
    minHeight: "3.2rem",
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.62)",
    color: "var(--foreground)",
    padding: "0 0.9rem",
    fontSize: "1rem",
    fontWeight: 850
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

  function handleRoutineChange(event: ChangeEvent<HTMLSelectElement>): void {
    const nextRoutineId = event.currentTarget.value;

    setSelectedRoutineId(nextRoutineId);

    if (nextRoutineId) {
      saveSelectedRoutineId(nextRoutineId);
    }
  }

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
        {routines.length > 0 ? (
          <label style={styles.label}>
            Rutina
            <select
              value={selectedRoutineId}
              style={styles.select}
              onChange={handleRoutineChange}
            >
              {routines.map((routine) => (
                <option key={routine.id} value={routine.id}>
                  {routine.title}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p style={styles.emptyText}>
            Todavía no tenés rutinas creadas. Creá tu primera rutina para
            comenzar.
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

        <Link href="/routines/new" style={styles.linkSecondary}>
          Crear rutina
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