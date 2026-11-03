# Contributing

Use Node 22.12 or newer. Run lint, format check, typecheck, build, unit/build checks, and Playwright before opening a pull request. CI repeats these and retains browser screenshots/traces for 14 days.

The Illatio properties no longer use identity v1 (`Shell.astro`, `Field.astro`, `site.css`); `guild-inference/guild-web` still does. Each page now owns its structure and stylesheet (`src/styles/home.css`, `labs.css`, `cloud.css`) on the shared `src/layouts/Stage.astro` and `src/styles/base.css`. `src/vendor/scrollcraft/` is a byte-identical engine copy: theme it with `--sc-*` tokens and put page behaviour in `src/scripts/`, never in the engine. Coordinate cross-site navigation changes with `guild-web`. `src/lib/links.ts` is intentionally app-specific. This small explicit shared surface avoids a private package or runtime dependency between independently deployable sites.

Use semantic HTML, visible keyboard focus, readable contrast, and reduced-motion behavior. Keep content visible before scripts execute. Do not convert proposals into product claims. Benchmarks need model, quantization, hardware, context, decoding configuration, and provenance.

Do not edit the old `/home/ubuntu/illatio-web` checkout or Guild Core to change these websites. The website repositories are independent projects.
