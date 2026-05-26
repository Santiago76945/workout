// src/lib/routine/buildRoutineSteps.ts

import { getExerciseById } from "@/data/exercises";
import type { Routine, RoutineStep } from "@/types/routine";

export function buildRoutineSteps(routine: Routine): RoutineStep[] {
  return routine.items.flatMap((item, itemIndex) => {
    const exercise = getExerciseById(item.exerciseId);
    const exerciseStepNumber = itemIndex + 1;
    const totalExerciseSteps = routine.items.length;
    const steps: RoutineStep[] = [];

    for (let setNumber = 1; setNumber <= item.sets; setNumber += 1) {
      steps.push({
        id: `${item.id}-set-${setNumber}`,
        type: "exercise",
        routineItemId: item.id,
        exerciseId: item.exerciseId,
        exercise,
        exerciseStepNumber,
        totalExerciseSteps,
        setNumber,
        totalSets: item.sets,
        target: item.target
      });

      const isLastRoutineItem = itemIndex === routine.items.length - 1;
      const isLastSet = setNumber === item.sets;
      const isLastAbsoluteSet = isLastRoutineItem && isLastSet;
      const shouldAddRestStep =
        !isLastAbsoluteSet && item.restSecondsBetweenSets > 0;

      if (shouldAddRestStep) {
        steps.push({
          id: `${item.id}-rest-after-set-${setNumber}`,
          type: "rest",
          routineItemId: item.id,
          exerciseId: item.exerciseId,
          exercise,
          durationSeconds: item.restSecondsBetweenSets,
          afterExerciseStepNumber: exerciseStepNumber,
          totalExerciseSteps,
          afterSetNumber: setNumber,
          totalSets: item.sets
        });
      }
    }

    return steps;
  });
}