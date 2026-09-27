"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { CalcDiagnosis } from "@/components/ui/CalcDiagnosis";
import { Field } from "@/components/ui/Field";
import { FormulaBuilder } from "@/components/ui/FormulaBuilder";
import { CheckBar, OptionList, Reading, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { LEVEL_TAGS, LEVEL_TESTS, LINES } from "@/data/ladder";
import type { LevelTag, LineId } from "@/data/ladder";
import { BASES, BASIS_LABEL, CUSTOMERS, FIGURES, FIGURE_IDS, INSIGHT_COUNT, INSIGHT_FRAME, INSIGHT_MIN, PICK, SMART } from "@/data/forecast";
import type { Basis, CustId, FigureId } from "@/data/forecast";
import { FIGURE_BUILDERS, figAnswer, figurePartFlags, partKey } from "@/lib/calcBuilder";
import { citesForecastFigure, figMatches, insightFlags, pickHolds, sortHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { IDS } from "@/lib/missing";
import { euro, num, tt } from "@/lib/lang";
import { extraInsightGuide, figureGuide, insightGuide, meaningGuide, reflectGuide } from "@/lib/mentorGuide";
import { pickKey, sortKey } from "@/lib/answerKey";
import { MIN_LINE, MIN_SENTENCE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 1.1 */

export function Block11() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeLine);
  const undo = useStore((s) => s.undoSort);
  const redo = useStore((s) => s.redoSort);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  return (
    <AnswerBlock
      id="block-1-1"
      title={tt("Block 1.1 · Data, information or insight?", "Block 1.1 · Daten, Information oder Insight?")}
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["1.1"]}
      findIt={tt("Route 1 → Task 1 → the nine lines on the sort board below, from SmartData's logs, reports and analysis notes. Answer on the sort board.", "Route 1 → Task 1 → die neun Zeilen auf der Sortiertafel unten, aus Logs, Berichten und Analysenotizen von SmartData. Antworten Sie auf der Sortiertafel.")}
    >
      <MaterialRefs refs={["A2"]} />
      <PlacementBoard<LevelTag>
        items={LINES.map((r) => ({ id: r.id, meta: r.source, text: r.text }))}
        bins={LEVEL_TAGS.map((t) => ({ id: t.id, label: t.label, hint: t.hint }))}
        value={l1.sort}
        onPlace={(id, tag) => place(id as LineId, tag)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.sortHistory.length}
        redoCount={l1.sortFuture.length}
        domId={IDS.line}
        clues={Object.fromEntries(LINES.map((r) => [r.id, r.clue]))}
        reasons={Object.fromEntries(LINES.map((r) => [r.id, r.why]))}
        result={l1.sortResult}
        checks={l1.sortChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, sortChecks: s.sortChecks + 1, sortResult: sortHolds(s.sort) }))}
        onClue={() => patch({ sortClue: true })}
        clueShown={l1.sortClue}
        reasoningOpened={l1.sortReasoning}
        onOpenReasoning={() => patch({ sortReasoning: true })}
        noun={tt("line", "Zeile")}
        intro={tt("Drag a line onto a step, or select it and then select a step. Select a placed one to move it again.", "Ziehen Sie eine Zeile auf eine Stufe, oder wählen Sie sie aus und dann eine Stufe. Wählen Sie eine platzierte Zeile, um sie zu verschieben.")}
        tests={
          <RevealHint id="sort-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("Test questions · taught in Materi A2", "Testfragen · aus Materi A2")}>
            <div className="space-y-2 text-caption text-ink">
              <p>{tt("Ask these of every line. They repeat the tests from Materi A2; they never say which line goes where.", "Stellen Sie diese Fragen zu jeder Zeile. Sie wiederholen die Tests aus Materi A2; sie sagen nie, welche Zeile wohin gehört.")}</p>
              <ul className="space-y-1.5">
                {LEVEL_TESTS.map((c) => (
                  <li key={c.name}>
                    <span className="font-semibold">{c.name}. </span>
                    <Gloss>{c.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A2"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        }
      />
      <TextBox
        id={IDS.extraInsight}
        label={tt("One insight of your own about SmartData's customers", "Ein eigener Insight über die Kunden von SmartData")}
        help={tt("Take any line of information above, or a fact from the case, and turn it into an insight: say what it means or what to do (“so …”). At least 30 characters.", "Nehmen Sie eine Informationszeile von oben oder eine Tatsache aus dem Fall und machen Sie daraus einen Insight: Sagen Sie, was es bedeutet oder was zu tun ist („also …“). Mindestens 30 Zeichen.")}
        value={l1.extraInsight}
        onChange={(v) => patch({ extraInsight: v })}
        min={MIN_LINE}
        rows={2}
      />
      {mentor && <MentorGuide guide={extraInsightGuide()} />}
      <AnswerKey block={sortKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.2 */

const row = (id: string, label: string, value: string) => (
  <tr id={id} className="border-t border-line">
    <td className="px-3 py-2">{label}</td>
    <td className="tnum px-3 py-2 text-right font-semibold">{value}</td>
  </tr>
);

export function Block12() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const setFig = (id: FigureId, v: string) => patch((s) => ({ fig: { ...s.fig, [id]: v }, figFlagged: s.figFlagged.filter((f) => f !== id), meaningFlagged: false }));
  const check = () =>
    patch((s) => {
      const figFlagged = FIGURE_IDS.filter((id) => s.fig[id].trim() !== "" && !figMatches(s.fig[id], figAnswer(id)));
      const w = s.meaning.trim();
      return { checks: s.checks + 1, figFlagged, figClue: {}, partFlags: figurePartFlags(s.parts), meaningFlagged: w !== "" && (w.length < MIN_SENTENCE || !citesForecastFigure(w)), meaningClue: false };
    });
  return (
    <AnswerBlock
      id="block-1-2"
      title={tt("Block 1.2 · A first forecast: three figures", "Block 1.2 · Eine erste Prognose: drei Werte")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["1.2"]}
      findIt={tt("Route 1 → Task 1 → the three tables “Last year”, “This quarter” and “All customers” directly below. Answer in the fields under the tables.", "Route 1 → Task 1 → die drei Tabellen „Letztes Jahr“, „Dieses Quartal“ und „Alle Kunden“ direkt darunter. Antworten Sie in den Feldern unter den Tabellen.")}
    >
      <MaterialRefs refs={["A4"]} />
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "SmartData's usage and contract records show how customers whose usage fell behaved last year, and how many show the same signal now. The numbers you need are in the tables below. Look for them first; the buttons “Show where the numbers are” and “Show the formula” are there if you get stuck. The method is taught in",
            "Die Nutzungs- und Vertragsdaten von SmartData zeigen, wie sich Kunden mit gesunkener Nutzung letztes Jahr verhielten, und wie viele jetzt dasselbe Signal zeigen. Die Zahlen stehen in den Tabellen unten. Suchen Sie sie zuerst selbst; die Schaltflächen „Zeigen, wo die Zahlen stehen“ und „Formel zeigen“ helfen, wenn Sie nicht weiterkommen. Die Methode steht in",
          )}
        </Gloss>{" "}
        <button type="button" onClick={() => scrollToAndFlash("mat-A4", "ref")} className="font-semibold text-accent underline decoration-dotted underline-offset-2">
          Materi A4
        </button>
        {tt(", on other numbers. What you practise is combining them correctly.", ", mit anderen Zahlen. Was Sie üben, ist, sie richtig zu kombinieren.")}
      </p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="relative overflow-x-auto rounded-lg border border-line md:col-span-2">
          <table className="w-full border-collapse text-caption">
            <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("Last year · SmartData's usage records (Case assumption)", "Letztes Jahr · Nutzungsdaten von SmartData (Fallannahme)")}</caption>
            <tbody>
              {row("fc-fall-customers", tt("Usage fell by 30% or more in a quarter · customers", "Nutzung in einem Quartal um 30 % oder mehr gesunken · Kunden"), num(SMART.falling.customers))}
              {row("fc-fall-left", tt("Usage fell by 30% or more · left within six months", "Nutzung um 30 % oder mehr gesunken · innerhalb von sechs Monaten gegangen"), num(SMART.falling.left))}
              {row("fc-stable-customers", tt("Usage stable or rising · customers", "Nutzung stabil oder steigend · Kunden"), num(SMART.stable.customers))}
              {row("fc-stable-left", tt("Usage stable or rising · left within six months", "Nutzung stabil oder steigend · innerhalb von sechs Monaten gegangen"), num(SMART.stable.left))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3">
          <div className="relative overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse text-caption">
              <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("This quarter", "Dieses Quartal")}</caption>
              <tbody>{row("fc-now", tt("Customers whose usage fell by 30% or more", "Kunden mit um 30 % oder mehr gesunkener Nutzung"), num(SMART.fallingNow))}</tbody>
            </table>
          </div>
          <div className="relative overflow-x-auto rounded-lg border border-line">
            <table className="w-full border-collapse text-caption">
              <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("All customers", "Alle Kunden")}</caption>
              <tbody>{row("fc-revenue", tt("Average yearly revenue per customer", "Durchschnittlicher Jahresumsatz pro Kunde"), euro(SMART.revenue))}</tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="space-y-5">
        {FIGURE_IDS.map((id) => {
          const f = FIGURES[id];
          const b = FIGURE_BUILDERS[id];
          const flagged = l1.figFlagged.includes(id);
          const partsFlagged = b.parts.some((p) => l1.partFlags.includes(partKey(id, p.id)));
          return (
            <div key={id} className="space-y-2">
              <Field
                id={IDS.figure(id)}
                htmlFor={`fig-${id}-in`}
                label={f.label}
                help={tt(`${f.question} Type the figure as a number, for example ${f.example}.`, `${f.question} Tippen Sie den Wert als Zahl, zum Beispiel ${f.example.replace(".", ",")}.`)}
                flagged={flagged}
                clue={f.clue}
                clueShown={!!l1.figClue[id]}
                onShowClue={() => patch((s) => ({ figClue: { ...s.figClue, [id]: true } }))}
              >
                <input id={`fig-${id}-in`} className="field tnum max-w-xs" inputMode="decimal" autoComplete="off" value={l1.fig[id]} onChange={(e) => setFig(id, e.target.value)} aria-invalid={flagged || undefined} />
              </Field>
              {flagged && (
                <CalcDiagnosis
                  builder={b}
                  figure={id}
                  parts={l1.parts}
                  partFlags={l1.partFlags}
                  name={tt(`your ${id}`, `Ihr ${id}`)}
                  mismatch={(r) => tt(`The parts in the formula calculator are right and give ${r}, but the figure you entered differs. Press “Use this result in ${id}” or check the entry.`, `Die Teile im Formelrechner stimmen und ergeben ${r}, aber Ihr eingetragener Wert weicht ab. Drücken Sie „Ergebnis übernehmen in ${id}“ oder prüfen Sie den Eintrag.`)}
                />
              )}
              <div className="flex flex-wrap items-start gap-2">
                <RevealHint id={`fig-${id}-where`} label={tt("Show where the numbers are", "Zeigen, wo die Zahlen stehen")} title={tt("Numbers you need · the printed rows", "Zahlen, die Sie brauchen · die gedruckten Zeilen")}>
                  <ul className="space-y-1 text-caption">
                    {f.sources.map((s) => (
                      <li key={s.label}>
                        <button type="button" onClick={() => scrollToAndFlash(s.target, "ref")} className="flex min-h-[36px] w-full flex-wrap items-baseline gap-x-2 rounded px-2 py-1 text-left hover:bg-accentSoft">
                          <span className="text-ink">{s.label}:</span>
                          <span className="tnum font-semibold text-ink">{s.value === "F1" ? l1.fig.F1.trim() || tt("your F1", "Ihr F1") : s.value}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </RevealHint>
                <RevealHint id={`fig-${id}-formula`} label={tt("Show the formula", "Formel zeigen")} title={tt(`The formula · from Materi ${f.taughtIn}`, `Die Formel · aus Materi ${f.taughtIn}`)} forceOpen={partsFlagged}>
                  <p className="text-caption text-ink">
                    <Gloss>{f.formula}</Gloss>
                  </p>
                  <FormulaBuilder
                    figure={id}
                    builder={b}
                    parts={l1.parts}
                    partFlags={l1.partFlags}
                    onPart={(k, v) => patch((s) => ({ parts: { ...s.parts, [k]: v }, partFlags: s.partFlags.filter((x) => x !== k) }))}
                    onUse={(v) => setFig(id, String(Math.round(v * 100) / 100))}
                    unit={f.unit}
                    label={id}
                    source={tt("the tables above", "den Tabellen oben")}
                  />
                </RevealHint>
              </div>
              {mentor && <MentorGuide guide={figureGuide(id)} />}
            </div>
          );
        })}
      </div>
      <TextBox
        id={IDS.meaning}
        label={tt("What does the forecast mean for SmartData?", "Was bedeutet die Prognose für SmartData?")}
        help={tt("One or two sentences. Use at least one figure from your forecast and say where SmartData should act first.", "Ein oder zwei Sätze. Nutzen Sie mindestens eine Zahl aus Ihrer Prognose und sagen Sie, wo SmartData zuerst handeln sollte.")}
        value={l1.meaning}
        onChange={(v) => patch({ meaning: v, meaningFlagged: false })}
        min={MIN_SENTENCE}
        rows={4}
        flagged={l1.meaningFlagged}
        clue={tt("Which of your figures says how much riskier falling usage is, and which says how much revenue is at stake? Quote one and say what follows.", "Welche Ihrer Zahlen sagt, wie viel riskanter sinkende Nutzung ist, und welche, wie viel Umsatz auf dem Spiel steht? Zitieren Sie eine und sagen Sie, was folgt.")}
        clueShown={l1.meaningClue}
        onShowClue={() => patch({ meaningClue: true })}
      >
        <WritingHelp
          id="meaning-help"
          steps={[
            tt("Say how much more often customers with falling usage left (your lift, or the two rates).", "Sagen Sie, wie viel häufiger Kunden mit sinkender Nutzung gingen (Ihr Lift, oder die zwei Raten)."),
            tt("Say how much yearly revenue is at risk this quarter.", "Sagen Sie, wie viel Jahresumsatz in diesem Quartal gefährdet ist."),
            tt("Finish with where SmartData should act first, and say it as an estimate.", "Schließen Sie damit, wo SmartData zuerst handeln sollte, und sagen Sie es als Schätzung."),
          ]}
          refs={[{ label: tt("Customers with falling usage now", "Kunden mit jetzt gesunkener Nutzung"), value: num(SMART.fallingNow), target: "fc-now" }]}
        />
      </TextBox>
      {mentor && <MentorGuide guide={meaningGuide()} />}
      <CheckBar onCheck={check} checkLabel={tt("Check my figures and sentence", "Meine Werte und meinen Satz prüfen")} checks={l1.checks} />
      {l1.checks > 0 && (
        <Reading>
          {l1.figFlagged.length === 0 && !l1.meaningFlagged && l1.partFlags.length === 0
            ? tt("Nothing is outlined by the last check.", "Die letzte Prüfung hat nichts markiert.")
            : tt(
                `${l1.figFlagged.length > 0 ? `${l1.figFlagged.length} figure${l1.figFlagged.length === 1 ? " is" : "s are"} outlined above. Each says what to check.` : ""}${l1.meaningFlagged ? " The sentence needs at least one of your forecast figures." : ""}${l1.partFlags.length > 0 ? " A part of the formula calculator is outlined." : ""}`,
                `${l1.figFlagged.length > 0 ? `${l1.figFlagged.length} ${l1.figFlagged.length === 1 ? "Wert ist" : "Werte sind"} oben markiert. Jeder sagt, was zu prüfen ist.` : ""}${l1.meaningFlagged ? " Der Satz braucht mindestens eine Zahl aus Ihrer Prognose." : ""}${l1.partFlags.length > 0 ? " Ein Teil des Formelrechners ist markiert." : ""}`,
              )}
        </Reading>
      )}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.3 */

export function Block13() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (k: "valuable" | "churners", id: CustId) => patch((s) => ({ [k]: s[k].includes(id) ? s[k].filter((x) => x !== id) : [...s[k], id], pickResult: null }) as Partial<typeof s>);
  const setRow = (i: number, p: Partial<{ basis: Basis | null; text: string }>) => patch((s) => ({ insights: s.insights.map((h, j) => (j === i ? { ...h, ...p } : h)), insFlagged: s.insFlagged.filter((x) => x !== i) }));
  const check = () => patch((s) => ({ checks: s.checks + 1, insChecked: true, insClue: false, insFlagged: insightFlags(s), pickResult: pickHolds(s), pickClue: false }));
  const opts = CUSTOMERS.map((c) => ({ id: c.id, label: c.name }));
  return (
    <AnswerBlock
      id="block-1-3"
      title={tt("Block 1.3 · Valuable customers, customers at risk, three insights", "Block 1.3 · Wertvolle Kunden, gefährdete Kunden, drei Insights")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["1.3"]}
      findIt={tt("Route 1 → Task 1 → the table “Eight customers” below: orders, days since the last order, services used, revenue and usage trend. Answer in the two lists and the three insight fields under it.", "Route 1 → Task 1 → die Tabelle „Acht Kunden“ unten: Bestellungen, Tage seit der letzten Bestellung, genutzte Services, Umsatz und Nutzungstrend. Antworten Sie in den zwei Listen und den drei Insight-Feldern darunter.")}
    >
      <MaterialRefs refs={["A5", "A6"]} />
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[40rem] border-collapse text-caption">
          <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("Eight customers · SmartData's order and usage data (Case assumption)", "Acht Kunden · Bestell- und Nutzungsdaten von SmartData (Fallannahme)")}</caption>
          <thead>
            <tr className="text-left text-micro uppercase text-ash">
              <th className="px-3 py-2">{tt("Customer", "Kunde")}</th>
              <th className="px-3 py-2 text-right">{tt("Orders a year", "Bestellungen pro Jahr")}</th>
              <th className="px-3 py-2 text-right">{tt("Days since last order", "Tage seit letzter Bestellung")}</th>
              <th className="px-3 py-2 text-right">{tt("Services used (of 5)", "Genutzte Services (von 5)")}</th>
              <th className="px-3 py-2 text-right">{tt("Yearly revenue", "Jahresumsatz")}</th>
              <th className="px-3 py-2 text-right">{tt("Usage vs last quarter", "Nutzung ggü. Vorquartal")}</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((c) => (
              <tr key={c.id} id={`cust-${c.id}`} className="border-t border-line">
                <td className="px-3 py-2 font-semibold">{c.name}</td>
                <td className="tnum px-3 py-2 text-right">{c.orders}</td>
                <td className="tnum px-3 py-2 text-right">{c.days}</td>
                <td className="tnum px-3 py-2 text-right">{c.services}</td>
                <td className="tnum px-3 py-2 text-right">{euro(c.revenue)}</td>
                <td className={clsx("tnum px-3 py-2 text-right", c.trend <= -30 && "font-semibold")}>{`${c.trend > 0 ? "+" : ""}${c.trend}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div id={IDS.valuable} className="space-y-1.5">
          <p className="font-semibold text-ink">{tt(`a · The ${PICK} most valuable customers to keep`, `a · Die ${PICK} wertvollsten Kunden, die es zu halten gilt`)}</p>
          <OptionList<CustId> multi label={tt("Most valuable", "Am wertvollsten")} value={l1.valuable} onChange={(id) => toggle("valuable", id)} disabledIds={l1.valuable.length >= PICK ? CUSTOMERS.map((c) => c.id) : []} onDisabledClick={() => scrollToAndFlash(IDS.valuable, "warn")} options={opts} />
          <p role="status" className="text-caption text-ash">{tt(`${l1.valuable.length} of ${PICK} chosen.`, `${l1.valuable.length} von ${PICK} gewählt.`)}</p>
        </div>
        <div id={IDS.churners} className="space-y-1.5">
          <p className="font-semibold text-ink">{tt(`b · The ${PICK} customers most likely to churn`, `b · Die ${PICK} Kunden mit dem höchsten Abwanderungsrisiko`)}</p>
          <OptionList<CustId> multi label={tt("Most likely to churn", "Höchstes Abwanderungsrisiko")} value={l1.churners} onChange={(id) => toggle("churners", id)} disabledIds={l1.churners.length >= PICK ? CUSTOMERS.map((c) => c.id) : []} onDisabledClick={() => scrollToAndFlash(IDS.churners, "warn")} options={opts} />
          <p role="status" className="text-caption text-ash">{tt(`${l1.churners.length} of ${PICK} chosen.`, `${l1.churners.length} von ${PICK} gewählt.`)}</p>
        </div>
      </div>
      {l1.pickResult && (
        <Reading>
          {tt(`${l1.pickResult.holds} of ${l1.pickResult.total} picks hold. A check never says which. `, `${l1.pickResult.holds} von ${l1.pickResult.total} Wahlen stimmen. Eine Prüfung sagt nie, welche. `)}
          {l1.pickClue ? (
            tt("Clue: is value the number of orders, or the revenue? And is a long gap a risk when usage is rising?", "Hinweis: Ist Wert die Zahl der Bestellungen oder der Umsatz? Und ist ein langer Abstand ein Risiko, wenn die Nutzung steigt?")
          ) : l1.pickResult.holds < l1.pickResult.total ? (
            <button type="button" onClick={() => patch({ pickClue: true })} className="btn-ghost btn-sm border-gold">
              {tt("Show clue", "Hinweis zeigen")}
            </button>
          ) : null}
        </Reading>
      )}
      <AnswerKey block={pickKey()} />
      <div className="space-y-3 border-t border-line pt-3">
        <p className="font-semibold text-ink">{tt("c · Three insights from the data", "c · Drei Insights aus den Daten")}</p>
        <p className="text-body text-ink">
          <Gloss>{tt("Write three insights, each resting on a different kind of data SmartData has: frequency of purchases, time between purchases, or use of services.", "Schreiben Sie drei Insights, jeder auf einer anderen Art von Daten, die SmartData hat: Häufigkeit der Käufe, Zeit zwischen den Käufen oder Nutzung der Services.")}</Gloss>
        </p>
        <p className="text-caption text-ash">
          {tt("The frame: ", "Der Rahmen: ")}
          {INSIGHT_FRAME.v}
        </p>
        {l1.insights.map((a, i) => (
          <div key={i} className="space-y-1.5">
            <TextBox
              id={IDS.insight(i)}
              label={tt(`Insight ${i + 1}`, `Insight ${i + 1}`)}
              help={tt(`Choose the data it rests on, then write the insight in one or two sentences that say what follows (“so …”), at least ${INSIGHT_MIN} characters.`, `Wählen Sie die Daten, auf denen er ruht, und schreiben Sie dann den Insight in ein oder zwei Sätzen, die sagen, was folgt („also …“), mindestens ${INSIGHT_MIN} Zeichen.`)}
              value={a.text}
              onChange={(v) => setRow(i, { text: v })}
              min={INSIGHT_MIN}
              flagged={l1.insFlagged.includes(i)}
              clue={tt(`Use the frame: ${INSIGHT_FRAME.v} Choose data no other insight uses, and finish with “so” and what it means.`, `Nutzen Sie den Rahmen: ${INSIGHT_FRAME.v} Wählen Sie Daten, die kein anderer Insight nutzt, und schließen Sie mit „also“ und dem, was es bedeutet.`)}
              clueShown={l1.insClue}
              onShowClue={() => patch({ insClue: true })}
            >
              <div>
                <label htmlFor={`insight-${i}-basis`} className="smallcaps block">
                  {tt("Data it rests on", "Daten, auf denen er ruht")}
                </label>
                <select id={`insight-${i}-basis`} className="field mt-1 max-w-md" value={a.basis ?? ""} onChange={(e) => setRow(i, { basis: (e.target.value || null) as Basis | null })}>
                  <option value="">{tt("Choose the data…", "Daten wählen…")}</option>
                  {BASES.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {a.basis && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{tt("Chosen: ", "Gewählt: ")}{BASIS_LABEL[a.basis]}</p>}
              </div>
            </TextBox>
            {mentor && <MentorGuide guide={insightGuide(i)} />}
          </div>
        ))}
      </div>
      <CheckBar onCheck={check} checkLabel={tt("Check my picks and insights", "Meine Wahl und Insights prüfen")} checks={l1.checks} />
      {l1.insChecked && (
        <Reading>
          {l1.insFlagged.length === 0
            ? tt(`Nothing is outlined among the insights. All ${INSIGHT_COUNT} rest on different data and draw a conclusion; whether they are good is for you and your facilitator to judge.`, `Bei den Insights ist nichts markiert. Alle ${INSIGHT_COUNT} ruhen auf unterschiedlichen Daten und ziehen einen Schluss; ob sie gut sind, beurteilen Sie und Ihre Moderation.`)
            : tt(`${l1.insFlagged.length} insight${l1.insFlagged.length === 1 ? " is" : "s are"} outlined: the data is missing or repeated, the text is short, or it draws no conclusion.`, `${l1.insFlagged.length} ${l1.insFlagged.length === 1 ? "Insight ist" : "Insights sind"} markiert: Die Daten fehlen oder wiederholen sich, der Text ist kurz, oder er zieht keinen Schluss.`)}
        </Reading>
      )}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 1.4 */

export function Block14() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const fields: { k: "interpret" | "causation" | "decider"; label: string; help: string }[] = [
    { k: "interpret", label: tt("Why is data worthless without interpretation?", "Warum sind Daten ohne Interpretation wertlos?"), help: tt("One or two sentences, using something you met in Blocks 1.1 to 1.3.", "Ein oder zwei Sätze, mit etwas, das Ihnen in den Blöcken 1.1 bis 1.3 begegnet ist.") },
    { k: "causation", label: tt("Where could the data mislead: correlation or causation?", "Wo könnten die Daten in die Irre führen: Korrelation oder Kausalität?"), help: tt("Name a link in SmartData's data that might not be a cause, and what assumption you would be making.", "Nennen Sie einen Zusammenhang in den Daten von SmartData, der vielleicht keine Ursache ist, und welche Annahme Sie treffen würden.") },
    { k: "decider", label: tt("How would a data-driven decision-maker proceed?", "Wie würde eine datengetriebene Entscheiderin vorgehen?"), help: tt("What would they ask first, what would they check, and when would they decide not to use the data? Be concrete.", "Was würde sie zuerst fragen, was prüfen, und wann würde sie entscheiden, die Daten nicht zu nutzen? Seien Sie konkret.") },
  ];
  return (
    <AnswerBlock
      id="block-1-4"
      title={tt("Block 1.4 · Coaching reflection: from Level 1 to Level 2", "Block 1.4 · Coaching-Reflexion: von Level 1 zu Level 2")}
      kind="JUDGED"
      minutes={BLOCK_MINUTES["1.4"]}
      findIt={tt("Route 1 → Task 1 → your own answers in Blocks 1.1 to 1.3, and the third-factor diagram in Materi A6. Answer in the three fields below.", "Route 1 → Task 1 → Ihre eigenen Antworten in den Blöcken 1.1 bis 1.3 und das Diagramm zum dritten Faktor in Materi A6. Antworten Sie in den drei Feldern unten.")}
    >
      <MaterialRefs refs={["A1", "A6"]} />
      <p className="text-body text-ink">
        <Gloss>{tt("Before you read the patterns in twelve customer records: why does data need a person to read it, where can it mislead, and how would someone who decides with data go about it?", "Bevor Sie die Muster in zwölf Kundendatensätzen lesen: Warum braucht Daten einen Menschen, der sie liest, wo können sie in die Irre führen, und wie würde jemand vorgehen, der mit Daten entscheidet?")}</Gloss>
      </p>
      {fields.map((f) => (
        <div key={f.k} className="space-y-1.5">
          <TextBox id={IDS.reflect(f.k)} label={f.label} help={f.help} value={l1.reflect[f.k]} onChange={(v) => patch((s) => ({ reflect: { ...s.reflect, [f.k]: v } }))} min={MIN_LINE} rows={3} />
          {mentor && <MentorGuide guide={reflectGuide(f.k)} />}
        </div>
      ))}
    </AnswerBlock>
  );
}
