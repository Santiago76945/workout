// src/lib/routine/estimateRoutineDuration.ts

import type { Routine, RoutineItem, RoutineTarget } from "@/types/routine";

const estimatedSecondsPerRepetition = 3;

function getTargetEstimatedSeconds(target: RoutineTarget): number {
  if (target.type === "duration") {
    return target.seconds;
  }

  return target.repetitions * estimatedSecondsPerRepetition;
}

function getRoutineItemRestCount(
  item: RoutineItem,
  itemIndex: number,
  totalItems: number
): number {
  const isLastRoutineItem = itemIndex === totalItems - 1;

  if (isLastRoutineItem) {
    return Math.max(item.sets - 1, 0);
  }

  return item.sets;
}

export function getRoutineEstimatedDurationSeconds(routine: Routine): number {
  return routine.items.reduce((totalSeconds, item, itemIndex) => {
    const exerciseSeconds = getTargetEstimatedSeconds(item.target) * item.sets;
    const restCount = getRoutineItemRestCount(
      item,
      itemIndex,
      routine.items.length
    );
    const restSeconds = restCount * item.restSecondsBetweenSets;

    return totalSeconds + exerciseSeconds + restSeconds;
  }, 0);
}

export function getRoutineEstimatedDurationMinutes(routine: Routine): number {
  const durationSeconds = getRoutineEstimatedDurationSeconds(routine);

  if (durationSeconds <= 0) {
    return 0;
  }

  return Math.max(1, Math.ceil(durationSeconds / 60));
}

export function formatRoutineEstimatedDuration(routine: Routine): string {
  const estimatedMinutes = getRoutineEstimatedDurationMinutes(routine);

  if (estimatedMinutes === 0) {
    return "0 min";
  }

  return `${estimatedMinutes} min`;
}