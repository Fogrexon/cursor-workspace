import { compileDocument, emptyScene } from '../logic/compile';
import { hitTest } from '../logic/hitTest';
import { layoutScene, type InteractionState } from '../logic/layout';
import { collectVariables } from '../logic/cascade';
import { parseStylesheet } from '../logic/parser';
import { stylePropsToMap, type StyleProps } from '../logic/styleProps';
import { mountTree, type UiNodeDesc } from '../logic/tree';
import type { LayoutBox, ParseDiagnostic, Scene } from '../types';
import { paintBox } from './paint';

export type UiSnapshot = {
  diagnostics: ParseDiagnostic[];
  elementCount: number;
  hoverId?: string;
  activeId?: string;
  lastClickId?: string;
};

export type CanvasStyleUi = {
  /** Playground / theme: full document including #id element rules. */
  setDocument: (source: string) => UiSnapshot;
  /** Recommended: visual rules only (types, classes, :root, pseudos). */
  setStylesheet: (source: string) => ParseDiagnostic[];
  /** Recommended: nested tree with optional onClick / inline style. */
  setTree: (roots: UiNodeDesc | UiNodeDesc[]) => void;
  setContent: (id: string, content: string) => void;
  setClassNames: (id: string, classNames: string[]) => void;
  patchStyle: (id: string, style: StyleProps) => void;
  resize: (cssWidth: number, cssHeight: number) => void;
  render: () => void;
  getSnapshot: () => UiSnapshot;
  destroy: () => void;
};

export type CreateCanvasStyleOptions = {
  width?: number;
  height?: number;
  onChange?: (snapshot: UiSnapshot) => void;
};

export function createCanvasStyle(
  canvas: HTMLCanvasElement,
  options: CreateCanvasStyleOptions = {},
): CanvasStyleUi {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D canvas context is unavailable');
  }

  let scene: Scene = emptyScene();
  let diagnostics: ParseDiagnostic[] = [];
  let boxes: LayoutBox[] = [];
  let cssWidth = options.width ?? 720;
  let cssHeight = options.height ?? 420;
  let interaction: InteractionState = {};
  let lastClickId: string | undefined;
  let clickHandlers = new Map<string, () => void>();
  let stylesheetSource = '';

  const snapshot = (): UiSnapshot => ({
    diagnostics,
    elementCount: scene.byId.size,
    hoverId: interaction.hoverId,
    activeId: interaction.activeId,
    lastClickId,
  });

  const emit = (): void => {
    options.onChange?.(snapshot());
  };

  const refresh = (): void => {
    boxes = layoutScene(scene, cssWidth, cssHeight, interaction);
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
    canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);
    for (const box of boxes) {
      paintBox(ctx, box);
    }
    emit();
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
    refresh();
  };

  const onPointerDown = (event: PointerEvent): void => {
    const point = pointFromEvent(event);
    const hit = hitTest(boxes, point.x, point.y);
    interaction = { hoverId: hit?.id, activeId: hit?.id };
    canvas.setPointerCapture(event.pointerId);
    refresh();
  };

  const onPointerUp = (event: PointerEvent): void => {
    const point = pointFromEvent(event);
    const hit = hitTest(boxes, point.x, point.y);
    if (interaction.activeId && hit?.id === interaction.activeId) {
      lastClickId = hit.id;
      clickHandlers.get(hit.id)?.();
    }
    interaction = { hoverId: hit?.id, activeId: undefined };
    refresh();
  };

  const onPointerLeave = (): void => {
    if (!interaction.hoverId && !interaction.activeId) {
      return;
    }
    interaction = {};
    refresh();
  };

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointerleave', onPointerLeave);

  return {
    setDocument(source) {
      clickHandlers = new Map();
      const compiled = compileDocument(source);
      scene = compiled.scene;
      diagnostics = compiled.diagnostics;
      stylesheetSource = source;
      refresh();
      return snapshot();
    },
    setStylesheet(source) {
      stylesheetSource = source;
      const sheet = parseStylesheet(source);
      diagnostics = sheet.diagnostics;
      scene = {
        ...scene,
        stylesheet: sheet,
        variables: collectVariables(sheet),
      };
      refresh();
      return diagnostics;
    },
    setTree(roots) {
      const mounted = mountTree(roots, stylesheetSource);
      // Preserve patch maps that target existing ids when remounting? Full replace is clearer.
      scene = mounted.scene;
      clickHandlers = mounted.clickHandlers;
      diagnostics = mounted.scene.stylesheet.diagnostics;
      refresh();
    },
    setContent(id, content) {
      if (!scene.byId.has(id)) {
        return;
      }
      scene.contentOverrides.set(id, content);
      refresh();
    },
    setClassNames(id, classNames) {
      const node = scene.byId.get(id);
      if (!node) {
        return;
      }
      node.classNames = [...classNames];
      refresh();
    },
    patchStyle(id, style) {
      if (!scene.byId.has(id)) {
        return;
      }
      const prev = scene.inlineStyles.get(id) ?? {};
      scene.inlineStyles.set(id, { ...prev, ...stylePropsToMap(style) });
      refresh();
    },
    resize(nextWidth, nextHeight) {
      cssWidth = Math.max(1, Math.floor(nextWidth));
      cssHeight = Math.max(1, Math.floor(nextHeight));
      refresh();
    },
    render: refresh,
    getSnapshot: snapshot,
    destroy() {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    },
  };
}
