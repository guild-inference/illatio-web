import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const root = new URL('../dist/', import.meta.url);
async function pages(dir = root) {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((e) =>
      e.isDirectory() ? pages(new URL(`${e.name}/`, dir)) : [new URL(e.name, dir)],
    ),
  );
  return nested.flat().filter((f) => f.pathname.endsWith('.html'));
}
const text = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ');

test('no page names the retired model family or a hosted Cloud product', async () => {
  const hits = [];
  for (const file of await pages()) {
    const html = await readFile(file, 'utf8');
    if (
      /\bEon\b/i.test(text(html)) ||
      /\beon\b/i.test(html.match(/<head>[\s\S]*?<\/head>/)?.[0] ?? '')
    )
      hits.push(`${file.pathname}: Eon`);
    if (/Guild Cloud|cloud\.illatio\.dev/.test(html)) hits.push(`${file.pathname}: Cloud`);
  }
  assert.deepEqual(hits, []);
});

test('no page implies nonprofit status', async () => {
  const hits = [];
  for (const file of await pages()) {
    const body = text(await readFile(file, 'utf8'));
    if (/non-?profit|501\s*\(?c\)?\s*\(?3\)?|tax[- ]deductible|charit/i.test(body))
      hits.push(file.pathname);
  }
  assert.deepEqual(hits, []);
});
