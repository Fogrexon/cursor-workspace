import { splitFrontmatter } from './frontmatter';

const REPORTS_MARKER = '/reports/';

/** import.meta.glob のキーから reports/ 相対パスを取り出す。 */
export function reportsPathFromModuleKey(moduleKey: string): string | null {
  const normalized = moduleKey.replaceAll('\\', '/');
  const idx = normalized.lastIndexOf(REPORTS_MARKER);
  if (idx === -1) return null;
  return normalized.slice(idx + REPORTS_MARKER.length);
}

/** README などビュー対象外。 */
export function isViewableReportPath(path: string): boolean {
  if (!path.endsWith('.md')) return false;
  const leaf = path.split('/').pop()?.toLowerCase() ?? '';
  return leaf !== 'readme.md';
}

export function reportIdFromPath(path: string): string {
  return path.replace(/\.md$/i, '');
}

export function categoryFromPath(path: string): string {
  const head = path.split('/')[0] ?? '';
  return head || 'other';
}

/** 先頭の ATX 見出し（#）をタイトルにする。なければファイル名。 */
export function extractTitle(markdown: string, fallbackId: string): string {
  const { body } = splitFrontmatter(markdown);
  const lines = body.split(/\r?\n/);
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
  const { body } = splitFrontmatter(markdown);
  const lines = body.split(/\r?\n/);
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
    buf.push(line.replace(/[*_`[\]]/g, ''));
    if (buf.join(' ').length >= maxLen) break;
  }

  const text = buf.join(' ').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen - 1).trimEnd()}…`;
}

/** frontmatter / 調査日表 / パスから日付を拾う。 */
export function extractDate(markdown: string, path: string): string {
  const { meta, body } = splitFrontmatter(markdown);
  if (meta.date && /^\d{4}-\d{2}-\d{2}$/.test(meta.date)) return meta.date;

  const table = /\|\s*調査日\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|/.exec(body);
  if (table) return table[1]!;
  const labeled = /(?:調査日|日付|date)\s*[:：]\s*(\d{4}-\d{2}-\d{2})/i.exec(body);
  if (labeled) return labeled[1]!;
  const fromName = /(\d{4}-\d{2}-\d{2})/.exec(path);
  return fromName?.[1] ?? '';
}
