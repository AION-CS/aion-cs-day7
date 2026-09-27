import { bi, t } from "@/lib/lang";

/**
 * Day 7 route registry: Customer Retention & Buying Behaviour in B2B IT Sales, Module 4, Day 1 (data-driven customer retention,
 * behavioural patterns and first forecasts). From Day 3 on, a day has TWO routes (CLAUDE.md #30): Route 1 merges Level 1 and Level 2
 * on one case, Route 2 is Level 3.
 */
export const COURSE = bi({
  title: t("Understanding Data, Analysing Customer Behaviour and Recognising Patterns", "Daten verstehen, Kundenverhalten analysieren und Muster erkennen"),
  site: t("Retention Lab · Day 7", "Retention Lab · Tag 7"),
  module: t("Module 4, Day 1 of 2", "Modul 4, Tag 1 von 2"),
  course: t("Customer Retention & Buying Behaviour in B2B IT Sales", "Customer Retention & Kaufverhalten im B2B-IT-Vertrieb"),
  day: 7,
  company: "SmartData IT Solutions GmbH",
});

export type RouteNo = 1 | 2;

export const BLOCK_MINUTES = { "1.1": 6, "1.2": 10, "1.3": 9, "1.4": 5, "2.1": 8, "2.2": 10, "2.3": 12, "3.1": 5, "3.2": 8, "3.3": 10, "3.4": 8, "3.5": 10, "3.6": 9 } as const;
const sum = (keys: (keyof typeof BLOCK_MINUTES)[]) => keys.reduce((s, k) => s + BLOCK_MINUTES[k], 0);
export const TASK1_MINUTES = sum(["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3"]);
export const TASK2_MINUTES = sum(["3.1", "3.2", "3.3", "3.4", "3.5", "3.6"]);

export type RouteInfo = { n: RouteNo; href: string; short: string; title: string; level: string; blurb: string; plan: { label: string; minutes: number }[]; built: boolean };

export const ROUTES: RouteInfo[] = bi([
  {
    n: 1 as RouteNo,
    href: "/route-1/",
    short: t("Data & patterns", "Daten & Muster"),
    title: t("Route 1 · From data to insight", "Route 1 · Von Daten zu Erkenntnis"),
    level: t("Levels 1 + 2 · Knowledge and application", "Level 1 + 2 · Wissen und Anwendung"),
    blurb: t(
      "One case, two levels: SmartData IT Solutions loses customers and decides from experience, not from the data it already has. You learn the ladder from data to decision, the chances and limits of big data, and how a first forecast is made. Then you sort report lines, compute a forecast, pick the valuable and the at-risk customers, tag twelve customer records with a behaviour pattern, name what each pattern says and what to do, and choose three measures inside €160,000 and five months. Material first, then one task that ends in a Customer Data Analysis File.",
      "Ein Fall, zwei Level: SmartData IT Solutions verliert Kunden und entscheidet aus Erfahrung, nicht aus den Daten, die es schon hat. Sie lernen die Stufen von Daten bis zur Entscheidung, Chancen und Grenzen von Big Data und wie eine erste Prognose entsteht. Dann sortieren Sie Berichtszeilen, berechnen eine Prognose, wählen die wertvollen und die gefährdeten Kunden, ordnen zwölf Kundendatensätze einem Verhaltensmuster zu, sagen, was jedes Muster bedeutet und was zu tun ist, und wählen drei Maßnahmen innerhalb von 160.000 € und fünf Monaten. Erst das Material, dann eine Aufgabe, die mit einer Customer Data Analysis File endet.",
    ),
    plan: [
      { label: t("Materi A · seven cards, Levels 1 and 2", "Materi A · sieben Karten, Level 1 und 2"), minutes: 60 },
      { label: t("Task 1 · Customer Data Analysis, one task", "Task 1 · Customer Data Analysis, eine Aufgabe"), minutes: TASK1_MINUTES },
    ],
    built: true,
  },
  {
    n: 2 as RouteNo,
    href: "/route-2/",
    short: t("Decide", "Entscheiden"),
    title: t("Route 2 · Management decision", "Route 2 · Managemententscheidung"),
    level: t("Level 3 · Management decision", "Level 3 · Managemententscheidung"),
    blurb: t(
      "You are now SmartData's Chief Data Officer. Decisions are made from experience, the data exists but is not used, and its quality varies. You set the target vision of a data-driven organisation, decide which data sources count, build a system for behavioural analysis, write the rules for when to intervene, and commit to a staged plan before the data is clean. Material first, then a Data Decision Memo that assembles itself beside your answers.",
      "Sie sind jetzt Chief Data Officer von SmartData. Entscheidungen fallen aus Erfahrung, die Daten sind da, werden aber nicht genutzt, und ihre Qualität schwankt. Sie legen das Zielbild einer datengetriebenen Organisation fest, entscheiden, welche Datenquellen zählen, bauen ein System für Verhaltensanalyse, schreiben die Regeln, wann eingegriffen wird, und legen sich auf einen gestuften Plan fest, bevor die Daten sauber sind. Erst das Material, dann ein Data Decision Memo, das sich neben Ihren Antworten selbst zusammensetzt.",
    ),
    plan: [
      { label: t("Materi B · five cards, Level 3", "Materi B · fünf Karten, Level 3"), minutes: 60 },
      { label: t("Task 2 · Data Decision Memo", "Task 2 · Data Decision Memo"), minutes: TASK2_MINUTES },
    ],
    built: true,
  },
]);
