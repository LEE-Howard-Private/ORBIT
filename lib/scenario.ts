import q4 from "@/data/demo-scenario.json";
import churn from "@/data/scenario-churn.json";
import delay from "@/data/scenario-delay.json";
import q4Zh from "@/data/zh/demo-scenario.json";
import churnZh from "@/data/zh/scenario-churn.json";
import delayZh from "@/data/zh/scenario-delay.json";
import type { Lang } from "./i18n";
import type { Scenario } from "./types";

const as = (raw: unknown) => raw as unknown as Scenario;

/** One scenario per route, in route order, so the router can be shown deciding. */
export const SCENARIOS: Record<Lang, Scenario[]> = {
  en: [as(churn), as(q4), as(delay)],
  zh: [as(churnZh), as(q4Zh), as(delayZh)],
};

/** The Q4 launch scenario — the primary demo, bundled at build time. */
export const demoScenario = as(q4);

export function getScenarios(lang: Lang): Scenario[] {
  return SCENARIOS[lang];
}

export function getDemoScenario(lang: Lang): Scenario {
  return SCENARIOS[lang][1];
}

export function findScenarioByRequest(text: string, lang: Lang): Scenario | undefined {
  const needle = text.trim();
  return SCENARIOS[lang].find((s) => s.request.trim() === needle);
}

/** Keeps the viewer on the same scenario when the language is switched. */
export function matchScenario(scenario: Scenario, lang: Lang): Scenario {
  return SCENARIOS[lang].find((s) => s.id === scenario.id) ?? scenario;
}
