import { buildCatalog, type ReportDoc } from '../logic/catalog';

/**
 * knowledge/ 配下の Markdown をビルド時にバンドルする。
 * パスは Vite が解決できるよう、このファイルからの相対指定。
 */
const modules = import.meta.glob('../../../../knowledge/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** アプリ起動時に一度だけ構築するレポートカタログ。 */
export const reports: ReportDoc[] = buildCatalog(modules);
