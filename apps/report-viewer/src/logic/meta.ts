import type { ReportCategory } from '../types';

const CATEGORIES = new Set<ReportCategory>([
  'research',
  'decisions',
  'domain',
  'incidents',
  'inbox',
  'apps',
]);

/** import.meta.glob のキーから knowledge 相対パスを取り出す。 */
export function knowledgePathFromModuleKey(moduleKey: string): string | null {
  const marker = '/knowledge/';
  const idx = moduleKey.replaceAll('\\', '/').lastIndexOf(marker);
  if (idx === -1) return null;
  return moduleKey.slice(idx + marker.length);
}

export function categoryFromPath(path: string): ReportCategory {
  const head = path.split('/')[0] ?? '';
  if (CATEGORIES.has(head as ReportCategory)) return head as ReportCategory;
  return 'other';
}

export function reportIdFromPath(path: string): string {
  return path.replace(/\.md$/i, '');
}

/** 先頭の ATX 見出し（#）をタイトルにする。なければファイル名。 */
export function extractTitle(markdown: string, fallbackId: string): string {
  const lines = markdown.split(/\r?\n/);
  for (const line of lines) {
    const m = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
    if (m) return m[2]!.replace(/\s+#+\s*$/, '').trim();
  }
  const leaf = fallbackId.split('/').pop() ?? fallbackId;
  return leaf.replace(/[-_]/g, ' ');
}

/**
 * 最初の意味のある段落を要約にする。
 * 見出し・表・コード・水平線は飛ばす。
 */
export function extractSummary(markdown: string, maxLen = 160): string {
  const lines = markdown.split(/\r?\n/);
  const buf: string[] = [];
  let inFence = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    if (!line) {
      if (buf.length) break;
      continue;
    }
    if (
      line.startsWith('#') ||
      line.startsWith('|') ||
      line.startsWith('-') ||
      line.startsWith('*') ||
      line.startsWith('>') ||
      line === '---' ||
      line === '***'
    ) {
      continue;
    }
    buf.push(line.replace(/[*_`\[\]]/g, ''));
    if (buf.join(' ').length >= maxLen) break;
  }

  const text = buf.join(' ').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

/** 調査日 / YYYY-MM-DD を本文やパスから拾う。 */
export function extractDate(markdown: string, path: string): string {
  const table = /\|\s*調査日\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|/.exec(markdown);
  if (table) return table[1]!;
  const labeled = /(?:調査日|日付|date)\s*[:：]\s*(\d{4}-\d{2}-\d{2})/i.exec(markdown);
  if (labeled) return labeled[1]!;
  const fromName = /(\d{4}-\d{2}-\d{2})/.exec(path);
  return fromName?.[1] ?? '';
}
