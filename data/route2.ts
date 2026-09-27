import { bi, t } from "@/lib/lang";

/**
 * Route 2 (Level 3) data: the Transfer Project. SmartData's Chief Data Officer builds a data-driven decision architecture with varying
 * data quality, a limited budget and high time pressure. Every figure is a Case assumption (the plan gives the role, the situation and
 * the constraints, not numbers). Model values are used only by the checks, the answer keys and the worked answers.
 */
export const R2_BUDGET = 180000;
export const R2_MONTHS = 6;
export type Bucket = 1 | 2 | 3;

/* ------------------------------------------------------------------ 3.1 · target vision of a data-driven organisation */

export type PrincipleId = "defs" | "rules" | "owners" | "review" | "hoard" | "blackbox";
export const PRINCIPLE_IDS: PrincipleId[] = ["defs", "rules", "owners", "review", "hoard", "blackbox"];
export const PRINCIPLES = bi({
  defs: { id: "defs" as PrincipleId, name: t("One agreed data foundation with shared definitions", "Eine vereinbarte Datenbasis mit gemeinsamen Definitionen"), means: t("Everyone uses the same meaning of an active customer, of churn and of customer value.", "Alle nutzen dieselbe Bedeutung von aktivem Kunden, Churn und Kundenwert.") },
  rules: { id: "rules" as PrincipleId, name: t("Every recurring decision has a written decision rule", "Jede wiederkehrende Entscheidung hat eine schriftliche Entscheidungsregel"), means: t("The rule names the data it uses, the threshold and the action, so the decision no longer depends on who is in the room.", "Die Regel nennt die Daten, den Schwellenwert und die Aktion, damit die Entscheidung nicht mehr davon abhängt, wer im Raum ist.") },
  owners: { id: "owners" as PrincipleId, name: t("Every data source has a named owner for its quality", "Jede Datenquelle hat einen benannten Owner für ihre Qualität"), means: t("Someone answers for completeness and correctness, source by source.", "Jemand steht für Vollständigkeit und Richtigkeit ein, Quelle für Quelle.") },
  review: { id: "review" as PrincipleId, name: t("Forecasts are checked against what happened, every quarter", "Prognosen werden jedes Quartal mit dem Eingetretenen abgeglichen"), means: t("A forecast that is never compared with the outcome can never get better.", "Eine Prognose, die nie mit dem Ergebnis verglichen wird, kann nie besser werden.") },
  hoard: { id: "hoard" as PrincipleId, name: t("Collect all the data we can and analyse it later", "Alle Daten sammeln, die wir bekommen, und später analysieren"), means: t("The more data, the more we will know.", "Je mehr Daten, desto mehr wissen wir.") },
  blackbox: { id: "blackbox" as PrincipleId, name: t("Let an AI model decide automatically", "Ein KI-Modell automatisch entscheiden lassen"), means: t("The model scores every customer and triggers actions without anyone explaining the forecast.", "Das Modell bewertet jeden Kunden und löst Aktionen aus, ohne dass jemand die Prognose erklärt.") },
});
/** A data-driven organisation needs both: shared definitions (so everyone reads the same numbers) and decision rules (so the numbers are used). */
export const PRINCIPLE_MUST: PrincipleId[] = ["defs", "rules"];
export const PRINCIPLE_TRAP: PrincipleId[] = ["hoard", "blackbox"];

/* ------------------------------------------------------------------ 3.2 · relevant data sources */

