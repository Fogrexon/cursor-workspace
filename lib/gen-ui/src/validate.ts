import { UI_LIMITS, uiTreeSchema, type UiNode, type UiTree } from "./schema.js";
import type { DatasetRegistry } from "./data.js";

export type ValidateOk = { ok: true; tree: UiTree; nodeCount: number };
export type ValidateErr = { ok: false; errors: string[] };
export type ValidateResult = ValidateOk | ValidateErr;

function walk(
  node: UiNode,
  depth: number,
  counters: { nodes: number; errors: string[] },
  datasets?: DatasetRegistry,
): void {
  counters.nodes += 1;
  if (counters.nodes > UI_LIMITS.maxNodes) {
    counters.errors.push(`maxNodes exceeded (${UI_LIMITS.maxNodes})`);
    return;
  }
  if (depth > UI_LIMITS.maxDepth) {
    counters.errors.push(`maxDepth exceeded (${UI_LIMITS.maxDepth}) at type=${node.type}`);
    return;
  }

  if (node.type === "stack" || node.type === "screen") {
    for (const child of node.children) walk(child, depth + 1, counters, datasets);
  } else if (node.type === "tabs") {
    for (const tab of node.tabs) {
      for (const child of tab.children) walk(child, depth + 1, counters, datasets);
    }
  } else if (node.type === "table") {
    for (const row of node.rows) {
      if (row.length !== node.columns.length) {
        counters.errors.push(
          `table row length ${row.length} != columns ${node.columns.length}`,
        );
      }
    }
  } else if (node.type === "form") {
    for (const field of node.fields) {
      if (field.kind === "select" && (!field.options || field.options.length === 0)) {
        counters.errors.push(`select field "${field.name}" requires options`);
      }
    }
  } else if (node.type === "dataView") {
    if (datasets && !(node.source in datasets)) {
      counters.errors.push(`unknown dataset "${node.source}"`);
    }
    for (const measure of node.query.measures ?? []) {
      if (measure.op !== "count" && !measure.field) {
        counters.errors.push(`measure "${measure.as}" requires field`);
      }
    }
  }
}

/**
 * Validate an unknown JSON value as a constrained UI tree.
 * Rejects raw HTML, unknown types, and oversize trees.
 */
export function validateUiTree(
  input: unknown,
  datasets?: DatasetRegistry,
): ValidateResult {
  const parsed = uiTreeSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      errors: parsed.error.issues.map(
        (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
      ),
    };
  }

  const counters = { nodes: 0, errors: [] as string[] };
  walk(parsed.data, 1, counters, datasets);
  if (counters.errors.length > 0) {
    return { ok: false, errors: [...new Set(counters.errors)] };
  }
  return { ok: true, tree: parsed.data, nodeCount: counters.nodes };
}
