// src/components/routine/ExerciseCard.tsx

"use client";

import type { CSSProperties } from "react";
import { useCallback, useEffect, useState } from "react";

import { ExerciseImageCarousel } from "@/components/routine/ExerciseImageCarousel";
import { RestTimer } from "@/components/routine/RestTimer";
import { RoutineStepText } from "@/components/routine/RoutineStepText";
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
    flexDirection: "column",
    gap: "1rem",
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
    gap: "0.35rem"
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
    gap: "1rem"
  },
  title: {
    margin: 0,
    fontSize: "1.6rem",
    lineHeight: 1.1,
    letterSpacing: "-0.055em"
  },
  setPill: {
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
    gap: "1rem"
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
    gap: "0.5rem"
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
      aria-label={`Ejercicio actual. ${stepCounterLabel}. ${progressPercentage}% completado.`}
    >
      <header style={styles.header}>
        <p style={styles.counter}>{stepCounterLabel}</p>

        <div style={styles.titleRow}>
          <h2 style={styles.title}>{step.exercise.title}</h2>

          <span style={styles.setPill}>
            {step.type === "exercise"
              ? `Serie ${step.setNumber}/${step.totalSets}`
              : `Descanso ${step.afterSetNumber}/${step.totalSets}`}
          </span>
        </div>
      </header>

      <div style={styles.content}>
        <ExerciseImageCarousel positions={step.exercise.positions} />

        <RoutineStepText
          step={step}
          restSecondsRemaining={remainingRestSeconds}
        />

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