export type SourceId = "usage" | "orders" | "tickets" | "billing" | "crmnotes" | "survey" | "social" | "market";
export const SOURCE_IDS: SourceId[] = ["usage", "orders", "tickets", "billing", "crmnotes", "survey", "social", "market"];
export type Use = "core" | "later" | "leave";
export const USE_LABEL = bi({ core: t("Core: use now", "Kern: jetzt nutzen"), later: t("Later: fix the quality first", "Später: zuerst die Qualität verbessern"), leave: t("Leave out", "Weglassen") });
export type Source = { id: SourceId; name: string; decision: string | null; complete: number; cost: number };
export const SOURCES: Source[] = bi([
  { id: "usage" as SourceId, name: t("Platform usage logs (logins, features used)", "Plattform-Nutzungslogs (Logins, genutzte Funktionen)"), decision: t("Whom to call before they leave", "Wen man anruft, bevor er geht"), complete: 98, cost: 5000 },
  { id: "orders" as SourceId, name: t("Order history (frequency, time between orders)", "Bestellhistorie (Häufigkeit, Zeit zwischen Bestellungen)"), decision: t("Which customers are valuable; who has gone quiet", "Welche Kunden wertvoll sind; wer still geworden ist"), complete: 95, cost: 3000 },
  { id: "tickets" as SourceId, name: t("Support tickets", "Support-Tickets"), decision: t("Whom to call after a run of problems", "Wen man nach einer Reihe von Problemen anruft"), complete: 90, cost: 4000 },
  { id: "billing" as SourceId, name: t("Payment delays from billing", "Zahlungsverzug aus der Buchhaltung"), decision: t("Which renewals are at risk", "Welche Verlängerungen gefährdet sind"), complete: 99, cost: 3000 },
  { id: "crmnotes" as SourceId, name: t("Account managers' CRM notes", "CRM-Notizen der Account Manager"), decision: t("Who owns the relationship and what was promised", "Wer die Beziehung hält und was versprochen wurde"), complete: 45, cost: 8000 },
  { id: "survey" as SourceId, name: t("Customer survey scores", "Werte aus der Kundenbefragung"), decision: t("How satisfied customers say they are", "Wie zufrieden Kunden nach eigener Aussage sind"), complete: 30, cost: 10000 },
  { id: "social" as SourceId, name: t("Social media mentions of SmartData", "Erwähnungen von SmartData in sozialen Medien"), decision: null, complete: 60, cost: 12000 },
  { id: "market" as SourceId, name: t("Purchased market data on company growth", "Gekaufte Marktdaten zum Unternehmenswachstum"), decision: null, complete: 85, cost: 60000 },
]);
export const SOURCE_BY_ID = Object.fromEntries(SOURCES.map((s) => [s.id, s])) as Record<SourceId, Source>;
export const QUALITY_BAR = 80;
/** The rule of Materi B2: no decision → leave out; a decision and complete enough → core; a decision but incomplete → later. */
export const useOf = (s: Source): Use => (!s.decision ? "leave" : s.complete >= QUALITY_BAR ? "core" : "later");

/* ------------------------------------------------------------------ 3.3 · a system for behavioural analysis */

