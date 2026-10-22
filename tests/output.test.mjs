import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
const root = new URL('../dist/', import.meta.url);
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) =>
      e.isDirectory() ? walk(new URL(`${e.name}/`, dir)) : [new URL(e.name, dir)],
    ),
  );
  return nested.flat();
}
test('every generated internal page, anchor, and asset link resolves', async () => {
  const files = (await walk(root)).filter((f) => f.pathname.endsWith('.html'));
  assert.ok(files.length >= 4, 'Build the site first');
  const errors = [];
  for (const file of files) {
    const html = await readFile(file, 'utf8');
    for (const [, attr, value] of html.matchAll(/\b(href|src)="([^"]+)"/g)) {
      if (/^(?:[a-z]+:|\/\/)/i.test(value)) continue;
      const [url, fragment] = value.split('#');
      let target = url
        ? new URL(
            url.startsWith('/') ? url.slice(1) : url,
            url.startsWith('/') ? root : new URL('./', file),
          )
        : file;
      try {
        if ((await stat(target)).isDirectory())
          target = new URL('index.html', new URL(`${target.href.replace(/\/$/, '')}/`));
        await stat(target);
        if (attr === 'href' && fragment && target.pathname.endsWith('.html')) {
          const targetHtml = await readFile(target, 'utf8');
          const id = decodeURIComponent(fragment).replaceAll('&amp;', '&');
          if (!targetHtml.includes(`id="${id}"`))
            errors.push(`${path.basename(file.pathname)} → missing anchor ${value}`);
        }
      } catch {
        errors.push(`${file.pathname} → missing ${value}`);
      }
    }
  }
  assert.deepEqual(errors, []);
});
