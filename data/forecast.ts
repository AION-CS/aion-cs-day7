import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.2, and the worked example of Materi A4: a first forecast from last year's history. The method is
 *
 *   churn rate of a group   = customers in the group who left ÷ customers in the group × 100
 *   lift                    = churn rate of the signal group ÷ churn rate of the other customers
 *   revenue at risk (year)  = customers showing the signal now × churn rate of the signal group × average yearly revenue
 *
 * Every input is a Case assumption from SmartData's own usage and contract records. Rates are printed as counts, so the learner divides
 * first; the churn rate enters F3 as a share of one. Results are rounded to two decimals.
 */
export const SMART = {
  falling: { customers: 40, left: 14 },
  stable: { customers: 360, left: 18 },
  fallingNow: 52,
  revenue: 18000,
};

const r2 = (x: number) => Math.round(x * 100) / 100;
export const rateOf = (left: number, customers: number) => r2((left / customers) * 100);
export const liftOf = (a: number, b: number) => r2(a / b);
export const atRisk = (now: number, rate: number, revenue: number) => r2(now * (rate / 100) * revenue);

export const FORECAST = {
  f1: rateOf(SMART.falling.left, SMART.falling.customers),
  stableRate: rateOf(SMART.stable.left, SMART.stable.customers),
  get f2() {
    return liftOf(this.f1, this.stableRate);
  },
  get f3() {
    return atRisk(SMART.fallingNow, this.f1, SMART.revenue);
  },
};

export type FigureId = "F1" | "F2" | "F3";
export const FIGURE_IDS: FigureId[] = ["F1", "F2", "F3"];

export const FIGURES = bi({
  F1: {
    id: "F1" as FigureId,
    label: t("F1 · Churn rate among customers whose usage fell, %", "F1 · Churn Rate bei Kunden mit gesunkener Nutzung, %"),
    question: t("Of last year's customers whose usage fell by 30% or more in a quarter, what share left within six months?", "Welcher Anteil der Kunden des letzten Jahres, deren Nutzung in einem Quartal um 30 % oder mehr sank, ging innerhalb von sechs Monaten?"),
    unit: "%",
    example: "12.5",
    answer: FORECAST.f1,
    formula: t("Churn rate = customers in the group who left ÷ customers in the group × 100. Use the row “usage fell by 30% or more”.", "Churn Rate = Kunden der Gruppe, die gingen ÷ Kunden der Gruppe × 100. Nutzen Sie die Zeile „Nutzung um 30 % oder mehr gesunken“."),
    taughtIn: "A4" as const,
    clue: t("Did you divide the leavers by the customers of the same row, and multiply by 100?", "Haben Sie die Abgänge durch die Kunden derselben Zeile geteilt und mit 100 multipliziert?"),
    sources: [
      { label: t("Last year · usage fell by 30% or more · customers", "Letztes Jahr · Nutzung um 30 % oder mehr gesunken · Kunden"), value: "40", target: "fc-fall-customers" },
      { label: t("Last year · usage fell by 30% or more · left within six months", "Letztes Jahr · Nutzung um 30 % oder mehr gesunken · innerhalb von sechs Monaten gegangen"), value: "14", target: "fc-fall-left" },
    ],
  },
  F2: {
    id: "F2" as FigureId,
    label: t("F2 · Lift: how many times more often they left", "F2 · Lift: wie viel Mal häufiger sie gingen"),
    question: t("How many times higher is the churn rate of customers whose usage fell than that of customers with stable or rising usage?", "Wie viel Mal höher ist die Churn Rate der Kunden mit gesunkener Nutzung als die der Kunden mit stabiler oder steigender Nutzung?"),
    unit: "×",
    example: "2.5",
    answer: FORECAST.f2,
    formula: t("Lift = churn rate of the signal group ÷ churn rate of the other customers. Work out the second rate from its row first.", "Lift = Churn Rate der Signalgruppe ÷ Churn Rate der übrigen Kunden. Berechnen Sie die zweite Rate zuerst aus ihrer Zeile."),
    taughtIn: "A4" as const,
    clue: t("You need two rates from two rows. Is the second one worked out from the “stable or rising” row, the same way as F1?", "Sie brauchen zwei Raten aus zwei Zeilen. Ist die zweite aus der Zeile „stabil oder steigend“ berechnet, genauso wie F1?"),
    sources: [
      { label: t("Your F1 (churn rate, usage fell)", "Ihr F1 (Churn Rate, Nutzung gesunken)"), value: "F1", target: "fig-F1" },
      { label: t("Last year · usage stable or rising · customers", "Letztes Jahr · Nutzung stabil oder steigend · Kunden"), value: "360", target: "fc-stable-customers" },
      { label: t("Last year · usage stable or rising · left within six months", "Letztes Jahr · Nutzung stabil oder steigend · innerhalb von sechs Monaten gegangen"), value: "18", target: "fc-stable-left" },
    ],
  },
  F3: {
    id: "F3" as FigureId,
    label: t("F3 · Revenue at risk this year, €", "F3 · Gefährdeter Umsatz in diesem Jahr, €"),
    question: t("If the customers whose usage has fallen this quarter leave at last year's rate, how much yearly revenue is at risk?", "Wenn die Kunden, deren Nutzung in diesem Quartal gesunken ist, mit der Rate des letzten Jahres gehen: Wie viel Jahresumsatz ist gefährdet?"),
    unit: "€",
    example: "12500",
    answer: FORECAST.f3,
    formula: t("Revenue at risk = customers showing the signal now × churn rate of the signal group (as a share of one) × average yearly revenue per customer.", "Gefährdeter Umsatz = Kunden, die das Signal jetzt zeigen × Churn Rate der Signalgruppe (als Anteil von eins) × durchschnittlicher Jahresumsatz pro Kunde."),
    taughtIn: "A4" as const,
    clue: t("Use this quarter's count, not last year's 40, and turn your F1 into a share of one before you multiply.", "Nehmen Sie die Zahl dieses Quartals, nicht die 40 des letzten Jahres, und machen Sie Ihr F1 zu einem Anteil von eins, bevor Sie multiplizieren."),
    sources: [
      { label: t("This quarter · customers whose usage fell by 30% or more", "Dieses Quartal · Kunden mit um 30 % oder mehr gesunkener Nutzung"), value: "52", target: "fc-now" },
      { label: t("Your F1 (churn rate, usage fell)", "Ihr F1 (Churn Rate, Nutzung gesunken)"), value: "F1", target: "fig-F1" },
      { label: t("All customers · average yearly revenue per customer", "Alle Kunden · durchschnittlicher Jahresumsatz pro Kunde"), value: t("€18,000", "18.000 €"), target: "fc-revenue" },
    ],
  },
});

