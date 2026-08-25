import type { Catalog, ListFilters, RankedSession } from '../types';
import { uniqueSorted } from '../logic/catalog';
import { serializeHash } from '../logic/route';
import { escapeHtml } from './escape';

function option(value: string, label: string, selected: string): string {
  const sel = value === selected ? ' selected' : '';
  return `<option value="${escapeHtml(value)}"${sel}>${escapeHtml(label)}</option>`;
}

/**
 * セッション一覧（フィルタバー + カード）。
 */
export function renderListView(opts: {
  catalog: Catalog;
  sessions: readonly RankedSession[];
  filters: ListFilters;
  totalCount: number;
}): string {
  const { catalog, sessions, filters, totalCount } = opts;
  const days = uniqueSorted(catalog.sessions.map((s) => s.day));
  const fields = uniqueSorted(catalog.sessions.map((s) => s.field));
  const keywords = uniqueSorted(catalog.sessions.flatMap((s) => s.keywords));
  const captured = catalog.capturedAt.slice(0, 10);

  const cards = sessions
    .map((s) => {
      const when = [s.day, s.start && `${s.start}${s.end ? `–${s.end}` : ''}`, s.room]
        .filter(Boolean)
        .join(' · ');
      const tags = [s.field, s.format, ...s.keywords.slice(0, 3)]
        .map((t) => `<span class="ds-tag ds-tag--muted">${escapeHtml(t)}</span>`)
        .join('');
      const score =
        s.score >= 3
          ? `<span class="ds-tag">playground ${s.score}</span>`
          : '';
      return `
        <a class="ds-surface ds-surface--pad ds-surface--interactive session-card" href="${serializeHash({ view: 'session', uuid: s.uuid })}">
          <p class="ds-meta">${escapeHtml(when)}</p>
          <h2 class="session-card__title">${escapeHtml(s.title)}</h2>
          <p class="session-card__speakers">${escapeHtml(
            s.speakers.map((sp) => sp.name).join(' / ') || '講演者未記載',
          )}</p>
          <div class="ds-meta">${score}${tags}</div>
        </a>`;
    })
    .join('');

  return `
    <section class="toolbar ds-stack">
      <p class="list-count">${sessions.length} / ${totalCount} 件 · 取得 ${escapeHtml(captured)}</p>
      <label class="sr-only" for="session-search">検索</label>
      <input
        id="session-search"
        class="ds-field"
        type="search"
        placeholder="タイトル・講演者・要旨で検索"
        value="${escapeHtml(filters.query)}"
      />
      <div class="filter-row">
        <select id="filter-day" class="ds-field" aria-label="日付">
          ${option('', 'すべての日', filters.day)}
          ${days.map((d) => option(d, d, filters.day)).join('')}
        </select>
        <select id="filter-field" class="ds-field" aria-label="分野">
          ${option('', 'すべての分野', filters.field)}
          ${fields.map((f) => option(f, f, filters.field)).join('')}
        </select>
        <select id="filter-keyword" class="ds-field" aria-label="キーワード">
          ${option('', 'すべてのキーワード', filters.keyword)}
          ${keywords.map((k) => option(k, k, filters.keyword)).join('')}
        </select>
        <label class="pg-toggle">
          <input id="filter-pg" type="checkbox"${filters.playgroundOnly ? ' checked' : ''} />
          playground 向け
        </label>
      </div>
    </section>
    ${
      sessions.length === 0
        ? `<section class="ds-empty"><p>該当するセッションがありません。</p></section>`
        : `<section class="session-grid">${cards}</section>`
    }
  `;
}
