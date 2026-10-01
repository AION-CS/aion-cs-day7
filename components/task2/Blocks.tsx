"use client";

import clsx from "clsx";
import { AnswerBlock } from "@/components/ui/AnswerBlock";
import { AnswerKey } from "@/components/ui/AnswerKey";
import { BlockMissing } from "@/components/ui/BlockMissing";
import { BudgetBar } from "@/components/ui/BudgetBar";
import { ExampleAnswer } from "@/components/ui/ExampleAnswer";
import { NumbersHelp } from "@/components/ui/NumbersHelp";
import { CheckBar, OptionList, Reading, ScorePick, TextBox } from "@/components/ui/Inputs";
import { MaterialRefs } from "@/components/ui/MaterialRefs";
import { MentorGuide } from "@/components/ui/MentorGuide";
import { RevealHint } from "@/components/ui/RevealHint";
import { WritingHelp } from "@/components/ui/WritingHelp";
import type { HelpRef } from "@/components/ui/WritingHelp";
import { ArchFacts, PickupKitFor, TriggerKitFor } from "@/components/task2/Kits";
import {
  ACTION_LABEL,
  ARCH,
  ARCH_BY_ID,
  ARCH_IDS,
  ARCH_SHORT,
  BASELINE_ITEM,
  BOARD_CHALLENGE,
  BOARD_FACTS,
  CADENCE_LABEL,
  CASES_MIN,
  COMPS,
  COMP_BY_ID,
  COMP_CHOOSE,
  COMP_IDS,
  COST_SHAPE_LABEL,
  CRITERIA,
  CUSTOMER_ITEMS,
  CRIT_IDS,
  DECISIONS,
  KPIS,
  LIFT_ACT,
  LIFT_WATCH,
  LOGIC_OWNERS,
  LOGIC_OWNER_LABEL,
  OWNERS,
  OWNER_IDS,
  PRINCIPLES,
  PRINCIPLE_IDS,
  QUALITY_BAR,
  R2_BASELINE_NOTE,
  R2_BUDGET,
  R2_FIG,
  R2_MONTHS,
  SITUATIONS,
  SOURCES,
  SOURCE_BY_ID,
  USE_LABEL,
  setupMonths,
} from "@/data/route2";
import type { Action, ArchId, CompId, Criterion, DecisionId, KpiId, LogicOwner, OwnerId, PrincipleId, SitId, SourceId, Use } from "@/data/route2";
import { archCost, archLeft, archOver, blackBoxFunded, compTotal, earlyCount, funded, logicHolds, principlesHold, ratingFlags, seqRules, sourceHolds, tripFlagsOf } from "@/lib/checks";
import { figRef, tripMonth } from "@/lib/calcR2";
import { scrollToAndFlash } from "@/lib/flash";
import { Gloss } from "@/lib/glossify";
import { euro, num, tt } from "@/lib/lang";
import { IDS } from "@/lib/missing";
import { assumptionGuide, challengeGuide, greatestGuide, postponedGuide, principleTextGuide, triggerGuide, tripwireGuide } from "@/lib/mentorGuide";
import { compKey, decisionKey, logicKey, ownerKey, principleKey, sourceKey, tripKey } from "@/lib/answerKey";
import { MIN_LINE } from "@/lib/progress";
import { BLOCK_MINUTES } from "@/lib/routes";
import { useStore } from "@/store/useStore";
import type { Score } from "@/store/useStore";

const MONTHS_LIST = Array.from({ length: R2_MONTHS }, (_, i) => i + 1);
const PRINCIPLE_CHOOSE = 3;
const USES: Use[] = ["core", "later", "leave"];
const ACTIONS: Action[] = ["intervene", "watch", "none"];

/* ------------------------------------------------------------------ Block 3.1 */