export type CompId = "health" | "early" | "cohort" | "survey" | "report" | "ai" | "gut" | "feed";
export const COMP_IDS: CompId[] = ["health", "early", "cohort", "survey", "report", "ai", "gut", "feed"];
export type Criterion = "explain" | "timely" | "reach" | "scale";
export const CRIT_IDS: Criterion[] = ["explain", "timely", "reach", "scale"];
export const CRITERIA = bi([
  { id: "explain" as Criterion, name: t("Explanatory power", "Erklärungskraft"), test: t("Can it say why a customer is at risk?", "Kann sie sagen, warum ein Kunde gefährdet ist?"), low: t("A number nobody can explain.", "Eine Zahl, die niemand erklären kann."), high: t("It names the behaviour behind the risk.", "Sie nennt das Verhalten hinter dem Risiko.") },
  { id: "timely" as Criterion, name: t("Timeliness", "Rechtzeitigkeit"), test: t("How early does it warn, before the customer decides?", "Wie früh warnt sie, bevor der Kunde entscheidet?"), low: t("After the event, or twice a year.", "Nach dem Ereignis, oder zweimal im Jahr."), high: t("Weekly or faster, months before a cancellation.", "Wöchentlich oder schneller, Monate vor einer Kündigung.") },
  { id: "reach" as Criterion, name: t("Reach", "Reichweite"), test: t("How many customers does it cover?", "Wie viele Kunden deckt sie ab?"), low: t("Some customers only.", "Nur einige Kunden."), high: t("Every customer.", "Jeden Kunden.") },
  { id: "scale" as Criterion, name: t("Scale", "Skalierung"), test: t("Does the cost per extra customer fall as the base grows?", "Sinken die Kosten pro zusätzlichem Kunden, wenn die Basis wächst?"), low: t("Each analysis costs a person's time again.", "Jede Analyse kostet wieder Personenzeit."), high: t("Built once, it serves every customer.", "Einmal gebaut, dient sie jedem Kunden.") },
]);
export type Cadence = "weekly" | "monthly" | "after" | "halfyear";
export type CostShape = "one-off" | "per customer" | "per analysis";
export type Comp = { id: CompId; name: string; what: string; explains: boolean; cadence: Cadence; coversAll: boolean; costShape: CostShape; model: Record<Criterion, Bucket>; note: string };
export const CADENCE_LABEL = bi({ weekly: t("weekly or daily", "wöchentlich oder täglich"), monthly: t("monthly", "monatlich"), after: t("after the customer has left", "nachdem der Kunde gegangen ist"), halfyear: t("twice a year", "zweimal im Jahr") });
export const COST_SHAPE_LABEL = bi({ "one-off": t("one-off", "einmalig"), "per customer": t("per customer", "pro Kunde"), "per analysis": t("per analysis (a person's time)", "pro Analyse (Personenzeit)") });
export const COMPS: Comp[] = bi([
  { id: "health" as CompId, name: t("Customer health score", "Customer Health Score"), what: t("One score per customer from usage, orders, services and tickets, with the reason shown beside it.", "Ein Wert pro Kunde aus Nutzung, Bestellungen, Services und Tickets, mit dem Grund daneben."), explains: true, cadence: "weekly" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 3, timely: 3, reach: 3, scale: 3 }, note: t("Combines the sources that separated leavers from stayers, for every customer, every week, with the reason visible.", "Verbindet die Quellen, die Gehende von Bleibenden trennten, für jeden Kunden, jede Woche, mit sichtbarem Grund.") },
  { id: "early" as CompId, name: t("Early-warning rules on usage drops", "Frühwarnregeln bei Nutzungsrückgang"), what: t("A rule that flags every customer whose usage falls by 30% or more in a quarter.", "Eine Regel, die jeden Kunden markiert, dessen Nutzung in einem Quartal um 30 % oder mehr sinkt."), explains: true, cadence: "weekly" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 2, timely: 3, reach: 3, scale: 3 }, note: t("Early and cheap; it names one behaviour, so it explains less than the full score.", "Früh und günstig; sie nennt ein Verhalten, erklärt also weniger als der volle Score.") },
  { id: "cohort" as CompId, name: t("Cohort and pattern dashboard", "Kohorten- und Musterdashboard"), what: t("Customers grouped by start month and by pattern, with churn per group.", "Kunden nach Startmonat und Muster gruppiert, mit Churn pro Gruppe."), explains: true, cadence: "monthly" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 3, timely: 2, reach: 3, scale: 3 }, note: t("Shows which patterns and which start months drive churn; monthly, so it guides rules rather than calls.", "Zeigt, welche Muster und Startmonate den Churn treiben; monatlich, lenkt also eher Regeln als Anrufe.") },
  { id: "survey" as CompId, name: t("Twice-yearly customer survey", "Halbjährliche Kundenbefragung"), what: t("A survey on satisfaction and plans; about 30% of customers answer.", "Eine Befragung zu Zufriedenheit und Plänen; etwa 30 % der Kunden antworten."), explains: true, cadence: "halfyear" as Cadence, coversAll: false, costShape: "per customer" as CostShape, model: { explain: 2, timely: 1, reach: 2, scale: 2 }, note: t("Says why in the customer's words, but late and only for those who answer.", "Sagt das Warum in den Worten des Kunden, aber spät und nur für die, die antworten.") },
  { id: "report" as CompId, name: t("Monthly churn report", "Monatlicher Churn-Bericht"), what: t("A list of customers who cancelled last month, with their revenue.", "Eine Liste der Kunden, die letzten Monat gekündigt haben, mit ihrem Umsatz."), explains: true, cadence: "after" as Cadence, coversAll: true, costShape: "one-off" as CostShape, model: { explain: 2, timely: 1, reach: 3, scale: 3 }, note: t("Counts the loss well, after it is too late to act.", "Zählt den Verlust gut, wenn es zu spät zum Handeln ist.") },
  { id: "ai" as CompId, name: t("External AI prediction service", "Externer KI-Vorhersagedienst"), what: t("A daily churn probability per customer from a vendor's model; the reasons are not shown.", "Eine tägliche Abwanderungswahrscheinlichkeit pro Kunde aus dem Modell eines Anbieters; die Gründe werden nicht gezeigt."), explains: false, cadence: "weekly" as Cadence, coversAll: true, costShape: "per customer" as CostShape, model: { explain: 1, timely: 3, reach: 3, scale: 2 }, note: t("Early and broad, but no one can say why a score is high, and the licence is per customer.", "Früh und breit, aber niemand kann sagen, warum ein Wert hoch ist, und die Lizenz gilt pro Kunde.") },
  { id: "gut" as CompId, name: t("Account managers' judgement", "Urteil der Account Manager"), what: t("Each account manager names the customers they feel are at risk.", "Jeder Account Manager nennt die Kunden, die er für gefährdet hält."), explains: true, cadence: "monthly" as Cadence, coversAll: false, costShape: "per analysis" as CostShape, model: { explain: 2, timely: 2, reach: 2, scale: 1 }, note: t("Rich in context for the accounts a manager knows well; blind to the quiet ones, and it does not scale.", "Reich an Kontext für die Accounts, die ein Manager gut kennt; blind für die stillen, und es skaliert nicht.") },
  { id: "feed" as CompId, name: t("External big data feed", "Externer Big-Data-Feed"), what: t("Market data on the growth and hiring of all German companies, joined to SmartData's customers.", "Marktdaten zu Wachstum und Einstellungen aller deutschen Unternehmen, verknüpft mit den Kunden von SmartData."), explains: false, cadence: "monthly" as Cadence, coversAll: true, costShape: "per customer" as CostShape, model: { explain: 1, timely: 2, reach: 3, scale: 2 }, note: t("A lot of data, none of it about how customers use SmartData.", "Viele Daten, keine davon darüber, wie Kunden SmartData nutzen.") },
]);
export const COMP_BY_ID = Object.fromEntries(COMPS.map((c) => [c.id, c])) as Record<CompId, Comp>;
export const COMP_CHOOSE = 3;
export const MODEL_COMPS: CompId[] = ["health", "early", "cohort"];
export const MODEL_GREATEST: CompId = "health";
/** The limit a rating must not exceed, from the printed facts of the component (Materi B3). */
export function maxRating(id: CompId, c: Criterion): Bucket {
  const x = COMP_BY_ID[id];
  if (c === "explain") return x.explains ? 3 : 1;
  if (c === "timely") return x.cadence === "weekly" ? 3 : x.cadence === "monthly" ? 2 : 1;
  if (c === "reach") return x.coversAll ? 3 : 2;
  return x.costShape === "one-off" ? 3 : x.costShape === "per customer" ? 2 : 1;
}
/** An early component warns before the customer decides (weekly or monthly). */
export const isEarly = (id: CompId) => COMP_BY_ID[id].cadence === "weekly" || COMP_BY_ID[id].cadence === "monthly";

