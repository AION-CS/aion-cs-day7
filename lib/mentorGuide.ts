import { FORECAST, SMART } from "@/data/forecast";
import type { FigureId } from "@/data/forecast";
import { BUDGET, EVIDENCE_LABEL, MEASURE_BY_ID, MODEL_COST, MODEL_MEASURES, explainBucket, modelScore } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { PATTERNS } from "@/data/patterns";
import { KEY_L1, KEY_R2 } from "@/data/mentorKey";
import { ARCH_BY_ID, BOARD_FACTS, COMP_BY_ID, CUSTOMER_ITEMS, MODEL_ARCH, MODEL_GREATEST, MODEL_START, MODEL_TRIGGER, MODEL_TRIPWIRE, OWNERS, OWNER_ACCEPT, PRINCIPLES, R2_BUDGET, R2_FIG } from "@/data/route2";
import type { ArchId, PrincipleId } from "@/data/route2";
import { modelR2, numberView, tripMonth } from "@/lib/calcR2";
import { euro, tt } from "@/lib/lang";

/**
 * Mentor-only worked answers for every task question the answer keys (lib/answerKey.ts) do not already cover: the numeric fields,
 * with every step of the calculation written out with its numbers, and the free-text answers, with the model text and what a good
 * answer must contain. Shown only after the mentor bar is unlocked, never exported. Numbers are computed from the same constants as
 * the tables, the calculators and the answer checks, so they cannot drift from the model answers. Mentor tools stay English
 * (CLAUDE.md #32); the model answers quoted follow the site's language, because the fill enters them in that language.
 */
export type WorkedStep = { label: string; calc: string; result: string };
/**
 * `example` (CLAUDE.md #23, second update): a learner-facing worked example for a field whose `answer` is the case's own calculated result
 * or a graded pick. Same method, different company and different numbers, written in the site's language; `ExampleAnswer` shows it
 * instead of `answer`. The mentor's own worked answer always reads `answer`.
 */
export type MentorGuide = { title: string; answer: string; example?: string; steps?: WorkedStep[]; why?: string; lookFor?: string[]; pitfalls?: string[] };

/** The model plan of Route 2: six funded items with their start months, so every worked answer shows the same numbers the model answer uses. */
const MODEL_STATE = () =>
  modelR2(
    Object.fromEntries(MODEL_ARCH.map((id) => [id, true])),
    Object.fromEntries(MODEL_ARCH.map((id) => [id, MODEL_START[id] ?? 1])),
  );

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
    example: tt(
      "Company A's customers whose usage fell left 4 times as often as the rest (24% against 6%). With 30 such customers this quarter, about €97,200 of yearly revenue is at risk (30 × 0.24 × €13,500), so falling usage is the signal to act on first. This is an estimate that assumes this year's customers behave like last year's. Run the same steps on your own F1, F2 and F3.",
      "Die Kunden von Unternehmen A mit gesunkener Nutzung gingen 4-mal so oft wie die übrigen (24 % gegenüber 6 %). Bei 30 solchen Kunden in diesem Quartal sind etwa 97.200 € Jahresumsatz gefährdet (30 × 0,24 × 13.500 €), also ist sinkende Nutzung das Signal, auf das zuerst reagiert wird. Das ist eine Schätzung, die annimmt, dass sich die Kunden dieses Jahres wie die des letzten verhalten. Wenden Sie dieselben Schritte auf Ihr eigenes F1, F2 und F3 an.",
    ),
    lookFor: ["At least one of the learner's own figures (35%, 7 times, €327,600, or 5%).", "What it means: falling usage is the signal to act on first.", "Said as an estimate, not a certainty."],
    pitfalls: ["A sentence with no figure: the app asks for one.", "“€327,600 will be lost”: it is at risk, not certain."],
  };
}

