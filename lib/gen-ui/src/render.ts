import {
  executeDataQuery,
  getFilterOptions,
  type DataRow,
  type DataScalar,
  type DatasetRegistry,
  type DataViewNode,
  type QueryParams,
} from "./data.js";
import type { UiAction, UiNode, UiTree } from "./schema.js";

export type RenderOptions = {
  onAction: (action: UiAction) => void;
  datasets?: DatasetRegistry;
};

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className?: string,
  attrs?: Record<string, string>,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  }
  return node;
}

function readFormValues(form: HTMLFormElement): Record<string, string | number | boolean> {
  const values: Record<string, string | number | boolean> = {};
  for (const el of Array.from(form.elements)) {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)) continue;
    if (!el.name) continue;
    if (el instanceof HTMLInputElement && el.type === "checkbox") {
      values[el.name] = el.checked;
    } else if (el instanceof HTMLInputElement && el.type === "number") {
      values[el.name] = el.value === "" ? "" : Number(el.value);
    } else if (el instanceof HTMLInputElement && el.type === "submit") {
      continue;
    } else {
      values[el.name] = el.value;
    }
  }
  return values;
}

function formatScalar(value: DataScalar): string {
  if (value === null) return "—";
  if (typeof value === "number") {
    return Number.isInteger(value)
      ? String(value)
      : value.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
  return String(value);
}

function renderChart(
  rows: DataRow[],
  view: Extract<DataViewNode["views"][number], { type: "chart" }>,
): HTMLElement {
  const wrap = el("div", "gui-chart");
  if (view.title) {
    const title = el("div", "gui-chart__title");
    title.textContent = view.title;
    wrap.append(title);
  }

  const width = 360;
  const height = 180;
  const pad = { top: 12, right: 12, bottom: 36, left: 40 };
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("class", "gui-chart__svg");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", view.title ?? `${view.y} by ${view.x}`);

  const points = rows.map((row) => ({
    x: formatScalar(row[view.x] ?? null),
    y: typeof row[view.y] === "number" ? (row[view.y] as number) : 0,
  }));
  const maxY = Math.max(1, ...points.map((point) => point.y));
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;

  const axis = document.createElementNS("http://www.w3.org/2000/svg", "line");
  axis.setAttribute("x1", String(pad.left));
  axis.setAttribute("y1", String(pad.top + plotH));
  axis.setAttribute("x2", String(pad.left + plotW));
  axis.setAttribute("y2", String(pad.top + plotH));
  axis.setAttribute("class", "gui-chart__axis");
  svg.append(axis);

  if (view.kind === "bar") {
    const barW = plotW / Math.max(points.length, 1);
    points.forEach((point, index) => {
      const h = (point.y / maxY) * plotH;
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", String(pad.left + index * barW + barW * 0.15));
      rect.setAttribute("y", String(pad.top + plotH - h));
      rect.setAttribute("width", String(barW * 0.7));
      rect.setAttribute("height", String(h));
      rect.setAttribute("class", "gui-chart__bar");
      svg.append(rect);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(pad.left + index * barW + barW / 2));
      label.setAttribute("y", String(height - 12));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "gui-chart__label");
      label.textContent = point.x;
      svg.append(label);
    });
  } else {
    const coords = points.map((point, index) => {
      const x =
        pad.left +
        (points.length <= 1 ? plotW / 2 : (index / (points.length - 1)) * plotW);
      const y = pad.top + plotH - (point.y / maxY) * plotH;
      return { x, y, label: point.x };
    });
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      coords
        .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
        .join(" "),
    );
    path.setAttribute("class", "gui-chart__line");
    svg.append(path);
    for (const point of coords) {
      const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      dot.setAttribute("cx", String(point.x));
      dot.setAttribute("cy", String(point.y));
      dot.setAttribute("r", "3");
      dot.setAttribute("class", "gui-chart__dot");
      svg.append(dot);

      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", String(point.x));
      label.setAttribute("y", String(height - 12));
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("class", "gui-chart__label");
      label.textContent = point.label;
      svg.append(label);
    }
  }

  wrap.append(svg);
  return wrap;
}