/* ------------------------------------------------------------------ 3.4 · decision logic: when to intervene */

export type SitId = "usage" | "single" | "payment" | "tickets" | "project" | "renewal";
export const SIT_IDS: SitId[] = ["usage", "single", "payment", "tickets", "project", "renewal"];
export type Action = "intervene" | "watch" | "none";
export const ACTION_LABEL = bi({ intervene: t("Intervene now", "Jetzt eingreifen"), watch: t("Watch and gather data", "Beobachten und Daten sammeln"), none: t("No action", "Keine Aktion") });
export type LogicOwner = "csm" | "sales" | "data" | "nobody";
export const LOGIC_OWNERS: LogicOwner[] = ["csm", "sales", "data", "nobody"];
export const LOGIC_OWNER_LABEL = bi({ csm: t("Customer success", "Customer Success"), sales: t("Sales", "Vertrieb"), data: t("Data team", "Datenteam"), nobody: t("No one (no action)", "Niemand (keine Aktion)") });
export type Situation = { id: SitId; signal: string; lift: number; cases: number; revenue: number; note: string };
export const SITUATIONS: Situation[] = bi([
  { id: "usage" as SitId, signal: t("Usage fell by 30% or more in a quarter", "Nutzung in einem Quartal um 30 % oder mehr gesunken"), lift: 7, cases: 40, revenue: 327600, note: t("The customer's use of the platform is falling.", "Die Nutzung der Plattform durch den Kunden sinkt.") },
  { id: "single" as SitId, signal: t("Still only one service after 90 days", "Nach 90 Tagen immer noch nur ein Service"), lift: 4, cases: 150, revenue: 210000, note: t("The customer never took up more than it bought first.", "Der Kunde hat nie mehr genutzt als das, was er zuerst kaufte.") },
  { id: "payment" as SitId, signal: t("Payment delayed twice in a row", "Zweimal in Folge verspätet gezahlt"), lift: 3.5, cases: 12, revenue: 90000, note: t("Few cases so far.", "Bisher wenige Fälle.") },
  { id: "tickets" as SitId, signal: t("Support tickets doubled within a month", "Support-Tickets innerhalb eines Monats verdoppelt"), lift: 2, cases: 60, revenue: 120000, note: t("Many cases, a moderate difference.", "Viele Fälle, ein mäßiger Unterschied.") },
  { id: "project" as SitId, signal: t("No order for 120 days from a project customer", "Keine Bestellung seit 120 Tagen von einem Projektkunden"), lift: 1.1, cases: 30, revenue: 150000, note: t("Their quiet phases came back each year.", "Ihre ruhigen Phasen kamen jedes Jahr wieder.") },
  { id: "renewal" as SitId, signal: t("Renewal due in 90 days and health score red", "Verlängerung in 90 Tagen fällig und Health Score rot"), lift: 5, cases: 25, revenue: 260000, note: t("A commercial decision is close.", "Eine kaufmännische Entscheidung steht bevor.") },
]);
export const SIT_BY_ID = Object.fromEntries(SITUATIONS.map((s) => [s.id, s])) as Record<SitId, Situation>;
export const LIFT_ACT = 3;
export const LIFT_WATCH = 1.5;
export const CASES_MIN = 20;
/** The rule of Materi B4: a strong, proven difference → intervene; a difference not yet proven (few cases) or a moderate one → watch; no real difference → no action. */
export const actionOf = (s: Situation): Action => (s.lift >= LIFT_ACT && s.cases >= CASES_MIN ? "intervene" : s.lift >= LIFT_WATCH ? "watch" : "none");
export const OWNER_ACCEPT_LOGIC: Record<SitId, LogicOwner[]> = { usage: ["csm"], single: ["csm"], payment: ["data"], tickets: ["data"], project: ["nobody"], renewal: ["sales", "csm"] };
export type LogicRow = { action: Action | null; owner: LogicOwner | null };

