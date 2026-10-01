"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Insight, Story, ThePoint, Toggles, useStory } from "@/components/materi/kit";
import { Num } from "@/components/ui/CalcTable";
import { LEVEL_LABEL } from "@/data/ladder";
import type { LevelTag } from "@/data/ladder";
import { WESER, WESER_RESULT, atRisk } from "@/data/forecast";
import { PATTERNS, PATTERN_IDS } from "@/data/patterns";
import type { PatternId } from "@/data/patterns";
import { EVIDENCE_LABEL, explainBucket } from "@/data/measures";
import type { Evidence } from "@/data/measures";
import { bi, euro, num, pct, t, tt } from "@/lib/lang";

/**
 * The interactive diagrams of Materi A (Route 1). Every one uses the worked-example company Weser Cloud (a Bremen cloud provider,
 * Case assumption), never SmartData, so the answer to a task block is never printed. Every control is followed by an always-visible
 * "What this shows" (CLAUDE.md #20), every picture opens with "The point" and carries a three-step "Walk me through it" story that
 * drives the real controls (CLAUDE.md #36); a manual button leaves the story.
 */
/** "In plain words:" leads every reading of a control (CLAUDE.md #36). */
const plain = () => tt("In plain words: ", "In einfachen Worten: ");
const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", rust: "#A4472A", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6" };
/** A dashed amber ring that moves with the story step (the spotlight): colour is never the only channel, the “Look at” line says it in words. */
const SPOT = "outline outline-2 -outline-offset-2 outline-dashed outline-[#8A5A0B] anim-pulse";

/* ------------------------------------------------------------------ A1 · gut feeling against data */

type WCust = { id: string; name: string; loud: boolean; drop: number; left: boolean };
const W_CUST: WCust[] = [
  { id: "w1", name: "Nordhafen", loud: true, drop: 0, left: false },
  { id: "w2", name: "Bremer Glas", loud: false, drop: -40, left: true },
  { id: "w3", name: "Deich IT", loud: false, drop: -35, left: true },
  { id: "w4", name: "Hanse Pflege", loud: true, drop: -32, left: true },
  { id: "w5", name: "Kranbau Ost", loud: false, drop: -50, left: false },
  { id: "w6", name: "Lloyd Möbel", loud: true, drop: 3, left: false },
  { id: "w7", name: "Moor Energie", loud: false, drop: 1, left: false },
  { id: "w8", name: "Schlachte Medien", loud: false, drop: -4, left: false },
];
type Lens = "gut" | "data";
const flaggedBy = (c: WCust, lens: Lens) => (lens === "gut" ? c.loud : c.drop <= -30);
const countOf = (lens: Lens) => {
  const flagged = W_CUST.filter((c) => flaggedBy(c, lens));
  return { flagged: flagged.length, caught: flagged.filter((c) => c.left).length, falseAlarm: flagged.filter((c) => !c.left).length, leavers: W_CUST.filter((c) => c.left).length };
};