function renderDataTable(
  rows: DataRow[],
  view: Extract<DataViewNode["views"][number], { type: "dataTable" }>,
): HTMLElement {
  const wrap = el("div", "gui-datatable");
  if (view.title) {
    const title = el("div", "gui-datatable__title");
    title.textContent = view.title;
    wrap.append(title);
  }
  const table = el("table", "gui-table");
  const thead = el("thead");
  const hr = el("tr");
  for (const col of view.columns) {
    const th = el("th");
    th.textContent = col;
    hr.append(th);
  }
  thead.append(hr);
  table.append(thead);
  const tbody = el("tbody");
  for (const row of rows.slice(0, 50)) {
    const tr = el("tr");
    for (const col of view.columns) {
      const td = el("td");
      td.textContent = formatScalar(row[col] ?? null);
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  wrap.append(table);
  if (rows.length === 0) {
    const empty = el("p", "gui-text gui-text--muted");
    empty.textContent = "No rows for current filters";
    wrap.append(empty);
  }
  return wrap;
}

function heatLevel(value: number, maxValue: number): number {
  if (value <= 0 || maxValue <= 0) return 0;
  return Math.min(4, Math.max(1, Math.ceil((value / maxValue) * 4)));
}

function renderCalendar(
  rows: DataRow[],
  view: Extract<DataViewNode["views"][number], { type: "calendar" }>,
): HTMLElement {
  const wrap = el("div", "gui-calendar");
  if (view.title) {
    const title = el("div", "gui-calendar__title");
    title.textContent = view.title;
    wrap.append(title);
  }

  const valueByDay = new Map<string, number>();
  let maxValue = 0;
  for (const row of rows) {
    const day = String(row[view.date] ?? "");
    if (!day) continue;
    const value = typeof row[view.value] === "number" ? (row[view.value] as number) : 0;
    valueByDay.set(day, value);
    maxValue = Math.max(maxValue, value);
  }

  const legend = el("div", "gui-calendar__legend");
  const legendLabel = el("span", "gui-calendar__legend-label");
  legendLabel.textContent = "少";
  legend.append(legendLabel);
  for (let level = 0; level <= 4; level += 1) {
    const swatch = el("span", `gui-calendar__legend-swatch gui-calendar__cell--level-${level}`);
    legend.append(swatch);
  }
  const legendMax = el("span", "gui-calendar__legend-label");
  legendMax.textContent = "多";
  legend.append(legendMax);
  wrap.append(legend);

  const months = new Map<string, string[]>();
  for (const day of [...valueByDay.keys()].sort()) {
    const monthKey = day.slice(0, 7);
    const list = months.get(monthKey) ?? [];
    list.push(day);
    months.set(monthKey, list);
  }

  const monthHost = el("div", "gui-calendar__months");
  for (const [monthKey, days] of [...months.entries()].sort()) {
    const monthBlock = el("div", "gui-calendar__month");
    const monthTitle = el("div", "gui-calendar__month-title");
    monthTitle.textContent = monthKey;
    monthBlock.append(monthTitle);

    const grid = el("div", "gui-calendar__grid");
    for (const weekday of ["月", "火", "水", "木", "金", "土", "日"]) {
      const header = el("div", "gui-calendar__weekday");
      header.textContent = weekday;
      grid.append(header);
    }

    const firstDay = new Date(`${days[0]}T00:00:00.000Z`);
    const startOffset = (firstDay.getUTCDay() + 6) % 7;
    for (let i = 0; i < startOffset; i += 1) {
      grid.append(el("div", "gui-calendar__cell gui-calendar__cell--empty"));
    }

    const daysInMonth = new Date(
      Date.UTC(firstDay.getUTCFullYear(), firstDay.getUTCMonth() + 1, 0),
    ).getUTCDate();
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum += 1) {
      const dayKey = `${monthKey}-${String(dayNum).padStart(2, "0")}`;
      const value = valueByDay.get(dayKey) ?? 0;
      const cell = el("div", `gui-calendar__cell gui-calendar__cell--level-${heatLevel(value, maxValue)}`);
      cell.title = `${dayKey}: ${value}人`;
      const dayLabel = el("span", "gui-calendar__day");
      dayLabel.textContent = String(dayNum);
      cell.append(dayLabel);
      if (value > 0) {
        const count = el("span", "gui-calendar__count");
        count.textContent = String(value);
        cell.append(count);
      }
      grid.append(cell);
    }

    monthBlock.append(grid);
    monthHost.append(monthBlock);
  }
  wrap.append(monthHost);

  if (rows.length === 0) {
    const empty = el("p", "gui-text gui-text--muted");
    empty.textContent = "No rows for current filters";
    wrap.append(empty);
  }
  return wrap;
}

function renderDataView(node: DataViewNode, opts: RenderOptions): HTMLElement {
  const root = el("section", "gui-dataview");
  if (node.title) {
    const title = el("h2", "gui-text gui-text--heading");
    title.textContent = node.title;
    root.append(title);
  }

  const source = opts.datasets?.[node.source] ?? [];
  const params: QueryParams = {};
  for (const control of node.controls ?? []) {
    params[control.param] = control.default ?? null;
  }

  const controls = el("div", "gui-dataview__controls");
  const resultHost = el("div", "gui-dataview__results");

  const paintResults = () => {
    const rows = executeDataQuery(source, node.query, params);
    resultHost.replaceChildren();
    for (const view of node.views) {
      resultHost.append(
        view.type === "chart"
          ? renderChart(rows, view)
          : view.type === "calendar"
            ? renderCalendar(rows, view)
            : renderDataTable(rows, view),
      );
    }
  };

  for (const control of node.controls ?? []) {
    const label = el("label", "gui-field");
    const caption = el("span", "gui-field__label");
    caption.textContent = control.label;
    label.append(caption);
    const select = el("select", "gui-input", { name: control.param });
    if (control.includeAll !== false) {
      const all = el("option");
      all.value = "";
      all.textContent = "All";
      select.append(all);
    }
    for (const value of getFilterOptions(source, control.field)) {
      const option = el("option");
      option.value = String(value);
      option.textContent = formatScalar(value);
      select.append(option);
    }
    const current = params[control.param];
    select.value = current === null || current === undefined ? "" : String(current);
    select.addEventListener("change", () => {
      params[control.param] = select.value === "" ? null : select.value;
      paintResults();
    });
    label.append(select);
    controls.append(label);
  }

  if ((node.controls ?? []).length > 0) root.append(controls);
  root.append(resultHost);
  paintResults();
  return root;
}

function renderNode(node: UiNode, opts: RenderOptions): HTMLElement {
  switch (node.type) {
    case "screen": {
      const root = el("section", "gui-screen");
      root.append(el("h1", "gui-screen__title"));
      root.firstElementChild!.textContent = node.title;
      const body = el("div", "gui-screen__body");
      for (const child of node.children) body.append(renderNode(child, opts));
      root.append(body);
      return root;
    }
    case "stack": {
      const stack = el(
        "div",
        `gui-stack gui-stack--${node.direction ?? "column"} gui-stack--gap-${node.gap ?? "md"}`,
      );
      for (const child of node.children) stack.append(renderNode(child, opts));
      return stack;
    }
    case "text": {
      const tag =
        node.variant === "title" || node.variant === "heading" ? "h2" : "p";
      const text = el(tag, `gui-text gui-text--${node.variant ?? "body"}`);
      text.textContent = node.value;
      return text;
    }
    case "button": {
      const btn = el("button", `gui-btn gui-btn--${node.variant ?? "primary"}`, {
        type: "button",
      });
      btn.textContent = node.label;
      btn.addEventListener("click", () => {
        opts.onAction({
          actionId: node.actionId,
          source: "button",
          payload: node.payload,
        });
      });
      return btn;
    }
    case "field": {
      const wrap = el("label", "gui-field");
      const caption = el("span", "gui-field__label");
      caption.textContent = node.label;
      wrap.append(caption);
      wrap.append(buildInput(node));
      return wrap;
    }
    case "form": {
      const form = el("form", "gui-form");
      for (const field of node.fields) {
        const label = el("label", "gui-field");
        const caption = el("span", "gui-field__label");
        caption.textContent = field.label + (field.required ? " *" : "");
        label.append(caption);
        label.append(buildInput(field));
        form.append(label);
      }
      const submit = el("button", "gui-btn gui-btn--primary", { type: "submit" });
      submit.textContent = node.submitLabel ?? "Submit";
      form.append(submit);
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        opts.onAction({
          actionId: node.actionId,
          source: "form",
          values: readFormValues(form),
        });
      });
      return form;
    }
    case "list": {
      const list = el("ul", "gui-list");
      for (const item of node.items) {
        const li = el("li", "gui-list__item");
        const main = el("div", "gui-list__main");
        const label = el("div", "gui-list__label");
        label.textContent = item.label;
        main.append(label);
        if (item.description) {
          const desc = el("div", "gui-list__desc");
          desc.textContent = item.description;
          main.append(desc);
        }
        li.append(main);
        if (item.actionId) {
          const btn = el("button", "gui-btn gui-btn--secondary", { type: "button" });
          btn.textContent = "Open";
          const actionId = item.actionId;
          const payload = item.payload;
          btn.addEventListener("click", () => {
            opts.onAction({ actionId, source: "list", payload });
          });
          li.append(btn);
        }
        list.append(li);
      }
      return list;
    }
    case "table": {
      const table = el("table", "gui-table");
      const thead = el("thead");
      const hr = el("tr");
      for (const col of node.columns) {
        const th = el("th");
        th.textContent = col;
        hr.append(th);
      }
      thead.append(hr);
      table.append(thead);
      const tbody = el("tbody");
      for (const row of node.rows) {
        const tr = el("tr");
        for (const cell of row) {
          const td = el("td");
          td.textContent = String(cell);
          tr.append(td);
        }
        tbody.append(tr);
      }
      table.append(tbody);
      return table;
    }
    case "metric": {
      const card = el("div", "gui-metric");
      const label = el("div", "gui-metric__label");
      label.textContent = node.label;
      const value = el("div", "gui-metric__value");
      value.textContent = node.value;
      card.append(label, value);
      if (node.delta) {
        const delta = el("div", "gui-metric__delta");
        delta.textContent = node.delta;
        card.append(delta);
      }
      return card;
    }
    case "badge": {
      const badge = el("span", `gui-badge gui-badge--${node.tone ?? "neutral"}`);
      badge.textContent = node.label;
      return badge;
    }
    case "callout": {
      const box = el("aside", `gui-callout gui-callout--${node.tone ?? "info"}`);
      if (node.title) {
        const t = el("div", "gui-callout__title");
        t.textContent = node.title;
        box.append(t);
      }
      const body = el("div", "gui-callout__body");
      body.textContent = node.body;
      box.append(body);
      return box;
    }
    case "divider":
      return el("hr", "gui-divider");
    case "empty": {
      const box = el("div", "gui-empty");
      const msg = el("p", "gui-empty__msg");
      msg.textContent = node.message;
      box.append(msg);
      if (node.actionId) {
        const btn = el("button", "gui-btn gui-btn--primary", { type: "button" });
        btn.textContent = node.actionLabel ?? "Continue";
        const actionId = node.actionId;
        btn.addEventListener("click", () => {
          opts.onAction({ actionId, source: "empty" });
        });
        box.append(btn);
      }
      return box;
    }
    case "dataView":
      return renderDataView(node, opts);
    case "tabs": {
      const wrap = el("div", "gui-tabs");
      const tablist = el("div", "gui-tabs__list", { role: "tablist" });
      const panels = el("div", "gui-tabs__panels");
      node.tabs.forEach((tab, index) => {
        const btn = el("button", "gui-tabs__tab", {
          type: "button",
          role: "tab",
          "aria-selected": index === 0 ? "true" : "false",
        });
        btn.textContent = tab.label;
        const panel = el("div", "gui-tabs__panel", { role: "tabpanel" });
        panel.hidden = index !== 0;
        for (const child of tab.children) panel.append(renderNode(child, opts));
        btn.addEventListener("click", () => {
          for (const b of Array.from(tablist.querySelectorAll(".gui-tabs__tab"))) {
            b.setAttribute("aria-selected", "false");
          }
          for (const p of Array.from(panels.querySelectorAll(".gui-tabs__panel"))) {
            (p as HTMLElement).hidden = true;
          }
          btn.setAttribute("aria-selected", "true");
          panel.hidden = false;
        });
        tablist.append(btn);
        panels.append(panel);
      });
      wrap.append(tablist, panels);
      return wrap;
    }
    default: {
      const exhaustive: never = node;
      void exhaustive;
      return el("div", "gui-unknown");
    }
  }
}

function buildInput(
  field: Extract<UiNode, { type: "field" }>,
): HTMLElement {
  if (field.kind === "select") {
    const select = el("select", "gui-input", { name: field.name });
    if (field.required) select.required = true;
    for (const opt of field.options ?? []) {
      const o = el("option");
      o.value = opt.value;
      o.textContent = opt.label;
      select.append(o);
    }
    return select;
  }
  if (field.kind === "checkbox") {
    return el("input", "gui-input gui-input--checkbox", {
      type: "checkbox",
      name: field.name,
      value: "true",
    });
  }
  const input = el("input", "gui-input", {
    type: field.kind === "number" ? "number" : "text",
    name: field.name,
  });
  if (field.placeholder) input.placeholder = field.placeholder;
  if (field.required) input.required = true;
  return input;
}

/** Replace mount contents with a validated UI tree. */
export function renderUiTree(
  tree: UiTree,
  mount: HTMLElement,
  opts: RenderOptions,
): void {
  mount.replaceChildren(renderNode(tree, opts));
}
