import { ARCH_BY_ID, BOARD_FACTS, CUSTOMER_ITEMS, FIG_ROW_ID, QUALITY_BAR, R2_FIG, SOURCE_BY_ID, setupMonths } from "@/data/route2";
import type { ArchId } from "@/data/route2";
import type { CalcBuilder } from "@/lib/calcBuilder";
import { euro, num, tt } from "@/lib/lang";
import type { R2State } from "@/store/useStore";

/**
 * The numbers of Route 2 (CLAUDE.md #44): every number a trigger, a pickup point, an assumption, the tripwire or the board's challenge
 * needs is built here from the rows of "SmartData today" and the item cards, by the method taught in Materi B6. The learner does not
 * calculate: "Show the numbers you can use" (components/ui/NumbersHelp.tsx) and the sentence kits (components/task2/Kits.tsx) show each
 * number, why it is that number and where every input is printed, and the learner words the answer. Where a part depends on the learner's
 * own plan (their start months, the items they funded) it is read from their state. The same builders feed the model answers
 * (data/mentorKey.ts) and the mentor's worked answers (lib/mentorGuide.ts), so nothing can drift apart.
 */
const up = (x: number) => Math.ceil(x - 1e-9);
const near5 = (x: number) => Math.round(x / 5) * 5;
const row = (label: string) => tt(`“SmartData today”: the row “${label}”.`, `„SmartData heute“: die Zeile „${label}“.`);

/** Where each printed Route 2 figure lives, for the kits (#42): label, printed value, and the row id to flash. */
export function figRef(k: "customers" | "left" | "leftFell" | "groupFell" | "flagged" | "revenue" | "save" | "churn" | "managers" | "weeksQuarter" | "usage" | "orders" | "tickets" | "crm" | "bar") {
  const v: Record<typeof k, [string, string]> = {
    customers: [tt("Customers", "Kunden"), String(R2_FIG.customers)],
    left: [tt("Customers who left last year", "Kunden, die letztes Jahr gingen"), String(R2_FIG.left)],
    leftFell: [tt("Of them, usage had fallen by 30% or more before they left", "Davon: Nutzung war vor dem Gehen um 30 % oder mehr gesunken"), String(R2_FIG.leftFell)],
    groupFell: [tt("Last year's customers whose usage fell by 30% or more", "Kunden des letzten Jahres mit um 30 % oder mehr gesunkener Nutzung"), String(R2_FIG.groupFell)],
    flagged: [tt("Customers flagged now (usage fell by 30% or more this quarter)", "Jetzt markierte Kunden (Nutzung in diesem Quartal um 30 % oder mehr gesunken)"), String(R2_FIG.flagged)],
    revenue: [tt("Average yearly revenue per customer", "Durchschnittlicher Jahresumsatz pro Kunde"), euro(R2_FIG.revenue)],
    save: [tt("Flagged customers who stay today (save rate)", "Heute gehaltene markierte Kunden (Save Rate)"), `${R2_FIG.save}%`],
    churn: [tt("Yearly churn of all customers", "Jährlicher Churn aller Kunden"), `${R2_FIG.churn}%`],
    managers: [tt("Sales managers", "Vertriebsleiter"), String(R2_FIG.managers)],
    weeksQuarter: [tt("Weeks in a quarter", "Wochen in einem Quartal"), String(R2_FIG.weeksQuarter)],
    usage: [tt("Platform usage logs · complete", "Plattform-Nutzungslogs · vollständig"), `${SOURCE_BY_ID.usage.complete}%`],
    orders: [tt("Order history · complete", "Bestellhistorie · vollständig"), `${SOURCE_BY_ID.orders.complete}%`],
    tickets: [tt("Support tickets · complete", "Support-Tickets · vollständig"), `${SOURCE_BY_ID.tickets.complete}%`],
    crm: [tt("CRM notes · complete", "CRM-Notizen · vollständig"), `${SOURCE_BY_ID.crmnotes.complete}%`],
    bar: [tt("The quality bar: a source is usable from", "Die Qualitätslinie: Eine Quelle ist nutzbar ab"), `${QUALITY_BAR}%`],
  };
  const [label, value] = v[k];
  return { label, value, target: FIG_ROW_ID(k) };
}

