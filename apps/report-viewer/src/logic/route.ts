import type { ReportCategory, Route } from '../types';

const CATEGORIES = new Set<string>([
  'all',
  'research',
  'decisions',
  'domain',
  'incidents',
  'inbox',
  'apps',
  'other',
]);

/** location.hash を Route にパースする。 */
export function parseHash(hash: string): Route {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const trimmed = raw.replace(/^\/+/, '');
  if (!trimmed) {
    return { view: 'list', query: '', category: 'all' };
  }

  const [pathPart, queryPart = ''] = trimmed.split('?');
  const params = new URLSearchParams(queryPart);

  if (pathPart === '' || pathPart === 'list') {
    const category = params.get('category') ?? 'all';
    return {
      view: 'list',
      query: params.get('q') ?? '',
      category: CATEGORIES.has(category)
        ? (category as ReportCategory | 'all')
        : 'all',
    };
  }

  if (pathPart.startsWith('r/')) {
    const id = decodeURIComponent(pathPart.slice(2));
    if (id) return { view: 'report', id };
  }

  return { view: 'list', query: '', category: 'all' };
}

/** Route を hash（# 付き）に直列化する。 */
export function serializeHash(route: Route): string {
  if (route.view === 'report') {
    return `#/r/${encodeURIComponent(route.id)}`;
  }
  const params = new URLSearchParams();
  if (route.query) params.set('q', route.query);
  if (route.category !== 'all') params.set('category', route.category);
  const qs = params.toString();
  return qs ? `#/list?${qs}` : '#/list';
}
