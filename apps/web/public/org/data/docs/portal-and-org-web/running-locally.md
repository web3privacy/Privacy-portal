# Running locally

How to run the Portal monorepo and the org web on your machine.

## Prerequisites

- **Node.js** 20+ (LTS recommended)
- **npm** (v9+; project uses npm workspaces)

## Org web (organisational site + docs)

From the **repository root**:

```bash
cd w3pn-org-web
npm install
npm run dev
```

- App runs at **http://localhost:5173** (Vite default).
- Docs are at **http://localhost:5173/docs**; content is loaded from `/data/docs/` (i.e. `public/data/docs/`).

## Portal (Next.js app)

From the **repository root**:

```bash
npm install
npm run dev:web
```

Or from the app directory:

```bash
cd apps/web
npm install
npm run dev
```

- Portal runs at **http://localhost:3000** (or the port Next.js reports).

## Fetching latest docs

To refresh docs content from [web3privacy/docs](https://github.com/web3privacy/docs):

```bash
# from repo root
node scripts/fetch-docs-from-github.mjs
```

Output is written to `w3pn-org-web/public/data/docs/` (except existing local pages such as **Portal & Org Web**, which are not overwritten).

## Other workspace commands

From repo root:

- `npm run dev` — runs the default workspace dev script (often org web or portal; see root `package.json`).
- `npm run build` — build default app.
- `npm run dev:explorer` / `npm run build:explorer` — Explorer app if present.
- `npm run dev:stacks` / `npm run build:stacks` — Stacks app if present.

Check root `package.json` and each app’s `package.json` for the full list of scripts.
