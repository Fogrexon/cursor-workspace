import type { DataRow } from "./data.js";

/** Seeded PRNG so fixture size stays large but reproducible across builds. */
function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, values: readonly T[]): T {
  return values[Math.floor(rand() * values.length)]!;
}

function weightedPick<T>(
  rand: () => number,
  items: ReadonlyArray<{ value: T; weight: number }>,
): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let cursor = rand() * total;
  for (const item of items) {
    cursor -= item.weight;
    if (cursor <= 0) return item.value;
  }
  return items[items.length - 1]!.value;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function dayKey(date: Date): string {
  return `${date.getUTCFullYear()}-${pad2(date.getUTCMonth() + 1)}-${pad2(date.getUTCDate())}`;
}

function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.getTime() + seconds * 1000);
}

type Platform = "web" | "ios" | "android";
type Plan = "free" | "pro" | "team" | "enterprise";
type Channel = "organic" | "paid_search" | "social" | "email" | "referral" | "direct";
type Persona = "browser" | "builder" | "buyer" | "churn_risk";

type UserMeta = {
  userId: string;
  country: string;
  plan: Plan;
  channel: Channel;
  platform: Platform;
  persona: Persona;
  signupDay: number;
  engagement: number;
};

const PAGES_BY_PERSONA: Record<Persona, ReadonlyArray<{ value: string; weight: number }>> = {
  browser: [
    { value: "/home", weight: 24 },
    { value: "/pricing", weight: 18 },
    { value: "/docs", weight: 16 },
    { value: "/onboarding", weight: 14 },
    { value: "/search", weight: 12 },
    { value: "/projects", weight: 10 },
    { value: "/settings", weight: 6 },
  ],
  builder: [
    { value: "/editor", weight: 28 },
    { value: "/projects", weight: 22 },
    { value: "/projects/detail", weight: 16 },
    { value: "/home", weight: 12 },
    { value: "/docs", weight: 8 },
    { value: "/search", weight: 8 },
    { value: "/settings", weight: 6 },
  ],
  buyer: [
    { value: "/billing", weight: 22 },
    { value: "/pricing", weight: 18 },
    { value: "/settings", weight: 14 },
    { value: "/projects", weight: 14 },
    { value: "/editor", weight: 12 },
    { value: "/home", weight: 12 },
    { value: "/docs", weight: 8 },
  ],
  churn_risk: [
    { value: "/home", weight: 20 },
    { value: "/settings", weight: 18 },
    { value: "/billing", weight: 14 },
    { value: "/projects", weight: 14 },
    { value: "/docs", weight: 12 },
    { value: "/pricing", weight: 12 },
    { value: "/onboarding", weight: 10 },
  ],
};

const FEATURES_BY_PERSONA: Record<Persona, ReadonlyArray<{ value: string; weight: number }>> = {
  browser: [
    { value: "dark_mode", weight: 30 },
    { value: "template_apply", weight: 25 },
    { value: "share_link", weight: 20 },
    { value: "comment", weight: 15 },
    { value: "ai_assist", weight: 10 },
  ],
  builder: [
    { value: "ai_assist", weight: 28 },
    { value: "export_csv", weight: 22 },
    { value: "template_apply", weight: 18 },
    { value: "comment", weight: 16 },
    { value: "share_link", weight: 16 },
  ],
  buyer: [
    { value: "invite_member", weight: 30 },
    { value: "export_csv", weight: 22 },
    { value: "share_link", weight: 20 },
    { value: "ai_assist", weight: 18 },
    { value: "comment", weight: 10 },
  ],
  churn_risk: [
    { value: "dark_mode", weight: 25 },
    { value: "comment", weight: 20 },
    { value: "share_link", weight: 20 },
    { value: "export_csv", weight: 20 },
    { value: "ai_assist", weight: 15 },
  ],
};

const ERROR_CODES = ["TIMEOUT", "AUTH_EXPIRED", "RATE_LIMIT", "VALIDATION", "INTERNAL"] as const;
const APP_VERSIONS = ["2.4.0", "2.4.1", "2.5.0", "2.5.1", "2.6.0"] as const;

