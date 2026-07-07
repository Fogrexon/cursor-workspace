import '@playground/theme/theme.css';
import './style.css';

import { CarWorld } from './game/CarWorld';
import { generateCoins, generateTerrain } from './logic/terrain';
import { bestScore, computeScore, formatDistance, metersFromStart } from './logic/score';
import { Renderer } from './ui/renderer';
import { InputController } from './ui/input';
import type { Coin, Point } from './types';

const BEST_KEY = 'box2d-car-game:best';
const FIXED_DT = 1 / 60;
const START_X = 6;
const FLIP_LIMIT_SEC = 1.6; // 裏返り継続でゲームオーバー

const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `
  <div class="topbar">
    <h1>Box2D カーゲーム</h1>
    <a class="back" href="../">← ポータルに戻る</a>
  </div>
  <div class="hud">
    <div class="stat"><span class="label">きょり</span><span class="value" id="distance">0.0 m</span></div>
    <div class="stat"><span class="label">コイン</span><span class="value" id="coins">0</span></div>
    <div class="stat"><span class="label">スコア</span><span class="value" id="score">0</span></div>
    <div class="stat"><span class="label">ベスト</span><span class="value" id="best">0</span></div>
  </div>
  <div class="stage">
    <canvas id="game"></canvas>
    <div class="overlay" id="overlay">
      <h2 id="overlay-title">Box2D カーゲーム</h2>
      <p id="overlay-text">アクセルで前進、ブレーキで後退。丘を越えてどこまで進めるか挑戦しよう。空中ではアクセル/ブレーキで姿勢を立て直せます。</p>
      <button id="start">スタート</button>
    </div>
  </div>
  <div class="pedals">
    <button class="brake" id="brake">◀ ブレーキ</button>
    <button id="throttle">アクセル ▶</button>
  </div>
  <p class="hint">キーボード: → / D でアクセル、← / A でブレーキ</p>
`;

const canvas = app.querySelector<HTMLCanvasElement>('#game')!;
const overlay = app.querySelector<HTMLDivElement>('#overlay')!;
const overlayTitle = app.querySelector<HTMLHeadingElement>('#overlay-title')!;
const overlayText = app.querySelector<HTMLParagraphElement>('#overlay-text')!;
const startBtn = app.querySelector<HTMLButtonElement>('#start')!;
const distanceEl = app.querySelector<HTMLSpanElement>('#distance')!;
const coinsEl = app.querySelector<HTMLSpanElement>('#coins')!;
const scoreEl = app.querySelector<HTMLSpanElement>('#score')!;
const bestEl = app.querySelector<HTMLSpanElement>('#best')!;

const renderer = new Renderer(canvas);
const input = new InputController(
  app.querySelector<HTMLButtonElement>('#throttle')!,
  app.querySelector<HTMLButtonElement>('#brake')!,
);

window.addEventListener('resize', () => renderer.resize());

interface Session {
  terrain: Point[];
  coins: Coin[];
  world: CarWorld;
  collectedCoins: number;
  flipTimer: number;
  running: boolean;
  over: boolean;
}

let session: Session | null = null;
let best = loadBest();
bestEl.textContent = String(best);

function loadBest(): number {
  const raw = localStorage.getItem(BEST_KEY);
  const n = raw ? Number(raw) : 0;
  return Number.isFinite(n) ? n : 0;
}

function saveBest(value: number): void {
  best = bestScore(best, value);
  localStorage.setItem(BEST_KEY, String(best));
  bestEl.textContent = String(best);
}

function newSession(): Session {
  const seed = Math.floor(Math.random() * 1_000_000);
  const terrain = generateTerrain({
    seed,
    segmentCount: 600,
    segmentWidth: 3,
    flatSegments: 4,
    amplitude: 3.4,
    roughness: 0.55,
  });
  const coins = generateCoins(terrain, { spacing: 9, height: 1.4, skipUntilX: START_X + 8 });
  return {
    terrain,
    coins,
    world: new CarWorld(terrain, START_X),
    collectedCoins: 0,
    flipTimer: 0,
    running: true,
    over: false,
  };
}

function start(): void {
  session = newSession();
  overlay.hidden = true;
}

function gameOver(reason: string): void {
  if (!session) return;
  session.running = false;
  session.over = true;
  const distance = metersFromStart(START_X, session.world.getChassisTransform().x);
  const score = computeScore({ distance, coins: session.collectedCoins });
  saveBest(score);
  overlayTitle.textContent = 'ゲームオーバー';
  overlayText.textContent = `${reason} スコア ${score}(距離 ${formatDistance(distance)} / コイン ${session.collectedCoins})`;
  startBtn.textContent = 'もう一度';
  overlay.hidden = false;
}

function collectCoins(chassisX: number, chassisY: number): void {
  if (!session) return;
  const reach = 1.0;
  for (const coin of session.coins) {
    if (coin.taken) continue;
    const dx = coin.x - chassisX;
    const dy = coin.y - chassisY;
    if (dx * dx + dy * dy <= reach * reach) {
      coin.taken = true;
      session.collectedCoins += 1;
    }
  }
}

function update(dt: number): void {
  if (!session || !session.running) return;
  session.world.step(dt, input.state);

  const chassis = session.world.getChassisTransform();
  collectCoins(chassis.x, chassis.y);

  // 裏返りが続いたらゲームオーバー
  if (session.world.isFlipped()) {
    session.flipTimer += dt;
    if (session.flipTimer >= FLIP_LIMIT_SEC) {
      gameOver('横転してしまった！');
      return;
    }
  } else {
    session.flipTimer = 0;
  }

  // コース外(奈落)に落ちた
  if (chassis.y < -25) {
    gameOver('谷に落ちてしまった！');
  }
}

function refreshHud(): void {
  if (!session) return;
  const distance = metersFromStart(START_X, session.world.getChassisTransform().x);
  const score = computeScore({ distance, coins: session.collectedCoins });
  distanceEl.textContent = formatDistance(distance);
  coinsEl.textContent = String(session.collectedCoins);
  scoreEl.textContent = String(score);
}

let last = performance.now();
let accumulator = 0;

function frame(now: number): void {
  const elapsed = Math.min(0.1, (now - last) / 1000);
  last = now;

  if (session) {
    accumulator += elapsed;
    while (accumulator >= FIXED_DT) {
      update(FIXED_DT);
      accumulator -= FIXED_DT;
    }
    renderer.render({
      terrain: session.terrain,
      coins: session.coins,
      chassis: session.world.getChassisTransform(),
      wheels: session.world.getWheelTransforms(),
    });
    refreshHud();
  }

  requestAnimationFrame(frame);
}

startBtn.addEventListener('click', start);
requestAnimationFrame(frame);