/** The month an item's trigger can first be read: the learner's start month + months of set-up + months until the effect shows. */
export function monthBuilder(id: ArchId): CalcBuilder {
  const a = ARCH_BY_ID[id];
  return {
    get parts() {
      return [
        { id: "start", label: tt("Your start month", "Ihr Startmonat"), expected: 0, clue: tt("Your own choice under “Starts in month” on this item's card.", "Ihre eigene Wahl unter „Startet in Monat“ auf der Karte dieses Punkts.") },
        { id: "setup", label: tt("Months of set-up (weeks ÷ 4, rounded up)", "Monate Einrichtung (Wochen ÷ 4, aufgerundet)"), expected: setupMonths(a.weeks), clue: tt(`The item card: “${a.weeks} weeks to be in use”.`, `Die Karte des Punkts: „${a.weeks} Wochen bis zum Einsatz“.`) },
        { id: "respond", label: tt("Months until the effect shows", "Monate, bis die Wirkung sichtbar ist"), expected: a.respond, clue: tt("The item card: “effect shows after”.", "Die Karte des Punkts: „Wirkung sichtbar nach“.") },
      ];
    },
    compute: (v) => v.start + v.setup + v.respond,
    show: (v) => `${v.start} + ${v.setup} + ${v.respond}`,
  };
}

/** The number a funded item's trigger uses. Its parts follow what the trigger counts (CLAUDE.md #44, Materi B6). */
export function triggerBuilder(id: ArchId): CalcBuilder {
  const a = ARCH_BY_ID[id];
  const bar: CalcBuilder = {
    get parts() {
      return [{ id: "bar", label: tt("The quality bar (%)", "Die Qualitätslinie (%)"), expected: QUALITY_BAR, clue: row(figRef("bar").label) }];
    },
    compute: (v) => v.bar,
    show: (v) => `${v.bar}% ${tt("(the bar a source must reach to be used)", "(die Linie, die eine Quelle erreichen muss, um genutzt zu werden)")}`,
  };
  if (a.result === "joined")
    return {
      get parts() {
        return [
          { id: "usage", label: tt("Usage logs, complete (%)", "Nutzungslogs, vollständig (%)"), expected: SOURCE_BY_ID.usage.complete, clue: row(figRef("usage").label) },
          { id: "orders", label: tt("Order history, complete (%)", "Bestellhistorie, vollständig (%)"), expected: SOURCE_BY_ID.orders.complete, clue: row(figRef("orders").label) },
          { id: "tickets", label: tt("Support tickets, complete (%)", "Support-Tickets, vollständig (%)"), expected: SOURCE_BY_ID.tickets.complete, clue: row(figRef("tickets").label) },
        ];
      },
      compute: (v) => Math.min(v.usage, v.orders, v.tickets),
      show: (v) => tt(`the lowest of ${v.usage}, ${v.orders}, ${v.tickets}`, `der niedrigste von ${v.usage}, ${v.orders}, ${v.tickets}`),
    };
  if (a.result === "caught")
    return {
      get parts() {
        return [
          { id: "fell", label: tt("Leavers whose usage had fallen", "Abgänge mit gesunkener Nutzung"), expected: R2_FIG.leftFell, clue: row(figRef("leftFell").label) },
          { id: "left", label: tt("Customers who left last year", "Kunden, die letztes Jahr gingen"), expected: R2_FIG.left, clue: row(figRef("left").label) },
        ];
      },
      compute: (v) => {
        const base = (v.fell / v.left) * 100;
        return near5(base + (100 - base) / 2);
      },
      show: (v) => {
        const base = (Number(v.fell) / Number(v.left)) * 100;
        const half = (100 - base) / 2;
        return tt(`${v.fell} ÷ ${v.left} = ${num(base, { maximumFractionDigits: 0 })}% today; half of the missing ${num(100 - base, { maximumFractionDigits: 0 })} points is ${num(half, { maximumFractionDigits: 0 })}; ${num(base + half, { maximumFractionDigits: 0 })}% rounded to the nearest 5`, `${v.fell} ÷ ${v.left} = ${num(base, { maximumFractionDigits: 0 })} % heute; die Hälfte der fehlenden ${num(100 - base, { maximumFractionDigits: 0 })} Punkte sind ${num(half, { maximumFractionDigits: 0 })}; ${num(base + half, { maximumFractionDigits: 0 })} % auf die nächsten 5 gerundet`);
      },
    };
  if (a.result === "calls")
    return {
      get parts() {
        return [
          { id: "flagged", label: tt("Customers flagged now", "Jetzt markierte Kunden"), expected: R2_FIG.flagged, clue: row(figRef("flagged").label) },
          { id: "weeks", label: tt("Weeks in a quarter", "Wochen in einem Quartal"), expected: R2_FIG.weeksQuarter, clue: row(figRef("weeksQuarter").label) },
        ];
      },
      compute: (v) => up(v.flagged / v.weeks),
      show: (v) => `${v.flagged} ÷ ${v.weeks} ${tt("rounded up", "aufgerundet")}`,
    };
  if (a.result === "gap")
    return {
      get parts() {
        return [{ id: "group", label: tt("Customers in the group", "Kunden in der Gruppe"), expected: R2_FIG.groupFell, clue: row(figRef("groupFell").label) }];
      },
      compute: (v) => (2 * 100) / v.group,
      show: (v) => tt(`one customer is 100 ÷ ${v.group} = ${num(100 / Number(v.group), { maximumFractionDigits: 1 })} points; two customers are 2 × 100 ÷ ${v.group}`, `ein Kunde sind 100 ÷ ${v.group} = ${num(100 / Number(v.group), { maximumFractionDigits: 1 })} Punkte; zwei Kunden sind 2 × 100 ÷ ${v.group}`),
    };
  if (a.result === "managers")
    return {
      get parts() {
        return [{ id: "managers", label: tt("Sales managers", "Vertriebsleiter"), expected: R2_FIG.managers, clue: row(figRef("managers").label) }];
      },
      compute: (v) => up((v.managers * 2) / 3),
      show: (v) => `${v.managers} × 2 ÷ 3 ${tt("rounded up (two thirds)", "aufgerundet (zwei Drittel)")}`,
    };
  return bar;
}

