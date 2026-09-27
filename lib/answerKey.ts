import { LEVEL_LABEL, LINES } from "@/data/ladder";
import { CHURN_TRUTH, CUSTOMERS, CUST_BY_ID, PICK_WHY, VALUABLE_TRUTH } from "@/data/forecast";
import { MEANINGS, MEANING_TRUTH, MEASURE_TRUTH, PATTERNS, PATTERN_IDS, PMEASURES, RECORDS, RISK_LABEL, TRUTH_COUNTS, TRUTH_LEFT, UNCERTAINTIES, riskOf } from "@/data/patterns";
import { BUDGET, EVIDENCE_LABEL, MEASURES, MODEL_COST, MODEL_MEASURES, explainBucket, modelScore } from "@/data/measures";
import {
  ACTION_LABEL,
  ARCH_BY_ID,
  COMPS,
  COMP_BY_ID,
  CRIT_IDS,
  DECISIONS,
  KPIS,
  LOGIC_OWNER_LABEL,
  MODEL_ARCH,
  MODEL_COMPS,
  MODEL_DECISION,
  MODEL_GREATEST,
  MODEL_TRIPWIRE,
  OWNERS,
  OWNER_ACCEPT,
  OWNER_ACCEPT_LOGIC,
  PRINCIPLES,
  PRINCIPLE_IDS,
  PRINCIPLE_MUST,
  SITUATIONS,
  SOURCES,
  USE_LABEL,
  actionOf,
  maxRating,
  useOf,
} from "@/data/route2";
import type { ArchId } from "@/data/route2";
import { MODEL_ORDER } from "@/data/mentorKey";
import { euro } from "@/lib/lang";

/**
 * Mentor-only answer keys for the exercises where the learner picks from fixed options. Each key gives the expected answer and a
 * reason per option, including why each rejected option is rejected, plus a teaching note wherever more than one answer defends.
 * Never exported and never shown to a learner. Mentor tools stay in English (CLAUDE.md #32); the option labels they quote follow the
 * site's language.
 */
export type AnswerKeyOption = { label: string; expected: boolean; why: string };
export type AnswerKeyBlock = { title: string; expected: string; options: AnswerKeyOption[]; teachingNote?: string };

const B = ["—", "Low", "Mid", "High"];

/* ------------------------------------------------------------------ Route 1 */

export function sortKey(): AnswerKeyBlock {
  return {
    title: "Block 1.1 · Data, information or insight",
    expected: LINES.map((r, i) => `${i + 1} → ${LEVEL_LABEL[r.truth]}`).join(" · "),
    options: LINES.flatMap((r, i) => [
      { label: `Line ${i + 1} → ${LEVEL_LABEL[r.truth]}`, expected: true, why: r.why },
      ...(Object.entries(r.rejected) as [keyof typeof LEVEL_LABEL, string][]).map(([tag, why]) => ({ label: `Line ${i + 1} → ${LEVEL_LABEL[tag]}`, expected: false, why })),
    ]),
    teachingNote:
      "Three of each. Learners put the order line (€4,800) under information because it has numbers; numbers are not the test, comparison is. The ticket complaint sounds like a finding and is one entry. For information against insight, ask “so what?”: the three insights all contain a “so” or “which gives us”.",
  };
}

export function pickKey(): AnswerKeyBlock {
  return {
    title: "Block 1.3a/b · Most valuable and most at risk",
    expected: `Valuable: ${VALUABLE_TRUTH.map((c) => CUST_BY_ID[c].name).join(", ")} · At risk: ${CHURN_TRUTH.map((c) => CUST_BY_ID[c].name).join(", ")}`,
    options: CUSTOMERS.map((c) => ({
      label: `${c.name} · ${euro(c.revenue)} · ${c.orders} orders · ${c.days} days · ${c.trend > 0 ? "+" : ""}${c.trend}%`,
      expected: VALUABLE_TRUTH.includes(c.id) || CHURN_TRUTH.includes(c.id),
      why: `${VALUABLE_TRUTH.includes(c.id) ? "Valuable. " : CHURN_TRUTH.includes(c.id) ? "At risk. " : ""}${PICK_WHY[c.id]}`,
    })),
    teachingNote: "The two traps are Contor Handel (most orders, least revenue: frequency is not value) and Eifel Energie (150 days without an order, but usage up 30%: a cycle, not churn). Fuchs Maschinen (€30,000) is fairly valuable and at risk; it belongs in the churn list, because Delta and Alpen earn more. The check reports only how many of the four picks hold.",
  };
}

