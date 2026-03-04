# Dependencies

Main dependencies and workspace setup for the Portal monorepo and org web.

## Workspaces

The repo uses **npm workspaces** (see root `package.json`):

- `apps/*` — Next.js portal and other apps
- `packages/*` — Shared packages (e.g. `portal-ui`)

`w3pn-org-web` is at the root level and uses the shared `@web3privacy/portal-ui` package via `file:../packages/portal-ui`.

## Org web (`w3pn-org-web`)

- **React** 18
- **Vite** — build and dev server
- **@web3privacy/portal-ui** — shared components (local workspace package)

Install from repo root or from `w3pn-org-web`; workspace linking is handled by npm.

## Portal (`apps/web`)

- **Next.js** 15
- **React** 19
- **@web3privacy/portal-ui** — shared UI
- **Tailwind CSS** — styling
- Other app-specific deps (Radix, markdown, etc.) — see `apps/web/package.json`

## Docs content

Docs are **not** an npm dependency. They are static files under `w3pn-org-web/public/data/docs/`, fetched by script from [web3privacy/docs](https://github.com/web3privacy/docs). To refresh:

```bash
node scripts/fetch-docs-from-github.mjs
```

## Adding or updating dependencies

- **Org web:** run `npm install <pkg>` from `w3pn-org-web/` or from root with `-w w3pn-landing` if the workspace name is set.
- **Portal:** run `npm install <pkg>` from `apps/web/` or with the appropriate workspace flag.
- **Shared package:** add to `packages/portal-ui/package.json` and use in apps via the workspace reference.

Always run `npm install` from the **repository root** after changing dependencies so that the lockfile and workspace links stay in sync.
