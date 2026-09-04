import { NextResponse } from "next/server";
import { buildScenarioFromAnalysis, type LiveAnalysis, type LiveQuestion } from "@/lib/derive";
import type { RouteId } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are SYNCLESS, an AI decision-routing layer for companies.

Given a work or meeting request, decide the cheapest path to a real decision and route it to exactly one of:
- "ai_handles_it": no human input is required; the answer already exists and no human needs to be accountable.
- "async_first": the answer exists across a few named owners; collect it asynchronously, synthesize it, draft the decision.
- "meeting": genuine disagreement or a trade-off that requires synchronous discussion.

Cost model: assume a blended cost of NT$150 per participant per 15 minutes of synchronous time.
"estimated_cost" is the cost of the meeting the requester ORIGINALLY asked for (the baseline), in TWD, as a plain number.

Reply with JSON only, matching exactly this shape:
{
  "route": "ai_handles_it" | "async_first" | "meeting",
  "necessity_score": 0-100,
  "information_sufficiency": 0-100,
  "reasoning": ["3-5 short, concrete sentences explaining the routing decision"],
  "estimated_cost": number,
  "cost_basis": "the arithmetic behind estimated_cost, e.g. 10 participants × 1.5 h × NT$900 blended hourly = NT$13,500",
  "recommended_participants": ["Role titles who must actually be involved"],
  "recommended_duration": number,
  "questions": [
    {
      "role": "Marketing",
      "question": "One concrete question for this role",
      "respondent_name": "A plausible person name",
      "respondent_title": "Their title",
      "simulated_answer": "A plausible, specific answer, 1-2 sentences",
      "responded_in": "12 min",
      "flag": {"kind": "constraint" | "conflict", "label": "Constraint detected", "effect": "What it changes about the decision"}
    }
  ],
  "decision": {
    "title": "Short decision brief title",
    "recommendation": "2-3 sentences stating the recommended decision",
    "owner": "The accountable role",
    "fields": [{"label": "Short label", "value": "Short value", "source": "Which role supplied it"}],
    "post_approval": ["3-4 concrete things SYNCLESS does the moment the brief is approved"]
  },
  "confidence": 0-100,
  "baseline": {"participants": number, "duration_minutes": number, "coordination_time": "e.g. 3-day coordination"},
  "synthesis": "One sentence summarizing what the collected answers established"
}

Rules: 2-4 questions. Add "flag" to at most one question — a constraint it introduces, or a conflict with another answer. Route to "meeting" when a real conflict exists. 3-5 decision fields. No markdown, no commentary — JSON only.`;

const VALID_ROUTES: RouteId[] = ["ai_handles_it", "async_first", "meeting"];

function clampScore(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(100, Math.max(0, Math.round(n)));
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => String(v)).filter((v) => v.trim().length > 0);
}

function normalize(parsed: any): LiveAnalysis {
  const route: RouteId = VALID_ROUTES.includes(parsed?.route) ? parsed.route : "async_first";

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

  const cost = Number(parsed?.estimated_cost);

  return {
    route,
    necessity_score: clampScore(parsed?.necessity_score, 50),
    information_sufficiency: clampScore(parsed?.information_sufficiency, 50),
    reasoning: asStringArray(parsed?.reasoning).slice(0, 6),
    estimated_cost: Number.isFinite(cost) && cost > 0 ? Math.round(cost) : 9000,
    cost_basis: parsed?.cost_basis ? String(parsed.cost_basis) : undefined,
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