export function tagKey(): AnswerKeyBlock {
  return {
    title: "Block 2.1 · Pattern per record",
    expected: RECORDS.map((o) => `${o.code} → ${PATTERNS[o.truth].label}`).join(" · "),
    options: RECORDS.flatMap((o) => [
      { label: `${o.code} → ${PATTERNS[o.truth].label}`, expected: true, why: o.why },
      ...(Object.entries(o.rejected) as [keyof typeof PATTERNS, string][]).map(([s, why]) => ({ label: `${o.code} → ${PATTERNS[s].label}`, expected: false, why })),
    ]),
    teachingNote: `${PATTERN_IDS.map((p) => `${TRUTH_COUNTS[p]} ${PATTERNS[p].label} (${TRUTH_LEFT[p]} left)`).join(", ")}. K-163 is the trap: it stayed, but its behaviour before the call was a sharp fall, so it is fading. The cyclical records look like churn in a single month and all stayed.`,
  };
}

export function rowKey(): AnswerKeyBlock {
  return {
    title: "Block 2.2 · Risk, meaning and measure per pattern",
    expected: PATTERN_IDS.map((p) => `${PATTERNS[p].label}: ${RISK_LABEL[riskOf(TRUTH_LEFT[p], TRUTH_COUNTS[p])!]} · ${MEANINGS.find((m) => m.id === MEANING_TRUTH[p])!.label} · ${PMEASURES.find((m) => m.id === MEASURE_TRUTH[p])!.label}`).join(" | "),
    options: PATTERN_IDS.flatMap((p) =>
      PMEASURES.map((m) => ({
        label: `${PATTERNS[p].label} → ${m.label}`,
        expected: m.id === MEASURE_TRUTH[p],
        why:
          m.id === MEASURE_TRUTH[p]
            ? `${PATTERNS[p].means} This measure answers exactly that.`
            : m.id === "discount"
              ? "A discount answers no pattern: it pays anchored customers who would stay and does nothing for a customer who never got value."
              : "This measure answers a different pattern; read what this pattern says about the customer.",
      })),
    ),
    teachingNote: "The risk is checked against the learner's own tally from 2.1, not against the reference, so a learner who mis-tagged one record is not punished twice. With the reference tags, fading and dormant are High (2 of 3 left), anchored and cyclical Low (none left).",
  };
}

export function uncKey(): AnswerKeyBlock {
  return {
    title: "Block 2.2 · Uncertainties in the forecast",
    expected: UNCERTAINTIES.filter((w) => w.real).map((w) => w.label).join(" · "),
    options: UNCERTAINTIES.map((w) => ({ label: w.label, expected: w.real, why: w.why })),
    teachingNote: "Any two of the four real uncertainties complete the block. The three false ones are common beliefs about data; each is contradicted by something in the case (the cyclical customers, the fading customers who were once high, the purchased data with no decision behind it).",
  };
}

export function measureKey(): AnswerKeyBlock {
  const rows = [...MEASURES].sort((a, b) => modelScore(b.id) - modelScore(a.id));
  return {
    title: "Block 2.3 · The three measures",
    expected: `${MODEL_MEASURES.map((id) => MEASURES.find((m) => m.id === id)!.name).join(", ")} · ${euro(MODEL_COST)} of ${euro(BUDGET)}`,
    options: rows.map((m) => ({
      label: `${m.name} · ${explainBucket(m.evidence)} × ${m.model.feasibility} × ${m.model.effect} = ${modelScore(m.id)} · ${euro(m.cost)} · rests on ${EVIDENCE_LABEL[m.evidence]} · serves ${m.targets.length ? m.targets.map((t) => PATTERNS[t].label).join(", ") : "none"}`,
      expected: MODEL_MEASURES.includes(m.id),
      why: `${m.verdict} ${m.model.note}`,
    })),
    teachingNote: `The checks look only at the patterns named (a subset of the real ones, or “none” for the big data set and the discount) and at explanatory power, which follows from the printed evidence. Feasibility and effect are judged; the model values are here. The expansion offers (12) fit the budget too: ${euro(MODEL_COST)} + €20,000 = ${euro(MODEL_COST + 20000)}. A learner who swaps the health score for them is choosing growth over churn; accept it only if the why says so.`,
  };
}

