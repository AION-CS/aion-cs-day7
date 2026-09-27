import { FORECAST, SMART } from "@/data/forecast";
import type { FigureId } from "@/data/forecast";
import { BUDGET, EVIDENCE_LABEL, MEASURE_BY_ID, MODEL_COST, MODEL_MEASURES, explainBucket, modelScore } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { PATTERNS } from "@/data/patterns";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { ARCH_BY_ID, COMP_BY_ID, MODEL_ARCH, MODEL_GREATEST, MODEL_TRIGGER, OWNERS, OWNER_ACCEPT, PRINCIPLES, R2_BUDGET } from "@/data/route2";
import type { ArchId, PrincipleId } from "@/data/route2";
import { euro } from "@/lib/lang";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover: the numeric fields,
 * with every step of the calculation written out with its numbers, and the free-text answers, with the model text and what a good
 * answer must contain. Shown only after the mentor bar is unlocked, never exported. Numbers are computed from the same constants as
 * the tables, the calculators and the answer checks, so they cannot drift from the model answers. Mentor tools stay English
 * (CLAUDE.md #32); the model answers quoted follow the site's language, because the fill enters them in that language.
 */
export type WorkedStep = { label: string; calc: string; result: string };
export type MentorGuide = { title: string; answer: string; steps?: WorkedStep[]; why?: string; lookFor?: string[]; pitfalls?: string[] };

const n = (v: number) => (Math.round(v * 100) / 100).toLocaleString("en-US");
const L1 = () => KEY_L1();
const R2 = () => KEY_R2();

/* ------------------------------------------------------------------ Route 1 */

export function extraInsightGuide(): MentorGuide {
  return {
    title: "1.1 · An insight of your own",
    answer: L1().extraInsight ?? "",
    why: "Any statement that goes beyond “what happened” to “so what” is an insight; it must rest on something in the case.",
    lookFor: ["A fact or a line of information from the case.", "What it means or what to do (“so …”, “which means …”).", "Specific customers or a specific action, not a general truth."],
    pitfalls: ["A restated line of information (“logins fell 12%”): ask “so what?”.", "An opinion with no data behind it (“customers want more attention”)."],
  };
}

export function figureGuide(id: FigureId): MentorGuide {
  const fall = SMART.falling;
  const stable = SMART.stable;
  if (id === "F1")
    return {
      title: "1.2 · F1 Churn rate, usage fell",
      answer: n(FORECAST.f1),
      steps: [
        { label: "Leavers in the group ÷ customers in the group", calc: `${fall.left} ÷ ${fall.customers}`, result: n(fall.left / fall.customers) },
        { label: "× 100", calc: `${n(fall.left / fall.customers)} × 100`, result: `${n(FORECAST.f1)}%` },
      ],
      why: "Both numbers come from the same row: of 40 customers whose usage fell, 14 left.",
      pitfalls: [`Share left out (0.35 typed instead of 35): ${n(fall.left / fall.customers)}.`, `Divided by all 400 customers: ${n((fall.left / (fall.customers + stable.customers)) * 100)}.`, `This quarter's 52 used instead of 40: ${n((fall.left / SMART.fallingNow) * 100)}.`],
    };
  if (id === "F2")
    return {
      title: "1.2 · F2 Lift",
      answer: n(FORECAST.f2),
      steps: [
        { label: "Churn rate of everyone else", calc: `${stable.left} ÷ ${stable.customers} × 100`, result: `${n(FORECAST.stableRate)}%` },
        { label: "Lift = F1 ÷ that rate", calc: `${n(FORECAST.f1)} ÷ ${n(FORECAST.stableRate)}`, result: n(FORECAST.f2) },
      ],
      why: "Customers whose usage fell left seven times as often as the others: that is what makes falling usage a signal worth acting on.",
      pitfalls: [`Divided by the overall rate (32 of 400 = 8%): ${n(FORECAST.f1 / 8)}.`, `Subtracted instead of divided (35 − 5): 30.`, `Divided the counts (14 ÷ 18): ${n(14 / 18)}.`],
    };
  const rev = SMART.fallingNow * (FORECAST.f1 / 100);
  return {
    title: "1.2 · F3 Revenue at risk",
    answer: n(FORECAST.f3),
    steps: [
      { label: "Expected leavers this year", calc: `${SMART.fallingNow} × ${FORECAST.f1 / 100}`, result: n(rev) },
      { label: "× average yearly revenue", calc: `${n(rev)} × ${n(SMART.revenue)}`, result: euro(FORECAST.f3) },
    ],
    why: "About 18 of this quarter's 52 fading customers would leave at last year's rate; each brings €18,000 a year.",
    pitfalls: [`Last year's 40 instead of this quarter's 52: ${n(40 * 0.35 * SMART.revenue)}.`, `Rate not turned into a share (52 × 35 × 18,000): ${n(52 * 35 * SMART.revenue)}.`, `All 52 counted as lost: ${n(52 * SMART.revenue)}.`],
  };
}

export function meaningGuide(): MentorGuide {
  return {
    title: "1.2 · What the forecast means",
    answer: L1().meaning ?? "",
    lookFor: ["At least one of the learner's own figures (35%, 7 times, €327,600, or 5%).", "What it means: falling usage is the signal to act on first.", "Said as an estimate, not a certainty."],
    pitfalls: ["A sentence with no figure: the app asks for one.", "“€327,600 will be lost”: it is at risk, not certain."],
  };
}

export function insightGuide(i: number): MentorGuide {
  const a = (L1().insights ?? [])[i];
  return {
    title: `1.3 · Insight ${i + 1}`,
    answer: a ? `${a.basis ?? ""} · ${a.text}` : "",
    why: "Three insights on three different kinds of data, so they can be checked apart. The app checks only that each has a data basis, is long enough and draws a conclusion.",
    lookFor: ["What the data shows, named with a customer or a group from the table.", "The kind of data it rests on (frequency, time between purchases, service use).", "A conclusion: what it means or what to do."],
    pitfalls: ["Frequency read as value (Contor orders most, earns least).", "A long gap read as churn without looking at the usage trend (Eifel)."],
  };
}

export function reflectGuide(k: "interpret" | "causation" | "decider"): MentorGuide {
  const r = L1().reflect;
  return {
    title: k === "interpret" ? "1.4 · Why data needs interpretation" : k === "causation" ? "1.4 · Correlation or causation" : "1.4 · How a data-driven decision-maker proceeds",
    answer: r ? r[k] : "",
    lookFor:
      k === "interpret"
        ? ["Something the learner met in 1.1 to 1.3 (a line, a figure, a customer).", "The idea that data answers “what”, interpretation answers “so what”."]
        : k === "causation"
          ? ["A concrete link in SmartData's data that might not be a cause.", "The assumption being made, and what would be done wrong if it is false."]
          : ["Starts from the decision.", "Checks the number of cases or the quality.", "Knows when not to use the data (a cycle, a small sample)."],
  };
}

export function misreadGuide(): MentorGuide {
  return {
    title: "2.2 · A pattern you could misread",
    answer: L1().misread ?? "",
    lookFor: ["Two patterns that can be confused (usually cyclical and fading, or dormant and fading).", "What would go wrong.", "A sign in the data that would show it (the same months last year, whether use was ever high)."],
    pitfalls: ["A general statement (“data can be wrong”): ask for one pattern and one sign."],
  };
}

export function scoreGuide(id: MeasureId): MentorGuide {
  const m = MEASURE_BY_ID[id];
  const e = explainBucket(m.evidence);
  return {
    title: `2.3 · ${m.name}`,
    answer: `${e} × ${m.model.feasibility} × ${m.model.effect} = ${modelScore(id)}`,
    steps: [
      { label: "Explanatory power from the evidence (A7)", calc: `rests on ${EVIDENCE_LABEL[m.evidence]} → pattern 3 · some 2 · hunch 1`, result: String(e) },
      { label: "Score", calc: `${e} × ${m.model.feasibility} × ${m.model.effect}`, result: String(modelScore(id)) },
    ],
    why: `${m.model.note} Serves: ${m.targets.length ? m.targets.map((t) => PATTERNS[t].label).join(", ") : "no pattern"}.`,
    pitfalls:
      id === "blackbox"
        ? ["Explanatory power 3 “because AI is precise”: the evidence is the vendor's case studies, and the model shows no reasons: 1."]
        : id === "bigdata"
          ? ["Serving every pattern “because it is so much data”: it describes companies in general, not how they use SmartData."]
          : id === "calendar"
            ? ["Explanatory power 3: three customers is some evidence, not a pattern across many: 2."]
            : undefined,
  };
}

export function whyGuide(): MentorGuide {
  return {
    title: "2.3 · Why the first priority goes first",
    answer: L1().why ?? "",
    steps: [
      { label: "Model plan cost", calc: MODEL_MEASURES.map((id) => n(MEASURE_BY_ID[id].cost)).join(" + "), result: euro(MODEL_COST) },
      { label: "Left of the budget", calc: `${n(BUDGET)} − ${n(MODEL_COST)}`, result: euro(BUDGET - MODEL_COST) },
    ],
    lookFor: ["The order and what decides it (the revenue at risk from 1.2, or the time a measure needs).", "The cost against €160,000.", "What was left out, said as a decision."],
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function principleTextGuide(c: PrincipleId): MentorGuide {
  return {
    title: `3.1 · ${PRINCIPLES[c].name}`,
    answer: (R2().principleText ?? {})[c] ?? PRINCIPLES[c].means,
    lookFor: ["What changes for SmartData's teams or customers.", "Which problem of the brief it answers (decisions from experience, data not used, varying quality)."],
    pitfalls: c === "hoard" || c === "blackbox" ? ["This principle is one the key rejects; if the learner kept it, ask which decision it serves, or who could explain the forecast."] : undefined,
  };
}

export function greatestGuide(): MentorGuide {
  return {
    title: "3.3 · The component with the greatest leverage",
    answer: `${COMP_BY_ID[MODEL_GREATEST].name} · ${R2().greatestWhy ?? ""}`,
    lookFor: ["One of the learner's three components.", "The tests that decide it (usually explanatory power and reach together).", "The problem of the brief it answers."],
    pitfalls: ["The AI service as greatest “because it is daily”: it cannot say why, so nobody acts on it."],
  };
}

export function triggerGuide(id: ArchId): MentorGuide {
  const model = MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER];
  return {
    title: `3.5 · ${ARCH_BY_ID[id].name}`,
    answer: model ?? "A metric, a number, a date and an action for this item.",
    why: `Owner that defends: ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}.`,
    lookFor: ["A metric about the item's effect.", "A number and a month.", "An action the owner can take alone."],
  };
}

export function postponedGuide(): MentorGuide {
  const cost = MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
  return {
    title: "3.5 · What is left out, and the pickup point",
    answer: `${R2().postponed} · ${R2().pickup}`,
    steps: [
      { label: "Model funded items", calc: MODEL_ARCH.map((id) => n(ARCH_BY_ID[id].cost)).join(" + "), result: euro(cost) },
      { label: "Left", calc: `${n(R2_BUDGET)} − ${n(cost)}`, result: euro(R2_BUDGET - cost) },
      { label: "With the AI platform added", calc: `${n(cost)} + ${n(ARCH_BY_ID.ai.cost)}`, result: euro(cost + ARCH_BY_ID.ai.cost) },
    ],
    lookFor: ["The item named, with its cost.", "Why this one (budget, a black box, no decision needs it).", "A pickup point with a number and a date."],
  };
}

export function assumptionGuide(i: number): MentorGuide {
  return {
    title: `3.6 · Assumption ${i + 1}`,
    answer: (R2().assumptions ?? [])[i] ?? "",
    lookFor: ["What is assumed about the data, the customers or the teams.", "The sign that would show it is wrong, with a number or a date."],
  };
}

export function challengeGuide(): MentorGuide {
  return {
    title: "3.6 · The board's challenge",
    answer: R2().challenge ?? "",
    why: "Fifteen false alarms out of 60 came from one missing rule (project customers in their quiet months), which the decision logic of 3.4 already names. The other 45 are the customers experience missed. Fix the rule; do not drop the programme.",
    lookFor: ["What is checked first (the 15 flags: which rule produced them?).", "What is kept (the programme, the tripwire date).", "One change: the filter for project customers."],
    pitfalls: ["Accepting the Head of Sales' proposal: it returns to the blind spot the case started with.", "Dismissing the complaints without changing the rule."],
  };
}