export function insightGuide(i: number): MentorGuide {
  const a = (L1().insights ?? [])[i];
  return {
    title: `1.3 · Insight ${i + 1}`,
    answer: a ? `${a.basis ?? ""} · ${a.text}` : "",
    example: [
      tt(
        "Company A's most frequent buyer, Nordstern, orders 30 times a year but brings only €6,000, so order frequency alone must not decide whom we look after most. Write yours on SmartData's own customers.",
        "Der häufigste Käufer von Unternehmen A, Nordstern, bestellt 30-mal im Jahr, bringt aber nur 6.000 €, also darf die Bestellhäufigkeit allein nicht entscheiden, wen wir am meisten betreuen. Schreiben Sie Ihren über die eigenen Kunden von SmartData.",
      ),
      tt(
        "Company A's customer Kranich has not ordered for 140 days but its usage is up 25%, so a long gap alone is no alarm and we compare each gap with the customer's own rhythm. Write yours on SmartData's own customers.",
        "Der Kunde Kranich von Unternehmen A hat seit 140 Tagen nicht bestellt, aber seine Nutzung ist um 25 % gestiegen, also ist ein langer Abstand allein kein Alarm, und wir vergleichen jeden Abstand mit dem eigenen Rhythmus des Kunden. Schreiben Sie Ihren über die eigenen Kunden von SmartData.",
      ),
      tt(
        "Company A's customers Mühlbach and Riedel use only one service each and both are cooling down, so a second service in the first months is where we should put our effort. Write yours on SmartData's own customers.",
        "Die Kunden Mühlbach und Riedel von Unternehmen A nutzen je nur einen Service und kühlen beide ab, also sollten wir unsere Mühe auf einen zweiten Service in den ersten Monaten richten. Schreiben Sie Ihren über die eigenen Kunden von SmartData.",
      ),
    ][i],
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
    example: tt(
      "Company A puts the call list first: it acts on the €72,000 of yearly revenue at risk from customers whose usage is falling now. The tax-season calendar comes second, because it stops false alarms for project customers. Together they cost €33,000 of the €60,000; the gift boxes stay out, because nothing in the data says gifts keep customers. Make the same three statements about your own three measures.",
      "Unternehmen A setzt die Anrufliste an die erste Stelle: Sie wirkt auf die 72.000 € Jahresumsatz, die bei Kunden mit jetzt sinkender Nutzung gefährdet sind. Der Steuersaison-Kalender kommt zweiter, weil er Fehlalarme bei Projektkunden verhindert. Zusammen kosten sie 33.000 € von 60.000 €; die Geschenkboxen bleiben draußen, weil nichts in den Daten sagt, dass Geschenke Kunden halten. Machen Sie dieselben drei Aussagen über Ihre eigenen drei Maßnahmen.",
    ),
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
    example: tt(
      "At Company A the weekly usage dashboard has the greatest leverage: it scores high on all four tests, covers every customer every week and shows why a customer is flagged, so the account managers can trust it and act on it. The yearly survey is late and covers only those who answer. Name the tests that decide it for your own three components.",
      "Bei Unternehmen A hat das wöchentliche Nutzungsdashboard die größte Hebelwirkung: Es ist auf allen vier Tests hoch, deckt jeden Kunden jede Woche ab und zeigt, warum ein Kunde markiert wird, sodass die Account Manager ihm vertrauen und danach handeln können. Die jährliche Befragung ist spät und deckt nur die ab, die antworten. Nennen Sie die Tests, die es für Ihre eigenen drei Bausteine entscheiden.",
    ),
    lookFor: ["One of the learner's three components.", "The tests that decide it (usually explanatory power and reach together).", "The problem of the brief it answers."],
    pitfalls: ["The AI service as greatest “because it is daily”: it cannot say why, so nobody acts on it."],
  };
}

/** The example every trigger field shows: another company, another item, the same four parts and the same way of finding the numbers. */
const triggerExample = () =>
  tt(
    "Company A's support training: “If fewer than 4 of the 6 support agents use the new ticket tags by month 4, then the training is repeated in the team meeting.” The 4 is two thirds of 6, rounded up; month 4 is the start in month 2, plus 1 month of set-up, plus 1 month until the effect shows. Find the numbers for your own item in the printed figures.",
    "Die Support-Schulung von Unternehmen A: „Nutzen bis Monat 4 weniger als 4 der 6 Support-Mitarbeiter die neuen Ticket-Tags, wird die Schulung im Teammeeting wiederholt.“ Die 4 sind zwei Drittel von 6, aufgerundet; Monat 4 ist der Start in Monat 2, plus 1 Monat Einrichtung, plus 1 Monat, bis die Wirkung sichtbar ist. Finden Sie die Zahlen für Ihren eigenen Punkt in den gedruckten Zahlen.",
  );

