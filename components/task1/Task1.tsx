"use client";

import { ExportBar } from "@/components/ui/ExportBar";
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
import { TASK1_MINUTES } from "@/lib/routes";

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
            <li>{tt("Last year's usage records and eight current customers (Blocks 1.2 and 1.3).", "Die Nutzungsdaten des letzten Jahres und acht aktuelle Kunden (Blöcke 1.2 und 1.3).")}</li>
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
          <p className="smallcaps">{tt(`How the task runs · about ${TASK1_MINUTES} min`, `So läuft die Aufgabe · ca. ${TASK1_MINUTES} Min.`)}</p>
          <ol className="mt-1 list-decimal space-y-1 pl-4 text-ink">
            <li>{tt("Turn data into insights and a first forecast; find the valuable and the at-risk customers (Level 1).", "Aus Daten Insights und eine erste Prognose machen; die wertvollen und die gefährdeten Kunden finden (Level 1).")}</li>
            <li>{tt("Recognise four behaviour patterns, say what each means and what to do (Level 2).", "Vier Verhaltensmuster erkennen, sagen, was jedes bedeutet und was zu tun ist (Level 2).")}</li>
            <li>{tt("Choose three data-based measures and defend the order.", "Drei datenbasierte Maßnahmen wählen und die Reihenfolge begründen.")}</li>
          </ol>
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
        <p className="smallcaps text-accent">{tt(`Task 1 · about ${TASK1_MINUTES} minutes`, `Task 1 · ca. ${TASK1_MINUTES} Minuten`)}</p>
        <h2 id="task1-h">{tt("Customer Data Analysis: from data to insight", "Customer Data Analysis: von Daten zu Erkenntnis")}</h2>
      </header>
      <CaseBrief />
      <PartHeading id="part-1" n={1} title={tt("Turn data into insight", "Aus Daten Erkenntnis machen")} level={tt("Level 1 · Knowledge", "Level 1 · Wissen")} />
      <Block11 />
      <Block12 />
      <Block13 />
      <Block14 />
      <PartHeading id="part-2" n={2} title={tt("Recognise patterns and act", "Muster erkennen und handeln")} level={tt("Level 2 · Application", "Level 2 · Anwendung")} />
      <Block21 />
      <Block22 />
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
