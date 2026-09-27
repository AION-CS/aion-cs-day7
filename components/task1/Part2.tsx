"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { PlacementBoard } from "@/components/ui/PlacementBoard";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import { MEANINGS, OUTCOME_LABEL, PATTERNS, PATTERN_IDS, PATTERN_PAIR_TESTS, PMEASURES, RECORDS, RISK_GLYPH, RISK_LABEL, RISK_RULE, UNCERTAINTIES } from "@/data/patterns";
import type { MeaningId, PatternId, PMeasureId, RecId, Risk, UncId } from "@/data/patterns";
import { BUDGET, CHOOSE, EVIDENCE_LABEL, EXPLAIN_RULE, MEASURES, MEASURE_BY_ID, MONTHS } from "@/data/measures";
import type { MeasureId } from "@/data/measures";
import { aimsHold, allTagged, coverage, expHolds, measureScore, measureScored, orderInversions, rowChecks, tagHolds, tallyOf, totalCost, uncHolds } from "@/lib/checks";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { measureKey, orderKey, rowKey, tagKey, uncKey } from "@/lib/answerKey";
import { misreadGuide, scoreGuide, whyGuide } from "@/lib/mentorGuide";
import { MIN_LINE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

/* ------------------------------------------------------------------ Block 2.1 */

export function Block21() {
  const l1 = useStore((s) => s.l1);
  const place = useStore((s) => s.placeTag);
  const undo = useStore((s) => s.undoTags);
  const redo = useStore((s) => s.redoTags);
  const patch = useStore((s) => s.patchL1);
  return (
    <AnswerBlock
      id="block-2-1"
      title={tt("Block 2.1 · Tag the twelve customer records with a pattern", "Block 2.1 · Die zwölf Kundendatensätze einem Muster zuordnen")}
      kind="OBJECTIVE"
      minutes={BLOCK_MINUTES["2.1"]}
      findIt={tt("Route 1 → Task 1 → the twelve records on the board below, from last year's customers, each with what happened next. Find the phrase that decides each one and answer on the board.", "Route 1 → Task 1 → die zwölf Datensätze auf der Tafel unten, von Kunden des letzten Jahres, jeder mit dem, was danach geschah. Finden Sie die Wendung, die jeden entscheidet, und antworten Sie auf der Tafel.")}
    >
      <MaterialRefs refs={["A5"]} />
      <PlacementBoard<PatternId>
        items={RECORDS.map((r) => ({ id: r.id, meta: `${r.code} · ${OUTCOME_LABEL[r.outcome]}`, text: r.text }))}
        bins={PATTERN_IDS.map((p) => ({ id: p, label: PATTERNS[p].label, hint: PATTERNS[p].means }))}
        binCols={2}
        value={l1.tags}
        onPlace={(id, s) => place(id as RecId, s)}
        onUndo={undo}
        onRedo={redo}
        undoCount={l1.tagHistory.length}
        redoCount={l1.tagFuture.length}
        domId={IDS.rec}
        clues={Object.fromEntries(RECORDS.map((o) => [o.id, o.clue]))}
        reasons={Object.fromEntries(RECORDS.map((o) => [o.id, o.why]))}
        result={l1.tagResult}
        checks={l1.tagChecks}
        onCheck={() => patch((s) => ({ checks: s.checks + 1, tagChecks: s.tagChecks + 1, tagResult: tagHolds(s.tags) }))}
        onClue={() => patch({ tagClue: true })}
        clueShown={l1.tagClue}
        reasoningOpened={l1.tagReasoning}
        onOpenReasoning={() => patch({ tagReasoning: true })}
        noun={tt("record", "Datensatz")}
        checkLabel={tt("Check my tags", "Meine Zuordnung prüfen")}
        intro={tt("Drag a record into a pattern, or select it and then select a pattern. Tag the behaviour, not the outcome. One pattern per record.", "Ziehen Sie einen Datensatz in ein Muster, oder wählen Sie ihn aus und dann ein Muster. Ordnen Sie das Verhalten zu, nicht das Ergebnis. Ein Muster pro Datensatz.")}
        tests={
          <RevealHint id="tag-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("Test questions · taught in Materi A5", "Testfragen · aus Materi A5")}>
            <div className="space-y-2 text-caption text-ink">
              <ul className="space-y-1.5">
                {PATTERN_IDS.map((p) => (
                  <li key={p}>
                    <span className="font-semibold">{PATTERNS[p].label}. </span>
                    <Gloss>{PATTERNS[p].test}</Gloss>
                  </li>
                ))}
              </ul>
              <p className="smallcaps text-ash">{tt("When two patterns seem to fit", "Wenn zwei Muster zu passen scheinen")}</p>
              <ul className="space-y-1.5">
                {PATTERN_PAIR_TESTS.map((x) => (
                  <li key={x.pair}>
                    <span className="font-semibold">{x.pair} </span>
                    <Gloss>{x.test}</Gloss>
                  </li>
                ))}
              </ul>
              <MaterialRefs refs={["A5"]} lead={tt("Taught in", "Gelehrt in")} />
            </div>
          </RevealHint>
        }
      />
      <AnswerKey block={tagKey()} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.2 */

const RISKS: Risk[] = ["high", "mid", "low"];

export function Block22() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const tally = tallyOf(l1.tags);
  const complete = allTagged(l1.tags);
  const toggleUnc = (id: UncId) => patch((s) => ({ unc: s.unc.includes(id) ? s.unc.filter((x) => x !== id) : [...s.unc, id], uncResult: null }));
  const setRow = (p: PatternId, v: Partial<{ risk: Risk | null; meaning: MeaningId | null; measure: PMeasureId | null }>) =>
    patch((s) => ({ rows: { ...s.rows, [p]: { ...s.rows[p], ...v } }, rowResult: null, rowFlags: s.rowFlags.filter((f) => !Object.keys(v).some((k) => f === `${p}.${k}`)) }));
  const check = () =>
    patch((s) => {
      const r = rowChecks(s);
      return { checks: s.checks + 1, rowResult: { holds: r.holds, total: r.total }, rowFlags: r.flags, rowClue: false };
    });
  return (
    <AnswerBlock
      id="block-2-2"
      title={tt("Block 2.2 · What each pattern says, how risky it is, and what to do", "Block 2.2 · Was jedes Muster sagt, wie riskant es ist, und was zu tun ist")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.2"]}
      findIt={tt("Route 1 → Task 1 → “Your tally” below (from your own tags in Block 2.1) and the rules in Materi A6. Answer in the four pattern rows and the fields under them.", "Route 1 → Task 1 → „Ihre Auszählung“ unten (aus Ihren eigenen Zuordnungen in Block 2.1) und die Regeln in Materi A6. Antworten Sie in den vier Musterzeilen und den Feldern darunter.")}
    >
      <MaterialRefs refs={["A3", "A6"]} />
      <div id="tally-panel" className="space-y-2 rounded-lg border border-line bg-mist/50 p-3">
        <p className="smallcaps">{tt("Your tally · from your tags in Block 2.1", "Ihre Auszählung · aus Ihren Zuordnungen in Block 2.1")}</p>
        {!complete && (
          <p className="text-caption text-ash">
            {tt(`${tally.tagged} of 12 records are tagged. `, `${tally.tagged} von 12 Datensätzen sind zugeordnet. `)}
            <button type="button" onClick={() => scrollToAndFlash("block-2-1", "ref", "start")} className="font-semibold text-ink underline decoration-dotted underline-offset-2">
              {tt("Go to Block 2.1", "Zu Block 2.1")}
            </button>
            {tt(". Nothing is blocked.", ". Nichts ist gesperrt.")}
          </p>
        )}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[22rem] border-collapse text-caption">
            <caption className="sr-only">{tt("Records and leavers per pattern", "Datensätze und Abgänge pro Muster")}</caption>
            <thead>
              <tr className="text-left text-micro uppercase text-ash">
                <th className="py-1 pr-2">{tt("Pattern", "Muster")}</th>
                <th className="py-1 pr-2 text-right">{tt("Records", "Datensätze")}</th>
                <th className="py-1 pr-2 text-right">{tt("Of those, left", "Davon gegangen")}</th>
              </tr>
            </thead>
            <tbody>
              {PATTERN_IDS.map((p) => (
                <tr key={p} className="border-t border-line">
                  <td className="py-1 pr-2 font-semibold">{PATTERNS[p].label}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.count[p]}</td>
                  <td className="tnum py-1 pr-2 text-right">{tally.left[p]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-caption text-ash">{RISK_RULE.v}</p>
      </div>

      {PATTERN_IDS.map((p) => {
        const r = l1.rows[p];
        const fl = (k: string) => l1.rowFlags.includes(`${p}.${k}`);
        const any = fl("risk") || fl("meaning") || fl("measure");
        return (
          <div key={p} id={IDS.row(p)} className={clsx("space-y-3 rounded-lg border border-line bg-paper p-3.5", any && "is-flagged")}>
            <p className="font-semibold text-ink">
              {PATTERNS[p].label} <span className="font-normal text-ash">· {tt(`your tally: ${tally.count[p]} records, ${tally.left[p]} left`, `Ihre Auszählung: ${tally.count[p]} Datensätze, ${tally.left[p]} gegangen`)}</span>
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="smallcaps">{tt("Churn risk (from your tally)", "Abwanderungsrisiko (aus Ihrer Auszählung)")}</p>
                <OptionList<Risk> label={tt(`Churn risk of ${PATTERNS[p].label}`, `Abwanderungsrisiko von ${PATTERNS[p].label}`)} value={r.risk} onChange={(v) => setRow(p, { risk: v })} options={RISKS.map((x) => ({ id: x, label: `${RISK_GLYPH[x]} ${RISK_LABEL[x]}` }))} />
                {fl("risk") && <p className="mt-1 text-caption text-ink"><span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>{tt("Read your own tally for this pattern against the rule under it: what share of its records left?", "Lesen Sie Ihre eigene Auszählung für dieses Muster gegen die Regel darunter: Welcher Anteil seiner Datensätze ging?")}</p>}
              </div>
              <div>
                <label htmlFor={`meaning-${p}`} className="smallcaps block">
                  {tt("What it says about the customer", "Was es über den Kunden sagt")}
                </label>
                <select id={`meaning-${p}`} className="field mt-1" value={r.meaning ?? ""} onChange={(e) => setRow(p, { meaning: (e.target.value || null) as MeaningId | null })}>
                  <option value="">{tt("Choose…", "Wählen…")}</option>
                  {MEANINGS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {fl("meaning") && <p className="mt-1 text-caption text-ink"><span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>{tt("Ask the pattern's test question from Materi A5: what has happened to this customer's use, and since when?", "Stellen Sie die Testfrage des Musters aus Materi A5: Was ist mit der Nutzung dieses Kunden passiert, und seit wann?")}</p>}
              </div>
            </div>
            <div>
              <p className="smallcaps">{tt("One measure for this pattern", "Eine Maßnahme für dieses Muster")}</p>
              <OptionList<PMeasureId> label={tt(`Measure for ${PATTERNS[p].label}`, `Maßnahme für ${PATTERNS[p].label}`)} value={r.measure} onChange={(v) => setRow(p, { measure: v })} options={PMEASURES.map((x) => ({ id: x.id, label: x.label }))} />
              {fl("measure") && <p className="mt-1 text-caption text-ink"><span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>{tt("Which measure answers what this pattern says about the customer? A measure that suits every pattern suits none.", "Welche Maßnahme beantwortet, was dieses Muster über den Kunden sagt? Eine Maßnahme, die zu jedem Muster passt, passt zu keinem.")}</p>}
            </div>
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my pattern rows", "Meine Musterzeilen prüfen")} checks={l1.checks} />
      {l1.rowResult && (
        <Reading>
          {tt(`${l1.rowResult.holds} of ${l1.rowResult.total} settings hold (risk against your own tally, meaning and measure for each pattern). Rows with a setting that does not hold are outlined; each outlined part has a clue.`, `${l1.rowResult.holds} von ${l1.rowResult.total} Einstellungen stimmen (Risiko gegen Ihre eigene Auszählung, Bedeutung und Maßnahme für jedes Muster). Zeilen mit einer nicht stimmenden Einstellung sind markiert; jeder markierte Teil hat einen Hinweis.`)}
        </Reading>
      )}
      <AnswerKey block={rowKey()} />

      <div id={IDS.unc} className="space-y-2 border-t border-line pt-3">
        <p className="font-semibold text-ink">{tt("Which uncertainties sit in this forecast?", "Welche Unsicherheiten stecken in dieser Prognose?")}</p>
        <p className="text-caption text-ash">{tt("Choose two or more that are real uncertainties of SmartData's pattern forecast.", "Wählen Sie zwei oder mehr, die echte Unsicherheiten der Musterprognose von SmartData sind.")}</p>
        <OptionList<UncId> multi label={tt("Uncertainties", "Unsicherheiten")} options={UNCERTAINTIES.map((w) => ({ id: w.id, label: w.label }))} value={l1.unc} onChange={toggleUnc} />
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => patch((s) => ({ checks: s.checks + 1, uncResult: uncHolds(s.unc) }))} className="btn-ghost btn-sm">
            {tt("Check my choices", "Meine Auswahl prüfen")}
          </button>
          {l1.uncResult && (
            <span role="status" className="text-caption text-ink">
              {l1.uncResult.chosen === 0 ? tt("Nothing chosen yet.", "Noch nichts gewählt.") : tt(`${l1.uncResult.holds} of ${l1.uncResult.chosen} chosen are real uncertainties. The others are beliefs about data that Materi A3 and A6 show to be wrong.`, `${l1.uncResult.holds} von ${l1.uncResult.chosen} gewählten sind echte Unsicherheiten. Die anderen sind Annahmen über Daten, die Materi A3 und A6 als falsch zeigen.`)}
            </span>
          )}
        </div>
        <AnswerKey block={uncKey()} />
      </div>
      <TextBox
        id={IDS.misread}
        label={tt("A pattern you could misread, and the sign you would see", "Ein Muster, das Sie falsch lesen könnten, und das Anzeichen, das Sie sehen würden")}
        help={tt(`Name one pattern SmartData could mistake for another, what would happen, and what in the data would show it. At least ${MIN_LINE} characters.`, `Nennen Sie ein Muster, das SmartData mit einem anderen verwechseln könnte, was passieren würde und was in den Daten es zeigen würde. Mindestens ${MIN_LINE} Zeichen.`)}
        value={l1.misread}
        onChange={(v) => patch({ misread: v })}
        min={MIN_LINE}
        rows={3}
      />
      {mentor && <MentorGuide guide={misreadGuide()} />}
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 2.3 */

export function Block23() {
  const l1 = useStore((s) => s.l1);
  const patch = useStore((s) => s.patchL1);
  const mentor = useStore((s) => s.mentorUnlocked);
  const chosen = l1.chosen;
  const cost = totalCost(chosen);
  const cov = coverage(l1);
  const shown = l1.order.length === chosen.length && chosen.every((id) => l1.order.includes(id)) ? l1.order : chosen;
  const inv = orderInversions({ ...l1, order: shown });
  const toggle = (id: MeasureId) =>
    patch((s) => {
      const next = s.chosen.includes(id) ? s.chosen.filter((x) => x !== id) : [...s.chosen, id];
      return { chosen: next, order: s.order.filter((x) => next.includes(x)), measureFlags: [] };
    });
  const setAims = (id: MeasureId, aims: PatternId[]) => patch((s) => ({ aims: { ...s.aims, [id]: aims }, measureFlags: s.measureFlags.filter((f) => f !== `${id}.aims`) }));
  const setScore = (k: "exp" | "fea" | "eff", id: MeasureId, v: Score) => patch((s) => ({ [k]: { ...s[k], [id]: v }, measureFlags: k === "exp" ? s.measureFlags.filter((f) => f !== `${id}.exp`) : s.measureFlags }) as Partial<typeof s>);
  const move = (id: MeasureId, d: -1 | 1) => {
    const list = [...shown];
    const i = list.indexOf(id);
    const j = i + d;
    if (j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    patch({ order: list });
  };
  const check = () =>
    patch((s) => {
      const flags: string[] = [];
      for (const id of s.chosen) {
        if (s.aims[id] !== undefined && !aimsHold(id, s.aims[id])) flags.push(`${id}.aims`);
        if (s.exp[id] && !expHolds(id, s.exp[id])) flags.push(`${id}.exp`);
      }
      return { checks: s.checks + 1, measureFlags: flags };
    });
  const nA = l1.measureFlags.filter((f) => f.endsWith(".aims")).length;
  const nE = l1.measureFlags.filter((f) => f.endsWith(".exp")).length;
  return (
    <AnswerBlock
      id="block-2-3"
      title={tt("Block 2.3 · Choose three measures, score them, put them in order", "Block 2.3 · Drei Maßnahmen wählen, bewerten, in eine Reihenfolge bringen")}
      kind="OBJECTIVE + JUDGED"
      minutes={BLOCK_MINUTES["2.3"]}
      findIt={tt(`Route 1 → Task 1 → “The limits” in the case above (${euro(BUDGET)}, ${MONTHS} months) and the nine measures below. Answer by choosing three and filling their cards.`, `Route 1 → Task 1 → „Die Grenzen“ im Fall oben (${euro(BUDGET)}, ${MONTHS} Monate) und die neun Maßnahmen unten. Antworten Sie, indem Sie drei wählen und ihre Karten ausfüllen.`)}
    >
      <MaterialRefs refs={["A7"]} />
      <div id={IDS.measurePick} className="space-y-2">
        <p className="text-body text-ink">
          <Gloss>{tt("Choose exactly three of the nine measures. Each says what it does and what evidence it rests on; it does not say which pattern it serves. That is your job.", "Wählen Sie genau drei der neun Maßnahmen. Jede sagt, was sie tut und auf welcher Evidenz sie ruht; sie sagt nicht, welchem Muster sie dient. Das ist Ihre Aufgabe.")}</Gloss>
        </p>
        <OptionList<MeasureId>
          multi
          label={tt("Measures", "Maßnahmen")}
          value={chosen}
          onChange={toggle}
          disabledIds={chosen.length >= CHOOSE ? MEASURES.map((m) => m.id) : []}
          onDisabledClick={() => scrollToAndFlash(IDS.measurePick, "warn")}
          options={MEASURES.map((m) => ({ id: m.id, label: tt(`${m.name} · ${euro(m.cost)} · ${m.weeks} weeks`, `${m.name} · ${euro(m.cost)} · ${m.weeks} Wochen`), sub: `${m.what} ${m.basis}` }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${chosen.length} of ${CHOOSE} chosen.`, `${chosen.length} von ${CHOOSE} gewählt.`)}
          {chosen.length >= CHOOSE ? tt(" To choose another, first remove one.", " Um eine andere zu wählen, entfernen Sie zuerst eine.") : ""}
        </p>
        <RevealHint id="aims-help" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("How to match and score a measure · taught in Materi A6 and A7", "Wie man eine Maßnahme zuordnet und bewertet · aus Materi A6 und A7")}>
          <div className="space-y-2 text-caption text-ink">
            <p>{tt("Which pattern does it act on? Read what it does against what each pattern says about the customer (Materi A6). A discount, more data or a black-box score serves no pattern by itself.", "Auf welches Muster wirkt sie? Lesen Sie, was sie tut, gegen das, was jedes Muster über den Kunden sagt (Materi A6). Ein Rabatt, mehr Daten oder ein Black-Box-Score dienen für sich keinem Muster.")}</p>
            <p>{EXPLAIN_RULE.v}</p>
            <MaterialRefs refs={["A6", "A7"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      {chosen.length > 0 && (
        <div className="space-y-3">
          <BudgetBar items={chosen.map((id) => ({ id, short: MEASURE_BY_ID[id].name.split(" ")[0], cost: MEASURE_BY_ID[id].cost }))} budget={BUDGET} title={tt(`Chosen measures against the ${euro(BUDGET)} budget`, `Gewählte Maßnahmen gegen das Budget von ${euro(BUDGET)}`)} />
          <p className="text-caption text-ash">
            {tt(`${chosen.length} measure${chosen.length === 1 ? "" : "s"} cost ${euro(cost)} of ${euro(BUDGET)}.`, `${chosen.length} ${chosen.length === 1 ? "Maßnahme kostet" : "Maßnahmen kosten"} ${euro(cost)} von ${euro(BUDGET)}.`)}
            {cost > BUDGET ? tt(` That is ${euro(cost - BUDGET)} over: leave out the lowest score.`, ` Das sind ${euro(cost - BUDGET)} zu viel: Lassen Sie den niedrigsten Wert weg.`) : tt(` ${euro(BUDGET - cost)} is left.`, ` ${euro(BUDGET - cost)} bleiben übrig.`)}
          </p>
        </div>
      )}
      {chosen.map((id) => {
        const m = MEASURE_BY_ID[id];
        const aims = l1.aims[id];
        const aF = l1.measureFlags.includes(`${id}.aims`);
        const eF = l1.measureFlags.includes(`${id}.exp`);
        return (
          <div key={id} id={IDS.measure(id)} className={clsx("space-y-3 rounded-lg border border-line bg-paper p-3.5", (aF || eF) && "is-flagged")}>
            <p className="font-semibold text-ink">
              {m.name} <span className="font-normal text-ash">· {euro(m.cost)} · {tt("rests on", "ruht auf")} {EVIDENCE_LABEL[m.evidence]}</span>
            </p>
            <div>
              <p className="smallcaps">{tt("Which patterns does it serve? (choose the ones it really serves, or none)", "Welchen Mustern dient sie? (wählen Sie die, denen sie wirklich dient, oder keinem)")}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {PATTERN_IDS.map((f) => {
                  const on = aims?.includes(f) ?? false;
                  return (
                    <button key={f} type="button" aria-pressed={on} onClick={() => setAims(id, on ? (aims ?? []).filter((x) => x !== f) : [...(aims ?? []), f])} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                      {on ? "☑ " : "☐ "}
                      {PATTERNS[f].label}
                    </button>
                  );
                })}
                <button type="button" aria-pressed={aims !== undefined && aims.length === 0} onClick={() => setAims(id, [])} className={clsx("btn btn-sm min-h-[40px] border", aims !== undefined && aims.length === 0 ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                  {tt("None of the four", "Keinem der vier")}
                </button>
              </div>
              {aF && (
                <p className="mt-1 text-caption text-ink">
                  <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
                  {tt("Read what this measure does against what each pattern says about the customer in Materi A6. Does it reach customers who are fading, who never took off, who are steady, or who come in cycles?", "Lesen Sie, was diese Maßnahme tut, gegen das, was jedes Muster in Materi A6 über den Kunden sagt. Erreicht sie Kunden, die nachlassen, die nie anliefen, die stabil sind, oder die in Zyklen kommen?")}
                </p>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <p className="smallcaps">{tt("Explanatory power (from the evidence)", "Erklärungskraft (aus der Evidenz)")}</p>
                <ScorePick label={tt(`Explanatory power of ${m.name}`, `Erklärungskraft von ${m.name}`)} value={l1.exp[id] || 0} onChange={(v) => setScore("exp", id, v)} flagged={eF} />
                {eF && <p className="mt-1 text-micro normal-case tracking-normal text-ink">{tt(`It rests on ${EVIDENCE_LABEL[m.evidence]}. Read that against the rule in Materi A7.`, `Sie ruht auf ${EVIDENCE_LABEL[m.evidence]}. Lesen Sie das gegen die Regel in Materi A7.`)}</p>}
              </div>
              <div>
                <p className="smallcaps">{tt("Feasibility", "Machbarkeit")}</p>
                <ScorePick label={tt(`Feasibility of ${m.name}`, `Machbarkeit von ${m.name}`)} value={l1.fea[id] || 0} onChange={(v) => setScore("fea", id, v)} />
              </div>
              <div>
                <p className="smallcaps">{tt("Effect", "Wirkung")}</p>
                <ScorePick label={tt(`Effect of ${m.name}`, `Wirkung von ${m.name}`)} value={l1.eff[id] || 0} onChange={(v) => setScore("eff", id, v)} />
              </div>
            </div>
            <p className="tnum text-caption text-ink" aria-live="polite">
              {tt("Score: ", "Wert: ")}
              {measureScored(l1, id) ? `${l1.exp[id]} × ${l1.fea[id]} × ${l1.eff[id]} = ` : tt("fill all three scores · ", "alle drei Werte ausfüllen · ")}
              <strong>{measureScore(l1, id) || "—"}</strong>
            </p>
            {mentor && <MentorGuide guide={scoreGuide(id)} />}
          </div>
        );
      })}
      {chosen.length > 0 && (
        <div className="space-y-2">
          <p className="smallcaps">{tt("Which patterns do your measures serve? (from what each really serves)", "Welchen Mustern dienen Ihre Maßnahmen? (aus dem, wem jede wirklich dient)")}</p>
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {cov.map((c) => (
              <li key={c.pattern} className={clsx("rounded-md border px-3 py-1.5 text-caption", c.covered ? "border-signal/40 bg-signalSoft text-ink" : "border-dashed border-ash bg-mist text-ink")}>
                <span aria-hidden>{c.covered ? "● " : "○ "}</span>
                <strong>{PATTERNS[c.pattern].label}</strong>: {c.covered ? tt("at least one chosen measure serves it", "mindestens eine gewählte Maßnahme dient ihm") : tt("nothing you chose serves it", "nichts Gewähltes dient ihm")}
              </li>
            ))}
          </ul>
        </div>
      )}
      <CheckBar onCheck={check} checkLabel={tt("Check my measures", "Meine Maßnahmen prüfen")} checks={l1.checks} />
      {chosen.length > 0 && l1.checks > 0 && (
        <Reading>
          {l1.measureFlags.length > 0
            ? tt(`${nA} measure${nA === 1 ? " names" : "s name"} patterns it does not serve, and ${nE} explanatory-power score${nE === 1 ? " does not" : "s do not"} follow the evidence printed. They are outlined above.`, `${nA} ${nA === 1 ? "Maßnahme nennt" : "Maßnahmen nennen"} Muster, denen sie nicht dienen, und ${nE} ${nE === 1 ? "Wert für Erklärungskraft folgt" : "Werte für Erklärungskraft folgen"} nicht der gedruckten Evidenz. Sie sind oben markiert.`)
            : tt("The patterns you named and the explanatory-power scores match the measures. Feasibility and effect are your judgement.", "Die genannten Muster und die Werte für Erklärungskraft passen zu den Maßnahmen. Machbarkeit und Wirkung sind Ihr Urteil.")}
          {cost > BUDGET ? tt(` The plan is ${euro(cost - BUDGET)} over the budget.`, ` Der Plan liegt ${euro(cost - BUDGET)} über dem Budget.`) : ""}
        </Reading>
      )}
      <AnswerKey block={measureKey()} />
      {chosen.length === CHOOSE && (
        <div id={IDS.order} className="space-y-2 border-t border-line pt-3">
          <p className="font-semibold text-ink">{tt("Put your three measures in priority order", "Bringen Sie Ihre drei Maßnahmen in eine Reihenfolge")}</p>
          <ol className="space-y-1.5">
            {shown.map((id, i) => (
              <li key={id} className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-1.5">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink text-caption font-bold text-paper">{i + 1}</span>
                <span className="min-w-0 flex-1 text-caption text-ink">
                  {MEASURE_BY_ID[id].name} <span className="tnum text-ash">· {tt("score", "Wert")} {measureScore(l1, id) || "—"}</span>
                </span>
                <button type="button" onClick={() => move(id, -1)} aria-label={tt(`Move ${MEASURE_BY_ID[id].name} up`, `${MEASURE_BY_ID[id].name} nach oben`)} className="btn-ghost btn-sm min-w-[40px]">
                  ↑
                </button>
                <button type="button" onClick={() => move(id, 1)} aria-label={tt(`Move ${MEASURE_BY_ID[id].name} down`, `${MEASURE_BY_ID[id].name} nach unten`)} className="btn-ghost btn-sm min-w-[40px]">
                  ↓
                </button>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => patch({ order: [...shown] })} className={clsx("btn-sm", l1.order.length === CHOOSE ? "btn-ghost" : "btn-primary")}>
              {l1.order.length === CHOOSE && chosen.every((id) => l1.order.includes(id)) ? tt("✓ Order kept", "✓ Reihenfolge übernommen") : tt("Keep this order", "Diese Reihenfolge übernehmen")}
            </button>
            {inv.length > 0 && (
              <span role="status" className="text-caption text-ink">
                <span className="smallcaps mr-1 text-accent">{tt("Check", "Prüfung")}</span>
                {tt(`${inv.length} measure${inv.length === 1 ? " sits" : "s sit"} above one with a higher score. If deliberate, say why below.`, `${inv.length} ${inv.length === 1 ? "Maßnahme steht" : "Maßnahmen stehen"} über einer mit höherem Wert. Ist das Absicht, sagen Sie unten, warum.`)}
              </span>
            )}
          </div>
          <AnswerKey block={orderKey()} />
          <TextBox
            id={IDS.why}
            label={tt("Why does your first priority go first?", "Warum kommt Ihre erste Priorität zuerst?")}
            help={tt("Give the order, name the score or the revenue at risk that decides it, say what the plan costs against the budget, and what you left out. At least 60 characters.", "Nennen Sie die Reihenfolge, den Wert oder den gefährdeten Umsatz, der sie entscheidet, was der Plan gegen das Budget kostet und was Sie weggelassen haben. Mindestens 60 Zeichen.")}
            value={l1.why}
            onChange={(v) => patch({ why: v })}
            min={60}
            rows={4}
          >
            <WritingHelp
              id="why-help"
              steps={[
                tt("Say which measure goes first and why: its score, or the revenue at risk from Block 1.2.", "Sagen Sie, welche Maßnahme zuerst kommt und warum: ihr Wert, oder der gefährdete Umsatz aus Block 1.2."),
                tt("Say what the three cost against the €160,000.", "Sagen Sie, was die drei gegen die 160.000 € kosten."),
                tt("Say what you left out and why.", "Sagen Sie, was Sie weggelassen haben und warum."),
              ]}
              refs={[{ label: tt("Budget", "Budget"), value: euro(BUDGET), target: IDS.measurePick }]}
            />
          </TextBox>
          {mentor && <MentorGuide guide={whyGuide()} />}
        </div>
      )}
    </AnswerBlock>
  );
}
