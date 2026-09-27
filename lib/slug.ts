/** Lowercase ASCII, spaces to "-", diacritics stripped (ü → u, ß → ss). */
export function slug(input: string): string {
  return input
    .trim()
    .replace(/ß/g, "ss")
    .replace(/æ/gi, "ae")
    .replace(/ø/gi, "o")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type TaskSlug = "l1l2-data-analysis" | "l3-decision-memo";
export const TASK_NUMBER: Record<TaskSlug, 1 | 2> = { "l1l2-data-analysis": 1, "l3-decision-memo": 2 };

/** `{route}-{name}-day7-{task}`, e.g. `1-muchson-day7-l1l2-data-analysis`. The file name stays English in both languages. */
export function exportName(name: string, task: TaskSlug): string {
  return `${TASK_NUMBER[task]}-${slug(name) || "participant"}-day7-${task}`;
}
