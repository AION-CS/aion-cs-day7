import { bi, t } from "@/lib/lang";

/**
 * Task 1 · Blocks 2.1 and 2.2. Four behavioural patterns (Materi A5) and twelve customer records from last year, each with what happened
 * next. Every name and figure is a Case assumption. `truth` is never printed outside the mentor answer key. Counts are 3/3/3/3; the
 * outcomes carry the lesson: fading and dormant customers left, cyclical ones looked like churn and stayed.
 */
export type PatternId = "anchored" | "fading" | "dormant" | "cyclical";
export const PATTERN_IDS: PatternId[] = ["anchored", "fading", "dormant", "cyclical"];

export const PATTERNS = bi({
  anchored: {
    id: "anchored" as PatternId,
    label: t("Anchored", "Verankert"),
    means: t("Steady use of several services over a long time, orders at a regular rhythm.", "Gleichmäßige Nutzung mehrerer Services über lange Zeit, Bestellungen in regelmäßigem Rhythmus."),
    shape: t("a high, flat line", "eine hohe, flache Linie"),
    test: t("Is use high and steady, across several services, for a long time?", "Ist die Nutzung hoch und gleichmäßig, über mehrere Services, über lange Zeit?"),
  },
  fading: {
    id: "fading" as PatternId,
    label: t("Fading", "Nachlassend"),
    means: t("Use was good and is now falling: fewer logins, fewer services, longer gaps between orders.", "Die Nutzung war gut und sinkt jetzt: weniger Logins, weniger Services, längere Abstände zwischen Bestellungen."),
    shape: t("a line that was high and slopes down", "eine Linie, die hoch war und abfällt"),
    test: t("Was use once high, and is it now falling without having done so before?", "War die Nutzung einmal hoch, und sinkt sie jetzt, ohne das früher getan zu haben?"),
  },
  dormant: {
    id: "dormant" as PatternId,
    label: t("Dormant", "Ruhend"),
    means: t("Low use from the very start: one service, few users, the product never took off.", "Geringe Nutzung von Anfang an: ein Service, wenige Nutzer, das Produkt ist nie angelaufen."),
    shape: t("a low, flat line from day one", "eine niedrige, flache Linie ab dem ersten Tag"),
    test: t("Was use low from the first day, and never higher?", "War die Nutzung vom ersten Tag an niedrig, und nie höher?"),
  },
  cyclical: {
    id: "cyclical" as PatternId,
    label: t("Cyclical", "Zyklisch"),
    means: t("Use comes in bursts tied to projects or seasons; long quiet phases, then it returns.", "Die Nutzung kommt in Schüben, an Projekte oder Saisons gebunden; lange ruhige Phasen, dann kehrt sie zurück."),
    shape: t("waves: up, down, up again", "Wellen: hoch, runter, wieder hoch"),
    test: t("Has the quiet phase happened before, and did use come back each time?", "Gab es die ruhige Phase schon früher, und kam die Nutzung jedes Mal zurück?"),
  },
});

export const PATTERN_PAIR_TESTS = bi([
  { pair: t("Fading or dormant?", "Nachlassend oder ruhend?"), test: t("Ask whether use was ever high. Fading customers had a good history and are losing it; dormant ones never had it.", "Fragen Sie, ob die Nutzung je hoch war. Nachlassende Kunden hatten eine gute Vorgeschichte und verlieren sie; ruhende hatten sie nie.") },
  { pair: t("Fading or cyclical?", "Nachlassend oder zyklisch?"), test: t("Ask whether the drop has happened before and use came back. A drop that repeats with the calendar or with projects is a cycle, not a fade.", "Fragen Sie, ob der Rückgang schon früher kam und die Nutzung zurückkehrte. Ein Rückgang, der sich mit dem Kalender oder mit Projekten wiederholt, ist ein Zyklus, kein Nachlassen.") },
  { pair: t("Anchored or cyclical?", "Verankert oder zyklisch?"), test: t("Anchored use is steady month by month; cyclical use comes in bursts with quiet phases between them.", "Verankerte Nutzung ist Monat für Monat gleichmäßig; zyklische kommt in Schüben mit ruhigen Phasen dazwischen.") },
]);