/** Pickup point (cost of waiting): the cost of the item left out ÷ the yearly revenue one customer brings. */
export function pickupBuilder(item: ArchId | null): CalcBuilder {
  const cost = item ? ARCH_BY_ID[item].cost : 0;
  return {
    get parts() {
      return [
        { id: "cost", label: tt("Cost of the item you leave out (€)", "Kosten des weggelassenen Punkts (€)"), expected: cost, clue: tt("The card of the item you left out: its printed cost.", "Die Karte des weggelassenen Punkts: seine gedruckten Kosten.") },
        { id: "revenue", label: tt("Yearly revenue of one customer (€)", "Jahresumsatz eines Kunden (€)"), expected: R2_FIG.revenue, clue: row(figRef("revenue").label) },
      ];
    },
    compute: (v) => up(v.cost / v.revenue),
    show: (v) => `${v.cost} ÷ ${v.revenue} ${tt("rounded up", "aufgerundet")}`,
  };
}

/** Tripwire: today's save rate + the step the funded customer items need to pay back (cost ÷ revenue per customer, as customers of the flagged group). */
export function tripBuilder(r2: R2State): CalcBuilder {
  const funded = (Object.keys(r2.alloc) as ArchId[]).filter((id) => r2.alloc[id] && ARCH_BY_ID[id]);
  const cost = funded.filter((id) => CUSTOMER_ITEMS.includes(id)).reduce((s, id) => s + ARCH_BY_ID[id].cost, 0);
  return {
    get parts() {
      return [
        { id: "save", label: tt("Save rate today (%)", "Save Rate heute (%)"), expected: R2_FIG.save, clue: row(figRef("save").label) },
        { id: "cost", label: tt("Cost of your funded items that act on flagged customers (€)", "Kosten Ihrer finanzierten Punkte, die bei markierten Kunden wirken (€)"), expected: cost, clue: tt("Your own plan in Block 3.5: add the costs of the funded items whose card says “act on flagged customers”.", "Ihr eigener Plan in Block 3.5: Addieren Sie die Kosten der finanzierten Punkte, deren Karte „wirkt bei markierten Kunden“ sagt.") },
        { id: "revenue", label: tt("Yearly revenue of one customer (€)", "Jahresumsatz eines Kunden (€)"), expected: R2_FIG.revenue, clue: row(figRef("revenue").label) },
        { id: "flagged", label: tt("Customers flagged now", "Jetzt markierte Kunden"), expected: R2_FIG.flagged, clue: row(figRef("flagged").label) },
      ];
    },
    compute: (v) => up(v.save + (up(v.cost / v.revenue) * 100) / v.flagged),
    show: (v) => tt(`${v.save}% + ⌈${v.cost} ÷ ${v.revenue}⌉ customers × 100 ÷ ${v.flagged}, rounded up`, `${v.save} % + ⌈${v.cost} ÷ ${v.revenue}⌉ Kunden × 100 ÷ ${v.flagged}, aufgerundet`),
  };
}

