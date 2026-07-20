import type { EntryConfig, WorkspaceConfig } from "./types.ts";

export function ensureTrailingSlash(url: string): string {
  return url.endsWith("/") ? url : `${url}/`;
}

export function joinUrl(base: string, path: string): string {
  const b = ensureTrailingSlash(base);
  const p = path.replace(/^\/+/, "");
  return `${b}${p}`;
}

export function fillTemplate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => {
    if (!(key in vars)) {
      throw new Error(`Missing template variable {${key}} in "${template}"`);
    }
    return vars[key]!;
  });
}

export function defaultSourcePath(
  workspace: WorkspaceConfig,
  entry: Pick<EntryConfig, "id" | "kind">,
): string {
  const defaults = workspace.defaults ?? {};
  const template =
    entry.kind === "app"
      ? (defaults.appSourcePath ?? "{apps}/{id}")
      : (defaults.libSourcePath ?? "{libs}/{id}");
  return fillTemplate(template, {
    apps: workspace.paths.apps,
    libs: workspace.paths.libs,
    id: entry.id,
  });
}

export function defaultDemoPath(
  workspace: WorkspaceConfig,
  entryId: string,
): string {
  const template = workspace.defaults?.demoPath ?? "{id}/";
  return fillTemplate(template, { id: entryId });
}

export function resolveSourceUrl(
  workspace: WorkspaceConfig,
  sourcePath: string,
): string {
  return fillTemplate(workspace.source.treeUrlTemplate, {
    owner: workspace.source.owner,
    repo: workspace.source.repo,
    branch: workspace.source.branch,
    path: sourcePath.replace(/^\/+|\/+$/g, ""),
  });
}

export function resolveRepoRootUrl(workspace: WorkspaceConfig): string {
  return fillTemplate(workspace.source.treeUrlTemplate, {
    owner: workspace.source.owner,
    repo: workspace.source.repo,
    branch: workspace.source.branch,
    path: "",
  }).replace(/\/$/, "");
}
