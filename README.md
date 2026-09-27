# Retention Lab · Day 7

**Customer Retention & Buying Behaviour in B2B IT Sales · Module 4, Day 1 of 2.**
*Understanding data, analysing customer behaviour and recognising patterns.*
A self-study companion: study material with twelve live instruments, two tasks and two working documents, in **English and German**
(EN | DE in the top bar, `../CLAUDE.md` #32). It carries the shared standards `../CLAUDE.md` #1 to #28, the two-route form of #30
and the German version of #32.

The case company is **SmartData IT Solutions GmbH**, a German IT service provider: *customer behaviour unclear, high churn, decisions
based on experience instead of data* (the plan's case study). Route 1 works it with €160,000 and five months; Route 2 puts the learner
in the Chief Data Officer's chair with €180,000 and six months (Case assumption).

This repo was bootstrapped from `day6` (chrome, primitives, store pattern, tokens, the language machinery) and its content was
replaced. Nothing of NetSolutions or of the earlier Day 3 content remains in the tree.

> **Before you push:** `git remote -v` still points at `aion-cs-day2`, because the folder was copied from an earlier day. Create or
> select the `aion-cs-day7` repository and set the remote first (`../CLAUDE.md` #17). Nothing was committed or pushed.

## Routes

| Route | Content | Export |
|---|---|---|
| `/route-1/` **Levels 1 + 2** | **Materi A**: seven cards, 60 min (A1 gut feeling or data, A2 data → information → insight → decision, A3 big data and smart insights: chances and limits, A4 a first forecast: rates, lift, revenue at risk, A5 four behaviour patterns, A6 from pattern to action: value, risk, measure, uncertainty, A7 explanatory power × feasibility × effect). **Task 1, Customer Data Analysis**: *Part 1 · Turn data into insight:* 1.1 sort nine report lines into data, information or insight and write one insight, 1.2 a first forecast (F1–F3 and a sentence), 1.3 the two most valuable and the two most at-risk customers, three insights on three kinds of data, 1.4 coaching reflection. *Part 2 · Recognise patterns and act:* 2.1 tag twelve customer records with a pattern, 2.2 risk, meaning and measure per pattern, the uncertainties, a pattern you could misread, 2.3 choose, score and order three measures. | `1-{name}-day7-l1l2-data-analysis.html` |
| `/route-2/` **Level 3** | **Materi B**: five cards, 60 min (B1 data as a competitive advantage: the target vision, B2 relevant data sources: decision first, B3 a system for behavioural analysis: four tests, B4 decision logic: when to intervene, B5 deciding with uncertain data, and the architecture). **Task 2, Data Decision Memo**, assembling beside the questions: 3.1 three principles of the data-driven organisation, 3.2 core / later / leave out for eight data sources, 3.3 three analysis components rated on four tests and the greatest lever, 3.4 intervene / watch / no action and who acts for six signals, 3.5 prioritised measures for implementation, 3.6 the decision, three assumptions, the tripwire and the board's challenge. | `2-{name}-day7-l3-decision-memo.html` |

Minutes: Materi A 60 + Task 1 59 (6 + 10 + 9 + 5 + 8 + 10 + 12), Materi B 60 + Task 2 50 (5 + 8 + 10 + 8 + 10 + 9). All in `lib/routes.ts`.

## German version (CLAUDE.md #32)

Same machinery as Days 5 and 6: `lib/lang.ts` (`tt`, `t` + `bi`, number formats), `lib/i18n.tsx` (`LangProvider`, `LangSwitch`),
`ui.lang` in the persisted store. Common terms stay English in German sentences (Churn, Lift, Health Score, Big Data, Insight, Dashboard,
Owner, Tripwire, KPI…); explanations are German, formal "Sie". Mentor tools stay English; file names stay English.

## Stack

Next.js 14 App Router · TypeScript strict · Tailwind (CS tokens) · Zustand + `persist` (key `cs-d7-v1`, version 1, `skipHydration` +
`StoreHydrator`, deep `mergeDefaults`) · static export. No animation, drag-and-drop, PDF or chart library.

```bash
npm install
npm run dev          # http://localhost:3000
npm run typecheck
npm run verify:calc  # re-derives every figure and rule, and runs the mentor fill in both languages (110 checks)
npm run build        # writes the static site to out/  (stop `npm run dev` first)
```

## What is in the data

- `ladder.ts`: nine report lines (3 data, 3 information, 3 insight) with tests, clue, reason and rejected steps.
- `forecast.ts`: last year's records. Churn rate = leavers ÷ customers × 100; lift = rate ÷ rate of the others; revenue at risk =
  customers now × rate × revenue. 14 ÷ 40 = **F1 35%**; 35 ÷ (18 ÷ 360 × 100 = 5) = **F2 lift 7**; 52 × 0.35 × €18,000 = **F3 €327,600**.
  Worked example of A4 (Weser Cloud): 20%, 4%, lift 5, €72,000. Also the eight customers of 1.3 (valuable: Delta, Alpen; at risk: Brenner,
  Fuchs; traps: Contor frequent-but-small, Eifel long gap with rising use) and the three data bases of the insights.
- `patterns.ts`: four patterns with tests and pair tests; twelve records (3 each; left: anchored 0, fading 2, dormant 2, cyclical 0);
  the risk rule; meaning and measure per pattern; seven uncertainties (four real).
- `measures.ts`: nine measures with cost, weeks and the evidence they rest on. Explanatory power follows from the evidence (pattern 3,
  some 2, hunch 1). Early warning, activation and health score score 18 and cost €105,000.
- `route2.ts`: six principles, eight data sources (rule: decision named? ≥ 80% complete?), eight analysis components with printed facts
  and limits, six signals with lift and cases (rule: lift ≥ 3 and ≥ 20 cases → intervene; lift ≥ 1.5 → watch; else no action), eight
  architecture items (model €165,000 of €180,000; no black box), owners, triggers, three decisions, KPIs and the board's challenge.

## Mentor bar

The first element on every page. Enter `muchson123` once and every model answer of Routes 1 and 2 fills in (plus a participant name if
empty and every calculator part), so each export downloads straight away. The same unlock shows the answer keys (1.1, 1.3 picks, 2.1,
2.2 rows and uncertainties, 2.3 measures and order, 3.1–3.6) and a worked answer for every other question (F1–F3 as step tables with
pitfalls, every free text with what to look for). Client-side convenience gate, not security; a reload locks it.

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
   the Route 2 budget (€180,000), the lifts, the KPI baselines and the board's challenge. The brief gives €160,000 and five months.
4. **German by the user's standing request (#32)**, which changes CURRICULUM-GUIDE §1 ("English only"); English stays the default.
5. **Not built as a Friday capstone (#29).** #29 says Friday days are named in each prompt ("about Day 7"); this request did not name
   Day 7 as a Friday, so it follows #30. If Day 7 is a Friday, the capstone conversion of #29 is still to do.
6. **Risk per pattern is checked against the learner's own tally**, so one mis-tag in 2.1 is not punished twice in 2.2.
7. **Sources to re-check before teaching:** citations are given by their usual details; page ranges and editions differ between
   printings. The churn, lift and revenue figures are illustrations, not research findings.

## Coverage: where each task block is taught

| Block | Taught in | Help while answering |
|---|---|---|
| 1.1 Data, information, insight | A2 (four steps, tests, worked sort) | Show the test questions · Check + clue · reasoning after two checks · undo/redo |
| 1.2 A first forecast | A4 (the four steps on Weser Cloud) | Show where the numbers are · Show the formula + calculator · per-part clues |
| 1.3 Valuable, at risk, insights | A5, A6 (value = revenue, churn = usage −30% + gap; three data bases) | Check (picks as a count, insights floor) + clue |
| 1.4 Coaching reflection | A1, A6 | Worked answers for the mentor |
| 2.1 Tag the records | A5 (four patterns, pair tests, worked curves) | Show the test questions · Check + clue · reasoning after two checks · undo/redo |
| 2.2 Risk, meaning, measure | A3, A6 (risk rule, meanings, measures, uncertainties) | Your tally · Check per row with clues · Check my choices |
| 2.3 Measures, scores, order | A6, A7 (matching, explanatory-power rule, budget) | Show the test questions · budget bar · pattern coverage · Check · order check |
| 3.1 Principles | B1 | Check (definitions and decision rules) + clue |
| 3.2 Data sources | B2 (decision first, 80% rule) | Show the test questions · Check (count) + clue |
| 3.3 Analysis components | B3 (four tests, limits from printed facts) | Show the test questions · Check (limits, early count) |
| 3.4 When to intervene | B4 (lift and cases rule, owners) | Show the test questions · Check (count) + clue |
| 3.5 Architecture | B5 (foundation first, budget, no black box; owner and trigger tests) | Show the owner test · budget bar · plan sentences · Check (three rules) |
| 3.6 Decision | B5 (decision rules, tripwire, premortem) | Baselines printed · Check (wait, activity metric, threshold) |
