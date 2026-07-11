import './style.css';
import { BubbleEngine } from '@playground/bubble-engine';
import { GameState } from './game/types';
import { createDemoSceneRegistry } from './game/sceneRegistry';
import { ROUTE_MENU } from './game/routes';

async function main(): Promise<void> {
  const root = document.querySelector<HTMLDivElement>('#app');
  if (!root) throw new Error('#app not found');

  root.innerHTML = `
    <header class="header">
      <h1>Angry Bubble</h1>
      <p>スリングショットでブロックを崩し、豚をすべて倒せ！</p>
    </header>
    <div class="stage-wrap">
      <canvas id="game"></canvas>
    </div>
  `;

  const canvas = document.querySelector<HTMLCanvasElement>('#game');
  if (!canvas) throw new Error('canvas not found');

  const { engine } = await BubbleEngine.createFromCanvas({
    canvas,
    gravity: { x: 0, y: -14 },
  });

  engine.world.insertResource(GameState, {
    score: 0,
    bestScore: 0,
    birdsLeft: 3,
    pigsLeft: 0,
    headline: '',
    subline: '',
  });

  const navigator = engine.registerScenes(createDemoSceneRegistry());
  navigator.execute(ROUTE_MENU);

  engine.start();

  const loop = (now: number): void => {
    engine.tick(now / 1000);
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

main().catch((err) => {
  console.error(err);
  document.body.innerHTML = `<pre class="error">${String(err)}</pre>`;
});