export type RecId = "p01" | "p02" | "p03" | "p04" | "p05" | "p06" | "p07" | "p08" | "p09" | "p10" | "p11" | "p12";
export type Record_ = { id: RecId; code: string; text: string; outcome: "stayed" | "left"; truth: PatternId; clue: string; why: string; rejected: Partial<Record<PatternId, string>> };
export const OUTCOME_LABEL = bi({ stayed: t("Stayed", "Geblieben"), left: t("Left", "Gegangen") });

export const RECORDS: Record_[] = bi([
  { id: "p01" as RecId, code: "K-102", outcome: "stayed" as const, text: t("Five services, logins steady at about 400 a month, an order every four to six weeks for three years.", "Fünf Services, Logins stabil bei etwa 400 im Monat, eine Bestellung alle vier bis sechs Wochen seit drei Jahren."), truth: "anchored" as PatternId, clue: t("How steady is the use, and across how many services?", "Wie gleichmäßig ist die Nutzung, und über wie viele Services?"), why: t("High, steady use of five services for three years: anchored.", "Hohe, gleichmäßige Nutzung von fünf Services seit drei Jahren: verankert."), rejected: { cyclical: t("There are no quiet phases; the rhythm is regular.", "Es gibt keine ruhigen Phasen; der Rhythmus ist regelmäßig.") } },
  { id: "p02" as RecId, code: "K-117", outcome: "stayed" as const, text: t("Added a third service this year and signed the renewal early, twice in a row.", "Hat dieses Jahr einen dritten Service ergänzt und die Verlängerung zweimal in Folge früh unterschrieben."), truth: "anchored" as PatternId, clue: t("Is the customer growing into more, or pulling back?", "Wächst der Kunde in mehr hinein, oder zieht er sich zurück?"), why: t("Growing use and early renewals: anchored and open to more.", "Wachsende Nutzung und frühe Verlängerungen: verankert und offen für mehr."), rejected: { fading: t("Nothing is falling; the customer is adding services.", "Nichts sinkt; der Kunde ergänzt Services.") } },
  { id: "p03" as RecId, code: "K-131", outcome: "stayed" as const, text: t("Orders every month; uses backup, monitoring and the helpdesk, with flat usage all year.", "Bestellt jeden Monat; nutzt Backup, Monitoring und den Helpdesk, mit gleichbleibender Nutzung das ganze Jahr."), truth: "anchored" as PatternId, clue: t("Flat can mean steady or low. Which is it here, and how many services?", "Flach kann gleichmäßig oder niedrig heißen. Was ist es hier, und wie viele Services?"), why: t("Monthly orders and three services in steady use: anchored.", "Monatliche Bestellungen und drei Services in gleichmäßiger Nutzung: verankert."), rejected: { dormant: t("Dormant use is low and narrow; this is three services every month.", "Ruhende Nutzung ist niedrig und schmal; das hier sind drei Services jeden Monat.") } },
  { id: "p04" as RecId, code: "K-145", outcome: "left" as const, text: t("Logins fell from 300 to 110 a month over two quarters, after their IT lead left the company.", "Die Logins sanken über zwei Quartale von 300 auf 110 im Monat, nachdem ihr IT-Leiter das Unternehmen verlassen hatte."), truth: "fading" as PatternId, clue: t("Was use ever high? Has a drop like this happened before?", "War die Nutzung je hoch? Gab es einen solchen Rückgang schon früher?"), why: t("Good use that falls for the first time, after a change on the customer's side: fading.", "Gute Nutzung, die zum ersten Mal sinkt, nach einer Veränderung beim Kunden: nachlassend."), rejected: { cyclical: t("Nothing says the drop repeats; it follows a one-off event.", "Nichts sagt, dass sich der Rückgang wiederholt; er folgt einem einmaligen Ereignis.") } },
  { id: "p05" as RecId, code: "K-152", outcome: "left" as const, text: t("Used four services for two years; now down to two, and the last order was five months ago.", "Nutzte zwei Jahre lang vier Services; jetzt nur noch zwei, und die letzte Bestellung liegt fünf Monate zurück."), truth: "fading" as PatternId, clue: t("From four services to two: was it always narrow, or is it narrowing?", "Von vier Services auf zwei: War es immer schmal, oder wird es schmaler?"), why: t("A good history that is shrinking in services and in orders: fading.", "Eine gute Vorgeschichte, die bei Services und Bestellungen schrumpft: nachlassend."), rejected: { dormant: t("Dormant customers never used four services; this one did.", "Ruhende Kunden nutzten nie vier Services; dieser schon.") } },
  { id: "p06" as RecId, code: "K-163", outcome: "stayed" as const, text: t("Ticket volume doubled, then logins dropped by 40% in one quarter; a manager called and the issue was fixed.", "Das Ticketvolumen verdoppelte sich, dann sanken die Logins in einem Quartal um 40 %; eine Führungskraft rief an, und das Problem wurde gelöst."), truth: "fading" as PatternId, clue: t("Tag the behaviour, not the outcome. What did use do before anyone called?", "Ordnen Sie das Verhalten zu, nicht das Ergebnis. Was tat die Nutzung, bevor jemand anrief?"), why: t("Use fell sharply after trouble: fading. It stayed because someone acted early, which is the point of the pattern.", "Die Nutzung fiel nach Problemen stark: nachlassend. Er blieb, weil jemand früh handelte; genau dafür ist das Muster da."), rejected: { anchored: t("It stayed, but the behaviour before the call was a sharp fall.", "Er blieb, aber das Verhalten vor dem Anruf war ein starker Rückgang.") } },
  { id: "p07" as RecId, code: "K-171", outcome: "left" as const, text: t("Bought one service at signing and has logged in about 12 times a month since, never more.", "Hat bei Vertragsabschluss einen Service gekauft und sich seitdem etwa 12-mal im Monat angemeldet, nie mehr."), truth: "dormant" as PatternId, clue: t("Was use ever higher than it is now?", "War die Nutzung je höher als jetzt?"), why: t("Low from the first day and never higher: dormant.", "Niedrig vom ersten Tag an und nie höher: ruhend."), rejected: { fading: t("Nothing is falling; it was always this low.", "Nichts sinkt; es war immer so niedrig.") } },
  { id: "p08" as RecId, code: "K-184", outcome: "left" as const, text: t("The onboarding call was never booked; one user account out of 25 licences is active.", "Der Onboarding-Termin wurde nie gebucht; ein Nutzerkonto von 25 Lizenzen ist aktiv."), truth: "dormant" as PatternId, clue: t("Did the customer ever really start?", "Hat der Kunde je richtig angefangen?"), why: t("It never took off: one of 25 licences in use, no onboarding. Dormant.", "Es ist nie angelaufen: eine von 25 Lizenzen in Nutzung, kein Onboarding. Ruhend."), rejected: { fading: t("There is no good history to lose.", "Es gibt keine gute Vorgeschichte, die verloren gehen könnte.") } },
  { id: "p09" as RecId, code: "K-190", outcome: "stayed" as const, text: t("Uses only the e-mail archive, with a few logins a month since day one.", "Nutzt nur das E-Mail-Archiv, mit wenigen Logins im Monat seit dem ersten Tag."), truth: "dormant" as PatternId, clue: t("One service, few logins, since day one: which line shape is that?", "Ein Service, wenige Logins, seit dem ersten Tag: Welche Linienform ist das?"), why: t("Low and narrow from the start: dormant. It stayed so far, which is why the pattern is a risk, not a verdict.", "Niedrig und schmal von Anfang an: ruhend. Er blieb bisher; deshalb ist das Muster ein Risiko, kein Urteil."), rejected: { anchored: t("Steady is not enough: anchored use is high and broad.", "Gleichmäßig reicht nicht: verankerte Nutzung ist hoch und breit.") } },
  { id: "p10" as RecId, code: "K-205", outcome: "stayed" as const, text: t("Almost no use from May to August, then heavy use every autumn for the budget season.", "Fast keine Nutzung von Mai bis August, dann jeden Herbst starke Nutzung für die Budgetsaison."), truth: "cyclical" as PatternId, clue: t("Does the quiet phase come back each year, and does use return?", "Kommt die ruhige Phase jedes Jahr wieder, und kehrt die Nutzung zurück?"), why: t("A quiet summer and a busy autumn, every year: cyclical.", "Ein ruhiger Sommer und ein voller Herbst, jedes Jahr: zyklisch."), rejected: { fading: t("The drop repeats with the calendar and use returns.", "Der Rückgang wiederholt sich mit dem Kalender, und die Nutzung kehrt zurück.") } },
  { id: "p11" as RecId, code: "K-212", outcome: "stayed" as const, text: t("Orders in two big blocks a year, at the start of each new construction project; quiet in between.", "Bestellt zweimal im Jahr in großen Blöcken, zu Beginn jedes neuen Bauprojekts; dazwischen ruhig."), truth: "cyclical" as PatternId, clue: t("Long gaps, then big orders: tied to what?", "Lange Abstände, dann große Bestellungen: woran gebunden?"), why: t("Bursts tied to projects: cyclical. The long gaps are normal for this customer.", "Schübe, an Projekte gebunden: zyklisch. Die langen Abstände sind für diesen Kunden normal."), rejected: { dormant: t("Dormant use is low all the time; this one has big bursts.", "Ruhende Nutzung ist immer niedrig; dieser hat große Schübe.") } },
  { id: "p12" as RecId, code: "K-226", outcome: "stayed" as const, text: t("Usage drops every December and returns in January, as in each of the last three years.", "Die Nutzung sinkt jeden Dezember und kehrt im Januar zurück, wie in jedem der letzten drei Jahre."), truth: "cyclical" as PatternId, clue: t("Is this drop new, or the same as every year?", "Ist dieser Rückgang neu, oder derselbe wie jedes Jahr?"), why: t("The same December dip for three years, and a return every January: cyclical.", "Derselbe Dezember-Rückgang seit drei Jahren und jeden Januar eine Rückkehr: zyklisch."), rejected: { fading: t("A drop that returns every January is a season, not a fade.", "Ein Rückgang, der jeden Januar zurückkehrt, ist eine Saison, kein Nachlassen.") } },
]);
export const REC_IDS: RecId[] = ["p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09", "p10", "p11", "p12"];
export const REC_BY_ID = Object.fromEntries(RECORDS.map((r) => [r.id, r])) as Record<RecId, Record_>;

