// src/components/routine/RoutineStepText.tsx

import type { CSSProperties } from "react";

import {
  getRoutineExerciseInstruction,
  getRoutineRestInstruction
} from "@/lib/routine/formatRoutineTarget";
import type { RoutineStep } from "@/types/routine";

type RoutineStepTextProps = {
  step: RoutineStep;
  restSecondsRemaining: number;
};

const styles = {
  box: {
    display: "grid",
    gap: "0.35rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.48)",
    padding: "0.9rem"
  },
  label: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.78rem",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  },
  text: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 850,
    lineHeight: 1.35
  }
} satisfies Record<string, CSSProperties>;

export function RoutineStepText({
  step,
  restSecondsRemaining
}: RoutineStepTextProps) {
  const instruction =
    step.type === "exercise"
      ? getRoutineExerciseInstruction(step)
      : getRoutineRestInstruction(restSecondsRemaining);

  return (
    <section style={styles.box}>
      <p style={styles.label}>
        {step.type === "exercise" ? "Ejercicio" : "Descanso"}
      </p>
      <p style={styles.text}>{instruction}</p>
    </section>
  );
}