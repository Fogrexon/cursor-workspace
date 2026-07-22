import { z } from "zod";
import type { DataViewNode } from "./data.js";

/** Hard limits from design.md */
export const UI_LIMITS = {
  maxDepth: 6,
  maxNodes: 80,
  maxString: 500,
  maxLongString: 2000,
  maxTableRows: 50,
  maxTableCols: 8,
  maxTabs: 5,
  maxListItems: 40,
  maxFormFields: 20,
  maxDataViews: 4,
} as const;

const short = z.string().min(1).max(UI_LIMITS.maxString);
const long = z.string().min(1).max(UI_LIMITS.maxLongString);
const actionId = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z][a-zA-Z0-9_.-]*$/, "actionId must be a safe identifier");
const fieldName = z
  .string()
  .min(1)
  .max(64)
  .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/);

const scalar = z.union([z.string().max(UI_LIMITS.maxString), z.number(), z.boolean()]);
const dataScalar = z.union([
  z.string().max(UI_LIMITS.maxString),
  z.number(),
  z.boolean(),
  z.null(),
]);

const textNodeSchema = z.object({
  type: z.literal("text"),
  variant: z.enum(["title", "heading", "body", "muted", "code"]).optional(),
  value: short,
});

const buttonNodeSchema = z.object({
  type: z.literal("button"),
  label: short,
  variant: z.enum(["primary", "secondary", "danger"]).optional(),
  actionId,
  payload: z.string().max(UI_LIMITS.maxString).optional(),
});

const fieldNodeSchema = z.object({
  type: z.literal("field"),
  name: fieldName,
  label: short,
  kind: z.enum(["text", "number", "select", "checkbox"]),
  placeholder: z.string().max(UI_LIMITS.maxString).optional(),
  options: z
    .array(z.object({ label: short, value: short }))
    .max(30)
    .optional(),
  required: z.boolean().optional(),
});

const formNodeSchema = z.object({
  type: z.literal("form"),
  fields: z.array(fieldNodeSchema).min(1).max(UI_LIMITS.maxFormFields),
  submitLabel: short.optional(),
  actionId,
});

const listNodeSchema = z.object({
  type: z.literal("list"),
  items: z
    .array(
      z.object({
        label: short,
        description: z.string().max(UI_LIMITS.maxLongString).optional(),
        actionId: actionId.optional(),
        payload: z.string().max(UI_LIMITS.maxString).optional(),
      }),
    )
    .max(UI_LIMITS.maxListItems),
});

const tableNodeSchema = z.object({
  type: z.literal("table"),
  columns: z.array(short).min(1).max(UI_LIMITS.maxTableCols),
  rows: z
    .array(z.array(scalar).max(UI_LIMITS.maxTableCols))
    .max(UI_LIMITS.maxTableRows),
});

const metricNodeSchema = z.object({
  type: z.literal("metric"),
  label: short,
  value: short,
  delta: z.string().max(UI_LIMITS.maxString).optional(),
});

const badgeNodeSchema = z.object({
  type: z.literal("badge"),
  label: short,
  tone: z.enum(["neutral", "ok", "warn", "danger"]).optional(),
});

const calloutNodeSchema = z.object({
  type: z.literal("callout"),
  tone: z.enum(["info", "ok", "warn", "danger"]).optional(),
  title: z.string().max(UI_LIMITS.maxString).optional(),
  body: long,
});

const dividerNodeSchema = z.object({
  type: z.literal("divider"),
});

const emptyNodeSchema = z.object({
  type: z.literal("empty"),
  message: short,
  actionId: actionId.optional(),
  actionLabel: z.string().max(UI_LIMITS.maxString).optional(),
});

const dataFilterControlSchema = z.object({
  type: z.literal("select"),
  param: fieldName,
  field: fieldName,
  label: short,
  default: dataScalar.optional(),
  includeAll: z.boolean().optional(),
});

const dataQuerySchema = z.object({
  where: z
    .array(
      z.object({
        field: fieldName,
        op: z.enum(["eq", "neq", "gt", "gte", "lt", "lte", "contains"]),
        param: fieldName,
      }),
    )
    .max(8)
    .optional(),
  groupBy: z.array(fieldName).max(4).optional(),
  measures: z
    .array(
      z.object({
        op: z.enum(["sum", "avg", "min", "max", "count", "countDistinct"]),
        field: fieldName.optional(),
        as: fieldName,
      }),
    )
    .max(6)
    .optional(),
  orderBy: z
    .array(
      z.object({
        field: fieldName,
        direction: z.enum(["asc", "desc"]).optional(),
      }),
    )
    .max(4)
    .optional(),
  limit: z.number().int().min(1).max(200).optional(),
});