export type GenerateUserLogsOptions = {
  /** Approximate event count target (sessions expand until near this). */
  count?: number;
  seed?: number;
  startDay?: string;
  days?: number;
  users?: number;
};

function chooseHour(rand: () => number, country: string, weekday: number): number {
  // JP / KR skew earlier local evening; weekends flatten mornings.
  const weekend = weekday === 0 || weekday === 6;
  const asia = country === "JP" || country === "KR" || country === "SG";
  const weights = weekend
    ? [
        { value: 10, weight: 6 },
        { value: 11, weight: 8 },
        { value: 12, weight: 9 },
        { value: 13, weight: 8 },
        { value: 14, weight: 8 },
        { value: 15, weight: 7 },
        { value: 16, weight: 7 },
        { value: 19, weight: 10 },
        { value: 20, weight: 12 },
        { value: 21, weight: 13 },
        { value: 22, weight: 12 },
      ]
    : asia
      ? [
          { value: 8, weight: 6 },
          { value: 9, weight: 10 },
          { value: 10, weight: 11 },
          { value: 11, weight: 9 },
          { value: 12, weight: 7 },
          { value: 13, weight: 8 },
          { value: 14, weight: 9 },
          { value: 15, weight: 8 },
          { value: 16, weight: 7 },
          { value: 19, weight: 8 },
          { value: 20, weight: 9 },
          { value: 21, weight: 8 },
        ]
      : [
          { value: 9, weight: 7 },
          { value: 10, weight: 9 },
          { value: 11, weight: 9 },
          { value: 12, weight: 7 },
          { value: 13, weight: 8 },
          { value: 14, weight: 10 },
          { value: 15, weight: 10 },
          { value: 16, weight: 9 },
          { value: 17, weight: 8 },
          { value: 18, weight: 7 },
          { value: 20, weight: 8 },
          { value: 21, weight: 8 },
        ];
  return weightedPick(rand, weights);
}

function dayTrafficMultiplier(dayOffset: number, days: number, weekday: number): number {
  const growth = 0.65 + 0.55 * (dayOffset / Math.max(days - 1, 1));
  const weekly = weekday === 0 || weekday === 6 ? 0.72 : weekday === 1 || weekday === 5 ? 0.92 : 1;
  // Mid-period paid campaign bump.
  const campaign = dayOffset >= 20 && dayOffset <= 27 ? 1.35 : 1;
  // Version rollout noise around day 40.
  const rollout = dayOffset >= 38 && dayOffset <= 42 ? 1.12 : 1;
  return growth * weekly * campaign * rollout;
}

function versionForDay(dayOffset: number, rand: () => number): string {
  if (dayOffset < 12) return weightedPick(rand, [
    { value: "2.4.0", weight: 55 },
    { value: "2.4.1", weight: 45 },
  ]);
  if (dayOffset < 38) return weightedPick(rand, [
    { value: "2.4.1", weight: 25 },
    { value: "2.5.0", weight: 45 },
    { value: "2.5.1", weight: 30 },
  ]);
  return weightedPick(rand, [
    { value: "2.5.1", weight: 35 },
    { value: "2.6.0", weight: 65 },
  ]);
}

function pushEvent(
  rows: DataRow[],
  partial: Omit<DataRow, "event_id"> & { event_id?: string },
): void {
  rows.push({
    event_id: partial.event_id ?? `evt_${String(rows.length + 1).padStart(6, "0")}`,
    ...partial,
  });
}

/**
 * Synthetic product analytics logs with intentional structure:
 * personas, session funnels, weekday/growth seasonality, campaign spikes,
 * plan/channel purchase bias, and version-rollout error bursts.
 */
