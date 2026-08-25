import type { Session } from '../types';
import { playgroundRelevance } from '../logic/relevance';
import { serializeHash } from '../logic/route';
import { emptyFilters } from '../logic/catalog';
import { escapeHtml, formatMultiline } from './escape';

/**
 * セッション詳細。公式ページと CEDiL へのリンクを含む。
 */
export function renderSessionView(session: Session): string {
  const { score, reasons } = playgroundRelevance(session);
  const when = [session.day, session.start && `${session.start}${session.end ? `–${session.end}` : ''}`, session.room]
    .filter(Boolean)
    .join(' · ');
  const speakers = session.speakers
    .map((sp) => {
      const meta = [sp.company, sp.job].filter(Boolean).join(' / ');
      return `<li><strong>${escapeHtml(sp.name)}</strong>${meta ? ` <span class="ds-meta">${escapeHtml(meta)}</span>` : ''}</li>`;
    })
    .join('');

  const blocks = [
    session.abstract &&
      `<section class="ds-surface ds-surface--pad"><h2>セッション内容</h2><p>${formatMultiline(session.abstract)}</p></section>`,
    session.takeaway &&
      `<section class="ds-surface ds-surface--pad"><h2>得られる知見</h2><p>${formatMultiline(session.takeaway)}</p></section>`,
    session.expectedSkill &&
      `<section class="ds-surface ds-surface--pad"><h2>求められるスキル</h2><p>${formatMultiline(session.expectedSkill)}</p></section>`,
  ]
    .filter(Boolean)
    .join('');

  const flags = [
    session.materialsAllowed ? '資料公開あり' : '資料フラグなし',
    session.photoAllowed ? '写真撮影可' : '写真撮影不可',
    session.snsAllowed ? 'SNS投稿可' : 'SNS投稿不可',
  ];

  return `
    <article class="detail ds-stack ds-stack--lg ds-rise">
      <a class="ds-nav-link" href="${serializeHash({ view: 'list', filters: emptyFilters() })}">← 一覧へ戻る</a>
      <header class="ds-stack">
        <p class="ds-section-label">${escapeHtml(when)}</p>
        <h2 class="ds-title">${escapeHtml(session.title)}</h2>
        <div class="ds-meta">
          <span class="ds-tag">${escapeHtml(session.field)}</span>
          <span class="ds-tag ds-tag--muted">${escapeHtml(session.format)}</span>
          ${session.type ? `<span class="ds-tag ds-tag--muted">${escapeHtml(session.type)}</span>` : ''}
          ${session.keywords.map((k) => `<span class="ds-tag ds-tag--muted">${escapeHtml(k)}</span>`).join('')}
          ${score >= 3 ? `<span class="ds-tag">playground ${score}</span>` : ''}
        </div>
        ${reasons.length ? `<p class="ds-lede">関連: ${escapeHtml(reasons.join(' · '))}</p>` : ''}
      </header>
      ${speakers ? `<ul class="speakers">${speakers}</ul>` : ''}
      ${blocks}
      <p class="ds-meta">${flags.map((f) => escapeHtml(f)).join(' · ')}${session.difficultyLabel ? ` · ${escapeHtml(session.difficultyLabel)}` : ''}</p>
      <p class="ds-meta">
        <a href="${escapeHtml(session.officialUrl)}" target="_blank" rel="noreferrer">公式セッションページ</a>
        ·
        <a href="${escapeHtml(session.cedilUrl)}" target="_blank" rel="noreferrer">CEDiL</a>
      </p>
    </article>
  `;
}
