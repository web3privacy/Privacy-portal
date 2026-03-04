# Portal (apps/web)

Next.js 15 unified app: Explorer, Stacks, Jobs, Library, Glossary, Ideas, Academy, Events, News, Awards, People, Donate.

## Routes vs. org web

- **`/`** – Home (news-style landing; see `src/app/page.tsx`).
- **`/explorer`** – Project list (Explorer). Project detail is **`/project/[id]`** (singular), not `/projects/[id]`. Create flow: `/project/create`, edit: `/project/[id]/edit`.
- **Org web** (repo root `w3pn-org-web`) uses `/projects` and `/projects/:id` for its own project pages; Portal uses `/project/*` for the Explorer product.

## Structure

- `src/app/` – App Router routes and API routes.
- `src/components/` – UI and feature components (projects, events, news, academy, …).
- `src/lib/` – Data loaders, utils, constants (e.g. `load-explorer-data`, `news`, `academy`, `constants`).
- `src/queries/` – Data-fetching helpers for projects, categories, ecosystems.
- `src/types/` – Shared TypeScript types.

## Commands

From repo root: `npm run dev:web`, `npm run build:web`.
