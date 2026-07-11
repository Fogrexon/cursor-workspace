import { type Scene, type SceneContext } from '@playground/bubble-engine';
import { hudDef, pauseHintDef } from '../ui/screens';
import { GameState } from '../game/types';

export class HudScene implements Scene {
  readonly id = 'hud';

  setup(ctx: SceneContext): void {
    ctx.bindUi('score', {
      resource: GameState,
      select: (s) => s.score,
      format: (n) => `Score: ${n}`,
    });
    ctx.bindUi('birds', {
      resource: GameState,
      select: (s) => s.birdsLeft,
      format: (n) => `Birds: ${n}`,
    });
    ctx.bindUi('pigs', {
      resource: GameState,
      select: (s) => s.pigsLeft,
      format: (n) => `Pigs: ${n}`,
    });
    ctx.mountUi(hudDef);
    ctx.mountUi(pauseHintDef);
  }

  teardown(_ctx: SceneContext): void {}
}
