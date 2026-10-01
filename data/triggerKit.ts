import type { ArchId } from "@/data/route2";
import { bi, t } from "@/lib/lang";

/**
 * The ready-to-use parts of a trigger and of a pickup point (Block 3.5), written so the learner can put each one into the sentence and
 * learn from its reason while doing it (the Route 2 standard of Day 6, CLAUDE.md #44). The number and the month are not here: they come
 * from `numberView` (lib/calcR2.ts) so they cannot drift from the model answers. Case assumptions.
 *
 * - `metric`: what is counted, phrased so it fits "If … is below N by month M". It is about customers or about a result, not about the
 *   team's own activity (dashboards built, meetings held).
 * - `actions`: things the owner can do alone that change this one item, never the whole system (Materi B5); the first one of each item is
 *   the model trigger's own action.
 * - `reason`: why customers would leave when this item is missing, for the pickup point of an item that is left out.
 */
export type TriggerKit = {
  id: ArchId;
  metric: string;
  metricWhy: string;
  actions: { text: string; why: string }[];
  reason: string;
};

export const TRIGGER_KIT_LIST: TriggerKit[] = bi([
  {
    id: "foundation" as ArchId,
    metric: t("the share of active customers with joined usage, order and ticket data", "der Anteil aktiver Kunden mit verbundenen Nutzungs-, Bestell- und Ticketdaten"),
    metricWhy: t(
      "The foundation exists so that every customer appears once with all its data. Its success is how many customers are really joined, not how many meetings were held about it.",
      "Die Datenbasis soll dafür sorgen, dass jeder Kunde einmal mit allen Daten erscheint. Ihr Erfolg ist, wie viele Kunden wirklich verbunden sind, nicht wie viele Meetings darüber stattfanden.",
    ),
    actions: [
      {
        text: t("the health score waits and the gaps are fixed first", "wartet der Health Score, und zuerst werden die Lücken geschlossen"),
        why: t("Every other item reads this list. A score built on a list with gaps flags the wrong customers, so the gaps are fixed before anything else moves. The data team can do this alone.", "Jeder andere Punkt liest diese Liste. Ein Score auf einer Liste mit Lücken markiert die falschen Kunden, also werden zuerst die Lücken geschlossen. Das Datenteam kann das allein tun."),
      },
      {
        text: t("IT adds a daily check that lists the customers missing from the join", "ergänzt die IT eine tägliche Prüfung, die die Kunden auflistet, die im Abgleich fehlen"),
        why: t("A daily list turns an unknown gap into a short to-do list. It changes this one item and nothing else.", "Eine tägliche Liste macht aus einer unbekannten Lücke eine kurze To-do-Liste. Es ändert nur diesen einen Punkt."),
      },
      {
        text: t("the Head of Data drops the weakest source from the join until it is repaired", "nimmt die Leitung Data die schwächste Quelle aus dem Abgleich, bis sie repariert ist"),
        why: t("A join is only as good as its weakest source. Leaving it out for now keeps the rest reliable.", "Ein Abgleich ist nur so gut wie seine schwächste Quelle. Sie vorerst wegzulassen, hält den Rest verlässlich."),
      },
    ],
    reason: t("nobody could see all their data in one place", "niemand ihre Daten an einem Ort sehen konnte"),
  },
  {
    id: "health" as ArchId,
    metric: t("the share of customers who cancel that the score had flagged beforehand", "der Anteil der gekündigten Kunden, die der Score vorher markiert hatte"),
    metricWhy: t(
      "A score is only worth its price if it warns before customers leave. Count the leavers it had flagged, not how many customers it flags: flagging everyone would also catch every leaver.",
      "Ein Score ist seinen Preis nur wert, wenn er warnt, bevor Kunden gehen. Zählen Sie die Abgänge, die er markiert hatte, nicht wie viele Kunden er markiert: Wer alle markiert, fängt auch jeden Abgang.",
    ),
    actions: [
      {
        text: t("the Head of Data re-weights it", "gewichtet ihn die Leitung Data neu"),
        why: t("Re-weighting changes which signals count most in the score. The data team can do it alone, and it changes this one item only.", "Das Neugewichten ändert, welche Signale im Score am meisten zählen. Das Datenteam kann es allein tun, und es ändert nur diesen einen Punkt."),
      },
      {
        text: t("the Head of Data adds the signal that the missed leavers had in common", "ergänzt die Leitung Data das Signal, das die verpassten Abgänge gemeinsam hatten"),
        why: t("Look at the leavers the score missed. If most had the same sign, such as an unanswered ticket, adding it closes the gap.", "Schauen Sie auf die Abgänge, die der Score verpasste. Hatten die meisten dasselbe Zeichen, etwa ein unbeantwortetes Ticket, schließt es die Lücke, wenn man es ergänzt."),
      },
      {
        text: t("the Head of Data lowers the flag threshold from 30% to 20% usage drop for one quarter", "senkt die Leitung Data die Markierschwelle für ein Quartal von 30 % auf 20 % Nutzungsrückgang"),
        why: t("A lower threshold flags more customers earlier, at the price of more false alarms. It is one setting in one item.", "Eine niedrigere Schwelle markiert mehr Kunden früher, zum Preis von mehr Fehlalarmen. Es ist eine Einstellung in einem Punkt."),
      },
    ],
    reason: t("nobody saw their usage fall until it was too late", "niemand ihre sinkende Nutzung sah, bis es zu spät war"),
  },
  {
    id: "playbook" as ArchId,
    metric: t("the number of flagged customers who get a call each week", "die Zahl der markierten Kunden, die pro Woche einen Anruf bekommen"),
    metricWhy: t(
      "The playbook is meant to get flagged customers a call. Count the calls that happen, not the pages written: a good guide that nobody uses changes nothing for the customer.",
      "Das Playbook soll markierten Kunden einen Anruf bringen. Zählen Sie die Anrufe, die stattfinden, nicht die geschriebenen Seiten: Ein guter Leitfaden, den niemand nutzt, ändert für den Kunden nichts.",
    ),
    actions: [
      {
        text: t("customer success gets a second caller", "bekommt Customer Success einen zweiten Anrufer"),
        why: t("If the calls do not happen, the first question is capacity. The Head of Customer Success can add a caller alone.", "Finden die Anrufe nicht statt, ist die erste Frage die Kapazität. Die Leitung Customer Success kann allein einen Anrufer ergänzen."),
      },
      {
        text: t("the Head of Customer Success blocks two fixed call hours every day", "legt die Leitung Customer Success jeden Tag zwei feste Anrufstunden fest"),
        why: t("Calls that have no time reserved lose to everything else. Fixed hours cost nothing and change only this item.", "Anrufe ohne reservierte Zeit verlieren gegen alles andere. Feste Stunden kosten nichts und ändern nur diesen Punkt."),
      },
      {
        text: t("the Head of Customer Success shortens the playbook to the three questions that matter", "kürzt die Leitung Customer Success das Playbook auf die drei Fragen, die zählen"),
        why: t("A long guide is not opened. A short one is used on the call.", "Ein langer Leitfaden wird nicht geöffnet. Ein kurzer wird im Gespräch genutzt."),
      },
    ],
    reason: t("they were not called in time", "sie nicht rechtzeitig angerufen wurden"),
  },
  {
    id: "cohort" as ArchId,
    metric: t("the gap between a group's forecast churn and its actual churn", "die Abweichung zwischen dem prognostizierten und dem tatsächlichen Churn einer Gruppe"),
    metricWhy: t(
      "A dashboard that shows forecasts is only worth keeping if the forecasts are right. The gap between forecast and actual is the honest measure of that.",
      "Ein Dashboard mit Prognosen ist nur behaltenswert, wenn die Prognosen stimmen. Die Abweichung zwischen Prognose und Wirklichkeit ist das ehrliche Maß dafür.",
    ),
    actions: [
      {
        text: t("the rule behind that forecast is reviewed", "wird die Regel hinter der Prognose überprüft"),
        why: t("When a forecast misses, look at the rule that produced it. One rule is changed; the dashboard stays.", "Verfehlt eine Prognose, schaut man auf die Regel, die sie erzeugte. Eine Regel wird geändert; das Dashboard bleibt."),
      },
      {
        text: t("the Head of Data splits the group in two and compares the halves", "teilt die Leitung Data die Gruppe in zwei und vergleicht die Hälften"),
        why: t("A big miss often hides two different kinds of customers in one group. Splitting shows which half is off.", "Eine große Abweichung versteckt oft zwei verschiedene Kundenarten in einer Gruppe. Das Teilen zeigt, welche Hälfte danebenliegt."),
      },
      {
        text: t("the Head of Data adds a data-quality note to the group until the gap is explained", "ergänzt die Leitung Data einen Datenqualitätshinweis an der Gruppe, bis die Abweichung erklärt ist"),
        why: t("Readers of the dashboard should not trust a number the team knows is shaky.", "Wer das Dashboard liest, soll einer Zahl nicht trauen, von der das Team weiß, dass sie wackelt."),
      },
    ],
    reason: t("nobody noticed which forecasts were wrong", "niemand merkte, welche Prognosen falsch lagen"),
  },
  {
    id: "training" as ArchId,
    metric: t("the number of sales managers who use the score in their account plans", "die Zahl der Vertriebsleiter, die den Score in ihren Account-Plänen nutzen"),
    metricWhy: t(
      "A training is meant to change what managers do. Count the managers who now plan with the score, not the sessions held: attendance is your activity, a changed plan is their response.",
      "Eine Schulung soll ändern, was Manager tun. Zählen Sie die Manager, die jetzt mit dem Score planen, nicht die gehaltenen Einheiten: Teilnahme ist Ihre Aktivität, ein geänderter Plan ihre Reaktion.",
    ),
    actions: [
      {
        text: t("the training is repeated in their team meetings", "wird die Schulung in ihren Teammeetings wiederholt"),
        why: t("A repeat inside the meeting they already attend costs no extra time. The Head of Sales can decide it alone.", "Eine Wiederholung im Meeting, das sie ohnehin besuchen, kostet keine Extrazeit. Die Vertriebsleitung kann das allein entscheiden."),
      },
      {
        text: t("the Head of Sales asks each manager to show one account plan that uses the score", "bittet die Vertriebsleitung jeden Manager, einen Account-Plan zu zeigen, der den Score nutzt"),
        why: t("Showing a real plan is practice, and it makes use visible to the team.", "Einen echten Plan zu zeigen ist Übung, und es macht die Nutzung für das Team sichtbar."),
      },
      {
        text: t("the Head of Sales pairs each manager with a colleague who already uses it", "stellt die Vertriebsleitung jedem Manager einen Kollegen an die Seite, der ihn schon nutzt"),
        why: t("People copy what a colleague does more readily than what a slide says.", "Menschen ahmen eher nach, was ein Kollege tut, als was eine Folie sagt."),
      },
    ],
    reason: t("the managers did not know how to read the score", "die Manager nicht wussten, wie man den Score liest"),
  },
  {
    id: "quality" as ArchId,
    metric: t("the share of accounts with complete CRM notes", "der Anteil der Accounts mit vollständigen CRM-Notizen"),
    metricWhy: t(
      "The drive is meant to make the notes complete. Count the accounts with complete notes, not the reminders sent.",
      "Die Offensive soll die Notizen vollständig machen. Zählen Sie die Accounts mit vollständigen Notizen, nicht die verschickten Erinnerungen.",
    ),
    actions: [
      {
        text: t("filling them becomes part of the weekly pipeline review", "wird ihr Ausfüllen Teil des wöchentlichen Pipeline-Reviews"),
        why: t("What is asked about every week gets done. The Head of Sales can add it to the review alone.", "Was jede Woche abgefragt wird, wird erledigt. Die Vertriebsleitung kann es allein ins Review aufnehmen."),
      },
      {
        text: t("the Head of Sales makes three note fields required before a deal can be closed", "macht die Vertriebsleitung drei Notizfelder zur Pflicht, bevor ein Deal abgeschlossen werden kann"),
        why: t("A required field stops new gaps at the moment the information is freshest.", "Ein Pflichtfeld verhindert neue Lücken genau dann, wenn die Information am frischesten ist."),
      },
      {
        text: t("the data lead publishes a weekly list of the ten emptiest accounts by owner", "veröffentlicht die Leitung Data wöchentlich eine Liste der zehn leersten Accounts nach Owner"),
        why: t("A visible short list is easier to act on than a general push.", "Eine sichtbare kurze Liste lässt sich leichter abarbeiten als ein allgemeiner Appell."),
      },
    ],
    reason: t("what was promised to them was not written down", "was ihnen versprochen wurde, nicht aufgeschrieben war"),
  },
  {
    id: "ai" as ArchId,
    metric: t("the share of customers who cancel that the platform had flagged beforehand", "der Anteil der gekündigten Kunden, die die Plattform vorher markiert hatte"),
    metricWhy: t(
      "A platform you cannot look into has to prove itself on results. Count the leavers it had flagged.",
      "Eine Plattform, in die Sie nicht hineinsehen können, muss sich an Ergebnissen beweisen. Zählen Sie die Abgänge, die sie markiert hatte.",
    ),
    actions: [
      {
        text: t("the licence is not renewed", "wird die Lizenz nicht verlängert"),
        why: t("If the results do not justify the price, the Chief Data Officer can end the licence alone.", "Rechtfertigen die Ergebnisse den Preis nicht, kann die Chief Data Officer die Lizenz allein beenden."),
      },
      {
        text: t("the Chief Data Officer asks the vendor in writing for the reasons behind the ten highest scores", "fordert die Chief Data Officer vom Anbieter schriftlich die Gründe für die zehn höchsten Werte an"),
        why: t("If the vendor cannot explain them, the platform cannot be used by account managers.", "Kann der Anbieter sie nicht erklären, können Account Manager die Plattform nicht nutzen."),
      },
      {
        text: t("the Chief Data Officer limits the platform to one customer group for a quarter", "beschränkt die Chief Data Officer die Plattform für ein Quartal auf eine Kundengruppe"),
        why: t("A smaller test costs less and shows whether the scores add anything.", "Ein kleinerer Test kostet weniger und zeigt, ob die Werte etwas hinzufügen."),
      },
    ],
    reason: t("the health score had not flagged them beforehand", "der Health Score sie vorher nicht markiert hatte"),
  },
  {
    id: "feed" as ArchId,
    metric: t("the share of customers matched to the data set", "der Anteil der Kunden, die dem Datensatz zugeordnet sind"),
    metricWhy: t(
      "A feed is only useful for customers it can be matched to. Count the matched customers, not the number of data fields bought.",
      "Ein Feed nützt nur bei Kunden, denen er zugeordnet werden kann. Zählen Sie die zugeordneten Kunden, nicht die Zahl der gekauften Datenfelder.",
    ),
    actions: [
      {
        text: t("the feed is stopped", "wird der Feed gestoppt"),
        why: t("If most customers cannot be matched, the data cannot change a decision. The Chief Data Officer can stop it alone.", "Lassen sich die meisten Kunden nicht zuordnen, kann der Datensatz keine Entscheidung ändern. Die Chief Data Officer kann ihn allein stoppen."),
      },
      {
        text: t("the data team tries one more matching rule on the unmatched names", "probiert das Datenteam eine weitere Zuordnungsregel für die nicht zugeordneten Namen"),
        why: t("Many failed matches are spelling differences. One rule can fix a large share.", "Viele gescheiterte Zuordnungen sind Schreibunterschiede. Eine Regel kann einen großen Teil beheben."),
      },
      {
        text: t("the Chief Data Officer asks for a refund of the unmatched part", "fordert die Chief Data Officer eine Erstattung für den nicht zugeordneten Teil"),
        why: t("You pay for data you cannot use. Asking costs nothing.", "Sie zahlen für Daten, die Sie nicht nutzen können. Nachfragen kostet nichts."),
      },
    ],
    reason: t("their company's situation was visible only in outside data", "die Lage ihres Unternehmens nur in externen Daten sichtbar war"),
  },
]);

export const TRIGGER_KIT = Object.fromEntries(TRIGGER_KIT_LIST.map((k) => [k.id, k])) as Record<ArchId, TriggerKit>;
