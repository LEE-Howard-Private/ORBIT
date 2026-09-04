"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUI } from "@/components/LangContext";
import { ArrowRight, Mark, Play, Search, Spark } from "@/components/ui/Icons";

export interface Command {
  id: string;
  group: string;
  label: string;
  hint?: string;
  icon?: "play" | "mark" | "spark" | "arrow";
  run: () => void;
}

const ICONS = {
  play: Play,
  mark: Mark,
  spark: Spark,
  arrow: ArrowRight,
};

export function CommandPalette({
  open,
  onClose,
  commands,
}: {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}) {
  const ui = useUI();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setCursor(0);
      const id = setTimeout(() => inputRef.current?.focus(), 40);
      return () => clearTimeout(id);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    setCursor((c) => Math.min(c, Math.max(0, results.length - 1)));
  }, [results.length]);

  if (!open) return null;

  const groups: { name: string; items: Command[] }[] = [];
  for (const item of results) {
    const last = groups[groups.length - 1];
    if (last && last.name === item.group) last.items.push(item);
    else groups.push({ name: item.group, items: [item] });
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (c + 1) % Math.max(1, results.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (c - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const chosen = results[cursor];
      if (chosen) {
        onClose();
        chosen.run();
      }
    }
  };

  let flat = -1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-5 pt-[16vh]"
      onMouseDown={onClose}
      role="dialog"
      aria-modal
    >
      <div
        className="absolute inset-0"
        style={{ background: "rgba(6,6,8,0.62)", backdropFilter: "blur(6px)" }}
      />
      <div
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
        className="glass relative w-full max-w-[560px] overflow-hidden animate-sweepIn"
        style={{
          borderRadius: "var(--r-lg)",
          borderColor: "var(--line-strong)",
          boxShadow: "0 40px 100px -40px rgba(0,0,0,0.9)",
        }}
      >
        <div className="flex items-center gap-3 px-5 py-4">
          <Search className="h-4 w-4 shrink-0 text-fg3" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={ui.palette.placeholder}
            className="w-full bg-transparent text-[15px] text-fg outline-none focus-visible:outline-none placeholder:text-fg4"
          />
          <span className="rounded-[6px] border border-line px-1.5 py-0.5 text-[10px] text-fg4">esc</span>
        </div>

        <div className="max-h-[52vh] overflow-y-auto border-t border-line px-2 pb-2 pt-2 scrollbar-none">
          {results.length === 0 ? (
            <div className="px-3 py-6 text-[13px] text-fg3">{ui.palette.empty}</div>
          ) : (
            groups.map((group) => (
              <div key={group.name} className="mb-1">
                <div className="eyebrow px-3 py-2">{group.name}</div>
                {group.items.map((item) => {
                  flat += 1;
                  const active = flat === cursor;
                  const index = flat;
                  const Icon = ICONS[item.icon ?? "arrow"];
                  return (
                    <button
                      key={item.id}
                      onMouseEnter={() => setCursor(index)}
                      onClick={() => {
                        onClose();
                        item.run();
                      }}
                      className="flex w-full items-center gap-3 rounded-sm2 px-3 py-2.5 text-left transition-colors duration-100"
                      style={{ background: active ? "var(--surface-2)" : "transparent" }}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0 text-fg3" />
                      <span className="flex-1 truncate text-[13.5px] text-fg">{item.label}</span>
                      {item.hint ? <span className="text-[11px] text-fg4">{item.hint}</span> : null}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
