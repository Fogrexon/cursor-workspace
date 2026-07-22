import { createFlightGame, type GameHud } from './game';

export async function mountApp(root: HTMLElement): Promise<() => void> {
  root.innerHTML = `
    <div class="topbar">
      <h1>Openworld Flight</h1>
      <a class="back" href="../">← ポータルに戻る</a>
    </div>
    <div class="hud">
      <div class="stat"><span class="label">速度</span><span class="value" id="speed">—</span></div>
      <div class="stat"><span class="label">高度</span><span class="value" id="altitude">—</span></div>
      <div class="stat"><span class="label">リング</span><span class="value" id="rings">0 / 0</span></div>
      <div class="stat wide"><span class="label">ステータス</span><span class="value" id="status">起動中</span></div>
    </div>
    <div class="stage">
      <canvas id="game"></canvas>
      <div class="overlay" id="overlay" hidden>
        <h2 id="overlay-title"></h2>
        <p id="overlay-text"></p>
        <button type="button" id="overlay-btn"></button>
      </div>
    </div>
    <p class="hint">WASD / 矢印: ピッチ・ヨー · Q/E: ロール · Shift: 加速 · Ctrl: 減速</p>
  `;

  const canvas = root.querySelector<HTMLCanvasElement>('#game')!;
  const overlay = root.querySelector<HTMLDivElement>('#overlay')!;
  const overlayTitle = root.querySelector<HTMLHeadingElement>('#overlay-title')!;
  const overlayText = root.querySelector<HTMLParagraphElement>('#overlay-text')!;
  const overlayBtn = root.querySelector<HTMLButtonElement>('#overlay-btn')!;
  const speedEl = root.querySelector<HTMLSpanElement>('#speed')!;
  const altitudeEl = root.querySelector<HTMLSpanElement>('#altitude')!;
  const ringsEl = root.querySelector<HTMLSpanElement>('#rings')!;
  const statusEl = root.querySelector<HTMLSpanElement>('#status')!;

  const hud: GameHud = {
    setStatus(text) {
      statusEl.textContent = text;
    },
    setSpeed(text) {
      speedEl.textContent = text;
    },
    setAltitude(text) {
      altitudeEl.textContent = text;
    },
    setRings(text) {
      ringsEl.textContent = text;
    },
    showOverlay(title, body, button) {
      overlayTitle.textContent = title;
      overlayText.textContent = body;
      overlayBtn.textContent = button;
      overlay.hidden = false;
    },
    hideOverlay() {
      overlay.hidden = true;
    },
  };

  const game = await createFlightGame(canvas, hud);
  const onClick = () => game.start();
  overlayBtn.addEventListener('click', onClick);

  return () => {
    overlayBtn.removeEventListener('click', onClick);
    game.dispose();
  };
}
