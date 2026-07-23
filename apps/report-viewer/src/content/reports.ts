import { buildCatalog, type ReportDoc } from '../logic/catalog';

/**
 * reports/ 配下の Markdown をビルド時にバンドルする。
 * knowledge/ は取り込まない（プロジェクト固有メモと調査成果を分離）。
 */
const modules = import.meta.glob('../../../../reports/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** アプリ起動時に一度だけ構築するレポートカタログ。 */
export const reports: ReportDoc[] = buildCatalog(modules);
