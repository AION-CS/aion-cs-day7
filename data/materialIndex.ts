import { bi, t } from "@/lib/lang";
import { TASK1_MINUTES, TASK2_MINUTES } from "@/lib/routes";

/** One registry for every material card: the rail, the cards and the task chips all read it. */
export type MaterialId = "A1" | "A2" | "A3" | "A4" | "A5" | "A6" | "A7" | "B1" | "B2" | "B3" | "B4" | "B5";
export type Block = "A" | "B";
export type MaterialMeta = { id: MaterialId; block: Block; title: string; minutes: number };

/** Day 7: Materi A (Route 1, Levels 1 and 2) seven cards, 60 minutes; Materi B (Route 2, Level 3) five cards, 60 minutes. */
export const MATERIALS: MaterialMeta[] = bi([
  { id: "A1" as MaterialId, block: "A" as Block, title: t("Gut feeling or data: what data-driven retention means", "Bauchgefühl oder Daten: was datengetriebene Kundenbindung heißt"), minutes: 8 },
  { id: "A2" as MaterialId, block: "A" as Block, title: t("From data to decision: data, information, insight", "Von Daten zur Entscheidung: Daten, Information, Insight"), minutes: 9 },
  { id: "A3" as MaterialId, block: "A" as Block, title: t("Big data and smart insights: chances and limits", "Big Data und Smart Insights: Chancen und Grenzen"), minutes: 8 },
  { id: "A4" as MaterialId, block: "A" as Block, title: t("A first forecast: rates, lift and revenue at risk", "Eine erste Prognose: Raten, Lift und gefährdeter Umsatz"), minutes: 10 },
  { id: "A5" as MaterialId, block: "A" as Block, title: t("Recognising behaviour patterns: anchored, fading, dormant, cyclical", "Verhaltensmuster erkennen: verankert, nachlassend, ruhend, zyklisch"), minutes: 9 },
  { id: "A6" as MaterialId, block: "A" as Block, title: t("From pattern to action: value, risk, measure and uncertainty", "Vom Muster zur Handlung: Wert, Risiko, Maßnahme und Unsicherheit"), minutes: 8 },
  { id: "A7" as MaterialId, block: "A" as Block, title: t("Prioritising data-based measures: explanatory power, feasibility, effect", "Datenbasierte Maßnahmen priorisieren: Erklärungskraft, Machbarkeit, Wirkung"), minutes: 8 },
  { id: "B1" as MaterialId, block: "B" as Block, title: t("Data as a competitive advantage: the target vision", "Daten als Wettbewerbsvorteil: das Zielbild"), minutes: 12 },
  { id: "B2" as MaterialId, block: "B" as Block, title: t("Relevant data sources: the decision first, then the data", "Relevante Datenquellen: zuerst die Entscheidung, dann die Daten"), minutes: 12 },
  { id: "B3" as MaterialId, block: "B" as Block, title: t("A system for behavioural analysis: four tests", "Ein System für Verhaltensanalyse: vier Tests"), minutes: 12 },
  { id: "B4" as MaterialId, block: "B" as Block, title: t("Decision logic: when to intervene", "Entscheidungslogik: wann eingreifen"), minutes: 12 },
  { id: "B5" as MaterialId, block: "B" as Block, title: t("Deciding with uncertain data, and the architecture", "Mit unsicheren Daten entscheiden, und die Architektur"), minutes: 12 },
]);

export const MATERIAL_BY_ID = Object.fromEntries(MATERIALS.map((m) => [m.id, m])) as Record<MaterialId, MaterialMeta>;
export const materialAnchorId = (id: MaterialId) => `mat-${id}`;

export type RailSection = { id: string; label: string; sub: string; minutes: number };
export const SECTIONS: Record<1 | 2, RailSection[]> = bi({
  1: [
    { id: "materi-a", label: t("Materi A", "Materi A"), sub: t("Levels 1 + 2 · data and patterns", "Level 1 + 2 · Daten und Muster"), minutes: 60 },
    { id: "task-1", label: t("Task 1", "Task 1"), sub: t("Customer Data Analysis · one case", "Customer Data Analysis · ein Fall"), minutes: TASK1_MINUTES },
  ],
  2: [
    { id: "materi-b", label: t("Materi B", "Materi B"), sub: t("Level 3 · decision architecture", "Level 3 · Entscheidungsarchitektur"), minutes: 60 },
    { id: "task-2", label: t("Task 2", "Task 2"), sub: t("Data Decision Memo · CDO", "Data Decision Memo · CDO"), minutes: TASK2_MINUTES },
  ],
});