const zero = () => ({ anchored: 0, fading: 0, dormant: 0, cyclical: 0 }) as Record<PatternId, number>;
export const TRUTH_COUNTS: Record<PatternId, number> = RECORDS.reduce((o, x) => ({ ...o, [x.truth]: o[x.truth] + 1 }), zero());
export const TRUTH_LEFT: Record<PatternId, number> = RECORDS.reduce((o, x) => ({ ...o, [x.truth]: o[x.truth] + (x.outcome === "left" ? 1 : 0) }), zero());

/* ------------------------------------------------------------------ Block 2.2 · what each pattern says, forecasts and measures */

export type Risk = "high" | "mid" | "low";
export const RISK_LABEL = bi({ high: t("High", "Hoch"), mid: t("Mid", "Mittel"), low: t("Low", "Niedrig") });
export const RISK_GLYPH: Record<Risk, string> = { high: "●", mid: "◐", low: "○" };
/** The forecast rule of Materi A6, applied to the learner's own tally: share of a pattern's customers who left last year. */
export const riskOf = (left: number, count: number): Risk | null => (count === 0 ? null : left / count >= 0.5 ? "high" : left > 0 ? "mid" : "low");
export const RISK_RULE = bi({ v: t("Churn risk from last year: half or more of the pattern's customers left = High; some left = Mid; none left = Low.", "Abwanderungsrisiko aus dem letzten Jahr: Die Hälfte oder mehr der Kunden des Musters ging = Hoch; einige gingen = Mittel; keiner ging = Niedrig.") });

