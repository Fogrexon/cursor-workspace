import type { Scene, SceneContext } from '@playground/bubble-engine';
import { menuDef } from '../ui/screens';
import { ROUTE_LEVEL } from '../game/routes';

export class MenuScene implements Scene {
  readonly id = 'menu';

  setup(ctx: SceneContext): void {
    ctx.mountUi(menuDef);
    ctx.onUiAction('play', () => ctx.navigate(ROUTE_LEVEL));
  }

  teardown(_ctx: SceneContext): void {}
}
