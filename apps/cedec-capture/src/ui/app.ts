import type { Catalog, ListFilters, Route } from '../types';
import { filterSessions, findSession } from '../logic/catalog';
import { parseHash, serializeHash } from '../logic/route';
import { renderListView } from './listView';
import { renderSessionView } from './sessionView';

/**
 * CEDEC Capture を #app にマウントする。ルーティングは location.hash。
 */
export function mountApp(root: HTMLElement, catalog: Catalog): void {
  const render = (): void => {
    const route = parseHash(location.hash);
    root.innerHTML = shell(catalog, route);
    bind(root, catalog, route);
  };

  window.addEventListener('hashchange', render);
  if (!location.hash) {
    location.hash = serializeHash({
      view: 'list',
      filters: {
        query: '',
        day: '',
        field: '',
        keyword: '',
        playgroundOnly: true,
      },
    });
  } else {
    render();
  }
}

function shell(catalog: Catalog, route: Route): string {
  const body =
    route.view === 'list'
      ? renderListView({
          catalog,
          sessions: filterSessions(catalog.sessions, route.filters),
          filters: route.filters,
          totalCount: catalog.sessions.length,
        })
      : (() => {
          const session = findSession(catalog.sessions, route.uuid);
          if (!session) {
            return `
              <section class="ds-empty">
                <p>セッションが見つかりません: <code>${route.uuid}</code></p>
                <a class="ds-nav-link" href="#/list">一覧へ戻る</a>
              </section>`;
          }
          return renderSessionView(session);
        })();

  return `
    <div class="ds-page ds-page--wide app-shell">
      <header class="top ds-stack">
        <a class="ds-nav-link" href="../">← ポータルへ戻る</a>
        <div class="top__titles">
          <h1 class="ds-title">CEDEC Capture</h1>
          <p class="ds-lede">${catalog.event.name} の公開セッションを取り込み、この playground 向けに読みます。</p>
        </div>
      </header>
      ${body}
    </div>
  `;
}

function bind(root: HTMLElement, catalog: Catalog, route: Route): void {
  if (route.view !== 'list') return;

  const search = root.querySelector<HTMLInputElement>('#session-search');
  search?.addEventListener('input', () => {
    const next = { ...route.filters, query: search.value };
    const hash = serializeHash({ view: 'list', filters: next });
    history.replaceState(null, '', hash);
    root.innerHTML = shell(catalog, { view: 'list', filters: next });
    bind(root, catalog, { view: 'list', filters: next });
    const again = root.querySelector<HTMLInputElement>('#session-search');
    if (again) {
      again.focus();
      const len = again.value.length;
      again.setSelectionRange(len, len);
    }
  });

  const applySelect = (patch: Partial<ListFilters>): void => {
    location.hash = serializeHash({
      view: 'list',
      filters: { ...route.filters, ...patch },
    });
  };

  root
    .querySelector<HTMLSelectElement>('#filter-day')
    ?.addEventListener('change', (event) => {
      applySelect({ day: (event.target as HTMLSelectElement).value });
    });
  root
    .querySelector<HTMLSelectElement>('#filter-field')
    ?.addEventListener('change', (event) => {
      applySelect({ field: (event.target as HTMLSelectElement).value });
    });
  root
    .querySelector<HTMLSelectElement>('#filter-keyword')
    ?.addEventListener('change', (event) => {
      applySelect({ keyword: (event.target as HTMLSelectElement).value });
    });
  root
    .querySelector<HTMLInputElement>('#filter-pg')
    ?.addEventListener('change', (event) => {
      applySelect({
        playgroundOnly: (event.target as HTMLInputElement).checked,
      });
    });
}
