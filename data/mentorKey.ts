import { LINES } from "@/data/ladder";
import type { LevelTag, LineId } from "@/data/ladder";
import { CHURN_TRUTH, FORECAST, VALUABLE_TRUTH } from "@/data/forecast";
import type { Basis } from "@/data/forecast";
import { MEANING_TRUTH, MEASURE_TRUTH, PATTERN_IDS, RECORDS, TRUTH_COUNTS, TRUTH_LEFT, riskOf } from "@/data/patterns";
import type { PatternId, PatternRow, RecId, UncId } from "@/data/patterns";
import { MEASURE_BY_ID, MODEL_MEASURES, explainBucket } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { COMP_BY_ID, MODEL_ARCH, MODEL_COMPS, MODEL_GREATEST, MODEL_START, MODEL_TRIGGER, MODEL_TRIPWIRE, OWNER_ACCEPT, OWNER_ACCEPT_LOGIC, SITUATIONS, SOURCES, actionOf, useOf } from "@/data/route2";
import type { Criterion, LogicRow, OwnerId, Use } from "@/data/route2";
import { euro, tt } from "@/lib/lang";
import type { L1State, R2State, Score } from "@/store/useStore";

/**
 * Every model answer of the day, in one file. "Fill all model answers" in the mentor bar enters these, so that after one fill every
 * route's missing list is empty and every export downloads at once. Free text follows the site's language. A convenience for
 * facilitators, not security.
 */
export const MENTOR_PASSCODE = "muchson123";
export const MODEL_ORDER: MeasureId[] = ["earlywarn", "health", "onboard"];

