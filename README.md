# CODEX-PORTAL

Privacy Portal – unified web app with **Explorer**, **Stacks**, and **Jobs**. Repozitář obsahuje **dva weby**: hlavní Portal (produktový portál) a Org web (landing Web3Privacy).

> **Kompletní dokumentace projektu** (datová struktura, služby, závislosti, proměnné, návody): **[README-PROJECT.md](./README-PROJECT.md)**.

## Quick start

### Portal (hlavní aplikace)

```bash
npm install
npm run dev:web
```

The main app (`apps/web`) runs at `http://localhost:3000` with:
- **Explorer** (`/`) – privacy projects
- **Stacks** (`/stacks`) – personal tool stacks
- **Jobs** (`/jobs`) – job listings
- **About** (`/about`)

### Org web (landing W3PN)

```bash
cd w3pn-org-web && npm install && npm run dev
```

Build: `cd w3pn-org-web && npm run build` (výstup do `w3pn-org-web/dist/`).

## Dva weby

| Web | Složka | Účel |
|-----|--------|------|
| **Portal** | `apps/web` | Produktový portál – Explorer, Stacks, Jobs, Library, Glossary, Ideas, Academy, Events |
| **Org web** | `w3pn-org-web/` | Landing stránka organizace Web3Privacy (mimo npm workspaces) |

Podrobnosti k integraci a koexistenci obou webů: [README-PROJECT.md](./README-PROJECT.md) (sekce 10), popř. [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md), [docs/W3PN-ORG-WEB-INTEGRATION.md](./docs/W3PN-ORG-WEB-INTEGRATION.md).

## Structure

| Path | Description |
|------|-------------|
| `apps/web` | Unified portal (Explorer + Stacks + Jobs + …) – **main app** |
| `apps/explorer` | Standalone Explorer |
| `apps/stacks` | Standalone Stacks |
| `w3pn-org-web` | Org/landing web (Vite, samostatná SPA) |
| `packages/portal-ui` | Shared header, nav config, styles (sdílené oběma weby) |

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev:web` | Run unified portal (recommended) |
| `npm run dev:explorer` | Run standalone Explorer |
| `npm run dev:stacks` | Run standalone Stacks |
| `npm run build:web` | Build unified portal |

Org web: v adresáři `w3pn-org-web` použijte `npm run dev` / `npm run build`.

## Environment (standalone apps)

For **stacks** and **explorer** standalone apps, set these so nav links work:

- `NEXT_PUBLIC_WEB_URL` – base URL of the unified portal
- `NEXT_PUBLIC_EXPLORER_URL` – Explorer URL
- `NEXT_PUBLIC_STACKS_URL` – Stacks URL

## Docker

```bash
docker build -t codex-portal .
docker run -p 3000:3000 codex-portal
```

## Příprava pro GitHub

Po naklonování: `npm install` v kořeni (nainstaluje závislosti pro workspaces). Pro org web navíc `cd w3pn-org-web && npm install`. Doporučené env proměnné viz [README-PROJECT.md](./README-PROJECT.md) (sekce 6) nebo [docs/DEPENDENCIES.md](./docs/DEPENDENCIES.md).

## Dokumentace

Podrobná dokumentace je v **[README-PROJECT.md](./README-PROJECT.md)**. Doplňující soubory:

- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** – architektura, datové zdroje, API
- **[docs/DATA.md](./docs/DATA.md)** – schémata dat, persistence
- **[docs/DEPENDENCIES.md](./docs/DEPENDENCIES.md)** – NPM balíčky, externí služby
- **[docs/EDIT-WORKFLOWS.md](./docs/EDIT-WORKFLOWS.md)** – workflow editace dat
- **[docs/SECTIONS.md](./docs/SECTIONS.md)** – sekce (Explorer, Library, Jobs, …)
- **[docs/MIGRATION.md](./docs/MIGRATION.md)** – migrace a onboarding
- **[docs/W3PN-ORG-WEB-INTEGRATION.md](./docs/W3PN-ORG-WEB-INTEGRATION.md)** – integrace Portal + org web

V kořeni: [STYLE-GUIDE.md](./STYLE-GUIDE.md), [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md), [YOUTUBE_SETUP.md](./YOUTUBE_SETUP.md).
