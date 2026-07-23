import type { TocItem } from '../types';
import type { ReportDoc } from '../logic/catalog';
import { extractToc } from '../logic/toc';
import { renderMarkdown } from '../logic/markdown';
import { serializeHash } from '../logic/route';
import { escapeHtml } from './escape';
import { CATEGORY_LABEL } from './listView';

/** 詳細画面 HTML（TOC + 本文）。 */
export function renderReportView(doc: ReportDoc): string {
  const toc = extractToc(doc.markdown);
  const body = renderMarkdown(doc.markdown);
  const back = serializeHash({ view: 'list', query: '', category: 'all' });
  const date = doc.date
    ? `<time datetime="${escapeHtml(doc.date)}">${escapeHtml(doc.date)}</time>`
    : '';

  return `
    <article class="report">
      <aside class="toc" aria-label="目次">
        <a class="back-inline" href="${back}">← 一覧へ</a>
        <p class="toc__label">目次</p>
        <nav class="toc__nav">
          ${renderToc(toc)}
        </nav>
      </aside>
      <div class="report__main">
        <header class="report__header">
          <div class="report-card__meta">
            <span class="tag">${CATEGORY_LABEL[doc.category]}</span>
            ${date}
          </div>
          <p class="report-card__path"><code>${escapeHtml(doc.path)}</code></p>
        </header>
        <div class="markdown-body">
          ${body}
        </div>
      </div>
    </article>
  `;
}

function renderToc(items: TocItem[]): string {
  if (!items.length) return '<p class="toc__empty">見出しがありません</p>';
  // hash ルーティングと衝突しないよう、href ではなく data-target + scrollIntoView を使う
  return `<ul>${items
    .map(
      (item) =>
        `<li class="toc__item toc__item--h${item.level}"><button type="button" class="toc__link" data-target="${escapeHtml(item.id)}">${escapeHtml(item.text)}</button></li>`,
    )
    .join('')}</ul>`;
}
