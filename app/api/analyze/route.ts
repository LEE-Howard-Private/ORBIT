import { NextResponse } from "next/server";
import { buildScenarioFromAnalysis, type LiveAnalysis, type LiveQuestion } from "@/lib/derive";
import { decide, meetingCost, type Factors } from "@/lib/engine";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are the extraction layer of SYNCLESS, an AI decision layer for companies.

You do NOT choose the coordination route. A deterministic scoring model does that.
Your job is to read a work or meeting request and extract structured, defensible attributes.

Score every factor from 0 to 100:
- information_sufficiency: how much of what this decision needs already exists in systems or documents
- stakeholder_complexity: how tangled the involved parties' interests are
- decision_ambiguity: how under-specified the decision itself is
- real_time_dependency: how much resolving it depends on live back-and-forth
- urgency: how soon it must be resolved
- disagreement_potential: how likely the parties are to reach opposing conclusions
- decision_consequence: how costly it is to get wrong

Reply with JSON only, matching exactly this shape:
{
  "factors": {
    "information_sufficiency": 0-100,
    "stakeholder_count": number of people who must contribute,
    "stakeholder_complexity": 0-100,
    "decision_ambiguity": 0-100,
    "real_time_dependency": 0-100,
    "urgency": 0-100,
    "disagreement_potential": 0-100,
    "decision_consequence": 0-100
  },
  "meeting": {"participants": number the requester would have invited, "minutes": length they would have booked},
  "headline": "One sentence explaining what this request actually needs, in plain language",
  "reasoning": ["3-5 short, concrete sentences about the factors above"],
  "information_sources": [{"label": "Marketing plan", "status": "available" | "partial" | "missing", "detail": "one short clause"}],
  "recommended_participants": ["Role titles who must actually be involved"],
  "recommended_duration": minutes of human time the cheapest path needs,
  "questions": [
    {
      "role": "Marketing",
      "question": "One concrete question this role can answer on their own",
      "respondent_name": "A plausible person name",
      "respondent_title": "Their title",
      "simulated_answer": "A plausible, specific answer, 1-2 sentences",
      "responded_in": "12 min",
      "flag": {"kind": "constraint" | "conflict", "label": "Constraint detected", "effect": "What it changes about the decision"}
    }
  ],
  "decision": {
    "title": "Short decision brief title",
    "status": "Decision Ready",
    "recommendation": "2-3 sentences stating the recommended decision",
    "owner": "The accountable role",
    "fields": [{"label": "Short label", "value": "Short value", "source": "Which role supplied it"}],
    "post_approval": ["3-4 concrete things SYNCLESS does the moment the brief is approved"]
  },
  "confidence": 0-100 confidence in the DECISION itself once the answers are in,
  "synthesis": "One sentence summarizing what the collected answers established",
  "baseline": {"coordination_time": "e.g. 3-day coordination"}
}

