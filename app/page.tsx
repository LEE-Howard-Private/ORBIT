"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LangProvider } from "@/components/LangContext";
import { Atmosphere } from "@/components/env/Atmosphere";
import { CommandPalette, type Command } from "@/components/shell/CommandPalette";
import { FloatingNav } from "@/components/shell/FloatingNav";
import { Rail } from "@/components/shell/Rail";
import { AnalysisScreen } from "@/components/screens/AnalysisScreen";
import { AsyncScreen } from "@/components/screens/AsyncScreen";
import { BeforeScreen } from "@/components/screens/BeforeScreen";
import { BriefScreen } from "@/components/screens/BriefScreen";
import { ClosingScreen } from "@/components/screens/ClosingScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { MontageScreen } from "@/components/screens/MontageScreen";
import { RoiScreen } from "@/components/screens/RoiScreen";
import { RouteScreen } from "@/components/screens/RouteScreen";
import { emit } from "@/lib/events";
import { STRINGS, type Lang } from "@/lib/i18n";
import {
  findScenarioByRequest,
  getDemoScenario,
  getScenarios,
  matchScenario,
} from "@/lib/scenario";
import { buildScript, scriptDurationMs } from "@/lib/script";
import { RAIL_STAGES, SEQUENCE, railIndex, restingStep } from "@/lib/stages";
import type { Scenario, StageId } from "@/lib/types";

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const ui = STRINGS[lang];
  const scenarios = useMemo(() => getScenarios(lang), [lang]);
  const demo = useMemo(() => getDemoScenario(lang), [lang]);

  const [scenario, setScenario] = useState<Scenario>(() => getDemoScenario("en"));
  const [stage, setStage] = useState<StageId>("request");
  const [step, setStep] = useState(0);

  const [cursor, setCursor] = useState(-1);
  const [endIndex, setEndIndex] = useState(-1);
  const [speed, setSpeed] = useState(1);

  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [liveMode, setLiveMode] = useState<boolean | null>(null);
  const [paletteOpen, setPaletteOpen] = useState(false);

  const script = useMemo(() => buildScript(scenario), [scenario]);
  const totalMs = useMemo(() => scriptDurationMs(script), [script]);
  const cumulative = useMemo(() => {
    const out = [0];
    script.forEach((beat, i) => out.push(out[i] + beat.hold));
    return out;
  }, [script]);

  const playing = cursor >= 0;
  const playingRef = useRef(playing);
  playingRef.current = playing;

  /* ---------- language ---------- */

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("syncless-lang");
      if (saved === "zh" || saved === "en") {
        setLang(saved);
        setScenario((current) => matchScenario(current, saved));
      }
    } catch {
      /* private mode — English default is fine */
    }
  }, []);

  const changeLang = useCallback(
    (next: Lang) => {
      setLang(next);
      setScenario((current) => matchScenario(current, next));
      setInput((current) => (current.trim() ? matchScenario(scenario, next).request : current));
      try {
        window.localStorage.setItem("syncless-lang", next);
      } catch {
        /* not persisting is harmless */
      }
    },
    [scenario]
  );

  useEffect(() => {
    let cancelled = false;
    fetch("/api/analyze")
      .then((r) => r.json())
      .then((d) => !cancelled && setLiveMode(Boolean(d?.live)))
      .catch(() => !cancelled && setLiveMode(false));
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- the autoplay engine ---------- */

  useEffect(() => {
    if (cursor < 0 || cursor >= script.length) return;
    const beat = script[cursor];
    setStage(beat.stage);
    setStep(beat.step);

    const id = setTimeout(() => {
      if (cursor >= endIndex || cursor + 1 >= script.length) {
        setCursor(-1);
        setEndIndex(-1);
      } else {
        setCursor(cursor + 1);
      }
    }, Math.max(200, beat.hold / speed));

    return () => clearTimeout(id);
  }, [cursor, endIndex, script, speed]);

  const playFullDemo = useCallback(() => {
    setError(null);
    setSpeed(1);
    setScenario(demo);
    setInput(demo.request);
    setCursor(0);
    setEndIndex(buildScript(demo).length - 1);
  }, [demo]);

  const stop = useCallback(() => {
    setCursor(-1);
    setEndIndex(-1);
    setStep((s) => (stage === "request" ? 1 : s));
  }, [stage]);

  const goToStage = useCallback(
    (target: StageId) => {
      setCursor(-1);
      setEndIndex(-1);
      setStage(target);
      setStep(restingStep(target, scenario));
    },
    [scenario]
  );

  const goPrev = useCallback(() => {
    const i = SEQUENCE.indexOf(stage);
    if (i > 0) goToStage(SEQUENCE[i - 1]);
  }, [stage, goToStage]);

  const goNext = useCallback(() => {
    const i = SEQUENCE.indexOf(stage);
    if (i < SEQUENCE.length - 1) goToStage(SEQUENCE[i + 1]);
  }, [stage, goToStage]);

  /** Plays only the request → analysis stretch, briskly, then rests. */
  const playAnalysis = useCallback((source: Scenario) => {
    const s = buildScript(source);
    setSpeed(2.1);
    setCursor(s.findIndex((b) => b.stage === "request" && b.step === 2));
    setEndIndex(s.findIndex((b) => b.stage === "analysis" && b.step === 5));
  }, []);

  const submit = useCallback(async () => {
    const text = input.trim();
    setError(null);
    if (!text) return;

    const bundled = findScenarioByRequest(text, lang);
    if (bundled) {
      setScenario(bundled);
      playAnalysis(bundled);
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ request: text }),
      });
      const data = await res.json();
      if (!res.ok || !data?.ok) {
        setError((data?.error as string) || ui.hero.errorOffline);
        return;
      }
      const live = data.scenario as Scenario;
      setScenario(live);
      playAnalysis(live);
    } catch {
      setError(ui.hero.errorUnreachable);
    } finally {
      setBusy(false);
    }
  }, [input, lang, playAnalysis, ui]);

  const openScenario = useCallback((next: Scenario) => {
    setCursor(-1);
    setEndIndex(-1);
    setError(null);
    setScenario(next);
    setInput(next.request);
    setStage("request");
    setStep(0);
  }, []);

  const home = useCallback(() => {
    setCursor(-1);
    setEndIndex(-1);
    setError(null);
    setStage("request");
    setStep(0);
  }, []);

  const restart = useCallback(() => {
    setScenario(demo);
    setInput("");
    home();
  }, [demo, home]);

  /* ---------- keyboard ---------- */

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.code === "Space") {
        e.preventDefault();
        playingRef.current ? stop() : playFullDemo();
      } else if (e.code === "ArrowRight") {
        goNext();
      } else if (e.code === "ArrowLeft") {
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, playFullDemo, stop]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [stage]);

  /* ---------- named moments, for a cinematic build to hang cues on ---------- */

  const lastBeat = useRef("");
  useEffect(() => {
    const beat = `${stage}:${step}`;
    if (beat === lastBeat.current) return;
    lastBeat.current = beat;

    const n = scenario.stakeholders.length;
    if (stage === "analysis" && step === 0) emit("analysisStarted", { scenario: scenario.id });
    else if (stage === "analysis" && step > 0)
      emit("analysisStepCompleted", { index: step - 1, total: 5 });
    else if (stage === "route" && step >= 3)
      emit("routeDetermined", { route: scenario.analysis.route });
    else if (stage === "async" && step === 0) emit("asyncStarted", { stakeholders: n });
    else if (stage === "async" && step > n && step <= n * 2)
      emit("responseReceived", { index: step - n - 1, total: n });
    else if (stage === "brief" && step >= 1) emit("decisionReady", { scenario: scenario.id });
  }, [stage, step, scenario]);

  /* ---------- palette ---------- */

  const commands: Command[] = useMemo(() => {
    const list: Command[] = [
      { id: "play", group: ui.palette.actions, label: ui.palette.playDemo, hint: "Space", icon: "play", run: playFullDemo },
      { id: "new", group: ui.palette.actions, label: ui.palette.newDecision, icon: "spark", run: restart },
      {
        id: "lang",
        group: ui.palette.actions,
        label: ui.palette.switchLang,
        icon: "mark",
        run: () => changeLang(lang === "en" ? "zh" : "en"),
      },
    ];
    scenarios.forEach((s) =>
      list.push({
        id: s.id,
        group: ui.palette.scenarios,
        label: s.title,
        hint: ui.routeLabel[s.analysis.route],
        icon: "arrow",
        run: () => openScenario(s),
      })
    );
    RAIL_STAGES.forEach((target, i) =>
      list.push({
        id: `stage-${target}`,
        group: ui.palette.screens,
        label: ui.screens[i],
        icon: "arrow",
        run: () => goToStage(target),
      })
    );
    return list;
  }, [ui, scenarios, lang, playFullDemo, restart, changeLang, openScenario, goToStage]);

  /* ---------- atmosphere ---------- */

  const atmosphere =
    stage === "route" && step >= 3 ? 0.4 : stage === "closing" ? 0.75 : playing ? 0.85 : 1;

  const progress = playing ? (cumulative[cursor + 1] / totalMs) * 100 : 0;
  const progressMs = playing ? Math.max(200, script[cursor].hold / speed) : 0;

  return (
    <LangProvider lang={lang}>
      <div className="grain relative min-h-screen" data-lang={lang}>
        <Atmosphere intensity={atmosphere} />

        <div className="fixed inset-x-0 top-0 z-50 h-px">
          <div
            className="h-full bg-accent"
            style={{
              width: `${progress}%`,
              opacity: playing ? 0.7 : 0,
              transition: playing
                ? `width ${progressMs}ms linear, opacity var(--d-std) var(--ease)`
                : "opacity var(--d-std) var(--ease)",
            }}
          />
        </div>

        <FloatingNav
          lang={lang}
          onLang={changeLang}
          playing={playing}
          onPlay={playFullDemo}
          onStop={stop}
          onHome={home}
          onPalette={() => setPaletteOpen(true)}
          dimmed={playing}
        />

        <main key={stage} className="relative z-10 animate-sweepIn">
          {stage === "intro" ? <BeforeScreen scenario={scenario} step={step} /> : null}
          {stage === "montage" ? (
            <MontageScreen
              scenarios={scenarios}
              step={step}
              focusId={demo.id}
              onSelect={playing ? undefined : openScenario}
            />
          ) : null}
          {stage === "request" ? (
            <HomeScreen
              scenario={scenario}
              scenarios={scenarios}
              step={step}
              autoplay={playing}
              value={input}
              onChange={setInput}
              onSubmit={submit}
              onOpenScenario={openScenario}
              busy={busy}
              error={error}
            />
          ) : null}
          {stage === "analysis" ? <AnalysisScreen scenario={scenario} step={step} /> : null}
          {stage === "route" ? <RouteScreen scenario={scenario} step={step} /> : null}
          {stage === "async" ? <AsyncScreen scenario={scenario} step={step} /> : null}
          {stage === "brief" ? (
            <BriefScreen
              scenario={scenario}
              step={step}
              autoplay={playing}
              onApprove={() => setStep(2)}
              onContinue={() => goToStage("roi")}
            />
          ) : null}
          {stage === "roi" ? (
            <RoiScreen
              scenario={scenario}
              step={step}
              autoplay={playing}
              onContinue={() => goToStage("closing")}
            />
          ) : null}
          {stage === "closing" ? <ClosingScreen scenario={scenario} step={step} /> : null}
        </main>

        <Rail
          index={railIndex(stage)}
          total={RAIL_STAGES.length}
          onJump={(i) => goToStage(RAIL_STAGES[i])}
          onPrev={goPrev}
          onNext={goNext}
          hidden={playing || paletteOpen}
        />

        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} commands={commands} />

        <span className="sr-only">{liveMode ? ui.common.live : ui.common.offline}</span>
      </div>
    </LangProvider>
  );
}
