/** Agent-facing catalog. Keep in sync with schema.ts / design.md */
export const CATALOG_PROMPT = `You build data-analysis UIs by calling the render_ui tool with a JSON tree.
Never emit HTML, CSS, or JavaScript. Only the catalog types below are allowed.

Root MUST be:
{ "type": "screen", "title": string, "children": UiNode[] }

Prefer dataView for analysis screens. Filter/chart/table updates run locally — do NOT rebuild the UI on every filter change.

UiNode types:
- stack: { type:"stack", direction?: "row"|"column", gap?: "sm"|"md"|"lg", children: UiNode[] }
- text: { type:"text", variant?: "title"|"heading"|"body"|"muted"|"code", value: string }
- button: { type:"button", label, variant?: "primary"|"secondary"|"danger", actionId, payload?: string }
- field: { type:"field", name, label, kind: "text"|"number"|"select"|"checkbox", options?: {label,value}[], required?: boolean, placeholder?: string }
- form: { type:"form", fields: field[], submitLabel?: string, actionId }
- list: { type:"list", items: { label, description?, actionId?, payload? }[] }
- table: { type:"table", columns: string[], rows: (string|number|boolean)[][] }
- metric: { type:"metric", label, value, delta?: string }
- badge: { type:"badge", label, tone?: "neutral"|"ok"|"warn"|"danger" }
- callout: { type:"callout", tone?: "info"|"ok"|"warn"|"danger", title?: string, body: string }
- tabs: { type:"tabs", tabs: { id, label, children: UiNode[] }[] }
- divider: { type:"divider" }
- empty: { type:"empty", message, actionId?, actionLabel? }
- dataView: {
    type:"dataView",
    title?,
    source: datasetName,
    controls?: [{ type:"select", param, field, label, default?, includeAll? }],
    query: {
      where?: [{ field, op:"eq"|"neq"|"gt"|"gte"|"lt"|"lte"|"contains", param }],
      groupBy?: string[],
      measures?: [{ op:"sum"|"avg"|"min"|"max"|"count"|"countDistinct", field?, as }],
      orderBy?: [{ field, direction?: "asc"|"desc" }],
      limit?
    },
    views: [
      { type:"chart", kind:"bar"|"line", title?, x, y } |
      { type:"dataTable", title?, columns:string[] } |
      { type:"calendar", title?, date, value }
    ]
  }

Current dummy dataset: "user_logs" (~8k product analytics events).
Fields: event_id, ts, day, hour, user_id, session_id, event_name, page, platform, country, plan, channel, app_version, feature, error_code, duration_ms, revenue_usd, is_success.
Alias "sales" still resolves to the same rows for older prompts.
Prefer grouping by day / event_name / platform / country / plan. Do not group by user_id in charts.
A null/empty control value means All (predicate skipped).
Limits: depth<=6, nodes<=80, no raw HTML.
Prefer small analysis screens over decorative nesting.`;

export const ALLOWED_TYPES = [
  "screen",
  "stack",
  "text",
  "button",
  "field",
  "form",
  "list",
  "table",
  "metric",
  "badge",
  "callout",
  "tabs",
  "divider",
  "empty",
  "dataView",
] as const;
