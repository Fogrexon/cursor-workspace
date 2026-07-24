import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseYaml } from "yaml";
import {
  defaultDemoPath,
  defaultSourcePath,
  ensureTrailingSlash,
  joinUrl,
  resolveRepoRootUrl,
  resolveSourceUrl,
} from "./resolve.ts";
import type {
  CatalogDocument,
  CatalogItem,
  EntryConfig,
  WorkspaceConfig,
} from "./types.ts";
import { assertEntry, assertWorkspace } from "./validate.ts";

async function listYamlFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  async function walk(current: string): Promise<void> {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch (err) {
      const code = (err as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return;
      throw err;
    }
    for (const ent of entries) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
      } else if (ent.isFile() && /\.ya?ml$/i.test(ent.name)) {
        out.push(full);
      }
    }
  }
  await walk(dir);
  return out.sort();
}

export async function loadWorkspace(filePath: string): Promise<WorkspaceConfig> {
  const text = await readFile(filePath, "utf8");
  return assertWorkspace(parseYaml(text), filePath);
}

export async function loadEntries(entriesDir: string): Promise<EntryConfig[]> {
  const files = await listYamlFiles(entriesDir);
  if (files.length === 0) {
    throw new Error(`No entry YAML files under ${entriesDir}`);
  }
  const entries: EntryConfig[] = [];
  for (const file of files) {
    const text = await readFile(file, "utf8");
    entries.push(assertEntry(parseYaml(text), file));
  }
  return entries;
}

export function buildCatalog(
  workspace: WorkspaceConfig,
  entries: EntryConfig[],
  generatedAt = new Date().toISOString(),
): CatalogDocument {
  const ids = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.id)) {
      throw new Error(`Duplicate entry id: ${entry.id}`);
    }
    ids.add(entry.id);
  }

  for (const entry of entries) {
    for (const rel of entry.related ?? []) {
      if (!ids.has(rel)) {
        throw new Error(`Entry "${entry.id}" related to unknown id "${rel}"`);
      }
    }
  }

  const pagesBaseUrl = ensureTrailingSlash(workspace.pages.baseUrl);
  const apiUrl = joinUrl(pagesBaseUrl, workspace.pages.apiPath);

  const items: CatalogItem[] = entries.map((entry) => resolveItem(workspace, entry));
  items.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));

  return {
    version: 1,
    generatedAt,
    workspace: {
      id: workspace.id,
      title: workspace.title,
      ...(workspace.description !== undefined
        ? { description: workspace.description }
        : {}),
      ...(workspace.locale !== undefined ? { locale: workspace.locale } : {}),
      pagesBaseUrl,
      apiUrl,
      source: {
        provider: workspace.source.provider,
        owner: workspace.source.owner,
        repo: workspace.source.repo,
        branch: workspace.source.branch,
        url: resolveRepoRootUrl(workspace),
      },
    },
    items,
  };
}

function resolveItem(
  workspace: WorkspaceConfig,
  entry: EntryConfig,
): CatalogItem {
  const sourcePath = entry.sourcePath ?? defaultSourcePath(workspace, entry);
  const portal =
    entry.portal ??
    (entry.status === "published" && entry.kind === "app");

  let demo: string | null = null;
  if (entry.links?.demo !== undefined) {
    demo = entry.links.demo;
  } else if (entry.demoPath === null) {
    demo = null;
  } else if (entry.demoPath) {
    demo = joinUrl(workspace.pages.baseUrl, entry.demoPath);
  } else if (entry.kind === "app" && entry.status === "published") {
    demo = joinUrl(
      workspace.pages.baseUrl,
      defaultDemoPath(workspace, entry.id),
    );
  }

  let source: string | null;
  if (entry.links?.source !== undefined) {
    source = entry.links.source;
  } else {
    source = resolveSourceUrl(workspace, sourcePath);
  }

  const docs =
    entry.links?.docs !== undefined ? entry.links.docs : null;

  const item: CatalogItem = {
    id: entry.id,
    kind: entry.kind,
    title: entry.title,
    summary: entry.summary,
    tags: entry.tags ?? [],
    status: entry.status,
    sourcePath,
    links: { demo, source, docs },
    related: entry.related ?? [],
    order: entry.order ?? 100,
    portal,
  };

  if (entry.description !== undefined) item.description = entry.description;
  if (entry.package !== undefined) item.package = entry.package;

  return item;
}

export async function buildCatalogFromRepo(
  repoRoot: string,
  options: { pagesBaseUrl?: string } = {},
): Promise<{
  catalog: CatalogDocument;
  workspace: WorkspaceConfig;
  outputPath: string;
}> {
  const workspacePath = path.join(repoRoot, "catalog", "workspace.yaml");
  const workspace = await loadWorkspace(workspacePath);
  if (options.pagesBaseUrl) {
    workspace.pages.baseUrl = ensureTrailingSlash(options.pagesBaseUrl);
  }
  const entriesDir = path.join(repoRoot, workspace.paths.entries);
  const entries = await loadEntries(entriesDir);
  const catalog = buildCatalog(workspace, entries);
  const outputPath = path.join(
    repoRoot,
    workspace.paths.docs,
    workspace.pages.apiPath,
  );
  return { catalog, workspace, outputPath };
}
