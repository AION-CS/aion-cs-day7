"use client";

import { Bul, Diagram } from "@/components/materi/kit";
import { BigDataLimits, ForecastExample, GutVsData, Ladder, LinkOrCause, PatternCurves, ScoreExample } from "@/components/materi/diagramsA";
import { Callout, DataTable, MaterialCard } from "@/components/ui/MaterialCard";
import { ShowMore } from "@/components/ui/ShowMore";
import { LEVEL_TESTS } from "@/data/ladder";
import { PATTERNS, PATTERN_IDS, PATTERN_PAIR_TESTS, RISK_RULE } from "@/data/patterns";
import { EXPLAIN_RULE } from "@/data/measures";
import { WESER, WESER_RESULT } from "@/data/forecast";
import { euro, num, pct, tt } from "@/lib/lang";

/** Materi A: the seven cards of Route 1 (Levels 1 and 2 on one case). 60 minutes in all. */
const p = "text-body text-ink";

export function CardA1() {
  return (
    <MaterialCard
      id="A1"
      scan={tt("Data-driven customer retention means deciding whom to look after, and how, from what customers actually do, not from whom you happen to remember. Experience still matters: it reads the exceptions the data cannot explain.", "Datengetriebene Kundenbindung heißt, aus dem tatsächlichen Verhalten der Kunden zu entscheiden, wen man wie betreut, nicht danach, an wen man sich zufällig erinnert. Erfahrung zählt weiter: Sie liest die Ausnahmen, die die Daten nicht erklären.")}
      reasoning={[
        tt("Gut feeling sees the customers who are loud: those who call, complain or are large. Customers who are about to leave often go quiet first, so memory misses them.", "Das Bauchgefühl sieht die lauten Kunden: die, die anrufen, sich beschweren oder groß sind. Kunden, die gehen wollen, werden oft zuerst still, also übersieht das Gedächtnis sie."),
        tt("Data sees every customer the same way, including the quiet ones. It also raises false alarms, so a person must read the exceptions before acting.", "Daten sehen jeden Kunden gleich, auch die stillen. Sie lösen auch Fehlalarme aus, also muss ein Mensch die Ausnahmen lesen, bevor gehandelt wird."),
        tt("Data is worthless until someone asks a question of it: which customers, why, and what do we do? That question turns data into a decision.", "Daten sind wertlos, bis jemand ihnen eine Frage stellt: welche Kunden, warum, und was tun wir? Diese Frage macht aus Daten eine Entscheidung."),
        tt("A data-driven decision-maker starts from the decision, checks how many cases stand behind a pattern, acts on strong signals and tests weak ones.", "Eine datengetriebene Entscheiderin geht von der Entscheidung aus, prüft, wie viele Fälle hinter einem Muster stehen, handelt auf starke Signale und testet schwache."),
      ]}
      sources={["davenport2007", "kahneman2011"]}
    >
      <ShowMore id="A1" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Davenport and Harris (2007) describe firms that compete on analytics: they make recurring decisions from data and keep experience for what data cannot see. Kahneman (2011) explains why the alternative fails: people judge by the cases that come easily to mind, and a customer who calls every week comes to mind more easily than one who has quietly stopped logging in.",
            "Davenport und Harris (2007) beschreiben Firmen, die mit Analytik konkurrieren: Sie treffen wiederkehrende Entscheidungen aus Daten und nutzen Erfahrung für das, was Daten nicht sehen. Kahneman (2011) erklärt, warum die Alternative scheitert: Menschen urteilen nach den Fällen, die ihnen leicht einfallen, und ein Kunde, der jede Woche anruft, fällt einem leichter ein als einer, der sich still nicht mehr anmeldet.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Who gets a call: gut feeling against usage data · a worked example on Weser Cloud", "Wer einen Anruf bekommt: Bauchgefühl gegen Nutzungsdaten · ein Beispiel mit Weser Cloud")} caption={tt("Switch between the two lists, then show who actually left.", "Wechseln Sie zwischen den beiden Listen und zeigen Sie dann, wer tatsächlich ging.")}>
        <GutVsData />
      </Diagram>
      <ShowMore id="A1" part="extra" label={tt("Show what “data-driven” does not mean (GDPR)", "Zeigen, was „datengetrieben“ nicht heißt (DSGVO)")}>
        <Callout label={tt("What “data-driven” does not mean", "Was „datengetrieben“ nicht heißt")} tone="rust">
          <p>{tt("It does not mean letting a number decide alone. The GDPR (Art. 22) limits decisions about people made only by automated processing, and a score nobody can explain cannot be trusted by the account manager who has to act on it.", "Es heißt nicht, eine Zahl allein entscheiden zu lassen. Die DSGVO (Art. 22) begrenzt Entscheidungen über Menschen, die nur auf automatisierter Verarbeitung beruhen, und einem Wert, den niemand erklären kann, vertraut der Account Manager nicht, der danach handeln soll.")}</p>
        </Callout>
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA2() {
  return (
    <MaterialCard
      id="A2"
      scan={tt("Data is a recorded fact. Information is data summarised or compared. An insight explains what it means and points to an action. A decision is the action chosen. Most reports stop at information.", "Daten sind ein erfasster Fakt. Information sind zusammengefasste oder verglichene Daten. Ein Insight erklärt, was es bedeutet, und zeigt auf eine Handlung. Eine Entscheidung ist die gewählte Handlung. Die meisten Berichte hören bei der Information auf.")}
      reasoning={[
        ...LEVEL_TESTS.map((x) => `${x.name}: ${x.test}`),
        tt("An insight you write yourself follows the frame “what the data shows, for which customers, so what it means or what to do”.", "Ein Insight, den Sie selbst schreiben, folgt dem Rahmen „was die Daten zeigen, bei welchen Kunden, also was es bedeutet oder was zu tun ist“."),
      ]}
      sources={["ackoff1989", "rowley2007"]}
    >
      <ShowMore id="A2" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Ackoff (1989) described a ladder from data to information, knowledge and understanding; Rowley (2007) showed how the steps are defined across the literature. For sales, a practical version has four steps: data, information, insight and decision. Each step adds meaning; none is useful on its own until the last one happens.",
            "Ackoff (1989) beschrieb eine Leiter von Daten über Information zu Wissen und Verständnis; Rowley (2007) zeigte, wie die Stufen in der Literatur definiert werden. Für den Vertrieb hat eine praktische Fassung vier Stufen: Daten, Information, Insight und Entscheidung. Jede Stufe fügt Bedeutung hinzu; keine ist für sich nützlich, bis die letzte passiert.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Four steps from data to decision · a worked example on Weser Cloud", "Vier Stufen von Daten zur Entscheidung · ein Beispiel mit Weser Cloud")} caption={tt("Click a step to see the same customer at that step, then try the worked sort below it.", "Klicken Sie eine Stufe an, um denselben Kunden auf dieser Stufe zu sehen, und probieren Sie dann die Beispielsortierung darunter.")}>
        <Ladder />
      </Diagram>
    </MaterialCard>
  );
}