/* ------------------------------------------------------------------ 3.5 · prioritised measures for implementation */

export type ArchId = "foundation" | "health" | "playbook" | "cohort" | "training" | "quality" | "ai" | "feed";
export const ARCH_IDS: ArchId[] = ["foundation", "health", "playbook", "cohort", "training", "quality", "ai", "feed"];
export type ArchItem = { id: ArchId; name: string; what: string; cost: number; weeks: number; blackBox: boolean };
export const ARCH: ArchItem[] = bi([
  { id: "foundation" as ArchId, name: t("Data foundation", "Datenbasis"), what: t("Shared definitions, and usage, order, ticket and billing data connected in one place.", "Gemeinsame Definitionen, und Nutzungs-, Bestell-, Ticket- und Zahlungsdaten an einem Ort verbunden."), cost: 45000, weeks: 8, blackBox: false },
  { id: "health" as ArchId, name: t("Health score and early-warning rules", "Health Score und Frühwarnregeln"), what: t("The score and the rules of Block 3.4, visible in the CRM.", "Der Score und die Regeln aus Block 3.4, sichtbar im CRM."), cost: 35000, weeks: 6, blackBox: false },
  { id: "playbook" as ArchId, name: t("Outreach playbook for customer success", "Ansprache-Playbook für Customer Success"), what: t("What to say and offer for each pattern, and how fast.", "Was bei jedem Muster zu sagen und anzubieten ist, und wie schnell."), cost: 20000, weeks: 4, blackBox: false },
  { id: "cohort" as ArchId, name: t("Cohort and pattern dashboard", "Kohorten- und Musterdashboard"), what: t("Churn by start month and by pattern, checked against each forecast.", "Churn nach Startmonat und Muster, abgeglichen mit jeder Prognose."), cost: 20000, weeks: 4, blackBox: false },
  { id: "training" as ArchId, name: t("Data literacy for sales managers", "Datenkompetenz für Vertriebsleiter"), what: t("How to read a score, a rate and a lift, and when not to trust them.", "Wie man einen Score, eine Rate und einen Lift liest, und wann man ihnen nicht trauen sollte."), cost: 25000, weeks: 3, blackBox: false },
  { id: "quality" as ArchId, name: t("Data owners and a CRM quality drive", "Daten-Owner und eine CRM-Qualitätsoffensive"), what: t("A named owner per source and a push to fill the CRM notes.", "Ein benannter Owner pro Quelle und ein Schub, um die CRM-Notizen zu füllen."), cost: 20000, weeks: 6, blackBox: false },
  { id: "ai" as ArchId, name: t("AI prediction platform licence", "Lizenz für eine KI-Vorhersageplattform"), what: t("A vendor's churn probabilities, without the reasons.", "Die Abwanderungswahrscheinlichkeiten eines Anbieters, ohne die Gründe."), cost: 70000, weeks: 12, blackBox: true },
  { id: "feed" as ArchId, name: t("External big data feed", "Externer Big-Data-Feed"), what: t("Growth and hiring data on all German companies.", "Wachstums- und Einstellungsdaten zu allen deutschen Unternehmen."), cost: 50000, weeks: 10, blackBox: false },
]);
export const ARCH_BY_ID = Object.fromEntries(ARCH.map((a) => [a.id, a])) as Record<ArchId, ArchItem>;
export const BASELINE_ITEM: ArchId = "foundation";

