"use client";

import { Mark } from "./Icons";

/**
 * Stakeholders drawing in toward one point. Atmosphere and comprehension —
 * deliberately not a network graph.
 */
export function Orbit({
  names,
  progress,
  settled,
}: {
  names: string[];
  progress: number;
  settled: number;
}) {
  const W = 520;
  const H = 176;
  const cx = W * 0.7;
  const cy = H / 2;
  const reach = W * 0.46;

  const points = names.map((name, i) => {
    const t = names.length === 1 ? 0 : (i / (names.length - 1)) * 2 - 1; // -1 … 1
    const drawn = i < settled ? 1 : progress;
    const r = reach * (1 - 0.34 * drawn);
    return {
      name,
      x: cx - r,
      y: cy + t * (H * 0.34) * (1 - 0.22 * drawn),
      drawn,
      done: i < settled,
    };
  });

  return (
    <div className="relative mx-auto" style={{ width: W, maxWidth: "100%", height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
        {points.map((p, i) => (
          <line
            key={p.name}
            x1={p.x}
            y1={p.y}
            x2={cx - 24}
            y2={cy}
            stroke="var(--text)"
            strokeWidth="0.7"
            strokeOpacity={0.05 + 0.18 * p.drawn}
            style={{ transition: "all 900ms var(--ease)", transitionDelay: `${i * 90}ms` }}
          />
        ))}
        {points.map((p, i) => (
          <circle
            key={`${p.name}-dot`}
            cx={p.x}
            cy={p.y}
            r={p.done ? 3 : 2.2}
            fill={p.done ? "var(--accent)" : "var(--text-4)"}
            style={{ transition: "all 900ms var(--ease)", transitionDelay: `${i * 90}ms` }}
          />
        ))}
        <circle
          cx={cx}
          cy={cy}
          r={23}
          fill="none"
          stroke="var(--line)"
          strokeWidth="0.7"
          style={{ opacity: 0.4 + 0.6 * progress, transition: "opacity 900ms var(--ease)" }}
        />
      </svg>

      <div
        className="absolute text-fg2"
        style={{
          left: `${(cx / W) * 100}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          opacity: 0.45 + 0.55 * progress,
          transition: "opacity 900ms var(--ease)",
        }}
      >
        <Mark className="h-[18px] w-[18px]" />
      </div>

      {points.map((p, i) => (
        <span
          key={`${p.name}-label`}
          className="absolute whitespace-nowrap text-[11.5px]"
          style={{
            left: `${(p.x / W) * 100}%`,
            top: `${(p.y / H) * 100}%`,
            transform: "translate(-100%, -50%) translateX(-12px)",
            color: p.done ? "var(--text-2)" : "var(--text-4)",
            transition: "all 900ms var(--ease)",
            transitionDelay: `${i * 90}ms`,
          }}
        >
          {p.name}
        </span>
      ))}
    </div>
  );
}
