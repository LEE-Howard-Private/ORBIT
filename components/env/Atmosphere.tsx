"use client";

import { useEffect, useRef } from "react";

/**
 * The environment the product sits inside: three very slow light forms,
 * a fixed grain, and 1–3px of parallax that most people never consciously see.
 */
export function Atmosphere({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 6;
      ty = (e.clientY / window.innerHeight - 0.5) * 6;
    };
    const tick = () => {
      cx += (tx - cx) * 0.045;
      cy += (ty - cy) * 0.045;
      el.style.transform = `translate3d(${cx.toFixed(2)}px, ${cy.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ opacity: intensity, transition: "opacity var(--d-cine) var(--ease)" }}
      aria-hidden
    >
      <div ref={ref} className="absolute inset-[-12%]">
        <div
          className="absolute left-[6%] top-[-14%] h-[62vw] w-[62vw] animate-driftA rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(99,102,241,0.16), rgba(99,102,241,0.05) 45%, transparent 72%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute right-[-10%] top-[18%] h-[52vw] w-[52vw] animate-driftB rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05), rgba(255,255,255,0.015) 50%, transparent 74%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="absolute bottom-[-24%] left-[24%] h-[58vw] w-[58vw] animate-driftA rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.045), transparent 68%)",
            filter: "blur(80px)",
            animationDelay: "-12s",
          }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(130% 100% at 50% -8%, transparent 30%, rgba(8,8,10,0.5) 72%, rgba(8,8,10,0.9) 100%)",
        }}
      />
    </div>
  );
}
