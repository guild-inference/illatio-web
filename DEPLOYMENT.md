# Cloudflare Worker & Domain Deployment

## 1. Host-Aware Cloudflare Worker Architecture (`worker.mjs` + `wrangler.toml`)

`illatio-web` is packaged as a **Cloudflare Worker with Static Assets** (`wrangler.toml` `main = "worker.mjs"`, `[assets] directory = "./dist"`). A single Worker deployment serves all three top-level Illatio properties based on the incoming request hostname (or `?domain=labs|cloud` query override on `*.workers.dev`):

| Property      | Canonical Custom Domain     | Worker Route Resolution (`worker.mjs`) |
| ------------- | --------------------------- | -------------------------------------- |
| Illatio Home  | `https://illatio.dev`       | `/` → `dist/index.html`                |
| Guild Labs    | `https://labs.illatio.dev`  | `/` → `dist/labs/index.html`           |
| Illatio Cloud | `https://cloud.illatio.dev` | `/` → `dist/cloud/index.html`          |

## 2. Deploying the Cloudflare Worker

### Option A: CLI Deployment (`npm run deploy:worker`)

```bash
# 1. Authenticate Wrangler (or export CLOUDFLARE_API_TOKEN with Workers Scripts:Edit permission)
npx wrangler login

# 2. Build production bundle and deploy the Worker + Static Assets
npm run deploy:worker
```

### Option B: Cloudflare Workers Builds (Git Integration)

1. In the Cloudflare dashboard, open **Workers & Pages → Create application → Workers → Import a repository**.
2. Select **`guild-inference/illatio-web`**.
3. Set Build command: `PUBLIC_DEPLOYMENT=production npm run build`
4. Set Deploy command: `npx wrangler deploy`
5. Under **Settings → Domains & Routes**, attach custom domains:
   - `illatio.dev`
   - `labs.illatio.dev`
   - `cloud.illatio.dev`

### Option C: GitHub Actions Automated Worker Deployment

`.github/workflows/ci.yml` includes a `deploy-worker` job that validates `npx wrangler deploy --dry-run` on every push to `main` and automatically runs `npx wrangler deploy` once `CLOUDFLARE_API_TOKEN` (and optionally `CLOUDFLARE_ACCOUNT_ID`) is added to the repository or `guild-inference` organization secrets.