export function KEY_L1(): Partial<L1State> {
  return {
    sort: Object.fromEntries(LINES.map((r) => [r.id, r.truth])) as Record<LineId, LevelTag>,
    extraInsight: tt(
      "Customers who have not ordered for twice their usual gap are rarely just busy, so an account manager should call when the gap doubles, not when the renewal is due.",
      "Kunden, die doppelt so lange wie üblich nicht bestellt haben, sind selten nur beschäftigt, also sollte ein Account Manager anrufen, wenn sich der Abstand verdoppelt, nicht erst, wenn die Verlängerung ansteht.",
    ),
    fig: { F1: String(FORECAST.f1), F2: String(FORECAST.f2), F3: String(FORECAST.f3) },
    meaning: tt(
      `Customers whose usage falls leave ${FORECAST.f2} times as often as the others (${FORECAST.f1}% against ${FORECAST.stableRate}%). With 52 such customers this quarter, about ${euro(FORECAST.f3)} of yearly revenue is at risk, so falling usage is the signal to act on first.`,
      `Kunden mit sinkender Nutzung gehen ${FORECAST.f2}-mal so oft wie die anderen (${FORECAST.f1} % gegenüber ${FORECAST.stableRate} %). Bei 52 solchen Kunden in diesem Quartal sind etwa ${euro(FORECAST.f3)} Jahresumsatz gefährdet, also ist sinkende Nutzung das Signal, auf das zuerst reagiert wird.`,
    ),
    valuable: [...VALUABLE_TRUTH],
    churners: [...CHURN_TRUTH],
    insights: [
      { basis: "frequency" as Basis, text: tt("Our most frequent buyer, Contor, brings only €8,000 a year, so order frequency alone must not decide whom we look after most.", "Unser häufigster Käufer, Contor, bringt nur 8.000 € im Jahr, also darf die Bestellhäufigkeit allein nicht entscheiden, wen wir am meisten betreuen.") },
      { basis: "gap" as Basis, text: tt("A long gap only means risk when usage falls too: Eifel has not ordered for 150 days but uses us more than ever, so we compare each gap with the customer's own rhythm.", "Ein langer Abstand bedeutet nur dann Risiko, wenn auch die Nutzung sinkt: Eifel hat 150 Tage nicht bestellt, nutzt uns aber mehr denn je, also vergleichen wir jeden Abstand mit dem eigenen Rhythmus des Kunden.") },
      { basis: "services" as Basis, text: tt("Brenner and Gerlach use only one service and both are cooling, so getting a second service live early is where retention is won.", "Brenner und Gerlach nutzen nur einen Service und kühlen beide ab, also wird Bindung dort gewonnen, wo früh ein zweiter Service live geht.") },
    ],
    reflect: {
      interpret: tt("The logs showed a 12% drop in logins, but only the question “which customers, and why?” turned it into something we could act on. Data answers what; interpretation answers so what.", "Die Logs zeigten 12 % weniger Logins, aber erst die Frage „welche Kunden, und warum?“ machte daraus etwas, worauf wir handeln konnten. Daten beantworten das Was; Interpretation beantwortet das Na und."),
      causation: tt("Falling usage and leaving go together, but for K-145 the real cause was the IT lead who left. If we treat the logins as the cause, we send training when the customer needs a new contact person.", "Sinkende Nutzung und Abwanderung gehen zusammen, aber bei K-145 war die eigentliche Ursache der IT-Leiter, der ging. Behandeln wir die Logins als Ursache, schicken wir eine Schulung, wenn der Kunde einen neuen Ansprechpartner braucht."),
      decider: tt("A data-driven decision-maker would first ask which decision the data should support, check how many cases stand behind a pattern, act on the strong signals now and test the weak ones before spending money on them.", "Eine datengetriebene Entscheiderin würde zuerst fragen, welche Entscheidung die Daten stützen sollen, prüfen, wie viele Fälle hinter einem Muster stehen, auf die starken Signale jetzt handeln und die schwachen testen, bevor sie Geld dafür ausgibt."),
    },
    tags: Object.fromEntries(RECORDS.map((r) => [r.id, r.truth])) as Record<RecId, PatternId>,
    unc: ["sample", "cause", "missing"] as UncId[],
    rows: Object.fromEntries(PATTERN_IDS.map((x) => [x, { risk: riskOf(TRUTH_LEFT[x], TRUTH_COUNTS[x]), meaning: MEANING_TRUTH[x], measure: MEASURE_TRUTH[x] }])) as Record<PatternId, PatternRow>,
    misread: tt(
      "A project customer in its quiet months can look like a fading one. If we call it with a churn offer, we look as if we do not know them; the sign is a drop that matches the same months last year.",
      "Ein Projektkunde in seinen ruhigen Monaten kann wie ein nachlassender aussehen. Rufen wir ihn mit einem Halteangebot an, wirken wir, als würden wir ihn nicht kennen; das Anzeichen ist ein Rückgang in denselben Monaten wie im Vorjahr.",
    ),
    chosen: [...MODEL_MEASURES],
    aims: Object.fromEntries(MODEL_MEASURES.map((id) => [id, [...MEASURE_BY_ID[id].targets]])) as Record<string, PatternId[]>,
    exp: Object.fromEntries(MODEL_MEASURES.map((id) => [id, explainBucket(MEASURE_BY_ID[id].evidence)])) as Record<string, Score>,
    fea: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.feasibility])) as Record<string, Score>,
    eff: Object.fromEntries(MODEL_MEASURES.map((id) => [id, MEASURE_BY_ID[id].model.effect])) as Record<string, Score>,
    order: [...MODEL_ORDER],
    why: tt(
      "The early-warning list goes first: it acts on the €327,600 at risk from customers whose usage is falling now. The health score is second, because it makes the same patterns visible to every account manager. The activation programme comes third, because it needs eight weeks and works on new customers. All three score 18 and cost €105,000 of the €160,000; the rest stays for the cycle calendar once the list runs.",
      "Die Frühwarnliste kommt zuerst: Sie wirkt auf die 327.600 €, die bei Kunden mit jetzt sinkender Nutzung gefährdet sind. Der Health Score ist Zweiter, weil er dieselben Muster für jeden Account Manager sichtbar macht. Das Aktivierungsprogramm kommt als Drittes, weil es acht Wochen braucht und bei Neukunden wirkt. Alle drei erzielen 18 und kosten 105.000 € von 160.000 €; der Rest bleibt für den Zykluskalender, sobald die Liste läuft.",
    ),
  };
}

