import type { ReportMeta } from '../types';
import { serializeHash } from '../logic/route';
import { escapeHtml } from './escape';

export type ListViewModel = {
  reports: readonly ReportMeta[];
  query: string;
  totalCount: number;
};

/** 一覧画面の静的 HTML。 */
export function renderListView(model: ListViewModel): string {
  const cards = model.reports
    .map((r) => {
      const href = serializeHash({ view: 'report', id: r.id });
      const date = r.date
        ? `<time datetime="${escapeHtml(r.date)}">${escapeHtml(r.date)}</time>`
        : '';
      return `
        <a class="report-card" href="${href}">
          <div class="report-card__meta">
            <span class="tag">research</span>
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
      </div>
      <p class="list-count">${model.reports.length} / ${model.totalCount} 件</p>
      <div class="report-grid">
        ${cards || '<p class="empty">該当するレポートがありません。</p>'}
      </div>
    </section>
  `;
}
