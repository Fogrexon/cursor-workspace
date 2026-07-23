/** レポートの分類（frontmatter `category`）。 */
export type ReportCategory = string;

/** 一覧・詳細で共有するレポートメタデータ。 */
export type ReportMeta = {
  /** reports/ 相対パス（拡張子なし）。例: deep-research/2026-07-... */
  id: string;
  /** reports/ からの相対パス（.md 付き）。 */
  path: string;
  category: ReportCategory;
  title: string;
  summary: string;
  /** YYYY-MM-DD。不明なら空文字。 */
  date: string;
  tags: string[];
  status: string;
  audience: string;
};

export type TocItem = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

export type Route =
  | { view: 'list'; query: string; category: ReportCategory | 'all' }
  | { view: 'report'; id: string };