/** The board's challenge: how many of the flags were false alarms, as a share. */
export const challengeBuilder: CalcBuilder = {
  get parts() {
    return [
      { id: "false", label: tt("Flags that were project customers in their quiet season", "Markierungen, die Projektkunden in ihrer ruhigen Saison waren"), expected: BOARD_FACTS.falseAlarms, clue: tt("The board's challenge: how many of the flags were project customers.", "Die Frage des Vorstands: wie viele der Markierungen Projektkunden waren.") },
      { id: "flags", label: tt("Customers flagged in all", "Markierte Kunden insgesamt"), expected: BOARD_FACTS.flags, clue: tt("The board's challenge: how many customers the rules flagged.", "Die Frage des Vorstands: wie viele Kunden die Regeln markierten.") },
    ];
  },
  compute: (v) => Math.round((v.false / v.flags) * 100),
  show: (v) => `${v.false} ÷ ${v.flags} × 100`,
};

/** Adds to each part of a builder the element that holds its printed figure, so the panel can link to it. */
const withTargets = (b: CalcBuilder, t: Record<string, string>): CalcBuilder => ({
  ...b,
  get parts() {
    return b.parts.map((p) => ({ ...p, target: t[p.id] }));
  },
});
const archCard = (id: string) => `arch-${id}`;

/** The funded items that act on flagged customers and the month each can first be read (needs every one of their start months). */
function customerMonths(r2: R2State): { id: ArchId; month: number | null }[] {
  const funded = (Object.keys(r2.alloc) as ArchId[]).filter((id) => r2.alloc[id] && ARCH_BY_ID[id] && CUSTOMER_ITEMS.includes(id));
  return funded.map((id) => ({ id, month: r2.start[id] == null ? null : r2.start[id]! + setupMonths(ARCH_BY_ID[id].weeks) + ARCH_BY_ID[id].respond }));
}

/** The month the tripwire can be read: the latest month in which a funded item that acts on flagged customers can first be read (one part per such item). */
function tripMonthBuilder(r2: R2State): CalcBuilder {
  const cm = customerMonths(r2);
  return {
    get parts() {
      return cm.map((c) => ({
        id: c.id,
        label: tt(`Month “${ARCH_BY_ID[c.id].name}” can first be read`, `Monat, in dem „${ARCH_BY_ID[c.id].name}“ zuerst gelesen werden kann`),
        expected: c.month ?? 0,
        clue: tt("Its start month, plus its set-up, plus the months until its effect shows (Block 3.5).", "Sein Startmonat, plus Einrichtung, plus die Monate bis zur Wirkung (Block 3.5)."),
        target: archCard(c.id),
      }));
    },
    compute: (v) => Math.max(0, ...Object.values(v)),
    show: (v) => tt(`the latest of ${Object.values(v).join(", ")}`, `der späteste von ${Object.values(v).join(", ")}`),
  };
}