export function CardA3() {
  return (
    <MaterialCard
      id="A3"
      scan={tt("Big data means more data, arriving faster and in more forms. It helps only when it is linked to a decision and good enough to trust. More of the wrong data adds noise, not knowledge.", "Big Data heißt mehr Daten, die schneller und in mehr Formen ankommen. Sie helfen nur, wenn sie mit einer Entscheidung verbunden und gut genug sind, um ihnen zu trauen. Mehr von den falschen Daten bringt Rauschen, kein Wissen.")}
      reasoning={[
        tt("Ask of every data source: which decision would it change? A source that changes no decision is noise, however large.", "Fragen Sie bei jeder Datenquelle: Welche Entscheidung würde sie ändern? Eine Quelle, die keine Entscheidung ändert, ist Rauschen, egal wie groß."),
        tt("Check how complete it is. Below about 80% complete, fix the gaps before you rely on it.", "Prüfen Sie, wie vollständig sie ist. Unter etwa 80 % Vollständigkeit schließen Sie erst die Lücken, bevor Sie sich darauf verlassen."),
        tt("Know its limits: what it cannot see (use outside the platform), who is missing (those who do not answer a survey), and whether personal data may be used for this purpose (GDPR).", "Kennen Sie ihre Grenzen: was sie nicht sieht (Nutzung außerhalb der Plattform), wer fehlt (wer eine Befragung nicht beantwortet), und ob personenbezogene Daten für diesen Zweck genutzt werden dürfen (DSGVO)."),
        tt("“The more data, the more certain” is wrong: certainty comes from relevant, complete data and enough cases, not from volume.", "„Je mehr Daten, desto sicherer“ ist falsch: Sicherheit kommt aus relevanten, vollständigen Daten und genug Fällen, nicht aus der Menge."),
        tt("Smart insights come from small, relevant data read well: usage, orders and tickets often say more about churn than any purchased data set.", "Smart Insights entstehen aus kleinen, relevanten Daten, gut gelesen: Nutzung, Bestellungen und Tickets sagen über Churn oft mehr als jeder gekaufte Datensatz."),
      ]}
      sources={["mcafee2012", "boyd2012", "gdpr2016"]}
    >
      <ShowMore id="A3" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "McAfee and Brynjolfsson (2012) showed that firms which decide from data outperform those that do not, but only when leaders ask what the data says and act on it. boyd and Crawford (2012) warn that bigger data is not better data: it has gaps, it favours those who leave traces, and it can be read to confirm what one already believed. The GDPR (Art. 5) adds that personal data may be collected only for a stated purpose and not more than needed.",
            "McAfee und Brynjolfsson (2012) zeigten, dass Firmen, die aus Daten entscheiden, besser abschneiden als andere, aber nur, wenn Führungskräfte fragen, was die Daten sagen, und danach handeln. boyd und Crawford (2012) warnen, dass größere Daten nicht bessere Daten sind: Sie haben Lücken, bevorzugen die, die Spuren hinterlassen, und können so gelesen werden, dass sie bestätigen, was man ohnehin glaubte. Die DSGVO (Art. 5) ergänzt, dass personenbezogene Daten nur für einen genannten Zweck und nicht mehr als nötig erhoben werden dürfen.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Five data sources of Weser Cloud on three questions", "Fünf Datenquellen von Weser Cloud nach drei Fragen")} caption={tt("Choose a source and read whether it is a smart insight, noise, or worth fixing first.", "Wählen Sie eine Quelle und lesen Sie, ob sie ein Smart Insight, Rauschen oder erst zu verbessern ist.")}>
        <BigDataLimits />
      </Diagram>
    </MaterialCard>
  );
}

