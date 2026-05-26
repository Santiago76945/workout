// src/components/routines/RoutineItemEditor.tsx

"use client";

import type { CSSProperties } from "react";

import type { DraftRoutineItem } from "@/components/routines/RoutineForm";
import { exercises } from "@/data/exercises";
import type { ExerciseId } from "@/types/exercise";
import type { RoutineTarget } from "@/types/routine";

type RoutineItemEditorProps = {
  item: DraftRoutineItem;
  itemIndex: number;
  totalItems: number;
  onChange: (item: DraftRoutineItem) => void;
  onRemove: (itemId: string) => void;
  onMoveUp: (itemId: string) => void;
  onMoveDown: (itemId: string) => void;
};

const styles = {
  card: {
    display: "grid",
    gap: "0.85rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(255, 255, 255, 0.45)",
    padding: "0.9rem"
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem"
  },
  title: {
    margin: 0,
    fontSize: "0.95rem",
    fontWeight: 950
  },
  orderActions: {
    display: "flex",
    gap: "0.35rem"
  },
  smallButton: {
    minHeight: "2.2rem",
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.62)",
    color: "var(--foreground)",
    padding: "0 0.7rem",
    fontSize: "0.8rem",
    fontWeight: 900
  },
  grid: {
    display: "grid",
    gap: "0.75rem"
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem"
  },
  label: {
    display: "grid",
    gap: "0.4rem",
    color: "var(--muted)",
    fontSize: "0.82rem",
    fontWeight: 850
  },
  input: {
    minHeight: "2.9rem",
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    background: "rgba(255, 255, 255, 0.72)",
    color: "var(--foreground)",
    padding: "0 0.75rem",
    fontSize: "0.95rem",
    fontWeight: 850
  },
  removeButton: {
    minHeight: "2.9rem",
    width: "100%",
    border: "1px solid rgba(180, 35, 24, 0.24)",
    borderRadius: "999px",
    background: "rgba(180, 35, 24, 0.08)",
    color: "var(--danger)",
    fontWeight: 900
  }
} satisfies Record<string, CSSProperties>;

function parseNumberInput(value: number, fallbackValue: number): number {
  if (!Number.isFinite(value)) {
    return fallbackValue;
  }

  return Math.round(value);
}

function parseTargetType(value: string): RoutineTarget["type"] {
  return value === "duration" ? "duration" : "repetitions";
}

function parseExerciseId(value: string): ExerciseId {
  const selectedExercise = exercises.find((exercise) => exercise.id === value);

  return selectedExercise?.id ?? "squats";
}

export function RoutineItemEditor({
  item,
  itemIndex,
  totalItems,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown
}: RoutineItemEditorProps) {
  const isFirstItem = itemIndex === 0;
  const isLastItem = itemIndex === totalItems - 1;

  return (
    <article style={styles.card}>
      <header style={styles.header}>
        <p style={styles.title}>Ejercicio {itemIndex + 1}</p>

        <div style={styles.orderActions}>
          <button
            type="button"
            style={styles.smallButton}
            onClick={() => {
              onMoveUp(item.id);
            }}
            disabled={isFirstItem}
          >
            Subir
          </button>

          <button
            type="button"
            style={styles.smallButton}
            onClick={() => {
              onMoveDown(item.id);
            }}
            disabled={isLastItem}
          >
            Bajar
          </button>
        </div>
      </header>

      <div style={styles.grid}>
        <label style={styles.label}>
          Ejercicio
          <select
            value={item.exerciseId}
            style={styles.input}
            onChange={(event) => {
              onChange({
                ...item,
                exerciseId: parseExerciseId(event.currentTarget.value)
              });
            }}
          >
            {exercises.map((exercise) => (
              <option key={exercise.id} value={exercise.id}>
                {exercise.title}
              </option>
            ))}
          </select>
        </label>

        <div style={styles.twoColumns}>
          <label style={styles.label}>
            Series
            <input
              type="number"
              min={1}
              max={99}
              step={1}
              value={item.sets}
              style={styles.input}
              onChange={(event) => {
                onChange({
                  ...item,
                  sets: parseNumberInput(event.currentTarget.valueAsNumber, 1)
                });
              }}
            />
          </label>

          <label style={styles.label}>
            Tipo de objetivo
            <select
              value={item.targetType}
              style={styles.input}
              onChange={(event) => {
                onChange({
                  ...item,
                  targetType: parseTargetType(event.currentTarget.value)
                });
              }}
            >
              <option value="repetitions">Repeticiones</option>
              <option value="duration">Segundos</option>
            </select>
          </label>
        </div>

        <div style={styles.twoColumns}>
          {item.targetType === "repetitions" ? (
            <label style={styles.label}>
              Repeticiones por serie
              <input
                type="number"
                min={1}
                max={999}
                step={1}
                value={item.repetitions}
                style={styles.input}
                onChange={(event) => {
                  onChange({
                    ...item,
                    repetitions: parseNumberInput(
                      event.currentTarget.valueAsNumber,
                      1
                    )
                  });
                }}
              />
            </label>
          ) : (
            <label style={styles.label}>
              Segundos por serie
              <input
                type="number"
                min={1}
                max={3600}
                step={1}
                value={item.durationSeconds}
                style={styles.input}
                onChange={(event) => {
                  onChange({
                    ...item,
                    durationSeconds: parseNumberInput(
                      event.currentTarget.valueAsNumber,
                      30
                    )
                  });
                }}
              />
            </label>
          )}

          <label style={styles.label}>
            Descanso después de cada serie
            <input
              type="number"
              min={0}
              max={3600}
              step={1}
              value={item.restSecondsBetweenSets}
              style={styles.input}
              onChange={(event) => {
                onChange({
                  ...item,
                  restSecondsBetweenSets: parseNumberInput(
                    event.currentTarget.valueAsNumber,
                    0
                  )
                });
              }}
            />
          </label>
        </div>

        <button
          type="button"
          style={styles.removeButton}
          onClick={() => {
            onRemove(item.id);
          }}
        >
          Eliminar ejercicio
        </button>
      </div>
    </article>
  );
}