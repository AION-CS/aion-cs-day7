"use client";

import { CARDS_A } from "@/components/materi/CardsA";
import { CARDS_B } from "@/components/materi/CardsB";
import { ReferencesAccordion } from "@/components/ui/ReferencesAccordion";
import { SECTIONS } from "@/data/materialIndex";
import type { RefKey } from "@/data/references";
import { tt } from "@/lib/lang";

const REFS_A: RefKey[] = ["davenport2007", "kahneman2011", "gdpr2016", "ackoff1989", "rowley2007", "mcafee2012", "boyd2012", "provost2013", "neslin2006", "fader2005", "ascarza2018", "pearl2018", "hubbard2014"];
const REFS_B: RefKey[] = ["davenport2007", "tetlock2015", "gdpr2016", "hubbard2014", "dama2017", "provost2013", "neslin2006", "kohavi2020", "courtney1997", "klein2007", "doran1981"];

function Block({ id, title, intro, children }: { id: string; title: string; intro: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="space-y-4">
      <header className="space-y-1">
        <p className="smallcaps text-accent">{title}</p>
        <h2 id={`${id}-h`}>{intro}</h2>
      </header>
      {children}
    </section>
  );
}
const NOTE = () => tt("Check every source before you teach from it: page numbers and editions differ between printings.", "Prüfen Sie jede Quelle, bevor Sie damit unterrichten: Seitenzahlen und Auflagen unterscheiden sich.");

export function MateriA() {
  const s = SECTIONS[1][0];
  return (
    <Block id={s.id} title={tt(`Materi A · ${s.minutes} minutes, facilitator-led`, `Materi A · ${s.minutes} Minuten, moderiert`)} intro={tt("Data-driven customer retention: from data to insight, patterns and a first forecast", "Datengetriebene Kundenbindung: von Daten zu Erkenntnis, Mustern und einer ersten Prognose")}>
      <p className="max-w-prose text-body text-ash">
        {tt(
          "Seven cards, Level 1 and Level 2 in one run: knowledge first (gut feeling against data, the ladder from data to decision, big data, a first forecast), then application (behaviour patterns, from pattern to action, choosing measures). Every diagram uses Weser Cloud, another provider, so the task is never answered for you.",
          "Sieben Karten, Level 1 und Level 2 in einem Durchgang: zuerst Wissen (Bauchgefühl gegen Daten, die Stufen von Daten zur Entscheidung, Big Data, eine erste Prognose), dann Anwendung (Verhaltensmuster, vom Muster zur Handlung, Maßnahmen wählen). Jedes Diagramm nutzt Weser Cloud, einen anderen Anbieter, damit die Aufgabe nie für Sie gelöst wird.",
        )}
      </p>
      {CARDS_A.map((C, i) => (
        <C key={i} />
      ))}
      <ReferencesAccordion block="A" keys={REFS_A} note={NOTE()} />
    </Block>
  );
}

export function MateriB() {
  const s = SECTIONS[2][0];
  return (
    <Block id={s.id} title={tt(`Materi B · ${s.minutes} minutes, facilitator-led`, `Materi B · ${s.minutes} Minuten, moderiert`)} intro={tt("A data-driven decision architecture: the vision, the data sources, the analysis system, the rules for intervening, and deciding with uncertain data", "Eine datengetriebene Entscheidungsarchitektur: das Zielbild, die Datenquellen, das Analysesystem, die Regeln zum Eingreifen, und entscheiden mit unsicheren Daten")}>
      <p className="max-w-prose text-body text-ash">
        {tt(
          "Five cards for Level 3. You stop reading single customers and start designing how the whole organisation decides with data. Each card ends in rules the task uses; each diagram uses Isar Hosting, another provider.",
          "Fünf Karten für Level 3. Sie lesen keine einzelnen Kunden mehr, sondern gestalten, wie die ganze Organisation mit Daten entscheidet. Jede Karte endet mit Regeln, die die Aufgabe nutzt; jedes Diagramm nutzt Isar Hosting, einen anderen Anbieter.",
        )}
      </p>
      {CARDS_B.map((C, i) => (
        <C key={i} />
      ))}
      <ReferencesAccordion block="B" keys={REFS_B} note={NOTE()} />
    </Block>
  );
}
