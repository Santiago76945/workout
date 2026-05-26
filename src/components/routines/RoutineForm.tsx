// src/components/routines/RoutineForm.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";

import { RoutineItemEditor } from "@/components/routines/RoutineItemEditor";
import { exercises } from "@/data/exercises";
import { createRoutine } from "@/lib/storage/routineStorage";
import type { ExerciseId } from "@/types/exercise";
import type { CreateRoutineItemInput, RoutineTarget } from "@/types/routine";

type DraftRoutineItem = {
  id: string;
  exerciseId: ExerciseId;
  sets: number;
  targetType: RoutineTarget["type"];
  repetitions: number;
  durationSeconds: number;
  restSecondsBetweenSets: number;
};

const fallbackExerciseId: ExerciseId = "squats";

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
  form: {
    display: "grid",
    gap: "1rem"
  },
  card: {
    display: "grid",
    gap: "1rem",
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
  input: {
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
  helperText: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.9rem",
    lineHeight: 1.45
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem"
  },
  sectionTitle: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: 950,
    letterSpacing: "-0.03em"
  },
  itemsList: {
    display: "grid",
    gap: "0.85rem"
  },
  emptyState: {
    margin: 0,
    border: "1px dashed var(--border)",
    borderRadius: "var(--radius-lg)",
    color: "var(--muted)",
    padding: "1rem",
    textAlign: "center",
    lineHeight: 1.45
  },
  error: {
    margin: 0,
    border: "1px solid rgba(180, 35, 24, 0.24)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(180, 35, 24, 0.08)",
    color: "var(--danger)",
    padding: "0.85rem",
    fontSize: "0.9rem",
    fontWeight: 850,
    lineHeight: 1.4
  },
  button: {
    minHeight: "3.3rem",
    border: 0,
    borderRadius: "999px",
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    fontWeight: 900
  },
  secondaryButton: {
    minHeight: "3.1rem",
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.56)",
    color: "var(--foreground)",
    fontWeight: 900
  },
  actions: {
    display: "grid",
    gap: "0.75rem"
  }
} satisfies Record<string, CSSProperties>;

function createDraftItemId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `draft-routine-item-${crypto.randomUUID()}`;
  }

  return `draft-routine-item-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getDefaultExerciseId(): ExerciseId {
  return exercises[0]?.id ?? fallbackExerciseId;
}

function createDraftRoutineItem(): DraftRoutineItem {
  return {
    id: createDraftItemId(),
    exerciseId: getDefaultExerciseId(),
    sets: 3,
    targetType: "repetitions",
    repetitions: 10,
    durationSeconds: 30,
    restSecondsBetweenSets: 60
  };
}

function buildCreateRoutineItemsInput(
  items: DraftRoutineItem[]
): CreateRoutineItemInput[] {
  return items.map((item): CreateRoutineItemInput => {
    if (item.targetType === "duration") {
      return {
        exerciseId: item.exerciseId,
        sets: item.sets,
        target: {
          type: "duration",
          seconds: item.durationSeconds
        },
        restSecondsBetweenSets: item.restSecondsBetweenSets
      };
    }

    return {
      exerciseId: item.exerciseId,
      sets: item.sets,
      target: {
        type: "repetitions",
        repetitions: item.repetitions,
        unitLabel: "repeticiones"
      },
      restSecondsBetweenSets: item.restSecondsBetweenSets
    };
  });
}

export function RoutineForm() {
  const router = useRouter();

  const [title, setTitle] = useState("Mi rutina");
  const [items, setItems] = useState<DraftRoutineItem[]>(() => [
    createDraftRoutineItem()
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleAddItem(): void {
    setItems((currentItems) => [...currentItems, createDraftRoutineItem()]);
    setErrorMessage(null);
  }

  function handleUpdateItem(updatedItem: DraftRoutineItem): void {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      )
    );
    setErrorMessage(null);
  }

  function handleRemoveItem(itemId: string): void {
    setItems((currentItems) =>
      currentItems.filter((item) => item.id !== itemId)
    );
  }

  function handleMoveItemUp(itemId: string): void {
    setItems((currentItems) => {
      const itemIndex = currentItems.findIndex((item) => item.id === itemId);

      if (itemIndex <= 0) {
        return currentItems;
      }

      const nextItems = [...currentItems];
      const previousItem = nextItems[itemIndex - 1];
      const currentItem = nextItems[itemIndex];

      if (!previousItem || !currentItem) {
        return currentItems;
      }

      nextItems[itemIndex - 1] = currentItem;
      nextItems[itemIndex] = previousItem;

      return nextItems;
    });
  }

  function handleMoveItemDown(itemId: string): void {
    setItems((currentItems) => {
      const itemIndex = currentItems.findIndex((item) => item.id === itemId);

      if (itemIndex < 0 || itemIndex >= currentItems.length - 1) {
        return currentItems;
      }

      const nextItems = [...currentItems];
      const currentItem = nextItems[itemIndex];
      const nextItem = nextItems[itemIndex + 1];

      if (!currentItem || !nextItem) {
        return currentItems;
      }

      nextItems[itemIndex] = nextItem;
      nextItems[itemIndex + 1] = currentItem;

      return nextItems;
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (normalizedTitle.length === 0) {
      setErrorMessage("La rutina necesita un nombre.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("La rutina necesita al menos un ejercicio.");
      return;
    }

    createRoutine({
      title: normalizedTitle,
      items: buildCreateRoutineItemsInput(items)
    });

    router.push("/");
  }

  return (
    <main style={styles.wrapper}>
      <header style={styles.topBar}>
        <Link href="/" style={styles.backLink}>
          Volver
        </Link>

        <h1 style={styles.title}>Crear rutina</h1>
      </header>

      <form style={styles.form} onSubmit={handleSubmit}>
        <section style={styles.card}>
          <label style={styles.label}>
            Nombre de la rutina
            <input
              type="text"
              value={title}
              style={styles.input}
              maxLength={80}
              onChange={(event) => {
                setTitle(event.currentTarget.value);
                setErrorMessage(null);
              }}
            />
          </label>

          <p style={styles.helperText}>
            Elegí los ejercicios, definí series, repeticiones o segundos por
            serie, y configurá el descanso después de cada serie.
          </p>
        </section>

        <section style={styles.card} aria-label="Ejercicios de la rutina">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Ejercicios</h2>

            <button
              type="button"
              style={styles.secondaryButton}
              onClick={handleAddItem}
            >
              Agregar
            </button>
          </div>

          {items.length > 0 ? (
            <div style={styles.itemsList}>
              {items.map((item, index) => (
                <RoutineItemEditor
                  key={item.id}
                  item={item}
                  itemIndex={index}
                  totalItems={items.length}
                  onChange={handleUpdateItem}
                  onRemove={handleRemoveItem}
                  onMoveUp={handleMoveItemUp}
                  onMoveDown={handleMoveItemDown}
                />
              ))}
            </div>
          ) : (
            <p style={styles.emptyState}>
              Todavía no agregaste ejercicios a esta rutina.
            </p>
          )}
        </section>

        {errorMessage ? <p style={styles.error}>{errorMessage}</p> : null}

        <section style={styles.actions}>
          <button type="submit" style={styles.button}>
            Crear rutina
          </button>

          <button
            type="button"
            style={styles.secondaryButton}
            onClick={handleAddItem}
          >
            Agregar otro ejercicio
          </button>
        </section>
      </form>
    </main>
  );
}

export type { DraftRoutineItem };