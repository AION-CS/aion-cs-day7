"use client";

import { useId, useState } from "react";
import { Insight, Toggles } from "@/components/materi/kit";
import { CASES_MIN, LIFT_ACT, LIFT_WATCH } from "@/data/route2";
import { bi, num, t, tt } from "@/lib/lang";
import { Gloss } from "@/lib/glossify";

/**
 * The interactive diagrams of Materi B (Route 2). Every one uses the worked-example company Isar Hosting (a Munich hosting provider,
 * Case assumption), never SmartData. Every control is followed by an always-visible "What this shows" (CLAUDE.md #20).
 */
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
  const [st, setSt] = useState<Stage>("dash");
  const idx = STAGES.indexOf(st);
  const s = STAGE_TEXT[st];
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("Four stages of using data for customer decisions", "Vier Stufen der Datennutzung für Kundenentscheidungen")}</title>
        <desc id={`${uid}-d`}>{tt(`Stage shown: ${s.name}.`, `Gezeigte Stufe: ${s.name}.`)}</desc>
        {STAGES.map((k, i) => {
          const x = 10 + i * 137;
          const h = 40 + i * 25;
          const on = i <= idx;
          return (
            <g key={k} className="hit" role="button" tabIndex={0} aria-label={STAGE_TEXT[k].name} onClick={() => setSt(k)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSt(k)}>
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
      <Insight>{s.reading}</Insight>
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
  const [sel, setSel] = useState("nps");
  const s = I_SRC.find((x) => x.id === sel)!;
  const u = useOfI(s);
  const pos = (x: ISrc, i: number) => ({ cx: x.complete >= 80 ? 400 + (i % 2) * 40 : 150 + (i % 2) * 40, cy: x.decision ? 60 + i * 8 : 150 + i * 6 });
  return (
    <div className="space-y-3">
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
              <circle className="hit-shape" cx={p.cx} cy={p.cy} r={on ? 11 : 8} fill={on ? C.gold : C.paper} stroke={C.ink} strokeWidth="1.6" />
              <text x={p.cx + 14} y={p.cy + 4} fontSize="11.5" fontWeight={on ? 800 : 500} fill={C.ink}>{x.name}</text>
            </g>
          );
        })}
      </svg>
      <Toggles<string> label={tt("Source", "Quelle")} value={sel} onChange={setSel} options={I_SRC.map((x) => ({ id: x.id, label: x.name }))} />
      <Insight>
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
  const [sel, setSel] = useState("vendor");
  const c = I_COMPS.find((x) => x.id === sel)!;
  const total = I_CRITS.reduce((s, k) => s + c.r[k], 0);
  return (
    <div className="space-y-3">
      <svg viewBox="0 0 560 170" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
        <title id={`${uid}-t`}>{tt("One analysis component of Isar Hosting on four tests", "Ein Analysebaustein von Isar Hosting nach vier Tests")}</title>
        <desc id={`${uid}-d`}>{I_CRITS.map((k) => `${I_CRIT_NAME[k]} ${c.r[k]}`).join(", ")}</desc>
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
        {tt(`${c.name}: ${total} of 12. ${c.note} Each rating is capped by a printed fact: no reasons shown caps explanatory power at Low; “after the event” or “yearly” caps timeliness at Low; “those who answer” caps reach at Mid; a person's time each time caps scale at Low.`, `${c.name}: ${total} von 12. ${c.note} Jede Bewertung ist durch einen gedruckten Fakt gedeckelt: keine Gründe deckeln die Erklärungskraft bei Niedrig; „nach dem Ereignis“ oder „jährlich“ deckeln die Rechtzeitigkeit bei Niedrig; „wer antwortet“ deckelt die Reichweite bei Mittel; jedes Mal Personenzeit deckelt die Skalierung bei Niedrig.`)}
      </Insight>
    </div>
  );
}

/* ------------------------------------------------------------------ B4 · when to intervene: lift and cases */

export function LiftCases() {
  const uid = useId().replace(/:/g, "");
  const [lift, setLift] = useState(3.5);
  const [cases, setCases] = useState(12);
  const act = lift >= LIFT_ACT && cases >= CASES_MIN ? "intervene" : lift >= LIFT_WATCH ? "watch" : "none";
  const X = (c: number) => 60 + (Math.min(c, 100) / 100) * 460;
  const Y = (l: number) => 170 - (Math.min(l, 8) / 8) * 150;
  return (
    <div className="space-y-3">
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
  { id: "base", name: t("Data foundation", "Datenbasis"), start: 1, owner: t("Head of Data", "Leitung Data"), trigger: t("If fewer than 90% of customers are joined across usage and invoices by month 2, the score waits.", "Sind bis Monat 2 weniger als 90 % der Kunden über Nutzung und Rechnungen verbunden, wartet der Score."), why: t("Starts first: every score and every trigger reads from it.", "Startet zuerst: Jeder Score und jeder Trigger liest daraus.") },
  { id: "score", name: t("Health score and rules", "Health Score und Regeln"), start: 2, owner: t("Head of Data", "Leitung Data"), trigger: t("If it flags fewer than 60% of cancellations in months 3 and 4, it is re-weighted in month 5.", "Markiert er in Monat 3 und 4 weniger als 60 % der Kündigungen, wird er in Monat 5 neu gewichtet."), why: t("Starts once the foundation holds the data it needs.", "Startet, sobald die Datenbasis die nötigen Daten hält.") },
  { id: "calls", name: t("Outreach playbook", "Ansprache-Playbook"), start: 3, owner: t("Head of Customer Success", "Leitung Customer Success"), trigger: t("If fewer than 80% of flagged customers are called within two weeks by month 4, a second caller is added.", "Werden bis Monat 4 weniger als 80 % der markierten Kunden innerhalb von zwei Wochen angerufen, kommt ein zweiter Anrufer dazu."), why: t("Starts when the score produces its first list.", "Startet, wenn der Score seine erste Liste liefert.") },
]);
export function ArchExample() {
  const uid = useId().replace(/:/g, "");
  const [sel, setSel] = useState("base");
  const r = I_ARCH.find((x) => x.id === sel)!;
  const X = (m: number) => 190 + (m - 1) * 60;
  return (
    <div className="space-y-3">
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
      <div className="rounded-lg border border-line bg-paper p-3.5 text-caption" aria-live="polite">
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
        {tt(
          "The data foundation starts first, because every score and trigger reads from it. Each item has one owner who can change it alone and a trigger with a number, a date and an action. Isar left out a vendor's black-box score on purpose: a forecast nobody can explain is one nobody acts on.",
          "Die Datenbasis startet zuerst, weil jeder Score und Trigger daraus liest. Jeder Punkt hat einen Owner, der ihn allein ändern kann, und einen Trigger mit Zahl, Datum und Aktion. Isar hat den Black-Box-Score eines Anbieters bewusst weggelassen: Eine Prognose, die niemand erklären kann, ist eine, auf die niemand handelt.",
        )}
      </Insight>
    </div>
  );
}
