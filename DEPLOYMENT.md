# Deployment & Domain Architecture

## 1. Domain Hierarchy

`illatio-web` serves the three top-level Illatio properties:

| Property      | Canonical Domain            | Preview Path | Package Target                    |
| ------------- | --------------------------- | ------------ | --------------------------------- |
| Illatio Home  | `https://illatio.dev`       | `/`          | `npm run package:site -- illatio` |
| Guild Labs    | `https://labs.illatio.dev`  | `/labs/`     | `npm run package:site -- labs`    |
| Illatio Cloud | `https://cloud.illatio.dev` | `/cloud/`    | `npm run package:site -- cloud`   |

The sibling `guild-web` repository serves `guild.illatio.dev`, `docs.guild.illatio.dev`, and `models.guild.illatio.dev`.

## 2. Current Infrastructure Findings (2026-10-22)

1. **Cloudflare DNS**: `illatio.dev` delegates nameservers to Cloudflare (`doug.ns.cloudflare.com`, `emely.ns.cloudflare.com`). `illatio.dev`, `labs.illatio.dev`, `cloud.illatio.dev`, and `guild.illatio.dev` currently resolve through Cloudflare proxy IPs and return HTTP `521` (Origin Down) because no origin listener is active for those hostnames.
2. **Wrangler CLI Auth**: The local `wrangler` OAuth refresh token on this host is expired (`400 invalid_grant`). Rather than requesting or storing secrets in Git, this repository provides:
   - Automated **GitHub Pages** preview deployment via `.github/workflows/ci.yml` (`https://guild-inference.github.io/illatio-web/`).
   - Reproducible **Cloudflare Pages** per-domain static bundle packaging (`npm run package:site -- illatio|labs|cloud`).
   - Optional **Nginx** static-origin configuration (`deploy/nginx/illatio-web.conf`).
3. **No Unauthorized Cutover**: Production DNS records and active host Nginx configs were not modified.

## 3. Deploying to Cloudflare Pages (Recommended Production Path)

First-level subdomains (`illatio.dev`, `labs.illatio.dev`, `cloud.illatio.dev`) are covered by Cloudflare Universal SSL (`illatio.dev` and `*.illatio.dev`).

```bash
# Authenticate Wrangler interactively on a workstation with Cloudflare access
npx wrangler login

# Build production static bundle with canonical domain links
PUBLIC_DEPLOYMENT=production npm run build

# Package and deploy illatio.dev
npm run package:site -- illatio
npx wrangler pages deploy dist-site --project-name illatio-web --branch main

# Package and deploy labs.illatio.dev
npm run package:site -- labs
npx wrangler pages deploy dist-site --project-name illatio-labs --branch main

# Package and deploy cloud.illatio.dev
npm run package:site -- cloud
npx wrangler pages deploy dist-site --project-name illatio-cloud --branch main
```

After deploying the Pages projects, attach custom domains `illatio.dev`, `labs.illatio.dev`, and `cloud.illatio.dev` in the Cloudflare dashboard (**Workers & Pages → Custom domains**).
