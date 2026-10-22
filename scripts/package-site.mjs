import { cp, mkdir, rm, readdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const { name } = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const allowed = name === 'illatio-web' ? ['illatio', 'labs', 'cloud'] : ['guild', 'docs', 'models'];
const target = process.argv[2];
if (!allowed.includes(target))
  throw new Error(`Usage: npm run package:site -- ${allowed.join('|')}`);
const src = path.join(root, 'dist');
const out = path.join(root, 'dist-site');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
// Only generated build output is removed or copied; no DNS/custom-domain changes.
if (target === allowed[0]) await cp(src, out, { recursive: true });
else {
  await cp(path.join(src, target), out, { recursive: true });
  for (const entry of await readdir(src, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || !entry.isDirectory())
      await cp(path.join(src, entry.name), path.join(out, entry.name), { recursive: true });
  }
}
console.log(`Packaged ${target} → dist-site/ (root document and shared assets)`);