export type MeaningId = "open" | "weakening" | "novalue" | "rhythm";
export const MEANINGS = bi([
  { id: "open" as MeaningId, label: t("They depend on us and are open to more", "Sie sind auf uns angewiesen und offen für mehr") },
  { id: "weakening" as MeaningId, label: t("Something changed on their side and the tie is weakening", "Bei ihnen hat sich etwas geändert, und die Bindung wird schwächer") },
  { id: "novalue" as MeaningId, label: t("They never got the value of what they bought", "Sie haben nie den Wert dessen bekommen, was sie gekauft haben") },
  { id: "rhythm" as MeaningId, label: t("Their need comes in cycles; a quiet phase is normal", "Ihr Bedarf kommt in Zyklen; eine ruhige Phase ist normal") },
]);
export const MEANING_TRUTH: Record<PatternId, MeaningId> = { anchored: "open", fading: "weakening", dormant: "novalue", cyclical: "rhythm" };

export type PMeasureId = "expand" | "outreach" | "activate" | "calendar" | "discount";
export const PMEASURES = bi([
  { id: "expand" as PMeasureId, label: t("An expansion offer and a place in the reference programme", "Ein Erweiterungsangebot und ein Platz im Referenzprogramm") },
  { id: "outreach" as PMeasureId, label: t("Early outreach by the customer success manager within two weeks of the drop", "Frühe Ansprache durch den Customer Success Manager innerhalb von zwei Wochen nach dem Rückgang") },
  { id: "activate" as PMeasureId, label: t("A guided second onboarding and the activation of one more service", "Ein begleitetes zweites Onboarding und die Aktivierung eines weiteren Services") },
  { id: "calendar" as PMeasureId, label: t("A contact plan timed to their cycle, and no churn alert in the quiet months", "Ein Kontaktplan im Takt ihres Zyklus, und kein Churn-Alarm in den ruhigen Monaten") },
  { id: "discount" as PMeasureId, label: t("A renewal discount to keep them", "Ein Verlängerungsrabatt, um sie zu halten") },
]);
export const MEASURE_TRUTH: Record<PatternId, PMeasureId> = { anchored: "expand", fading: "outreach", dormant: "activate", cyclical: "calendar" };
export type PatternRow = { risk: Risk | null; meaning: MeaningId | null; measure: PMeasureId | null };

