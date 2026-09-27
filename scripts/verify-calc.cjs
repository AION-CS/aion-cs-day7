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
