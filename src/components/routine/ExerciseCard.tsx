// src/components/routine/ExerciseCard.tsx

"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";

import { ExerciseImageCarousel } from "@/components/routine/ExerciseImageCarousel";
import { RestTimer } from "@/components/routine/RestTimer";
import { formatRoutineTarget } from "@/lib/routine/formatRoutineTarget";
import type { RoutineStep } from "@/types/routine";

type ExerciseCardProps = {
  step: RoutineStep;
  stepCounterLabel: string;
  progressPercentage: number;
  isFlipping: boolean;
  onConfirm: () => void;
};

const styles = {
  card: {
    display: "flex",
    maxHeight: "80vh",
    minHeight: "80vh",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
    flexDirection: "column",
    gap: "1rem",
    overflowX: "hidden",
    overflowY: "auto",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)",
    transformStyle: "preserve-3d",
    transition: "transform 260ms ease, opacity 260ms ease"
  },
  cardFlipping: {
    transform: "rotateY(88deg) scale(0.98)",
    opacity: 0.7
  },
  header: {
    display: "grid",
    gap: "0.35rem",
    minWidth: 0
  },
  counter: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.78rem",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  titleRow: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "1rem",
    minWidth: 0
  },
  title: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    fontSize: "1.6rem",
    lineHeight: 1.1,
    letterSpacing: "-0.055em"
  },
  stepPill: {
    flexShrink: 0,
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.56)",
    padding: "0.45rem 0.7rem",
    fontSize: "0.78rem",
    fontWeight: 900
  },
  content: {
    display: "grid",
    gap: "1rem",
    minWidth: 0
  },
  targetBox: {
    display: "grid",
    gap: "0.25rem",
    minWidth: 0,
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.48)",
    padding: "0.85rem"
  },
  targetLabel: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.75rem",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  targetText: {
    margin: 0,
    minWidth: 0,
    overflowWrap: "anywhere",
    fontSize: "1.05rem",
    fontWeight: 900,
    lineHeight: 1.25
  },
  button: {
    minHeight: "3.4rem",
    width: "100%",
    border: 0,
    borderRadius: "999px",
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    fontSize: "1rem",
    fontWeight: 900
  },
  timerArea: {
    display: "grid",
    justifyItems: "center",
    gap: "0.5rem",
    minWidth: 0
  }
} satisfies Record<string, CSSProperties>;

export function ExerciseCard({
  step,
  stepCounterLabel,
  progressPercentage,
  isFlipping,
  onConfirm
}: ExerciseCardProps) {
  const [remainingRestSeconds, setRemainingRestSeconds] = useState(
    step.type === "rest" ? step.durationSeconds : 0
  );
  const [isRestComplete, setIsRestComplete] = useState(step.type !== "rest");

  useEffect(() => {
    if (step.type === "rest") {
      setRemainingRestSeconds(step.durationSeconds);
      setIsRestComplete(false);
      return;
    }

    setRemainingRestSeconds(0);
    setIsRestComplete(true);
  }, [step]);

  const handleRestComplete = useCallback(() => {
    setIsRestComplete(true);
  }, []);

  const isRestStep = step.type === "rest";
  const isConfirmDisabled = isFlipping || (isRestStep && !isRestComplete);

  const exerciseCounterLabel =
    step.type === "exercise"
      ? `Ejercicio ${step.exerciseStepNumber}/${step.totalExerciseSteps}`
      : `Ejercicio ${step.afterExerciseStepNumber}/${step.totalExerciseSteps}`;

  const setCounterLabel =
    step.type === "exercise"
      ? `Serie ${step.setNumber}/${step.totalSets}`
      : `Descanso ${step.afterSetNumber}/${step.totalSets}`;

  const targetLabel =
    step.type === "exercise" ? "Objetivo por serie" : "Descanso";

  const targetText =
    step.type === "exercise"
      ? formatRoutineTarget(step.target)
      : `${remainingRestSeconds} segundos`;

  const buttonLabel = isFlipping
    ? "Cambiando ejercicio..."
    : isRestStep
      ? isRestComplete
        ? "Confirmar descanso"
        : "Esperá a que termine el descanso"
      : "Confirmar serie";

  return (
    <section
      style={{
        ...styles.card,
        ...(isFlipping ? styles.cardFlipping : {})
      }}
      aria-label={`Paso actual. ${stepCounterLabel}. ${progressPercentage}% completado.`}
    >
      <header style={styles.header}>
        <p style={styles.counter}>{stepCounterLabel}</p>

        <div style={styles.titleRow}>
          <h2 style={styles.title}>{step.exercise.title}</h2>

          <span style={styles.stepPill}>{exerciseCounterLabel}</span>
        </div>

        <p style={styles.counter}>{setCounterLabel}</p>
      </header>

      <div style={styles.content}>
        <ExerciseImageCarousel positions={step.exercise.positions} />

        <section style={styles.targetBox}>
          <p style={styles.targetLabel}>{targetLabel}</p>
          <p style={styles.targetText}>{targetText}</p>
        </section>

        {isRestStep ? (
          <div style={styles.timerArea}>
            <RestTimer
              key={step.id}
              durationSeconds={step.durationSeconds}
              onTick={setRemainingRestSeconds}
              onComplete={handleRestComplete}
            />
          </div>
        ) : null}

        <button
          type="button"
          style={styles.button}
          onClick={onConfirm}
          disabled={isConfirmDisabled}
        >
          {buttonLabel}
        </button>
      </div>
    </section>
  );
}