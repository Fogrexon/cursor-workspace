import { describe, expect, it } from "vitest";
import { executeDataQuery, getFilterOptions, type DataRow } from "./data.js";

const sales: DataRow[] = [
  { month: "2026-01", region: "East", revenue: 120, orders: 3 },
  { month: "2026-01", region: "West", revenue: 80, orders: 2 },
  { month: "2026-02", region: "East", revenue: 150, orders: 4 },
  { month: "2026-02", region: "West", revenue: 100, orders: 2 },
];

describe("executeDataQuery", () => {
  it("filters by a parameter and aggregates by group", () => {
    const rows = executeDataQuery(
      sales,
      {
        where: [{ field: "region", op: "eq", param: "region" }],
        groupBy: ["month"],
        measures: [
          { op: "sum", field: "revenue", as: "revenue" },
          { op: "count", as: "rows" },
        ],
        orderBy: [{ field: "month" }],
      },
      { region: "East" },
    );

    expect(rows).toEqual([
      { month: "2026-01", revenue: 120, rows: 1 },
      { month: "2026-02", revenue: 150, rows: 1 },
    ]);
  });

  it("treats a null parameter as no filter", () => {
    const rows = executeDataQuery(
      sales,
      {
        where: [{ field: "region", op: "eq", param: "region" }],
        groupBy: ["month"],
        measures: [{ op: "sum", field: "revenue", as: "revenue" }],
        orderBy: [{ field: "month" }],
      },
      { region: null },
    );

    expect(rows.map((row) => row.revenue)).toEqual([200, 250]);
  });

  it("returns null for a numeric aggregate with no numeric values", () => {
    const rows = executeDataQuery(
      [{ category: "A", amount: null }],
      {
        groupBy: ["category"],
        measures: [{ op: "avg", field: "amount", as: "average" }],
      },
    );
    expect(rows).toEqual([{ category: "A", average: null }]);
  });

  it("counts distinct field values within a group", () => {
    const rows = executeDataQuery(
      [
        { day: "2026-04-01", user_id: "u1", event_name: "login" },
        { day: "2026-04-01", user_id: "u2", event_name: "login" },
        { day: "2026-04-01", user_id: "u1", event_name: "login" },
        { day: "2026-04-02", user_id: "u3", event_name: "login" },
      ],
      {
        where: [{ field: "event_name", op: "eq", param: "event_name" }],
        groupBy: ["day"],
        measures: [{ op: "countDistinct", field: "user_id", as: "login_users" }],
        orderBy: [{ field: "day" }],
      },
      { event_name: "login" },
    );

    expect(rows).toEqual([
      { day: "2026-04-01", login_users: 2 },
      { day: "2026-04-02", login_users: 1 },
    ]);
  });

  it("applies descending order and limit after aggregation", () => {
    const rows = executeDataQuery(sales, {
      groupBy: ["region"],
      measures: [{ op: "sum", field: "revenue", as: "revenue" }],
      orderBy: [{ field: "revenue", direction: "desc" }],
      limit: 1,
    });
    expect(rows).toEqual([{ region: "East", revenue: 270 }]);
  });
});

describe("getFilterOptions", () => {
  it("returns unique non-null values", () => {
    expect(getFilterOptions(sales, "region")).toEqual(["East", "West"]);
  });
});
