# Retention Lab · Day 7

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 4, Day 1 of 2.**
*Understanding data, analysing customer behaviour and recognising patterns.*
A self-study companion: study material with thirteen live instruments, two tasks and two working documents, in **English and German**
(EN | DE in the top bar, `../CLAUDE.md` #32). It carries the shared standards `../CLAUDE.md` #1 to #28, the two-route form of #30,
the German version of #32 and, since the retrofit of 2026-10-01, #33 to #43 and #46 (see notes 9 to 23 below).

The case company is **SmartData IT Solutions GmbH**, a German IT service provider: *customer behaviour unclear, high churn, decisions
based on experience instead of data* (the plan's case study). Route 1 works it with €160,000 and five months; Route 2 puts the learner
in the Chief Data Officer's chair with €180,000 and six months (Case assumption).

This repo was bootstrapped from `day6` (chrome, primitives, store pattern, tokens, the language machinery) and its content was
replaced. On 2026-10-01 it was brought up to the state of Day 6 after that day's own retrofit: the shared components were copied from
`day6` and the content was rewritten for SmartData (nothing of NetSolutions remains in the tree).

> **Remote:** `origin` is `AION-CS/aion-cs-day7` (checked 2026-10-01).

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` **Levels 1 + 2** | **Materi A**: seven cards, 60 min (A1 gut feeling or data, A2 data → information → insight → decision, A3 big data and smart insights: chances and limits, A4 a first forecast: rates, lift, revenue at risk, A5 four behaviour patterns, A6 from pattern to action: value, risk, measure, uncertainty, A7 explanatory power × feasibility × effect). **Task 1, Customer Data Analysis**, four **Core** blocks: *Part 1 · Turn data into insight:* **1.1** sort nine report lines into data, information or insight and write one insight, **1.2** a first forecast (F1–F3 and a sentence). *Part 2 · Recognise patterns and act:* **2.1** tag twelve customer records with a pattern, **2.3** choose, score and order three measures. **Optional** (folded): 1.3 the two most valuable and the two most at-risk customers and three insights, 1.4 a coaching reflection, 2.2 risk, meaning and measure per pattern, the uncertainties, a pattern you could misread. | `1-{name}-day7-l1l2-data-analysis.html` |
| `/route-2/` **Level 3** | **Materi B**: six cards, 60 min (B1 data as a competitive advantage, B2 relevant data sources, B3 a system for behavioural analysis, B4 decision logic, B5 deciding with uncertain data, and the architecture, B6 numbers you can defend; 10 min each). **Task 2, Data Decision Memo**, with the live memo below the last question. **Core:** **3.5** fund, order and own the implementation items, with a trigger for each, and **3.6** the decision, three assumptions, the tripwire and the board's challenge. **Optional** (folded): 3.1 three principles, 3.2 core / later / leave out for eight data sources, 3.3 three analysis components rated on four tests, 3.4 intervene / watch / no action and who acts for six signals. | `2-{name}-day7-l3-decision-memo.html` |

Minutes: Materi A 60 + Task 1 59 (6 + 10 + 9 + 5 + 8 + 10 + 12), Materi B 60 (6 × 10) + Task 2 50 (5 + 8 + 10 + 8 + 10 + 9). All in `lib/routes.ts`
and `data/materialIndex.ts`. Core only (note 9): Materi A 52 + Task 1 36 (6 + 10 + 8 + 12), Materi B 20 (B5, B6) + Task 2 19 (10 + 9).

Route 2 quotes the learner's Route 1 Core answers (the records tagged as fading in 2.1, the measures chosen in 2.3) in a soft box
(`useJumpTo`, jumping to Block 2.3) and never requires them; the routes share no answer fields.

## German version (CLAUDE.md #32)

Same machinery as Days 5 and 6: `lib/lang.ts` (`tt`, `t` + `bi`, number formats), `lib/i18n.tsx` (`LangProvider`, `LangSwitch`),
`ui.lang` in the persisted store. Common terms stay English in German sentences (Churn, Lift, Health Score, Big Data, Insight, Dashboard,
Owner, Tripwire, KPI…); explanations are German, formal "Sie". Mentor tools stay English; file names stay English.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (CS tokens) · Zustand + `persist` (key `cs-d7-v1`, version 1, `skipHydration` +
`StoreHydrator`, deep `mergeDefaults`) · static export. No animation, drag-and-drop, PDF or chart library. The persisted shape did not
change in the retrofit, so older saves load unchanged (checked with an old-shape blob).

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run verify:calc  # re-derives every figure, rule and Route 2 number, and runs the mentor fill and a Core-only fill in both languages (173 checks)
npm run build        # writes the static site to out/  (stop `npm run dev` first)
node scripts/serve-out.cjs 4107   # serves out/ for a click-through of the static export
```

## What is in the data

- `ladder.ts`: nine report lines (3 data, 3 information, 3 insight) with tests, clue, reason, rejected steps and `LINE_KEY` (the decisive phrase of every line).
- `forecast.ts`: last year's records. Churn rate = leavers ÷ customers × 100; lift = rate ÷ rate of the others; revenue at risk =
  customers now × rate × revenue. 14 ÷ 40 = **F1 35%**; 35 ÷ (18 ÷ 360 × 100 = 5) = **F2 lift 7**; 52 × 0.35 × €18,000 = **F3 €327,600**.
  Worked example of A4 (Weser Cloud): 20%, 4%, lift 5, €72,000. Also the eight customers of 1.3 and the three data bases of the insights.
- `patterns.ts`: four patterns with tests and pair tests; twelve records (3 each; left: anchored 0, fading 2, dormant 2, cyclical 0) with `REC_KEY`;
  the risk rule; meaning and measure per pattern; seven uncertainties (four real).
- `measures.ts`: nine measures with cost, weeks, the evidence they rest on, **a scene and who does what** (note 20). Explanatory power follows
  from the evidence (pattern 3, some 2, hunch 1). Early warning, activation and health score score 18 and cost €105,000.
- `route2.ts`: six principles, eight data sources (rule: decision named? ≥ 80% complete?), eight analysis components, six signals with lift
  and cases (rule: lift ≥ 3 and ≥ 20 cases → intervene; lift ≥ 1.5 → watch; else no action), eight implementation items (**what it is, a scene, who
  does what, what its trigger counts, what it needs first, weeks and months until the effect shows**), owners, three decisions, KPIs, the board's
  challenge, and **`R2_FIG`, “SmartData today”**: the figures every Route 2 number is found from (note 17).
- `calcR2.ts` + `triggerKit.ts`: the numbers of Route 2 and the ready-to-use trigger kit (note 18).

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1 and 2 fills in (plus a participant name if
empty and every calculator part), so each export downloads straight away. The same unlock shows the answer keys (1.1, 1.3 picks, 2.1,
2.2 rows and uncertainties, 2.3 measures and order, 3.1–3.6) and a worked answer for every other question (F1–F3 as step tables with
pitfalls, every trigger, the pickup point, the assumptions, the tripwire and the challenge with their arithmetic, every free text with what to
look for). Client-side convenience gate, not security; a reload locks it.

## Notes on deviations from the brief and the shared rules

1. **Two routes (CLAUDE.md #30).** The plan's Level 1 Task 1 (data to insights: patterns, valuable customers, churn candidates,
   three insights), Level 1 Task 2 (behaviour patterns: three patterns, what they say, one measure each, uncertainties) and the Level 2
   case study (SmartData: analyse data, four central patterns, forecasts, three measures, prioritise) run on one company. Mapping:
   patterns hidden in the data (1.1, 2.1), valuable customers and churn candidates (1.3a/b), three insights (1.3c), forecasts (1.2, the
   risk per pattern in 2.2), four patterns (2.1; the plan's Task 2 asks for three, the case for four: four are used), what they say and
   one measure each (2.2), uncertainties (2.2), three measures prioritised (2.3). The coaching focus is Block 1.4. The Level 3 transfer
   project's five items are 3.1 to 3.5; the additional requirement (a decision despite uncertain data) is 3.6.
2. **The evaluation "Explanatory Power × Feasibility × Effect"** from the plan is the score of Block 2.3. Explanatory power is derived
   from the printed evidence, so it can be checked; feasibility and effect are judged.
3. **Every figure beyond the brief is a Case assumption**: the report lines, the usage history, the customers and records, the costs,
   the Route 2 budget (€180,000), the lifts, “SmartData today”, the KPI baselines and the board's challenge. The brief gives €160,000 and five months.
4. **German by the user's standing request (#32)**, which changes CURRICULUM-GUIDE §1 ("English only"); English stays the default.
5. **Not built as a Friday capstone (#29).** #29 says Friday days are named in each prompt; this request did not name Day 7 as a Friday, so it follows #30.
6. **Risk per pattern is checked against the learner's own tally**, so one mis-tag in 2.1 is not punished twice in 2.2.
7. **Sources to re-check before teaching:** citations are given by their usual details; page ranges and editions differ between printings.
   The churn, lift and revenue figures are illustrations, not research findings.
8. **Route 1 asks for at most four Core blocks (user decision, 2026-10-01: “maximal 4 task”, as in Day 6).** Everything else is folded, not removed (note 9).

### Retrofit of 2026-10-01 (the user's request: bring Day 7 up to Day 6, at most four tasks in Route 1, explain the material down to earth)

9. **Core / Optional on both routes (CLAUDE.md #35, #40).** Route 1 objective: *from raw data to a decision: tell data from insight, estimate
   the risk, recognise the patterns, choose measures.* **Core 1.1, 1.2, 2.1, 2.3**; **Optional 1.3, 1.4, 2.2**. Cards **A1, A2, A4, A5, A6, A7**
   stay Core (1.1 cites A1 and A2; 1.2 cites A4 and A1; 2.1 cites A5; 2.3 cites A7 and A6); **A3** is Optional. Route 2 objective: *decide a data
   architecture although the data is of uneven quality.* **Core 3.5, 3.6** (the same narrowing as Day 6, note 25 there); **Optional 3.1, 3.2, 3.3, 3.4**.
   Cards **B5, B6** Core, **B1, B2, B3, B4** Optional. The ring, the page map's done/total and both missing lists count Core only
   (`OPTIONAL_BLOCKS` in `lib/progress.ts`, `optional` on the material registry, one filter in `lib/missing.ts`). `Core` / `Optional` shows beside every
   page-map pill and on every card and block (`CorePill`); a jump to a collapsed item opens it first (`lib/flash.ts`, `store/useOptionalOpen.ts`).
   `verify:calc` checks the split, that a Core-only fill empties both missing lists in both languages, and that an over-budget plan with every field filled is not missing anything.
10. **Two always-live rust notices (CLAUDE.md #34):** under every answer block (`BlockMissing`) and above Export.
11. **Less text by default (CLAUDE.md #37).** Research paragraphs (A1–A7, B1–B4), the GDPR callout (A1), the four-step table (A4), the pattern table (A5),
    the value-and-risk table (A6), two notes (A7), the signal table (B4) and the “uncertain is not unknown” note (B5) sit behind “＋ Show …”; the
    decision rules and “why it matters / how to read the picture” too. Task chips open the rules and tables first. One button per Materi block shows all.
12. **Guided stories and “The point” (CLAUDE.md #36).** All thirteen pictures (A1 gut or data, A2 the ladder, A3 big data, A4 the forecast, A5 patterns,
    A6 link or cause, A7 scoring, B1 stages, B2 sources, B3 components, B4 lift and cases, B5 architecture, B6 number methods) open with “The point” and carry a
    three-step “Walk me through it”: the case that works, the case that does not, the point. The story drives the real controls, moves a dashed amber spotlight,
    and a manual button leaves it. Every number is computed from the diagram's own constants. Every “What this shows” starts “In plain words:”.
    **No video was embedded (#33):** none was searched and verified in this pass; a card without a video is not a defect.
13. **“Show clue and example answer” on every free-text field (CLAUDE.md #23 update).** Open fields show the mentor's model text; fields whose model
    text is a calculated result or a graded pick (1.2 sentence, 1.3 insights, 2.3 first priority, 3.3 greatest lever, 3.5 triggers, what is left out and the pickup
    point, 3.6 assumptions, tripwire and the board's answer) show a separate `example` in `lib/mentorGuide.ts` on “Company A” or Isar Hosting with other numbers.
    `verify:calc` proves every example differs from its answer.
14. **“Highlight the key words” on both boards (1.1 and 2.1):** `LINE_KEY`, `REC_KEY`; `verify:calc` proves every phrase is an exact substring in both languages.
15. **Clue kits on every field (CLAUDE.md #42):** `WritingHelp` is “Show what to look at”: every number, rule and earlier answer the model answer uses, with its
    value, each a button that flashes its source; then the steps.
16. **Decisions are free (CLAUDE.md #38) and the memo sits at the bottom (#39).** Going over the Route 2 budget is no longer a missing item and no longer blocks
    Block 3.5; it is a hint and the memo prints the amount over. Block 2.3's over-budget line is worded as a hint. The live memo is full width below Block 3.6 with
    “Hide the memo”; no side column, no phone strip.
17. **“SmartData today” (CLAUDE.md #40, #42, #44).** Blocks 3.5 and 3.6 used numbers the screen never printed (95%, 60%, 80%, 70%, 5 points, 45%). One table in the case
    brief now prints every figure they are found from (400 customers, 32 leavers of whom 14 had a usage drop, 40 and 52 customers, €18,000, save rate 30%, 10 sales
    managers, 13 weeks, the completeness of the sources, the 80% bar), consistent with Route 1's records. Core never reads an Optional block's table.
18. **Route 2 shows its numbers; the learner does not calculate (the Day 6 standard, CLAUDE.md #44).** Under every field with a number there is “Show the numbers you
    can use” (`NumbersHelp`): the number, why it is that number, where every input is printed (each a button that flashes its row) and a button that puts it into the
    answer. The trigger and the pickup point have a ready-to-use kit (`SentenceKit`, `components/task2/Kits.tsx`, `data/triggerKit.ts`) with what to write, why and where
    it comes from for each part of the sentence. The methods are new card **B6** (weakest source, half the gap, calls per week, customers' worth, two thirds, the cost of
    waiting, the month). Model values changed to numbers the methods give: foundation 90% by month 3, health score 70% by month 5, playbook 4 a week by month 4,
    dashboard 5 points by month 5, training 7 of 10 by month 5, CRM notes 80% by month 4, pickup 4 customers by month 6, tripwire a save rate of 38% by month 5
    (was 45%), assumptions on 70% / 38% / 90%. `verify:calc` re-derives each number from the printed figures and checks every input links to a row.
19. **Core never depends on Optional (CLAUDE.md #40).** The health item no longer says “the rules of Block 3.4”; Block 3.6's FIND IT line names only 3.5; the case brief
    quotes Route 1's Core answers (2.1 and 2.3) and jumps to Block 2.3; the memo does the same; the quality bar the quality item needs is repeated in B5 and B6;
    `verify:calc` scans the learner-facing text of the Core blocks and cards for Optional block and card names.
20. **Every item, case and label explained down to earth (CLAUDE.md #46; the user's request: “technical stays, but the context was missing”).** Every implementation
    item of 3.5 now prints *what it is* in everyday words, *a scene* from SmartData's day, *who does what* and *what its trigger counts*, then three facts
    (*Needs first*, *To pay back, it must keep N customers*, *Its effect shows*) and a paragraph says how to read a card. Every measure of 2.3 prints *what it does*, *a scene*,
    *who does what* and *what it rests on*, with a paragraph on how to read a card. Block 1.2 says what “usage” and “left” mean; 3.3 and 3.4 got a line on how to read a component
    and a signal (lift, past cases, revenue at stake); 3.6 prints a table of the three doubts with the figure behind each; the tripwire says what a tripwire is for.
    Fifteen glossary entries were added in English and German (playbook, data foundation, joined data, quality bar, pay back, cost of waiting, false alarm, flagged customer,
    dashboard, forecast, account plan, project customer, migration, data feed, pipeline review).
21. **Export (CLAUDE.md #35).** An Optional block that was not answered is marked “optional block, not answered” in the file instead of showing an empty table; the memo
    prints the amount over the budget as a fact.
22. **Nothing was committed or pushed.** The `.claude/launch.json` of the parent folder got a `day7-static` entry for the click-through.
23. **Line endings** of the Day 7 sources were normalised to LF during the retrofit (git's autocrlf already stored them that way).
24. **The four Word documents were rebuilt** (`../materi-task-docx/Day7_*`, CLAUDE.md #31): Core / Optional marks on every card and block, “The point” per card, the new card B6 with its picture and method table, Blocks 2.3 and 3.5 with the scene and who-does-what of every measure and item, “SmartData today”, the numbers Route 2 shows, the doubts table, and a glossary appendix regenerated from `data/glossary.ts`. All four pass `validate.py`. The reviewed Markdown is in `../materi-task-docx/_source/day7-*.md`.
25. **Home page and route blurbs** now describe the four Core blocks of Route 1 and the two Core blocks of Route 2, and the two home-page pay-offs that Optional cards teach say so (CLAUDE.md #27).

## Dependency checklist (CLAUDE.md #40)

✓ = reads only Core blocks, Core cards and the case brief. Optional items may read Core; nothing reads them back.

| Item | Status | Reads from | Core-safe |
|---|---|---|---|
| **Route 1** | | | |
| 1.1 Sort the lines, one insight | Core | printed lines, A2, A1 | ✓ |
| 1.2 F1–F3 and the sentence | Core | printed tables, A4, A1 | ✓ |
| 1.3 Valuable, at risk, insights | Optional | printed customers, A5, A6 | self-contained |
| 1.4 Coaching reflection | Optional | own answers 1.1 (Core), records of 2.1 (Core), A1, A6 | self-contained |
| 2.1 Tag the records | Core | printed records, A5 | ✓ |
| 2.2 Risk, meaning, measure | Optional | own tags 2.1 (Core), A3, A6 | self-contained |
| 2.3 Measures, scores, order | Core | printed measures, A7, A6, own 1.2 (Core) | ✓ |
| **Route 2** | | | |
| Case brief · “Where Route 1 left off” | — | Route 1 Core 2.1 and 2.3 | ✓ |
| 3.1–3.4 | Optional | printed data, B1–B4 | self-contained |
| 3.5 Implementation items | Core | printed items, “SmartData today”, B5, B6 | ✓ |
| 3.6 Decision | Core | own 3.5, doubts table, baselines, B5, B6 | ✓ |
| **Cards** | | | |
| A1, A2, A4, A5, A6, A7 · B5, B6 | Core | each other and the case | ✓ |
| A3 · B1, B2, B3, B4 | Optional | — | no Core block needs them |

## Coverage: where each task block is taught

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 Data, information, insight · **Core** | A2 (four steps, tests, worked sort), A1 | Show the test questions · Check + clue · highlight the key words · reasoning after two checks · undo/redo · what to look at and an example for the insight |
| 1.2 A first forecast · **Core** | A4 (the four steps on Weser Cloud), A1 | Show where the numbers are · Show the formula + calculator · per-part clues · what to look at and an example for the sentence |
| 1.3 Valuable, at risk, insights · Optional | A5, A6 | Check (picks as a count, insights floor) + clue · what to look at and an example per insight |
| 1.4 Coaching reflection · Optional | A1, A6 | what to look at and an example per field |
| 2.1 Tag the records · **Core** | A5 (four patterns, pair tests, worked curves) | Show the test questions · Check + clue · highlight the key words · reasoning after two checks · undo/redo |
| 2.2 Risk, meaning, measure · Optional | A3, A6 | Your tally · Check per row with clues · Check my choices · what to look at and an example for the misread |
| 2.3 Measures, scores, order · **Core** | A7 (matching, explanatory-power rule, budget), A6 | How to read a measure card · Show the test questions · budget bar (a hint) · pattern coverage · Check · order check · what to look at and an example for the reason |
| 3.1 Principles · Optional | B1 | Check + clue · what to look at and an example per principle |
| 3.2 Data sources · Optional | B2 (decision first, 80% rule) | Show the test questions · Check (count) + clue |
| 3.3 Analysis components · Optional | B3 (four tests, limits from printed facts) | How to read a component line · Show the test questions · Check · what to look at and an example |
| 3.4 When to intervene · Optional | B4 (lift and cases rule, owners) | How to read a signal line · Show the test questions · Check (count) + clue |
| 3.5 Implementation items · **Core** | B5 (foundation first, owner and trigger tests, quality bar), B6 (the number methods) | How to read an item card · owner test · budget bar (a hint) · per trigger: the trigger kit (metric, number, month, action, each with why and where it comes from) and an example · pickup point kit · Check (three rules, hints only) |
| 3.6 Decision · **Core** | B5 (decision rules, assumption recipe), B6 (today plus a step, the month) | Doubts table · per assumption: what to look at and the numbers you can use and an example · tripwire: what to look at and the numbers you can use · challenge: what to look at, the share of false alarms and an example · Check (wait, activity metric, threshold) |
