import { describe, expect, it } from "vitest";
import { buildCatalog } from "./build.ts";
import { catalogFingerprint } from "./fingerprint.ts";
import {
  defaultSourcePath,
  fillTemplate,
  joinUrl,
  resolveSourceUrl,
} from "./resolve.ts";
import type { EntryConfig, WorkspaceConfig } from "./types.ts";

const workspace: WorkspaceConfig = {
  id: "demo-workspace",
  title: "Demo",
  description: "Test workspace",
  locale: "ja",
  paths: {
    apps: "apps",
    libs: "lib",
    docs: "docs",
    entries: "catalog/entries",
  },
  pages: {
    baseUrl: "https://example.github.io/demo/",
    apiPath: "api/catalog.json",
  },
  source: {
    provider: "github",
    owner: "acme",
    repo: "demo",
    branch: "main",
    treeUrlTemplate:
      "https://github.com/{owner}/{repo}/tree/{branch}/{path}",
  },
};

describe("resolve helpers", () => {
  it("fills templates and joins urls", () => {
    expect(fillTemplate("{a}/{b}", { a: "x", b: "y" })).toBe("x/y");
    expect(joinUrl("https://ex.com/base", "api/x.json")).toBe(
      "https://ex.com/base/api/x.json",
    );
    expect(defaultSourcePath(workspace, { id: "foo", kind: "app" })).toBe(
      "apps/foo",
    );
    expect(defaultSourcePath(workspace, { id: "bar", kind: "lib" })).toBe(
      "lib/bar",
    );
    expect(resolveSourceUrl(workspace, "apps/foo")).toBe(
      "https://github.com/acme/demo/tree/main/apps/foo",
    );
  });
});

describe("buildCatalog", () => {
  it("resolves demo/source links and portal flags", () => {
    const entries: EntryConfig[] = [
      {
        id: "liquid-lab",
        kind: "app",
        title: "Liquid Lab",
        summary: "Fluid sim",
        status: "published",
        tags: ["sim"],
        order: 1,
        related: ["theme"],
      },
      {
        id: "theme",
        kind: "lib",
        title: "Theme",
        summary: "Tokens",
        status: "published",
        package: "@playground/theme",
        order: 2,
      },
      {
        id: "gen-ui",
        kind: "app",
        title: "Gen UI",
        summary: "Local host",
        status: "local",
        demoPath: null,
        order: 3,
      },
    ];

    const catalog = buildCatalog(workspace, entries, "2026-01-01T00:00:00.000Z");
    expect(catalog.version).toBe(1);
    expect(catalog.workspace.apiUrl).toBe(
      "https://example.github.io/demo/api/catalog.json",
    );
    expect(catalog.items.map((i) => i.id)).toEqual([
      "liquid-lab",
      "theme",
      "gen-ui",
    ]);

    const app = catalog.items[0]!;
    expect(app.links.demo).toBe("https://example.github.io/demo/liquid-lab/");
    expect(app.links.source).toBe(
      "https://github.com/acme/demo/tree/main/apps/liquid-lab",
    );
    expect(app.portal).toBe(true);

    const lib = catalog.items[1]!;
    expect(lib.portal).toBe(false);
    expect(lib.package).toBe("@playground/theme");
    expect(lib.links.demo).toBeNull();

    const local = catalog.items[2]!;
    expect(local.portal).toBe(false);
    expect(local.links.demo).toBeNull();
    expect(local.links.source).toContain("apps/gen-ui");
  });

  it("rejects unknown related ids", () => {
    expect(() =>
      buildCatalog(workspace, [
        {
          id: "a",
          kind: "app",
          title: "A",
          summary: "A",
          status: "published",
          related: ["missing"],
        },
      ]),
    ).toThrow(/unknown id/);
  });

  it("fingerprint ignores generatedAt", () => {
    const entries: EntryConfig[] = [
      {
        id: "a",
        kind: "app",
        title: "A",
        summary: "A",
        status: "published",
      },
    ];
    const a = buildCatalog(workspace, entries, "2020-01-01T00:00:00.000Z");
    const b = buildCatalog(workspace, entries, "2026-07-20T00:00:00.000Z");
    expect(catalogFingerprint(a)).toBe(catalogFingerprint(b));
  });
});