/** The worked example of Materi A4: a different provider (Weser Cloud), the same method on other numbers. Case assumption. */
export const WESER = { falling: { customers: 25, left: 5 }, stable: { customers: 300, left: 12 }, fallingNow: 30, revenue: 12000 };
export const WESER_RESULT = (() => {
  const rate = rateOf(WESER.falling.left, WESER.falling.customers);
  const other = rateOf(WESER.stable.left, WESER.stable.customers);
  return { rate, other, lift: liftOf(rate, other), risk: atRisk(WESER.fallingNow, rate, WESER.revenue) };
})();

/* ------------------------------------------------------------------ Block 1.3a · eight customers */

export type CustId = "c1" | "c2" | "c3" | "c4" | "c5" | "c6" | "c7" | "c8";
export type Customer = { id: CustId; name: string; orders: number; days: number; services: number; revenue: number; trend: number };
export const CUSTOMERS: Customer[] = [
  { id: "c1", name: "Alpen Logistik", orders: 12, days: 25, services: 4, revenue: 42000, trend: 5 },
  { id: "c2", name: "Brenner Bau", orders: 2, days: 160, services: 1, revenue: 9000, trend: -45 },
  { id: "c3", name: "Contor Handel", orders: 24, days: 10, services: 2, revenue: 8000, trend: 2 },
  { id: "c4", name: "Delta Kliniken", orders: 4, days: 70, services: 5, revenue: 65000, trend: -3 },
  { id: "c5", name: "Eifel Energie", orders: 3, days: 150, services: 2, revenue: 21000, trend: 30 },
  { id: "c6", name: "Fuchs Maschinen", orders: 6, days: 120, services: 3, revenue: 30000, trend: -38 },
  { id: "c7", name: "Gerlach Medien", orders: 8, days: 40, services: 1, revenue: 11000, trend: -8 },
  { id: "c8", name: "Hansa Versicherung", orders: 5, days: 60, services: 3, revenue: 38000, trend: 0 },
];
export const CUST_BY_ID = Object.fromEntries(CUSTOMERS.map((c) => [c.id, c])) as Record<CustId, Customer>;
export const PICK = 2;
/** Most valuable to keep = the highest yearly revenue (Materi A6). */
export const VALUABLE_TRUTH: CustId[] = ["c4", "c1"];
/** Most likely to churn = usage down 30% or more and a gap well beyond the customer's own rhythm (Materi A5, A6). */
export const CHURN_TRUTH: CustId[] = ["c2", "c6"];
export const PICK_WHY = bi({
  c1: t("Second-highest revenue (€42,000), four services, usage steady: valuable and safe.", "Zweithöchster Umsatz (42.000 €), vier Services, stabile Nutzung: wertvoll und sicher."),
  c2: t("Usage down 45%, 160 days since the last order, one service: the clearest churn risk.", "Nutzung minus 45 %, 160 Tage seit der letzten Bestellung, ein Service: das klarste Abwanderungsrisiko."),
  c3: t("The most frequent buyer (24 orders) but only €8,000 a year: frequency is not value.", "Der häufigste Käufer (24 Bestellungen), aber nur 8.000 € im Jahr: Häufigkeit ist nicht Wert."),
  c4: t("Highest revenue (€65,000) and all five services: the most valuable customer, though it orders rarely.", "Höchster Umsatz (65.000 €) und alle fünf Services: der wertvollste Kunde, obwohl er selten bestellt."),
  c5: t("150 days without an order looks like churn, but usage is up 30%: a project customer starting its season.", "150 Tage ohne Bestellung sehen nach Churn aus, aber die Nutzung ist um 30 % gestiegen: ein Projektkunde am Start seiner Saison."),
  c6: t("Usage down 38% and 120 days since the last order, after a good history: a fading customer, and a valuable one.", "Nutzung minus 38 % und 120 Tage seit der letzten Bestellung, nach guter Vorgeschichte: ein nachlassender Kunde, und ein wertvoller."),
  c7: t("One service and slightly falling use: worth watching, not yet a churn signal (under 30%).", "Ein Service und leicht sinkende Nutzung: beobachten, noch kein Abwanderungssignal (unter 30 %)."),
  c8: t("Third-highest revenue, three services, flat use: solid, but not in the top two.", "Dritthöchster Umsatz, drei Services, gleichbleibende Nutzung: solide, aber nicht unter den ersten zwei."),
});

