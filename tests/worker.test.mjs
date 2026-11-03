import { test } from 'node:test';
import assert from 'node:assert/strict';
import worker, { resolveAssetUrl, redirectFor } from '../worker.mjs';

const assets = {
  async fetch(req) {
    return new Response(`served:${new URL(req.url).pathname}`, { status: 200 });
  },
};

test('illatio-web Cloudflare Worker resolves host-aware routes and static assets', async () => {
  assert.equal(resolveAssetUrl('https://illatio.dev/').pathname, '/');
  assert.equal(resolveAssetUrl('https://labs.illatio.dev/').pathname, '/labs/');
  assert.equal(
    resolveAssetUrl('https://labs.illatio.dev/_astro/site.css').pathname,
    '/_astro/site.css',
  );

  const res = await worker.fetch(new Request('https://labs.illatio.dev/'), { ASSETS: assets });
  assert.equal(await res.text(), 'served:/labs/');
  assert.equal(res.headers.get('X-Content-Type-Options'), 'nosniff');
});

test('cloud.illatio.dev answers every path with a 301 to the Illatio section', async () => {
  for (const path of ['/', '/anything/', '/favicon.svg']) {
    const res = await worker.fetch(new Request(`https://cloud.illatio.dev${path}`), {
      ASSETS: assets,
    });
    assert.equal(res.status, 301);
    assert.equal(res.headers.get('Location'), 'https://illatio.dev/#illatio');
  }
  assert.equal(redirectFor('https://illatio.dev/'), null);
  assert.equal(redirectFor('https://labs.illatio.dev/'), null);
});
