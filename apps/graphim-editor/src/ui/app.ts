import { Graphim, type GraphimInstance } from 'graphim';
import sampleUrl from '../assets/sample.svg';
import { graphNeedsAnimation } from '../logic/animation';
import { compileEditorNode } from '../logic/compile';
import {
  MAX_PROJECT_DIMENSION,
  NODE_DEFINITIONS,
  createEditorNode,
  sourceAssetId,
  sourceAssetName,
  type EditorDocument,
  type EditorNode,
  type NodeKind,
} from '../logic/model';
import {
  STORAGE_KEY,
  parseEditorDocument,
  serializeEditorDocument,
} from '../logic/persistence';
import { EDITOR_PRESETS } from '../logic/presets';
import { validateEditorDocument } from '../logic/validate';
import { loadImageAsset, saveImageAsset } from './imageAssets';
import { createRadialMaskImage } from './images';

type EditorState = {
  document: EditorDocument;
  selectedId: string | null;
  pendingConnection: string | null;
};

type RuntimeImageAsset = {
  image: HTMLImageElement;
  name: string;
  url: string;
};

export function mountApp(root: HTMLElement): void {
  const state: EditorState = {
    document: loadStoredDocument() ?? EDITOR_PRESETS[0].create(),
    selectedId: null,
    pendingConnection: null,
  };
  let finalInstance: GraphimInstance | null = null;
  let nodeInstance: GraphimInstance | null = null;
  let maskImage: HTMLImageElement | null = null;
  let previewTimer = 0;
  let sourcePickerTargetId: string | null = null;
  const imageAssets = new Map<string, RuntimeImageAsset>();

  root.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <a href="../" class="portal-link">← Portal</a>
          <div><h1>Graphim Node Editor</h1><p>WebGL2 effect DAG designer</p></div>
        </div>
        <div class="topbar__actions">
          <label class="project-size" title="Project output size">
            <input id="project-width" type="number" min="1" max="${MAX_PROJECT_DIMENSION}" aria-label="Project width" />
            <span>×</span>
            <input id="project-height" type="number" min="1" max="${MAX_PROJECT_DIMENSION}" aria-label="Project height" />
            <span>px</span>
          </label>
          <select id="preset" aria-label="Preset"></select>
          <button id="new-project" class="button button--quiet" type="button">Reset</button>
          <button id="save-project" class="button button--quiet" type="button">Save JSON</button>
          <button id="load-project" class="button button--quiet" type="button">Load JSON</button>
          <button id="export-image" class="button" type="button">Export image</button>
          <input id="project-file" type="file" accept="application/json,.json" hidden />
          <input id="source-asset-file" type="file" accept="image/*" hidden />
        </div>
      </header>
      <main class="editor">
        <aside class="palette panel">
          <div class="panel__heading"><span>Nodes</span><small>click to add</small></div>
          <div id="palette-list"></div>
        </aside>
        <section class="workspace-panel">
          <div class="workspace-toolbar">
            <span id="connection-hint">Select an output port, then an input port</span>
            <button id="clear-wire" class="text-button" type="button" hidden>Cancel connection</button>
          </div>
          <div id="graph-scroll" class="graph-scroll">
            <div id="workspace" class="workspace">
              <svg id="wires" class="wires" aria-hidden="true"></svg>
              <div id="nodes" class="nodes"></div>
            </div>
          </div>
        </section>
        <aside class="inspector panel">
          <div class="panel__heading"><span>Inspector</span></div>
          <div id="inspector-content" class="inspector-content"></div>
          <section class="preview">
            <div class="preview__heading">
              <span>Final output</span>
            </div>
            <div class="preview__stage">
              <img id="final-preview-source" src="${sampleUrl}" alt="Final Graphim output source" />
            </div>
            <p id="final-status" class="status" aria-live="polite">Loading WebGL2…</p>
          </section>
          <section class="preview preview--node is-idle">
            <div class="preview__heading">
              <span id="node-preview-title">Node output</span>
            </div>
            <div class="preview__stage">
              <img id="node-preview-source" src="${sampleUrl}" alt="Selected node output source" />
            </div>
            <p id="node-status" class="status" aria-live="polite">Select a node</p>
          </section>
        </aside>
      </main>
    </div>
  `;

  const palette = required<HTMLElement>(root, '#palette-list');
  const nodesLayer = required<HTMLElement>(root, '#nodes');
  const wires = required<SVGSVGElement>(root, '#wires');
  const workspace = required<HTMLElement>(root, '#workspace');
  const graphScroll = required<HTMLElement>(root, '#graph-scroll');
  const inspector = required<HTMLElement>(root, '#inspector-content');
  const finalStatus = required<HTMLElement>(root, '#final-status');
  const nodeStatus = required<HTMLElement>(root, '#node-status');
  const nodePreviewTitle = required<HTMLElement>(root, '#node-preview-title');
  const finalSourceImage = required<HTMLImageElement>(root, '#final-preview-source');
  const nodeSourceImage = required<HTMLImageElement>(root, '#node-preview-source');
  const nodePreviewSection = required<HTMLElement>(root, '.preview--node');
  const presetSelect = required<HTMLSelectElement>(root, '#preset');
  const clearWire = required<HTMLButtonElement>(root, '#clear-wire');
  const connectionHint = required<HTMLElement>(root, '#connection-hint');
  const projectFile = required<HTMLInputElement>(root, '#project-file');
  const sourceAssetFile = required<HTMLInputElement>(root, '#source-asset-file');
  const projectWidth = required<HTMLInputElement>(root, '#project-width');
  const projectHeight = required<HTMLInputElement>(root, '#project-height');

  const syncProjectSizeInputs = (): void => {
    projectWidth.value = String(state.document.width);
    projectHeight.value = String(state.document.height);
  };
  const applyProjectSize = (): void => {
    const width = Number(projectWidth.value);
    const height = Number(projectHeight.value);
    if (
      !Number.isInteger(width)
      || !Number.isInteger(height)
      || width < 1
      || height < 1
      || width > MAX_PROJECT_DIMENSION
      || height > MAX_PROJECT_DIMENSION
    ) {
      syncProjectSizeInputs();
      setStatus(
        finalStatus,
        `Size must be 1–${MAX_PROJECT_DIMENSION} pixels per dimension`,
        true,
      );
      return;
    }
    state.document.width = width;
    state.document.height = height;
    commit();
  };
  projectWidth.addEventListener('change', applyProjectSize);
  projectHeight.addEventListener('change', applyProjectSize);
  syncProjectSizeInputs();

  renderPalette(palette, (kind) => {
    const x = Math.max(40, graphScroll.scrollLeft + 100);
    const y = Math.max(40, graphScroll.scrollTop + 100);
    const node = createEditorNode(kind, x, y);
    state.document.nodes.push(node);
    state.selectedId = node.id;
    commit();
  });

  presetSelect.innerHTML = EDITOR_PRESETS
    .map((preset) => `<option value="${preset.id}">${preset.label}</option>`)
    .join('');
  presetSelect.addEventListener('change', () => {
    const preset = EDITOR_PRESETS.find((item) => item.id === presetSelect.value);
    if (!preset) return;
    state.document = preset.create();
    state.selectedId = null;
    state.pendingConnection = null;
    syncProjectSizeInputs();
    commit();
  });

  root.querySelector('#new-project')?.addEventListener('click', () => {
    state.document = EDITOR_PRESETS[0].create();
    state.selectedId = null;
    state.pendingConnection = null;
    presetSelect.value = EDITOR_PRESETS[0].id;
    syncProjectSizeInputs();
    commit();
  });
  root.querySelector('#save-project')?.addEventListener('click', () => {
    downloadText(
      `${fileSafeName(state.document.name)}.graphim.json`,
      serializeEditorDocument(state.document),
    );
  });
  root.querySelector('#load-project')?.addEventListener('click', () => projectFile.click());
  projectFile.addEventListener('change', () => {
    const file = projectFile.files?.[0];
    if (!file) return;
    void file.text().then((text) => {
      state.document = parseEditorDocument(text);
      state.selectedId = null;
      state.pendingConnection = null;
      syncProjectSizeInputs();
      return loadReferencedImageAssets();
    }).then(() => {
      commit();
    }).catch((error) => setStatus(finalStatus, error, true));
    projectFile.value = '';
  });
  root.querySelector('#export-image')?.addEventListener('click', () => {
    if (!finalInstance) return;
    void finalInstance.download({ fileName: `${fileSafeName(state.document.name)}.png` })
      .catch((error) => setStatus(finalStatus, error, true));
  });

  clearWire.addEventListener('click', () => {
    state.pendingConnection = null;
    renderConnectionState();
    renderNodes();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.pendingConnection) {
      state.pendingConnection = null;
      renderConnectionState();
      renderNodes();
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && isCanvasFocused(event)) {
      deleteSelected();
    }
  });

  sourceAssetFile.addEventListener('change', () => {
    const file = sourceAssetFile.files?.[0];
    const node = state.document.nodes.find((item) => item.id === sourcePickerTargetId);
    sourceAssetFile.value = '';
    sourcePickerTargetId = null;
    if (!file || !node || node.kind !== 'source') return;
    void saveImageAsset(file)
      .then(async (asset) => {
        const runtime = await runtimeAssetFromBlob(asset.name, asset.blob);
        imageAssets.set(asset.id, runtime);
        node.params.assetId = asset.id;
        node.params.assetName = asset.name;
        commit();
      })
      .catch((error) => setStatus(nodeStatus, error, true));
  });

  function renderNodes(): void {
    nodesLayer.replaceChildren();
    const issues = validateEditorDocument(state.document);
    const invalidIds = new Set(issues.map((issue) => issue.nodeId).filter(Boolean));
    for (const node of state.document.nodes) {
      const definition = NODE_DEFINITIONS[node.kind];
      const element = document.createElement('article');
      element.className = [
        'node',
        state.selectedId === node.id ? 'is-selected' : '',
        state.pendingConnection === node.id ? 'is-connecting' : '',
        invalidIds.has(node.id) ? 'is-invalid' : '',
        `node--${definition.category.toLowerCase()}`,
      ].filter(Boolean).join(' ');
      element.dataset.nodeId = node.id;
      element.style.transform = `translate(${node.x}px, ${node.y}px)`;

      const header = document.createElement('header');
      header.className = 'node__header';
      const title = document.createElement('span');
      title.textContent = definition.title;
      const kind = document.createElement('small');
      kind.textContent = node.kind;
      header.append(title, kind);
      element.append(header);

      if (node.kind === 'source') {
        const asset = imageAssets.get(sourceAssetId(node));
        const preview = document.createElement('div');
        preview.className = 'node__image-preview';
        if (asset) {
          const image = document.createElement('img');
          image.src = asset.url;
          image.alt = '';
          preview.append(image);
        } else {
          preview.classList.add('is-missing');
          preview.textContent = 'Image unavailable';
        }
        const caption = document.createElement('span');
        caption.textContent = sourceAssetName(node);
        preview.append(caption);
        const replace = document.createElement('button');
        replace.type = 'button';
        replace.className = 'node__image-button';
        replace.dataset.sourcePicker = 'true';
        replace.textContent = 'Set image';
        preview.append(replace);
        element.append(preview);
      }

      definition.inputLabels.forEach((label, index) => {
        const row = document.createElement('div');
        row.className = 'port-row port-row--input';
        const port = document.createElement('button');
        port.type = 'button';
        port.className = `port port--input${node.inputs[index] ? ' is-connected' : ''}`;
        port.dataset.inputIndex = String(index);
        port.ariaLabel = `Connect ${label}`;
        row.append(port, document.createTextNode(label));
        element.append(row);
      });

      if (node.kind !== 'output') {
        const output = document.createElement('div');
        output.className = 'port-row port-row--output';
        output.append(document.createTextNode('output'));
        const port = document.createElement('button');
        port.type = 'button';
        port.className = 'port port--output';
        port.dataset.output = 'true';
        port.ariaLabel = `Connect from ${definition.title}`;
        output.append(port);
        element.append(output);
      }
      nodesLayer.append(element);

      element.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const inputIndex = target.dataset.inputIndex;
        if (target.dataset.sourcePicker) {
          state.selectedId = node.id;
          sourcePickerTargetId = node.id;
          renderNodes();
          renderInspector();
          schedulePreview();
          sourceAssetFile.click();
          return;
        }
        if (target.dataset.output) {
          state.pendingConnection = node.id;
          state.selectedId = node.id;
          renderConnectionState();
          renderNodes();
          renderInspector();
          schedulePreview();
          return;
        }
        if (inputIndex !== undefined) {
          const index = Number(inputIndex);
          if (state.pendingConnection) {
            node.inputs[index] = state.pendingConnection;
            state.pendingConnection = null;
          } else {
            node.inputs[index] = null;
          }
          state.selectedId = node.id;
          commit();
          return;
        }
        state.selectedId = node.id;
        renderNodes();
        renderInspector();
        schedulePreview();
      });
      enableNodeDrag(header, node, element);
    }
    requestAnimationFrame(renderWires);
  }

  function enableNodeDrag(handle: HTMLElement, node: EditorNode, element: HTMLElement): void {
    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      state.selectedId = node.id;
      const startX = event.clientX;
      const startY = event.clientY;
      const originX = node.x;
      const originY = node.y;
      handle.setPointerCapture(event.pointerId);
      const move = (moveEvent: PointerEvent): void => {
        node.x = Math.max(8, originX + moveEvent.clientX - startX);
        node.y = Math.max(8, originY + moveEvent.clientY - startY);
        element.style.transform = `translate(${node.x}px, ${node.y}px)`;
        renderWires();
      };
      const end = (): void => {
        handle.removeEventListener('pointermove', move);
        localStorage.setItem(STORAGE_KEY, serializeEditorDocument(state.document));
        renderInspector();
        schedulePreview();
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', end, { once: true });
      handle.addEventListener('pointercancel', end, { once: true });
    });
  }

  function renderWires(): void {
    const workspaceRect = workspace.getBoundingClientRect();
    wires.replaceChildren();
    for (const target of state.document.nodes) {
      target.inputs.forEach((sourceId, inputIndex) => {
        if (!sourceId) return;
        const sourcePort = nodesLayer.querySelector<HTMLElement>(
          `[data-node-id="${cssEscape(sourceId)}"] [data-output]`,
        );
        const targetPort = nodesLayer.querySelector<HTMLElement>(
          `[data-node-id="${cssEscape(target.id)}"] [data-input-index="${inputIndex}"]`,
        );
        if (!sourcePort || !targetPort) return;
        const start = center(sourcePort, workspaceRect);
        const end = center(targetPort, workspaceRect);
        const span = Math.max(60, Math.abs(end.x - start.x) * 0.48);
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute(
          'd',
          `M ${start.x} ${start.y} C ${start.x + span} ${start.y}, ${end.x - span} ${end.y}, ${end.x} ${end.y}`,
        );
        path.setAttribute('class', 'wire');
        wires.append(path);
      });
    }
  }

  function renderInspector(): void {
    inspector.replaceChildren();
    const node = state.document.nodes.find((item) => item.id === state.selectedId);
    if (!node) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML = '<strong>No node selected</strong><span>Select a node to edit its inputs and parameters.</span>';
      inspector.append(empty);
      return;
    }
    const definition = NODE_DEFINITIONS[node.kind];
    const title = document.createElement('div');
    title.className = 'inspector-title';
    title.innerHTML = `<strong>${definition.title}</strong><code>${node.id}</code>`;
    inspector.append(title);

    if (node.kind === 'source') {
      const asset = imageAssets.get(sourceAssetId(node));
      const picker = document.createElement('section');
      picker.className = 'source-picker';
      if (asset) {
        const image = document.createElement('img');
        image.src = asset.url;
        image.alt = sourceAssetName(node);
        picker.append(image);
      }
      const assetLabel = document.createElement('span');
      assetLabel.textContent = asset?.name ?? `${sourceAssetName(node)} (unavailable)`;
      picker.append(assetLabel);

      const actions = document.createElement('div');
      actions.className = 'source-picker__actions';
      actions.append(
        sourceAction('Choose file', () => {
          sourcePickerTargetId = node.id;
          sourceAssetFile.click();
        }),
        sourceAction('Sample', () => assignBuiltinSource(node, 'builtin:main', 'Sample image')),
        sourceAction('Mask', () => assignBuiltinSource(node, 'builtin:mask', 'Radial mask')),
      );
      picker.append(actions);
      inspector.append(picker);
    }

    definition.inputLabels.forEach((label, index) => {
      const field = fieldContainer(label);
      const select = document.createElement('select');
      select.innerHTML = '<option value="">Not connected</option>';
      for (const candidate of state.document.nodes) {
        if (candidate.id === node.id || candidate.kind === 'output') continue;
        const option = document.createElement('option');
        option.value = candidate.id;
        option.textContent = `${NODE_DEFINITIONS[candidate.kind].title} · ${candidate.id}`;
        option.selected = candidate.id === node.inputs[index];
        select.append(option);
      }
      select.addEventListener('change', () => {
        node.inputs[index] = select.value || null;
        commit();
      });
      field.append(select);
      inspector.append(field);
    });

    for (const parameter of definition.parameters) {
      const field = fieldContainer(parameter.label);
      const value = node.params[parameter.key];
      let control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (parameter.type === 'textarea') {
        control = document.createElement('textarea');
        control.rows = parameter.key === 'shader' ? 12 : 3;
        control.spellcheck = false;
        control.value = String(value);
      } else if (parameter.type === 'select') {
        control = document.createElement('select');
        for (const item of parameter.options ?? []) {
          const option = document.createElement('option');
          option.value = item.value;
          option.textContent = item.label;
          option.selected = String(value) === item.value;
          control.append(option);
        }
      } else {
        control = document.createElement('input');
        control.type = 'number';
        control.value = String(value);
        control.min = String(parameter.min);
        control.max = String(parameter.max);
        control.step = String(parameter.step);
      }
      control.addEventListener('input', () => {
        node.params[parameter.key] = parameter.type === 'number'
          ? Number(control.value)
          : control.value;
        persistAndPreview();
      });
      field.append(control);
      inspector.append(field);
    }

    if (node.kind !== 'output') {
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'button button--danger inspector-delete';
      remove.textContent = 'Delete node';
      remove.addEventListener('click', deleteSelected);
      inspector.append(remove);
    }
  }

  function sourceAction(label: string, action: () => void): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button button--quiet';
    button.textContent = label;
    button.addEventListener('click', action);
    return button;
  }

  function assignBuiltinSource(node: EditorNode, assetId: string, name: string): void {
    node.params.assetId = assetId;
    node.params.assetName = name;
    commit();
  }

  function deleteSelected(): void {
    const id = state.selectedId;
    const node = state.document.nodes.find((item) => item.id === id);
    if (!id || !node || node.kind === 'output') return;
    state.document.nodes = state.document.nodes.filter((item) => item.id !== id);
    for (const candidate of state.document.nodes) {
      candidate.inputs = candidate.inputs.map((input) => input === id ? null : input);
    }
    state.selectedId = null;
    if (state.pendingConnection === id) state.pendingConnection = null;
    commit();
  }

  function commit(): void {
    renderNodes();
    renderInspector();
    renderConnectionState();
    persistAndPreview();
  }

  function persistAndPreview(): void {
    localStorage.setItem(STORAGE_KEY, serializeEditorDocument(state.document));
    schedulePreview();
  }

  function schedulePreview(): void {
    window.clearTimeout(previewTimer);
    previewTimer = window.setTimeout(() => {
      if (!finalInstance || !nodeInstance) return;
      finalInstance.setSize(state.document.width, state.document.height);
      nodeInstance.setSize(state.document.width, state.document.height);
      const finalTarget = state.document.nodes.find(
        (node) => node.id === state.document.outputId,
      );
      const selected = state.document.nodes.find((node) => node.id === state.selectedId);
      if (finalTarget) {
        renderTargetPreview(finalInstance, finalTarget, finalStatus, 'Final output');
      }
      nodePreviewSection.classList.toggle('is-idle', !selected);
      if (!selected) {
        nodeInstance.stop();
        nodePreviewTitle.textContent = 'Node output';
        nodeStatus.classList.remove('is-error');
        nodeStatus.textContent = 'Select a node';
        return;
      }
      nodePreviewTitle.textContent = `${NODE_DEFINITIONS[selected.kind].title} output`;
      renderTargetPreview(
        nodeInstance,
        selected,
        nodeStatus,
        NODE_DEFINITIONS[selected.kind].title,
      );
    }, 100);
  }

  function renderTargetPreview(
    previewInstance: GraphimInstance,
    target: EditorNode,
    targetStatus: HTMLElement,
    label: string,
  ): void {
    try {
      previewInstance.stop();
      previewInstance.setSize(state.document.width, state.document.height);
      const graph = compileEditorNode(state.document, target.id, {
        resolveSource(node) {
          const assetId = sourceAssetId(node);
          if (assetId === 'builtin:main') return 'main';
          const asset = imageAssets.get(assetId);
          return asset ? { image: asset.image } : undefined;
        },
      });
      previewInstance.setGraph(graph);
      const animated = graphNeedsAnimation(graph);
      if (animated) {
        previewInstance.animate();
      } else {
        previewInstance.render();
      }
      targetStatus.classList.remove('is-error');
      targetStatus.textContent = `${label} · ${state.document.width}×${state.document.height} · ${
        animated ? 'animating' : 'rendered'
      }`;
    } catch (error) {
      setStatus(targetStatus, error, true);
    }
  }

  function renderConnectionState(): void {
    clearWire.hidden = !state.pendingConnection;
    connectionHint.textContent = state.pendingConnection
      ? `Connecting from ${NODE_DEFINITIONS[
        state.document.nodes.find((node) => node.id === state.pendingConnection)?.kind ?? 'source'
      ].title} — select an input port`
      : 'Select an output port, then an input port';
  }

  async function loadReferencedImageAssets(): Promise<void> {
    const ids = new Set(
      state.document.nodes
        .filter((node) => node.kind === 'source')
        .map(sourceAssetId)
        .filter((id) => id.startsWith('asset:')),
    );
    await Promise.all([...ids].map(async (id) => {
      if (imageAssets.has(id)) return;
      const stored = await loadImageAsset(id);
      if (!stored) return;
      imageAssets.set(id, await runtimeAssetFromBlob(stored.name, stored.blob));
    }));
  }

  const bootPreview = async (): Promise<void> => {
    maskImage = await createRadialMaskImage();
    imageAssets.set('builtin:main', {
      image: finalSourceImage,
      name: 'Sample image',
      url: sampleUrl,
    });
    imageAssets.set('builtin:mask', {
      image: maskImage,
      name: 'Radial mask',
      url: maskImage.src,
    });
    await loadReferencedImageAssets();
    finalInstance = Graphim.mount({ image: finalSourceImage });
    nodeInstance = Graphim.mount({ image: nodeSourceImage });
    renderNodes();
    renderInspector();
    schedulePreview();
  };
  const boot = (): void => {
    void bootPreview().catch((error) => {
      setStatus(finalStatus, error, true);
      setStatus(nodeStatus, error, true);
    });
  };
  void Promise.all([
    waitForImage(finalSourceImage),
    waitForImage(nodeSourceImage),
  ]).then(boot).catch((error) => {
    setStatus(finalStatus, error, true);
    setStatus(nodeStatus, error, true);
  });

  renderNodes();
  renderInspector();
  renderConnectionState();
  graphScroll.addEventListener('scroll', renderWires);
  window.addEventListener('resize', renderWires);
}

function renderPalette(container: HTMLElement, onAdd: (kind: NodeKind) => void): void {
  const categories = ['Input', 'Effect', 'Compose', 'Timing'] as const;
  for (const category of categories) {
    const section = document.createElement('section');
    section.className = 'palette-group';
    const heading = document.createElement('h2');
    heading.textContent = category;
    section.append(heading);
    for (const definition of Object.values(NODE_DEFINITIONS)) {
      if (definition.category !== category) continue;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'palette-node';
      button.innerHTML = `<span>${definition.title}</span><small>${definition.inputLabels.length} in</small>`;
      button.addEventListener('click', () => onAdd(definition.kind));
      section.append(button);
    }
    container.append(section);
  }
}

function fieldContainer(label: string): HTMLLabelElement {
  const field = document.createElement('label');
  field.className = 'field';
  const caption = document.createElement('span');
  caption.textContent = label;
  field.append(caption);
  return field;
}

function loadStoredDocument(): EditorDocument | null {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    return parseEditorDocument(value);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

function downloadText(name: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function runtimeAssetFromBlob(name: string, blob: Blob): Promise<RuntimeImageAsset> {
  const url = URL.createObjectURL(blob);
  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve({ image, name, url });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not load image asset: ${name}`));
    };
    image.src = url;
  });
}

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener(
      'error',
      () => reject(new Error('Preview source image failed to load')),
      { once: true },
    );
  });
}

function fileSafeName(value: string): string {
  return value.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, '-').replace(/\s+/g, '-') || 'graph';
}

function required<T extends Element>(root: HTMLElement, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`${selector} not found`);
  return element;
}

function center(element: HTMLElement, relativeTo: DOMRect): { x: number; y: number } {
  const rect = element.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2 - relativeTo.left,
    y: rect.top + rect.height / 2 - relativeTo.top,
  };
}

function cssEscape(value: string): string {
  return CSS.escape(value);
}

function setStatus(element: HTMLElement, value: unknown, isError: boolean): void {
  element.classList.toggle('is-error', isError);
  element.textContent = value instanceof Error ? value.message : String(value);
}

function isCanvasFocused(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;
  return !target || !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
}
