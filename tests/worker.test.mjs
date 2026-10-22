import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { resolveAssetUrl } from '../worker.mjs';

test('illatio-web Cloudflare Worker resolves host-aware routes and static assets', async () => {
  assert.equal(resolveAssetUrl('https://illatio.dev/').pathname, '/');
  assert.equal(resolveAssetUrl('https://labs.illatio.dev/').pathname, '/labs/');
  assert.equal(resolveAssetUrl('https://cloud.illatio.dev/').pathname, '/cloud/');
  assert.equal(
    resolveAssetUrl('https://labs.illatio.dev/_astro/site.css').pathname,
    '/_astro/site.css',
  );
  assert.equal(resolveAssetUrl('https://cloud.illatio.dev/favicon.svg').pathname, '/favicon.svg');

  const res = await worker.fetch(new Request('https://labs.illatio.dev/'), {
    ASSETS: {
      async fetch(req) {
        return new Response(`served:${new URL(req.url).pathname}`, { status: 200 });
      },
    },
  });
  assert.equal(await res.text(), 'served:/labs/');
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
});
