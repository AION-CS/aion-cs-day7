"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { ArchExample, CompProfile, DataStages, LiftCases, NumberMethods, SourceGrid } from "@/components/materi/diagramsB";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { ShowMore } from "@/components/ui/ShowMore";
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
      <ShowMore id="B1" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Davenport and Harris (2007) found that analytics becomes an advantage when it is built into how recurring decisions are made, not when it sits in a report. Tetlock and Gardner (2015) show that forecasts improve only in organisations that keep score: every forecast is compared with the outcome, and the method is adjusted.",
            "Davenport und Harris (2007) fanden, dass Analytik zum Vorteil wird, wenn sie in die Art eingebaut ist, wie wiederkehrende Entscheidungen fallen, nicht wenn sie in einem Bericht liegt. Tetlock und Gardner (2015) zeigen, dass Prognosen nur in Organisationen besser werden, die Buch führen: Jede Prognose wird mit dem Ergebnis verglichen, und die Methode wird angepasst.",
          )}
        </p>
      </ShowMore>
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
      <ShowMore id="B2" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Hubbard (2014) argues that data is worth collecting only to the extent that it could change a decision. The DAMA guide (2017) names completeness among the first dimensions of data quality: a field that is empty for half the customers describes the half that filled it in, not the customer base.",
            "Hubbard (2014) argumentiert, dass Daten nur so weit sammelnswert sind, wie sie eine Entscheidung ändern könnten. Der DAMA-Leitfaden (2017) nennt Vollständigkeit unter den ersten Dimensionen der Datenqualität: Ein Feld, das für die Hälfte der Kunden leer ist, beschreibt die Hälfte, die es ausgefüllt hat, nicht den Kundenstamm.",
          )}
        </p>
      </ShowMore>
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
      <ShowMore id="B3" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Provost and Fawcett (2013) stress that a model is only useful if people can act on it and understand why it flags a case. Neslin and colleagues (2006) found that simple, well-maintained churn models often do almost as well as complex ones; what matters most is timing and coverage.",
            "Provost und Fawcett (2013) betonen, dass ein Modell nur nützlich ist, wenn Menschen danach handeln können und verstehen, warum es einen Fall markiert. Neslin und Kollegen (2006) fanden, dass einfache, gut gepflegte Churn-Modelle oft fast so gut abschneiden wie komplexe; am meisten zählen Zeitpunkt und Abdeckung.",
          )}
        </p>
      </ShowMore>
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
      <ShowMore id="B4" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Kohavi, Tang and Xu (2020) advise testing a promising signal with a small, controlled trial before rolling out an action on it. A lift measured on twelve customers may be chance; the same lift on a hundred customers is a pattern. Neslin and colleagues (2006) use lift as the measure of how useful a churn signal is.",
            "Kohavi, Tang und Xu (2020) raten, ein vielversprechendes Signal mit einem kleinen, kontrollierten Test zu prüfen, bevor man eine Maßnahme darauf ausrollt. Ein Lift, gemessen an zwölf Kunden, kann Zufall sein; derselbe Lift an hundert Kunden ist ein Muster. Neslin und Kollegen (2006) nutzen den Lift als Maß dafür, wie nützlich ein Churn-Signal ist.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("When to intervene · move the two sliders", "Wann eingreifen · die zwei Regler bewegen")} caption={tt("Set a lift and a number of past cases and read which action the rule gives.", "Stellen Sie einen Lift und eine Zahl früherer Fälle ein und lesen Sie, welche Aktion die Regel ergibt.")}>
        <LiftCases />
      </Diagram>
      <ShowMore id="B4" part="table" label={tt("Show the rule applied to three signals", "Die Regel an drei Signalen zeigen")}>
        <DataTable
          head={[tt("Isar signal", "Signal bei Isar"), tt("Lift", "Lift"), tt("Past cases", "Frühere Fälle"), tt("Rule gives", "Regel ergibt"), tt("Who acts", "Wer handelt")]}
          rows={[
            [tt("No login for 30 days", "30 Tage kein Login"), "6", "80", tt("Intervene", "Eingreifen"), tt("Customer success", "Customer Success")],
            [tt("Contract downgrade asked", "Vertragsherabstufung angefragt"), "4", "9", tt("Watch", "Beobachten"), tt("Data team", "Datenteam")],
            [tt("Quiet in August", "Ruhig im August"), "1.0", "120", tt("No action", "Keine Aktion"), tt("No one", "Niemand")],
          ]}
          caption={tt("A worked decision logic on other signals (Case assumption)", "Eine Beispiel-Entscheidungslogik mit anderen Signalen (Fallannahme)")}
        />
      </ShowMore>
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
        tt("Owner test: who can change the item without asking anyone else? Trigger test: a metric, a number, a date and an action. The number and the month are found from printed figures, not guessed (Materi B6).", "Owner-Test: Wer kann den Punkt ändern, ohne jemanden zu fragen? Trigger-Test: eine Kennzahl, eine Zahl, ein Datum und eine Aktion. Zahl und Monat werden aus gedruckten Zahlen gefunden, nicht geraten (Materi B6)."),
        tt("The quality bar: a data source is usable from 80% complete. Below it, fix the gaps first, then rely on it. An item meant to fix completeness reaches its goal when it reaches that bar.", "Die Qualitätslinie: Eine Datenquelle ist ab 80 % Vollständigkeit nutzbar. Darunter schließen Sie zuerst die Lücken und verlassen sich dann darauf. Ein Punkt, der die Vollständigkeit verbessern soll, hat sein Ziel erreicht, wenn er diese Linie erreicht."),
        tt("A tripwire measures how customers behave (save rate, churn, customers using more services), not your own activity (dashboards built, reports sent), and its threshold is better than today by the step your spending needs to pay back (today's figure plus a step, Materi B6). Its month is the month your plan can first be judged.", "Ein Tripwire misst, wie Kunden sich verhalten (Save Rate, Churn, Kunden mit mehr Services), nicht Ihre eigene Aktivität (gebaute Dashboards, versendete Berichte), und sein Schwellenwert ist besser als heute, um den Schritt, den Ihre Ausgaben zum Bezahltmachen brauchen (heutiger Wert plus ein Schritt, Materi B6). Sein Monat ist der Monat, in dem Ihr Plan zuerst beurteilt werden kann."),
        tt("An assumption has two sentences. “I assume …” is about one thing that is still uncertain: its clue is a figure in the case that rests on few cases or is incomplete, tied to what your plan bets there. “I am wrong if … [a number you can watch yourself] by [month]” is compared with today's figure. Never use a market estimate: it does not move inside your plan.", "Eine Annahme hat zwei Sätze. „Ich nehme an, …“ betrifft etwas, das noch unsicher ist: Der Hinweis ist eine Zahl im Fall, die auf wenigen Fällen beruht oder unvollständig ist, verbunden mit dem, worauf Ihr Plan dort setzt. „Ich liege falsch, wenn … [eine Zahl, die Sie selbst beobachten können] bis [Monat]“ wird mit dem heutigen Wert verglichen. Nutzen Sie nie eine Marktschätzung: Sie bewegt sich in Ihrem Plan nicht."),
        tt("An item you leave out gets a pickup point: it is not thrown away. When this many customers have left for the reason the item would fix, you fund it after all (Materi B6, the cost of waiting).", "Ein weggelassener Punkt bekommt einen Pickup Point: Er wird nicht weggeworfen. Wenn so viele Kunden aus dem Grund gegangen sind, den der Punkt beheben würde, finanzieren Sie ihn doch (Materi B6, die Kosten des Wartens)."),
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
          tt("An assumption on Isar Hosting: “I assume the usage rule still predicts leaving, although it rests on only 25 customers. I am wrong if the score flags fewer than 65% of the customers who cancel by month 5 (today the rule alone catches 30%).”", "Eine Annahme bei Isar Hosting: „Ich nehme an, dass die Nutzungsregel das Gehen weiter vorhersagt, obwohl sie auf nur 25 Kunden beruht. Ich liege falsch, wenn der Score bis Monat 5 weniger als 65 % der gekündigten Kunden markiert (heute fängt die Regel allein 30 %).“"),
        ]}
      />
      <ShowMore id="B5" part="extra" label={tt("Show: uncertain is not the same as unknown", "Zeigen: unsicher ist nicht dasselbe wie unbekannt")}>
        <Callout label={tt("Uncertain is not the same as unknown", "Unsicher ist nicht dasselbe wie unbekannt")} tone="signal">
          <p>{tt("Varying data quality means some sources can be trusted now and some cannot. Use the reliable ones, say which assumption rests on the others, and set the date you will know more.", "Schwankende Datenqualität heißt, manchen Quellen kann man jetzt trauen und anderen nicht. Nutzen Sie die verlässlichen, sagen Sie, welche Annahme auf den anderen ruht, und setzen Sie das Datum, an dem Sie mehr wissen.")}</p>
        </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export function CardB6() {
  return (
    <MaterialCard
      id="B6"
      scan={tt("Every number in a trigger, a pickup point, an assumption or a tripwire is found from printed figures by a method you can say in one sentence. A guess that sounds right can be a threshold the data can never reach.", "Jede Zahl in einem Trigger, einem Pickup Point, einer Annahme oder einem Tripwire wird aus gedruckten Zahlen mit einer Methode gefunden, die Sie in einem Satz sagen können. Eine Schätzung, die richtig klingt, kann eine Schwelle sein, die die Daten nie erreichen können.")}
      reasoning={[
        tt("The weakest source: a joined list can only be as complete as the weakest source in it. The trigger number is that lowest completeness.", "Die schwächste Quelle: Eine verbundene Liste kann nur so vollständig sein wie die schwächste Quelle darin. Die Zahl des Triggers ist diese niedrigste Vollständigkeit."),
        tt("Half the gap: a new tool that costs money should close at least half of what today's rule misses. Today's share caught, plus half of the missing points, rounded to the nearest 5.", "Die halbe Lücke: Ein neues Werkzeug, das Geld kostet, sollte mindestens die Hälfte dessen schließen, was die heutige Regel verpasst. Der heute gefangene Anteil plus die Hälfte der fehlenden Punkte, auf die nächsten 5 gerundet."),
        tt("Calls per week: customers flagged ÷ weeks in a quarter (13), rounded up. Fewer calls than that and the list grows faster than it is worked.", "Anrufe pro Woche: markierte Kunden ÷ Wochen in einem Quartal (13), aufgerundet. Bei weniger Anrufen wächst die Liste schneller, als sie abgearbeitet wird."),
        tt("Customers' worth: in a group of N customers one customer is 100 ÷ N points. A miss of two customers' worth can be chance; more is a real error.", "Wert der Kunden: In einer Gruppe von N Kunden ist ein Kunde 100 ÷ N Punkte. Eine Abweichung von zwei Kunden kann Zufall sein; mehr ist ein echter Fehler."),
        tt("Two thirds: a training has worked when a clear majority acts on it: the number of people × 2 ÷ 3, rounded up.", "Zwei Drittel: Eine Schulung hat gewirkt, wenn eine klare Mehrheit danach handelt: Zahl der Personen × 2 ÷ 3, aufgerundet."),
        tt("The cost of waiting (the pickup point): the cost of the item you left out ÷ the yearly revenue one customer brings, rounded up. When that many customers have left for the reason the item would fix, waiting has cost as much as the item.", "Die Kosten des Wartens (der Pickup Point): die Kosten des weggelassenen Punkts ÷ der Jahresumsatz, den ein Kunde bringt, aufgerundet. Wenn so viele Kunden aus dem Grund gegangen sind, den der Punkt beheben würde, hat das Warten so viel gekostet wie der Punkt."),
        tt("The tripwire: today's figure plus a step. The step is the number of customers your funded items must keep to pay back (their cost ÷ the yearly revenue of one customer, rounded up), counted as a share of the flagged group.", "Der Tripwire: heutiger Wert plus ein Schritt. Der Schritt ist die Zahl der Kunden, die Ihre finanzierten Punkte halten müssen, um sich zu bezahlen (ihre Kosten ÷ Jahresumsatz eines Kunden, aufgerundet), als Anteil der markierten Gruppe."),
        tt("The month: start month + months of set-up (weeks ÷ 4, rounded up) + months until the effect shows. Any earlier month says nothing. The tripwire's month is the latest of these for the items that act on flagged customers.", "Der Monat: Startmonat + Monate Einrichtung (Wochen ÷ 4, aufgerundet) + Monate, bis die Wirkung sichtbar ist. Jeder frühere Monat sagt nichts. Der Monat des Tripwires ist der späteste davon für die Punkte, die bei markierten Kunden wirken."),
        tt("A different number is fine when you give the reason (a decision part). In the task you do not calculate: the numbers are shown to you with their reason and where each input is printed.", "Eine andere Zahl ist in Ordnung, wenn Sie den Grund nennen (ein Entscheidungsteil). In der Aufgabe rechnen Sie nicht: Die Zahlen werden Ihnen mit ihrem Grund gezeigt und wo jede Eingabe gedruckt steht."),
      ]}
      sources={["hubbard2014", "doran1981"]}
    >
      <Diagram label={tt("Seven ways to find a number · a worked example on Isar Hosting", "Sieben Wege, eine Zahl zu finden · ein Beispiel mit Isar Hosting")} caption={tt("Press the guess, then the found number, then pick a method.", "Drücken Sie die Schätzung, dann die gefundene Zahl, dann wählen Sie eine Methode.")}>
        <NumberMethods />
      </Diagram>
      <p className="text-caption text-ash">{tt("Isar Hosting's figures are a Case assumption and differ from SmartData's, so the numbers of the task are never printed here.", "Die Zahlen von Isar Hosting sind eine Fallannahme und weichen von denen von SmartData ab, also stehen die Zahlen der Aufgabe hier nie.")}</p>
    </MaterialCard>
  );
}

export const CARDS_B = [CardB1, CardB2, CardB3, CardB4, CardB5, CardB6];
