import type { EntryConfig, WorkspaceConfig } from "./types.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(obj: Record<string, unknown>, key: string, ctx: string): string {
  const v = obj[key];
  if (typeof v !== "string" || v.length === 0) {
    throw new Error(`${ctx}: "${key}" must be a non-empty string`);
  }
  return v;
}

export function assertWorkspace(raw: unknown, ctx = "workspace"): WorkspaceConfig {
  if (!isRecord(raw)) throw new Error(`${ctx}: must be an object`);

  const pathsRaw = raw.paths;
  if (!isRecord(pathsRaw)) throw new Error(`${ctx}: "paths" must be an object`);

  const pagesRaw = raw.pages;
  if (!isRecord(pagesRaw)) throw new Error(`${ctx}: "pages" must be an object`);

  const sourceRaw = raw.source;
  if (!isRecord(sourceRaw)) throw new Error(`${ctx}: "source" must be an object`);

  const workspace: WorkspaceConfig = {
    id: requireString(raw, "id", ctx),
    title: requireString(raw, "title", ctx),
    paths: {
      apps: requireString(pathsRaw, "apps", `${ctx}.paths`),
      libs: requireString(pathsRaw, "libs", `${ctx}.paths`),
      docs: requireString(pathsRaw, "docs", `${ctx}.paths`),
      entries: requireString(pathsRaw, "entries", `${ctx}.paths`),
    },
    pages: {
      baseUrl: requireString(pagesRaw, "baseUrl", `${ctx}.pages`),
      apiPath: requireString(pagesRaw, "apiPath", `${ctx}.pages`),
    },
    source: {
      provider: "github",
      owner: requireString(sourceRaw, "owner", `${ctx}.source`),
      repo: requireString(sourceRaw, "repo", `${ctx}.source`),
      branch: requireString(sourceRaw, "branch", `${ctx}.source`),
      treeUrlTemplate: requireString(sourceRaw, "treeUrlTemplate", `${ctx}.source`),
    },
  };

  if (typeof raw.description === "string") workspace.description = raw.description;
  if (typeof raw.locale === "string") workspace.locale = raw.locale;

  if (sourceRaw.provider !== undefined && sourceRaw.provider !== "github") {
    throw new Error(`${ctx}.source: only provider "github" is supported`);
  }

  if (isRecord(raw.defaults)) {
    workspace.defaults = {};
    for (const key of ["appSourcePath", "libSourcePath", "demoPath"] as const) {
      const v = raw.defaults[key];
      if (v !== undefined) {
        if (typeof v !== "string") {
          throw new Error(`${ctx}.defaults.${key}: must be a string`);
        }
        workspace.defaults[key] = v;
      }
    }
  }

  return workspace;
}

const STATUSES = new Set(["published", "draft", "local", "archived"]);
const KINDS = new Set(["app", "lib"]);

export function assertEntry(raw: unknown, ctx = "entry"): EntryConfig {
  if (!isRecord(raw)) throw new Error(`${ctx}: must be an object`);

  const kind = requireString(raw, "kind", ctx);
  if (!KINDS.has(kind)) {
    throw new Error(`${ctx}: kind must be "app" or "lib"`);
  }

  const status = requireString(raw, "status", ctx);
  if (!STATUSES.has(status)) {
    throw new Error(`${ctx}: invalid status "${status}"`);
  }

  const entry: EntryConfig = {
    id: requireString(raw, "id", ctx),
    kind: kind as EntryConfig["kind"],
    title: requireString(raw, "title", ctx),
    summary: requireString(raw, "summary", ctx),
    status: status as EntryConfig["status"],
  };

  if (typeof raw.description === "string") entry.description = raw.description;
  if (typeof raw.package === "string") entry.package = raw.package;
  if (typeof raw.sourcePath === "string") entry.sourcePath = raw.sourcePath;
  if (raw.demoPath === null || typeof raw.demoPath === "string") {
    entry.demoPath = raw.demoPath as string | null;
  }
  if (typeof raw.order === "number" && Number.isInteger(raw.order)) {
    entry.order = raw.order;
  }
  if (typeof raw.portal === "boolean") entry.portal = raw.portal;

  if (raw.tags !== undefined) {
    if (!Array.isArray(raw.tags) || !raw.tags.every((t) => typeof t === "string")) {
      throw new Error(`${ctx}: tags must be string[]`);
    }
    entry.tags = raw.tags as string[];
  }

  if (raw.related !== undefined) {
    if (
      !Array.isArray(raw.related) ||
      !raw.related.every((t) => typeof t === "string")
    ) {
      throw new Error(`${ctx}: related must be string[]`);
    }
    entry.related = raw.related as string[];
  }

  if (raw.links !== undefined) {
    if (!isRecord(raw.links)) throw new Error(`${ctx}: links must be an object`);
    entry.links = {};
    for (const key of ["demo", "source", "docs"] as const) {
      const v = raw.links[key];
      if (v === undefined) continue;
      if (v !== null && typeof v !== "string") {
        throw new Error(`${ctx}.links.${key}: must be string or null`);
      }
      entry.links[key] = v as string | null;
    }
  }

  return entry;
}
