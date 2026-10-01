import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Block 1.1. Nine lines from SmartData's reports, dashboards and system logs. The learner sorts them into the first three steps
 * of the ladder the plan names (data → information → insight → decision, Materi A2). A decision is the fourth step and is not sorted:
 * it is what the learner will make later. `truth` is never shown to the learner outside the mentor answer key.
 */
export type LevelTag = "data" | "info" | "insight";
export const LEVEL_TAGS = bi([
  { id: "data" as LevelTag, label: t("Data", "Daten"), hint: t("A single recorded fact: one event, one number, one entry. Nothing is compared yet.", "Ein einzelner erfasster Fakt: ein Ereignis, eine Zahl, ein Eintrag. Noch wird nichts verglichen.") },
  { id: "info" as LevelTag, label: t("Information", "Information"), hint: t("Data summarised or compared: a total, an average, a trend, a share. It says what happened.", "Zusammengefasste oder verglichene Daten: eine Summe, ein Durchschnitt, ein Trend, ein Anteil. Sie sagt, was passiert ist.") },
  { id: "insight" as LevelTag, label: t("Insight", "Insight (Erkenntnis)"), hint: t("An explanation that says what it means and points to an action: why it happens, and so what.", "Eine Erklärung, die sagt, was es bedeutet, und auf eine Handlung zeigt: warum es passiert, und was daraus folgt.") },
]);
export const LEVEL_LABEL = bi({ data: t("Data", "Daten"), info: t("Information", "Information"), insight: t("Insight", "Insight") });

export type LineId = "l1" | "l2" | "l3" | "l4" | "l5" | "l6" | "l7" | "l8" | "l9";
export type Line = { id: LineId; text: string; source: string; truth: LevelTag; clue: string; why: string; rejected: Partial<Record<LevelTag, string>> };

