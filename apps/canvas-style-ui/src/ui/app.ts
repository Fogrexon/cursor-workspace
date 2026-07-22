import {
  createCanvasUi,
  darkTheme,
  lightTheme,
  node,
  token,
  type CanvasUi,
} from '@playground/canvas-style';
import { GAME_HUD_CODE } from './gameHud';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const nodeEl = document.createElement(tag);
  if (className) {
    nodeEl.className = className;
  }
  if (text != null) {
    nodeEl.textContent = text;
  }
  return nodeEl;
}

function formatId(id: string | undefined): string {
  return id ? `#${id}` : '—';
}

/** Shared look — CSS class / type rules の代わり（Recipe）。 */
const buttonPrimary = {
  padding: [10, 12] as const,
  fill: token('accent'),
  textColor: '#ffffff',
  radius: 6,
  textSize: 13,
  textWeight: 600,
};

/** Mount the Canvas Style UI playground (declarative views). */
export function mountApp(root: HTMLElement): void {
  root.replaceChildren();

  const page = el('div', 'page');
  const topbar = el('header', 'topbar');
  const titleBlock = el('div');
  titleBlock.append(
    el('h1', undefined, 'Canvas Style UI'),
    el(
      'p',
      undefined,
      'グローバル state + view 単位の宣言的 Canvas UI。見た目の共通化は Recipe（定数 + spread）と token テーマ。',
    ),
  );
  const back = el('a', 'back-link', '← ポータルへ');
  back.href = '../';
  topbar.append(titleBlock, back);

  const workspace = el('div', 'workspace');

  const editorPanel = el('section', 'panel');
  const editorHeader = el('div', 'panel-header');
  editorHeader.append(el('h2', undefined, '推奨 API（参考コード）'));
  const codeView = el('pre', 'code-view');
  codeView.textContent = GAME_HUD_CODE;
  editorPanel.append(editorHeader, codeView);

  const previewPanel = el('section', 'panel');
  const previewHeader = el('div', 'panel-header');
  previewHeader.append(el('h2', undefined, 'Canvas Preview'));
  const toolbar = el('div', 'toolbar');
  const resetBtn = el('button', undefined, 'HUD をリセット');
  resetBtn.type = 'button';
  toolbar.append(resetBtn);
  previewHeader.append(toolbar);

  const previewWrap = el('div', 'preview-wrap');
  const canvas = el('canvas');
  canvas.setAttribute('aria-label', 'Canvas UI preview');
  previewWrap.append(canvas);

  const statusRow = el('div', 'status-row');
  const elementsCard = el('div', 'status-card');
  elementsCard.append(el('span', 'label', 'Elements'), el('div', 'value', '0'));
  const hoverCard = el('div', 'status-card');
  hoverCard.append(el('span', 'label', 'Hover'), el('div', 'value', '—'));
  const clickCard = el('div', 'status-card');
  clickCard.append(el('span', 'label', 'Last click'), el('div', 'value', '—'));
  statusRow.append(elementsCard, hoverCard, clickCard);

  previewPanel.append(previewHeader, previewWrap, statusRow);
  workspace.append(editorPanel, previewPanel);

  const help = el('section', 'panel help');
  help.innerHTML = `
    <h2>どう使うか</h2>
    <div class="help-grid">
      <div>
        <h3>データ</h3>
        <ul>
          <li>共有は <code>ui.state(...)</code></li>
          <li>島ごとに <code>ui.view({ render })</code></li>
          <li>読んだキーが変わった view だけ再評価</li>
        </ul>
      </div>
      <div>
        <h3>スタイル共通化</h3>
        <ul>
          <li>CSS class / 要素セレクタは使わない</li>
          <li><code>const buttonPrimary = {…}</code> を spread</li>
          <li>色は <code>token('surface')</code> + Theme</li>
        </ul>
      </div>
      <div>
        <h3>向いていない</h3>
        <ul>
          <li>セレクタ／カスケードに頼る上書き</li>
          <li>共有値を view ローカルに複製して手動同期</li>
          <li>DOM/CSS 完全互換が必要な UI</li>
        </ul>
      </div>
      <div>
        <h3>意図</h3>
        <ul>
          <li><code>knowledge/apps/canvas-style-ui/authoring-dx.md</code></li>
        </ul>
      </div>
    </div>
  `;

  page.append(topbar, workspace, help);
  root.append(page);

  const elementsValue = elementsCard.querySelector('.value') as HTMLElement;
  const hoverValue = hoverCard.querySelector('.value') as HTMLElement;
  const clickValue = clickCard.querySelector('.value') as HTMLElement;

  let canvasUi: CanvasUi | undefined;

  const renderStatus = (snapshot: {
    elementCount: number;
    hoverId?: string;
    lastClickId?: string;
  }): void => {
    elementsValue.textContent = String(snapshot.elementCount);
    hoverValue.textContent = formatId(snapshot.hoverId);
    clickValue.textContent = formatId(snapshot.lastClickId);
  };

  const fitCanvas = (): void => {
    const rect = previewWrap.getBoundingClientRect();
    const width = Math.max(320, Math.floor(rect.width - 32));
    const height = Math.round((width * 420) / 720);
    canvasUi?.resize(width, height);
  };

  const mountGameHud = (): void => {
    canvasUi?.destroy();
    canvasUi = createCanvasUi(canvas, { onChange: renderStatus });

    const app = canvasUi.state({
      hp: 100,
      score: 0,
      theme: 'dark' as 'dark' | 'light',
      hudOpen: true,
    });

    canvasUi.setTheme(() => (app.theme === 'dark' ? darkTheme : lightTheme), {
      transition: 200,
    });

    canvasUi.view({
      state: { pulse: false },
      render: (local) =>
        node('panel', {
          id: 'hud',
          style: {
            x: 24,
            y: app.hudOpen ? 24 : 8,
            width: 280,
            direction: 'column',
            gap: 10,
            padding: 16,
            fill: token('surface'),
            stroke: token('border'),
            radius: 12,
            opacity: app.hudOpen ? 1 : 0.35,
            transition: { opacity: 220, y: 220 },
          },
          children: [
            node('text', {
              id: 'title',
              style: {
                text: 'Survival Run',
                textSize: 18,
                textWeight: 700,
                textColor: token('text'),
              },
            }),
            node('text', {
              id: 'hp-label',
              style: {
                text: `HP ${app.hp}`,
                textSize: 13,
                textColor: app.hp < 30 ? token('danger') : token('muted'),
                transition: { textColor: 160 },
              },
            }),
            node('panel', {
              id: 'hp-fill',
              style: {
                width: (248 * app.hp) / 100,
                height: 10,
                fill: app.hp < 30 ? token('danger') : token('ok'),
                radius: 6,
                transition: { width: 180, fill: 180 },
              },
            }),
            node('button', {
              id: 'hit',
              style: { ...buttonPrimary, text: 'Take hit' },
              onClick: () => {
                app.hp = Math.max(0, app.hp - 15);
              },
            }),
            node('button', {
              id: 'heal',
              style: { ...buttonPrimary, fill: token('danger'), text: 'Heal' },
              onClick: () => {
                app.hp = Math.min(100, app.hp + 20);
              },
            }),
            node('button', {
              id: 'toggle',
              style: { ...buttonPrimary, text: local.pulse ? 'Hide*' : 'Hide' },
              onClick: () => {
                app.hudOpen = !app.hudOpen;
                local.pulse = !local.pulse;
              },
            }),
          ],
        }),
    });

    canvasUi.view({
      render: () =>
        node('panel', {
          id: 'scoreboard',
          style: {
            x: 520,
            y: 24,
            width: 160,
            padding: 12,
            fill: token('surface'),
            stroke: token('border'),
            radius: 12,
            direction: 'column',
            gap: 8,
          },
          children: [
            node('text', {
              id: 'score-text',
              style: {
                text: `Score ${app.score}`,
                textColor: token('text'),
                textSize: 16,
                textWeight: 700,
              },
            }),
            node('button', {
              id: 'theme',
              style: { ...buttonPrimary, text: 'Theme' },
              onClick: () => {
                app.theme = app.theme === 'dark' ? 'light' : 'dark';
              },
            }),
            node('button', {
              id: 'loot',
              style: { ...buttonPrimary, text: '+Score' },
              onClick: () => {
                app.score += 10;
              },
            }),
          ],
        }),
    });

    fitCanvas();
  };

  resetBtn.addEventListener('click', () => mountGameHud());
  window.addEventListener('resize', () => {
    fitCanvas();
    canvasUi?.render();
  });

  mountGameHud();
}
