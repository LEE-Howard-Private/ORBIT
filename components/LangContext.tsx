"use client";

import { createContext, useContext } from "react";
import { STRINGS, type Lang, type UIStrings } from "@/lib/i18n";

const LangContext = createContext<{ lang: Lang; ui: UIStrings }>({ lang: "en", ui: STRINGS.en });

export function LangProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  return <LangContext.Provider value={{ lang, ui: STRINGS[lang] }}>{children}</LangContext.Provider>;
}

export function useUI(): UIStrings {
  return useContext(LangContext).ui;
}

export function useLang(): Lang {
  return useContext(LangContext).lang;
}
