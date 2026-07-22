import { describe, expect, it } from "vitest";
import { generateUserLogs, DUMMY_USER_LOGS } from "./dummyUserLogs.js";
import { executeDataQuery, getFilterOptions } from "./data.js";

describe("generateUserLogs", () => {
  it("builds a large deterministic event log", () => {
    const a = generateUserLogs({ count: 800, seed: 1 });
    const b = generateUserLogs({ count: 800, seed: 1 });
    expect(a).toEqual(b);
    expect(a.length).toBeGreaterThan(500);
    expect(DUMMY_USER_LOGS.length).toBeGreaterThanOrEqual(7000);
  });

  it("keeps events inside sessions instead of isolated draws", () => {
    const sample = generateUserLogs({ count: 1500, seed: 11 });
    const bySession = new Map<string, string[]>();
    for (const row of sample) {
      const id = String(row.session_id);
      const list = bySession.get(id) ?? [];
      list.push(String(row.event_name));
      bySession.set(id, list);
    }
    const multi = [...bySession.values()].filter((events) => events.length >= 2);
    expect(multi.length).toBeGreaterThan(20);
    expect(multi.some((events) => events[0] === "app_open")).toBe(true);
  });

  it("shows structured biases (growth and paid conversion)", () => {
    const sample = generateUserLogs({ count: 4000, seed: 21, days: 60 });
    const early = sample.filter((row) => String(row.day) <= "2026-04-10").length;
    const late = sample.filter((row) => String(row.day) >= "2026-05-20").length;
    expect(late).toBeGreaterThan(early * 0.9);

    const paidPurchases = sample.filter(
      (row) => row.event_name === "purchase" && row.channel === "paid_search",
    ).length;
    const organicPurchases = sample.filter(
      (row) => row.event_name === "purchase" && row.channel === "organic",
    ).length;
    expect(paidPurchases + organicPurchases).toBeGreaterThan(0);
    // Paid search should convert at least as often as organic in this model,
    // relative to its smaller traffic share — absolute counts can still be lower.
    const paidEvents = sample.filter((row) => row.channel === "paid_search").length;
    const organicEvents = sample.filter((row) => row.channel === "organic").length;
    const paidRate = paidPurchases / Math.max(paidEvents, 1);
    const organicRate = organicPurchases / Math.max(organicEvents, 1);
    expect(paidRate).toBeGreaterThanOrEqual(organicRate);
  });

  it("supports engagement aggregation queries", () => {
    const rows = executeDataQuery(
      DUMMY_USER_LOGS,
      {
        where: [{ field: "platform", op: "eq", param: "platform" }],
        groupBy: ["day"],
        measures: [
          { op: "count", as: "events" },
          { op: "sum", field: "revenue_usd", as: "revenue_usd" },
        ],
        orderBy: [{ field: "day", direction: "asc" }],
        limit: 10,
      },
      { platform: "web" },
    );
    expect(rows.length).toBeGreaterThan(0);
    expect(typeof rows[0]?.events).toBe("number");
    expect(getFilterOptions(DUMMY_USER_LOGS, "event_name")).toContain("purchase");
  });
});
