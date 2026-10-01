"use client";

import { create } from "zustand";

/** The explanation of one number the learner clicked: what it is and where it comes from. Session-only, never persisted. */
export type NumExplain = { key: string; value: string; what: string; from: string };
type State = { item: NumExplain | null; toggle: (x: NumExplain) => void; close: () => void };

export const useNumExplain = create<State>()((set, get) => ({
  item: null,
  // Pressing the open number again closes it.
  toggle: (x) => set({ item: get().item?.key === x.key ? null : x }),
  close: () => set({ item: null }),
}));
