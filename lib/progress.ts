import { MATERIALS } from "@/data/materialIndex";
import { LINE_IDS } from "@/data/ladder";
import { PICK } from "@/data/forecast";
import { PATTERN_IDS, REC_IDS } from "@/data/patterns";
import { CHOOSE } from "@/data/measures";
import { ARCH_IDS, COMP_CHOOSE, CRIT_IDS, SIT_IDS, SOURCE_IDS } from "@/data/route2";
import { citesForecastFigure, funded, hasNumber, insightFlags } from "@/lib/checks";
import type { RouteNo } from "@/lib/routes";
import { parseAmount } from "@/lib/parseAmount";
import type { Persisted } from "@/store/useStore";

export type TaskBlockId = "b11" | "b12" | "b13" | "b14" | "b21" | "b22" | "b23" | "b31" | "b32" | "b33" | "b34" | "b35" | "b36";

/**
 * Blocks that deepen or repeat a skill a Core block already teaches, rather than sit on the shortest path to their route's own
 * objective. Collapsed by default via OptionalSection, never removed (CLAUDE.md #6), never required by the missing list or the
 * dossier ring (#35).
 * Route 1 ("from raw data to a decision: tell data from insight, estimate the risk, recognise the patterns, choose measures"):
 * Core 1.1 (data, information, insight), 1.2 (a first forecast), 2.1 (tag the twelve records), 2.3 (choose, score and order three
 * measures): four blocks at most. Optional 1.3, 1.4, 2.2.
 * Route 2 ("decide a data architecture although the data is of uneven quality"): Core 3.5 (fund, sequence, own, with triggers) and
 * 3.6 (the decision, assumptions, tripwire). Optional 3.1, 3.2, 3.3, 3.4 (the same narrowing as Day 6, README note 25).
 */
export const OPTIONAL_BLOCKS: TaskBlockId[] = ["b13", "b14", "b22", "b31", "b32", "b33", "b34"];
export const isOptionalBlock = (b: TaskBlockId) => (OPTIONAL_BLOCKS as string[]).includes(b);
const len = (t: string) => t.trim().length;
export const MIN_SENTENCE = 40;
export const MIN_LINE = 30;

/** Which task blocks are complete. Complete means filled in, never correct. */
export function taskBlocks(p: Persisted): Record<TaskBlockId, boolean> {
  const { l1, r2 } = p;
  const f = funded(r2);
  return {
    b11: LINE_IDS.every((id) => l1.sort[id] !== null) && len(l1.extraInsight) >= MIN_LINE,
    b12: (["F1", "F2", "F3"] as const).every((k) => parseAmount(l1.fig[k]) !== null) && len(l1.meaning) >= MIN_SENTENCE && citesForecastFigure(l1.meaning),
    b13: l1.valuable.length === PICK && l1.churners.length === PICK && insightFlags(l1).length === 0,
    b14: len(l1.reflect.interpret) >= MIN_LINE && len(l1.reflect.causation) >= MIN_LINE && len(l1.reflect.decider) >= MIN_LINE,
    b21: REC_IDS.every((id) => l1.tags[id] !== null),
    b22: l1.unc.length >= 2 && PATTERN_IDS.every((x) => !!l1.rows[x].risk && !!l1.rows[x].meaning && !!l1.rows[x].measure) && len(l1.misread) >= MIN_LINE,
    b23:
      l1.chosen.length === CHOOSE &&
      l1.chosen.every((id) => l1.aims[id] !== undefined && !!l1.exp[id] && !!l1.fea[id] && !!l1.eff[id]) &&
      l1.order.length === CHOOSE &&
      l1.chosen.every((id) => l1.order.includes(id)) &&
      len(l1.why) >= 60,
    b31: r2.principles.length === 3 && r2.principles.every((k) => len(r2.principleText[k] ?? "") >= MIN_LINE),
    b32: SOURCE_IDS.every((s) => !!r2.sources[s]),
    b33: r2.comps.length === COMP_CHOOSE && r2.comps.every((id) => CRIT_IDS.every((c) => !!r2.rate[`${id}.${c}`])) && !!r2.greatest && len(r2.greatestWhy) >= 40,
    b34: SIT_IDS.every((s) => !!r2.logic[s]?.action && !!r2.logic[s]?.owner),
    b35:
      f.length > 0 &&
      f.every((id) => r2.start[id] != null && !!r2.owner[id] && len(r2.trigger[id] ?? "") >= 20 && hasNumber(r2.trigger[id] ?? "")) &&
      (ARCH_IDS.every((id) => r2.alloc[id]) || (len(r2.postponed) >= MIN_LINE && len(r2.pickup) >= 15 && hasNumber(r2.pickup))),
    b36: !!r2.decision && r2.assumptions.every((a) => len(a) >= MIN_LINE) && !!r2.tripKpi && parseAmount(r2.tripThreshold) !== null && !!r2.tripMonth && !!r2.tripAction && len(r2.challenge) >= 60,
  };
}

const BLOCKS_OF: Record<RouteNo, TaskBlockId[]> = { 1: ["b11", "b12", "b13", "b14", "b21", "b22", "b23"], 2: ["b31", "b32", "b33", "b34", "b35", "b36"] };

/** Dossier progress for one route: its Core cards marked read + its Core task blocks completed (Optional ones sit outside the ring, #35). */
export function dossierProgress(p: Persisted, route: RouteNo): { done: number; total: number } {
  const block = route === 1 ? "A" : "B";
  const cards = MATERIALS.filter((m) => m.block === block && !m.optional);
  const read = cards.filter((m) => p.ui.sectionsRead[m.id]).length;
  const tb = taskBlocks(p);
  const coreBlocks = BLOCKS_OF[route].filter((b) => !isOptionalBlock(b));
  return { done: read + coreBlocks.filter((b) => tb[b]).length, total: cards.length + coreBlocks.length };
}
