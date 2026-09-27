import type { PatternId } from "@/data/patterns";
import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 2.3. Nine data-based measures SmartData could fund inside €160,000 and five months. Costs and weeks are Case
 * assumptions. What each measure does is written without naming the pattern it serves, so the learner has to match them (Materi A7).
 * The score is the plan's own evaluation: Explanatory power × Feasibility × Effect. Explanatory power follows from the printed evidence
 * the measure rests on (a pattern across many customers with a clear difference, some evidence, or a hunch), so it is checkable;
 * feasibility and effect are the learner's judgement.
 */
export type MeasureId = "earlywarn" | "onboard" | "health" | "calendar" | "expand" | "bigdata" | "blackbox" | "discount" | "gutreview";
export const BUDGET = 160000;
export const MONTHS = 5;
export type Bucket = 1 | 2 | 3;
export type Evidence = "pattern" | "some" | "hunch";
export const EVIDENCE_LABEL = bi({
  pattern: t("a pattern across many customers with a clear difference", "ein Muster über viele Kunden mit klarem Unterschied"),
  some: t("some evidence: few customers or a small difference", "etwas Evidenz: wenige Kunden oder ein kleiner Unterschied"),
  hunch: t("a hunch, a vendor promise or one case", "ein Bauchgefühl, ein Anbieterversprechen oder ein Einzelfall"),
});
export const explainBucket = (e: Evidence): Bucket => (e === "pattern" ? 3 : e === "some" ? 2 : 1);
export const EXPLAIN_RULE = bi({
  v: t(
    "Explanatory power follows from the evidence a measure rests on: a pattern across many customers with a clear difference scores 3, some evidence (few customers or a small difference) scores 2, a hunch, a vendor promise or a single case scores 1.",
    "Die Erklärungskraft folgt aus der Evidenz, auf der eine Maßnahme ruht: ein Muster über viele Kunden mit klarem Unterschied ergibt 3, etwas Evidenz (wenige Kunden oder kleiner Unterschied) ergibt 2, ein Bauchgefühl, ein Anbieterversprechen oder ein Einzelfall ergibt 1.",
  ),
});

export type Measure = {
  id: MeasureId;
  name: string;
  what: string;
  basis: string;
  evidence: Evidence;
  cost: number;
  weeks: number;
  targets: PatternId[];
  model: { feasibility: Bucket; effect: Bucket; note: string };
  verdict: string;
};

