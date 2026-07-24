/**
 * Build all published apps (+ libs with a build script) into docs/, then regenerate catalog.json.
 * Used by Vercel (see vercel.json) and local `npm run build` at repo root.
 */
import { access, readdir, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const pretty = `${cmd} ${args.join(' ')}`;
    console.log(`> ${pretty} (cwd=${cwd})`);
    const child = spawn(cmd, args, {
      cwd,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Command failed (${code}): ${pretty}`));
    });
  });
}

async function npmCi(cwd) {
  if (await exists(path.join(cwd, 'package-lock.json'))) {
    await run('npm', ['ci'], cwd);
  } else {
    await run('npm', ['install'], cwd);
  }
}

async function loadPublishedAppIds() {
  const dir = path.join(root, 'catalog', 'entries', 'apps');
  const files = (await readdir(dir)).filter((f) => /\.ya?ml$/i.test(f));
  const ids = [];
  for (const file of files) {
    const text = await readFile(path.join(dir, file), 'utf8');
    if (!/^\s*status:\s*published\s*$/m.test(text)) continue;
    const id = text.match(/^\s*id:\s*(.+)\s*$/m)?.[1]?.trim();
    if (id) ids.push(id);
  }
  return ids.sort();
}

async function loadLibDirs() {
  const dir = path.join(root, 'lib');
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name)
    .sort();
}

async function main() {
  const apps = await loadPublishedAppIds();
  const libs = await loadLibDirs();

  console.log(
    `Building ${apps.length} published app(s): ${apps.join(', ') || '(none)'}`,
  );
  console.log(`Installing ${libs.length} lib(s): ${libs.join(', ') || '(none)'}`);

  for (const lib of libs) {
    const cwd = path.join(root, 'lib', lib);
    if (!(await exists(path.join(cwd, 'package.json')))) continue;
    await npmCi(cwd);
    const pkg = JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8'));
    if (pkg.scripts?.build) {
      await run('npm', ['run', 'build'], cwd);
    }
  }

  for (const app of apps) {
    const cwd = path.join(root, 'apps', app);
    if (!(await exists(path.join(cwd, 'package.json')))) {
      throw new Error(`Published app missing package.json: apps/${app}`);
    }
    await npmCi(cwd);
    await run('npm', ['run', 'build'], cwd);
  }

  const catalogCwd = path.join(root, 'tools', 'workspace-catalog');
  await npmCi(catalogCwd);

  const catalogArgs = ['run', 'build', '--', '--root', '../..'];
  const pagesBaseUrl = resolvePagesBaseUrlOverride();
  if (pagesBaseUrl) {
    console.log(`Catalog pagesBaseUrl override: ${pagesBaseUrl}`);
    catalogArgs.push('--pages-base-url', pagesBaseUrl);
  }
  await run('npm', catalogArgs, catalogCwd);

  console.log('Done: all apps built + catalog.json generated under docs/');
}

/** Preview deployments get the deployment host; production keeps workspace.yaml. */
function resolvePagesBaseUrlOverride() {
  if (process.env.VERCEL_ENV === 'production') return null;
  const host = process.env.VERCEL_URL;
  if (!host) return null;
  return `https://${host.replace(/\/$/, '')}/`;
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
