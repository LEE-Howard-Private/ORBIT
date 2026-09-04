# SYNCLESS — AI Decision Layer for Modern Teams

> Meetings are not the problem. **Synchronization is.**

SYNCLESS is an AI decision-routing layer. It takes a work or meeting request, scores how much
of it actually needs synchronous time, prices the meeting that was asked for, and routes the
request to one of three paths — **AI HANDLES IT**, **ASYNC FIRST**, or **MEETING**. On the async
path it asks the named owners directly, collects the replies, synthesizes them and produces an
approvable decision brief with the ROI of not having met.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:3000. **No API key and no network access are required** — the Q4 launch
demo scenario is bundled in `data/demo-scenario.json` and plays end to end offline.

## Three scenarios, three routes

AI first → async second → meeting when necessary. SYNCLESS is not an anti-meeting product; it is a
right-synchronization product. Three requests are bundled and all three run offline:

| Request | Necessity | Route | Outcome |
|---|---|---|---|
| What was our enterprise customer churn rate last month? | 6% | **AI HANDLES IT** | Enterprise churn 4.2% · Customer Analytics, Aug 2026 · 96% confidence |
| Align Marketing, Product and Sales on the Q4 launch date | 38% | **ASYNC FIRST** | October 15 confirmed · 91% confidence · NT$11,250 saved |
| Should we delay the product launch by three months? | 89% | **MEETING** | Conflict found → 12→4 people, 120→30 min, positions pre-collected |

The MEETING case is the one that proves the point: SYNCLESS runs async collection first, finds that
Sales and Engineering reached opposing conclusions from the same evidence, and escalates — sizing
the meeting down rather than avoiding it.

## Demo recording

- **Play full demo** (top-right, or the button on the home screen, or the spacebar) runs the whole
  Golden Path automatically: the before state → three requests routed three different ways →
  CEO request → decision analysis → route selection → async coordination → decision brief →
  approval → ROI → closing frame. ~95 seconds at 1x; the speed control (0.75x / 1x / 1.5x)
  appears while it plays.
- **Stop** freezes on the current screen so it can be talked over.
- Manual browsing: the stage rail at the bottom (names appear on hover), the ← / → arrow keys,
  or **⌘K** for the command palette — every decision, every screen, and the language switch.

## The Golden Path

| # | Screen | The question it answers |
|---|--------|-------------------------|
| — | Before | What happens to this request today: CEO request → Slack → calendar → 10 people → 90 minutes → NT$13,500 |
| — | Routing | Three requests, three verdicts — the router deciding, before the deep dive |
| 01 | Request | What problem is the user trying to solve? |
| 02 | Analysis | Why does SYNCLESS recommend this route? (necessity · coordination cost · sufficiency · complexity · conflict · information sources) |
| 03 | Route | What does SYNCLESS do next? (WORK REQUEST → SYNCLESS AI → AI / ASYNC / MEETING) |
| 04 | Async | What information did it collect? (3 stakeholders · 3 targeted questions · 1 decision) |
| 05 | Brief | What decision did it produce? (October 15 · 91% confidence · Decision Ready) |
| 06 | Result | What did the company gain? (90-minute meeting → 15-minute review · NT$11,250 saved) |

## Language

The UI ships in English and Traditional Chinese. The **EN / 中文** toggle in the top bar switches
both the interface strings (`lib/i18n.ts`) and the scenario content (`data/` vs `data/zh/`) — the
same screens, the same animation, the same numbers. The choice is remembered per browser, and
switching mid-flow keeps you on the same scenario and screen. English is the default; to ship
Chinese as the default, change the initial `useState<Lang>("en")` in `app/page.tsx`.

## Deterministic by design

The Golden Path never calls a model. Every number, question and response in the three scenarios is
fixed demo data in `data/`, so the presentation cannot fail because of model variability. The real
analysis architecture is still there — the same schema, the same screens — and runs live only when
a free-text request is typed with an API key present.

## Live analysis (optional)

Free-text requests typed on the home screen are analyzed by the OpenAI API when a key is present:

```bash
cp .env.example .env.local
# then set OPENAI_API_KEY=sk-...
```

The API route (`app/api/analyze/route.ts`) returns the same schema the UI renders:

```jsonc
{
  "route": "async_first",
  "necessity_score": 38,
  "information_sufficiency": 82,
  "reasoning": [],
  "estimated_cost": 13500,
  "recommended_participants": [],
  "recommended_duration": 20,
  "questions": [],
  "decision": {},
  "confidence": 91
}
```

Live results are normalized into the same `Scenario` shape as the canned demo
(`lib/derive.ts`), so all five screens render identically. Without a key — or if the call fails or
times out — the UI degrades gracefully with an inline message and the offline demo keeps working.

## Design system

Dark, editorial, single-theme by intent. Everything is painted explicitly, so the page holds on any host ground.

- **Type** — Instrument Serif for display (hero, route name, decision, the result), Instrument Sans for the interface. Both are self-hosted by `next/font`, so the demo needs no network.
- **Colour** — one ground (`#0a0a0d`), three translucent surface levels, four text levels, and a single restrained accent (`#d9b57e`). Routes are told apart by typography and position, never by a status colour.
- **Depth** — three very slow light forms behind everything, 1–3px of cursor parallax, fixed film grain. Atmosphere dims to 40% during the route reveal.
- **Motion** — four durations (`--d-micro` 150ms, `--d-std` 320ms, `--d-major` 560ms, `--d-cine` 1000ms) on one easing curve. Content arrives with opacity + a short lift + a blur that resolves; nothing bounces.
- **Shape** — 10 / 16 / 24px radii for controls, surfaces, and the composer.

Primitives live in `components/ui` (`Composer`, `Orbit`, `Meter`, `Reveal`, `Stage`, `Icons`), the shell in `components/shell` (`FloatingNav`, `Rail`, `CommandPalette`), the environment in `components/env/Atmosphere.tsx`.

## Layout

```
app/
  page.tsx              Stage machine, autoplay engine, command registry
  api/analyze/route.ts  OpenAI-backed live analysis (optional)
components/
  env/Atmosphere.tsx    The room the product sits in
  shell/                Floating nav, stage rail, ⌘K palette
  screens/              Before, Montage, Home, Analysis, Route, Async, Brief, Roi, Closing
  ui/                   Composer, Orbit, Meter, Reveal, Stage, Icons
data/
  demo-scenario.json    Q4 launch alignment (ASYNC FIRST)
  scenario-churn.json   Enterprise churn question (AI HANDLES IT)
  scenario-delay.json   Three-month launch delay (MEETING)
  zh/                   The same three scenarios in Traditional Chinese
lib/
  script.ts             Golden Path beat timeline
  stages.ts             Narrative order, rail mapping, per-stage reveal depth
  scenario.ts           Scenario registry
  i18n.ts               EN / 中文 interface strings
  derive.ts             Live analysis → Scenario
  types.ts              Shared contract
```

## Notes

- No database and no separate backend. Demo state lives in local JSON.
- Tailwind CSS, dark enterprise palette, English UI throughout.