const monthSteps = (id: ArchId, s = MODEL_STATE()): WorkedStep[] => {
  const mv = numberView(`month-${id}`, s);
  return [{ label: "Month it can first be read = start + set-up (weeks ÷ 4, rounded up) + months until the effect shows", calc: mv.show, result: `month ${mv.result}` }];
};

export function triggerGuide(id: ArchId): MentorGuide {
  const model = MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER];
  const s = MODEL_STATE();
  const nv = numberView(`trig-${id}`, s);
  const a = ARCH_BY_ID[id];
  return {
    title: `3.5 · ${a.name}`,
    answer: model ?? "A metric, a number, a date and an action for this item.",
    example: triggerExample(),
    steps: [{ label: `The number: ${a.counts}`, calc: nv.show, result: String(nv.result) }, ...monthSteps(id, s)],
    why: `${nv.why} Owner that defends: ${OWNER_ACCEPT[id].map((o) => OWNERS[o].name).join(" or ")}.`,
    lookFor: ["A metric about customers or a result, not about the team's own activity.", "A number the printed figures support, and a month no earlier than the item can be read.", "An action the owner can take alone that changes this one item.", "A different number or month is fine when the learner says why (decision part)."],
    pitfalls: ["A round number with no source (“90% sounds right”): ask where it comes from.", "A month earlier than start + set-up: the item is not in use yet."],
  };
}

export function postponedGuide(): MentorGuide {
  const cost = MODEL_ARCH.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
  const pk = numberView("pickup-ai", MODEL_STATE());
  return {
    title: "3.5 · What is left out, and the pickup point",
    answer: `${R2().postponed} · ${R2().pickup}`,
    example: tt(
      "Company A leaves out the external data feed (€45,000). The two funded items already cost €60,000 of the €75,000, the feed would push the plan €30,000 over, and nothing in it says how customers use Company A, so no decision would change. “If 3 or more customers cancel by month 6 because their company situation was visible only in outside data, then we fund the feed from the next budget round.” The 3 is €45,000 ÷ €15,000 revenue per customer, rounded up. Name your own left-out item, its cost and its reason.",
      "Unternehmen A lässt den externen Daten-Feed weg (45.000 €). Die zwei finanzierten Punkte kosten schon 60.000 € von 75.000 €, der Feed brächte den Plan 30.000 € über das Budget, und nichts darin sagt, wie Kunden Unternehmen A nutzen, also würde sich keine Entscheidung ändern. „Kündigen bis Monat 6 mindestens 3 Kunden, weil die Lage ihres Unternehmens nur in externen Daten sichtbar war, finanzieren wir den Feed aus der nächsten Budgetrunde.“ Die 3 sind 45.000 € ÷ 15.000 € Umsatz pro Kunde, aufgerundet. Nennen Sie Ihren eigenen weggelassenen Punkt, seine Kosten und seinen Grund.",
    ),
    steps: [
      { label: "Model funded items", calc: MODEL_ARCH.map((id) => n(ARCH_BY_ID[id].cost)).join(" + "), result: euro(cost) },
      { label: "Left", calc: `${n(R2_BUDGET)} − ${n(cost)}`, result: euro(R2_BUDGET - cost) },
      { label: "With the AI platform added", calc: `${n(cost)} + ${n(ARCH_BY_ID.ai.cost)}`, result: euro(cost + ARCH_BY_ID.ai.cost) },
      { label: "Pickup number: cost of waiting = item cost ÷ yearly revenue of one customer", calc: pk.show, result: String(pk.result) },
    ],
    why: "Waiting costs what the customers lost for that reason would have paid in a year. When that equals the item's cost, the item is worth buying after all.",
    lookFor: ["The item named, with its cost.", "Why this one (budget, a black box, no decision needs it).", "A pickup point with a number, a month and the reason that counts (only leavers the item would have kept).", "Going over the budget is allowed with a stated reason (decision part)."],
  };
}

