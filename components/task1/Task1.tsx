"use client";

import { ExportBar } from "@/components/ui/ExportBar";
import { OptionalSection } from "@/components/ui/OptionalSection";
import { Block11, Block12, Block13, Block14 } from "@/components/task1/Part1";
import { Block21, Block22, Block23 } from "@/components/task1/Part2";
import { Callout } from "@/components/ui/MaterialCard";
import { BUDGET, MONTHS } from "@/data/measures";
import { analysisBody } from "@/lib/exportDoc";
import { l1Missing } from "@/lib/missing";
import { euro, tt } from "@/lib/lang";
import { exportName } from "@/lib/slug";
import { usePersisted } from "@/store/usePersisted";
import { Gloss } from "@/lib/glossify";
import { BLOCK_MINUTES, TASK1_MINUTES } from "@/lib/routes";

function CaseBrief() {
  return (
    <section id="case-brief" aria-labelledby="case-h" className="card space-y-3 p-4 md:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="case-h">{tt("The case: SmartData IT Solutions GmbH", "Der Fall: SmartData IT Solutions GmbH")}</h2>
        <span className="smallcaps">{tt("Read once · about 5 min", "Einmal lesen · ca. 5 Min.")}</span>
      </div>
      <p className="max-w-prose text-body text-ink">
        <Gloss>
          {tt(
            "SmartData IT Solutions GmbH is a German IT service provider for the Mittelstand: about 400 customers use its cloud platform and up to five services around it (backup, monitoring, helpdesk, security, e-mail archive). Customer behaviour is unclear, churn is high, and account managers decide whom to look after from experience. The data is there: every order, every login, every ticket. Nobody uses it.",
            "SmartData IT Solutions GmbH ist ein deutscher IT-Dienstleister für den Mittelstand: Etwa 400 Kunden nutzen seine Cloud-Plattform und bis zu fünf Services darum herum (Backup, Monitoring, Helpdesk, Sicherheit, E-Mail-Archiv). Das Kundenverhalten ist unklar, der Churn hoch, und Account Manager entscheiden aus Erfahrung, wen sie betreuen. Die Daten sind da: jede Bestellung, jedes Login, jedes Ticket. Niemand nutzt sie.",
          )}
        </Gloss>
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("What you have", "Was Sie haben")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>{tt("Nine lines from reports, logs and analysis notes (Block 1.1).", "Neun Zeilen aus Berichten, Logs und Analysenotizen (Block 1.1).")}</li>
            <li>{tt("Last year's usage records (Block 1.2); eight current customers (optional Block 1.3).", "Die Nutzungsdaten des letzten Jahres (Block 1.2); acht aktuelle Kunden (optionaler Block 1.3).")}</li>
            <li>{tt("Twelve customer records from last year, with what happened next (Block 2.1).", "Zwölf Kundendatensätze aus dem letzten Jahr, mit dem, was danach geschah (Block 2.1).")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt("The limits", "Die Grenzen")}</p>
          <ul className="mt-1 list-disc space-y-1 pl-4 text-ink">
            <li>
              {tt("Budget: ", "Budget: ")}
              <strong>{euro(BUDGET)}</strong>
            </li>
            <li>
              {tt("Time: ", "Zeit: ")}
              <strong>{tt(`${MONTHS} months`, `${MONTHS} Monate`)}</strong>
            </li>
            <li>{tt("The cost and weeks of every measure are printed in Block 2.3.", "Kosten und Wochen jeder Maßnahme stehen in Block 2.3.")}</li>
          </ul>
        </div>
        <div className="rounded-lg border border-line bg-canvas p-3 text-caption">
          <p className="smallcaps">{tt(`How the task runs · four core blocks, about ${BLOCK_MINUTES["1.1"] + BLOCK_MINUTES["1.2"] + BLOCK_MINUTES["2.1"] + BLOCK_MINUTES["2.3"]} min`, `So läuft die Aufgabe · vier Kernblöcke, ca. ${BLOCK_MINUTES["1.1"] + BLOCK_MINUTES["1.2"] + BLOCK_MINUTES["2.1"] + BLOCK_MINUTES["2.3"]} Min.`)}</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4 text-ink">
            <li>{tt("Block 1.1: sort nine report lines into data, information or insight (Level 1).", "Block 1.1: neun Berichtszeilen in Daten, Information oder Insight sortieren (Level 1).")}</li>
            <li>{tt("Block 1.2: a first forecast: how much riskier falling usage is, and what is at stake (Level 1).", "Block 1.2: eine erste Prognose: wie viel riskanter sinkende Nutzung ist und worum es geht (Level 1).")}</li>
            <li>{tt("Block 2.1: recognise four behaviour patterns in twelve records (Level 2).", "Block 2.1: vier Verhaltensmuster in zwölf Datensätzen erkennen (Level 2).")}</li>
            <li>{tt("Block 2.3: choose three data-based measures and defend the order (Level 2).", "Block 2.3: drei datenbasierte Maßnahmen wählen und die Reihenfolge begründen (Level 2).")}</li>
          </ol>
          <p className="mt-1 text-ash">{tt(`Three more blocks (about ${TASK1_MINUTES - BLOCK_MINUTES["1.1"] - BLOCK_MINUTES["1.2"] - BLOCK_MINUTES["2.1"] - BLOCK_MINUTES["2.3"]} min) are optional and folded.`, `Drei weitere Blöcke (ca. ${TASK1_MINUTES - BLOCK_MINUTES["1.1"] - BLOCK_MINUTES["1.2"] - BLOCK_MINUTES["2.1"] - BLOCK_MINUTES["2.3"]} Min.) sind optional und eingeklappt.`)}</p>
        </div>
      </div>
      <Callout label={tt("Case assumption", "Fallannahme")} tone="amber">
        <p>
          {tt(
            "The brief says: customer behaviour unclear, high churn, decisions based on experience instead of data, €160,000 and five months; the data named is purchase frequency, time between purchases and use of services. Everything else is made up for this exercise: the names, the records, the rates and the costs.",
            "Der Auftrag sagt: Kundenverhalten unklar, hoher Churn, Entscheidungen aus Erfahrung statt aus Daten, 160.000 € und fünf Monate; die genannten Daten sind Kaufhäufigkeit, Zeit zwischen Käufen und Nutzung der Services. Alles andere ist für diese Übung erfunden: die Namen, die Datensätze, die Raten und die Kosten.",
          )}
        </p>
      </Callout>
    </section>
  );
}

