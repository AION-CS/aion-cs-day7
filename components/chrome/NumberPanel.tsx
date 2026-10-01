"use client";

import { useEffect } from "react";
import { useNumExplain } from "@/store/useNumExplain";
import { tt } from "@/lib/lang";

/**
 * The explanation card for the number that was clicked in a calculation: what the number is and where it comes from. One card for the
 * whole site, fixed to the bottom right so opening it never moves the table you were reading. Escape or Close hides it; clicking
 * another number swaps it. Same idea as the glossary card, for figures instead of terms.
 */
export function NumberPanel() {
  const item = useNumExplain((s) => s.item);
  const close = useNumExplain((s) => s.close);
  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, close]);
  return (
    <div id="num-panel" role="region" aria-live="polite" aria-label={tt("Number explanation", "Erklärung der Zahl")} className="print:hidden">
      {item && (
        <div className="fade-in fixed bottom-20 left-3 right-3 z-[46] rounded-xl border border-gold bg-paper p-4 shadow-lg sm:left-auto sm:max-w-sm xl:bottom-4 xl:right-4">
          <div className="flex items-start justify-between gap-3">
            <p className="smallcaps text-accent">{tt("What this number is", "Was diese Zahl ist")}</p>
            <button type="button" onClick={close} className="btn-ghost btn-sm">
              {tt("Close", "Schließen")}
            </button>
          </div>
          <p className="tnum mt-1 text-h3 font-semibold text-ink">{item.value}</p>
          <p className="mt-1.5 text-body text-ink">{item.what}</p>
          <p className="mt-2 rounded-md bg-mist px-3 py-2 text-caption text-ink">
            <span className="font-semibold">{tt("Where it comes from.", "Woher sie kommt.")}</span> {item.from}
          </p>
        </div>
      )}
    </div>
  );
}