export function assumptionGuide(i: number): MentorGuide {
  const s = MODEL_STATE();
  const health = numberView("trig-health", s);
  const found = numberView("trig-foundation", s);
  const trip = numberView("trip", s);
  const tm = tripMonth(s);
  const detail = [
    {
      doubt: `The usage rule rests on ${R2_FIG.groupFell} customers last year (printed in “SmartData today”).`,
      bets: "The health score and the early-warning rules (€35,000).",
      steps: [{ label: "Sign = the health trigger: share of leavers the score must have flagged", calc: health.show, result: `${health.result}%` }, ...monthSteps("health", s)],
    },
    {
      doubt: "SmartData has never run a call playbook: the effect of a call is unproven.",
      bets: "The outreach playbook (€20,000) and the score that feeds it.",
      steps: [{ label: "Sign = the tripwire: save rate must beat today's by what the items need to pay back", calc: trip.show, result: `${trip.result}%` }, { label: "Month = the latest month a funded item that acts on flagged customers can first be read", calc: `max of ${tm.parts.map((p) => `month ${p.month}`).join(", ")}`, result: `month ${tm.month}` }],
    },
    {
      doubt: `The tickets are only ${90}% complete (the weakest of the three joined sources).`,
      bets: "The data foundation (€45,000), which every other item reads.",
      steps: [{ label: "Sign = the foundation trigger: weakest source", calc: found.show, result: `${found.result}%` }, ...monthSteps("foundation", s)],
    },
  ][i];
  return {
    title: `3.6 · Assumption ${i + 1}`,
    answer: (R2().assumptions ?? [])[i] ?? "",
    example: [
      tt(
        "I assume that falling usage predicts churn at Company A as it did last year, although last year's rule rests on only 25 customers. I am wrong if the score flags fewer than 65% of the customers who cancel by month 5. (30% is what the single usage rule catches today; adding half of the missing 70 points gives 65%.)",
        "Ich nehme an, dass sinkende Nutzung bei Unternehmen A den Churn so vorhersagt wie letztes Jahr, obwohl die Regel des letzten Jahres auf nur 25 Kunden beruht. Ich liege falsch, wenn der Score bis Monat 5 weniger als 65 % der gekündigten Kunden markiert. (30 % fängt die einzelne Nutzungsregel heute; die Hälfte der fehlenden 70 Punkte dazu ergibt 65 %.)",
      ),
      tt(
        "I assume that a call within two weeks changes the outcome at Company A, although the playbook is new. I am wrong if the share of flagged customers who stay is not above 35% by month 4. (Today it is 30%; the step is the customers the playbook must keep to pay for itself.)",
        "Ich nehme an, dass ein Anruf innerhalb von zwei Wochen bei Unternehmen A das Ergebnis ändert, obwohl das Playbook neu ist. Ich liege falsch, wenn der Anteil der gehaltenen markierten Kunden bis Monat 4 nicht über 35 % liegt. (Heute sind es 30 %; der Schritt sind die Kunden, die das Playbook halten muss, um sich zu bezahlen.)",
      ),
      tt(
        "I assume that usage and invoice data can be joined for nearly every customer at Company A, although the invoices come from a second system. I am wrong if fewer than 97% of customers are joined by month 3. (97% is the lowest completeness of the two sources joined.)",
        "Ich nehme an, dass sich Nutzungs- und Rechnungsdaten bei Unternehmen A für fast jeden Kunden verbinden lassen, obwohl die Rechnungen aus einem zweiten System kommen. Ich liege falsch, wenn bis Monat 3 weniger als 97 % der Kunden verbunden sind. (97 % ist die niedrigste Vollständigkeit der beiden verbundenen Quellen.)",
      ),
    ][i],
    steps: detail.steps,
    why: `Doubt: ${detail.doubt} What the plan bets there: ${detail.bets} The sign is a number the learner can watch inside the plan, compared with today's figure (CLAUDE.md #41). A market-growth figure would not do: it does not move within the plan.`,
    lookFor: ["“I assume …” about the data, the customers or the teams, tied to a doubt printed in the case.", "“I am wrong if … [a number] … by [a month]”: a sign watched inside the plan, not an outside estimate.", "A different assumption is fine when it is tied to a doubt and has a sign."],
  };
}

