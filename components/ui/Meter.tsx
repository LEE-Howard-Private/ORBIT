"use client";

import { useCountUp } from "./useCountUp";

/** A number that matters, with a hairline that shows where it sits. */
export function Meter({
  label,
  value,
  suffix = "%",
  active,
  emphasis = false,
  threshold,
}: {
  label: string;
  value: number;
  suffix?: string;
  active: boolean;
  emphasis?: boolean;
  threshold?: number;
}) {
  const shown = useCountUp(value, active, 900);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-[12.5px] text-fg2">{label}</span>
        <span
          className={`tnum ${emphasis ? "text-[26px]" : "text-[16px]"} leading-none`}
          style={{ color: emphasis ? "var(--text)" : "var(--text)" }}
        >
          {Math.round(shown)}
          <span className="text-fg3">{suffix}</span>
        </span>
      </div>
      <div className="relative mt-2.5 h-px w-full" style={{ background: "var(--line)" }}>
        <div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${shown}%`,
            background: "var(--text-2)",
            transition: "width 900ms var(--ease)",
          }}
        />
        {typeof threshold === "number" ? (
          <span
            className="absolute -top-[3px] h-[7px] w-px"
            style={{ left: `${threshold}%`, background: "var(--accent-line)" }}
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}
