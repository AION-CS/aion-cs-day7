import { FIGURE_IDS, FORECAST, SMART, atRisk, liftOf, rateOf } from "@/data/forecast";
import type { FigureId } from "@/data/forecast";
import { tt } from "@/lib/lang";
import { parseAmount } from "@/lib/parseAmount";

/**
 * The "automatic calculator" under a calculation question: the formula split into small labelled parts. The learner types each part
 * (a value read from a printed row); the result is computed live and can be copied into the answer field. On "Check", every part is
 * compared with the value it should hold, and a wrong part names the exact row to read, never the value. Expected values come from the
 * same constants as the tables and the model answers (data/forecast.ts).
 */
export type CalcPart = { id: string; label: string; expected: number; tolerance?: number; clue: string };
export type CalcBuilder = { parts: CalcPart[]; compute: (v: Record<string, number>) => number; show: (v: Record<string, string>) => string };

const f1Builder: CalcBuilder = {
  get parts() {
    return [
      { id: "left", label: tt("Customers in the group who left", "Kunden der Gruppe, die gingen"), expected: SMART.falling.left, clue: tt("“Last year”: the leavers in the row “usage fell by 30% or more”, not in the stable row.", "„Letztes Jahr“: die Abgänge in der Zeile „Nutzung um 30 % oder mehr gesunken“, nicht in der stabilen Zeile.") },
      { id: "customers", label: tt("Customers in the group", "Kunden der Gruppe"), expected: SMART.falling.customers, clue: tt("“Last year”: all customers in the same row, not this quarter's count and not all 400.", "„Letztes Jahr“: alle Kunden derselben Zeile, nicht die Zahl dieses Quartals und nicht alle 400.") },
    ];
  },
  compute: (v) => rateOf(v.left, v.customers),
  show: (v) => `${v.left} ÷ ${v.customers} × 100`,
};

const f2Builder: CalcBuilder = {
  get parts() {
    return [
      { id: "rate", label: tt("Churn rate of the signal group (%)", "Churn Rate der Signalgruppe (%)"), expected: FORECAST.f1, tolerance: 0.05, clue: tt("This is your F1: the churn rate of the customers whose usage fell.", "Das ist Ihr F1: die Churn Rate der Kunden mit gesunkener Nutzung.") },
      { id: "left", label: tt("Other customers who left", "Übrige Kunden, die gingen"), expected: SMART.stable.left, clue: tt("“Last year”: the leavers in the row “usage stable or rising”.", "„Letztes Jahr“: die Abgänge in der Zeile „Nutzung stabil oder steigend“.") },
      { id: "customers", label: tt("Other customers", "Übrige Kunden"), expected: SMART.stable.customers, clue: tt("“Last year”: all customers in the row “usage stable or rising”.", "„Letztes Jahr“: alle Kunden der Zeile „Nutzung stabil oder steigend“.") },
    ];
  },
  compute: (v) => liftOf(v.rate, rateOf(v.left, v.customers)),
  show: (v) => `${v.rate} ÷ (${v.left} ÷ ${v.customers} × 100)`,
};

const f3Builder: CalcBuilder = {
  get parts() {
    return [
      { id: "now", label: tt("Customers showing the signal now", "Kunden, die das Signal jetzt zeigen"), expected: SMART.fallingNow, clue: tt("“This quarter”: the customers whose usage has fallen now, not last year's 40.", "„Dieses Quartal“: die Kunden, deren Nutzung jetzt gesunken ist, nicht die 40 des letzten Jahres.") },
      { id: "rate", label: tt("Churn rate of the signal group (%)", "Churn Rate der Signalgruppe (%)"), expected: FORECAST.f1, tolerance: 0.05, clue: tt("Your F1, as a percentage; the calculator divides it by 100.", "Ihr F1, in Prozent; der Rechner teilt ihn durch 100.") },
      { id: "revenue", label: tt("Average yearly revenue per customer (€)", "Durchschnittlicher Jahresumsatz pro Kunde (€)"), expected: SMART.revenue, clue: tt("“All customers”: the average yearly revenue per customer.", "„Alle Kunden“: der durchschnittliche Jahresumsatz pro Kunde.") },
    ];
  },
  compute: (v) => atRisk(v.now, v.rate, v.revenue),
  show: (v) => `${v.now} × ${v.rate}% × ${v.revenue}`,
};

export const FIGURE_BUILDERS: Record<FigureId, CalcBuilder> = { F1: f1Builder, F2: f2Builder, F3: f3Builder };
export const figAnswer = (id: FigureId) => ({ F1: FORECAST.f1, F2: FORECAST.f2, F3: FORECAST.f3 })[id];
export { FIGURE_IDS };

export const partKey = (figure: string, part: string) => `${figure}.${part}`;
export function partValues(b: CalcBuilder, figure: string, parts: Record<string, string>): Record<string, number | null> {
  return Object.fromEntries(
    b.parts.map((p) => {
      const raw = (parts[partKey(figure, p.id)] ?? "").trim();
      return [p.id, raw ? parseAmount(raw) : null];
    }),
  );
}
export function builderResult(b: CalcBuilder, figure: string, parts: Record<string, string>): number | null {
  const v = partValues(b, figure, parts);
  if (Object.values(v).some((x) => x === null)) return null;
  const r = b.compute(v as Record<string, number>);
  return Number.isFinite(r) ? Math.round(r * 1e6) / 1e6 : null;
}
export function wrongParts(b: CalcBuilder, figure: string, parts: Record<string, string>): string[] {
  const v = partValues(b, figure, parts);
  return b.parts.filter((p) => v[p.id] !== null && Math.abs((v[p.id] as number) - p.expected) > (p.tolerance ?? 1e-9)).map((p) => partKey(figure, p.id));
}
export function allPartsRight(b: CalcBuilder, figure: string, parts: Record<string, string>): boolean {
  const v = partValues(b, figure, parts);
  return Object.values(v).every((x) => x !== null) && wrongParts(b, figure, parts).length === 0;
}
export function modelParts(builders: Partial<Record<string, CalcBuilder>>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [fid, b] of Object.entries(builders)) if (b) for (const p of b.parts) out[partKey(fid, p.id)] = String(p.expected);
  return out;
}
export function figurePartFlags(parts: Record<string, string>): string[] {
  return FIGURE_IDS.flatMap((f) => wrongParts(FIGURE_BUILDERS[f], f, parts));
}
