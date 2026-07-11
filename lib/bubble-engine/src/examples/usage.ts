/**

 * bubble-engine 使用例（型チェック用）。

 * defineUi + SceneRegistry + navigate + bindUi による宣言的 HUD とゲーム Scene の統合。

 */

import {

  BubbleEngine,

  SceneRegistry,

  defineUi,

  defineResource,

  defineComponent,

  PhysicsLayer,

  Transform,

  RigidBody,

  Collider,

  RenderShape,

  Camera,

  ActiveCamera,

  type Scene,

  type SceneContext,

  type SceneNavigateRequest,

} from '../index.ts';



const GameState = defineResource<{ score: number; bestScore: number }>('GameState');



const Collectible = defineComponent<{ value: number }>('Collectible');



const hudDef = defineUi('hud', {

  anchor: { edge: 'top-left', margin: { x: 16, y: 16 } },

  layout: { mode: 'column', gap: 4 },

  children: [

    { name: 'scoreLabel', text: { bind: 'score', fontSize: 20 } },

    { name: 'bestLabel', text: { bind: 'best', fontSize: 14 } },

  ],

});



const ROUTE_GAME: SceneNavigateRequest[] = [

  { op: 'unload', sceneId: 'menu' },

  { op: 'load', sceneId: 'hud', mode: 'additive', persistent: true },

  { op: 'load', sceneId: 'demo-game', mode: 'single' },

];



const ROUTE_MENU: SceneNavigateRequest[] = [

  { op: 'unload', sceneId: 'demo-game' },

  { op: 'unload', sceneId: 'hud' },

  { op: 'load', sceneId: 'menu', mode: 'additive' },

];



class HudScene implements Scene {

  readonly id = 'hud';

  setup(ctx: SceneContext): void {

    ctx.bindUi('score', {

      resource: GameState,

      select: (s) => s.score,

      format: (n) => `Score: ${n}`,

    });

    ctx.bindUi('best', {

      resource: GameState,

      select: (s) => s.bestScore,

      format: (n) => `Best: ${n}`,

    });

    ctx.mountUi(hudDef);

  }

  teardown(_ctx: SceneContext): void {}

}



class MenuScene implements Scene {

  readonly id = 'menu';

  setup(ctx: SceneContext): void {

    ctx.mountUi(

      defineUi('menu', {

        anchor: { edge: 'center' },

        children: [

          {

            name: 'startBtn',

            button: {

              action: 'start',

              label: 'Start',

              width: 120,

              height: 40,

              fontSize: 18,

              background: { r: 0.4, g: 0.5, b: 1, a: 1 },

            },

          },

        ],

      }),

    );

    ctx.onUiAction('start', () => ctx.navigate(ROUTE_GAME));

  }

  teardown(_ctx: SceneContext): void {}

}



class DemoGameScene implements Scene {

  readonly id = 'demo-game';

  setup(ctx: SceneContext): void {

    const terrain = ctx

      .spawn()

      .with(Transform, { position: { x: 0, y: 0 }, angle: 0 })

      .with(RigidBody, { type: 'static' })

      .with(Collider, {

        shapes: [

          {

            type: 'edgeChain',

            points: [

              { x: -20, y: -2 },

              { x: 40, y: -2 },

            ],

          },

        ],

        category: PhysicsLayer.Terrain,

        mask: PhysicsLayer.All,

      })

      .with(RenderShape, {

        kind: 'edgeChain',

        points: [

          { x: -20, y: -2 },

          { x: 40, y: -2 },

        ],

        stroke: { r: 0.4, g: 0.8, b: 0.4, a: 1 },

        lineWidth: 2,

      })

      .build();



    void terrain;



    const ball = ctx

      .spawn()

      .with(Transform, { position: { x: 0, y: 3 }, angle: 0 })

      .with(RigidBody, { type: 'dynamic' })

      .with(Collider, {

        shapes: [{ type: 'circle', radius: 0.5, density: 1 }],

        category: PhysicsLayer.Player,

        mask: PhysicsLayer.Terrain | PhysicsLayer.Coin,

      })

      .with(RenderShape, {

        kind: 'circle',

        radius: 0.5,

        fill: { r: 0.9, g: 0.3, b: 0.2, a: 1 },

      })

      .build();



    const cam = ctx

      .spawn()

      .with(Camera, { zoom: 34, position: { x: 0, y: 0 }, target: ball, offset: { x: 0, y: 1 } })

      .build();



    ctx.world.insertResource(ActiveCamera, cam);

  }

  teardown(_ctx: SceneContext): void {}

}



function createExampleRegistry(): SceneRegistry {

  return new SceneRegistry()

    .register('menu', () => new MenuScene())

    .register('hud', () => new HudScene())

    .register('demo-game', () => new DemoGameScene());

}



export async function usageExample(canvas: HTMLCanvasElement): Promise<BubbleEngine> {

  const { engine } = await BubbleEngine.createFromCanvas({

    canvas,

    gravity: { x: 0, y: -10 },

  });



  engine.world.insertResource(GameState, { score: 0, bestScore: 0 });

  const navigator = engine.registerScenes(createExampleRegistry());

  navigator.execute(ROUTE_MENU);

  engine.start();



  return engine;

}



export { hudDef, HudScene, DemoGameScene, GameState, Collectible, ROUTE_GAME, ROUTE_MENU };


