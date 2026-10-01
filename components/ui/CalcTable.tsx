"use client";

import type { ReactNode } from "react";
import { useNumExplain } from "@/store/useNumExplain";
import { glossify } from "@/lib/glossify";
import { tt } from "@/lib/lang";

/**
 * A number inside a calculation that explains itself: click it and a card opens in the bottom right corner saying what the number is
 * and where it comes from (a printed row, an earlier step, or a fixed rule). Used in every worked calculation of the material.
 */
export function Num({ id, value, what, from }: { id: string; value: string; what: string; from: string }) {
  const toggle = useNumExplain((s) => s.toggle);
  const open = useNumExplain((s) => s.item?.key === id);
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-label={tt(`${value}: what this number is and where it comes from`, `${value}: was diese Zahl ist und woher sie kommt`)}
      onClick={() => toggle({ key: id, value, what, from })}
      className="numx tnum"
    >
      {value}
    </button>
  );
}

export type CalcRow = { step: string; calc: ReactNode; result: ReactNode; plain: string };

/** A worked calculation as a table: step · calculation (every number clickable) · result · the same step in plain words. */
export function CalcTable({ rows, caption }: { rows: CalcRow[]; caption: string }) {
  const seen = new Set<string>();
  return (
    <div className="space-y-1.5">
      <div className="relative overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[40rem] border-collapse text-caption">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="bg-mist text-left">
              {[tt("Step", "Schritt"), tt("Calculation", "Rechnung"), tt("Result", "Ergebnis"), tt("In plain words", "In einfachen Worten")].map((h) => (
                <th key={h} scope="col" className="px-3 py-2 text-micro font-semibold uppercase text-ash">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.step} className="border-t border-line align-top">
                <td className="px-3 py-2 font-semibold">{r.step}</td>
                <td className="tnum px-3 py-2">{r.calc}</td>
                <td className="tnum px-3 py-2 font-semibold">{r.result}</td>
                <td className="px-3 py-2 text-ink">{glossify(r.plain, seen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-micro normal-case tracking-normal text-ash">{tt("Click any number with a dotted underline: a card at the bottom right says what it is and where it comes from.", "Klicken Sie eine Zahl mit gepunkteter Unterstreichung an: Eine Karte unten rechts sagt, was sie ist und woher sie kommt.")}</p>
    </div>
  );
}
