"use client";

import { useEffect, useRef, useState } from "react";

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts from 0 to `target` once `active` flips true. Instant if reduced motion is on. */
export function useCountUp(target: number, active: boolean, duration = 1000): number {
  const [value, setValue] = useState(0);
  const frame = useRef<number>();

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || duration <= 0) {
      setValue(target);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(target * easeOut(t));
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [target, active, duration]);

  return value;
}