export type OwnerId = "cdo" | "datalead" | "cslead" | "saleslead" | "it";
export const OWNER_IDS: OwnerId[] = ["cdo", "datalead", "cslead", "saleslead", "it"];
export const OWNERS = bi({
  cdo: { name: t("Chief Data Officer (you)", "Chief Data Officer (Sie)"), profile: t("Decides across teams and answers to the board. Should hold few items.", "Entscheidet über Teams hinweg und berichtet an den Vorstand. Sollte wenige Punkte halten.") },
  datalead: { name: t("Head of Data & Analytics", "Leitung Data & Analytics"), profile: t("Owns the data models, the scores, the dashboards and their definitions.", "Verantwortet Datenmodelle, Scores, Dashboards und ihre Definitionen.") },
  cslead: { name: t("Head of Customer Success", "Leitung Customer Success"), profile: t("Leads the team that calls, onboards and looks after customers.", "Führt das Team, das Kunden anruft, einführt und betreut.") },
  saleslead: { name: t("Head of Sales", "Vertriebsleitung"), profile: t("Leads the account managers and decides how they plan their accounts.", "Führt die Account Manager und entscheidet, wie sie ihre Accounts planen.") },
  it: { name: t("Head of IT", "IT-Leitung"), profile: t("Owns the systems, the interfaces between them and data protection in them.", "Verantwortet die Systeme, die Schnittstellen dazwischen und den Datenschutz darin.") },
});
export const OWNER_ACCEPT: Record<ArchId, OwnerId[]> = {
  foundation: ["datalead", "it"],
  health: ["datalead"],
  playbook: ["cslead"],
  cohort: ["datalead"],
  training: ["saleslead", "cdo"],
  quality: ["datalead", "saleslead"],
  ai: ["cdo", "datalead"],
  feed: ["cdo"],
};
export const MODEL_ARCH: ArchId[] = ["foundation", "health", "playbook", "cohort", "training", "quality"];
export const MODEL_START: Partial<Record<ArchId, number>> = { foundation: 1, quality: 1, health: 2, playbook: 3, cohort: 3, training: 3 };
export const MODEL_TRIGGER = bi({
  foundation: t("If fewer than 95% of active customers have usage, order and ticket data joined by month 2, the health score waits and the gaps are fixed first.", "Haben bis Monat 2 weniger als 95 % der aktiven Kunden verbundene Nutzungs-, Bestell- und Ticketdaten, wartet der Health Score, und zuerst werden die Lücken geschlossen."),
  health: t("If the score flags fewer than 60% of the customers who cancel in months 3 and 4, the Head of Data re-weights it in month 5.", "Markiert der Score weniger als 60 % der Kunden, die in Monat 3 und 4 kündigen, gewichtet ihn die Leitung Data in Monat 5 neu."),
  playbook: t("If fewer than 80% of flagged customers are called within two weeks by month 4, customer success gets a second caller.", "Werden bis Monat 4 weniger als 80 % der markierten Kunden innerhalb von zwei Wochen angerufen, bekommt Customer Success einen zweiten Anrufer."),
  cohort: t("If a forecast misses the actual churn of its group by more than 5 points in a quarter, the rule behind it is reviewed.", "Verfehlt eine Prognose den tatsächlichen Churn ihrer Gruppe in einem Quartal um mehr als 5 Punkte, wird die Regel dahinter überprüft."),
  training: t("If fewer than 70% of sales managers use the score in their account plans by month 5, the training is repeated in their team meetings.", "Nutzen bis Monat 5 weniger als 70 % der Vertriebsleiter den Score in ihren Account-Plänen, wird die Schulung in ihren Teammeetings wiederholt."),
  quality: t("If CRM notes are still less than 70% complete by month 4, filling them becomes part of the weekly pipeline review.", "Sind die CRM-Notizen bis Monat 4 immer noch zu weniger als 70 % vollständig, wird ihr Ausfüllen Teil des wöchentlichen Pipeline-Reviews."),
});

