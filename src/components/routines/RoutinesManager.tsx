// src/components/routines/RoutinesManager.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";

import { RoutineImportExportPanel } from "@/components/routines/RoutineImportExportPanel";
import { formatRoutineEstimatedDuration } from "@/lib/routine/estimateRoutineDuration";
import {
  deleteRoutine,
  getSelectedRoutineId,
  getUserRoutines,
  saveSelectedRoutineId
} from "@/lib/storage/routineStorage";
import type { Routine } from "@/types/routine";

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
  introCard: {
    display: "grid",
    gap: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)"
  },
  introTitle: {
    margin: 0,
    fontSize: "1.25rem",
    fontWeight: 950,
    letterSpacing: "-0.03em"
  },
  introText: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.95rem",
    lineHeight: 1.45
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "3.3rem",
    width: "100%",
    border: 0,
    borderRadius: "999px",
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    fontWeight: 900
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "3.2rem",
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.56)",
    color: "var(--foreground)",
    fontWeight: 900
  },
  routinesList: {
    display: "grid",
    gap: "0.85rem"
  },
  routineCard: {
    display: "grid",
    gap: "0.8rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)"
  },
  routineCardSelected: {
    borderColor: "rgba(31, 31, 31, 0.42)",
    background: "var(--surface-strong)"
  },
  routineSelectButton: {
    display: "grid",
    gap: "0.6rem",
    width: "100%",
    border: 0,
    background: "transparent",
    color: "inherit",
    padding: 0,
    textAlign: "left"
  },
  routineHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem"
  },
  routineTitle: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    fontSize: "1.2rem",
    fontWeight: 950,
    letterSpacing: "-0.035em"
  },
  selectedPill: {
    flexShrink: 0,
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.7)",
    padding: "0.35rem 0.6rem",
    fontSize: "0.74rem",
    fontWeight: 900
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "0.55rem"
  },
  metaItem: {
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.42)",
    padding: "0.7rem"
  },
  metaValue: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 950
  },
  metaLabel: {
    margin: "0.2rem 0 0",
    color: "var(--muted)",
    fontSize: "0.74rem",
    fontWeight: 800,
    lineHeight: 1.2
  },
  routineActions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem"
  },
  dangerButton: {
    minHeight: "3rem",
    width: "100%",
    border: "1px solid rgba(180, 35, 24, 0.24)",
    borderRadius: "999px",
    background: "rgba(180, 35, 24, 0.08)",
    color: "var(--danger)",
    fontWeight: 900
  },
  emptyCard: {
    display: "grid",
    gap: "1rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)",
    textAlign: "center"
  },
  emptyTitle: {
    margin: 0,
    fontSize: "1.45rem",
    letterSpacing: "-0.04em"
  },
  emptyText: {
    margin: 0,
    color: "var(--muted)",
    lineHeight: 1.45
  }
} satisfies Record<string, CSSProperties>;

function getRoutineTotalSets(routine: Routine): number {
  return routine.items.reduce((totalSets, item) => totalSets + item.sets, 0);
}