Rules: 2-4 questions, each independently answerable. 3-5 decision fields. 2-4 information sources.
Add "flag" to at most one question. No markdown, no commentary — JSON only.`;

function clampScore(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v)).filter((v) => v.trim().length > 0);
}

function normalizeFactors(raw: any): Factors {
  const n = (v: unknown, fallback: number) => clampScore(v, fallback);
  return {
    information_sufficiency: n(raw?.information_sufficiency, 50),
    stakeholder_count: Math.max(0, Math.min(20, Math.round(Number(raw?.stakeholder_count) || 3))),
    stakeholder_complexity: n(raw?.stakeholder_complexity, 40),
    decision_ambiguity: n(raw?.decision_ambiguity, 40),
    real_time_dependency: n(raw?.real_time_dependency, 40),
    urgency: n(raw?.urgency, 50),
    disagreement_potential: n(raw?.disagreement_potential, 35),
    decision_consequence: n(raw?.decision_consequence, 45),
  };
}

function normalize(parsed: any): LiveAnalysis {
  // The model extracts; the engine decides.
  const factors = normalizeFactors(parsed?.factors);
  const engine = decide(factors);
  const participants = Math.max(2, Math.min(30, Math.round(Number(parsed?.meeting?.participants) || 8)));
  const minutes = Math.max(15, Math.min(240, Math.round(Number(parsed?.meeting?.minutes) || 60)));
  const cost = meetingCost(participants, minutes);

  const questions: LiveQuestion[] = Array.isArray(parsed?.questions)
    ? parsed.questions
        .filter((q: any) => q && typeof q.question === "string")
        .slice(0, 5)
        .map((q: any, i: number) => ({
          id: `q-${i}`,
          role: String(q.role ?? `Stakeholder ${i + 1}`),
          question: String(q.question),
          respondent_name: q.respondent_name ? String(q.respondent_name) : undefined,
          respondent_title: q.respondent_title ? String(q.respondent_title) : undefined,
          simulated_answer: q.simulated_answer ? String(q.simulated_answer) : undefined,
          responded_in: q.responded_in ? String(q.responded_in) : undefined,
          flag:
            q.flag && q.flag.label && q.flag.effect
              ? {
                  kind: q.flag.kind === "conflict" ? ("conflict" as const) : ("constraint" as const),
                  label: String(q.flag.label),
                  effect: String(q.flag.effect),
                }
              : undefined,
        }))
    : [];

  const rawFields = Array.isArray(parsed?.decision?.fields) ? parsed.decision.fields : [];
  const fields = rawFields
    .filter((f: any) => f && (f.label || f.value))
    .slice(0, 6)
    .map((f: any) => ({
      label: String(f.label ?? "Field"),
      value: String(f.value ?? "—"),
      source: String(f.source ?? "SYNCLESS"),
    }));

  const owner = String(parsed?.decision?.owner ?? "Requester");
  if (!fields.some((f: { label: string }) => f.label.toLowerCase() === "owner")) {
    fields.push({ label: "Owner", value: owner, source: "SYNCLESS" });
  }

  return {
    route: engine.route,
    factors,
    meeting: { participants, minutes },
    necessity_score: engine.scores.meeting,
    information_sufficiency: factors.information_sufficiency,
    headline: parsed?.headline ? String(parsed.headline) : undefined,
    reasoning: asStringArray(parsed?.reasoning).slice(0, 6),
    estimated_cost: cost.total,
    cost_basis: `${cost.participants} × ${cost.hours} h × NT$${cost.rate} = NT$${cost.total.toLocaleString("en-US")}`,
    information_sources: Array.isArray(parsed?.information_sources)
      ? parsed.information_sources.slice(0, 5).map((s: any) => ({
          label: String(s?.label ?? "Source"),
          status:
            s?.status === "partial" ? ("partial" as const) : s?.status === "missing" ? ("missing" as const) : ("available" as const),
          detail: s?.detail ? String(s.detail) : undefined,
        }))
      : undefined,
    recommended_participants: asStringArray(parsed?.recommended_participants).slice(0, 6),
    recommended_duration: clampScore(parsed?.recommended_duration, 20) || 20,
    questions,
    decision: {
      title: String(parsed?.decision?.title ?? "Decision Brief"),
      recommendation: String(parsed?.decision?.recommendation ?? "Proceed as recommended above."),
      launch_date: String(parsed?.decision?.launch_date ?? ""),
      product_status: String(parsed?.decision?.product_status ?? ""),
      constraint: String(parsed?.decision?.constraint ?? ""),
      owner,
      fields,
      status: parsed?.decision?.status ? String(parsed.decision.status) : undefined,
      post_approval: Array.isArray(parsed?.decision?.post_approval)
        ? parsed.decision.post_approval.map((x: unknown) => String(x)).slice(0, 5)
        : undefined,
    },
    confidence: clampScore(parsed?.confidence, 80),
    baseline: {
      participants: Number(parsed?.baseline?.participants) || 8,
      duration_minutes: Number(parsed?.baseline?.duration_minutes) || 60,
      coordination_time: parsed?.baseline?.coordination_time
        ? String(parsed.baseline.coordination_time)
        : undefined,
    },
    synthesis: parsed?.synthesis ? String(parsed.synthesis) : undefined,
  };
}

export async function GET() {
  return NextResponse.json({ live: Boolean(process.env.OPENAI_API_KEY) });
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;

  let body: { request?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request", error: "Invalid request body." }, { status: 400 });
  }

  const userRequest = (body.request ?? "").trim();
  if (userRequest.length < 8) {
    return NextResponse.json(
      { ok: false, code: "too_short", error: "Describe the work or meeting request in a little more detail." },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      {
        ok: false,
        code: "no_key",
        error:
          "Live analysis is off — no OPENAI_API_KEY found. Load the Q4 launch scenario to run the full offline demo.",
      },
      { status: 503 }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Work / meeting request:\n\n"""${userRequest}"""` },
        ],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          code: "upstream",
          error: `Live analysis failed (${res.status}). Falling back to the offline demo scenario.`,
          detail: detail.slice(0, 400),
        },
        { status: 502 }
      );
    }

    const payload = await res.json();
    const content: string = payload?.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content);
    const analysis = normalize(parsed);
    const scenario = buildScenarioFromAnalysis(userRequest, analysis);

    return NextResponse.json({ ok: true, analysis, scenario });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        ok: false,
        code: aborted ? "timeout" : "failed",
        error: aborted
          ? "Live analysis timed out. Falling back to the offline demo scenario."
          : "Live analysis could not be completed. Falling back to the offline demo scenario.",
      },
      { status: 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
