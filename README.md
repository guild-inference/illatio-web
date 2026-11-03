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

Astro generates complete HTML for each route. All copy, links and controls are in the HTML and read without JavaScript. Scroll behaviour comes from the vendored scrollcraft engine (`src/vendor/scrollcraft/`, unmodified) plus one page script per property in `src/scripts/` and each page's own `<script>`. There is no SPA router, React runtime, account system, analytics, or backend to operate. Reduced motion keeps every state and drops the movement.

Each property has its own page structure, set in Archivo (display) and Geist (text):

| Property            | Structure                                                  | The one interaction                                                                                                    |
| ------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `illatio.dev`       | Typographic poster, graphite and signal orange             | Ten of 512: scroll (or type a word) to route words to 10 of Qwen3.8's 512 experts; the close shows the visitor's trace |
| `labs.illatio.dev`  | Chaptered paper with a margin folio, paper and ultramarine | One precision dial (16, 8, 4, 1.58 bits) redraws every plate on the page                                               |
| `cloud.illatio.dev` | Split stage, your machine against Guild Cloud              | The divider folds the cloud half away and the request on the seam turns local                                          |

The routing on the home page hashes each word to choose experts; it shows the 10-of-512 ratio and is labelled as not a trained router. Labs plates are computed in the browser from seeded sample data and labelled as such.

Production links preserve the six-domain hierarchy. Previews use real paths and cross-link to the sibling preview. `PUBLIC_DEPLOYMENT=production` enables canonical production navigation; default development links use ports 4173/4174. `PUBLIC_GUILD_URL` overrides the other repository's preview origin.

## Content

- Illatio introduces the ecosystem and its current development status.
- Labs presents research interests and Eon as a proposal; grant decision pending.
- The weight explorer is an explicitly labeled ideal storage calculation, not a model specification or memory-fit claim.
- Cloud is a product introduction with **In development** status, not a working hosted service.

Deployment commands, current access findings, and nested-domain TLS requirements: [DEPLOYMENT.md](DEPLOYMENT.md). CI builds and tests every PR; successful `main` runs publish the Pages preview without custom-domain changes.
