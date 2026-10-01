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

/**
 * "SmartData today" (Route 2, printed once above Block 3.5): every figure a trigger, a pickup point, a tripwire or an assumption number is
 * found from. All Case assumptions, consistent with Route 1's usage records (40 + 360 customers, 14 + 18 leavers, 52 flagged now).
 * Print them where they are used (CLAUDE.md #40): Blocks 3.5 and 3.6 read this table, never an Optional block.
 */
export const R2_FIG = {
  customers: 400,
  left: 32, // 14 + 18
  leftFell: 14, // of the 32 leavers, usage had fallen by 30% or more before they left
  groupFell: 40, // last year's customers whose usage fell by 30% or more (14 of them left)
  flagged: 52, // customers whose usage fell by 30% or more this quarter
  revenue: 18000,
  save: 30, // % of flagged customers who stay today
  churn: 8, // % yearly churn of all customers (32 of 400)
  managers: 10,
  weeksQuarter: 13,
};
export type FigKey = keyof typeof R2_FIG | "usage" | "orders" | "tickets" | "crm" | "bar";
export const FIG_ROW_ID = (k: string) => `r2fig-${k}`;

export type ArchId = "foundation" | "health" | "playbook" | "cohort" | "training" | "quality" | "ai" | "feed";
export const ARCH_IDS: ArchId[] = ["foundation", "health", "playbook", "cohort", "training", "quality", "ai", "feed"];
/** What the trigger of an item counts (its method, CLAUDE.md #44): decides which number the kit shows. */
export type ArchResult = "joined" | "caught" | "calls" | "gap" | "managers" | "complete";
export type ArchItem = {
  id: ArchId;
  name: string;
  /** What it is, in everyday words (CLAUDE.md #46): visible on the card, never hidden. */
  what: string;
  /** One concrete situation at SmartData in which the item is used. */
  scene: string;
  /** Who does what, and what changes. */
  who: string;
  /** What the item's trigger counts, in one phrase. */
  counts: string;
  /** What has to exist before the item can work. */
  needs: string;
  cost: number;
  weeks: number;
  /** Months after it is in use until its effect shows (0 = at once). */
  respond: number;
  blackBox: boolean;
  result: ArchResult;
};
export const ARCH: ArchItem[] = bi([
  {
    id: "foundation" as ArchId,
    name: t("Data foundation", "Datenbasis"),
    what: t("One agreed customer list in which usage, orders, support tickets and invoices are joined, so every customer appears once and everyone means the same by “active” and “churned”.", "Eine abgestimmte Kundenliste, in der Nutzung, Bestellungen, Support-Tickets und Rechnungen verbunden sind, sodass jeder Kunde einmal erscheint und alle unter „aktiv“ und „abgewandert“ dasselbe verstehen."),
    scene: t("Today the usage logs show a customer, Brenner Bau, as active while billing lists it as closed. With the foundation, everyone sees one record for Brenner Bau.", "Heute zeigen die Nutzungslogs einen Kunden, Brenner Bau, als aktiv, während die Buchhaltung ihn als beendet führt. Mit der Datenbasis sieht jeder einen Datensatz für Brenner Bau."),
    who: t("The data team builds it together with IT. Afterwards nobody else changes how a customer is counted.", "Das Datenteam baut sie gemeinsam mit der IT. Danach ändert niemand sonst, wie ein Kunde gezählt wird."),
    counts: t("the share of active customers whose usage, order and ticket data are joined", "der Anteil aktiver Kunden, deren Nutzungs-, Bestell- und Ticketdaten verbunden sind"),
    needs: t("Nothing: it starts first.", "Nichts: Sie startet zuerst."),
    cost: 45000,
    weeks: 8,
    respond: 0,
    blackBox: false,
    result: "joined" as ArchResult,
  },
  {
    id: "health" as ArchId,
    name: t("Health score and early-warning rules", "Health Score und Frühwarnregeln"),
    what: t("A red, amber or green score for every customer, built from logins, orders, services used and tickets, with the reason shown next to it. A rule flags every customer whose usage falls by 30% or more in a quarter. It appears in the CRM, the customer database that sales and support already open every day.", "Ein roter, gelber oder grüner Wert für jeden Kunden, gebaut aus Logins, Bestellungen, genutzten Services und Tickets, mit dem Grund daneben. Eine Regel markiert jeden Kunden, dessen Nutzung in einem Quartal um 30 % oder mehr sinkt. Er erscheint im CRM, der Kundendatenbank, die Vertrieb und Support ohnehin jeden Tag öffnen."),
    scene: t("On Monday an account manager opens the CRM and sees Fuchs Maschinen in red with the note “usage down 38%, 120 days since the last order”, and calls the same day.", "Am Montag öffnet ein Account Manager das CRM und sieht Fuchs Maschinen in Rot mit dem Hinweis „Nutzung minus 38 %, 120 Tage seit der letzten Bestellung“ und ruft noch am selben Tag an."),
    who: t("The data team owns the score and the rules. Customer success and the account managers read it and act on it.", "Das Datenteam verantwortet Score und Regeln. Customer Success und die Account Manager lesen ihn und handeln danach."),
    counts: t("the share of customers who cancelled that the score had flagged beforehand", "der Anteil der gekündigten Kunden, die der Score vorher markiert hatte"),
    needs: t("The data foundation: the score reads the joined customer list.", "Die Datenbasis: Der Score liest die verbundene Kundenliste."),
    cost: 35000,
    weeks: 6,
    respond: 1,
    blackBox: false,
    result: "caught" as ArchResult,
  },
  {
    id: "playbook" as ArchId,
    name: t("Outreach playbook for customer success", "Ansprache-Playbook für Customer Success"),
    what: t("A one-page guide that says, for each kind of flagged customer, who calls, how fast, what to ask and what to offer.", "Ein Leitfaden auf einer Seite, der für jede Art markierter Kunden sagt, wer anruft, wie schnell, was zu fragen und was anzubieten ist."),
    scene: t("A flagged customer's usage fell by 40% after a merger. The playbook tells the caller to ask about the merger and to offer a short joint review within two weeks.", "Bei einem markierten Kunden sank die Nutzung nach einer Fusion um 40 %. Das Playbook sagt dem Anrufer, nach der Fusion zu fragen und innerhalb von zwei Wochen ein kurzes gemeinsames Review anzubieten."),
    who: t("The Head of Customer Success writes it and makes sure the team follows it. The customer notices a call that arrives early and knows the history.", "Die Leitung Customer Success schreibt es und sorgt dafür, dass das Team es befolgt. Der Kunde merkt einen Anruf, der früh kommt und die Vorgeschichte kennt."),
    counts: t("how many flagged customers a week get a call", "wie viele markierte Kunden pro Woche einen Anruf bekommen"),
    needs: t("The health score: the playbook calls the customers the score flags.", "Der Health Score: Das Playbook ruft die Kunden an, die der Score markiert."),
    cost: 20000,
    weeks: 4,
    respond: 0,
    blackBox: false,
    result: "calls" as ArchResult,
  },
  {
    id: "cohort" as ArchId,
    name: t("Cohort and pattern dashboard", "Kohorten- und Musterdashboard"),
    what: t("A dashboard that groups customers (by the month they started, or by how their usage moves, for example “keeps falling”) and shows the churn of each group next to the churn that was forecast for it.", "Ein Dashboard, das Kunden gruppiert (nach dem Startmonat oder danach, wie ihre Nutzung verläuft, zum Beispiel „sinkt ständig“) und den Churn jeder Gruppe neben dem prognostizierten Churn zeigt."),
    scene: t("The dashboard shows that customers who started in January left twice as often as those who started in June. The team asks what January's onboarding missed.", "Das Dashboard zeigt, dass Kunden, die im Januar starteten, doppelt so oft gingen wie die vom Juni. Das Team fragt, was dem Onboarding im Januar fehlte."),
    who: t("The data team keeps it up to date; the team meeting reads it once a month and changes a rule when a forecast was off.", "Das Datenteam hält es aktuell; das Teammeeting liest es einmal im Monat und ändert eine Regel, wenn eine Prognose danebenlag."),
    counts: t("how far a group's forecast churn is from its actual churn, in percentage points", "wie weit der prognostizierte Churn einer Gruppe vom tatsächlichen entfernt ist, in Prozentpunkten"),
    needs: t("The data foundation: the groups come from the joined customer list.", "Die Datenbasis: Die Gruppen kommen aus der verbundenen Kundenliste."),
    cost: 20000,
    weeks: 4,
    respond: 1,
    blackBox: false,
    result: "gap" as ArchResult,
  },
  {
    id: "training" as ArchId,
    name: t("Data literacy for sales managers", "Datenkompetenz für Vertriebsleiter"),
    what: t("A short training for the sales managers on how to read a score, a rate and a lift, and on when not to trust them, for example when only a few customers stand behind a number.", "Eine kurze Schulung für die Vertriebsleiter, wie man einen Score, eine Rate und einen Lift liest und wann man ihnen nicht trauen sollte, zum Beispiel wenn nur wenige Kunden hinter einer Zahl stehen."),
    scene: t("A sales manager sees a lift of 5 based on 12 customers. After the training she asks “how many cases?” before she changes her account plan.", "Eine Vertriebsleiterin sieht einen Lift von 5, beruhend auf 12 Kunden. Nach der Schulung fragt sie „wie viele Fälle?“, bevor sie ihren Account-Plan ändert."),
    who: t("The Head of Sales puts the sessions into the team meetings. The managers then plan their accounts with the score, not only from memory.", "Die Vertriebsleitung legt die Einheiten in die Teammeetings. Die Manager planen ihre Accounts dann mit dem Score, nicht nur aus dem Gedächtnis."),
    counts: t("how many sales managers use the score in their account plans", "wie viele Vertriebsleiter den Score in ihren Account-Plänen nutzen"),
    needs: t("The health score: the managers learn to read it.", "Der Health Score: Die Manager lernen, ihn zu lesen."),
    cost: 25000,
    weeks: 3,
    respond: 1,
    blackBox: false,
    result: "managers" as ArchResult,
  },
  {
    id: "quality" as ArchId,
    name: t("Data owners and a CRM quality drive", "Daten-Owner und eine CRM-Qualitätsoffensive"),
    what: t("A named person for each data source who answers for how complete it is, and a push to fill the CRM notes that account managers leave half empty.", "Eine benannte Person für jede Datenquelle, die dafür einsteht, wie vollständig sie ist, und ein Schub, die CRM-Notizen zu füllen, die Account Manager halb leer lassen."),
    scene: t("Only 45 of 100 accounts have CRM notes. The owner reviews the gaps every week, and an account manager adds what was promised to Eifel Energie.", "Nur 45 von 100 Accounts haben CRM-Notizen. Der Owner prüft die Lücken jede Woche, und ein Account Manager trägt nach, was Eifel Energie versprochen wurde."),
    who: t("The data team names the owners; the Head of Sales makes filling the notes part of the weekly pipeline review.", "Das Datenteam benennt die Owner; die Vertriebsleitung macht das Füllen der Notizen zum Teil des wöchentlichen Pipeline-Reviews."),
    counts: t("the share of accounts whose CRM notes are complete", "der Anteil der Accounts mit vollständigen CRM-Notizen"),
    needs: t("Nothing, but the foundation should not start later than this item.", "Nichts, aber die Datenbasis sollte nicht später starten als dieser Punkt."),
    cost: 20000,
    weeks: 6,
    respond: 1,
    blackBox: false,
    result: "complete" as ArchResult,
  },
  {
    id: "ai" as ArchId,
    name: t("AI prediction platform licence", "Lizenz für eine KI-Vorhersageplattform"),
    what: t("A vendor's service that gives every customer a churn probability each day. The vendor does not show how it reaches a score.", "Ein Dienst eines Anbieters, der jedem Kunden täglich eine Abwanderungswahrscheinlichkeit gibt. Der Anbieter zeigt nicht, wie er zu einem Wert kommt."),
    scene: t("The platform marks Delta Kliniken at 0.82. Asked why, the vendor says “the model weighs many signals”. The account manager has nothing to say to the customer.", "Die Plattform bewertet Delta Kliniken mit 0,82. Auf die Frage, warum, sagt der Anbieter „das Modell gewichtet viele Signale“. Der Account Manager hat dem Kunden nichts zu sagen."),
    who: t("The Chief Data Officer or the data team would own it. Customer success would receive scores without reasons.", "Die Chief Data Officer oder das Datenteam würde sie verantworten. Customer Success bekäme Werte ohne Gründe."),
    counts: t("the share of customers who cancelled that the platform had flagged beforehand", "der Anteil der gekündigten Kunden, die die Plattform vorher markiert hatte"),
    needs: t("The data foundation: the platform reads the joined customer list.", "Die Datenbasis: Die Plattform liest die verbundene Kundenliste."),
    cost: 70000,
    weeks: 12,
    respond: 1,
    blackBox: true,
    result: "caught" as ArchResult,
  },
  {
    id: "feed" as ArchId,
    name: t("External big data feed", "Externer Big-Data-Feed"),
    what: t("A purchased data set about the growth and hiring of German companies, matched to SmartData's customers.", "Ein gekaufter Datensatz zu Wachstum und Einstellungen deutscher Unternehmen, abgeglichen mit den Kunden von SmartData."),
    scene: t("The feed says a customer grew by 12%. Nothing in it says how that customer uses SmartData, so no account manager's decision changes.", "Der Feed sagt, dass ein Kunde um 12 % gewachsen ist. Nichts darin sagt, wie dieser Kunde SmartData nutzt, also ändert sich keine Entscheidung eines Account Managers."),
    who: t("The Chief Data Officer would own it. The data team would spend its weeks matching names, not reading customers.", "Die Chief Data Officer würde ihn verantworten. Das Datenteam würde seine Wochen damit verbringen, Namen abzugleichen, statt Kunden zu lesen."),
    counts: t("the share of customers matched to the data set", "der Anteil der Kunden, die dem Datensatz zugeordnet sind"),
    needs: t("The data foundation: the feed is matched to the joined customer list.", "Die Datenbasis: Der Feed wird mit der verbundenen Kundenliste abgeglichen."),
    cost: 50000,
    weeks: 10,
    respond: 1,
    blackBox: false,
    result: "complete" as ArchResult,
  },
]);
export const ARCH_BY_ID = Object.fromEntries(ARCH.map((a) => [a.id, a])) as Record<ArchId, ArchItem>;
/** One word per item for the budget bar, so no two segments carry the same label. */
export const ARCH_SHORT = bi({
  foundation: t("Foundation", "Basis"),
  health: t("Score", "Score"),
  playbook: t("Playbook", "Playbook"),
  cohort: t("Dashboard", "Dashboard"),
  training: t("Training", "Schulung"),
  quality: t("Quality", "Qualität"),
  ai: t("AI", "KI"),
  feed: t("Feed", "Feed"),
}) as Record<ArchId, string>;
export const BASELINE_ITEM: ArchId = "foundation";
/** Items that act on the customers the score flags: their cost is what the tripwire has to earn back (CLAUDE.md #44). */
export const CUSTOMER_ITEMS: ArchId[] = ["health", "playbook", "ai"];
export const setupMonths = (weeks: number) => Math.ceil(weeks / 4);

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
/** The model trigger of each item. Every number is found from "SmartData today" by the methods of Materi B6 (lib/numbersR2.ts). */
export const MODEL_TRIGGER = bi({
  foundation: t("If fewer than 90% of active customers have usage, order and ticket data joined by month 3, the health score waits and the gaps are fixed first.", "Haben bis Monat 3 weniger als 90 % der aktiven Kunden verbundene Nutzungs-, Bestell- und Ticketdaten, wartet der Health Score, und zuerst werden die Lücken geschlossen."),
  health: t("If by month 5 the score had flagged fewer than 70% of the customers who cancelled, the Head of Data re-weights it.", "Hatte der Score bis Monat 5 weniger als 70 % der gekündigten Kunden vorher markiert, gewichtet ihn die Leitung Data neu."),
  playbook: t("If fewer than 4 flagged customers a week get a call by month 4, customer success gets a second caller.", "Bekommen bis Monat 4 weniger als 4 markierte Kunden pro Woche einen Anruf, bekommt Customer Success einen zweiten Anrufer."),
  cohort: t("If a group's forecast churn is more than 5 points away from its actual churn by month 5, the rule behind that forecast is reviewed.", "Liegt der prognostizierte Churn einer Gruppe bis Monat 5 mehr als 5 Punkte neben dem tatsächlichen, wird die Regel hinter der Prognose überprüft."),
  training: t("If fewer than 7 of the 10 sales managers use the score in their account plans by month 5, the training is repeated in their team meetings.", "Nutzen bis Monat 5 weniger als 7 der 10 Vertriebsleiter den Score in ihren Account-Plänen, wird die Schulung in ihren Teammeetings wiederholt."),
  quality: t("If the CRM notes are less than 80% complete by month 4, filling them becomes part of the weekly pipeline review.", "Sind die CRM-Notizen bis Monat 4 zu weniger als 80 % vollständig, wird ihr Ausfüllen Teil des wöchentlichen Pipeline-Reviews."),
  ai: t("If by month 5 the platform had flagged fewer than 70% of the customers who cancelled, the licence is not renewed.", "Hatte die Plattform bis Monat 5 weniger als 70 % der gekündigten Kunden vorher markiert, wird die Lizenz nicht verlängert."),
  feed: t("If fewer than 80% of customers are matched to the data set by month 5, the feed is stopped.", "Sind bis Monat 5 weniger als 80 % der Kunden dem Datensatz zugeordnet, wird der Feed gestoppt."),
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
/** The model tripwire: today's 30% plus the step the funded customer items need to pay back (lib/numbersR2.ts, "trip": 30 + 4 × 100 ÷ 52 = 37.7, rounded up). */
export const MODEL_TRIPWIRE = { kpi: "saved" as KpiId, threshold: 38, month: 5 };
export const R2_BASELINE_NOTE = bi({ v: t("Baselines are Case assumptions from SmartData's contract and usage data of the last twelve months.", "Die Ausgangswerte sind Fallannahmen aus den Vertrags- und Nutzungsdaten von SmartData der letzten zwölf Monate.") });
/** The numbers of the board's challenge, so the "numbers you can use" panel reads them from one place. */
export const BOARD_FACTS = { flags: 60, falseAlarms: 15, complaints: 3 };
export const BOARD_CHALLENGE = bi({
  v: t(
    "It is month 4. The early-warning rules have flagged 60 customers. Fifteen of them were project customers in their quiet season: they use SmartData in bursts and always go quiet for a few months, so the rule flagged them wrongly. Three customers complained about being called. The Head of Sales wants to stop the data programme and go back to account managers' judgement. The board asks what you do.",
    "Es ist Monat 4. Die Frühwarnregeln haben 60 Kunden markiert. Fünfzehn davon waren Projektkunden in ihrer ruhigen Saison: Sie nutzen SmartData in Schüben und werden immer für ein paar Monate still, die Regel hat sie also zu Unrecht markiert. Drei Kunden beschwerten sich über den Anruf. Die Vertriebsleitung will das Datenprogramm stoppen und zum Urteil der Account Manager zurückkehren. Der Vorstand fragt, was Sie tun.",
  ),
});
