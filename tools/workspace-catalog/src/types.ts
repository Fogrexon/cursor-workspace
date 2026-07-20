/** Shared types for workspace catalog (input YAML + output JSON). */

export type EntryKind = "app" | "lib";
export type EntryStatus = "published" | "draft" | "local" | "archived";

export interface WorkspaceConfig {
  id: string;
  title: string;
  description?: string;
  locale?: string;
  paths: {
    apps: string;
    libs: string;
    docs: string;
    entries: string;
  };
  pages: {
    baseUrl: string;
    apiPath: string;
  };
  source: {
    provider: "github";
    owner: string;
    repo: string;
    branch: string;
    treeUrlTemplate: string;
  };
  defaults?: {
    appSourcePath?: string;
    libSourcePath?: string;
    demoPath?: string;
  };
}

export interface EntryConfig {
  id: string;
  kind: EntryKind;
  title: string;
  summary: string;
  description?: string;
  tags?: string[];
  status: EntryStatus;
  package?: string;
  sourcePath?: string;
  demoPath?: string | null;
  links?: {
    demo?: string | null;
    source?: string | null;
    docs?: string | null;
  };
  related?: string[];
  order?: number;
  portal?: boolean;
}

export interface CatalogItem {
  id: string;
  kind: EntryKind;
  title: string;
  summary: string;
  description?: string;
  tags: string[];
  status: EntryStatus;
  package?: string;
  sourcePath: string;
  links: {
    demo: string | null;
    source: string | null;
    docs: string | null;
  };
  related: string[];
  order: number;
  portal: boolean;
}

export interface CatalogDocument {
  version: 1;
  generatedAt: string;
  workspace: {
    id: string;
    title: string;
    description?: string;
    locale?: string;
    pagesBaseUrl: string;
    apiUrl: string;
    source: {
      provider: string;
      owner: string;
      repo: string;
      branch: string;
      url: string;
    };
  };
  items: CatalogItem[];
}
