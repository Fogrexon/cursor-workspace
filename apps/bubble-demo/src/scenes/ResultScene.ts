import type { Scene, SceneContext } from '@playground/bubble-engine';
import { resultDef } from '../ui/screens';
import { GameState } from '../game/types';
import { ROUTE_LEVEL, ROUTE_MENU } from '../game/routes';

export class ResultScene implements Scene {
  readonly id = 'result';

  setup(ctx: SceneContext): void {
    ctx.bindUi('headline', {
      resource: GameState,
      select: (s) => s.headline,
      format: (v) => String(v),
    });
    ctx.bindUi('subline', {
      resource: GameState,
      select: (s) => s.subline,
      format: (v) => String(v),
    });
    ctx.mountUi(resultDef);
    ctx.onUiAction('retry', () => ctx.navigate(ROUTE_LEVEL));
    ctx.onUiAction('menu', () => ctx.navigate(ROUTE_MENU));
  }

  teardown(_ctx: SceneContext): void {}
}
