// src/lib/routine/buildRoutineSteps.ts

import { getExerciseById } from "@/data/exercises";
import type { Routine, RoutineStep } from "@/types/routine";

export function buildRoutineSteps(routine: Routine): RoutineStep[] {
  return routine.items.flatMap((item) => {
    const exercise = getExerciseById(item.exerciseId);
    const steps: RoutineStep[] = [];

    for (let setNumber = 1; setNumber <= item.sets; setNumber += 1) {
      steps.push({
        id: `${item.id}-set-${setNumber}`,
        type: "exercise",
        exerciseId: item.exerciseId,
        exercise,
        setNumber,
        totalSets: item.sets,
        target: item.target
      });

      const shouldAddRestStep = setNumber < item.sets;

      if (shouldAddRestStep) {
        steps.push({
          id: `${item.id}-rest-after-set-${setNumber}`,
          type: "rest",
          exerciseId: item.exerciseId,
          exercise,
          durationSeconds: item.restSeconds,
          afterSetNumber: setNumber,
          totalSets: item.sets
        });
      }
    }

    return steps;
  });
}