/* ------------------------------------------------------------------ 3.6 · the decision under uncertain data */

export type DecisionId = "commit" | "stage" | "wait";
export const DECISIONS = bi([
  { id: "commit" as DecisionId, label: t("Build the whole architecture now", "Die ganze Architektur jetzt bauen"), detail: t("Fund everything and switch every account team to data-based decisions from month 1.", "Alles finanzieren und jedes Account-Team ab Monat 1 auf datenbasierte Entscheidungen umstellen."), why: t("Fast and complete, and it defends only if the data is good enough everywhere from the start.", "Schnell und vollständig, und nur vertretbar, wenn die Daten von Anfang an überall gut genug sind."), rejected: t("Most of the money is spent before the data foundation shows which sources can be trusted.", "Der Großteil des Geldes ist ausgegeben, bevor die Datenbasis zeigt, welchen Quellen man trauen kann.") },
  { id: "stage" as DecisionId, label: t("Decide now, build in stages, with a tripwire", "Jetzt entscheiden, stufenweise bauen, mit Tripwire"), detail: t("Start with the data foundation and the health score on the reliable sources, add the rest from month 3, and scale only if the tripwire is met.", "Mit Datenbasis und Health Score auf den verlässlichen Quellen starten, den Rest ab Monat 3 ergänzen, und nur skalieren, wenn der Tripwire erreicht ist."), why: t("It makes the decision the brief asks for and uses the reliable sources now, while the uncertain ones are fixed.", "Es trifft die Entscheidung, die der Auftrag verlangt, und nutzt die verlässlichen Quellen jetzt, während die unsicheren verbessert werden."), rejected: t("", "") },
  { id: "wait" as DecisionId, label: t("Wait until all data is clean", "Warten, bis alle Daten sauber sind"), detail: t("Run a data clean-up for six months before any decision is based on data.", "Sechs Monate Datenbereinigung durchführen, bevor irgendeine Entscheidung auf Daten beruht."), why: t("", ""), rejected: t("The brief asks for a decision despite uncertain data. Waiting leaves every at-risk customer to experience-based guesses for six more months.", "Der Auftrag verlangt eine Entscheidung trotz unsicherer Daten. Warten überlässt jeden gefährdeten Kunden sechs weitere Monate dem Bauchgefühl.") },
]);
export const MODEL_DECISION: DecisionId = "stage";

