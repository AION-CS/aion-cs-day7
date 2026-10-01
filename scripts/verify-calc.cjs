/**
 * Re-derives every figure and every rule the day rests on, from the same data files the site uses, and compares them with the
 * results briefed in the README. Run: npm run verify:calc. A failed line prints FAIL and the process exits with code 1.
 *
 * The data files are TypeScript with "@/" imports, so a tiny loader transpiles them on the fly (no test framework, no extra dependency).
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");
const ts = require(path.join(process.cwd(), "node_modules", "typescript"));

const root = process.cwd();
const origResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (request.startsWith("@/")) {
    const base = path.join(root, request.slice(2));
    for (const ext of [".ts", ".tsx", "/index.ts"]) if (fs.existsSync(base + ext)) return base + ext;
  }
  return origResolve.call(this, request, ...rest);
};
for (const ext of [".ts", ".tsx"])
  require.extensions[ext] = function (module, filename) {
    const out = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    });
    module._compile(out.outputText, filename);
  };

let failed = 0;
const ok = (name, cond, detail = "") => {
  console.log(`${cond ? "ok  " : "FAIL"}  ${name}${detail ? "  " + detail : ""}`);
  if (!cond) failed++;
};
const eq = (name, a, b) => ok(name, JSON.stringify(a) === JSON.stringify(b), `got ${JSON.stringify(a)}, want ${JSON.stringify(b)}`);

const lang = require("@/lib/lang");
const fc = require("@/data/forecast");
const ld = require("@/data/ladder");
const pt = require("@/data/patterns");
const meas = require("@/data/measures");
const r2 = require("@/data/route2");
const key = require("@/data/mentorKey");
const checks = require("@/lib/checks");
const calc = require("@/lib/calcBuilder");
const missing = require("@/lib/missing");
const progress = require("@/lib/progress");
const store = require("@/store/useStore");

// --- Block 1.2 --------------------------------------------------------------------
eq("F1 churn rate, usage fell", fc.FORECAST.f1, 35);
eq("rate of the other customers", fc.FORECAST.stableRate, 5);
eq("F2 lift", fc.FORECAST.f2, 7);
eq("F3 revenue at risk", fc.FORECAST.f3, 327600);
for (const f of ["F1", "F2", "F3"]) {
  const b = calc.FIGURE_BUILDERS[f];
  const parts = calc.modelParts({ [f]: b });
  eq(`builder ${f} reproduces the answer`, calc.builderResult(b, f, parts), calc.figAnswer(f));
  eq(`builder ${f} flags nothing on model parts`, calc.wrongParts(b, f, parts), []);
}
const w1 = { ...calc.modelParts({ F1: calc.FIGURE_BUILDERS.F1 }), "F1.customers": "400" };
eq("builder F1 flags exactly the wrong part", calc.wrongParts(calc.FIGURE_BUILDERS.F1, "F1", w1), ["F1.customers"]);
const w3 = { ...calc.modelParts({ F3: calc.FIGURE_BUILDERS.F3 }), "F3.now": "40" };
eq("builder F3 flags exactly the wrong part", calc.wrongParts(calc.FIGURE_BUILDERS.F3, "F3", w3), ["F3.now"]);
eq("Weser worked example", [fc.WESER_RESULT.rate, fc.WESER_RESULT.other, fc.WESER_RESULT.lift, fc.WESER_RESULT.risk], [20, 4, 5, 72000]);
ok("worked example uses other numbers than the task", fc.WESER.revenue !== fc.SMART.revenue && fc.WESER.fallingNow !== fc.SMART.fallingNow);
ok("sentence check accepts “35%”", checks.citesForecastFigure("About 35% of them left."));
ok("sentence check accepts “seven times”", checks.citesForecastFigure("They left seven times as often."));
ok("sentence check rejects a sentence with no figure", !checks.citesForecastFigure("Falling usage is a warning sign for us."));

// --- Block 1.1 / 1.3 ----------------------------------------------------------------
const lvl = ld.LINES.reduce((o, r) => ({ ...o, [r.truth]: (o[r.truth] || 0) + 1 }), {});
eq("lines: three per step", lvl, { data: 3, info: 3, insight: 3 });
const byRev = [...fc.CUSTOMERS].sort((a, b) => b.revenue - a.revenue).slice(0, 2).map((c) => c.id);
eq("valuable = top two by revenue", [...byRev].sort(), [...fc.VALUABLE_TRUTH].sort());
const risky = fc.CUSTOMERS.filter((c) => c.trend <= -30).map((c) => c.id);
eq("churn = usage down 30% or more", [...risky].sort(), [...fc.CHURN_TRUTH].sort());
ok("most frequent buyer is not valuable", !fc.VALUABLE_TRUTH.includes([...fc.CUSTOMERS].sort((a, b) => b.orders - a.orders)[0].id));
ok("longest gap with rising use is not a churn pick", (() => { const c = [...fc.CUSTOMERS].filter((x) => x.trend > 0).sort((a, b) => b.days - a.days)[0]; return !fc.CHURN_TRUTH.includes(c.id); })());

// --- Block 2.1 / 2.2 ----------------------------------------------------------------
eq("records per pattern", pt.TRUTH_COUNTS, { anchored: 3, fading: 3, dormant: 3, cyclical: 3 });
eq("leavers per pattern", pt.TRUTH_LEFT, { anchored: 0, fading: 2, dormant: 2, cyclical: 0 });
eq("model risk per pattern", pt.PATTERN_IDS.map((x) => pt.riskOf(pt.TRUTH_LEFT[x], pt.TRUTH_COUNTS[x])), ["low", "high", "high", "low"]);
eq("real uncertainties", pt.UNCERTAINTIES.filter((w) => w.real).map((w) => w.id), ["sample", "cause", "missing", "shift"]);
ok("every pattern has its own measure", new Set(Object.values(pt.MEASURE_TRUTH)).size === 4);

// --- Block 2.3 --------------------------------------------------------------------
const scores = Object.fromEntries(meas.MEASURES.map((m) => [m.id, meas.modelScore(m.id)]));
eq("model scores", scores, { earlywarn: 18, onboard: 18, health: 18, calendar: 6, expand: 12, bigdata: 1, blackbox: 2, discount: 3, gutreview: 3 });
eq("model three cost", meas.MODEL_COST, 105000);
ok("model three fit the budget", meas.MODEL_COST <= meas.BUDGET);
eq("model three are the three highest scores", [...meas.MEASURES].sort((a, b) => meas.modelScore(b.id) - meas.modelScore(a.id)).slice(0, 3).map((m) => m.id).sort(), [...meas.MODEL_MEASURES].sort());
ok("big data and discount serve no pattern", meas.MEASURE_BY_ID.bigdata.targets.length === 0 && meas.MEASURE_BY_ID.discount.targets.length === 0);

// --- Route 2 --------------------------------------------------------------------
eq("source uses by the rule", r2.SOURCES.map((s) => r2.useOf(s)), ["core", "core", "core", "core", "later", "later", "leave", "leave"]);
eq("actions by the rule", r2.SITUATIONS.map((s) => r2.actionOf(s)), ["intervene", "intervene", "watch", "watch", "none", "intervene"]);
for (const c of r2.COMPS) for (const k of r2.CRIT_IDS) ok(`model rating within the printed limit (${c.id}.${k})`, c.model[k] <= r2.maxRating(c.id, k));
ok("model components all warn early", checks.earlyCount(r2.MODEL_COMPS) === r2.MODEL_COMPS.length);
const archCost = r2.MODEL_ARCH.reduce((s, id) => s + r2.ARCH_BY_ID[id].cost, 0);
eq("model architecture cost", archCost, 165000);
ok("model architecture inside the budget", archCost <= r2.R2_BUDGET);
ok("adding the AI platform breaks the budget", archCost + r2.ARCH_BY_ID.ai.cost > r2.R2_BUDGET);

// --- Route 2 numbers: every number is found from the printed figures (CLAUDE.md #44, Materi B6) -------------------
const calcR2 = require("@/lib/calcR2");
const modelState = () => calcR2.modelR2(Object.fromEntries(r2.MODEL_ARCH.map((id) => [id, true])), { ...r2.MODEL_START });
{
  const ms = modelState();
  const nv = (k) => calcR2.numberView(k, ms);
  eq("SmartData today: 14 + 18 leavers, 400 customers, 8% churn", [r2.R2_FIG.left, r2.R2_FIG.customers, Math.round((r2.R2_FIG.left / r2.R2_FIG.customers) * 100)], [32, 400, 8]);
  eq("SmartData today agrees with Route 1's records", [fc.SMART.falling.left + fc.SMART.stable.left, fc.SMART.falling.customers + fc.SMART.stable.customers, r2.R2_FIG.flagged, r2.R2_FIG.groupFell, r2.R2_FIG.revenue], [32, 400, fc.SMART.fallingNow, fc.SMART.falling.customers, fc.SMART.revenue]);
  eq("trigger number: foundation = weakest of usage, orders, tickets", nv("trig-foundation").result, 90);
  eq("trigger number: health = half the gap from 14 of 32, to the nearest 5", nv("trig-health").result, 70);
  eq("trigger number: playbook = 52 ÷ 13 rounded up", nv("trig-playbook").result, 4);
  eq("trigger number: cohort = two customers of 40", nv("trig-cohort").result, 5);
  eq("trigger number: training = two thirds of 10 rounded up", nv("trig-training").result, 7);
  eq("trigger number: quality = the quality bar", nv("trig-quality").result, 80);
  eq("month of each model item = start + set-up + effect", r2.MODEL_ARCH.map((id) => nv("month-" + id).result), [3, 5, 4, 5, 5, 4]);
  eq("pickup number of the AI platform = 70,000 ÷ 18,000 rounded up", nv("pickup-ai").result, 4);
  eq("tripwire threshold = 30 + ⌈55,000 ÷ 18,000⌉ × 100 ÷ 52, rounded up", nv("trip").result, r2.MODEL_TRIPWIRE.threshold);
  eq("tripwire month = the latest customer item month", calcR2.tripMonth(ms).month, r2.MODEL_TRIPWIRE.month);
  eq("false alarms of the board's challenge = 15 of 60", nv("challenge").result, 25);
  for (const id of r2.MODEL_ARCH) {
    const n = nv("trig-" + id).result;
    ok("model trigger of " + id + " names its number " + n, r2.MODEL_TRIGGER[id].includes(String(n)));
    const m = nv("month-" + id).result;
    ok("model trigger of " + id + " names its month " + m, r2.MODEL_TRIGGER[id].includes("month " + m));
    ok("month of " + id + " is inside the plan", m <= r2.R2_MONTHS);
  }
  ok("every item has a number, a month and a pickup view", Object.keys(r2.ARCH_BY_ID).every((id) => Number.isFinite(nv("trig-" + id).result) && Number.isFinite(nv("month-" + id).result) && Number.isFinite(nv("pickup-" + id).result)));
  ok("every input of every number links to an element", Object.keys(r2.ARCH_BY_ID).every((id) => ["trig-", "pickup-"].every((k) => nv(k + id).sources.every((x) => x.target))));
  const ka = key.KEY_R2();
  ok("model assumptions use the numbers of the kit", ka.assumptions[0].includes("70%") && ka.assumptions[1].includes("38%") && ka.assumptions[2].includes("90%"));
  ok("model pickup uses the cost-of-waiting number", ka.pickup.includes("4 or more") || ka.pickup.includes("mindestens 4"));
  ok("model tripwire is better than today", r2.MODEL_TRIPWIRE.threshold > r2.KPI_BY_ID.saved.baseline);
  eq("not-ready: month without a start month", calcR2.numberView("month-health", { alloc: {}, start: {}, owner: {} }).ready !== null, true);
  eq("not-ready: tripwire without a funded customer item", calcR2.numberView("trip", { alloc: {}, start: {}, owner: {} }).ready !== null, true);
}
const tk = require("@/data/triggerKit");
ok("every item has a metric with its reason and three actions with reasons", Object.keys(r2.ARCH_BY_ID).every((id) => { const k = tk.TRIGGER_KIT[id]; return k && k.metric && k.metricWhy && k.actions.length === 3 && k.actions.every((a) => a.text && a.why) && k.reason; }));
ok("the first action of each model item is the model trigger's own", r2.MODEL_ARCH.every((id) => { const a = tk.TRIGGER_KIT[id].actions[0].text; return r2.MODEL_TRIGGER[id].includes(a); }));
ok("no printed answer text of the learner-facing parts names an Optional block or card (Block 3.1 to 3.4, Materi B1 to B4)", (() => {
  const src = (f) => fs.readFileSync(path.join(root, f), "utf8");
  const blocks = src("components/task2/Blocks.tsx");
  const core = blocks.slice(blocks.indexOf("/* ---- Block 3.5 */".replace("---- ", "------------------------------------------------------------------ ")));
  const texts = [core, src("components/task2/Kits.tsx"), src("data/triggerKit.ts"), src("lib/calcR2.ts"), src("data/route2.ts").slice(src("data/route2.ts").indexOf("3.5 · prioritised"))];
  return texts.every((t) => !/Blocks? 3\.[1-4]\b|Materi B[1-4]\b/.test(t.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "")));
})());
ok("no Core block of Route 1 names an Optional block or card (Block 1.3, 1.4, 2.2, Materi A3)", (() => {
  const p1 = fs.readFileSync(path.join(root, "components/task1/Part1.tsx"), "utf8");
  const p2 = fs.readFileSync(path.join(root, "components/task1/Part2.tsx"), "utf8");
  const slice = (src, a, b) => src.slice(src.indexOf(a), b ? src.indexOf(b) : undefined);
  const parts = [slice(p1, "export function Block11", "export function Block13"), slice(p2, "export function Block21", "export function Block22"), slice(p2, "export function Block23")];
  return parts.every((t) => !/Block 1\.[34]\b|Block 2\.2\b|Materi A3\b/.test(t.replace(/\/\*[\s\S]*?\*\//g, "")));
})());

// --- Core and Optional (CLAUDE.md #35, #40) ---------------------------------------------
{
  const optional = progress.OPTIONAL_BLOCKS;
  eq("Route 1 has four Core blocks", ["b11", "b12", "b13", "b14", "b21", "b22", "b23"].filter((b) => !optional.includes(b)), ["b11", "b12", "b21", "b23"]);
  eq("Route 2 Core blocks", ["b31", "b32", "b33", "b34", "b35", "b36"].filter((b) => !optional.includes(b)), ["b35", "b36"]);
  const mi = require("@/data/materialIndex");
  eq("Optional cards", mi.MATERIALS.filter((m) => m.optional).map((m) => m.id), ["A3", "B1", "B2", "B3", "B4"]);
  eq("Materi A minutes add up to 60", mi.MATERIALS.filter((m) => m.block === "A").reduce((s, m) => s + m.minutes, 0), 60);
  eq("Materi B minutes add up to 60", mi.MATERIALS.filter((m) => m.block === "B").reduce((s, m) => s + m.minutes, 0), 60);
  // Core-only fill: only the Core fields are entered, and both missing lists must be empty (Optional blocks are never required).
  for (const l of ["en", "de"]) {
    lang.setCurrentLang(l);
    const k1 = key.KEY_L1();
    const l1 = { ...store.emptyL1(), sort: k1.sort, extraInsight: k1.extraInsight, fig: k1.fig, parts: calc.modelParts(calc.FIGURE_BUILDERS), meaning: k1.meaning, tags: k1.tags, chosen: k1.chosen, aims: k1.aims, exp: k1.exp, fea: k1.fea, eff: k1.eff, order: k1.order, why: k1.why };
    const k2 = key.KEY_R2();
    const rr = { ...store.emptyR2(), alloc: k2.alloc, start: k2.start, owner: k2.owner, trigger: k2.trigger, postponed: k2.postponed, pickup: k2.pickup, decision: k2.decision, assumptions: k2.assumptions, tripKpi: k2.tripKpi, tripThreshold: k2.tripThreshold, tripMonth: k2.tripMonth, tripAction: k2.tripAction, challenge: k2.challenge };
    const p = { participant: { name: "Core Only" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: l }, l1, r2: rr };
    eq("[" + l + "] Core-only fill leaves Route 1's missing list empty", missing.l1Missing(p).map((m) => m.label), []);
    eq("[" + l + "] Core-only fill leaves Route 2's missing list empty", missing.r2Missing(p).map((m) => m.label), []);
    const prog1 = progress.dossierProgress({ ...p, ui: { ...p.ui, sectionsRead: Object.fromEntries(mi.MATERIALS.filter((m) => !m.optional).map((m) => [m.id, true])) } }, 1);
    eq("[" + l + "] Route 1 ring is full on Core only", prog1.done, prog1.total);
    // an over-budget plan with a reason still exports (decision part, CLAUDE.md #38)
    const over = { ...rr, alloc: { ...rr.alloc, ai: true, feed: true }, start: { ...rr.start, ai: 1, feed: 1 }, owner: { ...rr.owner, ai: "cdo", feed: "cdo" }, trigger: { ...rr.trigger, ai: "If by month 5 the platform flagged fewer than 70% of cancellations, stop it.", feed: "If fewer than 80% of customers are matched by month 5, stop the feed." } };
    eq("[" + l + "] an over-budget plan with every field filled is not missing anything", missing.r2Missing({ ...p, r2: over }).map((m) => m.label), []);
  }
  lang.setCurrentLang("en");
}

// --- key phrases and examples ----------------------------------------------------------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  ok("[" + l + "] every sort line holds its key phrase as an exact substring", ld.LINES.every((x) => x.text.includes(ld.LINE_KEY[x.id])));
  ok("[" + l + "] every record holds its key phrase as an exact substring", pt.RECORDS.every((x) => x.text.includes(pt.REC_KEY[x.id])));
  const mg = require("@/lib/mentorGuide");
  const guides = [mg.meaningGuide(), mg.insightGuide(0), mg.insightGuide(1), mg.insightGuide(2), mg.whyGuide(), mg.greatestGuide(), mg.postponedGuide(), mg.challengeGuide(), mg.tripwireGuide(), mg.assumptionGuide(0), mg.assumptionGuide(1), mg.assumptionGuide(2), ...r2.MODEL_ARCH.map((id) => mg.triggerGuide(id))];
  ok("[" + l + "] every graded free-text field has a learner example that differs from the model answer", guides.every((g) => g.example && g.example !== g.answer));
  ok("[" + l + "] no example repeats a number of the model answer's own figures (the case's results)", [mg.meaningGuide().example].every((e) => !e.includes("327") && !e.includes("35%")));
}
lang.setCurrentLang("en");

// --- the mentor fill, in both languages --------------------------------------------
for (const l of ["en", "de"]) {
  lang.setCurrentLang(l);
  const l1 = { ...store.emptyL1(), ...key.KEY_L1(), parts: calc.modelParts(calc.FIGURE_BUILDERS) };
  const rr = { ...store.emptyR2(), ...key.KEY_R2() };
  const p = { participant: { name: "Mentor Check" }, ui: { bannerDismissed: {}, sectionsRead: {}, lang: l }, l1, r2: rr };
  eq(`[${l}] mentor fill leaves Route 1 missing list empty`, missing.l1Missing(p).map((m) => m.label), []);
  eq(`[${l}] mentor fill leaves Route 2 missing list empty`, missing.r2Missing(p).map((m) => m.label), []);
  const tb = progress.taskBlocks(p);
  eq(`[${l}] every task block complete after the fill`, Object.values(tb).every(Boolean), true);
  eq(`[${l}] model sort all hold`, checks.sortHolds(l1.sort), { holds: 9, placed: 9 });
  eq(`[${l}] model picks all hold`, checks.pickHolds(l1), { holds: 4, total: 4 });
  eq(`[${l}] model insights pass the floor`, checks.insightFlags(l1), []);
  ok(`[${l}] model sentence cites a figure`, checks.citesForecastFigure(l1.meaning));
  eq(`[${l}] model tags all hold`, checks.tagHolds(l1.tags), { holds: 12, placed: 12 });
  eq(`[${l}] model uncertainties all real`, checks.uncHolds(l1.unc), { holds: 3, chosen: 3 });
  const rc = checks.rowChecks(l1);
  eq(`[${l}] model pattern rows hold`, [rc.holds, rc.total, rc.flags], [12, 12, []]);
  for (const id of l1.chosen) ok(`[${l}] model aims and explanatory power hold (${id})`, checks.aimsHold(id, l1.aims[id]) && checks.expHolds(id, l1.exp[id]));
  eq(`[${l}] model order has no inversion`, checks.orderInversions(l1), []);
  eq(`[${l}] model principles hold`, checks.principlesHold(rr), { defs: true, rules: true });
  eq(`[${l}] model sources hold`, checks.sourceHolds(rr), { holds: 8, total: 8 });
  eq(`[${l}] model ratings flag nothing`, checks.ratingFlags(rr), []);
  eq(`[${l}] model decision logic holds`, checks.logicHolds(rr), { holds: 12, total: 12 });
  eq(`[${l}] model architecture holds all rules`, checks.seqRules(rr), { baseline: true, budget: true, explainable: true, hasBaseline: true });
  eq(`[${l}] model tripwire flags nothing`, checks.tripFlagsOf(rr), []);
}
lang.setCurrentLang("en");

console.log(failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed.");
process.exit(failed ? 1 : 0);
