"use client";

import { Block31, Block32, Block33, Block34, Block35, Block36 } from "@/components/task2/Blocks";
import { MemoPanel } from "@/components/task2/MemoPanel";
import { ExportBar } from "@/components/ui/ExportBar";
import { Callout } from "@/components/ui/MaterialCard";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { MEASURE_BY_ID } from "@/data/measures";
import { FIG_ROW_ID, QUALITY_BAR, R2_BUDGET, R2_FIG, R2_MONTHS, SOURCE_BY_ID } from "@/data/route2";
import type { FigKey } from "@/data/route2";
import { tallyOf } from "@/lib/checks";
import { Gloss } from "@/lib/glossify";
import { euro, pct, tt } from "@/lib/lang";
import { memoBody } from "@/lib/exportDoc";
import { r2Missing } from "@/lib/missing";
import { BLOCK_MINUTES, TASK2_MINUTES } from "@/lib/routes";
import { exportName } from "@/lib/slug";
import { useJumpTo } from "@/lib/useJumpTo";
import { usePersisted } from "@/store/usePersisted";
import { useHydrated } from "@/store/useStore";

/** Every figure a Route 2 number is built from, printed once, each row with a stable id for the clue kits (CLAUDE.md #42, #44). */
function FiguresTable() {
  const rows: [FigKey, string, string][] = [
    ["customers", tt("Customers", "Kunden"), String(R2_FIG.customers)],
    ["left", tt("Customers who left last year", "Kunden, die letztes Jahr gingen"), String(R2_FIG.left)],
    ["leftFell", tt("Of them, usage had fallen by 30% or more before they left", "Davon: Nutzung war vor dem Gehen um 30 % oder mehr gesunken"), String(R2_FIG.leftFell)],
    ["groupFell", tt("Last year's customers whose usage fell by 30% or more (14 of them left)", "Kunden des letzten Jahres mit um 30 % oder mehr gesunkener Nutzung (14 davon gingen)"), String(R2_FIG.groupFell)],
    ["flagged", tt("Customers flagged now (usage fell by 30% or more this quarter)", "Jetzt markierte Kunden (Nutzung in diesem Quartal um 30 % oder mehr gesunken)"), String(R2_FIG.flagged)],
    ["revenue", tt("Average yearly revenue per customer", "Durchschnittlicher Jahresumsatz pro Kunde"), euro(R2_FIG.revenue)],
    ["save", tt("Flagged customers who stay today (save rate)", "Heute gehaltene markierte Kunden (Save Rate)"), pct(R2_FIG.save)],
    ["churn", tt("Yearly churn of all customers (32 of 400)", "Jährlicher Churn aller Kunden (32 von 400)"), pct(R2_FIG.churn)],
    ["managers", tt("Sales managers", "Vertriebsleiter"), String(R2_FIG.managers)],
    ["weeksQuarter", tt("Weeks in a quarter", "Wochen in einem Quartal"), String(R2_FIG.weeksQuarter)],
    ["usage", tt("Platform usage logs · how complete", "Plattform-Nutzungslogs · wie vollständig"), pct(SOURCE_BY_ID.usage.complete)],
    ["orders", tt("Order history · how complete", "Bestellhistorie · wie vollständig"), pct(SOURCE_BY_ID.orders.complete)],
    ["tickets", tt("Support tickets · how complete", "Support-Tickets · wie vollständig"), pct(SOURCE_BY_ID.tickets.complete)],
    ["crm", tt("CRM notes · how complete", "CRM-Notizen · wie vollständig"), pct(SOURCE_BY_ID.crmnotes.complete)],
    ["bar", tt("The quality bar: a data source is usable from this share complete (a rule, Materi B5)", "Die Qualitätslinie: Eine Datenquelle ist ab diesem Anteil vollständig nutzbar (eine Regel, Materi B5)"), pct(QUALITY_BAR)],
  ];
  return (
    <div className="relative overflow-x-auto rounded-lg border border-line">
      <table className="w-full border-collapse text-caption">
        <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("SmartData today · the figures every number in this task is found from (Case assumption)", "SmartData heute · die Zahlen, aus denen jede Zahl dieser Aufgabe gefunden wird (Fallannahme)")}</caption>
        <tbody>
          {rows.map(([k, label, value]) => (
            <tr key={k} id={FIG_ROW_ID(k)} className="border-t border-line">
              <td className="px-3 py-1.5">{label}</td>
              <td className="tnum px-3 py-1.5 text-right font-semibold">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** The situation of Route 2, stated once, directly above the task, with a soft pointer to the learner's own Route 1 Core answers (#40). */
function CaseBrief() {
  const hydrated = useHydrated();
  const p = usePersisted();
  const jump = useJumpTo();
  const tally = tallyOf(p.l1.tags);
  const chosen = p.l1.chosen.map((id) => MEASURE_BY_ID[id].name);
  const has = hydrated && (tally.tagged > 0 || chosen.length > 0);
  return (
    <section id="task-2" aria-labelledby="task2-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="task2-h">{tt("The situation: you are the Chief Data Officer", "Die Lage: Sie sind Chief Data Officer")}</h2>
        <span className="smallcaps">{tt("Read once · about 4 min", "Einmal lesen · ca. 4 Min.")}</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt(
            "SmartData has run its first data analysis and found patterns in how customers leave. You now answer for how the whole company decides with data. Decisions are still made from experience, the data is available but not used, and customer behaviour is hard to assess. Data quality varies from source to source, the budget is limited and time is short. The board wants a data-driven decision architecture, and a decision now, not after the data is clean.",
            "SmartData hat seine erste Datenanalyse durchgeführt und Muster darin gefunden, wie Kunden gehen. Sie verantworten jetzt, wie das ganze Unternehmen mit Daten entscheidet. Entscheidungen fallen noch aus Erfahrung, die Daten sind verfügbar, werden aber nicht genutzt, und das Kundenverhalten ist schwer einzuschätzen. Die Datenqualität schwankt von Quelle zu Quelle, das Budget ist begrenzt und die Zeit knapp. Der Vorstand will eine datengetriebene Entscheidungsarchitektur, und eine Entscheidung jetzt, nicht erst, wenn die Daten sauber sind.",
          )}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("The limits", "Die Grenzen")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              {tt("Budget: ", "Budget: ")}
              <strong>{euro(R2_BUDGET)}</strong> {tt("(Case assumption)", "(Fallannahme)")}
            </li>
            <li>
              {tt("Time: ", "Zeit: ")}
              <strong>{tt(`${R2_MONTHS} months`, `${R2_MONTHS} Monate`)}</strong>
            </li>
            <li>{tt("The items and costs are in Block 3.5, the doubts table and the baselines for the tripwire in Block 3.6, and every figure a number needs in “SmartData today” below.", "Die Punkte und Kosten stehen in Block 3.5, die Tabelle der Zweifel und die Ausgangswerte für den Tripwire in Block 3.6, und jede Zahl, die eine Zahl braucht, in „SmartData heute“ unten.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption md:col-span-2">
          <p className="smallcaps">{tt(`What you decide · about ${BLOCK_MINUTES["3.5"] + BLOCK_MINUTES["3.6"]} min for the two core blocks`, `Was Sie entscheiden · ca. ${BLOCK_MINUTES["3.5"] + BLOCK_MINUTES["3.6"]} Min. für die zwei Kernblöcke`)}</p>
          <ol className="mt-1 grid list-decimal gap-x-6 pl-4 text-ink sm:grid-cols-2">
            <li>{tt("Which measures you fund, when each starts, who owns it and when you will know it works", "Welche Maßnahmen Sie finanzieren, wann jede startet, wer sie verantwortet und woran Sie merken, dass sie wirkt")}</li>
            <li>{tt("A decision despite uncertain data, with assumptions, a tripwire and an answer to the board", "Eine Entscheidung trotz unsicherer Daten, mit Annahmen, einem Tripwire und einer Antwort an den Vorstand")}</li>
          </ol>
          <p className="mt-1 text-ash">{tt(`The other four blocks (about ${TASK2_MINUTES - BLOCK_MINUTES["3.5"] - BLOCK_MINUTES["3.6"]} min) are optional: they deepen the vision, the data sources, the analysis system and the rules for when to act.`, `Die anderen vier Blöcke (ca. ${TASK2_MINUTES - BLOCK_MINUTES["3.5"] - BLOCK_MINUTES["3.6"]} Min.) sind optional: Sie vertiefen das Zielbild, die Datenquellen, das Analysesystem und die Regeln, wann gehandelt wird.`)}</p>
        </div>
      </div>
      <FiguresTable />
      <div role="note" className="rounded-lg border border-gold bg-accentSoft p-3 text-caption text-ink" id="task1-quote">
        <p className="smallcaps text-accent">{tt("Where Route 1 left off · your own answers", "Wo Route 1 aufgehört hat · Ihre eigenen Antworten")}</p>
        {has ? (
          <p className="mt-1">
            {tt("Records you tagged as fading, with a customer who then left: ", "Datensätze, die Sie als nachlassend eingeordnet haben, mit einem Kunden, der dann ging: ")}
            <strong>{tt(`${tally.count.fading}, of which ${tally.left.fading} left`, `${tally.count.fading}, davon ${tally.left.fading} gegangen`)}</strong>. {tt("Measures you chose: ", "Von Ihnen gewählte Maßnahmen: ")}
            <strong>{chosen.join(", ") || tt("none yet", "noch keine")}</strong>.
          </p>
        ) : (
          <p className="mt-1">{tt("You have not answered Route 1 yet. That is fine: nothing here is blocked, and this box fills in when you do.", "Sie haben Route 1 noch nicht beantwortet. Das ist in Ordnung: Hier ist nichts gesperrt, und dieses Feld füllt sich, sobald Sie es tun.")}</p>
        )}
        <button type="button" onClick={() => jump("block-2-3", "/route-1/")} className="btn-ghost btn-sm mt-2">
          {tt("Go to Block 2.3 in Route 1", "Zu Block 2.3 in Route 1")}
        </button>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt(
            "The brief gives the role and the situation: decisions based on experience, data available but not used, customer behaviour hard to assess, varying data quality, a limited budget and high time pressure, and the requirement to decide anyway. The budget, the sources, the costs, the figures in “SmartData today” and the baselines are made up for this exercise.",
            "Der Auftrag gibt Rolle und Lage vor: Entscheidungen aus Erfahrung, Daten verfügbar, aber ungenutzt, Kundenverhalten schwer einzuschätzen, schwankende Datenqualität, begrenztes Budget und hoher Zeitdruck, und die Pflicht, trotzdem zu entscheiden. Budget, Quellen, Kosten, die Zahlen in „SmartData heute“ und die Ausgangswerte sind für diese Übung erfunden.",
          )}
        </p>
      </Callout>
    </section>
  );
}

export function Task2() {
  const p = usePersisted();
  const missing = r2Missing(p);
  const filename = exportName(p.participant.name, "l3-decision-memo");
  return (
    <div className="space-y-6">
      <CaseBrief />
      <OptionalSection
        id="block-3-1"
        title={tt("Block 3.1 · The target vision: three principles", "Block 3.1 · Das Zielbild: drei Prinzipien")}
        minutes={BLOCK_MINUTES["3.1"]}
        reason={tt("Names the principles behind a data-driven organisation; the plan in Block 3.5 can be set without them.", "Benennt die Prinzipien hinter einer datengetriebenen Organisation; der Plan in Block 3.5 lässt sich auch ohne sie festlegen.")}
      >
        <Block31 />
      </OptionalSection>
      <OptionalSection
        id="block-3-2"
        title={tt("Block 3.2 · Relevant data sources", "Block 3.2 · Relevante Datenquellen")}
        minutes={BLOCK_MINUTES["3.2"]}
        reason={tt("Sorts eight data sources into core, later and leave out; Block 3.5 prints the figures it needs itself.", "Sortiert acht Datenquellen in Kern, später und weglassen; Block 3.5 druckt die Zahlen, die er braucht, selbst.")}
      >
        <Block32 />
      </OptionalSection>
      <OptionalSection
        id="block-3-3"
        title={tt("Block 3.3 · A system for behavioural analysis", "Block 3.3 · Ein System für Verhaltensanalyse")}
        minutes={BLOCK_MINUTES["3.3"]}
        reason={tt("Rates analysis components on four tests; the items in Block 3.5 carry their own costs and facts, so the plan does not need the ratings.", "Bewertet Analysebausteine nach vier Tests; die Punkte in Block 3.5 tragen ihre eigenen Kosten und Fakten, der Plan braucht die Bewertungen also nicht.")}
      >
        <Block33 />
      </OptionalSection>
      <OptionalSection
        id="block-3-4"
        title={tt("Block 3.4 · Decision logic: when to intervene", "Block 3.4 · Entscheidungslogik: wann eingreifen")}
        minutes={BLOCK_MINUTES["3.4"]}
        reason={tt("Writes the rule for when to act on a signal and who acts; Block 3.5 already names one owner per funded item.", "Schreibt die Regel, wann auf ein Signal gehandelt wird und wer handelt; Block 3.5 benennt schon einen Owner pro finanziertem Punkt.")}
      >
        <Block34 />
      </OptionalSection>
      <Block35 />
      <Block36 />
      <MemoPanel />
      <ExportBar
        id="export-l3"
        previewTitle={tt("Preview of your memo", "Vorschau Ihres Memos")}
        exportLabel={tt("Export the Data Decision Memo", "Data Decision Memo exportieren")}
        docTitle="Data Decision Memo"
        filename={filename}
        missing={missing}
        buildBody={() => memoBody(p)}
        showPreview={false}
      />
    </div>
  );
}
