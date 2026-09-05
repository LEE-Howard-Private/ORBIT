"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, Spinner } from "@/components/ui/Icons";

/**
 * The control centre: one surface that grows with the text, lifts on hover,
 * and brightens on focus. No submit bar, no toolbar — a single object.
 */
export function Composer({
  value,
  onChange,
  onSubmit,
  placeholder,
  hint,
  busy,
  readOnly,
  caret,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  hint: string;
  busy?: boolean;
  readOnly?: boolean;
  caret?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(el.scrollHeight, 76)}px`;
  }, [value]);

  const active = focused || hovered;
  const ready = value.trim().length > 0 && !busy && !readOnly;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="glass relative w-full"
      style={{
        borderRadius: "var(--r-lg)",
        borderColor: focused ? "var(--line-strong)" : undefined,
        boxShadow: focused
          ? "0 1px 0 0 rgba(255,255,255,0.07) inset, 0 40px 90px -60px rgba(0,0,0,0.95)"
          : active
          ? "0 1px 0 0 rgba(255,255,255,0.05) inset, 0 32px 70px -60px rgba(0,0,0,0.9)"
          : "0 1px 0 0 rgba(255,255,255,0.04) inset",
        transform: active ? "translateY(-1px)" : "none",
        transition:
          "transform var(--d-std) var(--ease), box-shadow var(--d-std) var(--ease), border-color var(--d-std) var(--ease)",
      }}
    >
      <div className="px-6 pt-6 md:px-7 md:pt-7">
        {readOnly ? (
          <div className="min-h-[76px] whitespace-pre-wrap text-[17px] leading-[1.6] text-fg md:text-[18px]">
            {value}
            {caret ? (
              <span
                className="ml-[2px] inline-block h-[19px] w-[1.5px] translate-y-[3px] bg-accent align-middle animate-breathe"
                aria-hidden
              />
            ) : null}
          </div>
        ) : (
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (ready) onSubmit();
              }
            }}
            rows={1}
            placeholder={placeholder}
            spellCheck={false}
            className="block max-h-[280px] min-h-[76px] w-full resize-none bg-transparent text-[17px] leading-[1.6] text-fg outline-none focus-visible:outline-none placeholder:text-fg4 md:text-[18px]"
          />
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-6 pb-5 pt-2 md:px-7">
        <span className="text-[11.5px] text-fg4">{hint}</span>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!ready}
          aria-label="Analyze"
          className="flex h-9 w-9 items-center justify-center rounded-full transition-all duration-150"
          style={{
            background: ready ? "var(--text)" : "var(--surface-2)",
            color: ready ? "#0b0b0d" : "var(--text-4)",
            cursor: ready ? "pointer" : "not-allowed",
          }}
        >
          {busy ? <Spinner className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