export type UncId = "sample" | "cause" | "missing" | "shift" | "objective" | "highsafe" | "moredata";
export const UNCERTAINTIES = bi([
  { id: "sample" as UncId, label: t("Three records per pattern is a small sample for a forecast", "Drei Datensätze pro Muster sind eine kleine Stichprobe für eine Prognose"), real: true, why: t("With three customers, one different outcome moves the rate by a third. The forecast is a first estimate, not a fact.", "Bei drei Kunden verschiebt ein anderes Ergebnis die Rate um ein Drittel. Die Prognose ist eine erste Schätzung, keine Tatsache.") },
  { id: "cause" as UncId, label: t("A pattern shows a link, not its cause", "Ein Muster zeigt einen Zusammenhang, nicht seine Ursache"), real: true, why: t("K-145's use fell after the IT lead left. The departure may be the cause; the falling logins only the symptom.", "Die Nutzung von K-145 fiel, nachdem der IT-Leiter ging. Der Weggang kann die Ursache sein; die sinkenden Logins nur das Symptom.") },
  { id: "missing" as UncId, label: t("Some use is not recorded (for example work done outside the platform)", "Manche Nutzung wird nicht erfasst (etwa Arbeit außerhalb der Plattform)"), real: true, why: t("A customer that works through exports or an API can look dormant while it depends on us.", "Ein Kunde, der über Exporte oder eine API arbeitet, kann ruhend aussehen, obwohl er auf uns angewiesen ist.") },
  { id: "shift" as UncId, label: t("This year's customers may not behave like last year's", "Die Kunden dieses Jahres verhalten sich vielleicht nicht wie die des letzten"), real: true, why: t("A forecast assumes the past repeats. A new product or a price change can break that.", "Eine Prognose nimmt an, dass sich die Vergangenheit wiederholt. Ein neues Produkt oder eine Preisänderung kann das brechen.") },
  { id: "objective" as UncId, label: t("Data is objective, so a pattern cannot mislead", "Daten sind objektiv, also kann ein Muster nicht in die Irre führen"), real: false, why: t("Data records what was measured, not what matters. The cyclical customers show how a pattern misleads when read without context.", "Daten erfassen, was gemessen wurde, nicht was wichtig ist. Die zyklischen Kunden zeigen, wie ein Muster ohne Kontext in die Irre führt.") },
  { id: "highsafe" as UncId, label: t("Customers with high usage never leave", "Kunden mit hoher Nutzung gehen nie"), real: false, why: t("High usage lowers the risk; it does not remove it. Fading customers had high usage once.", "Hohe Nutzung senkt das Risiko; sie beseitigt es nicht. Nachlassende Kunden hatten einmal hohe Nutzung.") },
  { id: "moredata" as UncId, label: t("The more data we collect, the more certain the forecast", "Je mehr Daten wir sammeln, desto sicherer die Prognose"), real: false, why: t("More of the wrong data adds noise. What helps is data that is linked to a decision and of good quality (Materi A3).", "Mehr von den falschen Daten erzeugt Rauschen. Was hilft, sind Daten, die mit einer Entscheidung verbunden und von guter Qualität sind (Materi A3).") },
]);
export const UNC_BY_ID = Object.fromEntries(UNCERTAINTIES.map((w) => [w.id, w])) as Record<UncId, (typeof UNCERTAINTIES)[number]>;