export type KpiId = "saved" | "churn" | "twoservices" | "dashboards" | "reports";
export const KPIS = bi([
  { id: "saved" as KpiId, label: t("Flagged customers who stay (save rate)", "Markierte Kunden, die bleiben (Save Rate)"), unit: "%", baseline: 30, better: "up" as const, behaviour: true },
  { id: "churn" as KpiId, label: t("Yearly churn rate", "Jährliche Churn Rate"), unit: "%", baseline: 8, better: "down" as const, behaviour: true },
  { id: "twoservices" as KpiId, label: t("Customers using two or more services", "Kunden mit zwei oder mehr Services"), unit: "%", baseline: 62, better: "up" as const, behaviour: true },
  { id: "dashboards" as KpiId, label: t("Dashboards in use", "Genutzte Dashboards"), unit: t("dashboards", "Dashboards"), baseline: 3, better: "up" as const, behaviour: false },
  { id: "reports" as KpiId, label: t("Data reports sent per month", "Versendete Datenberichte pro Monat"), unit: t("reports", "Berichte"), baseline: 20, better: "up" as const, behaviour: false },
]);
export const KPI_BY_ID = Object.fromEntries(KPIS.map((k) => [k.id, k])) as Record<KpiId, (typeof KPIS)[number]>;
export const MODEL_TRIPWIRE = { kpi: "saved" as KpiId, threshold: 45, month: 5 };
export const R2_BASELINE_NOTE = bi({ v: t("Baselines are Case assumptions from SmartData's contract and usage data of the last twelve months.", "Die Ausgangswerte sind Fallannahmen aus den Vertrags- und Nutzungsdaten von SmartData der letzten zwölf Monate.") });
export const BOARD_CHALLENGE = bi({
  v: t(
    "It is month 3. The early-warning rules flagged 60 customers. Fifteen of them were project customers in their quiet season, and three complained about being called. The Head of Sales wants to stop the data programme and go back to account managers' judgement. The board asks what you do.",
    "Es ist Monat 3. Die Frühwarnregeln haben 60 Kunden markiert. Fünfzehn davon waren Projektkunden in ihrer ruhigen Saison, und drei beschwerten sich über den Anruf. Die Vertriebsleitung will das Datenprogramm stoppen und zum Urteil der Account Manager zurückkehren. Der Vorstand fragt, was Sie tun.",
  ),
});
