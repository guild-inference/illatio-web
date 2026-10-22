# Illatio web

Three working public properties, built separately from Guild Core:

| Property      | Production domain   | Preview path |
| ------------- | ------------------- | ------------ |
| Illatio       | `illatio.dev`       | `/`          |
| Guild Labs    | `labs.illatio.dev`  | `/labs/`     |
| Illatio Cloud | `cloud.illatio.dev` | `/cloud/`    |

Persistent preview: **https://guild-inference.github.io/illatio-web/**

## Develop

Node 22.12+ and npm. Dependencies are locked; fonts are self-hosted.

```bash
npm ci
npm run dev                  # http://127.0.0.1:4173
npm run lint
npm run typecheck
npm run build
npm test                     # generated links, anchors, assets
npx playwright install chromium
npm run test:e2e             # real Chromium, desktop/390px/320px, axe, keyboard
npm run preview
```

`npm run format` writes formatting; `npm run format:check` verifies it.

## Architecture

Astro generates complete HTML for each route. Navigation and reading work without JavaScript. Small browser scripts handle copy feedback and the illustrative storage calculator. There is no SPA router, React runtime, account system, analytics, or backend to operate. The short entry animation respects reduced motion.

The identity pairs Instrument Serif with Manrope, quiet ruled layouts, and an original sparse-field SVG. Illatio uses warm paper and terracotta, Labs violet, Cloud blue, and the sibling Guild site ink and pale green. Shared visual primitives are versioned in both repositories; see [CONTRIBUTING.md](CONTRIBUTING.md).

Production links preserve the six-domain hierarchy. Previews use real paths and cross-link to the sibling preview. `PUBLIC_DEPLOYMENT=production` enables canonical production navigation; default development links use ports 4173/4174. `PUBLIC_GUILD_URL` overrides the other repository's preview origin.

## Content

- Illatio introduces the ecosystem and its current development status.
- Labs presents research interests and Eon as a proposal; grant decision pending.
- The weight explorer is an explicitly labeled ideal storage calculation, not a model specification or memory-fit claim.
- Cloud is a product introduction with **In development** status, not a working hosted service.

Deployment commands, current access findings, and nested-domain TLS requirements: [DEPLOYMENT.md](DEPLOYMENT.md). CI builds and tests every PR; successful `main` runs publish the Pages preview without custom-domain changes.
