const STATIC_PREFIXES = ['/_astro/', '/favicon.svg', '/social.svg', '/robots.txt', '/404'];

// cloud.illatio.dev was folded into one section of illatio.dev. Every path there answers with a
// permanent redirect to that section.
export const FOLDED_HOSTS = { 'cloud.illatio.dev': 'https://illatio.dev/#illatio' };

function isStaticAsset(pathname) {
  return STATIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix));
}

export function redirectFor(requestUrl) {
  const url = new URL(requestUrl);
  return FOLDED_HOSTS[url.hostname.toLowerCase()] ?? null;
}

export function resolveAssetUrl(requestUrl) {
  const url = new URL(requestUrl);
  const host = url.hostname.toLowerCase();
  const domainOverride = url.searchParams.get('domain');

  let prefix = '';
  if (domainOverride === 'labs' || host === 'labs.illatio.dev' || host.startsWith('labs.')) {
    prefix = '/labs';
  }

  if (
    prefix &&
    !isStaticAsset(url.pathname) &&
    !url.pathname.startsWith(`${prefix}/`) &&
    url.pathname !== prefix
  ) {
    const cleanPath = url.pathname === '/' ? '/' : url.pathname;
    url.pathname = `${prefix}${cleanPath}`;
  }

  return url;
}

export default {
  async fetch(request, env) {
    const moved = redirectFor(request.url);
    if (moved) return Response.redirect(moved, 301);

    const targetUrl = resolveAssetUrl(request.url);
    const assetRequest = new Request(targetUrl.toString(), request);
    const response = await env.ASSETS.fetch(assetRequest);

    const headers = new Headers(response.headers);
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('X-Frame-Options', 'DENY');
    headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (targetUrl.pathname.startsWith('/_astro/')) {
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
