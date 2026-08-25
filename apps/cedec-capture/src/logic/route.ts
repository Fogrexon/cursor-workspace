import type { ListFilters, Route } from '../types';
import { emptyFilters } from './catalog';

function readFilters(params: URLSearchParams): ListFilters {
  return {
    query: params.get('q') ?? '',
    day: params.get('day') ?? '',
    field: params.get('field') ?? '',
    keyword: params.get('kw') ?? '',
    playgroundOnly: params.get('pg') === '1',
  };
}

/** location.hash を Route にパースする。 */
export function parseHash(hash: string): Route {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const trimmed = raw.replace(/^\/+/, '');
  if (!trimmed) {
    return { view: 'list', filters: emptyFilters() };
  }

  const [pathPart, queryPart = ''] = trimmed.split('?');
  const params = new URLSearchParams(queryPart);

  if (pathPart === '' || pathPart === 'list') {
    return { view: 'list', filters: readFilters(params) };
  }

  if (pathPart.startsWith('s/')) {
    const uuid = decodeURIComponent(pathPart.slice(2));
    if (uuid) return { view: 'session', uuid };
  }

  return { view: 'list', filters: emptyFilters() };
}

/** Route を hash（# 付き）に直列化する。 */
export function serializeHash(route: Route): string {
  if (route.view === 'session') {
    return `#/s/${encodeURIComponent(route.uuid)}`;
  }
  const params = new URLSearchParams();
  const { filters } = route;
  if (filters.query) params.set('q', filters.query);
  if (filters.day) params.set('day', filters.day);
  if (filters.field) params.set('field', filters.field);
  if (filters.keyword) params.set('kw', filters.keyword);
  if (filters.playgroundOnly) params.set('pg', '1');
  const qs = params.toString();
  return qs ? `#/list?${qs}` : '#/list';
}