export function orderKey(): AnswerKeyBlock {
  return {
    title: "Block 2.3 · The order",
    expected: MODEL_ORDER.map((id) => MEASURES.find((m) => m.id === id)!.name).join(" → "),
    options: MODEL_ORDER.map((id, i) => ({
      label: `${i + 1}. ${MEASURES.find((m) => m.id === id)!.name} (${modelScore(id)})`,
      expected: true,
      why: i === 0 ? "Acts on the €327,600 at risk from customers whose usage is falling now." : i === 1 ? "Makes the same patterns visible to every account manager; quick to build (six weeks)." : "Needs eight weeks and acts on new customers, so its effect arrives last.",
    })),
    teachingNote: "All three score 18, so no order is an inversion. The order is judged on the why: the revenue at risk it answers first, or the time it needs. Any order with such a reason defends.",
  };
}

/* ------------------------------------------------------------------ Route 2 */

export function principleKey(): AnswerKeyBlock {
  return {
    title: "Block 3.1 · Principles of the data-driven organisation",
    expected: `${PRINCIPLES[PRINCIPLE_MUST[0]].name} and ${PRINCIPLES[PRINCIPLE_MUST[1]].name}, plus a third that is not hoarding or a black box`,
    options: PRINCIPLE_IDS.map((c) => ({
      label: PRINCIPLES[c].name,
      expected: PRINCIPLE_MUST.includes(c) || c === "owners" || c === "review",
      why:
        c === "defs"
          ? "Required: without shared definitions of active customer and churn, every later number is argued about."
          : c === "rules"
            ? "Required: it turns dashboards into decisions, the same way whoever is on duty."
            : c === "owners"
              ? "A good third: varying data quality is the brief's constraint, and a named owner per source is how it improves."
              : c === "review"
                ? "A good third: forecasts only improve when they are checked against outcomes."
                : c === "hoard"
                  ? "Rejected: data collected without a decision is cost and noise, and against data minimisation (GDPR Art. 5)."
                  : "Rejected: a forecast nobody can explain cannot be checked or trusted, and fully automated decisions about customers are limited by GDPR Art. 22.",
    })),
    teachingNote: "The check only asks for shared definitions and decision rules. The third is judged; data owners and forecast review both defend.",
  };
}

export function sourceKey(): AnswerKeyBlock {
  return {
    title: "Block 3.2 · Core, later or leave out",
    expected: SOURCES.map((s) => `${s.name.split(" (")[0]}: ${USE_LABEL[useOf(s)]}`).join(" · "),
    options: SOURCES.map((s) => ({
      label: `${s.name} → ${USE_LABEL[useOf(s)]}`,
      expected: true,
      why: !s.decision ? `No decision is named, so it is left out, however complete (${s.complete}%) or cheap.` : s.complete >= 80 ? `A decision uses it (${s.decision.toLowerCase()}) and it is ${s.complete}% complete: core.` : `A decision would use it (${s.decision.toLowerCase()}), but only ${s.complete}% is complete: fix first.`,
    })),
    teachingNote: "The purchased market data is the trap: 85% complete and expensive, and no decision SmartData makes today uses it. The CRM notes are the other: they matter, but half are empty.",
  };
}

export function compKey(): AnswerKeyBlock {
  return {
    title: "Block 3.3 · Components and ratings",
    expected: `${MODEL_COMPS.map((id) => COMP_BY_ID[id].name).join(", ")}; greatest leverage: ${COMP_BY_ID[MODEL_GREATEST].name}`,
    options: COMPS.map((l) => ({
      label: `${l.name}: ${CRIT_IDS.map((c) => `${c} ${B[l.model[c]]} (max ${B[maxRating(l.id, c)]})`).join(", ")}`,
      expected: MODEL_COMPS.includes(l.id),
      why: l.note,
    })),
    teachingNote: "The check flags only a rating above what the printed facts allow and counts how many chosen components warn early. The health score is the model's greatest lever: High on all four. A learner who picks the early-warning rules as greatest defends it on timeliness; ask what it says about why a customer is at risk.",
  };
}