export function Block31() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (c: PrincipleId) => patch((s) => ({ principles: s.principles.includes(c) ? s.principles.filter((x) => x !== c) : [...s.principles, c], principleFlagged: false }));
  const check = () =>
    patch((s) => {
      const h = principlesHold(s);
      return { checks: s.checks + 1, principleFlagged: !(h.defs && h.rules), principleClue: false };
    });
  const h = principlesHold(r2);
  return (
    <AnswerBlock
      id="block-3-1"
      title={tt("Block 3.1 · The target vision of a data-driven organisation", "Block 3.1 · Das Zielbild einer datengetriebenen Organisation")}
      kind="OBJECTIVE + JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["3.1"]}
      findIt={tt("Route 2 → Task 2 → the six principles below. Answer by choosing three and saying what each means for SmartData.", "Route 2 → Task 2 → die sechs Prinzipien unten. Antworten Sie, indem Sie drei wählen und sagen, was jedes für SmartData bedeutet.")}
    >
      <MaterialRefs refs={["B1"]} />
      <div id={IDS.principlePick} className={clsx("space-y-2 rounded-lg p-1", r2.principleFlagged && "is-flagged")}>
        <p className="text-body text-ink">
          <Gloss>{tt("Choose the three principles your data-driven organisation will stand on. Test each against Materi B1: does it make the organisation decide with data, whoever is in the room?", "Wählen Sie die drei Prinzipien, auf denen Ihre datengetriebene Organisation stehen wird. Prüfen Sie jedes an Materi B1: Lässt es die Organisation mit Daten entscheiden, egal wer im Raum ist?")}</Gloss>
        </p>
        <OptionList<PrincipleId>
          multi
          cols={2}
          label={tt("Principles", "Prinzipien")}
          value={r2.principles}
          onChange={toggle}
          disabledIds={r2.principles.length >= PRINCIPLE_CHOOSE ? PRINCIPLE_IDS : []}
          onDisabledClick={() => scrollToAndFlash(IDS.principlePick, "warn")}
          options={PRINCIPLE_IDS.map((c) => ({ id: c, label: PRINCIPLES[c].name, sub: PRINCIPLES[c].means }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${r2.principles.length} of ${PRINCIPLE_CHOOSE} chosen.`, `${r2.principles.length} von ${PRINCIPLE_CHOOSE} gewählt.`)}
          {r2.principles.length >= PRINCIPLE_CHOOSE ? tt(" To choose another, first remove one.", " Um ein anderes zu wählen, entfernen Sie zuerst eines.") : ""}
        </p>
        {r2.principleFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Check", "Prüfung")}</span>
            {tt(`${[h.defs, h.rules].filter(Boolean).length} of the 2 foundations a data-driven organisation needs are among your three. `, `${[h.defs, h.rules].filter(Boolean).length} der 2 Fundamente, die eine datengetriebene Organisation braucht, sind unter Ihren dreien. `)}
            {r2.principleClue ? (
              tt("Which principle makes everyone read the same numbers, and which makes the numbers lead to the same action?", "Welches Prinzip lässt alle dieselben Zahlen lesen, und welches lässt die Zahlen zur selben Handlung führen?")
            ) : (
              <button type="button" onClick={() => patch({ principleClue: true })} className="btn-ghost btn-sm border-gold">
                {tt("Show clue", "Hinweis zeigen")}
              </button>
            )}
          </p>
        )}
      </div>
      {r2.principles.map((c) => (
        <div key={c} className="space-y-1.5">
          <TextBox
            id={IDS.principle(c)}
            label={tt(`${PRINCIPLES[c].name}: what it means at SmartData`, `${PRINCIPLES[c].name}: was es bei SmartData bedeutet`)}
            help={tt(`One or two sentences: what changes for SmartData's teams or customers, and which problem of the brief it answers. At least ${MIN_LINE} characters.`, `Ein oder zwei Sätze: was sich für Teams oder Kunden von SmartData ändert, und welches Problem des Auftrags es beantwortet. Mindestens ${MIN_LINE} Zeichen.`)}
            value={r2.principleText[c] ?? ""}
            onChange={(v) => patch((s) => ({ principleText: { ...s.principleText, [c]: v } }))}
            min={MIN_LINE}
            rows={2}
          >
            <WritingHelp
              id={`principle-kit-${c}`}
              refs={[
                { label: tt("What the principle says", "Was das Prinzip sagt"), value: PRINCIPLES[c].means, target: IDS.principle(c) },
                { label: tt("The two foundations (Materi B1)", "Die zwei Fundamente (Materi B1)"), value: tt("shared definitions · written decision rules", "gemeinsame Definitionen · schriftliche Entscheidungsregeln"), target: "mat-B1" },
              ]}
              steps={[
                tt("Say what changes for a team or a customer at SmartData, in one concrete example.", "Sagen Sie an einem konkreten Beispiel, was sich für ein Team oder einen Kunden bei SmartData ändert."),
                tt("Say which problem of the brief it answers: decisions from experience, data not used, or uneven quality.", "Sagen Sie, welches Problem des Auftrags es beantwortet: Entscheidungen aus Erfahrung, ungenutzte Daten oder ungleiche Qualität."),
              ]}
            />
          </TextBox>
          <ExampleAnswer id={`principle-example-${c}`} guide={principleTextGuide(c)} />
          {mentor && <MentorGuide guide={principleTextGuide(c)} />}
        </div>
      ))}
      <CheckBar onCheck={check} checkLabel={tt("Check my principles", "Meine Prinzipien prüfen")} checks={r2.checks} />
      <AnswerKey block={principleKey()} />
      <BlockMissing block="3.1" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.2 */

export function Block32() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const setUse = (id: SourceId, u: Use) => patch((s) => ({ sources: { ...s.sources, [id]: u }, sourceResult: null }));
  const check = () => patch((s) => ({ checks: s.checks + 1, sourceResult: sourceHolds(s), sourceClue: false }));
  return (
    <AnswerBlock
      id="block-3-2"
      title={tt("Block 3.2 · Relevant data sources", "Block 3.2 · Relevante Datenquellen")}
      kind="OBJECTIVE"
      core={false}
      minutes={BLOCK_MINUTES["3.2"]}
      findIt={tt("Route 2 → Task 2 → the eight sources below, each with the decision it would inform and how complete it is. Answer by choosing a use for each.", "Route 2 → Task 2 → die acht Quellen unten, jede mit der Entscheidung, die sie stützen würde, und wie vollständig sie ist. Antworten Sie, indem Sie für jede eine Verwendung wählen.")}
    >
      <MaterialRefs refs={["B2"]} />
      <p className="text-body text-ink">
        <Gloss>{tt("For each source decide: use it now (core), fix its quality first (later), or leave it out. Start from the decision it would inform, not from how much data it holds. Each line says which decision the source would inform, how complete it is (the share of customers for whom it has data) and what it costs to connect.", "Entscheiden Sie für jede Quelle: jetzt nutzen (Kern), zuerst die Qualität verbessern (später) oder weglassen. Gehen Sie von der Entscheidung aus, die sie stützen würde, nicht davon, wie viele Daten sie enthält. Jede Zeile sagt, welche Entscheidung die Quelle stützen würde, wie vollständig sie ist (der Anteil der Kunden, für die sie Daten hat) und was die Anbindung kostet.")}</Gloss>
      </p>
      <RevealHint id="source-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("The rule · taught in Materi B2", "Die Regel · aus Materi B2")}>
        <ul className="space-y-1.5 text-caption text-ink">
          <li>{tt("Would a decision SmartData makes change with it? If not, leave it out.", "Würde sich eine Entscheidung von SmartData damit ändern? Wenn nicht, weglassen.")}</li>
          <li>{tt(`Is it at least ${QUALITY_BAR}% complete? Then core; if not, later.`, `Ist sie mindestens zu ${QUALITY_BAR} % vollständig? Dann Kern; wenn nicht, später.`)}</li>
          <li>{tt("Cost and size are not the test.", "Kosten und Größe sind nicht der Test.")}</li>
          <li>
            <MaterialRefs refs={["B2"]} lead={tt("Taught in", "Gelehrt in")} />
          </li>
        </ul>
      </RevealHint>
      {SOURCES.map((s) => (
        <div key={s.id} id={IDS.source(s.id)} className="space-y-2 rounded-lg border border-line bg-paper p-3">
          <p className="font-semibold text-ink">{s.name}</p>
          <p className="text-caption text-ash">
            <span className="font-semibold text-ink">{tt("Decision it informs: ", "Entscheidung, die sie stützt: ")}</span>
            {s.decision ?? tt("none named", "keine genannt")} · <span className="font-semibold text-ink">{tt("Complete: ", "Vollständig: ")}</span>
            {`${s.complete}%`} · <span className="font-semibold text-ink">{tt("Cost to connect: ", "Kosten der Anbindung: ")}</span>
            {euro(s.cost)}
          </p>
          <OptionList<Use> label={tt(`Use of ${s.name}`, `Verwendung von ${s.name}`)} value={r2.sources[s.id] ?? null} onChange={(v) => setUse(s.id, v)} options={USES.map((u) => ({ id: u, label: USE_LABEL[u] }))} />
        </div>
      ))}
      <CheckBar onCheck={check} checkLabel={tt("Check my sources", "Meine Quellen prüfen")} checks={r2.checks} clueShown={r2.sourceClue} onClue={() => patch({ sourceClue: true })} />
      {r2.sourceResult && (
        <Reading>
          {tt(`${r2.sourceResult.holds} of ${r2.sourceResult.total} sources are placed by the rule of Materi B2. A check never says which.`, `${r2.sourceResult.holds} von ${r2.sourceResult.total} Quellen sind nach der Regel aus Materi B2 eingeordnet. Eine Prüfung sagt nie, welche.`)}
          {r2.sourceClue ? tt(" Clue: first cover the “complete” figure and ask only whether a decision is named; then look at the figure.", " Hinweis: Verdecken Sie zuerst die Zahl bei „vollständig“ und fragen Sie nur, ob eine Entscheidung genannt ist; schauen Sie dann auf die Zahl.") : ""}
        </Reading>
      )}
      <AnswerKey block={sourceKey()} />
      <BlockMissing block="3.2" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.3 */

export function Block33() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const toggle = (id: CompId) =>
    patch((s) => {
      const next = s.comps.includes(id) ? s.comps.filter((x) => x !== id) : [...s.comps, id];
      return { comps: next, greatest: s.greatest && next.includes(s.greatest) ? s.greatest : null, rateFlags: [], compResult: null };
    });
  const setRate = (id: CompId, c: Criterion, v: Score) => patch((s) => ({ rate: { ...s.rate, [`${id}.${c}`]: v }, rateFlags: s.rateFlags.filter((x) => x !== `${id}.${c}`) }));
  const check = () => patch((s) => ({ checks: s.checks + 1, rateFlags: ratingFlags(s), compResult: { early: earlyCount(s.comps) } }));
  return (
    <AnswerBlock
      id="block-3-3"
      title={tt("Block 3.3 · A system for behavioural analysis", "Block 3.3 · Ein System für Verhaltensanalyse")}
      kind="OBJECTIVE + JUDGED"
      core={false}
      minutes={BLOCK_MINUTES["3.3"]}
      findIt={tt("Route 2 → Task 2 → the eight components below, each with whether it explains, how often it runs, whom it covers and how its cost behaves. Answer by choosing three and rating them on the four tests of Materi B3.", "Route 2 → Task 2 → die acht Bausteine unten, jeder damit, ob er erklärt, wie oft er läuft, wen er abdeckt und wie sich seine Kosten verhalten. Antworten Sie, indem Sie drei wählen und nach den vier Tests aus Materi B3 bewerten.")}
    >
      <MaterialRefs refs={["B3"]} />
      <p className="rounded-md border border-line bg-mist/40 px-3 py-2 text-caption text-ink">
        <Gloss>
          {tt(
            "How to read a component line. It says what the component does, whether it shows the reason for a flag, how often it runs, whom it covers and how its cost grows. These printed facts cap your ratings: a component that shows no reasons cannot be rated High on explanatory power.",
            "So lesen Sie die Zeile eines Bausteins. Sie sagt, was der Baustein tut, ob er den Grund für eine Markierung zeigt, wie oft er läuft, wen er abdeckt und wie seine Kosten wachsen. Diese gedruckten Fakten deckeln Ihre Bewertungen: Ein Baustein, der keine Gründe zeigt, kann bei der Erklärungskraft nicht Hoch bekommen.",
          )}
        </Gloss>
      </p>
      <div id={IDS.compPick} className="space-y-2">
        <OptionList<CompId>
          multi
          label={tt("Components", "Bausteine")}
          value={r2.comps}
          onChange={toggle}
          disabledIds={r2.comps.length >= COMP_CHOOSE ? COMP_IDS : []}
          onDisabledClick={() => scrollToAndFlash(IDS.compPick, "warn")}
          options={COMPS.map((c) => ({
            id: c.id,
            label: c.name,
            sub: `${c.what} ${c.explains ? tt("Shows the reason", "Zeigt den Grund") : tt("No reasons shown", "Keine Gründe")} · ${CADENCE_LABEL[c.cadence]} · ${c.coversAll ? tt("every customer", "jeder Kunde") : tt("some customers", "einige Kunden")} · ${tt("cost", "Kosten")}: ${COST_SHAPE_LABEL[c.costShape]}.`,
          }))}
        />
        <p role="status" className="text-caption text-ash">
          {tt(`${r2.comps.length} of ${COMP_CHOOSE} chosen.`, `${r2.comps.length} von ${COMP_CHOOSE} gewählt.`)}
          {r2.comps.length >= COMP_CHOOSE ? tt(" To choose another, first remove one.", " Um einen anderen zu wählen, entfernen Sie zuerst einen.") : ""}
        </p>
        <RevealHint id="comp-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("The four tests · taught in Materi B3", "Die vier Tests · aus Materi B3")}>
          <ul className="space-y-1.5 text-caption text-ink">
            {CRITERIA.map((c) => (
              <li key={c.id}>
                <span className="font-semibold">{c.name}. </span>
                {c.test} {tt("Low:", "Niedrig:")} {c.low} {tt("High:", "Hoch:")} {c.high}
              </li>
            ))}
            <li>
              <MaterialRefs refs={["B3"]} lead={tt("Taught in", "Gelehrt in")} />
            </li>
          </ul>
        </RevealHint>
      </div>
      {r2.comps.map((id) => {
        const c = COMP_BY_ID[id];
        return (
          <div key={id} id={IDS.comp(id)} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">
              {c.name} <span className="font-normal text-ash">· {c.explains ? tt("shows the reason", "zeigt den Grund") : tt("no reasons shown", "keine Gründe")} · {CADENCE_LABEL[c.cadence]} · {c.coversAll ? tt("every customer", "jeder Kunde") : tt("some customers", "einige Kunden")} · {COST_SHAPE_LABEL[c.costShape]}</span>
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {CRIT_IDS.map((k) => {
                const key = `${id}.${k}`;
                const flagged = r2.rateFlags.includes(key);
                const crit = CRITERIA.find((x) => x.id === k)!;
                return (
                  <div key={k}>
                    <p className="smallcaps">{crit.name}</p>
                    <ScorePick label={tt(`${crit.name} of ${c.name}`, `${crit.name} von ${c.name}`)} value={r2.rate[key] || 0} onChange={(v) => setRate(id, k, v)} flagged={flagged} />
                    {flagged && <p className="mt-1 text-micro normal-case tracking-normal text-ink">{tt("Higher than the printed facts allow. Read the component's line above against this test.", "Höher, als die gedruckten Fakten erlauben. Lesen Sie die Zeile des Bausteins oben gegen diesen Test.")}</p>}
                  </div>
                );
              })}
            </div>
            <p className="tnum text-caption text-ink" aria-live="polite">
              {tt("Total of the four tests: ", "Summe der vier Tests: ")}
              <strong>{compTotal(r2, id) || "—"}</strong> / 12
            </p>
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my ratings", "Meine Bewertungen prüfen")} checks={r2.checks} />
      {r2.compResult && (
        <Reading>
          {r2.rateFlags.length > 0
            ? tt(`${r2.rateFlags.length} rating${r2.rateFlags.length === 1 ? " is" : "s are"} higher than the printed facts allow and ${r2.rateFlags.length === 1 ? "is" : "are"} outlined. `, `${r2.rateFlags.length} ${r2.rateFlags.length === 1 ? "Bewertung ist" : "Bewertungen sind"} höher, als die gedruckten Fakten erlauben, und markiert. `)
            : tt("No rating exceeds what the printed facts allow. ", "Keine Bewertung übersteigt, was die gedruckten Fakten erlauben. ")}
          {tt(`${r2.compResult.early} of your ${r2.comps.length} components warn before the customer decides (weekly or monthly); a system needs most of them to (Materi B3).`, `${r2.compResult.early} Ihrer ${r2.comps.length} Bausteine warnen, bevor der Kunde entscheidet (wöchentlich oder monatlich); ein System braucht die meisten davon so (Materi B3).`)}
        </Reading>
      )}
      <AnswerKey block={compKey()} />
      <BlockMissing block="3.3" route={2} />
      <div className="space-y-2 border-t border-line pt-3">
        <div id={IDS.greatest}>
          <p className="font-semibold text-ink">{tt("Which of your components has the greatest leverage?", "Welcher Ihrer Bausteine hat die größte Hebelwirkung?")}</p>
          {r2.comps.length === 0 ? (
            <p className="text-caption text-ash">{tt("Choose your components above first; nothing is blocked.", "Wählen Sie zuerst oben Ihre Bausteine; nichts ist gesperrt.")}</p>
          ) : (
            <OptionList<CompId> label={tt("Greatest leverage", "Größte Hebelwirkung")} value={r2.greatest} onChange={(v) => patch({ greatest: v })} options={r2.comps.map((id) => ({ id, label: COMP_BY_ID[id].name }))} />
          )}
        </div>
        <TextBox
          id={IDS.greatestWhy}
          label={tt("Why this one?", "Warum dieser?")}
          help={tt("Name the tests that decide it and the problem of the brief it answers. At least 40 characters.", "Nennen Sie die Tests, die es entscheiden, und das Problem des Auftrags, das er beantwortet. Mindestens 40 Zeichen.")}
          value={r2.greatestWhy}
          onChange={(v) => patch({ greatestWhy: v })}
          min={40}
          rows={3}
        >
          <WritingHelp
            id="greatest-kit"
            refs={[
              ...r2.comps.map((id) => ({ label: tt(`Your rating of ${COMP_BY_ID[id].name}`, `Ihre Bewertung von ${COMP_BY_ID[id].name}`), value: `${compTotal(r2, id) || "—"} / 12`, target: IDS.comp(id) })),
              { label: tt("The four tests (Materi B3)", "Die vier Tests (Materi B3)"), value: CRITERIA.map((c) => c.name).join(" · "), target: "mat-B3" },
            ]}
            steps={[
              tt("Name the component and the tests where it is highest.", "Nennen Sie den Baustein und die Tests, bei denen er am höchsten ist."),
              tt("Say what the others lack: reasons, speed, reach or scale.", "Sagen Sie, was den anderen fehlt: Gründe, Tempo, Reichweite oder Skalierung."),
              tt("Finish with the problem of the brief it answers.", "Schließen Sie mit dem Problem des Auftrags, das er beantwortet."),
            ]}
          />
        </TextBox>
        <ExampleAnswer id="greatest-example" guide={greatestGuide()} />
        {mentor && <MentorGuide guide={greatestGuide()} />}
      </div>
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.4 */

export function Block34() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const setRow = (id: SitId, p: Partial<{ action: Action | null; owner: LogicOwner | null }>) => patch((s) => ({ logic: { ...s.logic, [id]: { ...(s.logic[id] ?? { action: null, owner: null }), ...p } }, logicResult: null }));
  const check = () => patch((s) => ({ checks: s.checks + 1, logicResult: logicHolds(s), logicClue: false }));
  return (
    <AnswerBlock
      id="block-3-4"
      title={tt("Block 3.4 · Decision logic: when to intervene", "Block 3.4 · Entscheidungslogik: wann eingreifen")}
      kind="OBJECTIVE"
      core={false}
      minutes={BLOCK_MINUTES["3.4"]}
      findIt={tt("Route 2 → Task 2 → the six signals below, each with its lift, its number of past cases and the revenue at stake. Answer with an action and an owner for each.", "Route 2 → Task 2 → die sechs Signale unten, jedes mit Lift, Zahl früherer Fälle und dem Umsatz, um den es geht. Antworten Sie mit einer Aktion und einem Owner für jedes.")}
    >
      <MaterialRefs refs={["B4"]} />
      <p className="rounded-md border border-line bg-mist/40 px-3 py-2 text-caption text-ink">
        <Gloss>
          {tt(
            "How to read a signal line. “Lift” is how many times more often customers with this signal left than the others (a lift of 7 means seven times as often). “Past cases” is how many customers last year showed the signal. “Revenue at stake” is what those customers pay in a year. A big lift on few cases can be chance.",
            "So lesen Sie die Zeile eines Signals. „Lift“ ist, wie viel Mal häufiger Kunden mit diesem Signal gingen als die anderen (ein Lift von 7 heißt siebenmal so oft). „Frühere Fälle“ ist, wie viele Kunden das Signal letztes Jahr zeigten. „Umsatz, um den es geht“ ist, was diese Kunden im Jahr zahlen. Ein großer Lift bei wenigen Fällen kann Zufall sein.",
          )}
        </Gloss>
      </p>
      <RevealHint id="logic-tests" label={tt("Show the test questions", "Testfragen zeigen")} title={tt("The rule · taught in Materi B4", "Die Regel · aus Materi B4")}>
        <ul className="space-y-1.5 text-caption text-ink">
          <li>{tt(`Intervene: lift ${LIFT_ACT} or more and at least ${CASES_MIN} past cases.`, `Eingreifen: Lift ${LIFT_ACT} oder mehr und mindestens ${CASES_MIN} frühere Fälle.`)}</li>
          <li>{tt(`Watch and gather data: lift ${LIFT_ACT} or more with fewer than ${CASES_MIN} cases, or a lift between ${LIFT_WATCH} and ${LIFT_ACT}.`, `Beobachten und Daten sammeln: Lift ${LIFT_ACT} oder mehr bei weniger als ${CASES_MIN} Fällen, oder ein Lift zwischen ${LIFT_WATCH} und ${LIFT_ACT}.`)}</li>
          <li>{tt(`No action: lift below ${LIFT_WATCH}.`, `Keine Aktion: Lift unter ${LIFT_WATCH}.`)}</li>
          <li>{tt("Who acts follows from what the signal is about; watching belongs to the data team; no action has no owner.", "Wer handelt, folgt daraus, worum es beim Signal geht; Beobachten gehört dem Datenteam; keine Aktion hat keinen Owner.")}</li>
          <li>
            <MaterialRefs refs={["B4"]} lead={tt("Taught in", "Gelehrt in")} />
          </li>
        </ul>
      </RevealHint>
      {SITUATIONS.map((s) => {
        const r = r2.logic[s.id] ?? { action: null, owner: null };
        return (
          <div key={s.id} id={IDS.logic(s.id)} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
            <p className="font-semibold text-ink">{s.signal}</p>
            <p className="tnum text-caption text-ash">
              {tt(`Lift ${num(s.lift)} · ${s.cases} past cases · revenue at stake ${euro(s.revenue)} · ${s.note}`, `Lift ${num(s.lift)} · ${s.cases} frühere Fälle · Umsatz, um den es geht, ${euro(s.revenue)} · ${s.note}`)}
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <p className="smallcaps">{tt("What happens", "Was passiert")}</p>
                <OptionList<Action> label={tt(`Action for “${s.signal}”`, `Aktion für „${s.signal}“`)} value={r.action} onChange={(v) => setRow(s.id, { action: v })} options={ACTIONS.map((a) => ({ id: a, label: ACTION_LABEL[a] }))} />
              </div>
              <div>
                <label htmlFor={`logic-owner-${s.id}`} className="smallcaps block">
                  {tt("Who acts", "Wer handelt")}
                </label>
                <select id={`logic-owner-${s.id}`} className="field mt-1" value={r.owner ?? ""} onChange={(e) => setRow(s.id, { owner: (e.target.value || null) as LogicOwner | null })}>
                  <option value="">{tt("Choose…", "Wählen…")}</option>
                  {LOGIC_OWNERS.map((o) => (
                    <option key={o} value={o}>
                      {LOGIC_OWNER_LABEL[o]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );
      })}
      <CheckBar onCheck={check} checkLabel={tt("Check my decision logic", "Meine Entscheidungslogik prüfen")} checks={r2.checks} clueShown={r2.logicClue} onClue={() => patch({ logicClue: true })} />
      {r2.logicResult && (
        <Reading>
          {tt(`${r2.logicResult.holds} of ${r2.logicResult.total} settings hold (an action and an owner for each of the six signals). A check never says which.`, `${r2.logicResult.holds} von ${r2.logicResult.total} Einstellungen stimmen (eine Aktion und ein Owner für jedes der sechs Signale). Eine Prüfung sagt nie, welche.`)}
          {r2.logicClue ? tt(" Clue: look at the number of past cases before you look at the lift. A strong lift on twelve customers may be chance.", " Hinweis: Schauen Sie auf die Zahl früherer Fälle, bevor Sie auf den Lift schauen. Ein starker Lift bei zwölf Kunden kann Zufall sein.") : ""}
        </Reading>
      )}
      <AnswerKey block={logicKey()} />
      <BlockMissing block="3.4" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.5 */

export function Block35() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const f = funded(r2);
  const over = archOver(r2);
  const rules = seqRules(r2);
  const box = blackBoxFunded(r2);
  const setItem = (id: ArchId, p: Partial<{ alloc: boolean; start: number | null; owner: OwnerId | null; trigger: string }>) =>
    patch((s) => ({
      alloc: p.alloc !== undefined ? { ...s.alloc, [id]: p.alloc } : s.alloc,
      start: p.start !== undefined ? { ...s.start, [id]: p.start } : p.alloc === false ? { ...s.start, [id]: null } : s.start,
      owner: p.owner !== undefined ? { ...s.owner, [id]: p.owner } : s.owner,
      trigger: p.trigger !== undefined ? { ...s.trigger, [id]: p.trigger } : s.trigger,
      seqResult: null,
    }));
  const check = () =>
    patch((s) => {
      const r = seqRules(s);
      return { checks: s.checks + 1, seqResult: { holds: Number(r.baseline) + Number(r.budget) + Number(r.explainable), total: 3 }, seqClue: false };
    });
  const base = r2.start[BASELINE_ITEM];
  const others = f.filter((id) => id !== BASELINE_ITEM);
  const firstOther = others.length ? Math.min(...others.map((id) => r2.start[id] ?? 99)) : null;
  const notFunded = ARCH_IDS.filter((id) => !r2.alloc[id]);
  return (
    <AnswerBlock
      id="block-3-5"
      title={tt("Block 3.5 · Prioritised measures for implementation: fund, sequence, own", "Block 3.5 · Priorisierte Maßnahmen zur Umsetzung: finanzieren, ordnen, verantworten")}
      kind="OBJECTIVE + JUDGED"
      core
      minutes={BLOCK_MINUTES["3.5"]}
      findIt={tt(`Route 2 → Task 2 → the eight items below and “SmartData today” in the case brief. The budget is ${euro(R2_BUDGET)} over ${R2_MONTHS} months. Answer in the item cards.`, `Route 2 → Task 2 → die acht Punkte unten und „SmartData heute“ im Fall. Das Budget beträgt ${euro(R2_BUDGET)} über ${R2_MONTHS} Monate. Antworten Sie in den Karten der Punkte.`)}
    >
      <MaterialRefs refs={["B5", "B6"]} />
      <div className="flex flex-wrap items-start gap-2">
        <RevealHint id="owner-help" label={tt("Show the owner test", "Owner-Test zeigen")} title={tt("The tests · taught in Materi B5 and B6", "Die Tests · aus Materi B5 und B6")}>
          <div className="space-y-2 text-caption text-ink">
            <ul className="list-disc space-y-1 pl-5">
              <li>{tt("Owner: who can change it without asking anyone else?", "Owner: Wer kann es ändern, ohne jemanden zu fragen?")}</li>
              <li>{tt("Start: does something have to exist before it, such as the data foundation?", "Start: Muss vorher etwas existieren, etwa die Datenbasis?")}</li>
              <li>{tt("Explainable: could an account manager be told why it flags a customer?", "Erklärbar: Könnte man einem Account Manager sagen, warum es einen Kunden markiert?")}</li>
              <li>{tt("Trigger: a metric, a number (given in the trigger kit), the month it can first be read, and an action.", "Trigger: eine Kennzahl, eine Zahl (im Trigger-Baukasten), der Monat, in dem er zuerst gelesen werden kann, und eine Aktion.")}</li>
            </ul>
            <p className="smallcaps text-ash">{tt("What each role can change", "Was jede Rolle ändern kann")}</p>
            <ul className="space-y-1">
              {OWNER_IDS.map((o) => (
                <li key={o}>
                  <span className="font-semibold">{OWNERS[o].name}. </span>
                  {OWNERS[o].profile}
                </li>
              ))}
            </ul>
            <MaterialRefs refs={["B5", "B6"]} lead={tt("Taught in", "Gelehrt in")} />
          </div>
        </RevealHint>
      </div>
      <p className="text-body text-ink">
        <Gloss>
          {tt(
            "Fund the items you will carry out. For each funded item choose the month it starts, one owner who can change it without asking anyone else, and a trigger: a metric, a number, a month and an action. You do not calculate the number and the month: each card says what its trigger counts, and “Show the trigger kit” under the trigger gives every part of the sentence, with why and where the numbers are printed (Materi B6). You put the parts in and word the trigger. Leave out what does not fit, on purpose, and fund nothing whose forecasts nobody can explain.",
            "Finanzieren Sie die Punkte, die Sie umsetzen. Wählen Sie für jeden finanzierten Punkt den Startmonat, einen Owner, der ihn ändern kann, ohne jemanden zu fragen, und einen Trigger: eine Kennzahl, eine Zahl, einen Monat und eine Aktion. Zahl und Monat müssen Sie nicht berechnen: Jede Karte sagt, was ihr Trigger zählt, und „Den Trigger-Baukasten zeigen“ unter dem Trigger gibt jeden Teil des Satzes, mit Warum und Woher die Zahlen gedruckt stehen (Materi B6). Sie übernehmen die Teile und formulieren den Trigger. Lassen Sie weg, was nicht passt, bewusst, und finanzieren Sie nichts, dessen Prognosen niemand erklären kann.",
          )}
        </Gloss>
      </p>
      <p className="rounded-md border border-line bg-mist/40 px-3 py-2 text-caption text-ink">
        <Gloss>
          {tt(
            "How to read an item card. It says what the item is in everyday words, gives one scene from SmartData's day and says who does what. Three facts sit under it. “Needs first” is what has to exist before the item can work. “To pay back, it must keep” is the number of customers it has to stop from leaving to earn its own cost: its cost divided by the €18,000 a customer brings in a year, rounded up. “Its effect shows” is how long after it is in use you can see a result. They are facts, not a verdict: you decide and give the reason. When the money is short, leave out first an item nobody can explain to an account manager, then the one that has to keep the most customers to pay back. An item you leave out is not thrown away: it gets a pickup point below.",
            "So lesen Sie eine Karte. Sie sagt in Alltagsworten, was der Punkt ist, gibt eine Szene aus dem Alltag von SmartData und sagt, wer was tut. Drei Fakten stehen darunter. „Braucht zuerst“ ist, was existieren muss, bevor der Punkt wirken kann. „Zum Bezahltmachen muss er halten“ ist die Zahl der Kunden, die er vom Gehen abhalten muss, um seine eigenen Kosten zu verdienen: seine Kosten geteilt durch die 18.000 €, die ein Kunde im Jahr bringt, aufgerundet. „Seine Wirkung zeigt sich“ ist, wie lange nach dem Einsatz Sie ein Ergebnis sehen. Es sind Fakten, kein Urteil: Sie entscheiden und nennen den Grund. Wenn das Geld knapp ist, lassen Sie zuerst einen Punkt weg, den niemand einem Account Manager erklären kann, dann den, der die meisten Kunden halten muss, um sich zu bezahlen. Ein weggelassener Punkt wird nicht weggeworfen: Er bekommt unten einen Pickup Point.",
          )}
        </Gloss>
      </p>
      <div id={IDS.archTotal} className="space-y-2">
        <BudgetBar items={f.map((id) => ({ id, short: ARCH_SHORT[id], cost: ARCH_BY_ID[id].cost }))} budget={R2_BUDGET} title={tt(`Funded items against the ${euro(R2_BUDGET)} budget`, `Finanzierte Punkte gegen das Budget von ${euro(R2_BUDGET)}`)} />
        <p className="text-caption text-ash" aria-live="polite">
          {tt(`Funded ${euro(archCost(r2))} of ${euro(R2_BUDGET)}. `, `Finanziert ${euro(archCost(r2))} von ${euro(R2_BUDGET)}. `)}
          {over > 0
            ? tt(`${euro(over)} over. A hint, not a lock: if you keep it, say in the fields below why the extra spend is worth it; the memo prints the amount over.`, `${euro(over)} darüber. Ein Hinweis, keine Sperre: Wenn Sie dabei bleiben, sagen Sie in den Feldern unten, warum die Mehrausgabe sich lohnt; das Memo nennt den Betrag darüber.`)
            : tt(`${euro(archLeft(r2))} left.`, `${euro(archLeft(r2))} übrig.`)}
        </p>
      </div>
      {ARCH.map((a) => {
        const on = !!r2.alloc[a.id];
        return (
          <div key={a.id} id={IDS.arch(a.id)} className={clsx("space-y-3 rounded-lg border p-3.5", on ? "border-line bg-paper" : "border-dashed border-ash/60 bg-mist/40")}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-ink">
                {a.name} <span className="font-normal text-ash">· {euro(a.cost)} · {tt(`${a.weeks} weeks to be in use`, `${a.weeks} Wochen bis zum Einsatz`)}</span>
              </p>
              <button type="button" aria-pressed={on} onClick={() => setItem(a.id, { alloc: !on })} className={clsx("btn btn-sm min-h-[40px] border", on ? "border-accent bg-accentSoft text-ink" : "border-line bg-paper text-ash hover:border-ash")}>
                {on ? tt("☑ Funded", "☑ Finanziert") : tt("☐ Not funded", "☐ Nicht finanziert")}
              </button>
            </div>
            <div className="space-y-1.5 text-caption">
              <p className="text-body text-ink">
                <span className="smallcaps mr-1.5 text-ash">{tt("What it is", "Was es ist")}</span>
                <Gloss>{a.what}</Gloss>
              </p>
              <p className="text-ink">
                <span className="smallcaps mr-1.5 text-ash">{tt("A scene", "Eine Szene")}</span>
                <Gloss>{a.scene}</Gloss>
              </p>
              <p className="text-ink">
                <span className="smallcaps mr-1.5 text-ash">{tt("Who does what", "Wer was tut")}</span>
                <Gloss>{a.who}</Gloss>
              </p>
              <p className="text-ink">
                <span className="smallcaps mr-1.5 text-ash">{tt("Its trigger counts", "Sein Trigger zählt")}</span>
                {a.counts}
              </p>
            </div>
            <ArchFacts id={a.id} r2={r2} />
            {on && (
              <>
                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label htmlFor={`start-${a.id}`} className="smallcaps block">
                      {tt("Starts in month", "Startet in Monat")}
                    </label>
                    <select id={`start-${a.id}`} className="field mt-1 max-w-[10rem]" value={r2.start[a.id] ?? ""} onChange={(e) => setItem(a.id, { start: e.target.value ? Number(e.target.value) : null })}>
                      <option value="">{tt("Choose…", "Wählen…")}</option>
                      {MONTHS_LIST.map((m) => (
                        <option key={m} value={m}>
                          {tt(`Month ${m}`, `Monat ${m}`)}
                        </option>
                      ))}
                    </select>
                    {r2.start[a.id] != null && (() => {
                      const month = r2.start[a.id]! + setupMonths(a.weeks) + a.respond;
                      return (
                        <p className={clsx("mt-1 text-micro normal-case tracking-normal", month > R2_MONTHS ? "text-rust" : "text-ash")}>
                          {month > R2_MONTHS
                            ? tt(`Its trigger could first be read in month ${month}, after the plan ends. Start earlier, or say why it may wait.`, `Sein Trigger ließe sich erst in Monat ${month} lesen, nach Ende des Plans. Starten Sie früher, oder sagen Sie, warum er warten darf.`)
                            : tt(`Its trigger can first be read in month ${month}.`, `Sein Trigger lässt sich zuerst in Monat ${month} lesen.`)}
                        </p>
                      );
                    })()}
                  </div>
                  <div>
                    <label htmlFor={`owner-${a.id}`} className="smallcaps block">
                      {tt("Owner (who can change it without asking anyone else)", "Owner (wer es ändern kann, ohne jemanden zu fragen)")}
                    </label>
                    <select id={`owner-${a.id}`} className="field mt-1" value={r2.owner[a.id] ?? ""} onChange={(e) => setItem(a.id, { owner: (e.target.value || null) as OwnerId | null })}>
                      <option value="">{tt("Choose an owner…", "Owner wählen…")}</option>
                      {OWNER_IDS.map((o) => (
                        <option key={o} value={o}>
                          {OWNERS[o].name}
                        </option>
                      ))}
                    </select>
                    {r2.owner[a.id] && <p className="mt-1 text-micro normal-case tracking-normal text-ash">{OWNERS[r2.owner[a.id]!].profile}</p>}
                  </div>
                </div>
                <TextBox
                  id={`${IDS.arch(a.id)}-trigger`}
                  label={tt("Trigger", "Trigger")}
                  help={tt("If [metric] is [worse than your number] by [your month], then [action]. Open “Show the trigger kit”: each part says what to write, why and where the numbers come from, and you put them into the sentence. At least 20 characters, with a number.", "Wenn [Kennzahl] bis [Ihr Monat] [schlechter als Ihre Zahl] ist, dann [Aktion]. Öffnen Sie „Den Trigger-Baukasten zeigen“: Jeder Teil sagt, was Sie schreiben, warum und woher die Zahlen kommen, und Sie übernehmen sie in den Satz. Mindestens 20 Zeichen, mit einer Zahl.")}
                  value={r2.trigger[a.id] ?? ""}
                  onChange={(v) => setItem(a.id, { trigger: v })}
                  min={20}
                  rows={2}
                >
                  <TriggerKitFor id={a.id} r2={r2} value={r2.trigger[a.id] ?? ""} onChange={(v) => setItem(a.id, { trigger: v })} what={a.counts} />
                </TextBox>
                <ExampleAnswer id={`trigger-example-${a.id}`} guide={triggerGuide(a.id)} />
                {mentor && <MentorGuide guide={triggerGuide(a.id)} />}
              </>
            )}
          </div>
        );
      })}

      <div className="space-y-1 rounded-lg border border-line bg-mist/50 p-3 text-caption text-ink" aria-live="polite">
        <p className="smallcaps">{tt("What your plan means", "Was Ihr Plan bedeutet")}</p>
        {f.length === 0 && <p>{tt("Nothing is funded yet.", "Noch nichts ist finanziert.")}</p>}
        {f.length > 0 && !rules.hasBaseline && <p>{tt("The data foundation is not funded, so the score, the dashboard and every trigger read from lists that are not joined or defined the same way.", "Die Datenbasis ist nicht finanziert, also lesen Score, Dashboard und jeder Trigger aus Listen, die weder verbunden noch gleich definiert sind.")}</p>}
        {rules.hasBaseline && base != null && firstOther !== null && base > firstOther && <p>{tt(`The first item starts in month ${firstOther}, before the data foundation in month ${base}: its first weeks run on data that is not yet joined.`, `Der erste Punkt startet in Monat ${firstOther}, vor der Datenbasis in Monat ${base}: Seine ersten Wochen laufen auf Daten, die noch nicht verbunden sind.`)}</p>}
        {rules.hasBaseline && base != null && firstOther !== null && base <= firstOther && <p>{tt(`The data foundation starts in month ${base}, no later than the first other item (month ${firstOther}), so every score and trigger reads joined, defined data.`, `Die Datenbasis startet in Monat ${base}, nicht später als der erste andere Punkt (Monat ${firstOther}), also liest jeder Score und Trigger verbundene, definierte Daten.`)}</p>}
        {box.length > 0 && <p>{tt(`Funded without explanation: ${box.map((id) => ARCH_BY_ID[id].name).join(", ")}. Nobody will be able to say why it flags a customer.`, `Ohne Erklärung finanziert: ${box.map((id) => ARCH_BY_ID[id].name).join(", ")}. Niemand wird sagen können, warum es einen Kunden markiert.`)}</p>}
        {over > 0 && <p>{tt(`The funded items are ${euro(over)} over the budget. That is your call to make; the memo prints it as a fact.`, `Die finanzierten Punkte liegen ${euro(over)} über dem Budget. Das ist Ihre Entscheidung; das Memo nennt es als Tatsache.`)}</p>}
      </div>

      {notFunded.length > 0 && (
        <div className="space-y-3 border-t border-line pt-3">
          <TextBox
            id={IDS.postponed}
            label={tt("What you leave out, and why", "Was Sie weglassen, und warum")}
            help={tt("Name the item and say why it is the one that goes: the budget, nobody can explain its forecasts, or no decision needs it. At least 30 characters.", "Nennen Sie den Punkt und sagen Sie, warum gerade er wegfällt: das Budget, niemand kann seine Prognosen erklären, oder keine Entscheidung braucht ihn. Mindestens 30 Zeichen.")}
            value={r2.postponed}
            onChange={(v) => patch({ postponed: v })}
            min={MIN_LINE}
            rows={3}
          >
            <WritingHelp
              id="postponed-help"
              steps={[
                tt("Name the item you leave out, with its cost.", "Nennen Sie den Punkt, den Sie weglassen, mit seinen Kosten."),
                tt("Say what the funded items cost and what adding it would have pushed the total to (the budget bar shows both).", "Sagen Sie, was die finanzierten Punkte kosten und auf welche Summe er den Plan gebracht hätte (der Budgetbalken zeigt beides)."),
                tt("Say why this one: can anyone explain its forecasts to an account manager, and does a decision need it?", "Sagen Sie, warum gerade dieser: Kann jemand seine Prognosen einem Account Manager erklären, und braucht eine Entscheidung ihn?"),
              ]}
              refs={[
                { label: tt("Budget", "Budget"), value: euro(R2_BUDGET), target: IDS.archTotal },
                { label: tt("Your funded items cost", "Ihre finanzierten Punkte kosten"), value: euro(archCost(r2)), target: IDS.archTotal },
                ...notFunded.map((id) => ({ label: tt(`Not funded: ${ARCH_BY_ID[id].name}`, `Nicht finanziert: ${ARCH_BY_ID[id].name}`), value: euro(ARCH_BY_ID[id].cost), target: IDS.arch(id) })),
              ]}
            />
          </TextBox>
          <ExampleAnswer id="postponed-example" guide={postponedGuide()} />
          <div id={IDS.pickup} className="space-y-2">
            <TextBox
              id={`${IDS.pickup}-text`}
              label={tt("The pickup point", "Der Pickup Point")}
              help={tt("If [number] customers leave for the reason this item would fix by [month], we fund it. Open “Show the pickup point kit”: it gives the number (the cost of waiting), the month, the reason and the action, each with why and where it comes from. At least 15 characters, with a number.", "Wenn bis [Monat] [Zahl] Kunden aus dem Grund gehen, den dieser Punkt beheben würde, finanzieren wir ihn. Öffnen Sie „Den Pickup-Point-Baukasten zeigen“: Er gibt die Zahl (die Kosten des Wartens), den Monat, den Grund und die Aktion, jeweils mit Warum und Woher. Mindestens 15 Zeichen, mit einer Zahl.")}
              value={r2.pickup}
              onChange={(v) => patch({ pickup: v })}
              min={15}
              rows={2}
            >
              <PickupKitFor notFunded={notFunded} r2={r2} value={r2.pickup} onChange={(v) => patch({ pickup: v })} />
            </TextBox>
          </div>
          {mentor && <MentorGuide guide={postponedGuide()} />}
        </div>
      )}

      <CheckBar onCheck={check} checkLabel={tt("Check my architecture", "Meine Architektur prüfen")} checks={r2.checks} clueShown={r2.seqClue} onClue={() => patch({ seqClue: true })} />
      {r2.seqResult && (
        <Reading>
          {tt(`${r2.seqResult.holds} of ${r2.seqResult.total} rules hold (the data foundation starts no later than the first other item, the funded items fit the budget, nothing funded is a black box).`, `${r2.seqResult.holds} von ${r2.seqResult.total} Regeln stimmen (die Datenbasis startet nicht später als der erste andere Punkt, die finanzierten Punkte passen ins Budget, nichts Finanziertes ist eine Black Box).`)}
          {r2.seqClue ? tt(" Clue: which item do all the others read from? And which item could not tell an account manager why it flags a customer?", " Hinweis: Aus welchem Punkt lesen alle anderen? Und welcher Punkt könnte einem Account Manager nicht sagen, warum er einen Kunden markiert?") : ""}
        </Reading>
      )}
      <AnswerKey block={ownerKey(f)} />
      <BlockMissing block="3.5" route={2} />
    </AnswerBlock>
  );
}

/* ------------------------------------------------------------------ Block 3.6 */

/** The three doubts of the case, each with the figure behind it, so an assumption can point at what is still uncertain (CLAUDE.md #41). */
const DOUBTS = [
  { id: "doubt-rule", items: ["health"] as ArchId[], key: "rule" },
  { id: "doubt-calls", items: ["playbook"] as ArchId[], key: "calls" },
  { id: "doubt-data", items: ["foundation"] as ArchId[], key: "data" },
];

export function Block36() {
  const r2 = useStore((s) => s.r2);
  const patch = useStore((s) => s.patchR2);
  const mentor = useStore((s) => s.mentorUnlocked);
  const k = r2.tripKpi ? KPIS.find((x) => x.id === r2.tripKpi)! : null;
  const flags = tripFlagsOf(r2);
  const check = () => patch((s) => ({ checks: s.checks + 1, decisionFlagged: s.decision === "wait", tripFlags: tripFlagsOf(s) }));
  const unit = (x: (typeof KPIS)[number]) => (x.unit === "%" ? tt("%", " %") : ` ${x.unit}`);
  const f = funded(r2);
  const tm = tripMonth(r2);
  const doubtText = (key: string) =>
    key === "rule"
      ? { what: tt("Does falling usage still predict leaving?", "Sagt sinkende Nutzung das Gehen weiter voraus?"), figure: tt(`Last year's rule rests on ${R2_FIG.groupFell} customers, of whom ${R2_FIG.leftFell} left. A rule built on so few customers can be chance.`, `Die Regel des letzten Jahres beruht auf ${R2_FIG.groupFell} Kunden, von denen ${R2_FIG.leftFell} gingen. Eine Regel auf so wenigen Kunden kann Zufall sein.`) }
      : key === "calls"
        ? { what: tt("Does a call really change what a flagged customer does?", "Ändert ein Anruf wirklich, was ein markierter Kunde tut?"), figure: tt(`SmartData has never run a call playbook. Today ${R2_FIG.save}% of the flagged customers stay, from calls made by chance.`, `SmartData hatte noch nie ein Anruf-Playbook. Heute bleiben ${R2_FIG.save} % der markierten Kunden, nach Anrufen, die zufällig stattfanden.`) }
        : { what: tt("Can the data be joined well enough to trust?", "Lassen sich die Daten gut genug verbinden, um ihnen zu trauen?"), figure: tt(`Tickets are ${SOURCE_BY_ID.tickets.complete}% complete, the CRM notes ${SOURCE_BY_ID.crmnotes.complete}% and the survey ${SOURCE_BY_ID.survey.complete}%.`, `Tickets sind zu ${SOURCE_BY_ID.tickets.complete} % vollständig, die CRM-Notizen zu ${SOURCE_BY_ID.crmnotes.complete} % und die Befragung zu ${SOURCE_BY_ID.survey.complete} %.`) };
  return (
    <AnswerBlock
      id="block-3-6"
      title={tt("Block 3.6 · Decide despite uncertain data", "Block 3.6 · Trotz unsicherer Daten entscheiden")}
      kind="OBJECTIVE + JUDGED"
      core
      minutes={BLOCK_MINUTES["3.6"]}
      findIt={tt("Route 2 → Task 2 → your own answers in Block 3.5, “SmartData today” in the case brief, the doubts table and the baselines below, and the decision rules in Materi B5 and B6. Answer in the fields below.", "Route 2 → Task 2 → Ihre eigenen Antworten in Block 3.5, „SmartData heute“ im Fall, die Tabelle der Zweifel und die Ausgangswerte unten und die Entscheidungsregeln in Materi B5 und B6. Antworten Sie in den Feldern unten.")}
    >
      <MaterialRefs refs={["B5", "B6"]} />
      <div id={IDS.decision} className={clsx("space-y-2 rounded-lg p-1", r2.decisionFlagged && "is-flagged")}>
        <p className="font-semibold text-ink">{tt("Your decision", "Ihre Entscheidung")}</p>
        <p className="text-caption text-ash">{tt("The brief asks you to decide although the data is uncertain and of uneven quality. Choose one.", "Der Auftrag verlangt, dass Sie entscheiden, obwohl die Daten unsicher und von ungleicher Qualität sind. Wählen Sie eine.")}</p>
        <OptionList<DecisionId> label={tt("Decision", "Entscheidung")} value={r2.decision} onChange={(v) => patch({ decision: v, decisionFlagged: false })} options={DECISIONS.map((d) => ({ id: d.id, label: d.label, sub: d.detail }))} />
        {r2.decisionFlagged && (
          <p className="text-caption text-ink">
            <span className="smallcaps mr-1 text-accent">{tt("Clue", "Hinweis")}</span>
            {tt("Does waiting give the board the decision it asked for, and who decides about the at-risk customers in the six months of waiting? Read the first decision rule of Materi B5.", "Gibt Warten dem Vorstand die Entscheidung, um die er gebeten hat, und wer entscheidet in den sechs Monaten des Wartens über die gefährdeten Kunden? Lesen Sie die erste Entscheidungsregel aus Materi B5.")}
          </p>
        )}
      </div>

      <div className="space-y-3">
        <p className="font-semibold text-ink">{tt("Three assumptions your decision rests on", "Drei Annahmen, auf denen Ihre Entscheidung beruht")}</p>
        <p className="text-body text-ink">
          <Gloss>
            {tt(
              "An assumption has two sentences (Materi B5). “I assume …” about one thing that is still uncertain: its clue is the doubts table below, tied to what your plan bets there. “I am wrong if … by …”: a number you can watch yourself, compared with today's figure. Write one for each doubt in the table.",
              "Eine Annahme hat zwei Sätze (Materi B5). „Ich nehme an, …“ über etwas, das noch unsicher ist: Ihr Hinweis ist die Tabelle der Zweifel unten, verbunden mit dem, worauf Ihr Plan dort setzt. „Ich liege falsch, wenn … bis …“: eine Zahl, die Sie selbst beobachten können, verglichen mit dem heutigen Wert. Schreiben Sie eine für jeden Zweifel in der Tabelle.",
            )}
          </Gloss>
        </p>
        <div className="relative overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[40rem] border-collapse text-caption">
            <caption className="bg-mist px-3 py-2 text-left text-micro font-semibold uppercase text-ash">{tt("What is still uncertain in SmartData's data · and what your plan bets there (Case assumption)", "Was in den Daten von SmartData noch unsicher ist · und worauf Ihr Plan dort setzt (Fallannahme)")}</caption>
            <thead>
              <tr className="text-left text-micro uppercase text-ash">
                <th className="px-3 py-2">{tt("The doubt", "Der Zweifel")}</th>
                <th className="px-3 py-2">{tt("The figure behind it", "Die Zahl dahinter")}</th>
                <th className="px-3 py-2">{tt("Your plan bets here", "Ihr Plan setzt hier")}</th>
              </tr>
            </thead>
            <tbody>
              {DOUBTS.map((d) => {
                const txt = doubtText(d.key);
                const bets = d.items.filter((id) => r2.alloc[id]);
                return (
                  <tr key={d.id} id={d.id} className="border-t border-line align-top">
                    <td className="px-3 py-2 font-semibold">{txt.what}</td>
                    <td className="px-3 py-2">{txt.figure}</td>
                    <td className="px-3 py-2">{bets.length > 0 ? `${bets.map((id) => ARCH_BY_ID[id].name).join(", ")} · ${euro(bets.reduce((s, id) => s + ARCH_BY_ID[id].cost, 0))}` : tt("nothing funded for it yet (Block 3.5)", "dafür noch nichts finanziert (Block 3.5)")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {r2.assumptions.map((a, i) => {
          const d = DOUBTS[i];
          const txt = doubtText(d.key);
          const sign = d.key === "rule" ? ["trig-health", "month-health"] : d.key === "calls" ? ["trip", "tripmonth"] : ["trig-foundation", "month-foundation"];
          const refs: HelpRef[] = [
            { label: tt("The doubt for this assumption", "Der Zweifel zu dieser Annahme"), value: txt.what, target: d.id },
            { label: tt("The figure behind it", "Die Zahl dahinter"), value: txt.figure, target: d.id },
            { label: tt("What your plan bets there", "Worauf Ihr Plan dort setzt"), value: d.items.filter((id) => r2.alloc[id]).map((id) => ARCH_BY_ID[id].name).join(", ") || tt("nothing funded yet", "noch nichts finanziert"), target: d.id },
            d.key === "rule" ? figRef("leftFell") : d.key === "calls" ? figRef("save") : figRef("tickets"),
          ];
          return (
            <div key={i} className="space-y-1.5">
              <TextBox
                id={IDS.assumption(i)}
                label={tt(`Assumption ${i + 1} · ${txt.what}`, `Annahme ${i + 1} · ${txt.what}`)}
                help={tt("Two sentences: “I assume … [what is uncertain, and what your plan bets there]. I am wrong if … [a number you can watch] by [month] (today …).” At least 30 characters.", "Zwei Sätze: „Ich nehme an, … [was unsicher ist und worauf Ihr Plan dort setzt]. Ich liege falsch, wenn … [eine Zahl, die Sie beobachten können] bis [Monat] (heute …).“ Mindestens 30 Zeichen.")}
                value={a}
                onChange={(v) => patch((s) => ({ assumptions: s.assumptions.map((x, j) => (j === i ? v : x)) }))}
                min={MIN_LINE}
                rows={3}
              >
                <div className="flex flex-wrap items-start gap-2">
                  <WritingHelp
                    id={`assumption-kit-${i}`}
                    label={tt("Show how to build an assumption", "Zeigen, wie man eine Annahme baut")}
                    refs={refs}
                    steps={[
                      tt("Sentence 1: name what is uncertain, what your plan bets there, and what the figure behind it says is still unsure.", "Satz 1: Nennen Sie, was unsicher ist, worauf Ihr Plan dort setzt und was die Zahl dahinter noch als unsicher zeigt."),
                      tt("Sentence 2: “I am wrong if …”: a number you can read in your own CRM, a number from “Show the numbers you can use”, today's figure, and the month.", "Satz 2: „Ich liege falsch, wenn …“: eine Zahl aus Ihrem eigenen CRM, eine Zahl aus „Die Zahlen zeigen, die Sie nutzen können“, der heutige Wert und der Monat."),
                      d.key === "rule"
                        ? tt("For the usage rule, the sign is the same number and month as the health-score trigger in Block 3.5.", "Für die Nutzungsregel ist das Anzeichen dieselbe Zahl und derselbe Monat wie beim Trigger des Health Scores in Block 3.5.")
                        : d.key === "calls"
                          ? tt("For the calls, the sign is the same number as your tripwire (below).", "Für die Anrufe ist das Anzeichen dieselbe Zahl wie Ihr Tripwire (unten).")
                          : tt("For the data, the sign is the same number and month as the data-foundation trigger in Block 3.5.", "Für die Daten ist das Anzeichen dieselbe Zahl und derselbe Monat wie beim Trigger der Datenbasis in Block 3.5."),
                      tt("Never a market estimate: it does not move inside your plan.", "Nie eine Marktschätzung: Sie bewegt sich in Ihrem Plan nicht."),
                    ]}
                  />
                  <NumbersHelp
                    id={`assumption-method-${i}`}
                    card="B6"
                    calcs={[
                      d.key === "rule"
                        ? { key: sign[0], title: tt("The sign: the same number as your health-score trigger", "Das Anzeichen: dieselbe Zahl wie Ihr Health-Score-Trigger"), fmt: (n) => tt(`${n}% of the customers who cancel flagged beforehand`, `${n} % der gekündigten Kunden vorher markiert`) }
                        : d.key === "calls"
                          ? { key: sign[0], title: tt("The sign: the same number as your tripwire", "Das Anzeichen: dieselbe Zahl wie Ihr Tripwire"), fmt: (n) => tt(`a save rate above ${n}%`, `eine Save Rate über ${n} %`) }
                          : { key: sign[0], title: tt("The sign: the same number as your data-foundation trigger", "Das Anzeichen: dieselbe Zahl wie Ihr Trigger der Datenbasis"), fmt: (n) => tt(`${n}% of active customers joined`, `${n} % der aktiven Kunden verbunden`) },
                      { key: sign[1], title: tt("And its month", "Und sein Monat"), fmt: (n) => tt(`month ${n}`, `Monat ${n}`) },
                    ]}
                  />
                </div>
              </TextBox>
              <ExampleAnswer id={`assumption-${i}-example`} guide={assumptionGuide(i)} />
              {mentor && <MentorGuide guide={assumptionGuide(i)} />}
            </div>
          );
        })}
      </div>

      <div id={IDS.trip} className="space-y-3 rounded-lg border border-line bg-paper p-3.5">
        <p className="font-semibold text-ink">{tt("The tripwire", "Der Tripwire")}</p>
        <p className="text-caption text-ash">
          {tt("A tripwire is the result you agree on now, so that you know later whether the plan works: a metric of how customers behave, a threshold that beats today's baseline by the step your spending needs (today plus a step, Materi B6), the month the plan can first be judged, and an action agreed now. ", "Ein Tripwire ist das Ergebnis, auf das Sie sich jetzt einigen, damit Sie später wissen, ob der Plan wirkt: eine Kennzahl dafür, wie Kunden sich verhalten, ein Schwellenwert, der die heutige Baseline um den Schritt übertrifft, den Ihre Ausgaben brauchen (heute plus ein Schritt, Materi B6), der Monat, in dem der Plan zuerst beurteilt werden kann, und eine jetzt vereinbarte Aktion. ")}
          {R2_BASELINE_NOTE.v}
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          <div className={clsx(flags.includes("kpi") && r2.tripFlags.includes("kpi") && "is-flagged p-1")}>
            <label htmlFor="trip-kpi" className="smallcaps block">
              {tt("Metric", "Kennzahl")}
            </label>
            <select id="trip-kpi" className="field mt-1" value={r2.tripKpi ?? ""} onChange={(e) => patch({ tripKpi: (e.target.value || null) as KpiId | null, tripFlags: [] })}>
              <option value="">{tt("Choose a metric…", "Kennzahl wählen…")}</option>
              {KPIS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.label} ({tt("today", "heute")}: {num(x.baseline)}
                  {unit(x)})
                </option>
              ))}
            </select>
            {flags.includes("kpi") && r2.tripFlags.includes("kpi") && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">{tt("Clue. ", "Hinweis. ")}</span>
                {tt("Does this metric measure how customers behave, or how much the data team produced?", "Misst diese Kennzahl, wie Kunden sich verhalten, oder wie viel das Datenteam produziert hat?")}
              </p>
            )}
          </div>
          <div className={clsx(flags.includes("threshold") && r2.tripFlags.includes("threshold") && "is-flagged p-1")}>
            <label htmlFor="trip-threshold" className="smallcaps block">
              {tt("Threshold", "Schwellenwert")}
              {k ? tt(` (${k.unit}; better is ${k.better === "up" ? "higher" : "lower"})`, ` (${k.unit}; besser ist ${k.better === "up" ? "höher" : "niedriger"})`) : ""}
            </label>
            <input id="trip-threshold" className="field tnum mt-1" inputMode="decimal" value={r2.tripThreshold} onChange={(e) => patch({ tripThreshold: e.target.value, tripFlags: [] })} />
            {flags.includes("threshold") && r2.tripFlags.includes("threshold") && k && (
              <p className="mt-1 text-micro normal-case tracking-normal text-ink">
                <span className="font-semibold text-accent">{tt("Clue. ", "Hinweis. ")}</span>
                {tt(`Compare it with today's figure, ${num(k.baseline)}${unit(k)}. Would reaching it show a real change?`, `Vergleichen Sie ihn mit dem heutigen Wert, ${num(k.baseline)}${unit(k)}. Würde das Erreichen eine echte Veränderung zeigen?`)}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="trip-month" className="smallcaps block">
              {tt("By month", "Bis Monat")}
            </label>
            <select id="trip-month" className="field mt-1 max-w-[10rem]" value={r2.tripMonth ?? ""} onChange={(e) => patch({ tripMonth: e.target.value ? Number(e.target.value) : null })}>
              <option value="">{tt("Choose…", "Wählen…")}</option>
              {MONTHS_LIST.map((m) => (
                <option key={m} value={m}>
                  {tt(`Month ${m}`, `Monat ${m}`)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-micro normal-case tracking-normal text-ash">
              {tm.month != null
                ? tt(`Your plan can first be judged in month ${tm.month} (from your start months in Block 3.5).`, `Ihr Plan lässt sich zuerst in Monat ${tm.month} beurteilen (aus Ihren Startmonaten in Block 3.5).`)
                : tm.ready}
            </p>
          </div>
          <div>
            <label htmlFor="trip-action" className="smallcaps block">
              {tt("If it is missed", "Wenn er verfehlt wird")}
            </label>
            <select id="trip-action" className="field mt-1" value={r2.tripAction} onChange={(e) => patch({ tripAction: e.target.value as "" | "scale" | "adjust" | "stop" })}>
              <option value="">{tt("Choose an action…", "Aktion wählen…")}</option>
              <option value="adjust">{tt("Adjust one item and continue", "Einen Punkt anpassen und weitermachen")}</option>
              <option value="stop">{tt("Stop the rollout and reconsider the architecture", "Den Rollout stoppen und die Architektur überdenken")}</option>
              <option value="scale">{tt("Scale up anyway", "Trotzdem ausweiten")}</option>
            </select>
          </div>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          <WritingHelp
            id="trip-kit"
            refs={[
              figRef("save"),
              { label: tt("Your funded items that act on flagged customers", "Ihre finanzierten Punkte, die bei markierten Kunden wirken"), value: f.filter((id) => CUSTOMER_ITEMS.includes(id)).length ? `${f.filter((id) => CUSTOMER_ITEMS.includes(id)).map((id) => ARCH_BY_ID[id].name).join(", ")} · ${euro(f.filter((id) => CUSTOMER_ITEMS.includes(id)).reduce((s, id) => s + ARCH_BY_ID[id].cost, 0))}` : tt("none yet", "noch keine"), target: IDS.archTotal },
              figRef("revenue"),
              figRef("flagged"),
              { label: tt("Month your plan can first be judged", "Monat, in dem Ihr Plan zuerst beurteilt werden kann"), value: tm.month != null ? String(tm.month) : "—", target: IDS.archTotal },
            ]}
            steps={[
              tt("Choose a metric of customer behaviour, not of your own activity.", "Wählen Sie eine Kennzahl für Kundenverhalten, nicht für Ihre eigene Aktivität."),
              tt("Threshold = today's save rate plus the step your funded items need to pay back (“Show the numbers you can use”).", "Schwellenwert = heutige Save Rate plus der Schritt, den Ihre finanzierten Punkte zum Bezahltmachen brauchen („Die Zahlen zeigen, die Sie nutzen können“)."),
              tt("Month = the month your plan can first be judged, never after month 6.", "Monat = der Monat, in dem Ihr Plan zuerst beurteilt werden kann, nie nach Monat 6."),
              tt("Agree now what you do if it is missed: change one item, not the whole architecture.", "Vereinbaren Sie jetzt, was Sie tun, wenn er verfehlt wird: einen Punkt ändern, nicht die ganze Architektur."),
            ]}
          />
          <NumbersHelp
            id="trip-method"
            card="B6"
            calcs={[
              { key: "trip", title: tt("The threshold", "Der Schwellenwert"), fmt: (n) => `${n}%`, onUse: (n) => patch({ tripThreshold: String(n), tripFlags: [] }) },
              { key: "tripmonth", title: tt("The month", "Der Monat"), fmt: (n) => tt(`month ${n}`, `Monat ${n}`), onUse: (n) => patch({ tripMonth: Math.min(R2_MONTHS, n) }) },
            ]}
          />
        </div>
        {mentor && <MentorGuide guide={tripwireGuide()} />}
      </div>

      <div className="space-y-2">
        <div id="board-challenge" className="rounded-lg border border-gold bg-accentSoft p-3.5 text-caption text-ink">
          <p className="smallcaps text-accent">{tt("The board's challenge", "Die Frage des Vorstands")}</p>
          <p className="mt-1">
            <Gloss>{BOARD_CHALLENGE.v}</Gloss>
          </p>
        </div>
        <TextBox
          id={IDS.challenge}
          label={tt("What do you do?", "Was tun Sie?")}
          help={tt("Say what you check first, what you keep, and the one thing you change. Use the share of false alarms (under “Show the numbers you can use”). At least 60 characters.", "Sagen Sie, was Sie zuerst prüfen, was Sie behalten und was Sie als Einziges ändern. Nutzen Sie den Anteil der Fehlalarme (unter „Die Zahlen zeigen, die Sie nutzen können“). Mindestens 60 Zeichen.")}
          value={r2.challenge}
          onChange={(v) => patch({ challenge: v })}
          min={60}
          rows={4}
        >
          <div className="flex flex-wrap items-start gap-2">
            <WritingHelp
              id="challenge-help"
              refs={[
                { label: tt("Customers flagged in all", "Markierte Kunden insgesamt"), value: String(BOARD_FACTS.flags), target: "board-challenge" },
                { label: tt("Flags that were project customers in their quiet season", "Markierungen, die Projektkunden in ihrer ruhigen Saison waren"), value: String(BOARD_FACTS.falseAlarms), target: "board-challenge" },
                { label: tt("Customers who complained about the call", "Kunden, die sich über den Anruf beschwerten"), value: String(BOARD_FACTS.complaints), target: "board-challenge" },
                { label: tt("Your tripwire", "Ihr Tripwire"), value: r2.tripKpi && r2.tripThreshold ? `${r2.tripThreshold}${k ? unit(k) : ""}${r2.tripMonth ? tt(` by month ${r2.tripMonth}`, ` bis Monat ${r2.tripMonth}`) : ""}` : tt("not set yet", "noch nicht gesetzt"), target: IDS.trip },
              ]}
              steps={[
                tt("Look at the cases first: which of the 60 flags were false alarms, and which rule produced them?", "Schauen Sie zuerst auf die Fälle: Welche der 60 Markierungen waren Fehlalarme, und welche Regel hat sie erzeugt?"),
                tt("Say what still holds: the other flags are customers whose usage really fell, the ones gut feeling missed last year (Materi B5).", "Sagen Sie, was noch gilt: Die anderen Markierungen sind Kunden, deren Nutzung wirklich sank, die, die das Bauchgefühl letztes Jahr übersah (Materi B5)."),
                tt("Change one rule, not the programme, and say when the tripwire will tell you whether you were right.", "Ändern Sie eine Regel, nicht das Programm, und sagen Sie, wann der Tripwire zeigt, ob Sie recht hatten."),
              ]}
            />
            <NumbersHelp id="challenge-method" card="B6" calcs={[{ key: "challenge", title: tt("The share of false alarms", "Der Anteil der Fehlalarme"), fmt: (n) => `${n}%` }]} />
          </div>
        </TextBox>
        <ExampleAnswer id="challenge-example" guide={challengeGuide()} />
        {mentor && <MentorGuide guide={challengeGuide()} />}
      </div>

      <CheckBar onCheck={check} checkLabel={tt("Check my decision", "Meine Entscheidung prüfen")} checks={r2.checks} />
      {r2.checks > 0 && (r2.decisionFlagged || r2.tripFlags.length > 0) && (
        <Reading>
          {r2.decisionFlagged ? tt("Your decision is outlined.", "Ihre Entscheidung ist markiert.") : ""}
          {r2.tripFlags.length > 0 ? tt(` ${r2.tripFlags.length} part${r2.tripFlags.length === 1 ? "" : "s"} of the tripwire ${r2.tripFlags.length === 1 ? "is" : "are"} outlined.`, ` ${r2.tripFlags.length} ${r2.tripFlags.length === 1 ? "Teil" : "Teile"} des Tripwires ${r2.tripFlags.length === 1 ? "ist" : "sind"} markiert.`) : ""}
        </Reading>
      )}
      <AnswerKey block={decisionKey()} />
      <AnswerKey block={tripKey()} />
      <BlockMissing block="3.6" route={2} />
    </AnswerBlock>
  );
}
