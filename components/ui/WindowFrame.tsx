"use client";

import type { ReactNode } from "react";
import { Mark } from "@/components/ui/Icons";

/**
 * The product is presented as a desktop application, not a browser tab:
 * one window, inset from the desktop, with its own title bar and its own scroll.
 *
 * The transform on `.window` deliberately makes this element the containing
 * block for every `position: fixed` child, so the rail, the narrator and the
 * palette all live inside the window rather than the viewport.
 */
export function WindowFrame({
  title,
  subtitle,
  toolbar,
  onTitleClick,
  children,
  scrollRef,
}: {
  title: string;
  subtitle?: string;
  toolbar?: ReactNode;
  onTitleClick?: () => void;
  children: ReactNode;
  scrollRef?: React.RefObject<HTMLDivElement>;
}) {
  return (
    <div className="window">
      <div className="titlebar relative z-[70] flex items-center gap-3 px-4">
        <div className="flex shrink-0 items-center gap-2" aria-hidden>
          <span className="light" style={{ background: "#ff5f57" }} />
          <span className="light" style={{ background: "#febc2e" }} />
          <span className="light" style={{ background: "#28c840" }} />
        </div>

        <span className="mx-1 hidden h-3.5 w-px shrink-0 bg-line sm:block" aria-hidden />

        <button
          onClick={onTitleClick}
          className="hidden shrink-0 items-center gap-2 text-fg3 transition-colors duration-150 hover:text-fg sm:flex"
        >
          <Mark className="h-[15px] w-[15px]" />
          <span className="text-[11.5px] font-medium tracking-[0.22em] text-fg2">{title}</span>
        </button>

        {/* the window title, centred the way a native window centres it */}
        <div className="pointer-events-none absolute inset-x-0 hidden justify-center md:flex">
          <span className="truncate px-40 text-[11.5px] text-fg3">{subtitle}</span>
        </div>

        <div className="ml-auto flex shrink-0 items-center">{toolbar}</div>
      </div>

      <div
        ref={scrollRef}
        id="app-scroll"
        className="scrollbar-none relative h-[calc(100%-var(--titlebar))] overflow-y-auto overflow-x-hidden"
      >
        {children}
      </div>
    </div>
  );
}
