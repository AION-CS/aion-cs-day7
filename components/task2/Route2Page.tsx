"use client";

import { SectionRail } from "@/components/chrome/SectionRail";
import { PageNav } from "@/components/chrome/PageNav";
import { HashFlash } from "@/components/chrome/HashFlash";
import { SuggestedOrderBanner } from "@/components/ui/Banner";
import { MateriB } from "@/components/materi/Materi";
import { Task2 } from "@/components/task2/Task2";
import { ResetRoute } from "@/components/ui/ResetRoute";
import { Gloss } from "@/lib/glossify";
import { tt } from "@/lib/lang";

export function Route2Page() {
  return (
    <div className="space-y-8 pt-4">
      <HashFlash />
      <header className="space-y-3">
        <div className="space-y-1">
          <p className="smallcaps text-accent">{tt("Route 2 · Level 3 · Management decision", "Route 2 · Level 3 · Managemententscheidung")}</p>
          <h1>{tt("Build a decision architecture that decides with data, not with memory", "Bauen Sie eine Entscheidungsarchitektur, die mit Daten entscheidet, nicht mit dem Gedächtnis")}</h1>
        </div>
        <blockquote className="max-w-prose space-y-2 border-l-4 border-gold bg-accentSoft px-4 py-3 text-body text-ink">
          <p>
            <Gloss>
              {tt(
                "Route 1 read SmartData's data: a first forecast, four behaviour patterns and three measures. Level 3 asks a different question: how does the whole organisation decide with data, which data counts, when does it intervene, and what do you decide today although the data is of varying quality?",
                "Route 1 hat die Daten von SmartData gelesen: eine erste Prognose, vier Verhaltensmuster und drei Maßnahmen. Level 3 stellt eine andere Frage: Wie entscheidet die ganze Organisation mit Daten, welche Daten zählen, wann greift sie ein, und was entscheiden Sie heute, obwohl die Daten von schwankender Qualität sind?",
              )}
            </Gloss>
          </p>
        </blockquote>
      </header>
      <SuggestedOrderBanner
        routeKey="r2"
        text={tt(
          "Route 1 first is recommended, because the situation quotes the patterns and measures you named there. Every section stays open, so you can work through this route regardless.",
          "Route 1 zuerst wird empfohlen, weil die Lage die Muster und Maßnahmen zitiert, die Sie dort benannt haben. Jeder Abschnitt bleibt offen, Sie können diese Route trotzdem bearbeiten.",
        )}
      />
      <SectionRail route={2} />
      <PageNav route={2} />
      <MateriB />
      <Task2 />
      <ResetRoute route={2} />
    </div>
  );
}
