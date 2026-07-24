import type { ReportMeta } from '../types';
import {
  extractDate,
  extractSummary,
  extractTitle,
  reportIdFromPath,
  researchPathFromModuleKey,
} from './meta';

export type ReportDoc = ReportMeta & { markdown: string };

/**
 * Vite の raw glob 結果からレポート一覧を組み立てる。
 * モジュールキーは絶対/相対どちらでもよい（/research/ を含むこと）。
 */
export function buildCatalog(
  modules: Record<string, string>,
): ReportDoc[] {
  const docs: ReportDoc[] = [];

  for (const [key, markdown] of Object.entries(modules)) {
    const path = researchPathFromModuleKey(key);
    if (!path || !path.endsWith('.md')) continue;
    // README など案内ファイルは一覧に載せない
    if (path.toLowerCase() === 'readme.md') continue;
    const id = reportIdFromPath(path);
    docs.push({
      id,
      path,
      title: extractTitle(markdown, id),
      summary: extractSummary(markdown),
      date: extractDate(markdown, path),
      markdown,
    });
  }

  return docs.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.id.localeCompare(b.id);
  });
}

/** 一覧フィルタ。query は title / summary / path / id を部分一致。 */
export function filterReports(
  reports: readonly ReportMeta[],
  query: string,
): ReportMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...reports];
  return reports.filter((r) => {
    const hay = `${r.title}\n${r.summary}\n${r.path}\n${r.id}`.toLowerCase();
    return hay.includes(q);
  });
}

export function findReport(
  reports: readonly ReportDoc[],
  id: string,
): ReportDoc | undefined {
  return reports.find((r) => r.id === id);
}
