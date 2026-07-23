/** knowledge/ 配下のカテゴリ（パス先頭セグメント）。 */
export type ReportCategory =
  | 'research'
  | 'decisions'
  | 'domain'
  | 'incidents'
  | 'inbox'
  | 'apps'
  | 'other';

/** 一覧・詳細で共有するレポートメタデータ。 */
export type ReportMeta = {
  /** knowledge 相対パス（拡張子なし）。例: research/2026-07-... */
  id: string;
  /** knowledge/ からの相対パス（.md 付き）。 */
  path: string;
  category: ReportCategory;
  title: string;
  summary: string;
  /** YYYY-MM-DD。不明なら空文字。 */
  date: string;
};

export type TocItem = {
  id: string;
  text: string;
  level: 1 | 2 | 3;
};

export type Route =
  | { view: 'list'; query: string; category: ReportCategory | 'all' }
  | { view: 'report'; id: string };