function PartHeading({ id, n, title, level }: { id: string; n: number; title: string; level: string }) {
  return (
    <div id={id} className="flex flex-wrap items-baseline gap-x-3 border-b-2 border-ink pb-1 pt-2">
      <span className="smallcaps text-accent">{tt(`Part ${n}`, `Teil ${n}`)}</span>
      <h2>{title}</h2>
      <span className="smallcaps ml-auto">{level}</span>
    </div>
  );
}

export function Task1() {
  const p = usePersisted();
  const missing = l1Missing(p);
  const filename = exportName(p.participant.name, "l1l2-data-analysis");
  return (
    <section id="task-1" aria-labelledby="task1-h" className="space-y-6">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{tt(`Task 1 · four core blocks, optional blocks folded`, `Task 1 · vier Kernblöcke, optionale Blöcke eingeklappt`)}</p>
        <h2 id="task1-h">{tt("Customer Data Analysis: from data to insight", "Customer Data Analysis: von Daten zu Erkenntnis")}</h2>
      </header>
      <CaseBrief />
      <PartHeading id="part-1" n={1} title={tt("Turn data into insight", "Aus Daten Erkenntnis machen")} level={tt("Level 1 · Knowledge", "Level 1 · Wissen")} />
      <Block11 />
      <Block12 />
      <OptionalSection
        id="block-1-3"
        title={tt("Block 1.3 · Valuable customers, customers at risk, three insights", "Block 1.3 · Wertvolle Kunden, gefährdete Kunden, drei Insights")}
        minutes={BLOCK_MINUTES["1.3"]}
        reason={tt("Practises the same step as Block 1.1 (turning data into an insight) on eight customers; the measures of Block 2.3 do not need it.", "Übt denselben Schritt wie Block 1.1 (aus Daten einen Insight machen) an acht Kunden; die Maßnahmen in Block 2.3 brauchen es nicht.")}
      >
        <Block13 />
      </OptionalSection>
      <OptionalSection
        id="block-1-4"
        title={tt("Block 1.4 · Coaching reflection: from Level 1 to Level 2", "Block 1.4 · Coaching-Reflexion: von Level 1 zu Level 2")}
        minutes={BLOCK_MINUTES["1.4"]}
        reason={tt("A reflective bridge between Level 1 and Level 2, not content the Customer Data Analysis File itself needs.", "Eine reflektierende Brücke zwischen Level 1 und Level 2, kein Inhalt, den die Customer Data Analysis File selbst braucht.")}
      >
        <Block14 />
      </OptionalSection>
      <PartHeading id="part-2" n={2} title={tt("Recognise patterns and act", "Muster erkennen und handeln")} level={tt("Level 2 · Application", "Level 2 · Anwendung")} />
      <Block21 />
      <OptionalSection
        id="block-2-2"
        title={tt("Block 2.2 · What each pattern says, how risky it is, and what to do", "Block 2.2 · Was jedes Muster sagt, wie riskant es ist, und was zu tun ist")}
        minutes={BLOCK_MINUTES["2.2"]}
        reason={tt("Reads a risk, a meaning and a measure for each pattern from your tags in Block 2.1; Block 2.3 can be answered without it.", "Liest für jedes Muster ein Risiko, eine Bedeutung und eine Maßnahme aus Ihrer Zuordnung in Block 2.1; Block 2.3 lässt sich auch ohne es beantworten.")}
      >
        <Block22 />
      </OptionalSection>
      <Block23 />
      <ExportBar
        id="export-l1l2"
        previewTitle={tt("Preview of your Customer Data Analysis File", "Vorschau Ihrer Customer Data Analysis File")}
        exportLabel={tt("Export the Customer Data Analysis File", "Customer Data Analysis File exportieren")}
        docTitle="Customer Data Analysis File"
        filename={filename}
        missing={missing}
        buildBody={() => analysisBody(p)}
      />
    </section>
  );
}
