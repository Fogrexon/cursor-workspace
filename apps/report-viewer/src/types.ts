/** 一覧・詳細で共有するレポートメタデータ。 */
export type ReportMeta = {
  /** research/ 相対パス（拡張子なし）。例: 2026-07-23-llm-agent-execution-harness */
  id: string;
  /** research/ からの相対パス（.md 付き）。 */
  path: string;
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
  | { view: 'list'; query: string }
  | { view: 'report'; id: string };
