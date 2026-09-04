"use client";

import type { CSSProperties, ReactNode } from "react";

/**
 * Children stay mounted so nothing reflows mid-sequence; they arrive by
 * opacity + a short lift + a blur that resolves. One motion, everywhere.
 */
export function Reveal({
  show,
  delay = 0,
  y = 10,
  blur = 5,
  duration = 620,
  className = "",
  style,
  children,
}: {
  show: boolean;
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : `translateY(${y}px)`,
        filter: show ? "blur(0px)" : `blur(${blur}px)`,
        transition: `opacity ${duration}ms var(--ease), transform ${duration}ms var(--ease), filter ${duration}ms var(--ease)`,
        transitionDelay: `${delay}ms`,
        pointerEvents: show ? undefined : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