export function RoutinesManager() {
  const router = useRouter();

  const [routines, setRoutines] = useState<Routine[]>([]);
  const [selectedRoutineId, setSelectedRoutineId] = useState("");

  const selectedRoutine = useMemo(
    () => routines.find((routine) => routine.id === selectedRoutineId) ?? null,
    [routines, selectedRoutineId]
  );

  function syncRoutinesFromStorage(): void {
    const storedRoutines = getUserRoutines();
    const storedSelectedRoutineId = getSelectedRoutineId();

    const selectedRoutineFromStorage =
      storedRoutines.find(
        (routine) => routine.id === storedSelectedRoutineId
      ) ??
      storedRoutines[0] ??
      null;

    setRoutines(storedRoutines);
    setSelectedRoutineId(selectedRoutineFromStorage?.id ?? "");

    if (selectedRoutineFromStorage) {
      saveSelectedRoutineId(selectedRoutineFromStorage.id);
    }
  }

  useEffect(() => {
    const storedRoutines = getUserRoutines();
    const storedSelectedRoutineId = getSelectedRoutineId();

    const selectedRoutineFromStorage =
      storedRoutines.find(
        (routine) => routine.id === storedSelectedRoutineId
      ) ??
      storedRoutines[0] ??
      null;

    setRoutines(storedRoutines);
    setSelectedRoutineId(selectedRoutineFromStorage?.id ?? "");

    if (selectedRoutineFromStorage) {
      saveSelectedRoutineId(selectedRoutineFromStorage.id);
    }
  }, []);

  function handleSelectRoutine(routineId: string): void {
    setSelectedRoutineId(routineId);
    saveSelectedRoutineId(routineId);
  }

  function handleStartRoutine(routineId: string): void {
    saveSelectedRoutineId(routineId);
    router.push("/routine");
  }

  function handleStartSelectedRoutine(): void {
    if (!selectedRoutine) {
      return;
    }

    handleStartRoutine(selectedRoutine.id);
  }

  function handleDeleteRoutine(routine: Routine): void {
    const confirmed = window.confirm(
      `¿Seguro que querés eliminar la rutina "${routine.title}"?`
    );

    if (!confirmed) {
      return;
    }

    deleteRoutine(routine.id);
    syncRoutinesFromStorage();
  }

  function handleImportComplete(importedRoutines: Routine[]): void {
    if (importedRoutines.length === 0) {
      return;
    }

    syncRoutinesFromStorage();
  }

  return (
    <main style={styles.wrapper}>
      <header style={styles.topBar}>
        <Link href="/" style={styles.backLink}>
          Volver
        </Link>

        <h1 style={styles.title}>Mis rutinas</h1>
      </header>

      <section style={styles.introCard}>
        <h2 style={styles.introTitle}>Rutinas guardadas</h2>
        <p style={styles.introText}>
          Elegí una rutina para usarla como rutina actual, empezá a entrenar o
          creá una nueva.
        </p>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={handleStartSelectedRoutine}
          disabled={!selectedRoutine}
        >
          Comenzar rutina seleccionada
        </button>

        <Link href="/routines/new" style={styles.secondaryButton}>
          Crear nueva rutina
        </Link>
      </section>

      {routines.length > 0 ? (
        <section style={styles.routinesList} aria-label="Lista de rutinas">
          {routines.map((routine) => {
            const isSelected = routine.id === selectedRoutineId;

            return (
              <article
                key={routine.id}
                style={{
                  ...styles.routineCard,
                  ...(isSelected ? styles.routineCardSelected : {})
                }}
              >
                <button
                  type="button"
                  style={styles.routineSelectButton}
                  onClick={() => {
                    handleSelectRoutine(routine.id);
                  }}
                >
                  <div style={styles.routineHeader}>
                    <h2 style={styles.routineTitle}>{routine.title}</h2>

                    {isSelected ? (
                      <span style={styles.selectedPill}>Seleccionada</span>
                    ) : null}
                  </div>

                  <div style={styles.metaGrid}>
                    <article style={styles.metaItem}>
                      <p style={styles.metaValue}>{routine.items.length}</p>
                      <p style={styles.metaLabel}>ejercicios</p>
                    </article>

                    <article style={styles.metaItem}>
                      <p style={styles.metaValue}>
                        {getRoutineTotalSets(routine)}
                      </p>
                      <p style={styles.metaLabel}>series</p>
                    </article>

                    <article style={styles.metaItem}>
                      <p style={styles.metaValue}>
                        {formatRoutineEstimatedDuration(routine)}
                      </p>
                      <p style={styles.metaLabel}>duración aprox.</p>
                    </article>
                  </div>
                </button>

                <div style={styles.routineActions}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => {
                      handleStartRoutine(routine.id);
                    }}
                  >
                    Empezar
                  </button>

                  <button
                    type="button"
                    style={styles.dangerButton}
                    onClick={() => {
                      handleDeleteRoutine(routine);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <section style={styles.emptyCard}>
          <h2 style={styles.emptyTitle}>Todavía no tenés rutinas</h2>
          <p style={styles.emptyText}>
            Creá tu primera rutina o importá un JSON compartido por otra persona
            que también use esta app.
          </p>

          <Link href="/routines/new" style={styles.primaryButton}>
            Crear rutina
          </Link>
        </section>
      )}

      <RoutineImportExportPanel
        routines={routines}
        onImportComplete={handleImportComplete}
      />
    </main>
  );
}