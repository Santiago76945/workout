// scripts/create-exercise-app-skeleton.mjs

import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = process.cwd();

const files = {
    "src/app/layout.tsx": `import type { ReactNode } from "react";

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
`,

    "src/app/page.tsx": `import { MainMenu } from "@/components/menu/MainMenu";

export default function HomePage() {
  return <MainMenu />;
}
`,

    "src/app/routine/page.tsx": `import { RoutinePlayer } from "@/components/routine/RoutinePlayer";

export default function RoutinePage() {
  return <RoutinePlayer />;
}
`,

    "src/app/stats/page.tsx": `import { StatsDashboard } from "@/components/stats/StatsDashboard";

export default function StatsPage() {
  return <StatsDashboard />;
}
`,

    "src/app/goals/page.tsx": `import { GoalSettings } from "@/components/goals/GoalSettings";

export default function GoalsPage() {
  return <GoalSettings />;
}
`,

    "src/components/menu/MainMenu.tsx": `"use client";

import Link from "next/link";

export function MainMenu() {
  return (
    <main>
      <h1>App de ejercicios</h1>

      <nav>
        <Link href="/routine">Comenzar rutina</Link>
        <Link href="/stats">Ver estadísticas</Link>
        <Link href="/goals">Establecer objetivo</Link>
      </nav>
    </main>
  );
}
`,

    "src/components/routine/RoutinePlayer.tsx": `"use client";

export function RoutinePlayer() {
  return (
    <main>
      <h1>Modo rutina</h1>
    </main>
  );
}
`,

    "src/components/routine/ExerciseCard.tsx": `"use client";

export function ExerciseCard() {
  return (
    <section>
      <h2>Exercise card</h2>
    </section>
  );
}
`,

    "src/components/routine/ExerciseImageCarousel.tsx": `"use client";

export function ExerciseImageCarousel() {
  return (
    <div>
      Exercise image carousel
    </div>
  );
}
`,

    "src/components/routine/RoutineStepText.tsx": `"use client";

export function RoutineStepText() {
  return <p>Paso actual</p>;
}
`,

    "src/components/routine/RestTimer.tsx": `"use client";

export function RestTimer() {
  return <span>90</span>;
}
`,

    "src/components/routine/RoutineComplete.tsx": `"use client";

export function RoutineComplete() {
  return (
    <section>
      <h2>Rutina completada</h2>
    </section>
  );
}
`,

    "src/components/stats/StatsDashboard.tsx": `"use client";

export function StatsDashboard() {
  return (
    <main>
      <h1>Estadísticas</h1>
    </main>
  );
}
`,

    "src/components/goals/GoalSettings.tsx": `"use client";

export function GoalSettings() {
  return (
    <main>
      <h1>Objetivo semanal</h1>
    </main>
  );
}
`,

    "src/data/exercises.ts": `import type { Exercise } from "@/types/exercise";

export const exercises: Exercise[] = [];
`,

    "src/data/defaultRoutine.ts": `import type { Routine } from "@/types/routine";

export const defaultRoutine: Routine = {
  id: "default-routine",
  title: "Rutina principal",
  items: [],
};
`,

    "src/lib/routine/buildRoutineSteps.ts": `import type { Routine, RoutineStep } from "@/types/routine";

export function buildRoutineSteps(routine: Routine): RoutineStep[] {
  void routine;

  return [];
}
`,

    "src/lib/routine/routineProgress.ts": `import type { RoutineStep } from "@/types/routine";

export function getCurrentRoutineStep(
  steps: RoutineStep[],
  currentStepIndex: number,
): RoutineStep | null {
  return steps[currentStepIndex] ?? null;
}

export function isRoutineComplete(
  steps: RoutineStep[],
  currentStepIndex: number,
): boolean {
  return currentStepIndex >= steps.length;
}
`,

    "src/lib/storage/localStorageKeys.ts": `export const localStorageKeys = {
  trainingStats: "training_stats",
  weeklyGoal: "weekly_goal",
  routineProgress: "routine_progress",
} as const;
`,

    "src/lib/storage/trainingStatsStorage.ts": `import type { TrainingStats } from "@/types/stats";
import { localStorageKeys } from "@/lib/storage/localStorageKeys";

export function getTrainingStats(): TrainingStats {
  if (typeof window === "undefined") {
    return { completedTrainingDates: [] };
  }

  const rawValue = window.localStorage.getItem(localStorageKeys.trainingStats);

  if (!rawValue) {
    return { completedTrainingDates: [] };
  }

  try {
    return JSON.parse(rawValue) as TrainingStats;
  } catch {
    return { completedTrainingDates: [] };
  }
}

export function saveTrainingStats(stats: TrainingStats): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    localStorageKeys.trainingStats,
    JSON.stringify(stats),
  );
}
`,

    "src/lib/storage/goalStorage.ts": `import { localStorageKeys } from "@/lib/storage/localStorageKeys";

export function getWeeklyGoal(): number {
  if (typeof window === "undefined") {
    return 3;
  }

  const rawValue = window.localStorage.getItem(localStorageKeys.weeklyGoal);
  const parsedValue = Number(rawValue);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return 3;
  }

  return parsedValue;
}

export function saveWeeklyGoal(goal: number): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(localStorageKeys.weeklyGoal, String(goal));
}
`,

    "src/lib/images/resolveExerciseImage.ts": `const fallbackImagePath = "/exercises/fallback.png";

export function resolveExerciseImage(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return fallbackImagePath;
  }

  return imagePath;
}

export function getFallbackExerciseImage(): string {
  return fallbackImagePath;
}
`,

    "src/types/exercise.ts": `export type ExercisePosition = {
  id: string;
  title: string;
  description: string[];
  imagePath: string;
};

export type Exercise = {
  id: string;
  title: string;
  displayName: string;
  positions: ExercisePosition[];
};
`,

    "src/types/routine.ts": `export type RoutineItem = {
  exerciseId: string;
  sets: number;
  reps?: number;
  durationSeconds?: number;
  restSeconds: number;
};

export type Routine = {
  id: string;
  title: string;
  items: RoutineItem[];
};

export type RoutineExerciseStep = {
  id: string;
  type: "exercise";
  exerciseId: string;
  setNumber: number;
  totalSets: number;
  reps?: number;
  durationSeconds?: number;
};

export type RoutineRestStep = {
  id: string;
  type: "rest";
  exerciseId: string;
  durationSeconds: number;
  afterSetNumber: number;
};

export type RoutineStep = RoutineExerciseStep | RoutineRestStep;
`,

    "src/types/stats.ts": `export type TrainingStats = {
  completedTrainingDates: string[];
};
`,
};

const fallbackPngBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAQAAADlKx2tAAABJklEQVR42u3SAQ0AAAgDINc/9K3hHBQgkLQzuwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1AAGLAAF7YlhcAAAAAElFTkSuQmCC";

async function pathExists(path) {
    try {
        await access(path);
        return true;
    } catch {
        return false;
    }
}

async function writeTextFileIfMissing(relativePath, content) {
    const absolutePath = join(rootDir, relativePath);

    await mkdir(dirname(absolutePath), { recursive: true });

    const exists = await pathExists(absolutePath);

    if (exists) {
        console.log(`Skipped: ${relativePath}`);
        return;
    }

    await writeFile(absolutePath, content, "utf8");
    console.log(`Created: ${relativePath}`);
}

async function writeBinaryFileIfMissing(relativePath, base64Content) {
    const absolutePath = join(rootDir, relativePath);

    await mkdir(dirname(absolutePath), { recursive: true });

    const exists = await pathExists(absolutePath);

    if (exists) {
        console.log(`Skipped: ${relativePath}`);
        return;
    }

    await writeFile(absolutePath, Buffer.from(base64Content, "base64"));
    console.log(`Created: ${relativePath}`);
}

async function createSkeleton() {
    for (const [relativePath, content] of Object.entries(files)) {
        await writeTextFileIfMissing(relativePath, content);
    }

    await writeBinaryFileIfMissing(
        "public/exercises/fallback.png",
        fallbackPngBase64,
    );

    console.log("");
    console.log("Skeleton created.");
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
    await createSkeleton();
}