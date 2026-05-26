// src/components/routine/RoutinePlayer.tsx

"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ExerciseCard } from "@/components/routine/ExerciseCard";
import { RoutineComplete } from "@/components/routine/RoutineComplete";
import { buildRoutineSteps } from "@/lib/routine/buildRoutineSteps";
import {
  getCurrentRoutineStep,
  getNextRoutineStep,
  getRoutineProgressPercentage,
  getStepCounterLabel,
  isLastStep,
  isRoutineComplete,
  shouldFlipExerciseCard
} from "@/lib/routine/routineProgress";
import {
  clearSelectedRoutineId,
  getSelectedRoutine
} from "@/lib/storage/routineStorage";
import { registerCompletedTrainingSession } from "@/lib/storage/trainingStatsStorage";
import type { Routine } from "@/types/routine";

const styles = {
  wrapper: {
    display: "grid",
    alignContent: "center",
    gap: "1rem",
    minHeight: "100vh",
    width: "100%",
    maxWidth: "100%",
    overflowX: "hidden"
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    minWidth: 0
  },
  backLink: {
    flexShrink: 0,
    color: "var(--muted)",
    fontSize: "0.9rem",
    fontWeight: 800
  },
  title: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    fontSize: "1.35rem",
    letterSpacing: "-0.04em",
    textAlign: "right"
  },
  progressOuter: {
    overflow: "hidden",
    height: "0.6rem",
    width: "100%",
    maxWidth: "100%",
    borderRadius: "999px",
    background: "rgba(31, 31, 31, 0.1)"
  },
  progressInner: {
    height: "100%",
    borderRadius: "999px",
    background: "var(--primary)",
    transition: "width 180ms ease"
  },
  emptyCard: {
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
  emptyTitle: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    fontSize: "1.7rem",
    letterSpacing: "-0.05em"
  },
  emptyText: {
    margin: 0,
    color: "var(--muted)",
    lineHeight: 1.5
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
  },
  secondaryLink: {
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

export function RoutinePlayer() {
  const timeoutRef = useRef<number | null>(null);
  const hasRegisteredCompletionRef = useRef(false);

  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [hasLoadedRoutine, setHasLoadedRoutine] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const steps = useMemo(
    () => (selectedRoutine ? buildRoutineSteps(selectedRoutine) : []),
    [selectedRoutine]
  );

  const currentStep = getCurrentRoutineStep(steps, currentStepIndex);
  const progressPercentage = getRoutineProgressPercentage(
    steps,
    currentStepIndex
  );
  const stepCounterLabel = getStepCounterLabel(steps, currentStepIndex);

  useEffect(() => {
    const routine = getSelectedRoutine();

    if (!routine) {
      clearSelectedRoutineId();
    }

    setSelectedRoutine(routine);
    setHasLoadedRoutine(true);
  }, []);

  useEffect(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    hasRegisteredCompletionRef.current = false;
    setCurrentStepIndex(0);
    setIsComplete(false);
    setIsFlipping(false);
  }, [selectedRoutine?.id]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function completeRoutine(): void {
    if (!selectedRoutine || hasRegisteredCompletionRef.current) {
      return;
    }

    hasRegisteredCompletionRef.current = true;

    registerCompletedTrainingSession({
      routineId: selectedRoutine.id,
      routineTitle: selectedRoutine.title
    });

    setCurrentStepIndex(steps.length);
    setIsComplete(true);
  }

  function moveToStep(nextStepIndex: number): void {
    setCurrentStepIndex(nextStepIndex);
  }

  function handleConfirmStep(): void {
    if (
      isComplete ||
      isFlipping ||
      isRoutineComplete(steps, currentStepIndex)
    ) {
      return;
    }

    if (isLastStep(steps, currentStepIndex)) {
      completeRoutine();
      return;
    }

    const nextStepIndex = currentStepIndex + 1;
    const nextStep = getNextRoutineStep(steps, currentStepIndex);
    const shouldFlip = shouldFlipExerciseCard(currentStep, nextStep);

    if (!shouldFlip) {
      moveToStep(nextStepIndex);
      return;
    }

    setIsFlipping(true);

    timeoutRef.current = window.setTimeout(() => {
      moveToStep(nextStepIndex);
      setIsFlipping(false);
    }, 260);
  }

  function handleRestartRoutine(): void {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    hasRegisteredCompletionRef.current = false;
    setCurrentStepIndex(0);
    setIsComplete(false);
    setIsFlipping(false);
  }

  if (!hasLoadedRoutine) {
    return (
      <main style={styles.wrapper}>
        <section style={styles.emptyCard}>
          <h1 style={styles.emptyTitle}>Cargando rutina</h1>
          <p style={styles.emptyText}>Preparando tu entrenamiento.</p>
        </section>
      </main>
    );
  }

  if (!selectedRoutine) {
    return (
      <main style={styles.wrapper}>
        <section style={styles.emptyCard}>
          <h1 style={styles.emptyTitle}>No hay rutina seleccionada</h1>
          <p style={styles.emptyText}>
            Elegí una rutina desde Mis rutinas o creá una nueva para comenzar.
          </p>

          <Link href="/routines/new" style={styles.linkButton}>
            Crear rutina
          </Link>

          <Link href="/routines" style={styles.secondaryLink}>
            Ir a Mis rutinas
          </Link>

          <Link href="/" style={styles.secondaryLink}>
            Volver al menú
          </Link>
        </section>
      </main>
    );
  }

  if (steps.length === 0) {
    return (
      <main style={styles.wrapper}>
        <section style={styles.emptyCard}>
          <h1 style={styles.emptyTitle}>Rutina vacía</h1>
          <p style={styles.emptyText}>
            Esta rutina no tiene ejercicios. Creá una rutina nueva con al menos
            un ejercicio.
          </p>

          <Link href="/routines/new" style={styles.linkButton}>
            Crear rutina
          </Link>

          <Link href="/routines" style={styles.secondaryLink}>
            Ir a Mis rutinas
          </Link>

          <Link href="/" style={styles.secondaryLink}>
            Volver al menú
          </Link>
        </section>
      </main>
    );
  }

  if (isComplete || !currentStep) {
    return (
      <main style={styles.wrapper}>
        <RoutineComplete onRestart={handleRestartRoutine} />
      </main>
    );
  }

  return (
    <main style={styles.wrapper}>
      <header style={styles.topBar}>
        <Link href="/routines" style={styles.backLink}>
          Volver
        </Link>

        <h1 style={styles.title}>{selectedRoutine.title}</h1>
      </header>

      <div
        style={styles.progressOuter}
        aria-label={`Progreso ${progressPercentage}%`}
      >
        <div
          style={{
            ...styles.progressInner,
            width: `${progressPercentage}%`
          }}
        />
      </div>

      <ExerciseCard
        step={currentStep}
        stepCounterLabel={stepCounterLabel}
        progressPercentage={progressPercentage}
        isFlipping={isFlipping}
        onConfirm={handleConfirmStep}
      />
    </main>
  );
}