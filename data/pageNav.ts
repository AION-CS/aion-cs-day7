import { MATERIALS, materialAnchorId } from "@/data/materialIndex";
import type { RouteNo } from "@/lib/routes";
import type { TaskBlockId } from "@/lib/progress";
import { tt } from "@/lib/lang";

/** The page map on the right of every route (CLAUDE.md #28). Built on call, so it follows the language. */
export type NavItem = { id: string; short: string; title: string; done?: { card: string } | { block: TaskBlockId } };
export type NavGroup = { label: string; items: NavItem[] };

const cards = (block: "A" | "B"): NavItem[] => MATERIALS.filter((m) => m.block === block).map((m) => ({ id: materialAnchorId(m.id), short: m.id, title: m.title, done: { card: m.id } }));
const blk = (n: string, title: string, block: TaskBlockId): NavItem => ({ id: `block-${n.replace(".", "-")}`, short: n, title, done: { block } });

export function pageNav(route: RouteNo): NavGroup[] {
  if (route === 1)
    return [
      { label: "Materi A", items: cards("A") },
      {
        label: "Task 1",
        items: [
          { id: "case-brief", short: tt("Case", "Fall"), title: tt("The case: SmartData", "Der Fall: SmartData") },
          blk("1.1", tt("Data, information or insight", "Daten, Information oder Insight"), "b11"),
          blk("1.2", tt("A first forecast: three figures", "Eine erste Prognose: drei Werte"), "b12"),
          blk("1.3", tt("Valuable, at risk, three insights", "Wertvoll, gefährdet, drei Insights"), "b13"),
          blk("1.4", tt("Coaching reflection", "Coaching-Reflexion"), "b14"),
          blk("2.1", tt("Tag the twelve records", "Die zwölf Datensätze zuordnen"), "b21"),
          blk("2.2", tt("What each pattern says, and what to do", "Was jedes Muster sagt, und was zu tun ist"), "b22"),
          blk("2.3", tt("Three measures, scored and ordered", "Drei Maßnahmen, bewertet und geordnet"), "b23"),
          { id: "export-l1l2", short: "Export", title: tt("Export the Customer Data Analysis File", "Customer Data Analysis File exportieren") },
        ],
      },
    ];
  return [
    { label: "Materi B", items: cards("B") },
    {
      label: "Task 2",
      items: [
        { id: "task-2", short: tt("Case", "Fall"), title: tt("The situation and the budget", "Die Lage und das Budget") },
        blk("3.1", tt("The target vision", "Das Zielbild"), "b31"),
        blk("3.2", tt("Relevant data sources", "Relevante Datenquellen"), "b32"),
        blk("3.3", tt("The analysis system", "Das Analysesystem"), "b33"),
        blk("3.4", tt("When to intervene", "Wann eingreifen"), "b34"),
        blk("3.5", tt("The implementation architecture", "Die Umsetzungsarchitektur"), "b35"),
        blk("3.6", tt("The decision under uncertain data", "Die Entscheidung bei unsicheren Daten"), "b36"),
        { id: "export-l3", short: "Export", title: tt("Export the Data Decision Memo", "Data Decision Memo exportieren") },
      ],
    },
  ];
}
