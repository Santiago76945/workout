// src/components/routine/RestTimer.tsx

"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type RestTimerProps = {
  durationSeconds: number;
  onTick: (remainingSeconds: number) => void;
  onComplete: () => void;
};

const styles = {
  timer: {
    display: "grid",
    minHeight: "8.5rem",
    width: "8.5rem",
    placeItems: "center",
    border: "1px solid var(--border)",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.65)",
    boxShadow: "0 12px 35px rgba(31, 31, 31, 0.08)"
  },
  value: {
    margin: 0,
    fontSize: "3rem",
    fontWeight: 950,
    letterSpacing: "-0.08em"
  },
  label: {
    margin: "-1.8rem 0 0",
    color: "var(--muted)",
    fontSize: "0.78rem",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase"
  }
} satisfies Record<string, CSSProperties>;

export function RestTimer({
  durationSeconds,
  onTick,
  onComplete
}: RestTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const hasCompletedRef = useRef(false);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    hasCompletedRef.current = false;
    setRemainingSeconds(durationSeconds);
    onTickRef.current(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onCompleteRef.current();
      }

      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setRemainingSeconds((currentRemainingSeconds) =>
        Math.max(currentRemainingSeconds - 1, 0)
      );
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [remainingSeconds]);

  useEffect(() => {
    onTickRef.current(remainingSeconds);
  }, [remainingSeconds]);

  return (
    <div style={styles.timer} aria-label={`Descanso: ${remainingSeconds}`}>
      <p style={styles.value}>{remainingSeconds}</p>
      <p style={styles.label}>segundos</p>
    </div>
  );
}