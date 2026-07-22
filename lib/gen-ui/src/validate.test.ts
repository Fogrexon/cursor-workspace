import { describe, expect, it } from "vitest";
import { validateUiTree } from "./validate.js";
import { renderUiTree } from "./render.js";
import type { UiTree } from "./schema.js";
import {
  DUMMY_DATASETS,
  TASK_EMPTY_FIXTURE,
  TASK_LIST_FIXTURE,
  USER_LOG_ANALYSIS_FIXTURE,
} from "./fixtures.js";

describe("validateUiTree", () => {
  it("accepts a valid screen tree", () => {
    const result = validateUiTree(TASK_LIST_FIXTURE);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.nodeCount).toBeGreaterThan(3);
  });

  it("accepts a user log analysis dataView against known datasets", () => {
    const result = validateUiTree(USER_LOG_ANALYSIS_FIXTURE, DUMMY_DATASETS);
    expect(result.ok).toBe(true);
  });

  it("rejects unknown dataset when registry is provided", () => {
    const result = validateUiTree(
      {
        type: "screen",
        title: "Bad source",
        children: [
          {
            type: "dataView",
            source: "missing",
            query: { measures: [{ op: "count", as: "n" }] },
            views: [{ type: "dataTable", columns: ["n"] }],
          },
        ],
      },
      DUMMY_DATASETS,
    );
    expect(result.ok).toBe(false);
  });

  it("rejects raw html-ish unknown type", () => {
    const result = validateUiTree({
      type: "screen",
      title: "Bad",
      children: [{ type: "html", value: "<script>alert(1)</script>" }],
    });
    expect(result.ok).toBe(false);
  });

  it("rejects oversized depth", () => {
    let node: unknown = { type: "text", value: "leaf" };
    for (let i = 0; i < 8; i++) {
      node = { type: "stack", children: [node] };
    }
    const result = validateUiTree({
      type: "screen",
      title: "Deep",
      children: [node],
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.errors.some((e) => e.includes("maxDepth"))).toBe(true);
  });

  it("rejects table row/column mismatch", () => {
    const result = validateUiTree({
      type: "screen",
      title: "Table",
      children: [
        {
          type: "table",
          columns: ["A", "B"],
          rows: [["only-one"]],
        },
      ],
    });
    expect(result.ok).toBe(false);
  });

  it("rejects select field without options", () => {
    const result = validateUiTree({
      type: "screen",
      title: "Form",
      children: [
        {
          type: "form",
          actionId: "save",
          fields: [{ type: "field", name: "color", label: "Color", kind: "select" }],
        },
      ],
    });
    expect(result.ok).toBe(false);
  });
});

describe("renderUiTree", () => {
  it("renders text safely (no HTML injection)", () => {
    const mount = document.createElement("div");
    const tree: UiTree = {
      type: "screen",
      title: "Safe",
      children: [{ type: "text", value: "<img src=x onerror=alert(1)>" }],
    };
    const actions: string[] = [];
    renderUiTree(tree, mount, {
      onAction: (a) => actions.push(a.actionId),
    });
    expect(mount.querySelector(".gui-text")?.textContent).toBe(
      "<img src=x onerror=alert(1)>",
    );
    expect(mount.querySelector("img")).toBeNull();
  });

  it("wires button actions", () => {
    const mount = document.createElement("div");
    const actions: string[] = [];
    renderUiTree(TASK_EMPTY_FIXTURE, mount, {
      onAction: (a) => actions.push(a.actionId),
    });
    mount.querySelector("button")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(actions).toEqual(["create_first"]);
  });

  it("updates dataView locally when a filter changes", () => {
    const mount = document.createElement("div");
    renderUiTree(USER_LOG_ANALYSIS_FIXTURE, mount, {
      onAction: () => {
        throw new Error("dataView filters must not emit LLM actions");
      },
      datasets: DUMMY_DATASETS,
    });

    const before = mount.querySelector(".gui-table tbody")?.textContent ?? "";
    const select = mount.querySelector<HTMLSelectElement>('select[name="platform"]');
    expect(select).toBeTruthy();
    select!.value = "ios";
    select!.dispatchEvent(new Event("change", { bubbles: true }));
    const after = mount.querySelector(".gui-table tbody")?.textContent ?? "";
    expect(after).not.toEqual(before);
    expect(mount.querySelector(".gui-chart__svg")).toBeTruthy();
  });
});
