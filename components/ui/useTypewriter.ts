"use client";

import { useEffect, useState } from "react";

/** Types `text` out character-by-character while `active` is true. */
export function useTypewriter(text: string, active: boolean, msPerChar = 16): string {
  const [shown, setShown] = useState("");

  useEffect(() => {
    if (!active) {
      setShown("");
      return;
    }
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(text);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, msPerChar);
    return () => clearInterval(id);
  }, [text, active, msPerChar]);

  return shown;
}
