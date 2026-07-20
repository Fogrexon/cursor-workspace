import type { CatalogDocument } from "./types.ts";

/** Stable comparison: ignore generatedAt timestamp. */
export function catalogFingerprint(doc: CatalogDocument): string {
  const { generatedAt: _, ...rest } = doc;
  return JSON.stringify(rest, null, 2) + "\n";
}