export function tripwireGuide(): MentorGuide {
  const s = MODEL_STATE();
  const tv = numberView("trip", s);
  const tm = tripMonth(s);
  const cost = CUSTOMER_ITEMS.filter((id) => MODEL_ARCH.includes(id)).reduce((sum, id) => sum + ARCH_BY_ID[id].cost, 0);
  return {
    title: "3.6 · The tripwire",
    answer: `Save rate ≥ ${MODEL_TRIPWIRE.threshold}% by month ${MODEL_TRIPWIRE.month}, else adjust one item`,
    example: tt(
      "Company A, with a save rate of 30% today, funds a €30,000 playbook. One customer is worth €15,000 a year, so it must keep 2 customers (30,000 ÷ 15,000). With 40 flagged customers one customer is 2.5 points, so 2 customers are 5 points: its tripwire is a save rate of 35% by month 4. Work out the same steps for your own funded items.",
      "Unternehmen A, mit einer Save Rate von heute 30 %, finanziert ein Playbook für 30.000 €. Ein Kunde ist 15.000 € im Jahr wert, also muss es 2 Kunden halten (30.000 ÷ 15.000). Bei 40 markierten Kunden ist ein Kunde 2,5 Punkte, also sind 2 Kunden 5 Punkte: Sein Tripwire ist eine Save Rate von 35 % bis Monat 4. Gehen Sie dieselben Schritte für Ihre eigenen finanzierten Punkte durch.",
    ),
    steps: [
      { label: "Cost of the funded items that act on flagged customers (health score + playbook)", calc: CUSTOMER_ITEMS.filter((id) => MODEL_ARCH.includes(id)).map((id) => n(ARCH_BY_ID[id].cost)).join(" + "), result: euro(cost) },
      { label: "Customers they must keep to pay back = cost ÷ yearly revenue of one customer, rounded up", calc: `${n(cost)} ÷ ${n(R2_FIG.revenue)}`, result: String(Math.ceil(cost / R2_FIG.revenue)) },
      { label: "Threshold = today's save rate + those customers as a share of the flagged group, rounded up", calc: tv.show, result: `${tv.result}%` },
      { label: "Month = the latest month a funded item that acts on flagged customers can first be read", calc: `max of ${tm.parts.map((p) => `month ${p.month}`).join(", ")}`, result: `month ${tm.month}` },
    ],
    why: "The tripwire measures how customers behave (save rate), not the team's activity, and its threshold is better than today by the step the money needs to be worth it. Any customer metric with a threshold better than its baseline defends; a different well-reasoned choice is acceptable in a decision part.",
  };
}

export function challengeGuide(): MentorGuide {
  const cv = numberView("challenge", MODEL_STATE());
  return {
    title: "3.6 · The board's challenge",
    answer: R2().challenge ?? "",
    example: tt(
      "I keep the programme and fix the rule. At month 4 the rules flagged 40 customers; 8 of them (20%) were seasonal customers in a quiet season, which one filter can exclude. The other 32 are customers whose usage really fell. I add the filter this month and check the save rate in month 5 as agreed. Say the same three things about the board's numbers.",
      "Ich behalte das Programm und korrigiere die Regel. In Monat 4 markierten die Regeln 40 Kunden; 8 davon (20 %) waren saisonale Kunden in ihrer ruhigen Saison, was ein Filter ausschließen kann. Die anderen 32 sind Kunden, deren Nutzung wirklich sank. Ich füge den Filter in diesem Monat hinzu und prüfe die Save Rate wie vereinbart in Monat 5. Sagen Sie dieselben drei Dinge über die Zahlen des Vorstands.",
    ),
    steps: [
      { label: "Share of the flags that were false alarms", calc: cv.show, result: `${cv.result}%` },
      { label: "Flags that were real", calc: `${BOARD_FACTS.flags} − ${BOARD_FACTS.falseAlarms}`, result: String(BOARD_FACTS.flags - BOARD_FACTS.falseAlarms) },
    ],
    why: "A quarter of the flags came from one kind of customer that the rule treated wrongly, and that has a fix. The other flags are the customers experience missed. Fix the rule; do not drop the programme.",
    lookFor: ["What is checked first (the 15 flags: which rule produced them?).", "What is kept (the programme, the tripwire date).", "One change: a filter for project customers in their quiet season.", "A different, well-reasoned answer is acceptable in a decision part."],
    pitfalls: ["Accepting the Head of Sales' proposal: it returns to the blind spot the case started with.", "Dismissing the complaints without changing the rule."],
  };
}