export function GutVsData() {
  const uid = useId().replace(/:/g, "");
  const [lens, setLensRaw] = useState<Lens>("gut");
  const [reveal, setRevealRaw] = useState(false);
  const d = countOf("data");
  const g = countOf("gut");
  const story = useStory([
    {
      title: tt("Data sees the quiet ones", "Daten sehen die Stillen"),
      say: tt(`Weser Cloud is an example company, not your case. Its usage data flags the ${d.flagged} customers whose use fell by 30%. All ${d.leavers} who left are among them.`, `Weser Cloud ist ein Beispielunternehmen, nicht Ihr Fall. Seine Nutzungsdaten markieren die ${d.flagged} Kunden, deren Nutzung um 30 % sank. Alle ${d.leavers}, die gingen, sind darunter.`),
      look: tt("the amber cards, and the “✕ left” marks", "die bernsteinfarbenen Karten und die Markierungen „✕ gegangen“"),
      apply: () => {
        setLensRaw("data");
        setRevealRaw(true);
      },
    },
    {
      title: tt("Memory sees the loud ones", "Das Gedächtnis sieht die Lauten"),
      say: tt(`Its account managers call the customers they remember: the ${g.flagged} who are often in touch. Only ${g.caught} of the ${g.leavers} who left is among them.`, `Seine Account Manager rufen die Kunden an, an die sie sich erinnern: die ${g.flagged}, die sich oft melden. Nur ${g.caught} der ${g.leavers} Kunden, die gingen, ist darunter.`),
      look: tt("the amber cards: most are not marked “✕ left”", "die bernsteinfarbenen Karten: die meisten tragen kein „✕ gegangen“"),
      apply: () => {
        setLensRaw("gut");
        setRevealRaw(true);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("The customers who leave go quiet first, so memory misses them. Data sees quiet customers too, but a person must still read the exceptions. Try both buttons.", "Kunden, die gehen, werden zuerst still, also übersieht sie das Gedächtnis. Daten sehen auch stille Kunden, aber ein Mensch muss die Ausnahmen trotzdem lesen. Probieren Sie beide Schaltflächen."),
      look: tt("Kranbau Ost: flagged by the data, and it stayed", "Kranbau Ost: von den Daten markiert, und er blieb"),
      apply: () => {
        setLensRaw("data");
        setRevealRaw(true);
      },
    },
  ]);
  const setLens = (l: Lens) => {
    story.leave();
    setLensRaw(l);
  };
  const toggleReveal = () => {
    story.leave();
    setRevealRaw((r) => !r);
  };
  const { flagged, caught, falseAlarm, leavers } = countOf(lens);
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Customers who are about to leave go quiet first. A list built from memory picks the loud customers and misses them; a list built from usage data sees every customer the same way.", "Kunden, die gleich gehen, werden zuerst still. Eine Liste aus dem Gedächtnis wählt die lauten Kunden und übersieht sie; eine Liste aus Nutzungsdaten sieht jeden Kunden gleich an.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 210" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Eight Weser Cloud customers: who gets a call, and who left", "Acht Kunden von Weser Cloud: wer einen Anruf bekommt, und wer ging")}</title>
        <desc id={`${uid}-d`}>{tt(`${flagged} customers flagged, ${caught} of ${leavers} leavers among them.`, `${flagged} Kunden markiert, ${caught} von ${leavers} Abgängen darunter.`)}</desc>
        {W_CUST.map((c, i) => {
          const x = 20 + (i % 4) * 135;
          const y = 16 + Math.floor(i / 4) * 96;
          const f = flaggedBy(c, lens);
          return (
            <g key={c.id}>
              {story.step !== null && f && <rect x={x - 5} y={y - 5} width="130" height="90" rx="11" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
              <rect x={x} y={y} width="120" height="80" rx="8" fill={f ? C.soft : C.paper} stroke={f ? C.amber : C.line} strokeWidth={f ? 2.4 : 1.2} />
              <text x={x + 60} y={y + 22} textAnchor="middle" fontSize="12.5" fontWeight="700" fill={C.ink}>{c.name}</text>
              <text x={x + 60} y={y + 42} textAnchor="middle" fontSize="11" fill={C.ash}>{c.loud ? tt("often in touch", "meldet sich oft") : tt("quiet", "still")}</text>
              <text x={x + 60} y={y + 58} textAnchor="middle" fontSize="11" fill={c.drop <= -30 ? C.rust : C.ash}>{tt(`usage ${c.drop > 0 ? "+" : ""}${c.drop}%`, `Nutzung ${c.drop > 0 ? "+" : ""}${c.drop} %`)}</text>
              {reveal && (
                <text x={x + 60} y={y + 74} textAnchor="middle" fontSize="11" fontWeight="700" fill={c.left ? C.rust : C.teal}>{c.left ? tt("✕ left", "✕ gegangen") : tt("● stayed", "● geblieben")}</text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap items-center gap-3">
        <Toggles<Lens> label={tt("Who gets a call", "Wer einen Anruf bekommt")} value={lens} onChange={setLens} options={[{ id: "gut", label: tt("Account managers' feeling", "Gefühl der Account Manager") }, { id: "data", label: tt("Usage data (drop of 30% or more)", "Nutzungsdaten (Rückgang ab 30 %)") }]} />
        <Toggles<string> label={tt("Outcome", "Ergebnis")} value={reveal ? "on" : null} onChange={toggleReveal} options={[{ id: "on", label: reveal ? tt("Hide who left", "Verbergen, wer ging") : tt("Show who left", "Zeigen, wer ging") }]} />
      </div>
      <Insight>
        {plain()}
        {!reveal
          ? lens === "gut"
            ? tt(`The account managers would call ${flagged} customers: the ones who are often in touch. Press “Show who left” to see whether that was the right list.`, `Die Account Manager würden ${flagged} Kunden anrufen: die, die sich oft melden. Drücken Sie „Zeigen, wer ging“, um zu sehen, ob das die richtige Liste war.`)
            : tt(`The usage data flags ${flagged} customers whose use fell by 30% or more, most of them quiet. Press “Show who left” to compare.`, `Die Nutzungsdaten markieren ${flagged} Kunden, deren Nutzung um 30 % oder mehr sank, die meisten still. Drücken Sie „Zeigen, wer ging“, um zu vergleichen.`)
          : lens === "gut"
            ? tt(`Gut feeling caught ${caught} of ${leavers} customers who left, and spent ${falseAlarm} calls on customers who stayed. The loud customers were not the leaving ones: the ones who left went quiet.`, `Das Bauchgefühl fand ${caught} von ${leavers} Kunden, die gingen, und verwendete ${falseAlarm} Anrufe auf Kunden, die blieben. Die lauten Kunden waren nicht die gehenden: Die Gehenden wurden still.`)
            : tt(`The data caught ${caught} of ${leavers} leavers, with ${falseAlarm} false alarm (Kranbau Ost, a project customer in its quiet season). Data sees the quiet ones; it still needs a person to read the exceptions.`, `Die Daten fanden ${caught} von ${leavers} Abgängen, mit ${falseAlarm} Fehlalarm (Kranbau Ost, ein Projektkunde in seiner ruhigen Saison). Daten sehen die Stillen; sie brauchen trotzdem einen Menschen, der die Ausnahmen liest.`)}
      </Insight>
      <p className="text-caption text-ash">{tt("Illustration on Weser Cloud's customers (Case assumption).", "Illustration mit Kunden von Weser Cloud (Fallannahme).")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ A2 · the ladder from data to decision */

type Step = "data" | "info" | "insight" | "decision";
const STEPS: Step[] = ["data", "info", "insight", "decision"];
const STEP_TEXT = bi({
  data: { name: t("Data", "Daten"), example: t("“Customer W-3 logged in 11 times in May.”", "„Kunde W-3 hat sich im Mai 11-mal angemeldet.“"), reading: t("One recorded fact. It is true and says nothing yet: 11 could be a lot or a little.", "Ein erfasster Fakt. Er stimmt und sagt noch nichts: 11 kann viel oder wenig sein.") },
  info: { name: t("Information", "Information"), example: t("“W-3's logins fell from 40 to 11 a month since January.”", "„Die Logins von W-3 sanken seit Januar von 40 auf 11 im Monat.“"), reading: t("The data is compared over time: now we know what happened. We do not yet know whether it matters.", "Die Daten werden über die Zeit verglichen: Jetzt wissen wir, was passiert ist. Ob es wichtig ist, wissen wir noch nicht.") },
  insight: { name: t("Insight", "Insight"), example: t("“Customers whose logins fall this fast left five times as often last year, so W-3 is at risk.”", "„Kunden, deren Logins so schnell fallen, gingen letztes Jahr fünfmal so oft, also ist W-3 gefährdet.“"), reading: t("The information is linked to an outcome and says so what: this is where data starts to be worth something.", "Die Information wird mit einem Ergebnis verbunden und sagt, was daraus folgt: Hier beginnen Daten etwas wert zu sein.") },
  decision: { name: t("Decision", "Entscheidung"), example: t("“The customer success manager calls W-3 this week.”", "„Die Customer Success Managerin ruft W-3 diese Woche an.“"), reading: t("A choice of action, made by a person. The ladder only pays off here: an insight nobody acts on changes nothing.", "Eine gewählte Handlung, getroffen von einem Menschen. Erst hier zahlt sich die Leiter aus: Ein Insight, auf den niemand handelt, ändert nichts.") },
});

const W_LINES = bi([
  { id: "a", text: t("“Invoice 4417 to Deich IT: €3,200, paid on 4 June.”", "„Rechnung 4417 an Deich IT: 3.200 €, bezahlt am 4. Juni.“"), tag: "data" as LevelTag, why: t("One invoice, one payment: data.", "Eine Rechnung, eine Zahlung: Daten.") },
  { id: "b", text: t("“Half of our customers renew in the last week before the deadline.”", "„Die Hälfte unserer Kunden verlängert in der letzten Woche vor der Frist.“"), tag: "info" as LevelTag, why: t("Renewals counted and summarised into a share: information.", "Verlängerungen gezählt und zu einem Anteil zusammengefasst: Information.") },
  { id: "c", text: t("“Late renewers had no contact in the quarter before, so a call in that quarter could bring renewals forward.”", "„Späte Verlängerer hatten im Quartal davor keinen Kontakt, also könnte ein Anruf in diesem Quartal Verlängerungen vorziehen.“"), tag: "insight" as LevelTag, why: t("It links a behaviour to an outcome and says what follows: insight.", "Es verbindet ein Verhalten mit einem Ergebnis und sagt, was folgt: Insight.") },
]);

export function Ladder() {
  const uid = useId().replace(/:/g, "");
  const [step, setStepRaw] = useState<Step>("info");
  const [open, setOpen] = useState<string[]>([]);
  const story = useStory([
    {
      title: tt("A fact on its own", "Ein Fakt allein"),
      say: tt("Weser Cloud is an example company, not your case. “Customer W-3 logged in 11 times in May.” That is true, and it tells you nothing: 11 could be a lot or a little.", "Weser Cloud ist ein Beispielunternehmen, nicht Ihr Fall. „Kunde W-3 hat sich im Mai 11-mal angemeldet.“ Das stimmt, und es sagt Ihnen nichts: 11 kann viel oder wenig sein."),
      look: tt("the lowest step, Data", "die unterste Stufe, Daten"),
      apply: () => setStepRaw("data"),
    },
    {
      title: tt("A fact that says “so what”", "Ein Fakt, der „Na und“ beantwortet"),
      say: tt("Now compare: logins fell from 40 to 11, and customers like this left five times as often last year. So W-3 is at risk, and someone can act.", "Jetzt vergleichen: Die Logins sanken von 40 auf 11, und solche Kunden gingen letztes Jahr fünfmal so oft. Also ist W-3 gefährdet, und jemand kann handeln."),
      look: tt("the step Insight, one step below the top", "die Stufe Insight, eine unter der obersten"),
      apply: () => setStepRaw("insight"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Data is a fact, information compares facts, an insight says what it means. Only a decision makes anything change. Click the steps and try the three lines below.", "Daten sind ein Fakt, Information vergleicht Fakten, ein Insight sagt, was es bedeutet. Erst eine Entscheidung ändert etwas. Klicken Sie die Stufen an und probieren Sie die drei Zeilen darunter."),
      look: tt("the top step, Decision", "die oberste Stufe, Entscheidung"),
      apply: () => setStepRaw("decision"),
    },
  ]);
  const setStep = (k: Step) => {
    story.leave();
    setStepRaw(k);
  };
  const s = STEP_TEXT[step];
  const idx = STEPS.indexOf(step);
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A number is only data. Compare numbers and you have information. Say what it means and what to do and you have an insight. Only a decision changes anything.", "Eine Zahl sind nur Daten. Vergleichen Sie Zahlen, haben Sie Information. Sagen Sie, was es bedeutet und was zu tun ist, haben Sie einen Insight. Erst eine Entscheidung ändert etwas.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 190" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Four steps from data to decision", "Vier Stufen von Daten zur Entscheidung")}</title>
        <desc id={`${uid}-d`}>{tt(`Step shown: ${s.name}.`, `Gezeigte Stufe: ${s.name}.`)}</desc>
        {STEPS.map((k, i) => {
          const x = 20 + i * 132;
          const y = 140 - i * 36;
          const on = i <= idx;
          return (
            <g key={k} className="hit" role="button" tabIndex={0} aria-label={STEP_TEXT[k].name} onClick={() => setStep(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setStep(k)}>
              {story.step !== null && k === step && <rect x={x - 5} y={y - 5} width="130" height="50" rx="9" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
              <rect className="hit-shape" x={x} y={y} width="120" height="40" rx="6" fill={k === step ? C.gold : on ? C.data : C.paper} stroke={C.ink} strokeWidth="1.4" />
              <text x={x + 60} y={y + 25} textAnchor="middle" fontSize="13" fontWeight="700" fill={k === step ? C.ink : on ? C.paper : C.ash}>{STEP_TEXT[k].name}</text>
              {i < 3 && <path d={`M${x + 120},${y + 20} L${x + 132},${y - 16}`} stroke={C.ash} strokeWidth="1.6" markerEnd={`url(#${uid}-arr)`} />}
            </g>
          );
        })}
        <defs>
          <marker id={`${uid}-arr`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={C.ash} />
          </marker>
        </defs>
        <text x="20" y="186" fontSize="11.5" fill={C.ash}>{tt("each step adds meaning: compared, explained, acted on", "jede Stufe fügt Bedeutung hinzu: verglichen, erklärt, gehandelt")}</text>
      </svg>
      <Toggles<Step> label={tt("Step", "Stufe")} value={step} onChange={setStep} options={STEPS.map((k) => ({ id: k, label: STEP_TEXT[k].name }))} />
      <p className="rounded-md border border-line bg-paper px-3 py-2 text-caption text-ink">
        <span className="smallcaps mr-1.5">{tt("Weser Cloud", "Weser Cloud")}</span>
        {s.example}
      </p>
      <Insight>
        {plain()}
        {s.reading}
      </Insight>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("A worked sort: three lines from Weser Cloud's reports", "Eine Beispielsortierung: drei Zeilen aus den Berichten von Weser Cloud")}</p>
        <ul className="space-y-1.5">
          {W_LINES.map((l) => {
            const isOpen = open.includes(l.id);
            return (
              <li key={l.id} className="rounded-md border border-line bg-paper px-3 py-2 text-caption">
                <p className="text-ink">{l.text}</p>
                <button type="button" onClick={() => setOpen((o) => (o.includes(l.id) ? o.filter((x) => x !== l.id) : [...o, l.id]))} aria-expanded={isOpen} className="btn-ghost btn-sm mt-1">
                  {isOpen ? tt("Hide the step", "Stufe verbergen") : tt("Show the step", "Stufe zeigen")}
                </button>
                {isOpen && (
                  <p className="mt-1 text-ink">
                    <span className="font-semibold">{LEVEL_LABEL[l.tag]}. </span>
                    {l.why}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
        <Insight>
          {plain()}
          {open.length === 0
            ? tt("Decide each line yourself first, then open it. The test that separates them: one fact, a summary, or a “so what”.", "Entscheiden Sie jede Zeile zuerst selbst, dann öffnen Sie sie. Der Test, der sie trennt: ein Fakt, eine Zusammenfassung, oder ein „Na und“.")
            : tt(`${open.length} of 3 opened. Numbers appear on every step; what moves a line up the ladder is comparison and then explanation, never the number itself.`, `${open.length} von 3 geöffnet. Zahlen kommen auf jeder Stufe vor; was eine Zeile die Leiter hinaufbringt, ist der Vergleich und dann die Erklärung, nie die Zahl selbst.`)}
        </Insight>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ A3 · big data: chances and limits */

type SrcKey = "logs" | "social" | "market" | "survey" | "notes";
const SRC = bi({
  logs: { name: t("Platform logs", "Plattform-Logs"), volume: 3, decision: true, quality: 98, limit: t("Only shows what happens on the platform, not why.", "Zeigt nur, was auf der Plattform passiert, nicht warum.") },
  social: { name: t("Social media", "Soziale Medien"), volume: 3, decision: false, quality: 60, limit: t("Much noise, few customers, and no decision it would change.", "Viel Rauschen, wenige Kunden, und keine Entscheidung, die es ändern würde.") },
  market: { name: t("Bought market data", "Gekaufte Marktdaten"), volume: 3, decision: false, quality: 85, limit: t("Large and clean, but about companies in general, not about how customers use Weser.", "Groß und sauber, aber über Unternehmen allgemein, nicht darüber, wie Kunden Weser nutzen.") },
  survey: { name: t("Customer survey", "Kundenbefragung"), volume: 1, decision: true, quality: 30, limit: t("Says why in the customer's words, but only 3 in 10 answer, and the unhappy ones answer least.", "Sagt das Warum in den Worten des Kunden, aber nur 3 von 10 antworten, und die Unzufriedenen am wenigsten.") },
  notes: { name: t("CRM notes", "CRM-Notizen"), volume: 1, decision: true, quality: 45, limit: t("Rich context where it exists; half the accounts have none. Personal data: protected by the GDPR.", "Reicher Kontext, wo er existiert; die Hälfte der Accounts hat keinen. Personenbezogene Daten: durch die DSGVO geschützt.") },
});
export function BigDataLimits() {
  const uid = useId().replace(/:/g, "");
  const [k, setKRaw] = useState<SrcKey>("logs");
  const story = useStory([
    {
      title: tt("Small and useful", "Klein und nützlich"),
      say: tt(`Weser Cloud is an example company, not your case. Its platform logs feed a weekly decision and are ${SRC.logs.quality}% complete: a smart insight source.`, `Weser Cloud ist ein Beispielunternehmen, nicht Ihr Fall. Seine Plattform-Logs speisen eine wöchentliche Entscheidung und sind zu ${SRC.logs.quality} % vollständig: eine Quelle für Smart Insights.`),
      look: tt("the bar “Linked to a decision”: yes", "den Balken „Mit einer Entscheidung verbunden“: ja"),
      apply: () => setKRaw("logs"),
    },
    {
      title: tt("Large and useless", "Groß und nutzlos"),
      say: tt("Social media is just as large. But no decision Weser makes would change with it, so more of it is only noise.", "Soziale Medien sind genauso groß. Aber keine Entscheidung von Weser würde sich damit ändern, also ist mehr davon nur Rauschen."),
      look: tt("the dashed empty bar “Linked to a decision”: no", "den gestrichelten leeren Balken „Mit einer Entscheidung verbunden“: nein"),
      apply: () => setKRaw("social"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("More data is not more insight. Ask which decision it changes, then how complete it is. Try the other sources.", "Mehr Daten sind nicht mehr Erkenntnis. Fragen Sie, welche Entscheidung sie ändert, dann wie vollständig sie ist. Probieren Sie die anderen Quellen."),
      look: tt("the amber line at 80%", "die bernsteinfarbene Linie bei 80 %"),
      apply: () => setKRaw("survey"),
    },
  ]);
  const setK = (x: SrcKey) => {
    story.leave();
    setKRaw(x);
  };
  const s = SRC[k];
  const verdict = !s.decision ? "noise" : s.quality >= 80 ? "smart" : "fix";
  return (
    <div className="space-y-3">
      <ThePoint>{tt("More data is not more insight. A source helps when a decision uses it and it is complete enough to trust. A huge source that changes no decision is only noise.", "Mehr Daten sind nicht mehr Erkenntnis. Eine Quelle hilft, wenn eine Entscheidung sie nutzt und sie vollständig genug ist, um ihr zu trauen. Eine riesige Quelle, die keine Entscheidung ändert, ist nur Rauschen.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 172" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("A data source on three questions: how much, for which decision, how complete", "Eine Datenquelle nach drei Fragen: wie viel, für welche Entscheidung, wie vollständig")}</title>
        <desc id={`${uid}-d`}>{`${s.name}: ${s.decision ? tt("linked to a decision", "mit einer Entscheidung verbunden") : tt("no decision", "keine Entscheidung")}, ${s.quality}%`}</desc>
        {[
          { y: 20, label: tt("Volume", "Menge"), value: s.volume / 3, text: s.volume === 3 ? tt("large", "groß") : tt("small", "klein") },
          { y: 70, label: tt("Linked to a decision", "Mit einer Entscheidung verbunden"), value: s.decision ? 1 : 0.02, text: s.decision ? tt("yes", "ja") : tt("no", "nein") },
          { y: 120, label: tt("Complete", "Vollständig"), value: s.quality / 100, text: pct(s.quality) },
        ].map((r) => (
          <g key={r.y}>
            {story.step !== null && ((story.step === 1 && r.y === 70) || (story.step === 0 && r.y === 70) || (story.step === 2 && r.y === 120)) && <rect x="204" y={r.y - 5} width="292" height="36" rx="6" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
            <text x="0" y={r.y + 17} fontSize="12" fill={C.ink}>{r.label}</text>
            <rect x="210" y={r.y} width="280" height="26" fill={C.mist} stroke={C.line} />
            <rect x="210" y={r.y} width={Math.max(4, 280 * r.value)} height="26" fill={r.y === 70 && !s.decision ? C.paper : C.data} stroke={C.ink} strokeDasharray={r.y === 70 && !s.decision ? "4 3" : undefined} />
            <text x="500" y={r.y + 18} fontSize="12" fontWeight="700" fill={C.ink}>{r.text}</text>
          </g>
        ))}
        <line x1={210 + 280 * 0.8} y1="112" x2={210 + 280 * 0.8} y2="154" stroke={C.amber} strokeWidth="2" strokeDasharray="4 3" />
        <text x={210 + 280 * 0.8} y="166" textAnchor="middle" fontSize="10.5" fill={C.amber}>80%</text>
      </svg>
      <Toggles<SrcKey> label={tt("Data source", "Datenquelle")} value={k} onChange={setK} options={(Object.keys(SRC) as SrcKey[]).map((x) => ({ id: x, label: SRC[x].name }))} />
      <Insight>
        {plain()}
        {verdict === "smart"
          ? tt(`${s.name}: large, complete and linked to a decision Weser makes every week. This is a smart insight source. Its limit: ${s.limit}`, `${s.name}: groß, vollständig und mit einer Entscheidung verbunden, die Weser jede Woche trifft. Das ist eine Quelle für Smart Insights. Ihre Grenze: ${s.limit}`)
          : verdict === "noise"
            ? tt(`${s.name}: plenty of data and no decision it serves. More of it would add noise, not knowledge. ${s.limit}`, `${s.name}: viele Daten und keine Entscheidung, der sie dienen. Mehr davon brächte Rauschen, kein Wissen. ${s.limit}`)
            : tt(`${s.name}: linked to a decision but only ${s.quality}% complete, below the 80% line. Worth having once the gaps are fixed. ${s.limit}`, `${s.name}: mit einer Entscheidung verbunden, aber nur zu ${s.quality} % vollständig, unter der 80-%-Linie. Lohnend, sobald die Lücken geschlossen sind. ${s.limit}`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A4 · a first forecast (Weser Cloud) */

export function ForecastExample() {
  const uid = useId().replace(/:/g, "");
  const [now, setNowRaw] = useState(WESER.fallingNow);
  const r = WESER_RESULT;
  const risk = atRisk(now, r.rate, WESER.revenue);
  const W = (p: number) => (p / 25) * 300;
  const story = useStory([
    {
      title: tt("How much riskier", "Wie viel riskanter"),
      say: tt(`Weser Cloud is an example company, not your case. Customers whose use fell left ${num(r.lift)} times as often as the others: ${pct(r.rate)} against ${pct(r.other)}.`, `Weser Cloud ist ein Beispielunternehmen, nicht Ihr Fall. Kunden mit gesunkener Nutzung gingen ${num(r.lift)}-mal so oft wie die übrigen: ${pct(r.rate)} gegenüber ${pct(r.other)}.`),
      look: tt("the two bars and the lift line", "die zwei Balken und die Lift-Zeile"),
      apply: () => setNowRaw(WESER.fallingNow),
    },
    {
      title: tt("What is at stake", "Worum es geht"),
      say: tt(`This quarter ${WESER.fallingNow} customers show the same drop. ${WESER.fallingNow} × ${pct(r.rate)} × ${euro(WESER.revenue)} is ${euro(atRisk(WESER.fallingNow, r.rate, WESER.revenue))} of yearly revenue at risk.`, `In diesem Quartal zeigen ${WESER.fallingNow} Kunden denselben Rückgang. ${WESER.fallingNow} × ${pct(r.rate)} × ${euro(WESER.revenue)} sind ${euro(atRisk(WESER.fallingNow, r.rate, WESER.revenue))} gefährdeter Jahresumsatz.`),
      look: tt("the slider and the sum in “What this shows”", "den Regler und die Rechnung in „Was das zeigt“"),
      apply: () => setNowRaw(WESER.fallingNow),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("A forecast assumes this year's customers behave like last year's, so say “about”. Move the slider: more customers with the signal, more revenue at risk.", "Eine Prognose nimmt an, dass sich die Kunden dieses Jahres wie die des letzten verhalten, also sagen Sie „etwa“. Bewegen Sie den Regler: mehr Kunden mit dem Signal, mehr gefährdeter Umsatz."),
      look: tt("the slider", "den Regler"),
      apply: () => setNowRaw(45),
    },
  ]);
  const setNow = (v: number) => {
    story.leave();
    setNowRaw(v);
  };
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Look back first: how often did customers with a warning sign leave, compared with everyone else? Then count how many customers show the sign today. That gives you a first forecast of what is at stake.", "Schauen Sie zuerst zurück: Wie oft gingen Kunden mit einem Warnzeichen, verglichen mit allen anderen? Zählen Sie dann, wie viele Kunden das Zeichen heute zeigen. So entsteht eine erste Prognose, worum es geht.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Weser Cloud: churn rate of customers with falling usage against the others", "Weser Cloud: Churn Rate der Kunden mit sinkender Nutzung gegen die übrigen")}</title>
        <desc id={`${uid}-d`}>{tt(`Falling usage ${r.rate}%, others ${r.other}%, lift ${r.lift}.`, `Sinkende Nutzung ${r.rate} %, übrige ${r.other} %, Lift ${r.lift}.`)}</desc>
        {story.step === 0 && <rect x="0" y="10" width="552" height="132" rx="8" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
        <text x="0" y="36" fontSize="12" fill={C.ink}>{tt("Usage fell 30%+", "Nutzung −30 % und mehr")}</text>
        <rect x="170" y="20" width={W(r.rate)} height="26" fill={C.data} stroke={C.ink} />
        <text x={176 + W(r.rate)} y="38" fontSize="12.5" fontWeight="700" fill={C.ink}>{`${pct(r.rate)} (${WESER.falling.left} ${tt("of", "von")} ${WESER.falling.customers})`}</text>
        <text x="0" y="86" fontSize="12" fill={C.ink}>{tt("Stable or rising", "Stabil oder steigend")}</text>
        <rect x="170" y="70" width={W(r.other)} height="26" fill={C.grey} stroke={C.ink} />
        <text x={176 + W(r.other)} y="88" fontSize="12.5" fontWeight="700" fill={C.ink}>{`${pct(r.other)} (${WESER.stable.left} ${tt("of", "von")} ${WESER.stable.customers})`}</text>
        <text x="170" y="128" fontSize="13" fontWeight="700" fill={C.amber}>{tt(`Lift = ${r.rate} ÷ ${r.other} = ${num(r.lift)} times as often`, `Lift = ${r.rate} ÷ ${r.other} = ${num(r.lift)}-mal so oft`)}</text>
      </svg>
      <div className={clsx("space-y-1.5 rounded-md p-1", story.step !== null && story.step >= 1 && SPOT)}>
        <label htmlFor={`${uid}-now`} className="smallcaps block">
          {tt(`Weser customers whose usage has fallen this quarter: ${now}`, `Kunden von Weser, deren Nutzung in diesem Quartal gesunken ist: ${now}`)}
        </label>
        <input id={`${uid}-now`} type="range" min={10} max={60} step={5} value={now} onChange={(e) => setNow(Number(e.target.value))} className="w-full max-w-md accent-[#8A5A0B]" />
      </div>
      <Insight>
        {plain()}
        {tt(
          `${now} customers × ${pct(r.rate)} × ${euro(WESER.revenue)} = ${euro(risk)} of yearly revenue at risk. The rate comes from last year's history, the count from this quarter: the forecast only works if the new group behaves like the old one. ${now === WESER.fallingNow ? "At 30 customers the example gives €72,000." : `Moving the slider changes the count, not the rate: ${now > WESER.fallingNow ? "more" : "fewer"} customers showing the signal, ${now > WESER.fallingNow ? "more" : "less"} revenue at risk.`}`,
          `${now} Kunden × ${pct(r.rate)} × ${euro(WESER.revenue)} = ${euro(risk)} Jahresumsatz gefährdet. Die Rate stammt aus der Historie des letzten Jahres, die Zahl aus diesem Quartal: Die Prognose funktioniert nur, wenn sich die neue Gruppe wie die alte verhält. ${now === WESER.fallingNow ? "Bei 30 Kunden ergibt das Beispiel 72.000 €." : `Der Regler ändert die Zahl, nicht die Rate: ${now > WESER.fallingNow ? "mehr" : "weniger"} Kunden mit dem Signal, ${now > WESER.fallingNow ? "mehr" : "weniger"} gefährdeter Umsatz.`}`,
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A5 · four patterns, four Weser customers */

const CURVES: Record<PatternId, number[]> = {
  anchored: [80, 82, 79, 81, 80, 83, 81, 80, 82, 81, 80, 82],
  fading: [80, 81, 78, 76, 70, 62, 55, 48, 42, 36, 32, 28],
  dormant: [18, 20, 17, 19, 18, 16, 18, 17, 19, 18, 17, 18],
  cyclical: [20, 18, 22, 70, 85, 75, 20, 18, 20, 72, 86, 70],
};
const W_REC = bi({
  anchored: { who: "W-11", text: t("Four services, about 300 logins a month for two years.", "Vier Services, etwa 300 Logins im Monat seit zwei Jahren.") },
  fading: { who: "W-12", text: t("Was at 300 logins; down to 100 after a merger on their side.", "War bei 300 Logins; nach einer Fusion auf ihrer Seite auf 100 gesunken.") },
  dormant: { who: "W-13", text: t("Two of 40 licences in use since the first month.", "Zwei von 40 Lizenzen in Nutzung seit dem ersten Monat.") },
  cyclical: { who: "W-14", text: t("Quiet most months, busy at each tax deadline, every year.", "Die meisten Monate ruhig, zu jeder Steuerfrist voll, jedes Jahr.") },
});
export function PatternCurves() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState<PatternId>("fading");
  const story = useStory([
    {
      title: tt("A fade", "Ein Nachlassen"),
      say: tt("Weser Cloud is an example company, not your case. W-12 was at 300 logins a month and fell to 100 after a merger: fading.", "Weser Cloud ist ein Beispielunternehmen, nicht Ihr Fall. W-12 war bei 300 Logins im Monat und fiel nach einer Fusion auf 100: nachlassend."),
      look: tt("the amber line that slopes down", "die bernsteinfarbene Linie, die abfällt"),
      apply: () => setSelRaw("fading"),
    },
    {
      title: tt("A season", "Eine Saison"),
      say: tt("Customer W-14 also drops low, but it does so every year and comes back at each tax deadline. The same dip as a fade, with the opposite meaning: cyclical.", "Kunde W-14 fällt ebenfalls tief, tut das aber jedes Jahr und kommt zu jeder Steuerfrist zurück. Dieselbe Delle wie beim Nachlassen, mit der gegenteiligen Bedeutung: zyklisch."),
      look: tt("the waves: the dips come back", "die Wellen: Die Täler kommen wieder"),
      apply: () => setSelRaw("cyclical"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Read the shape over a year, not one month. Ask: was use ever high, and does a drop come back? Tap the other two customers.", "Lesen Sie die Form über ein Jahr, nicht einen Monat. Fragen Sie: War die Nutzung je hoch, und kommt ein Rückgang wieder? Tippen Sie die anderen zwei Kunden an."),
      look: tt("the flat lines: high and steady, or low from the start", "die flachen Linien: hoch und gleichmäßig, oder niedrig von Anfang an"),
      apply: () => setSelRaw("dormant"),
    },
  ]);
  const setSel = (p: PatternId) => {
    story.leave();
    setSelRaw(p);
  };
  const X = (i: number) => 40 + i * 44;
  const Y = (v: number) => 170 - v * 1.6;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Customers leave traces in their usage, and over a year the traces form a shape: high and steady, falling, low from the start, or waves. Each shape means something different, and two of them look alike at first sight.", "Kunden hinterlassen Spuren in ihrer Nutzung, und über ein Jahr bilden die Spuren eine Form: hoch und gleichmäßig, fallend, von Anfang an niedrig, oder Wellen. Jede Form bedeutet etwas anderes, und zwei sehen auf den ersten Blick ähnlich aus.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 200" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Twelve months of usage for four Weser Cloud customers", "Zwölf Monate Nutzung für vier Kunden von Weser Cloud")}</title>
        <desc id={`${uid}-d`}>{tt(`Highlighted: ${PATTERNS[sel].label}.`, `Hervorgehoben: ${PATTERNS[sel].label}.`)}</desc>
        <line x1="36" y1="172" x2="540" y2="172" stroke={C.ash} />
        <text x="36" y="192" fontSize="11" fill={C.ash}>{tt("month 1", "Monat 1")}</text>
        <text x="540" y="192" textAnchor="end" fontSize="11" fill={C.ash}>{tt("month 12", "Monat 12")}</text>
        {story.step !== null && <rect x="30" y={Y(Math.max(...CURVES[sel])) - 8} width="516" height={Y(Math.min(...CURVES[sel])) - Y(Math.max(...CURVES[sel])) + 16} rx="8" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
        {PATTERN_IDS.map((p) => (
          <polyline
            key={p}
            className="hit"
            role="button"
            tabIndex={0}
            aria-label={PATTERNS[p].label}
            onClick={() => setSel(p)}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(p)}
            points={CURVES[p].map((v, i) => `${X(i)},${Y(v)}`).join(" ")}
            fill="none"
            stroke={p === sel ? C.amber : C.grey}
            strokeWidth={p === sel ? 4 : 2}
            strokeDasharray={p === "dormant" && p !== sel ? "5 4" : undefined}
            opacity={p === sel ? 1 : 0.7}
          />
        ))}
        <text x={X(11) + 4} y={Y(CURVES[sel][11]) - 8} textAnchor="end" fontSize="12.5" fontWeight="700" fill={C.amber}>{`${W_REC[sel].who} · ${PATTERNS[sel].label}`}</text>
      </svg>
      <Toggles<PatternId> label={tt("Pattern", "Muster")} value={sel} onChange={setSel} options={PATTERN_IDS.map((p) => ({ id: p, label: `${W_REC[p].who} · ${PATTERNS[p].label}` }))} />
      <Insight>
        {plain()}
        {tt(
          `${W_REC[sel].who}: ${W_REC[sel].text} The shape is ${PATTERNS[sel].shape}. Test: ${PATTERNS[sel].test}`,
          `${W_REC[sel].who}: ${W_REC[sel].text} Die Form ist ${PATTERNS[sel].shape}. Test: ${PATTERNS[sel].test}`,
        )}
        {sel === "cyclical" ? tt(" Look at months 1 to 3 and 7 to 9: a drop as deep as the fading line, and it comes back.", " Schauen Sie auf Monat 1 bis 3 und 7 bis 9: ein Rückgang so tief wie bei der nachlassenden Linie, und er kommt zurück.") : ""}
        {sel === "dormant" ? tt(" It never falls because it never rose: low from the first month.", " Sie fällt nie, weil sie nie stieg: niedrig ab dem ersten Monat.") : ""}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A6 · a link is not a cause */

export function LinkOrCause() {
  const uid = useId().replace(/:/g, "");
  const [third, setThirdRaw] = useState(false);
  const story = useStory([
    {
      title: tt("The tempting reading", "Die verlockende Lesart"),
      say: tt("Weser Cloud is an example company, not your case. Customers with many tickets left more often. Read plainly, tickets drive customers away, so answer tickets faster.", "Weser Cloud ist ein Beispielunternehmen, nicht Ihr Fall. Kunden mit vielen Tickets gingen häufiger. Wörtlich gelesen vertreiben Tickets die Kunden, also beantworten Sie Tickets schneller."),
      look: tt("the arrow “seems to cause”", "den Pfeil „scheint zu verursachen“"),
      apply: () => setThirdRaw(false),
    },
    {
      title: tt("What was behind both", "Was hinter beidem steckte"),
      say: tt("A failed migration on the customer's side caused the tickets and the leaving. Faster answers would not have saved them; help with the migration might have.", "Eine gescheiterte Migration auf Kundenseite verursachte die Tickets und das Gehen. Schnellere Antworten hätten sie nicht gehalten; Hilfe bei der Migration vielleicht schon."),
      look: tt("the amber box “Failed migration”", "den bernsteinfarbenen Kasten „Gescheiterte Migration“"),
      apply: () => setThirdRaw(true),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("A pattern tells you where to look, not what the cause is. Before you act, ask what could sit behind both. Press the button to show or hide it.", "Ein Muster sagt, wo man hinsehen soll, nicht, was die Ursache ist. Fragen Sie vor dem Handeln, was hinter beidem stecken könnte. Drücken Sie die Schaltfläche, um es zu zeigen oder zu verbergen."),
      look: tt("the dashed arrow: only a link", "den gestrichelten Pfeil: nur ein Zusammenhang"),
      apply: () => setThirdRaw(true),
    },
  ]);
  const toggleThird = () => {
    story.leave();
    setThirdRaw((x) => !x);
  };
  return (
    <div className="space-y-3">
      <ThePoint>{tt("When two things happen together, one may not cause the other. A third thing can drive both. A pattern shows where to look; it does not prove the cause, and the right fix depends on the cause.", "Wenn zwei Dinge zusammen auftreten, verursacht das eine nicht unbedingt das andere. Ein Drittes kann beides antreiben. Ein Muster zeigt, wo man hinsehen soll; es beweist nicht die Ursache, und die richtige Lösung hängt von der Ursache ab.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 200" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Many tickets and leaving: a link, and what may lie behind it", "Viele Tickets und Abwanderung: ein Zusammenhang, und was dahinter liegen kann")}</title>
        <desc id={`${uid}-d`}>{third ? tt("A third factor, a failed migration, causes both.", "Ein dritter Faktor, eine gescheiterte Migration, verursacht beides.") : tt("Tickets appear to lead to leaving.", "Tickets scheinen zur Abwanderung zu führen.")}</desc>
        <defs>
          <marker id={`${uid}-a`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={C.ink} />
          </marker>
        </defs>
        <rect x="30" y="130" width="160" height="50" rx="8" fill={C.paper} stroke={C.ink} />
        <text x="110" y="160" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>{tt("Many tickets", "Viele Tickets")}</text>
        <rect x="370" y="130" width="160" height="50" rx="8" fill={C.paper} stroke={C.ink} />
        <text x="450" y="160" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>{tt("Customer leaves", "Kunde geht")}</text>
        {story.step !== null && story.step === 0 && <rect x="194" y="120" width="170" height="46" rx="8" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
        <line x1="190" y1="155" x2="366" y2="155" stroke={third ? C.grey : C.ink} strokeWidth="2.2" strokeDasharray={third ? "6 5" : undefined} markerEnd={third ? undefined : `url(#${uid}-a)`} />
        <text x="280" y="146" textAnchor="middle" fontSize="11.5" fill={third ? C.ash : C.ink}>{third ? tt("only a link", "nur ein Zusammenhang") : tt("seems to cause", "scheint zu verursachen")}</text>
        {third && (
          <g>
            {story.step !== null && story.step >= 1 && <rect x="194" y="14" width="172" height="62" rx="10" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
            <rect x="200" y="20" width="160" height="50" rx="8" fill={C.soft} stroke={C.amber} strokeWidth="2" />
            <text x="280" y="42" textAnchor="middle" fontSize="12.5" fontWeight="700" fill={C.ink}>{tt("Failed migration", "Gescheiterte Migration")}</text>
            <text x="280" y="59" textAnchor="middle" fontSize="11" fill={C.ash}>{tt("on the customer's side", "auf Kundenseite")}</text>
            <line x1="240" y1="70" x2="140" y2="128" stroke={C.amber} strokeWidth="2.2" markerEnd={`url(#${uid}-a)`} />
            <line x1="320" y1="70" x2="420" y2="128" stroke={C.amber} strokeWidth="2.2" markerEnd={`url(#${uid}-a)`} />
          </g>
        )}
      </svg>
      <Toggles<string> label={tt("Third factor", "Dritter Faktor")} value={third ? "on" : null} onChange={toggleThird} options={[{ id: "on", label: third ? tt("Hide the third factor", "Dritten Faktor verbergen") : tt("Show a third factor", "Einen dritten Faktor zeigen") }]} />
      <Insight>
        {plain()}
        {third
          ? tt("At Weser Cloud, customers with many tickets did leave more often. But the tickets and the leaving both came from a failed migration on the customer's side. Answering tickets faster would not have saved them; helping with the migration might have. A pattern tells you where to look, not what the cause is.", "Bei Weser Cloud gingen Kunden mit vielen Tickets tatsächlich häufiger. Aber Tickets und Abwanderung kamen beide aus einer gescheiterten Migration auf Kundenseite. Schnellere Ticketantworten hätten sie nicht gehalten; Hilfe bei der Migration vielleicht schon. Ein Muster sagt, wo man hinschauen soll, nicht, was die Ursache ist.")
          : tt("Read at face value, many tickets make customers leave, so the fix would be faster ticket answers. Press “Show a third factor” to test that reading.", "Wörtlich gelesen lassen viele Tickets Kunden gehen, also wäre die Lösung schnellere Ticketantworten. Drücken Sie „Einen dritten Faktor zeigen“, um diese Lesart zu prüfen.")}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ A7 · scoring: Weser's three measures */

type WM = { id: string; name: string; cost: number; evidence: Evidence; fea: 1 | 2 | 3; eff: 1 | 2 | 3 };
const BUD_W = 60000;
const EVIDENCES: Evidence[] = ["pattern", "some", "hunch"];
const W_START = (): WM[] => [
  { id: "p", name: tt("Call every customer whose usage fell 30%", "Jeden Kunden anrufen, dessen Nutzung um 30 % fiel"), cost: 25000, evidence: "pattern", fea: 2, eff: 3 },
  { id: "q", name: tt("Tax-season calendar for accounting firms", "Steuersaison-Kalender für Kanzleien"), cost: 8000, evidence: "some", fea: 3, eff: 1 },
  { id: "r", name: tt("Gift boxes for the 20 largest customers", "Geschenkboxen für die 20 größten Kunden"), cost: 12000, evidence: "hunch", fea: 3, eff: 1 },
];
export function ScoreExample() {
  const uid = useId().replace(/:/g, "");
  const [rows, setRows] = useState<WM[]>(W_START);
  const start = W_START();
  const sc = (r: WM) => explainBucket(r.evidence) * r.fea * r.eff;
  const story = useStory([
    {
      title: tt("Strong evidence", "Starke Evidenz"),
      say: tt(`Weser Cloud is an example company with three ideas. Calling customers whose use fell rests on a pattern across many customers: ${explainBucket(start[0].evidence)} × ${start[0].fea} × ${start[0].eff} = ${sc(start[0])}.`, `Weser Cloud ist ein Beispielunternehmen mit drei Ideen. Kunden mit gesunkener Nutzung anzurufen, ruht auf einem Muster über viele Kunden: ${explainBucket(start[0].evidence)} × ${start[0].fea} × ${start[0].eff} = ${sc(start[0])}.`),
      look: tt("the first row and its score", "die erste Zeile und ihren Wert"),
      apply: () => setRows(W_START()),
    },
    {
      title: tt("Easy, but nothing behind it", "Leicht, aber nichts dahinter"),
      say: tt(`Gift boxes are easy to do (feasibility 3), yet nothing in the data says gifts keep customers: ${explainBucket(start[2].evidence)} × ${start[2].fea} × ${start[2].eff} = ${sc(start[2])}.`, `Geschenkboxen sind leicht umzusetzen (Machbarkeit 3), doch nichts in den Daten sagt, dass Geschenke Kunden halten: ${explainBucket(start[2].evidence)} × ${start[2].fea} × ${start[2].eff} = ${sc(start[2])}.`),
      look: tt("the third row: the grey “rests on” line", "die dritte Zeile: die graue „ruht auf“-Zeile"),
      apply: () => setRows(W_START()),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Score the evidence, the ease and the effect, and multiply. Cheap and easy is not the same as worth it. Click a grey “rests on” line and watch the score move.", "Bewerten Sie Evidenz, Leichtigkeit und Wirkung und multiplizieren Sie. Günstig und leicht ist nicht dasselbe wie lohnend. Klicken Sie eine graue „ruht auf“-Zeile und sehen Sie, wie sich der Wert bewegt."),
      look: tt("the grey “rests on” lines", "die grauen „ruht auf“-Zeilen"),
      apply: () => setRows(W_START()),
    },
  ]);
  const cycle = (id: string, f: "fea" | "eff") => {
    story.leave();
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [f]: ((r[f] % 3) + 1) as 1 | 2 | 3 } : r)));
  };
  const setEv = (id: string) => {
    story.leave();
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, evidence: EVIDENCES[(EVIDENCES.indexOf(r.evidence) + 1) % 3] } : r)));
  };
  const scored = rows.map((r) => ({ ...r, exp: explainBucket(r.evidence), score: explainBucket(r.evidence) * r.fea * r.eff }));
  const total = scored.reduce((s, r) => s + r.cost, 0);
  const best = [...scored].sort((a, b) => b.score - a.score)[0];
  const spotRow = story.step === 0 ? "p" : story.step === 1 ? "r" : null;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Not every good idea is worth the money. Score how strong the evidence is, how easy it is and how much it changes, and multiply. The evidence is read from what the idea rests on, never guessed.", "Nicht jede gute Idee ist das Geld wert. Bewerten Sie, wie stark die Evidenz ist, wie leicht es geht und wie viel es ändert, und multiplizieren Sie. Die Evidenz wird daraus gelesen, worauf die Idee ruht, nie geschätzt.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[38rem] border-collapse text-caption">
          <caption className="sr-only">{tt("Three measures of Weser Cloud scored on explanatory power, feasibility and effect", "Drei Maßnahmen von Weser Cloud, bewertet nach Erklärungskraft, Machbarkeit und Wirkung")}</caption>
          <thead>
            <tr className="bg-mist text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Measure · rests on", "Maßnahme · ruht auf")}</th>
              <th className="px-3 py-2">{tt("Cost", "Kosten")}</th>
              <th className="px-3 py-2">{tt("Explan.", "Erklär.")}</th>
              <th className="px-3 py-2">{tt("Feasibility", "Machbarkeit")}</th>
              <th className="px-3 py-2">{tt("Effect", "Wirkung")}</th>
              <th className="px-3 py-2 text-right">{tt("Score", "Wert")}</th>
            </tr>
          </thead>
          <tbody>
            {scored.map((r) => (
              <tr key={r.id} className={clsx("border-t border-line align-top", spotRow === r.id && SPOT)}>
                <td className="px-3 py-2">
                  <span className="font-semibold">{r.name}</span>
                  <br />
                  <button type="button" onClick={() => setEv(r.id)} className="mt-1 text-left text-ash underline decoration-dotted underline-offset-2" aria-label={tt(`Evidence of ${r.name}: ${EVIDENCE_LABEL[r.evidence]}. Click to change.`, `Evidenz von ${r.name}: ${EVIDENCE_LABEL[r.evidence]}. Klicken zum Ändern.`)}>
                    {EVIDENCE_LABEL[r.evidence]}
                  </button>
                </td>
                <td className="tnum px-3 py-2">
                  <Num
                    id={`a7-cost-${r.id}`}
                    value={euro(r.cost)}
                    what={tt(`What “${r.name}” would cost Weser Cloud.`, `Was „${r.name}“ Weser Cloud kosten würde.`)}
                    from={tt(`Weser Cloud's plan (Case assumption). The three measures together are compared with the ${euro(BUD_W)} budget below the table.`, `Plan von Weser Cloud (Fallannahme). Die drei Maßnahmen zusammen werden unter der Tabelle mit dem Budget von ${euro(BUD_W)} verglichen.`)}
                  />
                </td>
                <td className="tnum px-3 py-2 font-semibold">
                  <Num
                    id={`a7-exp-${r.id}`}
                    value={String(r.exp)}
                    what={tt(`Explanatory power ${r.exp} (of 3): how strong the evidence behind the measure is.`, `Erklärungskraft ${r.exp} (von 3): wie stark die Evidenz hinter der Maßnahme ist.`)}
                    from={tt(`It is read, not guessed, from what the measure rests on: “${EVIDENCE_LABEL[r.evidence]}”. The rule: a pattern across many customers scores 3, some evidence 2, a hunch 1. Click the grey “rests on” line to change it.`, `Sie wird gelesen, nicht geschätzt, aus dem, worauf die Maßnahme ruht: „${EVIDENCE_LABEL[r.evidence]}“. Die Regel: ein Muster über viele Kunden ergibt 3, etwas Evidenz 2, ein Bauchgefühl 1. Klicken Sie die graue „ruht auf“-Zeile, um sie zu ändern.`)}
                  />
                </td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cycle(r.id, "fea")} className="btn-ghost btn-sm min-w-[3rem]" aria-label={tt(`Feasibility of ${r.name}: ${r.fea}. Click to change.`, `Machbarkeit von ${r.name}: ${r.fea}. Klicken zum Ändern.`)}>
                    {r.fea}
                  </button>
                </td>
                <td className="px-3 py-2">
                  <button type="button" onClick={() => cycle(r.id, "eff")} className="btn-ghost btn-sm min-w-[3rem]" aria-label={tt(`Effect of ${r.name}: ${r.eff}. Click to change.`, `Wirkung von ${r.name}: ${r.eff}. Klicken zum Ändern.`)}>
                    {r.eff}
                  </button>
                </td>
                <td className="tnum px-3 py-2 text-right font-bold">
                  <Num
                    id={`a7-score-${r.id}`}
                    value={String(r.score)}
                    what={tt(`The score of this measure: ${r.exp} × ${r.fea} × ${r.eff} = ${r.score}.`, `Der Wert dieser Maßnahme: ${r.exp} × ${r.fea} × ${r.eff} = ${r.score}.`)}
                    from={tt("Explanatory power (read from the evidence) × feasibility × effect, the three columns to the left. The highest possible score is 27, the lowest 1.", "Erklärungskraft (aus der Evidenz gelesen) × Machbarkeit × Wirkung, die drei Spalten links. Der höchste Wert ist 27, der niedrigste 1.")}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="tnum text-caption text-ink" id={`${uid}-budget`}>
        {tt(`All three together: ${euro(total)} of ${euro(BUD_W)}.`, `Alle drei zusammen: ${euro(total)} von ${euro(BUD_W)}.`)}
      </p>
      <Insight>
        {plain()}
        {tt(
          `Highest score now: “${best.name}” (${best.score}). Explanatory power is not judged: it follows from what the measure rests on. Click the grey “rests on” line to change the evidence and watch the score move. The gift boxes are easy (feasibility 3), yet score low, because nothing in the data says gifts keep customers.`,
          `Höchster Wert jetzt: „${best.name}“ (${best.score}). Die Erklärungskraft wird nicht geschätzt: Sie folgt daraus, worauf die Maßnahme ruht. Klicken Sie die graue „ruht auf“-Zeile, um die Evidenz zu ändern, und sehen Sie, wie sich der Wert bewegt. Die Geschenkboxen sind leicht (Machbarkeit 3), erzielen aber wenig, weil nichts in den Daten sagt, dass Geschenke Kunden halten.`,
        )}
      </Insight>
    </div>
  );
}
