# Contributing

Use Node 22.12 or newer. Run lint, format check, typecheck, build, unit/build checks, and Playwright before opening a pull request. CI repeats these and retains browser screenshots/traces for 14 days.

`src/layouts/Shell.astro`, `src/components/Field.astro`, and the common portion of `src/styles/site.css` are the Illatio identity v1, mirrored in `guild-inference/guild-web`. Coordinate shared visual or navigation changes across both repositories. `src/lib/links.ts` is intentionally app-specific. This small explicit shared surface avoids a private package or runtime dependency between independently deployable sites.

Use semantic HTML, visible keyboard focus, readable contrast, and reduced-motion behavior. Keep content visible before scripts execute. Do not convert proposals into product claims. Benchmarks need model, quantization, hardware, context, decoding configuration, and provenance.

Do not edit the old `/home/ubuntu/illatio-web` checkout or Guild Core to change these websites. The website repositories are independent projects.
