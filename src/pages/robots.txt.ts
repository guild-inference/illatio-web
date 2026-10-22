export function GET() {
  return new Response(
    import.meta.env.PUBLIC_DEPLOYMENT === 'production'
      ? 'User-agent: *\nAllow: /\n'
      : 'User-agent: *\nDisallow: /\n',
  );
}
