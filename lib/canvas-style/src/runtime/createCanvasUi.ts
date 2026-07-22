import { resolveNodeStyle } from '../logic/compile';
import { hitTest } from '../logic/hitTest';
import { layoutScene, type InteractionState } from '../logic/layout';
import {
  createReactiveStore,
  readsHit,
  trackReads,
  type ReactiveStore,
  type StoreId,
} from '../logic/reactive';
import { transitionDurations, type StyleProps } from '../logic/styleProps';
import { darkTheme } from '../logic/theme';
import { mountTree, type UiNodeDesc } from '../logic/tree';
import type { LayoutBox, Scene, Theme } from '../types';
import { createMotionEngine, snapshotAnimatable } from './motion';
import { paintBox } from './paint';

export type UiSnapshot = {
  elementCount: number;
  viewCount: number;
  hoverId?: string;
  activeId?: string;
  lastClickId?: string;
};

export type ViewOptions<S extends Record<string, unknown>> = {
  /** Optional view-local UI state (shared data belongs in `ui.state`). */
  state?: S;
  render: (local: S) => UiNodeDesc | UiNodeDesc[];
};

export type ViewHandle<S extends Record<string, unknown>> = {
  state: S;
  destroy: () => void;
};

export type SetThemeOptions = {
  transition?: number;
};

export type CanvasUi = {
  /** Global shared reactive state (first-class). */
  state: <T extends Record<string, unknown>>(initial: T) => ReactiveStore<T>;
  /** Independent tree + optional local state. Re-evaluates when read keys change. */
  view: <S extends Record<string, unknown> = Record<string, never>>(
    options: ViewOptions<S>,
  ) => ViewHandle<S>;
  setTheme: (theme: Theme | (() => Theme), options?: SetThemeOptions) => void;
  resize: (width: number, height: number) => void;
  render: () => void;
  getSnapshot: () => UiSnapshot;
  destroy: () => void;
};

export type CreateCanvasUiOptions = {
  width?: number;
  height?: number;
  onChange?: (snapshot: UiSnapshot) => void;
};

type ViewRecord = {
  id: string;
  localStore?: ReactiveStore<Record<string, unknown>>;
  render: (local: Record<string, unknown>) => UiNodeDesc | UiNodeDesc[];
  /** storeId → keys read on last render */
  deps: Map<StoreId, Set<string>>;
  rootIds: string[];
};

type NodeStyleMeta = {
  transition: Map<string, number>;
  animatable: StyleProps;
};

type MountPayload = {
  roots: Scene['roots'];
  byId: Scene['byId'];
  inlineStyles: Scene['inlineStyles'];
  contentOverrides: Scene['contentOverrides'];
  clickHandlers: Map<string, () => void>;
};

function themeSignature(theme: Theme): string {
  return Object.keys(theme)
    .sort()
    .map((key) => `${key}:${String(theme[key])}`)
    .join('|');
}

/**
 * Declarative Canvas UI runtime: global `state`, multiple `view`s, theme tokens,
 * and style `transition`s. See `knowledge/apps/canvas-style-ui/authoring-dx.md`.
 */
