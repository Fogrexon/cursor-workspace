import type { UiTree } from "./schema.js";
import type { DatasetRegistry } from "./data.js";
import { DUMMY_USER_LOGS } from "./dummyUserLogs.js";

/** @deprecated Prefer user_logs. Kept as a tiny alias for older prompts. */
export const DUMMY_SALES = DUMMY_USER_LOGS;

export const DUMMY_DATASETS: DatasetRegistry = {
  user_logs: DUMMY_USER_LOGS,
  /** Alias so older agent prompts referencing "sales" still validate. */
  sales: DUMMY_USER_LOGS,
};

export const USER_LOG_ANALYSIS_FIXTURE: UiTree = {
  type: "screen",
  title: "User activity",
  children: [
    {
      type: "text",
      variant: "muted",
      value:
        "Dummy product analytics (~8k events). Filters update chart/table locally without the LLM.",
    },
    {
      type: "dataView",
      title: "Events by day",
      source: "user_logs",
      controls: [
        {
          type: "select",
          param: "platform",
          field: "platform",
          label: "Platform",
          includeAll: true,
        },
        {
          type: "select",
          param: "event_name",
          field: "event_name",
          label: "Event",
          includeAll: true,
        },
        {
          type: "select",
          param: "country",
          field: "country",
          label: "Country",
          includeAll: true,
        },
        {
          type: "select",
          param: "plan",
          field: "plan",
          label: "Plan",
          includeAll: true,
        },
      ],
      query: {
        where: [
          { field: "platform", op: "eq", param: "platform" },
          { field: "event_name", op: "eq", param: "event_name" },
          { field: "country", op: "eq", param: "country" },
          { field: "plan", op: "eq", param: "plan" },
        ],
        groupBy: ["day"],
        measures: [
          { op: "count", as: "events" },
          { op: "sum", field: "revenue_usd", as: "revenue_usd" },
          { op: "avg", field: "duration_ms", as: "avg_duration_ms" },
        ],
        orderBy: [{ field: "day", direction: "asc" }],
        limit: 60,
      },
      views: [
        {
          type: "chart",
          kind: "line",
          title: "Daily events",
          x: "day",
          y: "events",
        },
        {
          type: "dataTable",
          title: "Daily aggregates",
          columns: ["day", "events", "revenue_usd", "avg_duration_ms"],
        },
      ],
    },
  ],
};

/** @deprecated Use USER_LOG_ANALYSIS_FIXTURE */
export const SALES_ANALYSIS_FIXTURE = USER_LOG_ANALYSIS_FIXTURE;

export const TASK_LIST_FIXTURE: UiTree = {
  type: "screen",
  title: "Tasks",
  children: [
    {
      type: "stack",
      direction: "row",
      gap: "md",
      children: [
        { type: "metric", label: "Open", value: "3", delta: "+1 today" },
        { type: "metric", label: "Done", value: "12" },
        { type: "badge", label: "Local", tone: "ok" },
      ],
    },
    { type: "divider" },
    {
      type: "list",
      items: [
        {
          label: "Design catalog",
          description: "Close the UI surface",
          actionId: "open_task",
          payload: "1",
        },
        {
          label: "Wire Cursor SDK",
          description: "render_ui custom tool",
          actionId: "open_task",
          payload: "2",
        },
        {
          label: "Action round-trip",
          actionId: "open_task",
          payload: "3",
        },
      ],
    },
    {
      type: "stack",
      direction: "row",
      children: [
        { type: "button", label: "Add task", actionId: "add_task", variant: "primary" },
        {
          type: "button",
          label: "Clear done",
          actionId: "clear_done",
          variant: "secondary",
        },
      ],
    },
  ],
};

export const TASK_EMPTY_FIXTURE: UiTree = {
  type: "screen",
  title: "Tasks",
  children: [
    {
      type: "empty",
      message: "No tasks yet",
      actionId: "create_first",
      actionLabel: "Create first task",
    },
  ],
};

export const TASK_FORM_FIXTURE: UiTree = {
  type: "screen",
  title: "New task",
  children: [
    {
      type: "form",
      actionId: "create_task",
      submitLabel: "Create",
      fields: [
        {
          type: "field",
          name: "title",
          label: "Title",
          kind: "text",
          required: true,
          placeholder: "What needs doing?",
        },
        {
          type: "field",
          name: "priority",
          label: "Priority",
          kind: "select",
          options: [
            { label: "Low", value: "low" },
            { label: "Normal", value: "normal" },
            { label: "High", value: "high" },
          ],
        },
      ],
    },
    { type: "button", label: "Cancel", actionId: "cancel_create", variant: "secondary" },
  ],
};