export function KEY_R2(): Partial<R2State> {
  const rate: Record<string, Score> = {};
  for (const id of MODEL_COMPS) for (const c of ["explain", "timely", "reach", "scale"] as Criterion[]) rate[`${id}.${c}`] = COMP_BY_ID[id].model[c];
  const logic: Record<string, LogicRow> = {};
  for (const s of SITUATIONS) logic[s.id] = { action: actionOf(s), owner: OWNER_ACCEPT_LOGIC[s.id][0] };
  return {
    principles: ["defs", "rules", "review"],
    principleText: {
      defs: tt("Sales, customer success and finance use the same definition of an active customer and of churn, so the health score means the same thing in every meeting.", "Vertrieb, Customer Success und Finanzen nutzen dieselbe Definition von aktivem Kunden und von Churn, damit der Health Score in jedem Meeting dasselbe bedeutet."),
      rules: tt("Who gets called, when, and by whom is written down with its data and threshold, so the decision no longer depends on which account manager remembers the customer.", "Wer angerufen wird, wann und von wem, ist mit Daten und Schwellenwert aufgeschrieben, damit die Entscheidung nicht mehr davon abhängt, welcher Account Manager sich an den Kunden erinnert."),
      review: tt("Every quarter we compare the forecast churn of each pattern with what happened, so rules that do not work are changed instead of trusted.", "Jedes Quartal vergleichen wir den prognostizierten Churn jedes Musters mit dem, was passiert ist, damit Regeln, die nicht wirken, geändert statt geglaubt werden."),
    },
    sources: Object.fromEntries(SOURCES.map((s) => [s.id, useOf(s)])) as Record<string, Use>,
    comps: [...MODEL_COMPS],
    rate,
    greatest: MODEL_GREATEST,
    greatestWhy: tt(
      "The health score combines the sources that separated leavers from stayers last year, covers every customer every week and shows the reason beside the score, so account managers can act on it and trust it.",
      "Der Health Score verbindet die Quellen, die letztes Jahr Gehende von Bleibenden trennten, deckt jeden Kunden jede Woche ab und zeigt den Grund neben dem Wert, damit Account Manager darauf handeln und ihm vertrauen können.",
    ),
    logic,
    alloc: Object.fromEntries(MODEL_ARCH.map((id) => [id, true])),
    start: { ...MODEL_START } as Record<string, number>,
    owner: Object.fromEntries(MODEL_ARCH.map((id) => [id, OWNER_ACCEPT[id][0]])) as Record<string, OwnerId>,
    trigger: Object.fromEntries(MODEL_ARCH.map((id) => [id, MODEL_TRIGGER[id as keyof typeof MODEL_TRIGGER]])) as Record<string, string>,
    postponed: tt(
      "The AI prediction platform (€70,000) is left out. The six funded items cost €165,000 of the €180,000, the licence would push the plan €55,000 over, and no one could explain its forecasts to an account manager.",
      "Die KI-Vorhersageplattform (70.000 €) bleibt draußen. Die sechs finanzierten Punkte kosten 165.000 € von 180.000 €, die Lizenz brächte den Plan 55.000 € über das Budget, und niemand könnte ihre Prognosen einem Account Manager erklären.",
    ),
    pickup: tt(
      "If the health score catches fewer than 60% of cancellations by month 5, we test a predictive model on our own data in month 6.",
      "Erkennt der Health Score bis Monat 5 weniger als 60 % der Kündigungen, testen wir in Monat 6 ein Vorhersagemodell auf unseren eigenen Daten.",
    ),
    decision: "stage",
    assumptions: [
      tt("Falling usage predicts churn this year as it did last year. This is wrong if fewer than 25% of flagged customers who are not called leave by month 5.", "Sinkende Nutzung sagt Churn dieses Jahr so voraus wie letztes Jahr. Das ist falsch, wenn bis Monat 5 weniger als 25 % der markierten, nicht angerufenen Kunden gehen."),
      tt("A call within two weeks changes the outcome. This is wrong if the save rate of called customers is not above 45% by month 5.", "Ein Anruf innerhalb von zwei Wochen ändert das Ergebnis. Das ist falsch, wenn die Save Rate der angerufenen Kunden bis Monat 5 nicht über 45 % liegt."),
      tt("The usage, order and ticket data can be joined for almost every customer. This is wrong if fewer than 95% of active customers are joined by month 2.", "Nutzungs-, Bestell- und Ticketdaten lassen sich für fast jeden Kunden verbinden. Das ist falsch, wenn bis Monat 2 weniger als 95 % der aktiven Kunden verbunden sind."),
    ],
    tripKpi: MODEL_TRIPWIRE.kpi,
    tripThreshold: String(MODEL_TRIPWIRE.threshold),
    tripMonth: MODEL_TRIPWIRE.month,
    tripAction: "adjust",
    challenge: tt(
      "I keep the programme and fix the rule. Fifteen of 60 flags were project customers, which is exactly the case the “no action” rule for project customers is for, so the early-warning rules get that filter this month. The other 45 flags are the customers we lost last year without noticing. Going back to judgement would bring back the blind spot, so we check the save rate in month 5 as agreed.",
      "Ich behalte das Programm und korrigiere die Regel. Fünfzehn von 60 Markierungen waren Projektkunden; genau für diesen Fall gibt es die Regel „keine Aktion“ für Projektkunden, also bekommen die Frühwarnregeln diesen Filter in diesem Monat. Die anderen 45 Markierungen sind die Kunden, die wir letztes Jahr unbemerkt verloren haben. Zurück zum Bauchgefühl hieße, den blinden Fleck zurückzuholen, also prüfen wir die Save Rate wie vereinbart in Monat 5.",
    ),
  };
}
