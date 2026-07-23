import type { ReportMeta } from '../types';
import { splitFrontmatter } from './frontmatter';
import {
  categoryFromPath,
  extractDate,
  extractSummary,
  extractTitle,
  isViewableReportPath,
  reportIdFromPath,
  reportsPathFromModuleKey,
} from './meta';

export type ReportDoc = ReportMeta & {
  /** frontmatter を除いた本文 */
  markdown: string;
};

/**
 * Vite の raw glob 結果からレポート一覧を組み立てる。
 * モジュールキーは絶対/相対どちらでもよい（`/reports/` を含むこと）。
 */
export function buildCatalog(modules: Record<string, string>): ReportDoc[] {
  const docs: ReportDoc[] = [];

  for (const [key, raw] of Object.entries(modules)) {
    const path = reportsPathFromModuleKey(key);
    if (!path || !isViewableReportPath(path)) continue;

    const { meta, body } = splitFrontmatter(raw);
    const id = reportIdFromPath(path);
    const tags = (meta.tags ?? []).map((t) => t.trim()).filter(Boolean);

    docs.push({
      id,
      path,
      category: meta.category?.trim() || categoryFromPath(path),
      title: meta.title?.trim() || extractTitle(raw, id),
      summary: meta.summary?.trim() || extractSummary(raw),
      date: extractDate(raw, path),
      tags,
      status: meta.status?.trim() || '',
      audience: meta.audience?.trim() || '',
      markdown: body,
    });
  }

  return docs.sort((a, b) => {
    if (a.date !== b.date) return b.date.localeCompare(a.date);
    return a.id.localeCompare(b.id);
  });
}

/** 一覧に出すユニークな category（ソート済み）。 */
export function listCategories(reports: readonly ReportMeta[]): string[] {
  return [...new Set(reports.map((r) => r.category))].sort((a, b) =>
    a.localeCompare(b),
  );
}

/**
 * 一覧フィルタ。
 * query は title / summary / path / id / tags / audience を部分一致。
 * `tag:foo` でタグ完全一致も可。
 */
export function filterReports(
  reports: readonly ReportMeta[],
  query: string,
  category: ReportMeta['category'] | 'all',
): ReportMeta[] {
  const q = query.trim().toLowerCase();
  const tagExact = q.startsWith('tag:') ? q.slice(4).trim() : '';

  return reports.filter((r) => {
    if (category !== 'all' && r.category !== category) return false;
    if (!q) return true;
    if (tagExact) {
      return r.tags.some((t) => t.toLowerCase() === tagExact);
    }
    const hay = [
      r.title,
      r.summary,
      r.path,
      r.id,
      r.audience,
      r.status,
      r.category,
      ...r.tags,
    ]
      .join('\n')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function findReport(
  reports: readonly ReportDoc[],
  id: string,
): ReportDoc | undefined {
  return reports.find((r) => r.id === id);
}