/** Every number of Route 2 by its key, built from the learner's own state where a part depends on it. */
export function r2Builders(r2: R2State): Record<string, CalcBuilder> {
  const out: Record<string, CalcBuilder> = {};
  const T = (id: ArchId): Record<string, string> => {
    const a = ARCH_BY_ID[id];
    return a.result === "joined"
      ? { usage: FIG_ROW_ID("usage"), orders: FIG_ROW_ID("orders"), tickets: FIG_ROW_ID("tickets") }
      : a.result === "caught"
        ? { fell: FIG_ROW_ID("leftFell"), left: FIG_ROW_ID("left") }
        : a.result === "calls"
          ? { flagged: FIG_ROW_ID("flagged"), weeks: FIG_ROW_ID("weeksQuarter") }
          : a.result === "gap"
            ? { group: FIG_ROW_ID("groupFell") }
            : a.result === "managers"
              ? { managers: FIG_ROW_ID("managers") }
              : { bar: FIG_ROW_ID("bar") };
  };
  for (const id of Object.keys(ARCH_BY_ID) as ArchId[]) {
    out[`trig-${id}`] = withTargets(triggerBuilder(id), T(id));
    const start = r2.start[id] ?? 0;
    const mb = monthBuilder(id);
    out[`month-${id}`] = withTargets(
      { ...mb, get parts() { return mb.parts.map((p) => (p.id === "start" ? { ...p, expected: start } : p)); } },
      { start: `start-${id}`, setup: archCard(id), respond: archCard(id) },
    );
    out[`pickup-${id}`] = withTargets(pickupBuilder(id), { cost: archCard(id), revenue: FIG_ROW_ID("revenue") });
  }
  out.trip = withTargets(tripBuilder(r2), { save: FIG_ROW_ID("save"), cost: "arch-total", revenue: FIG_ROW_ID("revenue"), flagged: FIG_ROW_ID("flagged") });
  out.tripmonth = tripMonthBuilder(r2);
  out.challenge = withTargets(challengeBuilder, { false: "board-challenge", flags: "board-challenge" });
  return out;
}