export const LINES: Line[] = bi([
  {
    id: "l1" as LineId,
    source: t("Platform log", "Plattform-Log"),
    text: t("Customer K-4711 logged in on 3 March at 09:14.", "Kunde K-4711 hat sich am 3. März um 09:14 Uhr angemeldet."),
    truth: "data" as LevelTag,
    clue: t("How many events does the line describe, and is anything compared?", "Wie viele Ereignisse beschreibt die Zeile, und wird etwas verglichen?"),
    why: t("One event, one customer, one time. Nothing is summarised or compared: raw data.", "Ein Ereignis, ein Kunde, ein Zeitpunkt. Nichts ist zusammengefasst oder verglichen: Rohdaten."),
    rejected: { info: t("A single login says nothing about a trend until it is counted with others.", "Ein einzelnes Login sagt nichts über einen Trend, bis es mit anderen gezählt wird.") },
  },
  {
    id: "l2" as LineId,
    source: t("Order system", "Bestellsystem"),
    text: t("Order 2291: 20 extra user licences for Brandt Logistik, €4,800, on 12 May.", "Bestellung 2291: 20 zusätzliche Nutzerlizenzen für Brandt Logistik, 4.800 €, am 12. Mai."),
    truth: "data" as LevelTag,
    clue: t("Is this one recorded order, or several orders put side by side?", "Ist das eine erfasste Bestellung, oder werden mehrere nebeneinandergestellt?"),
    why: t("One order as it was recorded. It has numbers in it, but numbers alone do not make information.", "Eine Bestellung, wie sie erfasst wurde. Sie enthält Zahlen, aber Zahlen allein machen noch keine Information."),
    rejected: { info: t("The €4,800 is one value of one order, not a total or a comparison.", "Die 4.800 € sind ein Wert einer Bestellung, keine Summe und kein Vergleich.") },
  },
  {
    id: "l3" as LineId,
    source: t("Helpdesk", "Helpdesk"),
    text: t("Ticket 8830 from Keller Bau: “VPN very slow since the update.”", "Ticket 8830 von Keller Bau: „VPN seit dem Update sehr langsam.“"),
    truth: "data" as LevelTag,
    clue: t("A complaint sounds like a finding. Is it one entry, or a pattern across entries?", "Eine Beschwerde klingt wie ein Befund. Ist es ein Eintrag, oder ein Muster über Einträge?"),
    why: t("One ticket, one customer's words. It could become information when tickets are counted, and an insight when someone explains them.", "Ein Ticket, die Worte eines Kunden. Es könnte Information werden, wenn Tickets gezählt werden, und ein Insight, wenn jemand sie erklärt."),
    rejected: { insight: t("The customer's sentence is a complaint, not an explanation of behaviour across customers.", "Der Satz des Kunden ist eine Beschwerde, keine Erklärung des Verhaltens über Kunden hinweg.") },
  },
  {
    id: "l4" as LineId,
    source: t("Quarterly report", "Quartalsbericht"),
    text: t("The average time between two orders rose from 64 to 97 days this year.", "Die durchschnittliche Zeit zwischen zwei Bestellungen stieg dieses Jahr von 64 auf 97 Tage."),
    truth: "info" as LevelTag,
    clue: t("It compares two averages. Does it also say why, or what to do?", "Sie vergleicht zwei Durchschnitte. Sagt sie auch, warum, oder was zu tun ist?"),
    why: t("Many orders summarised into an average and compared across two years: information. It says what changed, not why.", "Viele Bestellungen zu einem Durchschnitt zusammengefasst und über zwei Jahre verglichen: Information. Sie sagt, was sich geändert hat, nicht warum."),
    rejected: { insight: t("A rising gap is a finding about what happened; nothing explains it or says what to do.", "Ein wachsender Abstand ist ein Befund darüber, was passiert ist; nichts erklärt ihn oder sagt, was zu tun ist.") },
  },
  {
    id: "l5" as LineId,
    source: t("Dashboard", "Dashboard"),
    text: t("38% of customers use only one of our five services.", "38 % der Kunden nutzen nur einen unserer fünf Services."),
    truth: "info" as LevelTag,
    clue: t("A share of all customers: summarised. Is there a “so” or a “because” in it?", "Ein Anteil aller Kunden: zusammengefasst. Steckt ein „also“ oder ein „weil“ darin?"),
    why: t("Customers counted and turned into a share: information. It is a strong starting point, but it does not say whether that matters.", "Kunden gezählt und in einen Anteil verwandelt: Information. Ein guter Ausgangspunkt, aber er sagt nicht, ob das wichtig ist."),
    rejected: { insight: t("It does not say what one-service customers do differently, or what follows.", "Es sagt nicht, was Kunden mit einem Service anders machen, oder was daraus folgt.") },
  },
  {
    id: "l6" as LineId,
    source: t("Dashboard", "Dashboard"),
    text: t("Logins across all customers fell by 12% from the first to the second quarter.", "Die Logins über alle Kunden sanken vom ersten zum zweiten Quartal um 12 %."),
    truth: "info" as LevelTag,
    clue: t("A trend across all customers. Does it say which customers, or why?", "Ein Trend über alle Kunden. Sagt er, welche Kunden, oder warum?"),
    why: t("A trend: logins summed and compared across two quarters. It could be summer holidays or a warning; the line does not say.", "Ein Trend: Logins summiert und über zwei Quartale verglichen. Es könnten Sommerferien sein oder eine Warnung; die Zeile sagt es nicht."),
    rejected: { data: t("It is not one login; it is all logins summed and compared.", "Es ist nicht ein Login; es sind alle Logins summiert und verglichen.") },
  },
  {
    id: "l7" as LineId,
    source: t("Analysis note", "Analysenotiz"),
    text: t("Customers who use only one service leave four times as often as those with three or more, so the second service is where retention is won.", "Kunden, die nur einen Service nutzen, gehen viermal so oft wie Kunden mit drei oder mehr, also wird Bindung beim zweiten Service gewonnen."),
    truth: "insight" as LevelTag,
    clue: t("Look for the “so”: does the line say what the comparison means for a decision?", "Achten Sie auf das „also“: Sagt die Zeile, was der Vergleich für eine Entscheidung bedeutet?"),
    why: t("It links behaviour to an outcome and says what follows: an insight. Whether the link is a cause still has to be tested (Materi A6).", "Sie verbindet Verhalten mit einem Ergebnis und sagt, was folgt: ein Insight. Ob die Verbindung eine Ursache ist, muss noch geprüft werden (Materi A6)."),
    rejected: { info: t("It is more than a share: it compares two groups' churn and draws a conclusion for action.", "Es ist mehr als ein Anteil: Es vergleicht den Churn zweier Gruppen und zieht einen Schluss für das Handeln.") },
  },
  {
    id: "l8" as LineId,
    source: t("Analysis note", "Analysenotiz"),
    text: t("Usage usually falls about 60 days before a customer cancels, which gives us a two-month window to act.", "Die Nutzung sinkt meist etwa 60 Tage vor einer Kündigung, was uns ein Zeitfenster von zwei Monaten zum Handeln gibt."),
    truth: "insight" as LevelTag,
    clue: t("Does the line stop at what happened, or does it say what that allows us to do?", "Hört die Zeile bei dem auf, was passiert ist, oder sagt sie, was uns das zu tun erlaubt?"),
    why: t("A pattern over time plus what it means for action (a window to act): an insight.", "Ein Muster über die Zeit plus das, was es für das Handeln bedeutet (ein Zeitfenster): ein Insight."),
    rejected: { info: t("It is not just a trend; it names the lead time and what it is good for.", "Es ist nicht nur ein Trend; es nennt die Vorlaufzeit und wofür sie gut ist.") },
  },
  {
    id: "l9" as LineId,
    source: t("Analysis note", "Analysenotiz"),
    text: t("Our most frequent buyers are not our most valuable: large customers order rarely but in big volumes, so ranking accounts by order count misleads account planning.", "Unsere häufigsten Käufer sind nicht unsere wertvollsten: Große Kunden bestellen selten, aber in großen Mengen, also führt eine Rangfolge nach Bestellanzahl die Account-Planung in die Irre."),
    truth: "insight" as LevelTag,
    clue: t("It explains a mismatch and says what it means for planning. Which step is that?", "Sie erklärt einen Widerspruch und sagt, was er für die Planung bedeutet. Welche Stufe ist das?"),
    why: t("It explains why two measures disagree (frequency and value) and what that means for a decision: an insight.", "Sie erklärt, warum zwei Kennzahlen auseinanderliegen (Häufigkeit und Wert), und was das für eine Entscheidung bedeutet: ein Insight."),
    rejected: { info: t("A plain ranking would be information; this one explains it and says what follows.", "Eine bloße Rangfolge wäre Information; diese erklärt sie und sagt, was folgt.") },
  },
]);
export const LINE_IDS: LineId[] = ["l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9"];

