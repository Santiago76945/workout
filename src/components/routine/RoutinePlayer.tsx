// src/components/routine/RoutinePlayer.tsx

"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { ExerciseCard } from "@/components/routine/ExerciseCard";
import { RoutineComplete } from "@/components/routine/RoutineComplete";
import { defaultRoutine } from "@/data/routines";
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
import { registerCompletedTrainingSession } from "@/lib/storage/trainingStatsStorage";

const styles = {
  wrapper: {
    display: "grid",
    alignContent: "center",
    gap: "1rem",
    minHeight: "100vh"
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
    fontSize: "1.35rem",
    letterSpacing: "-0.04em"
  },
  progressOuter: {
    overflow: "hidden",
    height: "0.6rem",
    borderRadius: "999px",
    background: "rgba(31, 31, 31, 0.1)"
  },
  progressInner: {
    height: "100%",
    borderRadius: "999px",
    background: "var(--primary)",
    transition: "width 180ms ease"
  }
} satisfies Record<string, CSSProperties>;

export function RoutinePlayer() {
  const steps = useMemo(() => buildRoutineSteps(defaultRoutine), []);
  const timeoutRef = useRef<number | null>(null);
  const hasRegisteredCompletionRef = useRef(false);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = getCurrentRoutineStep(steps, currentStepIndex);
  const progressPercentage = getRoutineProgressPercentage(
    steps,
    currentStepIndex
  );
  const stepCounterLabel = getStepCounterLabel(steps, currentStepIndex);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function completeRoutine(): void {
    if (hasRegisteredCompletionRef.current) {
      return;
    }

    hasRegisteredCompletionRef.current = true;

    registerCompletedTrainingSession({
      routineId: defaultRoutine.id,
      routineTitle: defaultRoutine.title
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
        <Link href="/" style={styles.backLink}>
          Volver
        </Link>

        <h1 style={styles.title}>{defaultRoutine.title}</h1>
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