/** Why a number is what it is, in one or two everyday sentences, and whether it can be shown yet (it may need the learner's own choice). */
export function numberInfo(key: string, r2: R2State): { why: string; ready: string | null } {
  if (key.startsWith("trig-")) {
    const a = ARCH_BY_ID[key.slice(5) as ArchId];
    if (a.result === "joined")
      return {
        ready: null,
        why: tt(
          "A joined customer list can only be as complete as the weakest source you join. Asking for more than the weakest source holds would make the alarm go off every time; asking for less would hide the gap.",
          "Eine verbundene Kundenliste kann nur so vollständig sein wie die schwächste Quelle, die Sie verbinden. Mehr zu verlangen, als die schwächste Quelle hält, ließe den Alarm jedes Mal los; weniger zu verlangen, würde die Lücke verstecken.",
        ),
      };
    if (a.result === "caught")
      return {
        ready: null,
        why: tt(
          "Today the single rule “usage fell by 30%” catches only a part of those who leave. A new score that costs money should close at least half of the missing part, otherwise nobody can say it was worth paying for. Rounded to the nearest 5 so it is easy to say aloud.",
          "Heute fängt die einzelne Regel „Nutzung um 30 % gesunken“ nur einen Teil derer, die gehen. Ein neuer Score, der Geld kostet, sollte mindestens die Hälfte des fehlenden Teils schließen, sonst kann niemand sagen, dass er sich gelohnt hat. Auf die nächsten 5 gerundet, damit man es leicht sagen kann.",
        ),
      };
    if (a.result === "calls")
      return {
        ready: null,
        why: tt(
          "52 customers are flagged now, and a quarter has 13 weeks. To reach every one of them within the quarter, customer success has to call this many flagged customers every week. Fewer calls than that and the list grows faster than it is worked.",
          "52 Kunden sind jetzt markiert, und ein Quartal hat 13 Wochen. Um jeden von ihnen innerhalb des Quartals zu erreichen, muss Customer Success jede Woche so viele markierte Kunden anrufen. Bei weniger Anrufen wächst die Liste schneller, als sie abgearbeitet wird.",
        ),
      };
    if (a.result === "gap")
      return {
        ready: null,
        why: tt(
          "A group of 40 customers moves by 2.5 points when one customer more or fewer leaves. A miss of one or two customers can be chance; a miss of more than two customers' worth (5 points) is a real error in the rule.",
          "Eine Gruppe von 40 Kunden bewegt sich um 2,5 Punkte, wenn ein Kunde mehr oder weniger geht. Eine Abweichung von ein bis zwei Kunden kann Zufall sein; eine Abweichung von mehr als zwei Kunden (5 Punkte) ist ein echter Fehler der Regel.",
        ),
      };
    if (a.result === "managers")
      return {
        ready: null,
        why: tt(
          "A training has worked when a clear majority acts on it. Two thirds of ten managers is seven: with fewer, most account plans are still made as before, so the money did not change how the team works.",
          "Eine Schulung hat gewirkt, wenn eine klare Mehrheit danach handelt. Zwei Drittel von zehn Managern sind sieben: Bei weniger werden die meisten Account-Pläne noch wie vorher gemacht, das Geld hat also nicht verändert, wie das Team arbeitet.",
        ),
      };
    return {
      ready: null,
      why: tt(
        "The quality bar says a source is usable from 80% complete. An item that is meant to fix completeness has reached its goal when it reaches that bar, not before.",
        "Die Qualitätslinie sagt, dass eine Quelle ab 80 % Vollständigkeit nutzbar ist. Ein Punkt, der die Vollständigkeit verbessern soll, hat sein Ziel erreicht, wenn er diese Linie erreicht, nicht früher.",
      ),
    };
  }
  if (key.startsWith("month-"))
    return {
      ready: r2.start[key.slice(6)] == null ? tt("Choose the month this item starts (above) and its month appears here.", "Wählen Sie oben den Startmonat dieses Punkts, dann erscheint hier sein Monat.") : null,
      why: tt(
        "A trigger can only be read once the item is in use and has had time to show an effect: your start month, plus the months of set-up, plus the months until the effect shows. Any earlier month says nothing.",
        "Ein Trigger lässt sich erst lesen, wenn der Punkt im Einsatz ist und Zeit hatte, zu wirken: Ihr Startmonat, plus Monate Einrichtung, plus Monate bis die Wirkung sichtbar ist. Jeder frühere Monat sagt nichts.",
      ),
    };
  if (key.startsWith("pickup-"))
    return {
      ready: null,
      why: tt(
        "When this many customers have left for the reason the item would fix, waiting has cost as much as the item. That is the moment to look at it again.",
        "Wenn so viele Kunden aus dem Grund gegangen sind, den der Punkt beheben würde, hat das Warten so viel gekostet wie der Punkt. Das ist der Moment, ihn wieder anzusehen.",
      ),
    };
  if (key === "trip") {
    const cm = customerMonths(r2);
    return {
      ready: cm.length === 0 ? tt("Fund at least one item that acts on flagged customers (the health score, the playbook) in Block 3.5 and the number appears here.", "Finanzieren Sie in Block 3.5 mindestens einen Punkt, der bei markierten Kunden wirkt (Health Score, Playbook), dann erscheint hier die Zahl.") : null,
      why: tt(
        "A tripwire has to beat today's figure by the step your funded items need to pay back: the customers they must keep to earn their cost, counted as a share of the flagged group. Today's figure plus that step, not a round number, shows the money was worth it.",
        "Ein Tripwire muss den heutigen Wert um den Schritt übertreffen, den Ihre finanzierten Punkte zum Bezahltmachen brauchen: die Kunden, die sie halten müssen, um ihre Kosten zu verdienen, als Anteil der markierten Gruppe. Heutiger Wert plus dieser Schritt, keine runde Zahl, zeigt, dass sich das Geld gelohnt hat.",
      ),
    };
  }
  if (key === "tripmonth") {
    const tm = tripMonth(r2);
    return {
      ready: tm.ready,
      why: tt(
        "The tripwire has to be read when every item that acts on flagged customers has had time to show an effect. The latest of their months is the earliest month in which the whole plan can be judged.",
        "Der Tripwire muss gelesen werden, wenn jeder Punkt, der bei markierten Kunden wirkt, Zeit hatte, zu wirken. Der späteste ihrer Monate ist der früheste Monat, in dem der ganze Plan beurteilt werden kann.",
      ),
    };
  }
  if (key === "challenge")
    return {
      ready: null,
      why: tt(
        "A quarter of the flags were false alarms of one kind, and that kind has a fix. The other flags are customers whose usage really fell, the ones gut feeling missed last year. One fixable error is no reason to drop the whole system.",
        "Ein Viertel der Markierungen waren Fehlalarme einer Art, und diese Art hat eine Lösung. Die übrigen Markierungen sind Kunden, deren Nutzung wirklich sank, die, die das Bauchgefühl letztes Jahr übersah. Ein behebbarer Fehler ist kein Grund, das ganze System aufzugeben.",
      ),
    };
  return { ready: null, why: "" };
}

