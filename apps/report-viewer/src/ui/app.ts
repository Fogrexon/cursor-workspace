import type { ReportCategory, Route } from '../types';
import { reports } from '../content/reports';
import { filterReports, findReport } from '../logic/catalog';
import { parseHash, serializeHash } from '../logic/route';
import { renderListView } from './listView';
import { renderReportView } from './reportView';

/**
 * Knowledge レポートビューアを #app にマウントする。
 * ルーティングは location.hash（GitHub Pages 向け）。
 */
export function mountApp(root: HTMLElement): void {
  const render = (): void => {
    const route = parseHash(location.hash);
    root.innerHTML = shell(route);
    bind(root, route);
  };

  window.addEventListener('hashchange', render);
  if (!location.hash) {
    location.hash = serializeHash({ view: 'list', query: '', category: 'all' });
  } else {
    render();
  }
}

function shell(route: Route): string {
  const body =
    route.view === 'list'
      ? renderListView({
          reports: filterReports(reports, route.query, route.category),
          query: route.query,
          category: route.category,
          totalCount: reports.length,
        })
      : (() => {
          const doc = findReport(reports, route.id);
          if (!doc) {
            return `
              <section class="missing">
                <p>レポートが見つかりません: <code>${route.id}</code></p>
                <a href="${serializeHash({ view: 'list', query: '', category: 'all' })}">一覧へ戻る</a>
              </section>`;
          }
          return renderReportView(doc);
        })();

  return `
    <div class="app-shell">
      <header class="top">
        <a class="back" href="../">← ポータルへ戻る</a>
        <div class="top__titles">
          <h1>Knowledge Report Viewer</h1>
          <p>knowledge/ 配下の調査レポート・意思決定・インシデントを Markdown で閲覧します。</p>
        </div>
      </header>
      ${body}
    </div>
  `;
}

function bind(root: HTMLElement, route: Route): void {
  if (route.view === 'report') {
    root.querySelectorAll<HTMLButtonElement>('.toc__link[data-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.target;
        if (!id) return;
        root.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      });
    });
    return;
  }

  const search = root.querySelector<HTMLInputElement>('#report-search');
  search?.addEventListener('input', () => {
    const next: Route = {
      view: 'list',
      query: search.value,
      category: route.category,
    };
    const hash = serializeHash(next);
    if (location.hash !== hash) {
      history.replaceState(null, '', hash);
      root.innerHTML = shell(next);
      bind(root, next);
      const again = root.querySelector<HTMLInputElement>('#report-search');
      if (again) {
        again.focus();
        const len = again.value.length;
        again.setSelectionRange(len, len);
      }
    }
  });

  root.querySelectorAll<HTMLButtonElement>('[data-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category as ReportCategory | 'all';
      location.hash = serializeHash({
        view: 'list',
        query: route.query,
        category,
      });
    });
  });
}
