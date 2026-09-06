export type ContentDiffEntry = { path: string; before: unknown; after: unknown };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function diffContent(before: unknown, after: unknown, prefix = ""): ContentDiffEntry[] {
  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap((key) =>
      diffContent(before[key], after[key], prefix ? `${prefix}.${key}` : key),
    );
  }
  if (JSON.stringify(before) === JSON.stringify(after)) return [];
  return [{ path: prefix, before, after }];
}