export function logicKey(): AnswerKeyBlock {
  return {
    title: "Block 3.4 · When to intervene",
    expected: SITUATIONS.map((s) => `${s.signal}: ${ACTION_LABEL[actionOf(s)]} · ${OWNER_ACCEPT_LOGIC[s.id].map((o) => LOGIC_OWNER_LABEL[o]).join(" or ")}`).join(" | "),
    options: SITUATIONS.map((s) => ({
      label: `${s.signal} (lift ${s.lift}, ${s.cases} cases)`,
      expected: true,
      why:
        actionOf(s) === "intervene"
          ? `Lift ${s.lift} over ${s.cases} cases: strong and proven. ${s.id === "renewal" ? "A renewal is a commercial decision, so sales (or customer success) acts." : "It is about use, so customer success acts."}`
          : actionOf(s) === "watch"
            ? s.lift >= 3
              ? `Lift ${s.lift} looks strong, but ${s.cases} cases are too few: watch; the data team re-checks it.`
              : `Lift ${s.lift}: a moderate difference. Watch; the data team re-checks it.`
            : `Lift ${s.lift}: no real difference. No action, so no owner.`,
    })),
    teachingNote: "The payment delay is the trap: a lift of 3.5 tempts learners to intervene, but twelve cases can be chance. The project customer is the second: a long gap that returns every year is not a churn signal.",
  };
}

export function ownerKey(funded: ArchId[]): AnswerKeyBlock {
  const ids = funded.length ? funded : MODEL_ARCH;
  return {
    title: "Block 3.5 · Owners, sequence and funding",
    expected: `Model: ${MODEL_ARCH.map((id) => `${ARCH_BY_ID[id].name} (${OWNERS[OWNER_ACCEPT[id][0]].name})`).join(", ")} · ${euro(MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0))}`,
    options: ids.map((id) => ({
      label: `${ARCH_BY_ID[id].name} → ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}`,
      expected: true,
      why:
        id === "foundation"
          ? "Head of Data (or IT, who owns the interfaces). It starts first: every score and trigger reads from it."
          : id === "ai"
            ? "A black box: nobody can say why it flags a customer. Funding it breaks the third rule; the check flags it."
            : id === "feed"
              ? "No decision needs it (Block 3.2 leaves the same data out), and €50,000 would push the plan over."
              : `The owner who can change it without asking anyone: ${OWNERS[OWNER_ACCEPT[id][0]].profile}`,
    })),
    teachingNote: "The check tests three rules: the data foundation starts no later than the first other item, total within €180,000, nothing funded is a black box. Owners are not checked by the app; use this key. Leaving out the training instead of the quality drive defends if the learner argues that the CRM notes matter more now.",
  };
}

export function decisionKey(): AnswerKeyBlock {
  return {
    title: "Block 3.6 · The decision",
    expected: DECISIONS.find((d) => d.id === MODEL_DECISION)!.label,
    options: DECISIONS.map((d) => ({ label: d.label, expected: d.id !== "wait", why: d.id === MODEL_DECISION ? d.why : d.id === "commit" ? `${d.why} ${d.rejected}` : d.rejected })),
    teachingNote: "“Build it all now” and “Stage it” both defend with different reasoning; the check outlines only “Wait”, because the brief asks for a decision despite uncertain data.",
  };
}

export function tripKey(): AnswerKeyBlock {
  const k = KPIS.find((x) => x.id === MODEL_TRIPWIRE.kpi)!;
  return {
    title: "Block 3.6 · The tripwire",
    expected: `${k.label} ≥ ${MODEL_TRIPWIRE.threshold}% by month ${MODEL_TRIPWIRE.month}, else adjust one rule`,
    options: KPIS.map((x) => ({ label: `${x.label} (baseline ${x.baseline}${x.unit === "%" ? "%" : ` ${x.unit}`})`, expected: x.behaviour, why: x.behaviour ? "How customers behave: the result the architecture is meant to move." : "Measures the data team's own output, not how customers responded." })),
    teachingNote: "Any customer metric with a threshold better than its baseline defends. Dashboards in use is the tempting one: it is a good trigger for the training item in 3.5, and the wrong tripwire for the decision.",
  };
}