/** The tests taught in Materi A2 for each step, and the pair tests. */
export const LEVEL_TESTS = bi([
  { name: t("Data", "Daten"), test: t("Is it one recorded fact (an event, an entry, a single value), with nothing summarised or compared?", "Ist es ein erfasster Fakt (ein Ereignis, ein Eintrag, ein einzelner Wert), ohne dass etwas zusammengefasst oder verglichen wird?") },
  { name: t("Information", "Information"), test: t("Is data summarised or compared (a total, an average, a share, a trend), saying what happened?", "Werden Daten zusammengefasst oder verglichen (Summe, Durchschnitt, Anteil, Trend), sodass gesagt wird, was passiert ist?") },
  { name: t("Insight", "Insight"), test: t("Does it explain why, or say what it means for a decision (“so …”, “which means …”)?", "Erklärt es, warum, oder sagt es, was es für eine Entscheidung bedeutet („also …“, „das heißt …“)?") },
  { name: t("Data or information?", "Daten oder Information?"), test: t("Numbers are not the test. One order with a price is data; many orders turned into an average is information.", "Zahlen sind nicht der Test. Eine Bestellung mit Preis sind Daten; viele Bestellungen, zu einem Durchschnitt gemacht, sind Information.") },
  { name: t("Information or insight?", "Information oder Insight?"), test: t("Ask “so what?”. If the line already answers it, it is an insight; if you still have to answer it, it is information.", "Fragen Sie „Na und?“. Beantwortet die Zeile das schon, ist es ein Insight; müssen Sie es noch beantworten, ist es Information.") },
]);

/** The decisive phrase inside each line's own text, for “Highlight the key words” (CLAUDE.md #4: every line at once, never which step). */
export const LINE_KEY: Record<string, string> = bi({
  l1: t("logged in on 3 March at 09:14", "am 3. März um 09:14 Uhr angemeldet"),
  l2: t("Order 2291", "Bestellung 2291"),
  l3: t("VPN very slow since the update.", "VPN seit dem Update sehr langsam."),
  l4: t("average time between two orders rose from 64 to 97 days", "durchschnittliche Zeit zwischen zwei Bestellungen stieg dieses Jahr von 64 auf 97 Tage"),
  l5: t("38% of customers", "38 % der Kunden"),
  l6: t("fell by 12% from the first to the second quarter", "sanken vom ersten zum zweiten Quartal um 12 %"),
  l7: t("so the second service is where retention is won", "also wird Bindung beim zweiten Service gewonnen"),
  l8: t("which gives us a two-month window to act", "was uns ein Zeitfenster von zwei Monaten zum Handeln gibt"),
  l9: t("so ranking accounts by order count misleads account planning", "also führt eine Rangfolge nach Bestellanzahl die Account-Planung in die Irre"),
});