export function createCanvasUi(
  canvas: HTMLCanvasElement,
  options: CreateCanvasUiOptions = {},
): CanvasUi {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas context is unavailable');
  }

  let cssWidth = options.width ?? 720;
  let cssHeight = options.height ?? 420;
  let interaction: InteractionState = {};
  let lastClickId: string | undefined;
  let boxes: LayoutBox[] = [];
  let theme: Theme = { ...darkTheme };
  let themeFactory: (() => Theme) | undefined;
  let themeTransitionMs = 0;

  const views: ViewRecord[] = [];
  let viewSeq = 0;
  const viewMounts = new Map<string, MountPayload>();
  const nodeMeta = new Map<string, NodeStyleMeta>();
  let clickHandlers = new Map<string, () => void>();

  let scene: Scene = {
    roots: [],
    byId: new Map(),
    variables: {},
    stylesheet: { rules: [], diagnostics: [] },
    inlineStyles: new Map(),
    contentOverrides: new Map(),
    theme,
    motionOverlays: new Map(),
  };

  const motion = createMotionEngine(() => {
    paint();
    emit();
  });

  const syncMotionOverlays = (): void => {
    scene.motionOverlays = new Map();
    for (const id of scene.byId.keys()) {
      const overlay = motion.getOverlay(id);
      if (overlay) {
        scene.motionOverlays.set(id, overlay);
      }
    }
  };

  const snapshot = (): UiSnapshot => ({
    elementCount: scene.byId.size,
    viewCount: views.length,
    hoverId: interaction.hoverId,
    activeId: interaction.activeId,
    lastClickId,
  });

  const emit = (): void => {
    options.onChange?.(snapshot());
  };

  const paint = (): void => {
    syncMotionOverlays();
    boxes = layoutScene(scene, cssWidth, cssHeight, interaction);
    const dpr =
      (typeof globalThis !== 'undefined' &&
        'devicePixelRatio' in globalThis &&
        Number((globalThis as { devicePixelRatio?: number }).devicePixelRatio)) ||
      1;
    canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
    canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    const canvasBg = theme.canvas;
    if (typeof canvasBg === 'string') {
      ctx.fillStyle = canvasBg;
      ctx.fillRect(0, 0, cssWidth, cssHeight);
    }
    for (const box of boxes) {
      paintBox(ctx, box);
    }
  };

  const combineScenes = (): void => {
    const roots: Scene['roots'] = [];
    const byId = new Map() as Scene['byId'];
    const inlineStyles = new Map() as Scene['inlineStyles'];
    const contentOverrides = new Map() as Scene['contentOverrides'];
    const handlers = new Map<string, () => void>();

    for (const view of views) {
      const mounted = viewMounts.get(view.id);
      if (!mounted) {
        continue;
      }
      roots.push(...mounted.roots);
      for (const [id, node] of mounted.byId) {
        if (byId.has(id)) {
          throw new Error(`Duplicate UI node id across views: ${id}`);
        }
        byId.set(id, node);
      }
      for (const [id, style] of mounted.inlineStyles) {
        inlineStyles.set(id, style);
      }
      for (const [id, content] of mounted.contentOverrides) {
        contentOverrides.set(id, content);
      }
      for (const [id, fn] of mounted.clickHandlers) {
        handlers.set(id, fn);
      }
    }

    scene = {
      roots,
      byId,
      variables: {},
      stylesheet: { rules: [], diagnostics: [] },
      inlineStyles,
      contentOverrides,
      theme,
      motionOverlays: scene.motionOverlays,
    };
    clickHandlers = handlers;
  };

  const applyThemeCrossFade = (prevTheme: Theme, durationMs: number): void => {
    if (durationMs <= 0) {
      for (const [id, meta] of nodeMeta) {
        const el = scene.byId.get(id);
        if (el) {
          meta.animatable = snapshotAnimatable(resolveNodeStyle(scene, el));
        }
      }
      return;
    }
    for (const [id, meta] of nodeMeta) {
      const el = scene.byId.get(id);
      if (!el) {
        continue;
      }
      const from = snapshotAnimatable(
        resolveNodeStyle({ ...scene, theme: prevTheme }, el),
      );
      const to = snapshotAnimatable(resolveNodeStyle(scene, el));
      const diffFrom: StyleProps = {};
      const diffTo: StyleProps = {};
      for (const key of ['background', 'color', 'opacity'] as const) {
        if (!Object.is(from[key], to[key])) {
          (diffFrom as Record<string, unknown>)[key] = from[key];
          (diffTo as Record<string, unknown>)[key] = to[key];
        }
      }
      if (Object.keys(diffTo).length > 0) {
        motion.start(id, diffFrom, diffTo, { duration: durationMs });
      }
      meta.animatable = to;
    }
  };

  const applyTransitions = (
    prevMeta: Map<string, NodeStyleMeta>,
    nextTree: UiNodeDesc | UiNodeDesc[],
  ): void => {
    const walk = (nodeDesc: UiNodeDesc): void => {
      const prev = prevMeta.get(nodeDesc.id);
      const next = nodeMeta.get(nodeDesc.id);
      if (prev && next) {
        for (const [key, ms] of next.transition) {
          const a = (prev.animatable as Record<string, unknown>)[key];
          const b = (next.animatable as Record<string, unknown>)[key];
          if (a == null || b == null || Object.is(a, b)) {
            continue;
          }
          if (
            (typeof a === 'number' && typeof b === 'number') ||
            (typeof a === 'string' && typeof b === 'string')
          ) {
            motion.start(
              nodeDesc.id,
              { [key]: a } as StyleProps,
              { [key]: b } as StyleProps,
              { duration: ms },
            );
          }
        }
      }
      for (const child of nodeDesc.children ?? []) {
        walk(child);
      }
    };
    const list = Array.isArray(nextTree) ? nextTree : [nextTree];
    for (const root of list) {
      walk(root);
    }
  };

  const renderView = (view: ViewRecord): void => {
    const local = view.localStore ?? ({} as Record<string, unknown>);
    const prevMeta = new Map(nodeMeta);
    const oldMount = viewMounts.get(view.id);
    if (oldMount) {
      for (const id of oldMount.byId.keys()) {
        nodeMeta.delete(id);
      }
    }

    const { value: tree, reads } = trackReads(() => view.render(local));
    view.deps = reads;

    const mounted = mountTree(tree);
    mounted.scene.theme = theme;
    viewMounts.set(view.id, {
      roots: mounted.scene.roots,
      byId: mounted.scene.byId,
      inlineStyles: mounted.scene.inlineStyles,
      contentOverrides: mounted.scene.contentOverrides,
      clickHandlers: mounted.clickHandlers,
    });
    view.rootIds = mounted.scene.roots.map((r) => r.id);

    combineScenes();

    const walkMeta = (nodeDesc: UiNodeDesc): void => {
      const el = scene.byId.get(nodeDesc.id);
      if (el && nodeDesc.style) {
        const resolved = resolveNodeStyle(scene, el);
        nodeMeta.set(nodeDesc.id, {
          transition: transitionDurations(nodeDesc.style),
          animatable: snapshotAnimatable(resolved),
        });
      }
      for (const child of nodeDesc.children ?? []) {
        walkMeta(child);
      }
    };
    const list = Array.isArray(tree) ? tree : [tree];
    for (const root of list) {
      walkMeta(root);
    }

    applyTransitions(prevMeta, tree);
  };

  const flush = (): void => {
    paint();
    emit();
  };

  const notifyStores = (storeId: StoreId, changedKeys: Set<string>): void => {
    if (themeFactory) {
      const prevTheme = theme;
      const next = { ...themeFactory() };
      if (themeSignature(next) !== themeSignature(theme)) {
        theme = next;
        scene.theme = theme;
        applyThemeCrossFade(prevTheme, themeTransitionMs);
      }
    }

    let dirty = false;
    for (const view of views) {
      if (readsHit(view.deps, storeId, changedKeys)) {
        renderView(view);
        dirty = true;
      }
    }
    if (dirty || themeFactory) {
      flush();
    }
  };

  const pointFromEvent = (event: PointerEvent): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * cssWidth,
      y: ((event.clientY - rect.top) / rect.height) * cssHeight,
    };
  };

  const onPointerMove = (event: PointerEvent): void => {
    const point = pointFromEvent(event);
    const hit = hitTest(boxes, point.x, point.y);
    if (hit?.id === interaction.hoverId) {
      return;
    }
    interaction = { ...interaction, hoverId: hit?.id };
    flush();
  };

  const onPointerDown = (event: PointerEvent): void => {
    const point = pointFromEvent(event);
    const hit = hitTest(boxes, point.x, point.y);
    interaction = { hoverId: hit?.id, activeId: hit?.id };
    canvas.setPointerCapture(event.pointerId);
    flush();
  };

  const onPointerUp = (event: PointerEvent): void => {
    const point = pointFromEvent(event);
    const hit = hitTest(boxes, point.x, point.y);
    if (interaction.activeId && hit?.id === interaction.activeId) {
      lastClickId = hit.id;
      clickHandlers.get(hit.id)?.();
    }
    interaction = { hoverId: hit?.id, activeId: undefined };
    flush();
  };

  const onPointerLeave = (): void => {
    if (!interaction.hoverId && !interaction.activeId) {
      return;
    }
    interaction = {};
    flush();
  };

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);

  return {
    state<T extends Record<string, unknown>>(initial: T) {
      const store = createReactiveStore(initial, (changedKeys) => {
        notifyStores(store.__storeId, changedKeys);
      });
      return store;
    },

    view<S extends Record<string, unknown> = Record<string, never>>(
      viewOptions: ViewOptions<S>,
    ) {
      const id = `view-${viewSeq++}`;
      let localStore: ReactiveStore<Record<string, unknown>> | undefined;
      if (viewOptions.state) {
        localStore = createReactiveStore(
          { ...viewOptions.state } as Record<string, unknown>,
          (changedKeys) => {
            notifyStores(localStore!.__storeId, changedKeys);
          },
        );
      }
      const record: ViewRecord = {
        id,
        localStore,
        render: (local) => viewOptions.render(local as S),
        deps: new Map(),
        rootIds: [],
      };
      views.push(record);
      renderView(record);
      flush();
      return {
        state: (localStore ?? ({} as S)) as S,
        destroy() {
          const idx = views.indexOf(record);
          if (idx >= 0) {
            views.splice(idx, 1);
          }
          const mounted = viewMounts.get(id);
          if (mounted) {
            for (const nodeId of mounted.byId.keys()) {
              nodeMeta.delete(nodeId);
            }
          }
          viewMounts.delete(id);
          combineScenes();
          flush();
        },
      };
    },

    setTheme(next, themeOptions = {}) {
      const resolve = typeof next === 'function' ? next : () => next;
      themeFactory = typeof next === 'function' ? next : undefined;
      themeTransitionMs = themeOptions.transition ?? 0;
      const prevTheme = theme;
      theme = { ...resolve() };
      scene.theme = theme;
      applyThemeCrossFade(prevTheme, themeTransitionMs);
      flush();
    },

    resize(width, height) {
      cssWidth = Math.max(1, Math.floor(width));
      cssHeight = Math.max(1, Math.floor(height));
      flush();
    },

    render() {
      for (const view of views) {
        renderView(view);
      }
      flush();
    },

    getSnapshot: snapshot,

    destroy() {
      motion.clear();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      views.length = 0;
      viewMounts.clear();
      nodeMeta.clear();
    },
  };
}