/** The month the tripwire can be read: the latest month in which one of the funded items that act on flagged customers can first be read. */
export function tripMonth(r2: R2State): { month: number | null; ready: string | null; parts: { id: ArchId; month: number | null }[] } {
  const parts = customerMonths(r2);
  if (parts.length === 0) return { month: null, ready: tt("Fund at least one item that acts on flagged customers in Block 3.5 first.", "Finanzieren Sie zuerst in Block 3.5 mindestens einen Punkt, der bei markierten Kunden wirkt."), parts };
  if (parts.some((p) => p.month == null)) return { month: null, ready: tt("Choose the start month of every funded item that acts on flagged customers (Block 3.5) first.", "Wählen Sie zuerst den Startmonat jedes finanzierten Punkts, der bei markierten Kunden wirkt (Block 3.5)."), parts };
  return { month: Math.max(...parts.map((p) => p.month!)), ready: null, parts };
}

/** A part's label without its unit hint, and its printed value in the unit the label names. */
const partLabel = (label: string) => label.replace(/\s*\((€|%)\)\s*$/, "");
const partValue = (label: string, v: number) => (/\(€\)\s*$/.test(label) ? euro(v) : /\(%\)\s*$/.test(label) ? `${num(v)}%` : num(v));

/**
 * One number as the learner sees it: the result, how it comes out, why, whether it can be shown yet, and every printed input with its
 * value and the element to flash. Read by "Show the numbers you can use" and by the sentence kits (CLAUDE.md #44).
 */
export function numberView(key: string, r2: R2State) {
  const b = r2Builders(r2)[key];
  const info = numberInfo(key, r2);
  const parts = b.parts;
  const result = Math.round(b.compute(Object.fromEntries(parts.map((p) => [p.id, p.expected]))) * 1e6) / 1e6;
  return {
    result,
    show: b.show(Object.fromEntries(parts.map((p) => [p.id, String(p.expected)]))),
    why: info.why,
    ready: info.ready,
    sources: parts.map((p) => ({ label: partLabel(p.label), value: partValue(p.label, p.expected), target: (p as { target?: string }).target ?? "" })),
  };
}

/** The model plan's state (the six funded items and their start months), enough for `numberView` to show the model numbers: used by the mentor key and the worked answers. */
export function modelR2(alloc: Record<string, boolean>, start: Record<string, number>, owner: Record<string, string> = {}): R2State {
  return { alloc, start, owner } as unknown as R2State;
}
