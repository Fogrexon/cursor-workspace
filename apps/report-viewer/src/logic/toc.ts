import type { TocItem } from '../types';
import { slugifyHeading } from './slug';

/**
 * Markdown 本文から h1–h3 の TOC を抽出する。
 * renderMarkdown と同じ slug 規則を使う。
 */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const used = new Map<string, number>();
  let inFence = false;

  for (const raw of markdown.split(/\r?\n/)) {
    const line = raw.trimEnd();
    if (line.trimStart().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const m = /^(#{1,3})\s+(.+?)\s*$/.exec(line);
    if (!m) continue;
    const level = m[1]!.length as 1 | 2 | 3;
    const text = m[2]!.replace(/\s+#+\s*$/, '').trim();
    const id = slugifyHeading(text, used);
    items.push({ id, text, level });
  }

  return items;
}