export function generateUserLogs(options: GenerateUserLogsOptions = {}): DataRow[] {
  const target = options.count ?? 8000;
  const seed = options.seed ?? 20260718;
  const days = options.days ?? 60;
  const users = options.users ?? 420;
  const rand = mulberry32(seed);

  const start = options.startDay
    ? new Date(`${options.startDay}T00:00:00.000Z`)
    : new Date("2026-04-01T00:00:00.000Z");

  const userMeta: UserMeta[] = Array.from({ length: users }, (_, index) => {
    const country = weightedPick(rand, [
      { value: "JP", weight: 34 },
      { value: "US", weight: 22 },
      { value: "KR", weight: 8 },
      { value: "GB", weight: 7 },
      { value: "DE", weight: 6 },
      { value: "FR", weight: 5 },
      { value: "AU", weight: 5 },
      { value: "CA", weight: 5 },
      { value: "SG", weight: 4 },
      { value: "BR", weight: 4 },
    ]);
    const channel = weightedPick(rand, [
      { value: "organic", weight: 34 },
      { value: "paid_search", weight: 18 },
      { value: "direct", weight: 16 },
      { value: "social", weight: 12 },
      { value: "referral", weight: 12 },
      { value: "email", weight: 8 },
    ] as Array<{ value: Channel; weight: number }>);
    const persona = weightedPick(rand, [
      { value: "browser", weight: 34 },
      { value: "builder", weight: 36 },
      { value: "buyer", weight: 18 },
      { value: "churn_risk", weight: 12 },
    ] as Array<{ value: Persona; weight: number }>);
    const plan = weightedPick(rand, [
      {
        value: "free",
        weight: persona === "buyer" ? 20 : persona === "builder" ? 40 : 62,
      },
      {
        value: "pro",
        weight: persona === "buyer" ? 40 : persona === "builder" ? 35 : 22,
      },
      {
        value: "team",
        weight: persona === "buyer" ? 28 : 12,
      },
      {
        value: "enterprise",
        weight: persona === "buyer" ? 12 : 4,
      },
    ] as Array<{ value: Plan; weight: number }>);
    const platform = weightedPick(rand, [
      {
        value: "web",
        weight: plan === "enterprise" || plan === "team" ? 58 : country === "JP" ? 42 : 38,
      },
      {
        value: "ios",
        weight: country === "JP" || country === "US" ? 34 : 28,
      },
      {
        value: "android",
        weight: country === "KR" || country === "BR" ? 34 : 24,
      },
    ] as Array<{ value: Platform; weight: number }>);

    return {
      userId: `u_${String(index + 1).padStart(4, "0")}`,
      country,
      plan,
      channel,
      platform,
      persona,
      signupDay: Math.floor(rand() * Math.min(45, days - 1)),
      engagement: clamp(0.35 + rand() * 0.9 + (persona === "builder" ? 0.25 : 0), 0.2, 1.4),
    };
  });

  const rows: DataRow[] = [];
  let sessionCounter = 0;
  let guard = 0;

  while (rows.length < target && guard < target * 4) {
    guard += 1;
    const user = pick(rand, userMeta);
    const dayOffset = Math.floor(rand() * days);
    if (dayOffset < user.signupDay) continue;

    const dayDate = new Date(start);
    dayDate.setUTCDate(start.getUTCDate() + dayOffset);
    const weekday = dayDate.getUTCDay();
    const traffic = dayTrafficMultiplier(dayOffset, days, weekday) * user.engagement;
    if (rand() > Math.min(0.95, 0.35 * traffic)) continue;

    sessionCounter += 1;
    const sessionId = `s_${String(sessionCounter).padStart(5, "0")}`;
    const hour = chooseHour(rand, user.country, weekday);
    let cursor = new Date(dayDate);
    cursor.setUTCHours(hour, Math.floor(rand() * 60), Math.floor(rand() * 60), 0);

    const platform = rand() < 0.82 ? user.platform : pick(rand, ["web", "ios", "android"] as const);
    const appVersion = versionForDay(dayOffset, rand);
    const rolloutErrorBoost = dayOffset >= 38 && dayOffset <= 42 && appVersion === "2.6.0" ? 0.12 : 0.03;
    const campaign = dayOffset >= 20 && dayOffset <= 27 && user.channel === "paid_search";

    const emit = (
      eventName: string,
      extras: Partial<DataRow> = {},
      gapSec = 8 + Math.floor(rand() * 70),
    ) => {
      cursor = addSeconds(cursor, gapSec);
      const page =
        typeof extras.page === "string"
          ? extras.page
          : weightedPick(rand, PAGES_BY_PERSONA[user.persona]);
      const isPurchase = eventName === "purchase";
      const isError = eventName === "error";
      const isFeature = eventName === "feature_use";
      const durationMs =
        eventName === "page_view" || eventName === "feature_use"
          ? Math.round((user.persona === "builder" ? 4000 : 1200) + rand() * 90000)
          : eventName === "app_open"
            ? Math.round(250 + rand() * 2500)
            : null;

      pushEvent(rows, {
        ts: cursor.toISOString(),
        day: dayKey(cursor),
        hour: cursor.getUTCHours(),
        user_id: user.userId,
        session_id: sessionId,
        event_name: eventName,
        page,
        platform,
        country: user.country,
        plan: user.plan,
        channel: user.channel,
        app_version: appVersion,
        feature: isFeature
          ? weightedPick(rand, FEATURES_BY_PERSONA[user.persona])
          : null,
        error_code: isError ? pick(rand, ERROR_CODES) : null,
        duration_ms: durationMs,
        revenue_usd: isPurchase
          ? Number(
              (
                (user.plan === "enterprise" ? 120 : user.plan === "team" ? 49 : 19) +
                rand() * 30
              ).toFixed(2),
            )
          : 0,
        is_success: isError ? false : rand() > 0.02,
        ...extras,
      });
    };

    // Session skeleton: open → browse → optional deeper funnel.
    emit("app_open", { page: "/home" }, 0);

    if (user.persona === "browser" || dayOffset === user.signupDay) {
      emit("page_view", { page: dayOffset === user.signupDay ? "/onboarding" : "/home" });
      if (rand() < 0.45) emit("page_view", { page: "/pricing" });
      if (dayOffset === user.signupDay && rand() < 0.55) emit("signup", { page: "/onboarding" });
      if (rand() < 0.25) emit("search", { page: "/search" });
    } else if (user.persona === "builder") {
      emit("login", { page: "/home" });
      emit("page_view", { page: "/projects" });
      emit("page_view", { page: "/editor" });
      if (rand() < 0.7) emit("feature_use", { page: "/editor" });
      if (rand() < 0.35) emit("click", { page: "/projects/detail" });
      if (rand() < 0.2) emit("search", { page: "/search" });
    } else if (user.persona === "buyer") {
      emit("login", { page: "/home" });
      emit("page_view", { page: "/pricing" });
      emit("page_view", { page: "/billing" });
      if (rand() < 0.4) emit("feature_use", { page: "/settings" });
    } else {
      emit("login", { page: "/home" });
      emit("page_view", { page: "/settings" });
      if (rand() < 0.35) emit("page_view", { page: "/billing" });
      if (rand() < 0.25) emit("click", { page: "/projects" });
    }

    const purchaseChance =
      (user.plan === "free" ? 0.015 : 0.08) +
      (user.persona === "buyer" ? 0.1 : 0) +
      (campaign ? 0.08 : 0) +
      (user.channel === "paid_search" ? 0.04 : 0);
    if (rand() < purchaseChance) {
      emit("page_view", { page: "/billing" });
      emit("purchase", { page: "/billing" });
    }

    if (rand() < rolloutErrorBoost + (user.persona === "churn_risk" ? 0.04 : 0)) {
      emit("error", {
        page: weightedPick(rand, PAGES_BY_PERSONA[user.persona]),
        is_success: false,
      });
    }

    if (rand() < 0.35) emit("logout", { page: "/home" });
  }

  // Trim or top-up to keep size stable for demos.
  rows.sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
  if (rows.length > target) rows.length = target;
  for (let i = 0; i < rows.length; i++) {
    rows[i]!.event_id = `evt_${String(i + 1).padStart(6, "0")}`;
  }
  return rows;
}

/** Default large fixture used by the host (~8k event rows). */
export const DUMMY_USER_LOGS: DataRow[] = generateUserLogs();

export const USER_LOG_SCHEMA_HINT =
  'dataset "user_logs": event_id, ts, day, hour, user_id, session_id, event_name, page, platform, country, plan, channel, app_version, feature, error_code, duration_ms, revenue_usd, is_success';
