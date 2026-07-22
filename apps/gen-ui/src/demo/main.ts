import {
  DUMMY_DATASETS,
  TASK_EMPTY_FIXTURE,
  TASK_FORM_FIXTURE,
  TASK_LIST_FIXTURE,
  USER_LOG_ANALYSIS_FIXTURE,
  renderUiTree,
  type UiTree,
} from '@playground/gen-ui';
import '@playground/theme/theme.css';
import '../client/style.css';
import './demo.css';

type DemoFixture = {
  id: string;
  label: string;
  tree: UiTree;
};

const FIXTURES: DemoFixture[] = [
  { id: 'user-logs', label: 'User activity', tree: USER_LOG_ANALYSIS_FIXTURE },
  { id: 'tasks', label: 'Task list', tree: TASK_LIST_FIXTURE },
  { id: 'form', label: 'Task form', tree: TASK_FORM_FIXTURE },
  { id: 'empty', label: 'Empty state', tree: TASK_EMPTY_FIXTURE },
];

const root = document.querySelector<HTMLDivElement>('#app');
if (!root) throw new Error('#app not found');

root.innerHTML = `
  <div class="app demo-app">
    <header class="app__header">
      <p class="back"><a href="../">← Portal</a></p>
      <div class="brand">gen-ui</div>
      <p class="tagline">
        Constrained generative UI library demo. Filters and charts update locally without an LLM.
      </p>
      <aside class="notice" role="note">
        <strong>Pages では Cursor SDK エージェントは動きません。</strong>
        GitHub / Pages 側に API キーは渡していません（課金を避けるため）。
        ライブエージェントやチャット連携はローカルで
        <code>CURSOR_API_KEY</code> を入れたうえで
        <code>npm run dev</code>、またはキー不要の
        <code>npm run demo:mock</code> を使ってください。
      </aside>
    </header>
    <main class="app__main demo-main">
      <section class="pane pane--ui">
        <div class="demo-toolbar">
          <label class="demo-toolbar__label">
            Library fixture
            <select id="fixture" aria-label="Fixture"></select>
          </label>
          <p id="action-log" class="demo-action" aria-live="polite">
            Select filters or buttons to exercise the local runtime.
          </p>
        </div>
        <div id="ui-root" class="ui-root"></div>
      </section>
      <aside class="pane pane--notes">
        <h2 class="pane__title">What this page is</h2>
        <p>
          Static showcase of <code>@playground/gen-ui</code> (schema, render,
          local <code>dataView</code>). No network calls to Cursor.
        </p>
        <p>
          Source: <code>apps/gen-ui</code> + <code>lib/gen-ui</code>.
          Secrets stay in local <code>.env</code> only.
        </p>
      </aside>
    </main>
  </div>
`;

const selectEl = root.querySelector<HTMLSelectElement>('#fixture');
const uiRootEl = root.querySelector<HTMLElement>('#ui-root');
const actionLogEl = root.querySelector<HTMLElement>('#action-log');
if (!selectEl || !uiRootEl || !actionLogEl) throw new Error('demo DOM missing');

const fixtureSelect = selectEl;
const mount = uiRootEl;
const status = actionLogEl;

fixtureSelect.innerHTML = FIXTURES.map(
  (fixture) => `<option value="${fixture.id}">${fixture.label}</option>`,
).join('');

function paint(tree: UiTree): void {
  renderUiTree(tree, mount, {
    datasets: DUMMY_DATASETS,
    onAction: (action) => {
      status.textContent = `Action: ${action.actionId}${
        action.payload !== undefined ? ` · ${String(action.payload)}` : ''
      }${action.values ? ` · ${JSON.stringify(action.values)}` : ''}`;
    },
  });
}

function applyFixture(id: string): void {
  const fixture = FIXTURES.find((item) => item.id === id) ?? FIXTURES[0];
  fixtureSelect.value = fixture.id;
  paint(fixture.tree);
  status.textContent = `Loaded “${fixture.label}”. Filters and charts stay local.`;
}

fixtureSelect.addEventListener('change', () => applyFixture(fixtureSelect.value));
applyFixture(FIXTURES[0].id);