const dataViewNodeSchema = z.object({
  type: z.literal("dataView"),
  title: short.optional(),
  source: fieldName,
  controls: z.array(dataFilterControlSchema).max(6).optional(),
  query: dataQuerySchema,
  views: z
    .array(
      z.union([
        z.object({
          type: z.literal("chart"),
          kind: z.enum(["bar", "line"]),
          title: short.optional(),
          x: fieldName,
          y: fieldName,
        }),
        z.object({
          type: z.literal("dataTable"),
          title: short.optional(),
          columns: z.array(fieldName).min(1).max(UI_LIMITS.maxTableCols),
        }),
        z.object({
          type: z.literal("calendar"),
          title: short.optional(),
          date: fieldName,
          value: fieldName,
        }),
      ]),
    )
    .min(1)
    .max(UI_LIMITS.maxDataViews),
});

export type TextNode = z.infer<typeof textNodeSchema>;
export type ButtonNode = z.infer<typeof buttonNodeSchema>;
export type FieldNode = z.infer<typeof fieldNodeSchema>;
export type FormNode = z.infer<typeof formNodeSchema>;
export type ListNode = z.infer<typeof listNodeSchema>;
export type TableNode = z.infer<typeof tableNodeSchema>;
export type MetricNode = z.infer<typeof metricNodeSchema>;
export type BadgeNode = z.infer<typeof badgeNodeSchema>;
export type CalloutNode = z.infer<typeof calloutNodeSchema>;
export type DividerNode = z.infer<typeof dividerNodeSchema>;
export type EmptyNode = z.infer<typeof emptyNodeSchema>;

export type StackNode = {
  type: "stack";
  direction?: "row" | "column";
  gap?: "sm" | "md" | "lg";
  children: UiNode[];
};

export type TabsNode = {
  type: "tabs";
  tabs: Array<{ id: string; label: string; children: UiNode[] }>;
};

export type ScreenNode = {
  type: "screen";
  title: string;
  children: UiNode[];
};

export type UiNode =
  | TextNode
  | ButtonNode
  | FieldNode
  | FormNode
  | ListNode
  | TableNode
  | MetricNode
  | BadgeNode
  | CalloutNode
  | DividerNode
  | EmptyNode
  | DataViewNode
  | StackNode
  | TabsNode
  | ScreenNode;

export type UiTree = ScreenNode;

const leafSchemas = [
  textNodeSchema,
  buttonNodeSchema,
  fieldNodeSchema,
  formNodeSchema,
  listNodeSchema,
  tableNodeSchema,
  metricNodeSchema,
  badgeNodeSchema,
  calloutNodeSchema,
  dividerNodeSchema,
  emptyNodeSchema,
  dataViewNodeSchema,
] as const;

export const uiNodeSchema: z.ZodType<UiNode> = z.lazy(() =>
  z.union([
    ...leafSchemas,
    z.object({
      type: z.literal("stack"),
      direction: z.enum(["row", "column"]).optional(),
      gap: z.enum(["sm", "md", "lg"]).optional(),
      children: z.array(uiNodeSchema).min(1),
    }),
    z.object({
      type: z.literal("tabs"),
      tabs: z
        .array(
          z.object({
            id: z
              .string()
              .min(1)
              .max(64)
              .regex(/^[a-zA-Z][a-zA-Z0-9_-]*$/),
            label: short,
            children: z.array(uiNodeSchema).min(1),
          }),
        )
        .min(1)
        .max(UI_LIMITS.maxTabs),
    }),
    z.object({
      type: z.literal("screen"),
      title: short,
      children: z.array(uiNodeSchema).min(1),
    }),
  ]),
);

export const uiTreeSchema: z.ZodType<UiTree> = z.lazy(() =>
  z.object({
    type: z.literal("screen"),
    title: short,
    children: z.array(uiNodeSchema).min(1),
  }),
);

export type UiAction = {
  actionId: string;
  source: "button" | "form" | "list" | "empty";
  values?: Record<string, string | number | boolean>;
  payload?: string;
};

/** JSON Schema fragment for Cursor SDK custom tool inputSchema */
export const RENDER_UI_INPUT_SCHEMA = {
  type: "object",
  properties: {
    tree: {
      type: "object",
      description:
        "Root UI tree. Must be type=screen. Only catalog component types are allowed — never raw HTML/CSS/JS.",
      properties: {
        type: { type: "string", const: "screen" },
        title: { type: "string" },
        children: { type: "array", items: { type: "object" } },
      },
      required: ["type", "title", "children"],
    },
  },
  required: ["tree"],
} as const;
