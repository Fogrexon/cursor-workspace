import type { ReportCategory, ReportMeta } from '../types';
import { serializeHash } from '../logic/route';
import { escapeHtml } from './escape';

const CATEGORY_LABEL: Record<ReportCategory | 'all', string> = {
  all: 'すべて',
  research: '研究',
  decisions: '意思決定',
  domain: 'ドメイン',
  incidents: 'インシデント',
  inbox: 'inbox',
  apps: 'アプリ',
  other: 'その他',
};

const FILTER_ORDER: Array<ReportCategory | 'all'> = [
  'all',
  'research',
  'decisions',
  'domain',
  'incidents',
  'inbox',
  'apps',
  'other',
];

export type ListViewModel = {
  reports: readonly ReportMeta[];
  query: string;
  category: ReportCategory | 'all';
  totalCount: number;
};

/** 一覧画面の静的 HTML。 */
export function renderListView(model: ListViewModel): string {
  const chips = FILTER_ORDER.map((c) => {
    const active = c === model.category ? ' is-active' : '';
    return `<button type="button" class="chip${active}" data-category="${c}">${CATEGORY_LABEL[c]}</button>`;
  }).join('');

  const cards = model.reports
    .map((r) => {
      const href = serializeHash({ view: 'report', id: r.id });
      const date = r.date
        ? `<time datetime="${escapeHtml(r.date)}">${escapeHtml(r.date)}</time>`
        : '';
      return `
        <a class="report-card" href="${href}">
          <div class="report-card__meta">
            <span class="tag">${CATEGORY_LABEL[r.category]}</span>
            ${date}
          </div>
          <h2 class="report-card__title">${escapeHtml(r.title)}</h2>
          <p class="report-card__summary">${escapeHtml(r.summary || '（要約なし）')}</p>
          <p class="report-card__path"><code>${escapeHtml(r.path)}</code></p>
        </a>`;
    })
    .join('');

  return `
    <section class="list">
      <div class="toolbar">
        <label class="search">
          <span class="sr-only">検索</span>
          <input
            id="report-search"
            type="search"
            placeholder="タイトル・本文要約・パスで検索"
            value="${escapeHtml(model.query)}"
          />
        </label>
        <div class="chips" role="group" aria-label="カテゴリ">${chips}</div>
      </div>
      <p class="list-count">${model.reports.length} / ${model.totalCount} 件</p>
      <div class="report-grid">
        ${cards || '<p class="empty">該当するレポートがありません。</p>'}
      </div>
    </section>
  `;
}

export { CATEGORY_LABEL };
