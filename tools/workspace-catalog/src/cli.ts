import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildCatalogFromRepo } from "./build.ts";
import { catalogFingerprint } from "./fingerprint.ts";
import type { CatalogDocument } from "./types.ts";

function parseArgs(argv: string[]): { repoRoot: string; check: boolean } {
  let repoRoot = process.cwd();
  let check = false;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--root" && argv[i + 1]) {
      repoRoot = path.resolve(argv[++i]!);
    } else if (argv[i] === "--check") {
      check = true;
    }
  }
  return { repoRoot, check };
}

async function main(): Promise<void> {
  const { repoRoot, check } = parseArgs(process.argv.slice(2));
  const { catalog, outputPath } = await buildCatalogFromRepo(repoRoot);

  if (check) {
    let existingRaw: string;
    try {
      existingRaw = await readFile(outputPath, "utf8");
    } catch {
      console.error(`Missing ${outputPath}. Run without --check to generate.`);
      process.exit(1);
      return;
    }
    const existing = JSON.parse(existingRaw) as CatalogDocument;
    const expected = catalogFingerprint(catalog);
    const actual = catalogFingerprint(existing);
    if (expected !== actual) {
      console.error(
        `${outputPath} is out of date with catalog YAML.\n` +
          `Regenerate: cd tools/workspace-catalog && npm run build -- --root ../..`,
      );
      process.exit(1);
    }
    console.log(`OK: ${outputPath} matches catalog YAML`);
    return;
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");

  const apps = catalog.items.filter((i) => i.kind === "app").length;
  const libs = catalog.items.filter((i) => i.kind === "lib").length;
  const portal = catalog.items.filter((i) => i.portal).length;
  console.log(
    `Wrote ${outputPath} (${catalog.items.length} items: ${apps} apps, ${libs} libs, ${portal} on portal)`,
  );
}

const isMain =
  process.argv[1] &&
  path.resolve(fileURLToPath(import.meta.url)) === path.resolve(process.argv[1]);

if (isMain) {
  main().catch((err) => {
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  });
}
