// src/components/routines/RoutineImportExportPanel.tsx

"use client";

import type { ChangeEvent, CSSProperties } from "react";
import { useRef, useState } from "react";

import {
  parseRoutineImportPayload,
  stringifyRoutineExportPayload
} from "@/lib/routine/routineSharing";
import { createRoutines } from "@/lib/storage/routineStorage";
import type { Routine } from "@/types/routine";

type RoutineImportExportPanelProps = {
  routines: Routine[];
  onImportComplete: (importedRoutines: Routine[]) => void;
};

const styles = {
  card: {
    display: "grid",
    gap: "1rem",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-xl)",
    background: "var(--surface)",
    padding: "1rem",
    boxShadow: "var(--shadow-soft)"
  },
  header: {
    display: "grid",
    gap: "0.35rem"
  },
  title: {
    margin: 0,
    fontSize: "1.15rem",
    fontWeight: 950,
    letterSpacing: "-0.03em"
  },
  text: {
    margin: 0,
    color: "var(--muted)",
    fontSize: "0.9rem",
    lineHeight: 1.45
  },
  actions: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem"
  },
  button: {
    minHeight: "3rem",
    border: 0,
    borderRadius: "999px",
    background: "var(--primary)",
    color: "var(--primary-foreground)",
    fontWeight: 900
  },
  secondaryButton: {
    minHeight: "3rem",
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.56)",
    color: "var(--foreground)",
    fontWeight: 900
  },
  hiddenInput: {
    display: "none"
  },
  success: {
    margin: 0,
    border: "1px solid rgba(21, 127, 59, 0.24)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(21, 127, 59, 0.08)",
    color: "var(--success)",
    padding: "0.85rem",
    fontSize: "0.9rem",
    fontWeight: 850,
    lineHeight: 1.4
  },
  errorList: {
    display: "grid",
    gap: "0.45rem",
    margin: 0,
    border: "1px solid rgba(180, 35, 24, 0.24)",
    borderRadius: "var(--radius-lg)",
    background: "rgba(180, 35, 24, 0.08)",
    color: "var(--danger)",
    padding: "0.85rem 0.85rem 0.85rem 1.5rem",
    fontSize: "0.88rem",
    fontWeight: 850,
    lineHeight: 1.4
  }
} satisfies Record<string, CSSProperties>;

function createExportFileName(): string {
  const datePart = new Date().toISOString().slice(0, 10);

  return `mis-rutinas-${datePart}.json`;
}

export function RoutineImportExportPanel({
  routines,
  onImportComplete
}: RoutineImportExportPanelProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  function clearMessages(): void {
    setSuccessMessage(null);
    setErrorMessages([]);
  }

  function handleExport(): void {
    clearMessages();

    if (routines.length === 0) {
      setErrorMessages(["No hay rutinas para exportar."]);
      return;
    }

    const jsonContent = stringifyRoutineExportPayload(routines);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = createExportFileName();
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);

    setSuccessMessage("Rutinas exportadas correctamente.");
  }

  function handleImportClick(): void {
    clearMessages();
    fileInputRef.current?.click();
  }

  async function handleImportFile(
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> {
    const inputElement = event.currentTarget;
    const file = inputElement.files?.[0] ?? null;

    clearMessages();

    if (!file) {
      inputElement.value = "";
      return;
    }

    try {
      const fileText = await file.text();
      const parsedValue: unknown = JSON.parse(fileText);
      const parseResult = parseRoutineImportPayload(parsedValue);

      if (!parseResult.ok) {
        setErrorMessages(parseResult.errors);
        return;
      }

      const importedRoutines = createRoutines(parseResult.routines);

      onImportComplete(importedRoutines);
      setSuccessMessage(
        importedRoutines.length === 1
          ? "Se importó 1 rutina correctamente."
          : `Se importaron ${importedRoutines.length} rutinas correctamente.`
      );
    } catch {
      setErrorMessages(["No se pudo leer el archivo JSON."]);
    } finally {
      inputElement.value = "";
    }
  }

  return (
    <section style={styles.card} aria-label="Importar y exportar rutinas">
      <header style={styles.header}>
        <h2 style={styles.title}>Compartir rutinas</h2>
        <p style={styles.text}>
          Exportá tus rutinas como JSON o importá rutinas creadas en otra
          instalación de la app. Solo se aceptan ejercicios existentes en esta
          app.
        </p>
      </header>

      <div style={styles.actions}>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={handleImportClick}
        >
          Importar JSON
        </button>

        <button
          type="button"
          style={styles.button}
          onClick={handleExport}
          disabled={routines.length === 0}
        >
          Exportar JSON
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        style={styles.hiddenInput}
        onChange={(event) => {
          void handleImportFile(event);
        }}
      />

      {successMessage ? <p style={styles.success}>{successMessage}</p> : null}

      {errorMessages.length > 0 ? (
        <ul style={styles.errorList}>
          {errorMessages.map((errorMessage) => (
            <li key={errorMessage}>{errorMessage}</li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}