// src/lib/routine/formatRoutineTarget.ts

import type {
    RoutineDurationTarget,
    RoutineExerciseStep,
    RoutineRepetitionTarget,
    RoutineTarget
} from "@/types/routine";

function formatRepetitionTarget(target: RoutineRepetitionTarget): string {
    if (target.minReps === target.maxReps) {
        return `${target.minReps} ${target.unitLabel}`;
    }

    return `${target.minReps} a ${target.maxReps} ${target.unitLabel}`;
}

function formatDurationTarget(target: RoutineDurationTarget): string {
    if (target.minSeconds === target.maxSeconds) {
        return `${target.minSeconds} segundos`;
    }

    return `${target.minSeconds} a ${target.maxSeconds} segundos`;
}

export function formatRoutineTarget(target: RoutineTarget): string {
    if (target.type === "duration") {
        return formatDurationTarget(target);
    }

    return formatRepetitionTarget(target);
}

export function getRoutineExerciseInstruction(
    step: RoutineExerciseStep
): string {
    if (step.target.type === "duration") {
        return `Mantené ${step.exercise.shortTitle.toLowerCase()} durante ${formatRoutineTarget(
            step.target
        )}.`;
    }

    return `Realizá ${formatRoutineTarget(step.target)}.`;
}

export function getRoutineRestInstruction(durationSeconds: number): string {
    return `Descansá ${durationSeconds} segundos.`;
}