export const MEASURES: Measure[] = bi([
  {
    id: "earlywarn" as MeasureId,
    name: t("Early-warning list and outreach", "Frühwarnliste und Ansprache"),
    what: t("Every week, a list of customers whose usage fell by 30% or more; the customer success team calls each within two weeks.", "Jede Woche eine Liste der Kunden, deren Nutzung um 30 % oder mehr sank; das Customer-Success-Team ruft jeden innerhalb von zwei Wochen an."),
    basis: t("Rests on: last year, customers with falling usage left seven times as often (400 customers).", "Ruht auf: Letztes Jahr gingen Kunden mit sinkender Nutzung siebenmal so oft (400 Kunden)."),
    evidence: "pattern" as Evidence,
    cost: 35000,
    weeks: 6,
    targets: ["fading"] as PatternId[],
    model: { feasibility: 2, effect: 3, note: t("Acts on the pattern with the highest revenue at risk; needs a weekly data pull and trained callers, so feasibility 2.", "Wirkt auf das Muster mit dem höchsten gefährdeten Umsatz; braucht einen wöchentlichen Datenabzug und geschulte Anrufer, daher Machbarkeit 2.") },
    verdict: t("A model measure: it turns F3 into a list of names someone calls this month.", "Eine Modellmaßnahme: Sie macht aus F3 eine Namensliste, die jemand in diesem Monat anruft."),
  },
  {
    id: "onboard" as MeasureId,
    name: t("Activation programme for new customers", "Aktivierungsprogramm für Neukunden"),
    what: t("A guided onboarding and the activation of a second service within the first 90 days, for every new customer.", "Ein begleitetes Onboarding und die Aktivierung eines zweiten Services in den ersten 90 Tagen, für jeden Neukunden."),
    basis: t("Rests on: customers with one service leave four times as often as those with three or more (all customers).", "Ruht auf: Kunden mit einem Service gehen viermal so oft wie Kunden mit drei oder mehr (alle Kunden)."),
    evidence: "pattern" as Evidence,
    cost: 40000,
    weeks: 8,
    targets: ["dormant"] as PatternId[],
    model: { feasibility: 2, effect: 3, note: t("Answers customers who never took off; needs a programme and service time, so feasibility 2.", "Beantwortet Kunden, die nie angelaufen sind; braucht ein Programm und Servicezeit, daher Machbarkeit 2.") },
    verdict: t("A model measure: it stops the next dormant customer before the pattern starts.", "Eine Modellmaßnahme: Sie stoppt den nächsten ruhenden Kunden, bevor das Muster beginnt."),
  },
  {
    id: "health" as MeasureId,
    name: t("Customer health score in the CRM", "Customer Health Score im CRM"),
    what: t("One score per customer from order frequency, time since the last order, services used and tickets, visible to every account manager.", "Ein Wert pro Kunde aus Bestellhäufigkeit, Zeit seit der letzten Bestellung, genutzten Services und Tickets, sichtbar für jeden Account Manager."),
    basis: t("Rests on: the three data sources that separated leavers from stayers last year (400 customers).", "Ruht auf: den drei Datenquellen, die letztes Jahr Gehende von Bleibenden trennten (400 Kunden)."),
    evidence: "pattern" as Evidence,
    cost: 30000,
    weeks: 6,
    targets: ["fading", "dormant"] as PatternId[],
    model: { feasibility: 3, effect: 2, note: t("Easy to build from data SmartData already has; it shows the risk but does not act by itself, so effect 2.", "Leicht aus Daten zu bauen, die SmartData schon hat; er zeigt das Risiko, handelt aber nicht selbst, daher Wirkung 2.") },
    verdict: t("A model measure: it makes the patterns visible to everyone, not only to an analyst.", "Eine Modellmaßnahme: Sie macht die Muster für alle sichtbar, nicht nur für eine Analystin."),
  },
  {
    id: "calendar" as MeasureId,
    name: t("Cycle calendar for project customers", "Zykluskalender für Projektkunden"),
    what: t("A calendar of each project customer's busy and quiet months; contact is planned around it and quiet months raise no alarm.", "Ein Kalender der vollen und ruhigen Monate jedes Projektkunden; der Kontakt wird darum herum geplant, und ruhige Monate lösen keinen Alarm aus."),
    basis: t("Rests on: three project customers whose quiet phases came back each year; none of them left.", "Ruht auf: drei Projektkunden, deren ruhige Phasen jedes Jahr wiederkamen; keiner von ihnen ging."),
    evidence: "some" as Evidence,
    cost: 10000,
    weeks: 3,
    targets: ["cyclical"] as PatternId[],
    model: { feasibility: 3, effect: 1, note: t("Cheap and useful, but it prevents false alarms more than it keeps customers.", "Günstig und nützlich, verhindert aber eher falsche Alarme, als dass es Kunden hält.") },
    verdict: t("Not in the model three: 6 points. Worth adding once an early-warning list exists, so it does not call project customers in their quiet months.", "Nicht unter den drei Modellmaßnahmen: 6 Punkte. Lohnt sich, sobald es eine Frühwarnliste gibt, damit diese Projektkunden nicht in ihren ruhigen Monaten anruft."),
  },
  {
    id: "expand" as MeasureId,
    name: t("Expansion offers to steady customers", "Erweiterungsangebote an stabile Kunden"),
    what: t("Customers with steady use of several services get a tailored offer for one more service and a place in the reference programme.", "Kunden mit gleichmäßiger Nutzung mehrerer Services bekommen ein zugeschnittenes Angebot für einen weiteren Service und einen Platz im Referenzprogramm."),
    basis: t("Rests on: steady customers added services more often last year, in a small group of accounts.", "Ruht auf: Stabile Kunden ergänzten letztes Jahr häufiger Services, in einer kleinen Gruppe von Accounts."),
    evidence: "some" as Evidence,
    cost: 20000,
    weeks: 4,
    targets: ["anchored"] as PatternId[],
    model: { feasibility: 3, effect: 2, note: t("Grows revenue where the tie is already strong; it does not reduce churn.", "Steigert Umsatz, wo die Bindung schon stark ist; senkt aber nicht den Churn.") },
    verdict: t("A defensible fourth: 12 points and it fits the budget, but the brief's problem is churn, which it does not touch.", "Eine vertretbare vierte: 12 Punkte und sie passt ins Budget, aber das Problem des Auftrags ist Churn, und das berührt sie nicht."),
  },
  {
    id: "bigdata" as MeasureId,
    name: t("External big data set on company growth", "Externer Big-Data-Datensatz zum Unternehmenswachstum"),
    what: t("Buy a market data feed with the growth, hiring and funding of 20,000 German companies.", "Einen Marktdaten-Feed mit Wachstum, Einstellungen und Finanzierung von 20.000 deutschen Unternehmen kaufen."),
    basis: t("Rests on: the vendor's claim that growth data predicts churn.", "Ruht auf: der Behauptung des Anbieters, dass Wachstumsdaten Churn vorhersagen."),
    evidence: "hunch" as Evidence,
    cost: 60000,
    weeks: 10,
    targets: [] as PatternId[],
    model: { feasibility: 1, effect: 1, note: t("Much data, linked to no decision SmartData makes today; ten weeks to connect.", "Viele Daten, mit keiner Entscheidung verbunden, die SmartData heute trifft; zehn Wochen bis zur Anbindung.") },
    verdict: t("Rejected: 1 point. More data is not more insight (Materi A3).", "Verworfen: 1 Punkt. Mehr Daten sind nicht mehr Erkenntnis (Materi A3)."),
  },
  {
    id: "blackbox" as MeasureId,
    name: t("AI churn prediction platform", "KI-Plattform zur Churn-Vorhersage"),
    what: t("A licensed platform that gives every customer a churn probability each day; the model behind it is not shown.", "Eine lizenzierte Plattform, die jedem Kunden täglich eine Abwanderungswahrscheinlichkeit gibt; das Modell dahinter wird nicht gezeigt."),
    basis: t("Rests on: the vendor's case studies from other industries.", "Ruht auf: den Fallstudien des Anbieters aus anderen Branchen."),
    evidence: "hunch" as Evidence,
    cost: 80000,
    weeks: 12,
    targets: ["fading"] as PatternId[],
    model: { feasibility: 1, effect: 2, note: t("It may find the fading customers, but no one can say why a score is high, and it takes twelve of the twenty weeks.", "Sie findet vielleicht die nachlassenden Kunden, aber niemand kann sagen, warum ein Wert hoch ist, und sie braucht zwölf der zwanzig Wochen.") },
    verdict: t("Rejected for now: 2 points. A forecast nobody can explain cannot be acted on with confidence.", "Vorerst verworfen: 2 Punkte. Auf eine Prognose, die niemand erklären kann, lässt sich nicht mit Vertrauen handeln."),
  },
  {
    id: "discount" as MeasureId,
    name: t("10% renewal discount for everyone", "10 % Verlängerungsrabatt für alle"),
    what: t("Every customer who renews gets 10% off the next year.", "Jeder Kunde, der verlängert, bekommt 10 % Rabatt auf das nächste Jahr."),
    basis: t("Rests on: sales managers' experience that price keeps customers.", "Ruht auf: der Erfahrung von Vertriebsleitern, dass der Preis Kunden hält."),
    evidence: "hunch" as Evidence,
    cost: 50000,
    weeks: 1,
    targets: [] as PatternId[],
    model: { feasibility: 3, effect: 1, note: t("Easy to do, and it pays every customer, including the anchored ones who would stay anyway.", "Leicht umzusetzen, und es bezahlt jeden Kunden, auch die verankerten, die ohnehin bleiben würden.") },
    verdict: t("Rejected: 3 points. It answers none of the four patterns.", "Verworfen: 3 Punkte. Er beantwortet keines der vier Muster."),
  },
  {
    id: "gutreview" as MeasureId,
    name: t("Quarterly account review from experience", "Quartalsweise Account-Review aus Erfahrung"),
    what: t("Each quarter, account managers name the customers they feel are at risk, from memory and conversations.", "Jedes Quartal nennen Account Manager die Kunden, die sie für gefährdet halten, aus dem Gedächtnis und aus Gesprächen."),
    basis: t("Rests on: how SmartData decides today.", "Ruht auf: der Art, wie SmartData heute entscheidet."),
    evidence: "hunch" as Evidence,
    cost: 15000,
    weeks: 2,
    targets: ["anchored"] as PatternId[],
    model: { feasibility: 3, effect: 1, note: t("It is the current way, and it has not lowered churn: people notice the loud customers, not the quiet fading ones.", "Es ist der heutige Weg, und er hat den Churn nicht gesenkt: Menschen bemerken die lauten Kunden, nicht die leise nachlassenden.") },
    verdict: t("Rejected: 3 points. It is the experience-based decision the brief wants to replace.", "Verworfen: 3 Punkte. Es ist die erfahrungsbasierte Entscheidung, die der Auftrag ersetzen will."),
  },
]);

export const MEASURE_BY_ID = Object.fromEntries(MEASURES.map((m) => [m.id, m])) as Record<MeasureId, Measure>;
export const MEASURE_IDS = MEASURES.map((m) => m.id);
export const CHOOSE = 3;
export const modelScore = (id: MeasureId) => {
  const m = MEASURE_BY_ID[id];
  return explainBucket(m.evidence) * m.model.feasibility * m.model.effect;
};
export const MODEL_MEASURES: MeasureId[] = ["earlywarn", "onboard", "health"];
export const MODEL_COST = MODEL_MEASURES.reduce((s, id) => s + MEASURE_BY_ID[id].cost, 0);