export function CardA4() {
  const r = WESER_RESULT;
  return (
    <MaterialCard
      id="A4"
      scan={tt("A first forecast needs three numbers from the past and one from today: how often a group left, how often everyone else left, and how many customers show the same signal now. Rate, lift and revenue at risk follow.", "Eine erste Prognose braucht drei Zahlen aus der Vergangenheit und eine von heute: wie oft eine Gruppe ging, wie oft alle anderen gingen, und wie viele Kunden jetzt dasselbe Signal zeigen. Rate, Lift und gefährdeter Umsatz folgen daraus.")}
      reasoning={[
        tt("Churn rate of a group = customers in the group who left ÷ customers in the group × 100. Take both numbers from the same row.", "Churn Rate einer Gruppe = Kunden der Gruppe, die gingen ÷ Kunden der Gruppe × 100. Nehmen Sie beide Zahlen aus derselben Zeile."),
        tt("Lift = churn rate of the signal group ÷ churn rate of all other customers. Work out the second rate from its own row first. A lift of 5 means “five times as often”.", "Lift = Churn Rate der Signalgruppe ÷ Churn Rate aller übrigen Kunden. Berechnen Sie die zweite Rate zuerst aus ihrer eigenen Zeile. Ein Lift von 5 heißt „fünfmal so oft“."),
        tt("Revenue at risk = customers showing the signal now × churn rate of the signal group as a share of one (20% = 0.20) × average yearly revenue. Use today's count, not last year's group.", "Gefährdeter Umsatz = Kunden, die das Signal jetzt zeigen × Churn Rate der Signalgruppe als Anteil von eins (20 % = 0,20) × durchschnittlicher Jahresumsatz. Nehmen Sie die heutige Zahl, nicht die Gruppe des letzten Jahres."),
        tt("A forecast assumes this year's customers behave like last year's. Say it as an estimate (“about”), not as a fact.", "Eine Prognose nimmt an, dass sich die Kunden dieses Jahres wie die des letzten verhalten. Sagen Sie sie als Schätzung („etwa“), nicht als Tatsache."),
        tt("A sentence about a forecast quotes at least one of its figures and says what it means for where to act first.", "Ein Satz über eine Prognose nennt mindestens eine ihrer Zahlen und sagt, was sie dafür bedeutet, wo zuerst gehandelt wird."),
      ]}
      sources={["provost2013", "neslin2006"]}
    >
      <ShowMore id="A4" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Provost and Fawcett (2013) name the base rate, the lift and the expected value as the first tools of any forecast. Neslin and colleagues (2006) compared churn models across many firms and judged them by lift: how much more often the customers a model flags actually leave than customers in general. The worked example uses Weser Cloud's numbers; the steps are the same for any company.",
            "Provost und Fawcett (2013) nennen Basisrate, Lift und Erwartungswert als erste Werkzeuge jeder Prognose. Neslin und Kollegen (2006) verglichen Churn-Modelle vieler Firmen und maßen sie am Lift: wie viel häufiger die von einem Modell markierten Kunden tatsächlich gehen als Kunden im Allgemeinen. Das Beispiel nutzt die Zahlen von Weser Cloud; die Schritte sind für jedes Unternehmen gleich.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("A first forecast · worked example on Weser Cloud (Case assumption)", "Eine erste Prognose · Beispiel mit Weser Cloud (Fallannahme)")} caption={tt("Move the slider to change how many customers show the signal this quarter.", "Bewegen Sie den Regler, um zu ändern, wie viele Kunden das Signal in diesem Quartal zeigen.")}>
        <ForecastExample />
      </Diagram>
      <ShowMore id="A4" part="calc" label={tt("Show Weser Cloud's four steps in a table", "Die vier Schritte von Weser Cloud in einer Tabelle zeigen")}>
        <DataTable
          head={[tt("Step", "Schritt"), tt("Calculation · Weser Cloud", "Rechnung · Weser Cloud"), tt("Result", "Ergebnis")]}
          rows={[
            [tt("1 · Churn rate, usage fell", "1 · Churn Rate, Nutzung gesunken"), `${WESER.falling.left} ÷ ${WESER.falling.customers} × 100`, pct(r.rate)],
            [tt("2 · Churn rate, everyone else", "2 · Churn Rate, alle übrigen"), `${WESER.stable.left} ÷ ${WESER.stable.customers} × 100`, pct(r.other)],
            [tt("3 · Lift", "3 · Lift"), `${r.rate} ÷ ${r.other}`, tt(`${num(r.lift)} times`, `${num(r.lift)}-mal`)],
            [tt("4 · Revenue at risk this year", "4 · Gefährdeter Umsatz in diesem Jahr"), `${WESER.fallingNow} × ${r.rate / 100} × ${euro(WESER.revenue)}`, euro(r.risk)],
          ]}
          caption={tt("The four steps, on other numbers than the task", "Die vier Schritte, mit anderen Zahlen als in der Aufgabe")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA5() {
  return (
    <MaterialCard
      id="A5"
      scan={tt("Four behaviour patterns recur in usage data: anchored (high and steady), fading (was good, now falling), dormant (low from the start) and cyclical (bursts with quiet phases). Two of them look alike and mean opposite things.", "Vier Verhaltensmuster kehren in Nutzungsdaten wieder: verankert (hoch und gleichmäßig), nachlassend (war gut, fällt jetzt), ruhend (von Anfang an niedrig) und zyklisch (Schübe mit ruhigen Phasen). Zwei davon sehen sich ähnlich und bedeuten Gegensätzliches.")}
      reasoning={[
        ...PATTERN_IDS.map((x) => `${PATTERNS[x].label}: ${PATTERNS[x].test}`),
        ...PATTERN_PAIR_TESTS.map((x) => `${x.pair} ${x.test}`),
        tt("Tag the behaviour, not the outcome: a fading customer who stayed after a call is still fading.", "Ordnen Sie das Verhalten zu, nicht das Ergebnis: Ein nachlassender Kunde, der nach einem Anruf blieb, ist trotzdem nachlassend."),
      ]}
      sources={["fader2005", "ascarza2018"]}
    >
      <ShowMore id="A5" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Fader, Hardie and Lee (2005) showed that three pieces of behaviour say most about a customer's future: how recently they bought, how often, and for how much. Usage data adds the shape over time. Reading the shape, not a single month, is what separates a customer who is leaving from one who is simply in a quiet season.",
            "Fader, Hardie und Lee (2005) zeigten, dass drei Verhaltensmerkmale das meiste über die Zukunft eines Kunden sagen: wie kürzlich er kaufte, wie oft und für wie viel. Nutzungsdaten fügen die Form über die Zeit hinzu. Die Form zu lesen, nicht einen einzelnen Monat, trennt einen Kunden, der geht, von einem, der nur in einer ruhigen Saison ist.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Four Weser Cloud customers, twelve months of usage", "Vier Kunden von Weser Cloud, zwölf Monate Nutzung")} caption={tt("Click a line or a button to highlight one customer and read its pattern and test.", "Klicken Sie eine Linie oder Schaltfläche an, um einen Kunden hervorzuheben und sein Muster und seinen Test zu lesen.")}>
        <PatternCurves />
      </Diagram>
      <ShowMore id="A5" part="table" label={tt("Show the four patterns in a table", "Die vier Muster in einer Tabelle zeigen")}>
        <DataTable
          head={[tt("Pattern", "Muster"), tt("What it looks like", "Wie es aussieht"), tt("The line", "Die Linie")]}
          rows={PATTERN_IDS.map((x) => [PATTERNS[x].label, PATTERNS[x].means, PATTERNS[x].shape])}
          caption={tt("The four patterns", "Die vier Muster")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA6() {
  return (
    <MaterialCard
      id="A6"
      scan={tt("A pattern becomes useful when you say what it tells you about the customer, how likely they are to leave, and what to do. Then say what you do not know: a pattern is a link, not a proven cause.", "Ein Muster wird nützlich, wenn Sie sagen, was es über den Kunden aussagt, wie wahrscheinlich er geht und was zu tun ist. Dann sagen Sie, was Sie nicht wissen: Ein Muster ist ein Zusammenhang, keine bewiesene Ursache.")}
      reasoning={[
        tt("Most valuable to keep = the highest yearly revenue. Order frequency is not value: a customer who orders every week for small amounts can be worth less than one who orders twice a year.", "Am wertvollsten zu halten = der höchste Jahresumsatz. Bestellhäufigkeit ist nicht Wert: Ein Kunde, der jede Woche kleine Mengen bestellt, kann weniger wert sein als einer, der zweimal im Jahr bestellt."),
        tt("Most likely to churn = usage down 30% or more and a gap well beyond the customer's own rhythm. A long gap with rising usage is a cycle, not churn.", "Am ehesten abwandernd = Nutzung um 30 % oder mehr gesunken und ein Abstand weit über dem eigenen Rhythmus des Kunden. Ein langer Abstand bei steigender Nutzung ist ein Zyklus, kein Churn."),
        tt("The three kinds of customer data each answer a different question: frequency (how often they buy), time between purchases (how long since, against their rhythm) and use of services (how broadly they rely on you). An insight names the one it rests on.", "Die drei Arten von Kundendaten beantworten je eine andere Frage: Häufigkeit (wie oft sie kaufen), Zeit zwischen Käufen (wie lange her, gemessen an ihrem Rhythmus) und Nutzung der Services (wie breit sie sich auf Sie stützen). Ein Insight nennt die, auf der er ruht."),
        RISK_RULE.v,
        tt("What each pattern says: anchored = they depend on us and are open to more; fading = something changed on their side and the tie is weakening; dormant = they never got the value of what they bought; cyclical = their need comes in cycles.", "Was jedes Muster sagt: verankert = sie sind auf uns angewiesen und offen für mehr; nachlassend = bei ihnen hat sich etwas geändert und die Bindung wird schwächer; ruhend = sie haben nie den Wert dessen bekommen, was sie kauften; zyklisch = ihr Bedarf kommt in Zyklen."),
        tt("What to do: anchored → an expansion offer; fading → early outreach within two weeks; dormant → a guided second onboarding; cyclical → a contact plan timed to their cycle and no alarm in quiet months. A discount answers none of them.", "Was zu tun ist: verankert → ein Erweiterungsangebot; nachlassend → frühe Ansprache innerhalb von zwei Wochen; ruhend → ein begleitetes zweites Onboarding; zyklisch → ein Kontaktplan im Takt des Zyklus und kein Alarm in ruhigen Monaten. Ein Rabatt beantwortet keines davon."),
        tt("Name the uncertainty: small samples, a link that is not a cause, use that is not recorded, and customers who may not behave like last year's. “Data is objective” and “high usage means safe” are not uncertainties; they are mistakes.", "Nennen Sie die Unsicherheit: kleine Stichproben, ein Zusammenhang, der keine Ursache ist, Nutzung, die nicht erfasst wird, und Kunden, die sich vielleicht nicht wie letztes Jahr verhalten. „Daten sind objektiv“ und „hohe Nutzung heißt sicher“ sind keine Unsicherheiten; sie sind Fehler."),
      ]}
      sources={["pearl2018", "ascarza2018"]}
    >
      <ShowMore id="A6" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Pearl and Mackenzie (2018) explain why a link in the data is not yet a cause: a third factor can drive both things you see. Ascarza and colleagues (2018) add a practical point for retention: act on the customers an action can change, not only on those most likely to leave. A cyclical customer is likely to go quiet and does not need saving; a fading one can still be won back.",
            "Pearl und Mackenzie (2018) erklären, warum ein Zusammenhang in den Daten noch keine Ursache ist: Ein dritter Faktor kann beides antreiben, was man sieht. Ascarza und Kollegen (2018) ergänzen einen praktischen Punkt für die Kundenbindung: Handeln Sie bei den Kunden, die eine Maßnahme verändern kann, nicht nur bei denen, die am ehesten gehen. Ein zyklischer Kunde wird wahrscheinlich still und muss nicht gerettet werden; ein nachlassender kann noch zurückgewonnen werden.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Many tickets and leaving · a worked example on Weser Cloud", "Viele Tickets und Abwanderung · ein Beispiel mit Weser Cloud")} caption={tt("Show the third factor and read how the fix changes.", "Zeigen Sie den dritten Faktor und lesen Sie, wie sich die Lösung ändert.")}>
        <LinkOrCause />
      </Diagram>
      <ShowMore id="A6" part="table" label={tt("Show value and risk read from one table", "Wert und Risiko aus einer Tabelle gelesen zeigen")}>
        <DataTable
          head={[tt("Weser customer", "Kunde von Weser"), tt("Yearly revenue", "Jahresumsatz"), tt("Orders a year", "Bestellungen pro Jahr"), tt("Usage trend · days since last order", "Nutzungstrend · Tage seit letzter Bestellung"), tt("Reading", "Lesart")]}
          rows={[
            ["Nordhafen", euro(52000), "3", tt("+2% · 90", "+2 % · 90"), tt("Most valuable: highest revenue, orders rarely.", "Am wertvollsten: höchster Umsatz, bestellt selten.")],
            ["Deich IT", euro(6000), "30", tt("0% · 8", "0 % · 8"), tt("Frequent, not valuable.", "Häufig, nicht wertvoll.")],
            ["Bremer Glas", euro(15000), "5", tt("−40% · 140", "−40 % · 140"), tt("Churn risk: usage down and a long gap.", "Abwanderungsrisiko: Nutzung gesunken und langer Abstand.")],
            ["Kranbau Ost", euro(20000), "2", tt("+25% · 170", "+25 % · 170"), tt("A cycle: long gap, usage rising again.", "Ein Zyklus: langer Abstand, Nutzung steigt wieder.")],
          ]}
          caption={tt("Value and risk read from the same table (Case assumption)", "Wert und Risiko aus derselben Tabelle gelesen (Fallannahme)")}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export function CardA7() {
  return (
    <MaterialCard
      id="A7"
      scan={tt("Choose measures by three tests, each Low (1) to High (3), multiplied: explanatory power (how strong the evidence behind it is), feasibility (can it be done now) and effect (how much it changes). Then check the budget and which patterns you cover.", "Wählen Sie Maßnahmen nach drei Tests, jeweils Niedrig (1) bis Hoch (3), multipliziert: Erklärungskraft (wie stark die Evidenz dahinter ist), Machbarkeit (lässt es sich jetzt umsetzen) und Wirkung (wie viel es ändert). Prüfen Sie dann das Budget und welche Muster Sie abdecken.")}
      reasoning={[
        EXPLAIN_RULE.v,
        tt("Feasibility: 3 if it runs on data and people you already have, 2 if it needs a set-up or new skills, 1 if it takes most of the time available.", "Machbarkeit: 3, wenn es auf Daten und Menschen läuft, die Sie schon haben, 2, wenn es eine Einrichtung oder neue Fähigkeiten braucht, 1, wenn es den größten Teil der verfügbaren Zeit braucht."),
        tt("Effect: 3 if it acts on the pattern with the most revenue at risk, 2 if it helps but does not act by itself, 1 if it prevents false alarms or acts on no pattern.", "Wirkung: 3, wenn es auf das Muster mit dem meisten gefährdeten Umsatz wirkt, 2, wenn es hilft, aber nicht selbst handelt, 1, wenn es Fehlalarme verhindert oder auf kein Muster wirkt."),
        tt("Match each measure to the patterns it really serves from what it does. A discount, more data or a black-box score serves no pattern by itself.", "Ordnen Sie jede Maßnahme den Mustern zu, denen sie wirklich dient, aus dem, was sie tut. Ein Rabatt, mehr Daten oder ein Black-Box-Score dienen für sich keinem Muster."),
        tt("Stay inside the budget. If the plan is over, leave out the lowest score, do not trim every measure a little.", "Bleiben Sie im Budget. Liegt der Plan darüber, lassen Sie den niedrigsten Wert weg, statt jede Maßnahme ein bisschen zu kürzen."),
        tt("Order by score; if you put a lower score first, say why (set-up time, or the revenue at risk it answers).", "Ordnen Sie nach Wert; setzen Sie einen niedrigeren Wert nach vorn, sagen Sie warum (Vorlaufzeit, oder der gefährdete Umsatz, den er beantwortet)."),
      ]}
      sources={["hubbard2014", "ascarza2018"]}
    >
      <ShowMore id="A7" part="research" label={tt("Show the research behind this card", "Die Forschung hinter dieser Karte zeigen")}>
        <p className={p}>
          {tt(
            "Hubbard (2014) advises starting from the decision and asking what evidence would change it: a measure resting on a clear pattern across many customers deserves more trust than one resting on a vendor's promise. The plan names the evaluation for this day: explanatory power × feasibility × effect.",
            "Hubbard (2014) rät, von der Entscheidung auszugehen und zu fragen, welche Evidenz sie ändern würde: Eine Maßnahme, die auf einem klaren Muster über viele Kunden ruht, verdient mehr Vertrauen als eine, die auf einem Anbieterversprechen ruht. Der Plan nennt die Bewertung für diesen Tag: Erklärungskraft × Machbarkeit × Wirkung.",
          )}
        </p>
      </ShowMore>
      <Diagram label={tt("Three measures of Weser Cloud, scored", "Drei Maßnahmen von Weser Cloud, bewertet")} caption={tt("Click the evidence line or a score to change it, and read how the ranking moves.", "Klicken Sie die Evidenzzeile oder einen Wert an, um ihn zu ändern, und lesen Sie, wie sich die Rangfolge bewegt.")}>
        <ScoreExample />
      </Diagram>
      <ShowMore id="A7" part="extra" label={tt("Show two notes on the scores", "Zwei Hinweise zu den Werten zeigen")}>
        <Bul
          items={[
            tt("Explanatory power is read from the “rests on” line, never guessed.", "Die Erklärungskraft wird aus der „ruht auf“-Zeile gelesen, nie geschätzt."),
            tt("A cheap, easy measure can still score low when nothing in the data supports it.", "Eine günstige, leichte Maßnahme kann trotzdem niedrig punkten, wenn nichts in den Daten sie stützt."),
          ]}
        />
      </ShowMore>
    </MaterialCard>
  );
}

export const CARDS_A = [CardA1, CardA2, CardA3, CardA4, CardA5, CardA6, CardA7];
