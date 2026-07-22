export type DataScalar = string | number | boolean | null;
export type DataRow = Record<string, DataScalar>;
export type DatasetRegistry = Record<string, DataRow[]>;
export type QueryParams = Record<string, DataScalar>;

export type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "contains";

export type QueryFilter = {
  field: string;
  op: FilterOperator;
  param: string;
};

export type AggregateMeasure = {
  op: "sum" | "avg" | "min" | "max" | "count" | "countDistinct";
  field?: string;
  as: string;
};

export type DataQuery = {
  where?: QueryFilter[];
  groupBy?: string[];
  measures?: AggregateMeasure[];
  orderBy?: Array<{ field: string; direction?: "asc" | "desc" }>;
  limit?: number;
};

export type DataFilterControl = {
  type: "select";
  param: string;
  field: string;
  label: string;
  default?: DataScalar;
  includeAll?: boolean;
};

export type DataViewNode = {
  type: "dataView";
  title?: string;
  source: string;
  controls?: DataFilterControl[];
  query: DataQuery;
  views: Array<
    | {
        type: "chart";
        kind: "bar" | "line";
        title?: string;
        x: string;
        y: string;
      }
    | {
        type: "dataTable";
        title?: string;
        columns: string[];
      }
    | {
        type: "calendar";
        title?: string;
        date: string;
        value: string;
      }
  >;
};

function compare(left: DataScalar, op: FilterOperator, right: DataScalar): boolean {
  if (op === "eq") return left === right;
  if (op === "neq") return left !== right;
  if (op === "contains") {
    return String(left ?? "")
      .toLocaleLowerCase()
      .includes(String(right ?? "").toLocaleLowerCase());
  }
  if (left === null || right === null) return false;
  if (typeof left !== typeof right) return false;
  if (op === "gt") return left > right;
  if (op === "gte") return left >= right;
  if (op === "lt") return left < right;
  return left <= right;
}

function aggregate(rows: DataRow[], measure: AggregateMeasure): DataScalar {
  if (measure.op === "count") return rows.length;
  if (measure.op === "countDistinct") {
    if (!measure.field) return null;
    const seen = new Set<DataScalar>();
    for (const row of rows) {
      const value = row[measure.field];
      if (value !== null && value !== undefined) seen.add(value);
    }
    return seen.size;
  }
  if (!measure.field) return null;
  const values = rows
    .map((row) => row[measure.field!])
    .filter((value): value is number => typeof value === "number");
  if (values.length === 0) return null;
  if (measure.op === "sum") return values.reduce((sum, value) => sum + value, 0);
  if (measure.op === "avg") {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  if (measure.op === "min") return Math.min(...values);
  return Math.max(...values);
}

function groupRows(rows: DataRow[], fields: string[]): Map<string, DataRow[]> {
  const groups = new Map<string, DataRow[]>();
  for (const row of rows) {
    const key = JSON.stringify(fields.map((field) => row[field] ?? null));
    const group = groups.get(key) ?? [];
    group.push(row);
    groups.set(key, group);
  }
  return groups;
}

/**
 * Executes the deliberately small analysis DSL in-memory.
 * An absent/null parameter means “all” and skips that predicate.
 */
export function executeDataQuery(
  source: DataRow[],
  query: DataQuery,
  params: QueryParams = {},
): DataRow[] {
  let rows = source.filter((row) =>
    (query.where ?? []).every((filter) => {
      const value = params[filter.param];
      return value === undefined || value === null || value === ""
        ? true
        : compare(row[filter.field] ?? null, filter.op, value);
    }),
  );

  const groupBy = query.groupBy ?? [];
  const measures = query.measures ?? [];
  if (groupBy.length > 0 || measures.length > 0) {
    const groups = groupRows(rows, groupBy);
    rows = Array.from(groups.values(), (group) => {
      const result: DataRow = {};
      for (const field of groupBy) result[field] = group[0]?.[field] ?? null;
      for (const measure of measures) result[measure.as] = aggregate(group, measure);
      return result;
    });
  } else {
    rows = rows.map((row) => ({ ...row }));
  }

  for (const order of [...(query.orderBy ?? [])].reverse()) {
    const direction = order.direction === "desc" ? -1 : 1;
    rows.sort((a, b) => {
      const left = a[order.field];
      const right = b[order.field];
      if (left === right) return 0;
      if (left === null || left === undefined) return 1;
      if (right === null || right === undefined) return -1;
      return left < right ? -direction : direction;
    });
  }

  return rows.slice(0, query.limit ?? 200);
}

export function getFilterOptions(rows: DataRow[], field: string): DataScalar[] {
  const seen = new Set<string>();
  const values: DataScalar[] = [];
  for (const row of rows) {
    const value = row[field] ?? null;
    if (value === null) continue;
    const key = `${typeof value}:${String(value)}`;
    if (!seen.has(key)) {
      seen.add(key);
      values.push(value);
    }
  }
  return values.sort((a, b) => String(a).localeCompare(String(b)));
}
