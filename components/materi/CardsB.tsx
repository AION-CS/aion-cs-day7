"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { ArchExample, CompProfile, DataStages, LiftCases, SourceGrid } from "@/components/materi/diagramsB";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { CASES_MIN, CRITERIA, LIFT_ACT, LIFT_WATCH, QUALITY_BAR } from "@/data/route2";
import { tt } from "@/lib/lang";

/** Materi B: the five cards of Route 2 (Level 3). 60 minutes in all. */
const p = "text-body text-ink";

export function CardB1() {
  return (
    <MaterialCard
      id="B1"
      scan={tt("Data becomes a competitive advantage when the organisation, not a single analyst, decides with it: shared definitions, written decision rules and forecasts that are checked against what happened.", "Daten werden zum Wettbewerbsvorteil, wenn die Organisation damit entscheidet, nicht eine einzelne Analystin: gemeinsame Definitionen, schriftliche Entscheidungsregeln und Prognosen, die mit dem Eingetretenen abgeglichen werden.")}
      reasoning={[
        tt("Shared definitions come first: if sales and finance count churn differently, every later number is argued about instead of used.", "Gemeinsame Definitionen kommen zuerst: Zählen Vertrieb und Finanzen Churn verschieden, wird jede spätere Zahl diskutiert statt genutzt."),
        tt("A decision rule names the data, the threshold and the action, so the same data leads to the same action whoever is on duty. Without rules, a dashboard is only information.", "Eine Entscheidungsregel nennt die Daten, den Schwellenwert und die Aktion, damit dieselben Daten zur selben Handlung führen, egal wer Dienst hat. Ohne Regeln ist ein Dashboard nur Information."),
        tt("A named owner per data source and a regular check of forecasts against outcomes keep the system honest; both are good additions to the two foundations.", "Ein benannter Owner pro Datenquelle und ein regelmäßiger Abgleich von Prognosen mit Ergebnissen halten das System ehrlich; beides sind gute Ergänzungen zu den zwei Fundamenten."),
        tt("Collecting everything “to analyse later” is not a vision: it is cost without a decision (and data minimisation under the GDPR says collect only what a purpose needs).", "Alles zu sammeln, „um es später zu analysieren“, ist kein Zielbild: Es sind Kosten ohne Entscheidung (und die Datenminimierung der DSGVO sagt, nur zu erheben, was ein Zweck braucht)."),
        tt("Letting a model decide on its own, without anyone able to explain its forecast, is not data-driven: nobody can check it, and the GDPR limits decisions made only by automated processing.", "Ein Modell allein entscheiden zu lassen, ohne dass jemand seine Prognose erklären kann, ist nicht datengetrieben: Niemand kann es prüfen, und die DSGVO begrenzt Entscheidungen, die nur auf automatisierter Verarbeitung beruhen."),
      ]}
      sources={["davenport2007", "tetlock2015", "gdpr2016"]}
    >
      <p className={p}>
        {tt(
          "Davenport and Harris (2007) found that analytics becomes an advantage when it is built into how recurring decisions are made, not when it sits in a report. Tetlock and Gardner (2015) show that forecasts improve only in organisations that keep score: every forecast is compared with the outcome, and the method is adjusted.",
          "Davenport und Harris (2007) fanden, dass Analytik zum Vorteil wird, wenn sie in die Art eingebaut ist, wie wiederkehrende Entscheidungen fallen, nicht wenn sie in einem Bericht liegt. Tetlock und Gardner (2015) zeigen, dass Prognosen nur in Organisationen besser werden, die Buch führen: Jede Prognose wird mit dem Ergebnis verglichen, und die Methode wird angepasst.",
        )}
      </p>
      <Diagram label={tt("Four stages of using data · a worked example on Isar Hosting", "Vier Stufen der Datennutzung · ein Beispiel mit Isar Hosting")} caption={tt("Click a stage and read what changes for the organisation at that stage.", "Klicken Sie eine Stufe an und lesen Sie, was sich auf dieser Stufe für die Organisation ändert.")}>
        <DataStages />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB2() {
  return (
    <MaterialCard
      id="B2"
      scan={tt("Start from the decision, not from the data. A source is relevant when it would change a decision you make; it is usable now when it is complete enough to trust.", "Gehen Sie von der Entscheidung aus, nicht von den Daten. Eine Quelle ist relevant, wenn sie eine Entscheidung ändern würde, die Sie treffen; sie ist jetzt nutzbar, wenn sie vollständig genug ist, um ihr zu trauen.")}
      reasoning={[
        tt("No decision would change with the source → leave it out, however large or clean.", "Keine Entscheidung würde sich mit der Quelle ändern → weglassen, egal wie groß oder sauber."),
        tt(`A decision uses it and it is at least ${QUALITY_BAR}% complete → core: use it now.`, `Eine Entscheidung nutzt sie, und sie ist mindestens zu ${QUALITY_BAR} % vollständig → Kern: jetzt nutzen.`),
        tt(`A decision uses it but it is less than ${QUALITY_BAR}% complete → later: fix the quality first, then add it.`, `Eine Entscheidung nutzt sie, aber sie ist zu weniger als ${QUALITY_BAR} % vollständig → später: erst die Qualität verbessern, dann aufnehmen.`),
        tt("Cost is not the test. A cheap source that no decision uses is still noise; an incomplete source that matters is worth the fixing.", "Kosten sind nicht der Test. Eine günstige Quelle, die keine Entscheidung nutzt, bleibt Rauschen; eine unvollständige Quelle, die zählt, ist die Verbesserung wert."),
      ]}
      sources={["hubbard2014", "dama2017"]}
    >
      <p className={p}>
        {tt(
          "Hubbard (2014) argues that data is worth collecting only to the extent that it could change a decision. The DAMA guide (2017) names completeness among the first dimensions of data quality: a field that is empty for half the customers describes the half that filled it in, not the customer base.",
          "Hubbard (2014) argumentiert, dass Daten nur so weit sammelnswert sind, wie sie eine Entscheidung ändern könnten. Der DAMA-Leitfaden (2017) nennt Vollständigkeit unter den ersten Dimensionen der Datenqualität: Ein Feld, das für die Hälfte der Kunden leer ist, beschreibt die Hälfte, die es ausgefüllt hat, nicht den Kundenstamm.",
        )}
      </p>
      <Diagram label={tt("Isar Hosting's data sources, sorted by decision and completeness", "Datenquellen von Isar Hosting, nach Entscheidung und Vollständigkeit sortiert")} caption={tt("Click a source to read where it goes and why.", "Klicken Sie eine Quelle an, um zu lesen, wohin sie gehört und warum.")}>
        <SourceGrid />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB3() {
  return (
    <MaterialCard
      id="B3"
      scan={tt("A system for behavioural analysis is built from components. Rate each on four tests (explanatory power, timeliness, reach, scale), capped by its printed facts, and choose the ones that warn early, for everyone, with a reason.", "Ein System für Verhaltensanalyse besteht aus Bausteinen. Bewerten Sie jeden nach vier Tests (Erklärungskraft, Rechtzeitigkeit, Reichweite, Skalierung), gedeckelt durch seine gedruckten Fakten, und wählen Sie die, die früh warnen, für alle, mit einem Grund.")}
      reasoning={[
        ...CRITERIA.map((c) => `${c.name}: ${c.test} ${tt("Low", "Niedrig")}: ${c.low} ${tt("High", "Hoch")}: ${c.high}`),
        tt("The printed facts cap the ratings: no reasons shown → explanatory power Low; after the event or twice a year → timeliness Low, monthly → at most Mid; only some customers → reach at most Mid; cost per customer → scale at most Mid, a person's time for each analysis → scale Low.", "Die gedruckten Fakten deckeln die Bewertungen: keine Gründe → Erklärungskraft Niedrig; nach dem Ereignis oder zweimal im Jahr → Rechtzeitigkeit Niedrig, monatlich → höchstens Mittel; nur einige Kunden → Reichweite höchstens Mittel; Kosten pro Kunde → Skalierung höchstens Mittel, Personenzeit für jede Analyse → Skalierung Niedrig."),
        tt("A system needs most of its components to warn early (weekly or monthly). A report that counts the loss afterwards is useful for learning, not for acting.", "Ein System braucht die meisten Bausteine so, dass sie früh warnen (wöchentlich oder monatlich). Ein Bericht, der den Verlust hinterher zählt, dient dem Lernen, nicht dem Handeln."),
        tt("The component with the greatest leverage is usually the one that is high on all four tests: it combines the sources, covers everyone and says why.", "Der Baustein mit der größten Hebelwirkung ist meist der, der auf allen vier Tests hoch ist: Er verbindet die Quellen, deckt alle ab und sagt warum."),
      ]}
      sources={["provost2013", "neslin2006"]}
    >
      <p className={p}>
        {tt(
          "Provost and Fawcett (2013) stress that a model is only useful if people can act on it and understand why it flags a case. Neslin and colleagues (2006) found that simple, well-maintained churn models often do almost as well as complex ones; what matters most is timing and coverage.",
          "Provost und Fawcett (2013) betonen, dass ein Modell nur nützlich ist, wenn Menschen danach handeln können und verstehen, warum es einen Fall markiert. Neslin und Kollegen (2006) fanden, dass einfache, gut gepflegte Churn-Modelle oft fast so gut abschneiden wie komplexe; am meisten zählen Zeitpunkt und Abdeckung.",
        )}
      </p>
      <Diagram label={tt("Four analysis components of Isar Hosting on four tests", "Vier Analysebausteine von Isar Hosting nach vier Tests")} caption={tt("Choose a component and compare its profile with the printed facts under it.", "Wählen Sie einen Baustein und vergleichen Sie sein Profil mit den gedruckten Fakten darunter.")}>
        <CompProfile />
      </Diagram>
    </MaterialCard>
  );
}

export function CardB4() {
  return (
    <MaterialCard
      id="B4"
      scan={tt("A decision logic says, for each signal, whether to intervene, to watch and gather data, or to do nothing, and who acts. Two numbers decide it: how much more often customers with the signal left (lift), and how many past cases show it.", "Eine Entscheidungslogik sagt für jedes Signal, ob eingegriffen, beobachtet und Daten gesammelt oder nichts getan wird, und wer handelt. Zwei Zahlen entscheiden: wie viel häufiger Kunden mit dem Signal gingen (Lift), und wie viele frühere Fälle es zeigen.")}
      reasoning={[
        tt(`Intervene when the lift is ${LIFT_ACT} or more and at least ${CASES_MIN} past cases show it: the difference is strong and proven.`, `Eingreifen, wenn der Lift ${LIFT_ACT} oder mehr beträgt und mindestens ${CASES_MIN} frühere Fälle ihn zeigen: Der Unterschied ist stark und belegt.`),
        tt(`Watch and gather data when the lift is ${LIFT_ACT} or more but fewer than ${CASES_MIN} cases show it, or when the lift is between ${LIFT_WATCH} and ${LIFT_ACT}: promising, not yet proven.`, `Beobachten und Daten sammeln, wenn der Lift ${LIFT_ACT} oder mehr beträgt, aber weniger als ${CASES_MIN} Fälle ihn zeigen, oder wenn der Lift zwischen ${LIFT_WATCH} und ${LIFT_ACT} liegt: vielversprechend, noch nicht belegt.`),
        tt(`No action when the lift is below ${LIFT_WATCH}: customers with the signal leave about as often as anyone. A quiet phase that returns every year is such a case.`, `Keine Aktion, wenn der Lift unter ${LIFT_WATCH} liegt: Kunden mit dem Signal gehen etwa so oft wie alle. Eine ruhige Phase, die jedes Jahr wiederkehrt, ist so ein Fall.`),
        tt("Who acts follows from what the signal is about: usage and onboarding → customer success; a renewal or a commercial question → sales (or customer success); watching → the data team; no action → no one.", "Wer handelt, folgt daraus, worum es beim Signal geht: Nutzung und Onboarding → Customer Success; eine Verlängerung oder kaufmännische Frage → Vertrieb (oder Customer Success); Beobachten → das Datenteam; keine Aktion → niemand."),
        tt("Revenue at stake sets the priority among signals you act on; it does not turn a weak signal into a strong one.", "Der Umsatz, um den es geht, setzt die Priorität unter den Signalen, auf die Sie handeln; er macht aus einem schwachen Signal kein starkes."),
      ]}
      sources={["kohavi2020", "neslin2006"]}
    >
      <p className={p}>
        {tt(
          "Kohavi, Tang and Xu (2020) advise testing a promising signal with a small, controlled trial before rolling out an action on it. A lift measured on twelve customers may be chance; the same lift on a hundred customers is a pattern. Neslin and colleagues (2006) use lift as the measure of how useful a churn signal is.",
          "Kohavi, Tang und Xu (2020) raten, ein vielversprechendes Signal mit einem kleinen, kontrollierten Test zu prüfen, bevor man eine Maßnahme darauf ausrollt. Ein Lift, gemessen an zwölf Kunden, kann Zufall sein; derselbe Lift an hundert Kunden ist ein Muster. Neslin und Kollegen (2006) nutzen den Lift als Maß dafür, wie nützlich ein Churn-Signal ist.",
        )}
      </p>
      <Diagram label={tt("When to intervene · move the two sliders", "Wann eingreifen · die zwei Regler bewegen")} caption={tt("Set a lift and a number of past cases and read which action the rule gives.", "Stellen Sie einen Lift und eine Zahl früherer Fälle ein und lesen Sie, welche Aktion die Regel ergibt.")}>
        <LiftCases />
      </Diagram>
      <DataTable
        head={[tt("Isar signal", "Signal bei Isar"), tt("Lift", "Lift"), tt("Past cases", "Frühere Fälle"), tt("Rule gives", "Regel ergibt"), tt("Who acts", "Wer handelt")]}
        rows={[
          [tt("No login for 30 days", "30 Tage kein Login"), "6", "80", tt("Intervene", "Eingreifen"), tt("Customer success", "Customer Success")],
          [tt("Contract downgrade asked", "Vertragsherabstufung angefragt"), "4", "9", tt("Watch", "Beobachten"), tt("Data team", "Datenteam")],
          [tt("Quiet in August", "Ruhig im August"), "1.0", "120", tt("No action", "Keine Aktion"), tt("No one", "Niemand")],
        ]}
        caption={tt("A worked decision logic on other signals (Case assumption)", "Eine Beispiel-Entscheidungslogik mit anderen Signalen (Fallannahme)")}
      />
    </MaterialCard>
  );
}

export function CardB5() {
  return (
    <MaterialCard
      id="B5"
      scan={tt("You will not have clean data before you must decide. Decide now on the reliable sources, build in stages, and agree on the result that makes you change course. Give every funded item a start, one owner and a trigger.", "Sie werden keine sauberen Daten haben, bevor Sie entscheiden müssen. Entscheiden Sie jetzt auf den verlässlichen Quellen, bauen Sie in Stufen, und vereinbaren Sie das Ergebnis, bei dem Sie den Kurs ändern. Geben Sie jedem finanzierten Punkt einen Start, einen Owner und einen Trigger.")}
      reasoning={[
        tt("Waiting until all data is clean is also a decision: it leaves every at-risk customer to gut feeling in the meantime. The brief asks for a decision despite uncertain data.", "Zu warten, bis alle Daten sauber sind, ist auch eine Entscheidung: Es überlässt jeden gefährdeten Kunden in der Zwischenzeit dem Bauchgefühl. Der Auftrag verlangt eine Entscheidung trotz unsicherer Daten."),
        tt("Building everything at once is fast, but most of the money is spent before the data foundation shows which sources can be trusted. Staging decides now and spends in the order the evidence arrives.", "Alles auf einmal zu bauen ist schnell, aber der Großteil des Geldes ist ausgegeben, bevor die Datenbasis zeigt, welchen Quellen man trauen kann. Stufenweise entscheidet jetzt und gibt in der Reihenfolge aus, in der die Evidenz kommt."),
        tt("Foundation first: the data foundation starts no later than the first other item, because every score and trigger reads it.", "Datenbasis zuerst: Die Datenbasis startet nicht später als der erste andere Punkt, weil jeder Score und Trigger sie liest."),
        tt("Fund inside the budget, and fund nothing whose forecasts nobody can explain: a black box contradicts a data-driven organisation.", "Finanzieren Sie innerhalb des Budgets, und nichts, dessen Prognosen niemand erklären kann: Eine Black Box widerspricht einer datengetriebenen Organisation."),
        tt("Owner test: who can change the item without asking anyone else? Trigger test: a metric, a number, a date and an action.", "Owner-Test: Wer kann den Punkt ändern, ohne jemanden zu fragen? Trigger-Test: eine Kennzahl, eine Zahl, ein Datum und eine Aktion."),
        tt("A tripwire measures how customers behave (save rate, churn, customers using more services), not your own activity (dashboards built, reports sent), and its threshold is better than today.", "Ein Tripwire misst, wie Kunden sich verhalten (Save Rate, Churn, Kunden mit mehr Services), nicht Ihre eigene Aktivität (gebaute Dashboards, versendete Berichte), und sein Schwellenwert ist besser als heute."),
        tt("When early results disappoint, look at the cases before you change the system: fix the rule that produced the false alarms; do not return to gut feeling.", "Wenn frühe Ergebnisse enttäuschen, schauen Sie auf die Fälle, bevor Sie das System ändern: Korrigieren Sie die Regel, die die Fehlalarme erzeugte; kehren Sie nicht zum Bauchgefühl zurück."),
      ]}
      sources={["courtney1997", "klein2007", "doran1981"]}
    >
      <Diagram label={tt("Three funded items over six months · a worked example on Isar Hosting", "Drei finanzierte Punkte über sechs Monate · ein Beispiel mit Isar Hosting")} caption={tt("Click a row to read its owner, its trigger and why it starts when it does.", "Klicken Sie eine Zeile an, um Owner, Trigger und den Grund für den Start zu lesen.")}>
        <ArchExample />
      </Diagram>
      <Bul
        items={[
          tt("Stage it: the no-regret items (data foundation, the health score on reliable sources) first, the rest when the first results are in.", "Stufenweise: die No-regret-Punkte (Datenbasis, der Health Score auf verlässlichen Quellen) zuerst, der Rest, wenn die ersten Ergebnisse da sind."),
          tt("Premortem: imagine the data programme failed after a year, and write down why. Those reasons are your assumptions to watch.", "Premortem: Stellen Sie sich vor, das Datenprogramm sei nach einem Jahr gescheitert, und schreiben Sie auf, warum. Diese Gründe sind die Annahmen, die Sie beobachten."),
          tt("What does not fit gets a pickup point: the number and the date at which you look at it again.", "Was nicht passt, bekommt einen Pickup Point: die Zahl und das Datum, zu dem Sie es wieder ansehen."),
        ]}
      />
      <Callout label={tt("Uncertain is not the same as unknown", "Unsicher ist nicht dasselbe wie unbekannt")} tone="signal">
        <p>{tt("Varying data quality means some sources can be trusted now and some cannot. Use the reliable ones, say which assumption rests on the others, and set the date you will know more.", "Schwankende Datenqualität heißt, manchen Quellen kann man jetzt trauen und anderen nicht. Nutzen Sie die verlässlichen, sagen Sie, welche Annahme auf den anderen ruht, und setzen Sie das Datum, an dem Sie mehr wissen.")}</p>
      </Callout>
    </MaterialCard>
  );
}

export const CARDS_B = [CardB1, CardB2, CardB3, CardB4, CardB5];
