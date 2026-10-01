"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import { Insight, Story, ThePoint, Toggles, useStory } from "@/components/materi/kit";
import { CASES_MIN, LIFT_ACT, LIFT_WATCH } from "@/data/route2";
import { bi, euro, num, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi B (Route 2). Every one uses the worked-example company Isar Hosting (a Munich hosting provider,
 * Case assumption), never SmartData. Every control is followed by an always-visible "What this shows" (CLAUDE.md #20), every picture
 * opens with "The point" and carries a three-step "Walk me through it" story that drives the real controls (CLAUDE.md #36).
 */
/** "In plain words:" leads every reading of a control (CLAUDE.md #36). */
const plain = () => tt("In plain words: ", "In einfachen Worten: ");
const C = { ink: "#1F2328", ash: "#59606A", paper: "#FFFEFA", mist: "#ECE6D6", line: "#D8D1BF", amber: "#8A5A0B", gold: "#D99A2B", teal: "#0F6B6B", tealSoft: "#DFEEEB", data: "#2F5D62", grey: "#8B9098", soft: "#FBF0D6", rust: "#A4472A" };

/* ------------------------------------------------------------------ B1 · four stages of using data */

type Stage = "report" | "dash" | "rules" | "forecast";
const STAGES: Stage[] = ["report", "dash", "rules", "forecast"];
const STAGE_TEXT = bi({
  report: { name: t("Reports after the fact", "Berichte im Nachhinein"), isar: t("A monthly list of customers who cancelled.", "Eine monatliche Liste der Kunden, die gekündigt haben."), reading: t("The data counts the loss well, once it is too late. Decisions are still made from experience.", "Die Daten zählen den Verlust gut, wenn es zu spät ist. Entscheidungen fallen weiter aus Erfahrung.") },
  dash: { name: t("Dashboards", "Dashboards"), isar: t("Usage and churn per customer group, updated weekly.", "Nutzung und Churn pro Kundengruppe, wöchentlich aktualisiert."), reading: t("Everyone can see what is happening, but each manager decides what to do with it. Two managers, two readings.", "Alle sehen, was passiert, aber jeder Manager entscheidet, was er daraus macht. Zwei Manager, zwei Lesarten.") },
  rules: { name: t("Decision rules", "Entscheidungsregeln"), isar: t("“Usage down 30% in a quarter: customer success calls within two weeks.”", "„Nutzung in einem Quartal um 30 % gesunken: Customer Success ruft innerhalb von zwei Wochen an.“"), reading: t("The same data leads to the same action, whoever is on duty. This is where data starts to change what the organisation does.", "Dieselben Daten führen zur selben Handlung, egal wer Dienst hat. Hier beginnen Daten zu ändern, was die Organisation tut.") },
  forecast: { name: t("Forecasts, checked", "Prognosen, abgeglichen"), isar: t("A forecast per group, compared every quarter with who actually left.", "Eine Prognose pro Gruppe, jedes Quartal mit den tatsächlichen Abgängen verglichen."), reading: t("The organisation learns: rules that did not predict well are changed. A data-driven organisation is one that checks itself.", "Die Organisation lernt: Regeln, die schlecht vorhersagten, werden geändert. Eine datengetriebene Organisation ist eine, die sich selbst prüft.") },
});

export function DataStages() {
  const uid = useId().replace(/:/g, "");
  const [st, setStRaw] = useState<Stage>("dash");
  const story = useStory([
    {
      title: tt("Counting the loss", "Den Verlust zählen"),
      say: tt("Isar Hosting is an example company, not your case. At stage 1 it gets a monthly list of customers who cancelled. The list is exact, and it comes too late to change anything.", "Isar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Auf Stufe 1 bekommt es monatlich eine Liste der Kunden, die gekündigt haben. Die Liste ist genau, und sie kommt zu spät, um etwas zu ändern."),
      look: tt("the lowest bar, stage 1", "den niedrigsten Balken, Stufe 1"),
      apply: () => setStRaw("report"),
    },
    {
      title: tt("Deciding by rule", "Nach Regel entscheiden"),
      say: tt("At stage 3 a written rule says: usage down 30% in a quarter, customer success calls within two weeks. The same data leads to the same action, whoever is on duty.", "Auf Stufe 3 sagt eine schriftliche Regel: Nutzung in einem Quartal um 30 % gesunken, Customer Success ruft innerhalb von zwei Wochen an. Dieselben Daten führen zur selben Handlung, egal wer Dienst hat."),
      look: tt("the third bar, stage 3", "den dritten Balken, Stufe 3"),
      apply: () => setStRaw("rules"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Data is an advantage when the whole organisation decides by rule and checks its forecasts, not when it sits in a report. Click the other stages.", "Daten sind ein Vorteil, wenn die ganze Organisation nach Regel entscheidet und ihre Prognosen prüft, nicht wenn sie in einem Bericht liegen. Klicken Sie die anderen Stufen an."),
      look: tt("the top bar, stage 4", "den obersten Balken, Stufe 4"),
      apply: () => setStRaw("forecast"),
    },
  ]);
  const setSt = (k: Stage) => {
    story.leave();
    setStRaw(k);
  };
  const idx = STAGES.indexOf(st);
  const s = STAGE_TEXT[st];
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A company is data-driven when the whole organisation decides with data, not one clever analyst: the same definitions for everyone, written rules for recurring decisions, and forecasts checked against what really happened.", "Ein Unternehmen ist datengetrieben, wenn die ganze Organisation mit Daten entscheidet, nicht eine kluge Analystin: dieselben Definitionen für alle, schriftliche Regeln für wiederkehrende Entscheidungen und Prognosen, die mit dem Eingetretenen abgeglichen werden.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Four stages of using data for customer decisions", "Vier Stufen der Datennutzung für Kundenentscheidungen")}</title>
        <desc id={`${uid}-d`}>{tt(`Stage shown: ${s.name}.`, `Gezeigte Stufe: ${s.name}.`)}</desc>
        {STAGES.map((k, i) => {
          const x = 10 + i * 137;
          const h = 40 + i * 25;
          const on = i <= idx;
          return (
            <g key={k} className="hit" role="button" tabIndex={0} aria-label={STAGE_TEXT[k].name} onClick={() => setSt(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSt(k)}>
              {story.step !== null && k === st && <rect x={x - 4} y={126 - h} width="136" height={h + 8} fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
              <rect className="hit-shape" x={x} y={130 - h} width="128" height={h} fill={k === st ? C.gold : on ? C.data : C.paper} stroke={C.ink} strokeWidth="1.4" />
              <text x={x + 64} y={146} textAnchor="middle" fontSize="11" fill={C.ash}>{`${i + 1}`}</text>
            </g>
          );
        })}
        <text x="10" y="18" fontSize="11.5" fill={C.ash}>{tt("from counting the past → to deciding by rule → to learning from forecasts", "vom Zählen der Vergangenheit → zum Entscheiden nach Regel → zum Lernen aus Prognosen")}</text>
      </svg>
      <Toggles<Stage> label={tt("Stage", "Stufe")} value={st} onChange={setSt} options={STAGES.map((k, i) => ({ id: k, label: `${i + 1} · ${STAGE_TEXT[k].name}` }))} />
      <p className="rounded-md border border-line bg-paper px-3 py-2 text-caption text-ink">
        <span className="smallcaps mr-1.5">Isar Hosting</span>
        {s.isar}
      </p>
      <Insight>
        {plain()}
        {s.reading}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B2 · decision first, then data */

type ISrc = { id: string; name: string; decision: boolean; complete: number };
const I_SRC: ISrc[] = bi([
  { id: "logs", name: t("Server usage", "Servernutzung"), decision: true, complete: 97 },
  { id: "invoices", name: t("Invoices", "Rechnungen"), decision: true, complete: 99 },
  { id: "nps", name: t("Survey scores", "Befragungswerte"), decision: true, complete: 25 },
  { id: "press", name: t("Press mentions", "Presseerwähnungen"), decision: false, complete: 70 },
  { id: "weather", name: t("Weather data", "Wetterdaten"), decision: false, complete: 100 },
]);
const useOfI = (s: ISrc) => (!s.decision ? "leave" : s.complete >= 80 ? "core" : "later");
export function SourceGrid() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState("nps");
  const story = useStory([
    {
      title: tt("Useful and complete", "Nützlich und vollständig"),
      say: tt("Isar Hosting is an example company, not your case. Its server usage informs a decision and is 97% complete. Core: use it now.", "Isar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Seine Servernutzung stützt eine Entscheidung und ist zu 97 % vollständig. Kern: jetzt nutzen."),
      look: tt("the dot in the teal area, top right", "den Punkt im türkisen Bereich oben rechts"),
      apply: () => setSelRaw("logs"),
    },
    {
      title: tt("Useful but patchy", "Nützlich, aber lückenhaft"),
      say: tt("Survey scores would inform a decision, but only 25% of customers answered. Relying on them now steers by the few who spoke. Later: fix the gaps first.", "Befragungswerte würden eine Entscheidung stützen, aber nur 25 % der Kunden antworteten. Sich jetzt darauf zu stützen, hieße, nach den wenigen zu steuern, die sich äußerten. Später: erst die Lücken schließen."),
      look: tt("the dot in the amber area, top left", "den Punkt im bernsteinfarbenen Bereich oben links"),
      apply: () => setSelRaw("nps"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Weather data is 100% complete, and no decision Isar makes would change with it. However clean, leave it out. Start from the decision, then check the quality.", "Wetterdaten sind zu 100 % vollständig, und keine Entscheidung von Isar würde sich damit ändern. Egal wie sauber: weglassen. Gehen Sie von der Entscheidung aus, prüfen Sie dann die Qualität."),
      look: tt("the dot in the grey area at the bottom", "den Punkt im grauen Bereich unten"),
      apply: () => setSelRaw("weather"),
    },
  ]);
  const setSel = (x: string) => {
    story.leave();
    setSelRaw(x);
  };
  const s = I_SRC.find((x) => x.id === sel)!;
  const u = useOfI(s);
  const pos = (x: ISrc, i: number) => ({ cx: x.complete >= 80 ? 400 + (i % 2) * 40 : 150 + (i % 2) * 40, cy: x.decision ? 60 + i * 8 : 150 + i * 6 });
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Start from the decision, not from the data. A source is relevant when it would change a decision you make, and usable now when it is complete enough to trust.", "Gehen Sie von der Entscheidung aus, nicht von den Daten. Eine Quelle ist relevant, wenn sie eine Entscheidung ändern würde, die Sie treffen, und jetzt nutzbar, wenn sie vollständig genug ist, um ihr zu trauen.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 210" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Isar Hosting's data sources by decision and completeness", "Datenquellen von Isar Hosting nach Entscheidung und Vollständigkeit")}</title>
        <desc id={`${uid}-d`}>{I_SRC.map((x) => `${x.name}: ${useOfI(x)}`).join(", ")}</desc>
        <rect x="60" y="20" width="220" height="90" fill={C.soft} stroke={C.line} />
        <rect x="280" y="20" width="240" height="90" fill={C.tealSoft} stroke={C.line} />
        <rect x="60" y="110" width="460" height="80" fill={C.mist} stroke={C.line} />
        <text x="170" y="36" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.amber}>{tt("Later: fix first", "Später: erst verbessern")}</text>
        <text x="400" y="36" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.teal}>{tt("Core: use now", "Kern: jetzt nutzen")}</text>
        <text x="290" y="184" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ash}>{tt("Leave out: no decision uses it", "Weglassen: keine Entscheidung nutzt sie")}</text>
        <text x="30" y="70" textAnchor="middle" fontSize="11" fill={C.ash} transform="rotate(-90 30 70)">{tt("decision", "Entscheidung")}</text>
        <text x="170" y="206" textAnchor="middle" fontSize="11" fill={C.ash}>{tt("< 80% complete", "< 80 % vollständig")}</text>
        <text x="400" y="206" textAnchor="middle" fontSize="11" fill={C.ash}>{tt("≥ 80% complete", "≥ 80 % vollständig")}</text>
        {I_SRC.map((x, i) => {
          const p = pos(x, i);
          const on = x.id === sel;
          return (
            <g key={x.id} className="hit" role="button" tabIndex={0} aria-label={x.name} onClick={() => setSel(x.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(x.id)}>
              {story.step !== null && on && <circle cx={p.cx} cy={p.cy} r="19" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
              <circle className="hit-shape" cx={p.cx} cy={p.cy} r={on ? 11 : 8} fill={on ? C.gold : C.paper} stroke={C.ink} strokeWidth="1.6" />
              <text x={p.cx + 14} y={p.cy + 4} fontSize="11.5" fontWeight={on ? 800 : 500} fill={C.ink}>{x.name}</text>
            </g>
          );
        })}
      </svg>
      <Toggles<string> label={tt("Source", "Quelle")} value={sel} onChange={setSel} options={I_SRC.map((x) => ({ id: x.id, label: x.name }))} />
      <Insight>
        {plain()}
        {u === "core"
          ? tt(`${s.name}: a decision uses it and it is ${s.complete}% complete. Core: use it now.`, `${s.name}: Eine Entscheidung nutzt sie, und sie ist zu ${s.complete} % vollständig. Kern: jetzt nutzen.`)
          : u === "later"
            ? tt(`${s.name}: a decision would use it, but only ${s.complete}% is complete. Relying on it now would steer by the few who answered. Later: fix the gaps first.`, `${s.name}: Eine Entscheidung würde sie nutzen, aber nur ${s.complete} % sind vollständig. Sich jetzt darauf zu stützen, hieße, nach den wenigen zu steuern, die antworteten. Später: erst die Lücken schließen.`)
            : tt(`${s.name}: ${s.complete}% complete, and no decision Isar makes would change with it. However clean, leave it out.`, `${s.name}: zu ${s.complete} % vollständig, und keine Entscheidung von Isar würde sich damit ändern. Egal wie sauber: weglassen.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B3 · four tests for an analysis component */

type ICrit = "explain" | "timely" | "reach" | "scale";
const I_CRITS: ICrit[] = ["explain", "timely", "reach", "scale"];
const I_CRIT_NAME = bi({ explain: t("Explanatory power", "Erklärungskraft"), timely: t("Timeliness", "Rechtzeitigkeit"), reach: t("Reach", "Reichweite"), scale: t("Scale", "Skalierung") });
const I_COMPS = bi([
  { id: "score", name: t("Health score with reasons", "Health Score mit Gründen"), facts: t("explains · weekly · every customer · built once", "erklärt · wöchentlich · jeder Kunde · einmal gebaut"), r: { explain: 3, timely: 3, reach: 3, scale: 3 }, note: t("High on all four: it says why, early, for everyone, at almost no extra cost per customer.", "Hoch auf allen vier: Er sagt warum, früh, für alle, fast ohne Zusatzkosten pro Kunde.") },
  { id: "survey", name: t("Yearly survey", "Jährliche Befragung"), facts: t("explains · yearly · those who answer · cost per customer", "erklärt · jährlich · wer antwortet · Kosten pro Kunde"), r: { explain: 2, timely: 1, reach: 2, scale: 2 }, note: t("It gives reasons in the customer's words, but late and only for those who answer.", "Sie liefert Gründe in den Worten des Kunden, aber spät und nur für die, die antworten.") },
  { id: "vendor", name: t("Vendor churn score", "Churn-Score eines Anbieters"), facts: t("no reasons shown · daily · every customer · licence per customer", "keine Gründe · täglich · jeder Kunde · Lizenz pro Kunde"), r: { explain: 1, timely: 3, reach: 3, scale: 2 }, note: t("Early and broad, but when it says 0.8 nobody can say why, so account managers ignore it.", "Früh und breit, aber wenn er 0,8 sagt, kann niemand sagen warum, also ignorieren ihn die Account Manager.") },
  { id: "manager", name: t("Manager's review", "Review durch Manager"), facts: t("explains · monthly · the accounts a manager knows · a person's time each time", "erklärt · monatlich · die Accounts, die ein Manager kennt · jedes Mal Personenzeit"), r: { explain: 2, timely: 2, reach: 2, scale: 1 }, note: t("Rich in context, but it covers only known accounts and costs the same time again for each one.", "Reich an Kontext, aber es deckt nur bekannte Accounts ab und kostet für jeden wieder dieselbe Zeit.") },
]);
export function CompProfile() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState("vendor");
  const story = useStory([
    {
      title: tt("High on all four", "Hoch auf allen vieren"),
      say: tt("Isar Hosting is an example company, not your case. Its health score with reasons is High on all four tests: it says why, warns early and covers everyone.", "Isar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Sein Health Score mit Gründen ist auf allen vier Tests hoch: Er sagt warum, warnt früh und deckt alle ab."),
      look: tt("all four rows full", "alle vier Zeilen voll"),
      apply: () => setSelRaw("score"),
    },
    {
      title: tt("A fact caps the rating", "Ein Fakt deckelt die Bewertung"),
      say: tt("The vendor churn score is early and covers everyone, but it shows no reasons. So explanatory power stays Low, and account managers ignore it.", "Der Churn-Score des Anbieters ist früh und deckt alle ab, zeigt aber keine Gründe. Also bleibt die Erklärungskraft niedrig, und die Account Manager ignorieren ihn."),
      look: tt("the top row, Explanatory power: Low", "die oberste Zeile, Erklärungskraft: Niedrig"),
      apply: () => setSelRaw("vendor"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Every rating is capped by a printed fact. Choose components that warn early, for everyone, with a reason. Click the other two and read their facts.", "Jede Bewertung ist durch einen gedruckten Fakt gedeckelt. Wählen Sie Bausteine, die früh warnen, für alle, mit einem Grund. Klicken Sie die anderen zwei an und lesen Sie ihre Fakten."),
      look: tt("the printed facts under the chart", "die gedruckten Fakten unter dem Diagramm"),
      apply: () => setSelRaw("survey"),
    },
  ]);
  const setSel = (x: string) => {
    story.leave();
    setSelRaw(x);
  };
  const c = I_COMPS.find((x) => x.id === sel)!;
  const total = I_CRITS.reduce((s, k) => s + c.r[k], 0);
  return (
    <div className="space-y-3">
      <ThePoint>{tt("To spot customers at risk you need tools that say why, warn early, cover every customer and do not cost more with every new customer. Few tools do all four; the printed facts show where each one falls short.", "Um gefährdete Kunden zu erkennen, brauchen Sie Werkzeuge, die sagen, warum, früh warnen, jeden Kunden abdecken und nicht mit jedem neuen Kunden teurer werden. Wenige schaffen alle vier; die gedruckten Fakten zeigen, wo jedes zu kurz greift.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("One analysis component of Isar Hosting on four tests", "Ein Analysebaustein von Isar Hosting nach vier Tests")}</title>
        <desc id={`${uid}-d`}>{I_CRITS.map((k) => `${I_CRIT_NAME[k]} ${c.r[k]}`).join(", ")}</desc>
        {story.step === 0 && <rect x="150" y="8" width="340" height="156" rx="8" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
        {story.step === 1 && <rect x="150" y="8" width="340" height="38" rx="8" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
        {I_CRITS.map((k, i) => {
          const y = 14 + i * 38;
          const v = c.r[k];
          return (
            <g key={k}>
              <text x="0" y={y + 18} fontSize="12" fill={C.ink}>{I_CRIT_NAME[k]}</text>
              {[1, 2, 3].map((b) => (
                <rect key={b} x={160 + (b - 1) * 110} y={y} width="104" height="26" fill={b <= v ? (v === 1 ? C.grey : C.data) : C.paper} stroke={C.ink} strokeDasharray={b <= v ? undefined : "4 3"} />
              ))}
              <text x="500" y={y + 18} fontSize="12.5" fontWeight="700" fill={C.ink}>{["", tt("Low", "Niedrig"), tt("Mid", "Mittel"), tt("High", "Hoch")][v]}</text>
            </g>
          );
        })}
      </svg>
      <Toggles<string> label={tt("Component", "Baustein")} value={sel} onChange={setSel} options={I_COMPS.map((x) => ({ id: x.id, label: x.name }))} />
      <p className="text-caption text-ash">
        <span className="font-semibold text-ink">{tt("Printed facts: ", "Gedruckte Fakten: ")}</span>
        {c.facts}
      </p>
      <Insight>
        {plain()}
        {tt(`${c.name}: ${total} of 12. ${c.note} Each rating is capped by a printed fact: no reasons shown caps explanatory power at Low; “after the event” or “yearly” caps timeliness at Low; “those who answer” caps reach at Mid; a person's time each time caps scale at Low.`, `${c.name}: ${total} von 12. ${c.note} Jede Bewertung ist durch einen gedruckten Fakt gedeckelt: keine Gründe deckeln die Erklärungskraft bei Niedrig; „nach dem Ereignis“ oder „jährlich“ deckeln die Rechtzeitigkeit bei Niedrig; „wer antwortet“ deckelt die Reichweite bei Mittel; jedes Mal Personenzeit deckelt die Skalierung bei Niedrig.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B4 · when to intervene: lift and cases */

export function LiftCases() {
  const uid = useId().replace(/:/g, "");
  const [lift, setLiftRaw] = useState(3.5);
  const [cases, setCasesRaw] = useState(12);
  const act = lift >= LIFT_ACT && cases >= CASES_MIN ? "intervene" : lift >= LIFT_WATCH ? "watch" : "none";
  const story = useStory([
    {
      title: tt("Strong and proven", "Stark und belegt"),
      say: tt("Isar Hosting is an example company, not your case. “No login for 30 days”: customers with it left 6 times as often, and 80 past cases show it. Intervene.", "Isar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. „30 Tage kein Login“: Kunden damit gingen 6-mal so oft, und 80 frühere Fälle zeigen es. Eingreifen."),
      look: tt("the dot in the teal area, top right", "den Punkt im türkisen Bereich oben rechts"),
      apply: () => {
        setLiftRaw(6);
        setCasesRaw(80);
      },
    },
    {
      title: tt("Strong, but few cases", "Stark, aber wenige Fälle"),
      say: tt("“Contract downgrade asked”: lift 4, but only 9 past cases. It looks strong and may be chance. Watch and gather data.", "„Vertragsherabstufung angefragt“: Lift 4, aber nur 9 frühere Fälle. Es sieht stark aus und kann Zufall sein. Beobachten und Daten sammeln."),
      look: tt("the dot in the amber area on the left", "den Punkt im bernsteinfarbenen Bereich links"),
      apply: () => {
        setLiftRaw(4);
        setCasesRaw(9);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Two numbers decide: how much more often, and how many cases. Lift 1 over many cases means no difference: no action. Move the two sliders and watch the dot.", "Zwei Zahlen entscheiden: wie viel häufiger, und wie viele Fälle. Lift 1 bei vielen Fällen heißt kein Unterschied: keine Aktion. Bewegen Sie die zwei Regler und beobachten Sie den Punkt."),
      look: tt("the dot in the grey area at the bottom", "den Punkt im grauen Bereich unten"),
      apply: () => {
        setLiftRaw(1);
        setCasesRaw(100);
      },
    },
  ]);
  const setLift = (v: number) => {
    story.leave();
    setLiftRaw(v);
  };
  const setCases = (v: number) => {
    story.leave();
    setCasesRaw(v);
  };
  const X = (c: number) => 60 + (Math.min(c, 100) / 100) * 460;
  const Y = (l: number) => 170 - (Math.min(l, 8) / 8) * 150;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("Not every warning sign deserves a call. If customers with the sign left much more often and you have seen it many times, act. If it looks strong but you have seen it only a few times, watch it. If it makes no difference, leave it.", "Nicht jedes Warnzeichen verdient einen Anruf. Gingen Kunden mit dem Zeichen viel häufiger und haben Sie es oft gesehen, handeln Sie. Sieht es stark aus, aber Sie haben es nur wenige Male gesehen, beobachten Sie es. Macht es keinen Unterschied, lassen Sie es.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 200" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Intervene, watch or no action, by lift and number of past cases", "Eingreifen, beobachten oder keine Aktion, nach Lift und Zahl früherer Fälle")}</title>
        <desc id={`${uid}-d`}>{tt(`Lift ${lift}, ${cases} cases: ${act}.`, `Lift ${lift}, ${cases} Fälle: ${act}.`)}</desc>
        <rect x={X(CASES_MIN)} y={Y(8)} width={X(100) - X(CASES_MIN)} height={Y(LIFT_ACT) - Y(8)} fill={C.tealSoft} />
        <rect x={X(0)} y={Y(8)} width={X(CASES_MIN) - X(0)} height={Y(LIFT_ACT) - Y(8)} fill={C.soft} />
        <rect x={X(0)} y={Y(LIFT_ACT)} width={X(100) - X(0)} height={Y(LIFT_WATCH) - Y(LIFT_ACT)} fill={C.soft} />
        <rect x={X(0)} y={Y(LIFT_WATCH)} width={X(100) - X(0)} height={Y(0) - Y(LIFT_WATCH)} fill={C.mist} />
        <text x={X(60)} y={Y(6.5)} textAnchor="middle" fontSize="12" fontWeight="700" fill={C.teal}>{tt("intervene", "eingreifen")}</text>
        <text x={X(9)} y={Y(6.5)} textAnchor="middle" fontSize="11" fontWeight="700" fill={C.amber}>{tt("watch", "beobachten")}</text>
        <text x={X(60)} y={Y(2.3)} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.amber}>{tt("watch and gather data", "beobachten und Daten sammeln")}</text>
        <text x={X(60)} y={Y(0.6)} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={C.ash}>{tt("no action", "keine Aktion")}</text>
        <line x1={X(0)} y1={Y(0)} x2={X(100)} y2={Y(0)} stroke={C.ash} />
        <line x1={X(0)} y1={Y(0)} x2={X(0)} y2={Y(8)} stroke={C.ash} />
        <text x={X(50)} y="196" textAnchor="middle" fontSize="11" fill={C.ash}>{tt("past cases with this signal →", "frühere Fälle mit diesem Signal →")}</text>
        <text x="16" y={Y(4)} textAnchor="middle" fontSize="11" fill={C.ash} transform={`rotate(-90 16 ${Y(4)})`}>{tt("lift →", "Lift →")}</text>
        {story.step !== null && <circle cx={X(cases)} cy={Y(lift)} r="19" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
        <circle cx={X(cases)} cy={Y(lift)} r="9" fill={C.gold} stroke={C.ink} strokeWidth="2" />
      </svg>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${uid}-lift`} className="smallcaps block">{tt(`Lift: ${num(lift)} times as often`, `Lift: ${num(lift)}-mal so oft`)}</label>
          <input id={`${uid}-lift`} type="range" min={0.5} max={8} step={0.5} value={lift} onChange={(e) => setLift(Number(e.target.value))} className="w-full accent-[#8A5A0B]" />
        </div>
        <div>
          <label htmlFor={`${uid}-cases`} className="smallcaps block">{tt(`Past cases: ${cases}`, `Frühere Fälle: ${cases}`)}</label>
          <input id={`${uid}-cases`} type="range" min={5} max={100} step={1} value={cases} onChange={(e) => setCases(Number(e.target.value))} className="w-full accent-[#8A5A0B]" />
        </div>
      </div>
      <Insight>
        {plain()}
        {act === "intervene"
          ? tt(`Lift ${num(lift)} over ${cases} past cases: strong and proven. Intervene: name who acts and how fast.`, `Lift ${num(lift)} über ${cases} frühere Fälle: stark und belegt. Eingreifen: benennen, wer handelt und wie schnell.`)
          : act === "watch"
            ? lift >= LIFT_ACT
              ? tt(`Lift ${num(lift)} looks strong, but ${cases} cases are too few to trust it (fewer than ${CASES_MIN}). Watch and gather data; the data team re-checks it next month.`, `Lift ${num(lift)} sieht stark aus, aber ${cases} Fälle sind zu wenig, um ihm zu trauen (weniger als ${CASES_MIN}). Beobachten und Daten sammeln; das Datenteam prüft es nächsten Monat neu.`)
              : tt(`Lift ${num(lift)}: a moderate difference. Worth watching, not yet worth a call to every customer.`, `Lift ${num(lift)}: ein mäßiger Unterschied. Beobachtenswert, aber noch keinen Anruf bei jedem Kunden wert.`)
            : tt(`Lift ${num(lift)}: customers with this signal leave about as often as everyone else. No action; acting would cost calls and annoy customers for nothing.`, `Lift ${num(lift)}: Kunden mit diesem Signal gehen etwa so oft wie alle anderen. Keine Aktion; Handeln würde Anrufe kosten und Kunden grundlos verärgern.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B5 · Isar's architecture over six months */

const I_ARCH = bi([
  { id: "base", name: t("Data foundation", "Datenbasis"), start: 1, owner: t("Head of Data", "Leitung Data"), trigger: t("If fewer than 97% of customers have usage and invoice data joined by month 3, the score waits and the gaps are fixed first.", "Haben bis Monat 3 weniger als 97 % der Kunden verbundene Nutzungs- und Rechnungsdaten, wartet der Score, und zuerst werden die Lücken geschlossen."), why: t("Starts first: every score and every trigger reads from it.", "Startet zuerst: Jeder Score und jeder Trigger liest daraus.") },
  { id: "score", name: t("Health score and rules", "Health Score und Regeln"), start: 2, owner: t("Head of Data", "Leitung Data"), trigger: t("If by month 5 the score had flagged fewer than 65% of the customers who cancelled, it is re-weighted.", "Hatte der Score bis Monat 5 weniger als 65 % der gekündigten Kunden vorher markiert, wird er neu gewichtet."), why: t("Starts once the foundation holds the data it needs.", "Startet, sobald die Datenbasis die nötigen Daten hält.") },
  { id: "calls", name: t("Outreach playbook", "Ansprache-Playbook"), start: 3, owner: t("Head of Customer Success", "Leitung Customer Success"), trigger: t("If fewer than 3 flagged customers a week get a call by month 4, a second caller is added.", "Bekommen bis Monat 4 weniger als 3 markierte Kunden pro Woche einen Anruf, kommt ein zweiter Anrufer dazu."), why: t("Starts when the score produces its first list.", "Startet, wenn der Score seine erste Liste liefert.") },
]);
export function ArchExample() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSelRaw] = useState("base");
  const story = useStory([
    {
      title: tt("The foundation starts first", "Die Basis startet zuerst"),
      say: tt("Isar Hosting is an example company, not your case. Its data foundation starts in month 1, because every score and every trigger reads from it.", "Isar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Seine Datenbasis startet in Monat 1, weil jeder Score und jeder Trigger daraus liest."),
      look: tt("the first row: the dark cell in month 1", "die erste Zeile: die dunkle Zelle in Monat 1"),
      apply: () => setSelRaw("base"),
    },
    {
      title: tt("One owner, one trigger", "Ein Owner, ein Trigger"),
      say: tt("The health score starts in month 2. It has one owner who can change it alone, and a trigger with a number, a month and an action.", "Der Health Score startet in Monat 2. Er hat einen Owner, der ihn allein ändern kann, und einen Trigger mit Zahl, Monat und Aktion."),
      look: tt("the box under the chart: owner and trigger", "den Kasten unter dem Diagramm: Owner und Trigger"),
      apply: () => setSelRaw("score"),
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Decide now on what you can trust, build in stages, and agree in advance which result makes you change course. Click the third row to read its trigger.", "Entscheiden Sie jetzt auf dem, dem Sie trauen können, bauen Sie in Stufen, und vereinbaren Sie vorab, bei welchem Ergebnis Sie den Kurs ändern. Klicken Sie die dritte Zeile, um ihren Trigger zu lesen."),
      look: tt("the third row: it starts when the score has a list", "die dritte Zeile: Sie startet, wenn der Score eine Liste hat"),
      apply: () => setSelRaw("calls"),
    },
  ]);
  const setSel = (x: string) => {
    story.leave();
    setSelRaw(x);
  };
  const r = I_ARCH.find((x) => x.id === sel)!;
  const X = (m: number) => 190 + (m - 1) * 60;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("You will not have clean data before you must decide. Use the sources you can trust now, build in stages, give every item one owner and a trigger, and agree in advance which result makes you change course.", "Sie werden keine sauberen Daten haben, bevor Sie entscheiden müssen. Nutzen Sie jetzt die Quellen, denen Sie trauen können, bauen Sie in Stufen, geben Sie jedem Punkt einen Owner und einen Trigger, und vereinbaren Sie vorab, bei welchem Ergebnis Sie den Kurs ändern.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Isar's three funded items by start month", "Die drei finanzierten Punkte von Isar nach Startmonat")}</title>
        <desc id={`${uid}-d`}>{I_ARCH.map((a) => `${a.name}: ${a.start}`).join(". ")}</desc>
        {[1, 2, 3, 4, 5, 6].map((m) => (
          <text key={m} x={X(m) + 30} y="14" textAnchor="middle" fontSize="11.5" fill={C.ash}>{`M${m}`}</text>
        ))}
        {I_ARCH.map((a, i) => {
          const y = 24 + i * 44;
          const on = a.id === sel;
          return (
            <g key={a.id} className="hit" role="button" tabIndex={0} aria-label={a.name} onClick={() => setSel(a.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSel(a.id)}>
              {story.step !== null && on && <rect x={X(a.start)} y={y + 2} width="62" height="32" rx="5" fill="none" stroke={C.amber} strokeWidth="2.5" strokeDasharray="5 4" className="anim-pulse" />}
              <text x="4" y={y + 22} fontSize="12" fontWeight={on ? 800 : 600} fill={C.ink}>{a.name.length > 28 ? `${a.name.slice(0, 27)}…` : a.name}</text>
              {[1, 2, 3, 4, 5, 6].map((m) => (
                <rect key={m} className={m === a.start ? "hit-shape" : undefined} x={X(m) + 2} y={y + 6} width="56" height="24" rx="3" fill={m === a.start ? C.data : m > a.start ? C.tealSoft : C.paper} stroke={on && m === a.start ? C.amber : C.line} strokeWidth={on && m === a.start ? 2.5 : 1} />
              ))}
            </g>
          );
        })}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Read one item", "Einen Punkt lesen")}</p>
        <Toggles<string> label={tt("Item", "Punkt")} value={sel} onChange={setSel} options={I_ARCH.map((a) => ({ id: a.id, label: a.name }))} />
      </div>
      <div className={clsx("rounded-lg border border-line bg-paper p-3.5 text-caption", story.step === 1 && "outline outline-2 -outline-offset-2 outline-dashed outline-[#8A5A0B] anim-pulse")} aria-live="polite">
        <p className="smallcaps">{r.name}</p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Owner. </span>
          {r.owner}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">Trigger. </span>
          <Gloss>{r.trigger}</Gloss>
        </p>
        <p className="mt-1 text-ash">{r.why}</p>
      </div>
      <Insight>
        {plain()}
        {tt(
          "The data foundation starts first, because every score and trigger reads from it. Each item has one owner who can change it alone and a trigger with a number, a month and an action. Isar left out a vendor's black-box score on purpose: a forecast nobody can explain is one nobody acts on.",
          "Die Datenbasis startet zuerst, weil jeder Score und Trigger daraus liest. Jeder Punkt hat einen Owner, der ihn allein ändern kann, und einen Trigger mit Zahl, Monat und Aktion. Isar hat den Black-Box-Score eines Anbieters bewusst weggelassen: Eine Prognose, die niemand erklären kann, ist eine, auf die niemand handelt.",
        )}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B6 · numbers you can defend (Isar Hosting) */

/** Isar Hosting's printed figures (Case assumption): different from SmartData's, so the task's numbers are never printed. */
const ISAR = { usage: 97, invoices: 99, leavers: 30, caughtByRule: 9, flagged: 39, weeksQuarter: 13, group: 25, managers: 6, itemCost: 45000, revenue: 15000, start: 2, weeks: 6, respond: 1 };
type MethodId = "weak" | "gap" | "calls" | "worth" | "majority" | "wait" | "month";
const METHODS: MethodId[] = ["weak", "gap", "calls", "worth", "majority", "wait", "month"];
const near5 = (x: number) => Math.round(x / 5) * 5;
function isarMethod(id: MethodId) {
  const base = (ISAR.caughtByRule / ISAR.leavers) * 100;
  const half = (100 - base) / 2;
  switch (id) {
    case "weak":
      return { name: tt("The weakest source", "Die schwächste Quelle"), inputs: tt(`usage logs ${ISAR.usage}% complete · invoices ${ISAR.invoices}% complete`, `Nutzungslogs ${ISAR.usage} % vollständig · Rechnungen ${ISAR.invoices} % vollständig`), steps: tt(`the lowest of ${ISAR.usage} and ${ISAR.invoices}`, `der niedrigere von ${ISAR.usage} und ${ISAR.invoices}`), result: Math.min(ISAR.usage, ISAR.invoices), unit: "%", for: tt("a trigger on a joined list", "ein Trigger auf einer verbundenen Liste"), why: tt("A joined list can only be as complete as the weakest source you join.", "Eine verbundene Liste kann nur so vollständig sein wie die schwächste Quelle, die Sie verbinden.") };
    case "gap":
      return { name: tt("Half the gap", "Die halbe Lücke"), inputs: tt(`today's usage rule alone catches ${ISAR.caughtByRule} of ${ISAR.leavers} leavers`, `die heutige Nutzungsregel allein fängt ${ISAR.caughtByRule} von ${ISAR.leavers} Abgängen`), steps: tt(`${ISAR.caughtByRule} ÷ ${ISAR.leavers} = ${num(base, { maximumFractionDigits: 0 })}% today; half of the missing ${num(100 - base, { maximumFractionDigits: 0 })} points is ${num(half, { maximumFractionDigits: 0 })}; ${num(base + half, { maximumFractionDigits: 0 })}% rounded to the nearest 5`, `${ISAR.caughtByRule} ÷ ${ISAR.leavers} = ${num(base, { maximumFractionDigits: 0 })} % heute; die Hälfte der fehlenden ${num(100 - base, { maximumFractionDigits: 0 })} Punkte sind ${num(half, { maximumFractionDigits: 0 })}; ${num(base + half, { maximumFractionDigits: 0 })} % auf die nächsten 5 gerundet`), result: near5(base + half), unit: "%", for: tt("a trigger for a new score that has to beat today", "ein Trigger für einen neuen Score, der das Heutige schlagen muss"), why: tt("A new tool that costs money should close at least half of what today's rule misses.", "Ein neues Werkzeug, das Geld kostet, sollte mindestens die Hälfte dessen schließen, was die heutige Regel verpasst.") };
    case "calls":
      return { name: tt("Calls per week", "Anrufe pro Woche"), inputs: tt(`${ISAR.flagged} customers flagged · ${ISAR.weeksQuarter} weeks in a quarter`, `${ISAR.flagged} Kunden markiert · ${ISAR.weeksQuarter} Wochen in einem Quartal`), steps: tt(`${ISAR.flagged} ÷ ${ISAR.weeksQuarter} rounded up`, `${ISAR.flagged} ÷ ${ISAR.weeksQuarter} aufgerundet`), result: Math.ceil(ISAR.flagged / ISAR.weeksQuarter), unit: tt(" a week", " pro Woche"), for: tt("a trigger on a call playbook", "ein Trigger für ein Anruf-Playbook"), why: tt("To reach everyone in the quarter, this many must be called each week.", "Um im Quartal alle zu erreichen, müssen jede Woche so viele angerufen werden.") };
    case "worth":
      return { name: tt("Customers' worth", "Wert der Kunden"), inputs: tt(`a group of ${ISAR.group} customers`, `eine Gruppe von ${ISAR.group} Kunden`), steps: tt(`one customer is 100 ÷ ${ISAR.group} = ${num(100 / ISAR.group, { maximumFractionDigits: 1 })} points; two customers are ${num((2 * 100) / ISAR.group, { maximumFractionDigits: 1 })}`, `ein Kunde sind 100 ÷ ${ISAR.group} = ${num(100 / ISAR.group, { maximumFractionDigits: 1 })} Punkte; zwei Kunden sind ${num((2 * 100) / ISAR.group, { maximumFractionDigits: 1 })}`), result: (2 * 100) / ISAR.group, unit: tt(" points", " Punkte"), for: tt("a trigger on how far a forecast may be off", "ein Trigger dafür, wie weit eine Prognose danebenliegen darf"), why: tt("A miss of one or two customers can be chance; more is a real error.", "Eine Abweichung von ein bis zwei Kunden kann Zufall sein; mehr ist ein echter Fehler.") };
    case "majority":
      return { name: tt("Two thirds", "Zwei Drittel"), inputs: tt(`${ISAR.managers} support agents`, `${ISAR.managers} Support-Mitarbeiter`), steps: tt(`${ISAR.managers} × 2 ÷ 3 rounded up`, `${ISAR.managers} × 2 ÷ 3 aufgerundet`), result: Math.ceil((ISAR.managers * 2) / 3), unit: "", for: tt("a trigger on a training: how many must act on it", "ein Trigger für eine Schulung: wie viele müssen danach handeln"), why: tt("A training has worked when a clear majority acts on it.", "Eine Schulung hat gewirkt, wenn eine klare Mehrheit danach handelt.") };
    case "wait":
      return { name: tt("The cost of waiting", "Die Kosten des Wartens"), inputs: tt(`an item costs ${euro(ISAR.itemCost)} · one customer brings ${euro(ISAR.revenue)} a year`, `ein Punkt kostet ${euro(ISAR.itemCost)} · ein Kunde bringt ${euro(ISAR.revenue)} im Jahr`), steps: tt(`${ISAR.itemCost} ÷ ${ISAR.revenue} rounded up`, `${ISAR.itemCost} ÷ ${ISAR.revenue} aufgerundet`), result: Math.ceil(ISAR.itemCost / ISAR.revenue), unit: tt(" customers", " Kunden"), for: tt("a pickup point for an item you left out", "ein Pickup Point für einen weggelassenen Punkt"), why: tt("When this many customers have left for the reason the item would fix, waiting has cost as much as the item.", "Wenn so viele Kunden aus dem Grund gegangen sind, den der Punkt beheben würde, hat das Warten so viel gekostet wie der Punkt.") };
    default:
      return { name: tt("The month", "Der Monat"), inputs: tt(`start in month ${ISAR.start} · ${ISAR.weeks} weeks to be in use · the effect shows ${ISAR.respond} month later`, `Start in Monat ${ISAR.start} · ${ISAR.weeks} Wochen bis zum Einsatz · die Wirkung zeigt sich ${ISAR.respond} Monat später`), steps: tt(`${ISAR.start} + ${Math.ceil(ISAR.weeks / 4)} (weeks ÷ 4, rounded up) + ${ISAR.respond}`, `${ISAR.start} + ${Math.ceil(ISAR.weeks / 4)} (Wochen ÷ 4, aufgerundet) + ${ISAR.respond}`), result: ISAR.start + Math.ceil(ISAR.weeks / 4) + ISAR.respond, unit: "", for: tt("the “by month” of every trigger", "das „bis Monat“ jedes Triggers"), why: tt("A trigger can only be read once the item is in use and has had time to show an effect.", "Ein Trigger lässt sich erst lesen, wenn der Punkt im Einsatz ist und Zeit hatte, zu wirken.") };
  }
}

export function NumberMethods() {
  const uid = useId().replace(/:/g, "");
  const [m, setMRaw] = useState<MethodId>("weak");
  const [guess, setGuessRaw] = useState(false);
  const story = useStory([
    {
      title: tt("A number that sounds right", "Eine Zahl, die richtig klingt"),
      say: tt(`Isar Hosting is an example company, not your case. Its trigger says “below 99% joined” because 99 sounds good. Its weakest source is ${ISAR.usage}% complete: the alarm fires on day one.`, `Isar Hosting ist ein Beispielunternehmen, nicht Ihr Fall. Sein Trigger sagt „unter 99 % verbunden“, weil 99 gut klingt. Seine schwächste Quelle ist zu ${ISAR.usage} % vollständig: Der Alarm schlägt am ersten Tag an.`),
      look: tt("the bar of the usage logs: it never reaches the red line", "den Balken der Nutzungslogs: Er erreicht die Linie nie"),
      apply: () => {
        setMRaw("weak");
        setGuessRaw(true);
      },
    },
    {
      title: tt("A number you can find", "Eine Zahl, die Sie finden können"),
      say: tt(`Isar takes the weakest source: ${ISAR.usage}. Now the alarm means something: below ${ISAR.usage}, the join is losing customers. Anyone can see where the number comes from.`, `Isar nimmt die schwächste Quelle: ${ISAR.usage}. Jetzt bedeutet der Alarm etwas: Unter ${ISAR.usage} verliert der Abgleich Kunden. Jeder sieht, woher die Zahl kommt.`),
      look: tt("the line now sits exactly on the weakest bar", "die Linie liegt jetzt genau auf dem schwächsten Balken"),
      apply: () => {
        setMRaw("weak");
        setGuessRaw(false);
      },
    },
    {
      title: tt("The point", "Das Wichtigste"),
      say: tt("Every trigger number comes from printed figures and a method you can say aloud. A board can ask “where does it come from?”, and you can answer. Click the other methods.", "Jede Zahl eines Triggers kommt aus gedruckten Zahlen und einer Methode, die Sie laut sagen können. Ein Vorstand kann fragen „woher kommt sie?“, und Sie können antworten. Klicken Sie die anderen Methoden an."),
      look: tt("the method buttons", "die Methoden-Schaltflächen"),
      apply: () => {
        setMRaw("gap");
        setGuessRaw(false);
      },
    },
  ]);
  const setM = (x: MethodId) => {
    story.leave();
    setMRaw(x);
    setGuessRaw(false);
  };
  const toggleGuess = () => {
    story.leave();
    setMRaw("weak");
    setGuessRaw((g) => !g);
  };
  const d = isarMethod(m);
  const threshold = m === "weak" ? (guess ? 99 : d.result) : null;
  const X = (p: number) => 70 + ((p - 90) / 10) * 380;
  return (
    <div className="space-y-3">
      <ThePoint>{tt("A trigger number is never a guess. It is found from figures that are printed, by a method you can say in one sentence. Then anyone can check where it comes from, and you can say why it is that number.", "Die Zahl eines Triggers ist nie geraten. Sie wird aus gedruckten Zahlen gefunden, mit einer Methode, die Sie in einem Satz sagen können. Dann kann jeder prüfen, woher sie kommt, und Sie können sagen, warum es genau diese Zahl ist.")}</ThePoint>
      <Story steps={story.plan} step={story.step} onStep={story.go} />
      <svg viewBox="0 0 560 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Isar Hosting: two data sources and the threshold of a trigger", "Isar Hosting: zwei Datenquellen und die Schwelle eines Triggers")}</title>
        <desc id={`${uid}-d`}>{tt(`Usage logs ${ISAR.usage}%, invoices ${ISAR.invoices}%. Method shown: ${d.name}.`, `Nutzungslogs ${ISAR.usage} %, Rechnungen ${ISAR.invoices} %. Gezeigte Methode: ${d.name}.`)}</desc>
        <text x="0" y="36" fontSize="12" fill={C.ink}>{tt("Usage logs", "Nutzungslogs")}</text>
        <rect x="70" y="20" width={X(ISAR.usage) - 70} height="26" fill={C.data} stroke={C.ink} />
        <text x={X(ISAR.usage) + 6} y="38" fontSize="12.5" fontWeight="700" fill={C.ink}>{`${ISAR.usage}%`}</text>
        <text x="0" y="86" fontSize="12" fill={C.ink}>{tt("Invoices", "Rechnungen")}</text>
        <rect x="70" y="70" width={X(ISAR.invoices) - 70} height="26" fill={C.data} stroke={C.ink} />
        <text x={X(ISAR.invoices) + 6} y="88" fontSize="12.5" fontWeight="700" fill={C.ink}>{`${ISAR.invoices}%`}</text>
        {threshold !== null && (
          <g>
            {story.step !== null && <rect x={X(threshold) - 9} y="8" width="18" height="98" rx="6" fill="none" stroke={C.amber} strokeWidth="2" strokeDasharray="5 4" className="anim-pulse" />}
            <line x1={X(threshold)} y1="12" x2={X(threshold)} y2="104" stroke={guess ? C.rust : C.amber} strokeWidth="2.5" strokeDasharray="5 4" />
            <text x={X(threshold)} y="122" textAnchor="middle" fontSize="11.5" fontWeight="700" fill={guess ? C.rust : C.amber}>{tt(`threshold ${threshold}%`, `Schwelle ${threshold} %`)}</text>
            <text x="70" y="144" fontSize="11" fill={C.ash}>{guess ? tt("a joined list can never exceed its weakest source: the alarm is always on", "eine verbundene Liste kann nie über ihre schwächste Quelle kommen: Der Alarm ist immer an") : tt("the weakest source sets the most a joined list can reach", "die schwächste Quelle bestimmt das Höchste, was eine verbundene Liste erreichen kann")}</text>
          </g>
        )}
        {threshold === null && <text x="70" y="130" fontSize="11.5" fill={C.ash}>{tt("Choose “The weakest source” to see a threshold on the bars.", "Wählen Sie „Die schwächste Quelle“, um eine Schwelle auf den Balken zu sehen.")}</text>}
      </svg>
      <div className="space-y-1.5">
        <p className="smallcaps">{tt("Seven ways to find a number", "Sieben Wege, eine Zahl zu finden")}</p>
        <Toggles<MethodId> label={tt("Method", "Methode")} value={m} onChange={setM} options={METHODS.map((x) => ({ id: x, label: isarMethod(x).name }))} />
        <Toggles<string> label={tt("A guess instead", "Stattdessen geraten")} value={guess ? "on" : null} onChange={toggleGuess} options={[{ id: "on", label: guess ? tt("Back to the found number", "Zurück zur gefundenen Zahl") : tt("Try a guess: 99%", "Eine Schätzung probieren: 99 %") }]} />
      </div>
      <div className={clsx("rounded-lg border border-line bg-paper p-3.5 text-caption")} aria-live="polite">
        <p className="smallcaps">{d.name}</p>
        <p className="mt-1">
          <span className="font-semibold text-ink">{tt("Isar's printed figures. ", "Gedruckte Zahlen von Isar. ")}</span>
          {d.inputs}
        </p>
        <p className="mt-1">
          <span className="font-semibold text-ink">{tt("The steps. ", "Die Schritte. ")}</span>
          {d.steps}
        </p>
        <p className="mt-1 tnum">
          <span className="font-semibold text-ink">{tt("The number. ", "Die Zahl. ")}</span>
          <strong>{`${num(d.result, { maximumFractionDigits: 1 })}${d.unit}`}</strong> · {d.for}
        </p>
      </div>
      <Insight>
        {plain()}
        {guess
          ? tt(`A guess of 99% sounds careful, but Isar's usage logs are only ${ISAR.usage}% complete. A threshold the data can never reach fires every time and teaches the team to ignore it.`, `Eine Schätzung von 99 % klingt sorgfältig, aber Isars Nutzungslogs sind nur zu ${ISAR.usage} % vollständig. Eine Schwelle, die die Daten nie erreichen können, schlägt jedes Mal an und lehrt das Team, sie zu ignorieren.`)
          : tt(`${d.name}: ${d.why} The number is ${num(d.result, { maximumFractionDigits: 1 })}${d.unit}, found from printed figures. Your own number will differ because your figures differ; the method stays.`, `${d.name}: ${d.why} Die Zahl ist ${num(d.result, { maximumFractionDigits: 1 })}${d.unit}, gefunden aus gedruckten Zahlen. Ihre eigene Zahl wird anders sein, weil Ihre Zahlen anders sind; die Methode bleibt.`)}
      </Insight>
    </div>
  );
}
