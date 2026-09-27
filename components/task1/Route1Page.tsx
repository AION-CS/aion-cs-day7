"use client";

import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriA } from "@/components/materi/Materi";
import { Task1 } from "@/components/task1/Task1";
import { ResetRoute } from "@/components/ui/ResetRoute";
import { tt } from "@/lib/lang";

export function Route1Page() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-1">
        <p className="smallcaps text-accent">{tt("Route 1 · Levels 1 and 2 · Knowledge and application", "Route 1 · Level 1 und 2 · Wissen und Anwendung")}</p>
        <h1>{tt("From data to insight: what customers do, and what it tells you", "Von Daten zu Erkenntnis: was Kunden tun, und was es Ihnen sagt")}</h1>
      </header>
      <SuggestedOrderBanner
        routeKey="r1"
        text={tt(
          "Materi A → the Customer Data Analysis task, one case in two parts (Turn data into insight, Recognise patterns and act). Every section stays open, so you can start anywhere.",
          "Materi A → die Aufgabe Customer Data Analysis, ein Fall in zwei Teilen (Aus Daten Erkenntnis machen, Muster erkennen und handeln). Jeder Abschnitt bleibt offen, Sie können überall beginnen.",
        )}
      />
      <SectionRail route={1} />
      <PageNav route={1} />
      <MateriA />
      <Task1 />
      <ResetRoute route={1} />
    </div>
  );
}
