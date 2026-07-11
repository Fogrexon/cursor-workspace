import { SceneRegistry } from '@playground/bubble-engine';
import { MenuScene } from '../scenes/MenuScene';
import { HudScene } from '../scenes/HudScene';
import { LevelScene } from '../scenes/LevelScene';
import { ResultScene } from '../scenes/ResultScene';

export function createDemoSceneRegistry(): SceneRegistry {
  return new SceneRegistry()
    .register('menu', () => new MenuScene())
    .register('hud', () => new HudScene())
    .register('level', () => new LevelScene())
    .register('result', () => new ResultScene());
}