/* ------------------------------------------------------------------ Block 1.3b · three insights */

export type Basis = "frequency" | "gap" | "services";
export const BASES = bi([
  { id: "frequency" as Basis, label: t("Frequency of purchases", "Häufigkeit der Käufe"), short: t("Frequency", "Häufigkeit") },
  { id: "gap" as Basis, label: t("Time between purchases", "Zeit zwischen den Käufen"), short: t("Time between", "Zeit dazwischen") },
  { id: "services" as Basis, label: t("Use of services", "Nutzung der Services"), short: t("Service use", "Service-Nutzung") },
]);
export const BASIS_LABEL = bi({ frequency: t("Frequency of purchases", "Häufigkeit der Käufe"), gap: t("Time between purchases", "Zeit zwischen den Käufen"), services: t("Use of services", "Nutzung der Services") });
export const INSIGHT_COUNT = 3;
export const INSIGHT_MIN = 45;
export const INSIGHT_FRAME = bi({ v: t("[What the data shows] for [which customers], so [what it means or what to do].", "[Was die Daten zeigen] bei [welchen Kunden], also [was es bedeutet oder was zu tun ist].") });
/** True when the sentence draws a conclusion. A floor, not a judge of quality; English and German forms. */
export const hasSoWhat = (s: string) => /\b(so|therefore|which means|because|means|meaning|so that|thus|hence|also|daher|deshalb|weil|das heißt|bedeutet|sodass|damit)\b/i.test(s);
