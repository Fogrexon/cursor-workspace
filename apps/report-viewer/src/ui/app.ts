import type { Route } from '../types';
import { reports } from '../content/reports';
import { filterReports, findReport } from '../logic/catalog';
import { parseHash, serializeHash } from '../logic/route';
import { renderListView } from './listView';
import { renderReportView } from './reportView';

const WIDE_TOC_MQ = '(min-width: 900px)';

/**
 * Research レポートビューアを #app にマウントする。
 * ルーティングは location.hash（GitHub Pages 向け）。
 */
export function mountApp(root: HTMLElement): void {
  const wideToc = window.matchMedia(WIDE_TOC_MQ);
  const keepWideTocOpen = (): void => {
    if (!wideToc.matches) return;
    const toc = root.querySelector<HTMLDetailsElement>('details.toc');
    if (toc) toc.open = true;
  };
  wideToc.addEventListener('change', keepWideTocOpen);

  const render = (): void => {
    const route = parseHash(location.hash);
    root.innerHTML = shell(route);
    bind(root, route, wideToc);
  };

  window.addEventListener('hashchange', render);
  if (!location.hash) {
    location.hash = serializeHash({ view: 'list', query: '' });
  } else {
    render();
  }
}

function shell(route: Route): string {
  const body =
    route.view === 'list'
      ? renderListView({
          reports: filterReports(reports, route.query),
          query: route.query,
          totalCount: reports.length,
        })
      : (() => {
          const doc = findReport(reports, route.id);
          if (!doc) {
            return `
              <section class="ds-empty missing">
                <p>レポートが見つかりません: <code>${route.id}</code></p>
                <a class="ds-nav-link" href="${serializeHash({ view: 'list', query: '' })}">一覧へ戻る</a>
              </section>`;
          }
          return renderReportView(doc);
        })();

  return `
    <div class="ds-page ds-page--wide app-shell">
      <header class="top ds-stack">
        <a class="ds-nav-link" href="../">← ポータルへ戻る</a>
        <div class="top__titles">
          <h1 class="ds-title">Research Report Viewer</h1>
          <p class="ds-lede">research/ 配下の調査レポートを Markdown で閲覧します。</p>
        </div>
      </header>
      ${body}
    </div>
  `;
}

function bind(
  root: HTMLElement,
  route: Route,
  wideToc: MediaQueryList,
): void {
  if (route.view === 'report') {
    const toc = root.querySelector<HTMLDetailsElement>('details.toc');
    if (toc && wideToc.matches) toc.open = true;

    root.querySelectorAll<HTMLButtonElement>('.toc__link[data-target]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.target;
        if (!id) return;
        root.querySelector(`#${CSS.escape(id)}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
        if (toc && !wideToc.matches) {
          toc.open = false;
        }
      });
    });
    return;
  }

  const search = root.querySelector<HTMLInputElement>('#report-search');
  search?.addEventListener('input', () => {
    const next: Route = {
      view: 'list',
      query: search.value,
    };
    const hash = serializeHash(next);
    if (location.hash !== hash) {
      history.replaceState(null, '', hash);
      root.innerHTML = shell(next);
      bind(root, next, wideToc);
      const again = root.querySelector<HTMLInputElement>('#report-search');
      if (again) {
        again.focus();
        const len = again.value.length;
        again.setSelectionRange(len, len);
      }
    }
  });
}
