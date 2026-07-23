import type { ReportCategory, ReportMeta } from '../types';
import { serializeHash } from '../logic/route';
import { escapeHtml } from './escape';

const CATEGORY_LABEL: Record<string, string> = {
  all: 'すべて',
  'deep-research': 'Deep research',
  notes: 'Notes',
};

function categoryLabel(category: string): string {
  return CATEGORY_LABEL[category] ?? category;
}

export type ListViewModel = {
  reports: readonly ReportMeta[];
  query: string;
  category: ReportCategory | 'all';
  categories: readonly string[];
  totalCount: number;
};

/** 一覧画面の静的 HTML。 */
export function renderListView(model: ListViewModel): string {
  const filterCats: Array<ReportCategory | 'all'> = ['all', ...model.categories];
  const chips = filterCats
    .map((c) => {
      const active = c === model.category ? ' is-active' : '';
      return `<button type="button" class="chip${active}" data-category="${escapeHtml(c)}">${escapeHtml(categoryLabel(c))}</button>`;
    })
    .join('');

  const cards = model.reports
    .map((r) => {
      const href = serializeHash({ view: 'report', id: r.id });
      const date = r.date
        ? `<time datetime="${escapeHtml(r.date)}">${escapeHtml(r.date)}</time>`
        : '';
      const tags = r.tags
        .map((t) => `<span class="tag tag--soft">${escapeHtml(t)}</span>`)
        .join('');
      const status = r.status
        ? `<span class="tag">${escapeHtml(r.status)}</span>`
        : '';
      return `
        <a class="report-card" href="${href}">
          <div class="report-card__meta">
            <span class="tag">${escapeHtml(categoryLabel(r.category))}</span>
            ${status}
            ${date}
          </div>
          <h2 class="report-card__title">${escapeHtml(r.title)}</h2>
          <p class="report-card__summary">${escapeHtml(r.summary || '（要約なし）')}</p>
          <div class="report-card__tags">${tags}</div>
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
            placeholder="タイトル・要約・タグ・読者で検索（tag:harness も可）"
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

export { categoryLabel };
