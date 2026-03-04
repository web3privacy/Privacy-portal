# Privacy Portal & Org Web – Dokumentace projektu

Jedna dokumentace celého repozitáře: struktura, služby, datové zdroje, závislosti, proměnné a návody ke spuštění. Určeno i pro AI asistenty při dalších implementacích.

---

## 1. Přehled repozitáře

Repozitář obsahuje **dva weby**:

| Web | Složka | Účel |
|-----|--------|------|
| **Privacy Portal** | `apps/web` | Hlavní produktový portál – Explorer, Stacks, Jobs, Library, Glossary, Ideas, Academy, Events, Awards, Org sekce (`/org`) |
| **Org web** | `w3pn-org-web/` | Samostatná landing stránka organizace Web3Privacy (Vite SPA), **mimo npm workspaces** |

Dále monorepo zahrnuje **standalone aplikace** a **sdílený balíček**:

| Balíček | Složka | Účel |
|---------|--------|------|
| **@web3privacy/web** | `apps/web` | Unified portal (hlavní aplikace) |
| **@web3privacy/explorer** | `apps/explorer` | Samostatný Explorer (jen projekty) |
| **@web3privacy/stacks** | `apps/stacks` | Samostatný Stacks (jen osobní stacky) |
| **@web3privacy/portal-ui** | `packages/portal-ui` | Sdílené UI: header, navigace, design tokeny, globals.css, footer |

**NPM workspaces** (root `package.json`): `["apps/*", "packages/*"]`. Do workspaces **ne patří** `w3pn-org-web` – je to samostatný projekt v kořeni s vlastním `package.json` (`w3pn-landing`).

---

## 2. Strom struktury (klíčové části)

```
PORTAL/
├── apps/
│   ├── web/                    # @web3privacy/web – hlavní portál
│   │   ├── src/
│   │   │   ├── app/            # Next.js App Router (/, /glossary, /library, /org/*, …)
│   │   │   ├── components/     # Komponenty sekcí (org, projects, glossary, …)
│   │   │   ├── lib/            # Loadery a logika (org/w3pn-projects.ts, glossary, library, …)
│   │   │   ├── data/org/       # w3pn-projects (projects.json, details.json)
│   │   │   └── types/
│   │   ├── data/               # YAML zdroje (events, library, glossary, jobs, awards, …)
│   │   ├── public/             # Statické assety + /org/* (docs, assets, events.json)
│   │   └── scripts/           # sync-explorer-assets, download-event-images, …
│   ├── explorer/               # @web3privacy/explorer – standalone Explorer
│   └── stacks/                 # @web3privacy/stacks – standalone Stacks
├── packages/
│   └── portal-ui/              # Header, nav config, globals.css, design-tokens, footer
├── w3pn-org-web/               # Org web (Vite, React 18) – MIMO workspaces
│   ├── src/
│   │   ├── data/               # defaultContent.js, w3pn-projects-loader.js, w3pn-projects/
│   │   ├── components/         # Landing, Projects, Docs, Events, …
│   │   └── styles/
│   ├── public/                 # data/docs/, events.json (generované), assets/
│   └── scripts/                # generate-events-from-portal.js
├── data/                       # Sdílená data (explorer-data, news crawler)
├── scripts/                    # build-explorer-data-json, crawl-news-feeds, fetch-docs-from-github
├── docs/                       # Dokumentace (architektura, data, plány)
├── package.json                # Workspaces, skripty dev/build/data/docs
├── vercel.json                 # Build pro apps/web
└── README-PROJECT.md           # Tento soubor
```

---

## 3. Služby a jejich funkce

### 3.1 Portal (`apps/web`) – hlavní aplikace

- **Framework:** Next.js 15 (App Router), React 19.
- **Styling:** Tailwind CSS 4, `@web3privacy/portal-ui` (globals.css, design tokeny).
- **Trasy:** `/` (Explorer), `/stacks`, `/jobs`, `/library`, `/glossary`, `/ideas`, `/events`, `/academy`, `/awards`, `/org/*` (org sekce včetně `/org/projects`, `/org/docs`), `/about`, `/donate`, `/people`, …
- **Build:** `npm run build:web` (z kořene) nebo `npm -w @web3privacy/web run build`. Před buildem běží `scripts/sync-explorer-assets.mjs`.
- **Deploy:** Vercel – build z kořene, output `apps/web/.next` (viz `vercel.json`).

### 3.2 Explorer (`apps/explorer`)

- Samostatná Next.js aplikace – pouze Explorer (projekty). Používá `@web3privacy/portal-ui` a stejná data (explorer-data).
- **Spuštění:** `npm run dev:explorer`, build: `npm run build:explorer`.

### 3.3 Stacks (`apps/stacks`)

- Samostatná Next.js aplikace – pouze Stacks (osobní nástrojové stacky). Používá `@web3privacy/portal-ui`.
- **Spuštění:** `npm run dev:stacks`, build: `npm run build:stacks`.

### 3.4 Org web (`w3pn-org-web`)

- **Framework:** Vite 5, React 18.
- **Závislost:** `@web3privacy/portal-ui` přes `file:../packages/portal-ui` (design-tokens, global-footer).
- **Stránky:** `/` (landing), `/about`, `/projects`, `/projects/:id`, `/donate`, `/docs`, `/docs/*`, `/events`, `/events/:id`, `/resources`, admin panel (cesta z defaultContent).
- **Data:** `src/data/defaultContent.js`, `src/data/w3pn-projects/` (projects.json, details.json), `public/data/docs/`, `public/events.json` (generované ze Portalu), YAML pro footer/activities.
- **Build:** `cd w3pn-org-web && npm run build`. Před buildem se volá `scripts/generate-events-from-portal.js` (čte `apps/web/data/events`, píše `w3pn-org-web/public/events.json` a `apps/web/public/org/events.json`).
- **Dev:** `cd w3pn-org-web && npm run dev` – před startem se volá fetch-docs a generate-events.

### 3.5 portal-ui (`packages/portal-ui`)

- **Exportuje:** `PortalHeader`, `PortalNavItem`, `ThemeToggle`, `getNavItems`, `NavContext`, `cn`, `./globals.css`, `./design-tokens.css`, `./global-footer`, `./global-footer.css`.
- **Peer dependencies:** next ≥15, react ≥19, react-dom ≥19. Org web používá React 18 – bere pouze design-tokens a footer, ne celý Next layout.

---

## 4. Datová struktura a zdroje

### 4.1 Explorer (projekty)

| Zdroj | Cesta / URL | Formát | Poznámka |
|------|-------------|--------|----------|
| Build výstup | `data/explorer-data/index.json` | JSON | Generuje `npm run data:build` ze YAML |
| YAML zdroj | `data/explorer-data/src/projects/<id>/index.yaml`, categories.yaml, ecosystems.yaml, … | YAML | |
| Remote (volitelně) | `EXPLORER_DATA_URL` / API_URLS.EXPLORER_DATA | JSON | CDN např. explorer-data.web3privacy.info |
| Assety projektů | `apps/web/public/project-assets/projects/<id>/`, `apps/explorer/public/project-assets/projects/<id>/` | Obrázky | Sync skript z explorer-data/assets |

Portal a Explorer načítají projekty přes `loadExplorerData()` nebo API `GET /api/projects`, `GET /api/data`.

### 4.2 Org projekty (W3PN – academy, portal, explorer, …)

| Kdo | Zdroj | Cesta |
|-----|--------|-------|
| **Portal** | Import v build time | `apps/web/src/data/org/w3pn-projects/projects.json`, `details.json` |
| **Org web** | Import v build time | `w3pn-org-web/src/data/w3pn-projects/projects.json`, `details.json` |

Loader v Portalu: `apps/web/src/lib/org/w3pn-projects.ts`. **Nepleťte** s Explorer projekty – jiná sada ID a dat.

### 4.3 Library, Glossary, Jobs, Awards

| Sekce | Základní soubor | User / doplňky | API |
|-------|------------------|-----------------|-----|
| Library | `apps/web/data/library.yaml` | library-user.yaml, library-recommendations.yaml | POST /api/library, POST /api/library/recommend |
| Glossary | `apps/web/data/glossary.yaml` | glossary-user.yaml | POST /api/glossary |
| Jobs | `apps/web/data/jobs.yaml` | jobs-user.yaml | GET/POST/PUT /api/jobs |
| Awards | `apps/web/data/awards.yaml` | awards-user.yaml | Načtení v lib/awards.ts |

### 4.4 Events

| Zdroj | Cesta | Poznámka |
|-------|--------|----------|
| YAML | `apps/web/data/events/index.yaml`, events-user.yaml, events-visibility.yaml, details/*.yaml | Schéma 1:1 web3privacy/data |
| Org web + Portal /org | `w3pn-org-web/public/events.json`, `apps/web/public/org/events.json` | Generuje `w3pn-org-web/scripts/generate-events-from-portal.js` |

### 4.5 Ideas (Idea Generator)

- **Zdroj:** `apps/web/public/data/ideas/community-ideas.json`, expert-ideas.json, organization-ideas.json + localStorage klíč `privacy-portal-ideas-user`.
- Žádný backend; přidání přes `AddIdeaForm` → localStorage.

### 4.6 Org docs (Docs sekce org webu a Portalu /org/docs)

- **Portal:** `apps/web/public/org/data/docs/` – obsah + assets. Načítáno přes fetch, trasy `/org/docs/*`.
- **Org web:** `w3pn-org-web/public/data/docs/` – stejná struktura.
- **Aktualizace:** Skript `scripts/fetch-docs-from-github.mjs` stahuje z `web3privacy/docs` a zapisuje do **`apps/web/public/org/data/docs/`**. Pro org web je potřeba buď kopírovat, nebo rozšířit skript.

---

## 5. Závislosti mezi částmi

```
┌─────────────────────────────────────────────────────────────────┐
│ packages/portal-ui                                               │
│ (header, nav, footer, globals.css, design-tokens)                │
└─────────────────────────────────────────────────────────────────┘
    │                    │                    │
    ▼                    ▼                    ▼
apps/web           apps/explorer         apps/stacks          w3pn-org-web
(Portal)           (standalone)          (standalone)         (Vite; jen tokeny + footer)
    │
    ├── data: apps/web/data/*.yaml, src/data/org/w3pn-projects
    ├── explorer data: data/explorer-data/index.json nebo EXPLORER_DATA_URL
    └── public/org/*: docs, events.json, assets

w3pn-org-web
    ├── data: vlastní src/data/defaultContent.js, w3pn-projects/
    ├── events: public/events.json ← generováno z apps/web/data/events
    └── docs: public/data/docs/ (ručně nebo skriptem z apps/web/public/org/data/docs)
```

- **Org web** při buildu potřebuje existenci `../apps/web/data/events` (nebo zapíše prázdné events.json) a `../packages/portal-ui`.

---

## 6. Proměnné prostředí a odkazy

### 6.1 Portal / Explorer / Stacks

| Proměnná | Kde | Popis |
|----------|-----|--------|
| `EXPLORER_DATA_URL` | apps/web, apps/explorer | URL JSON explorer-data (default např. explorer-data.web3privacy.info) |
| `NEXT_PUBLIC_WEB_URL` | standalone apps | Base URL unified portálu (pro odkazy v navigaci) |
| `NEXT_PUBLIC_EXPLORER_URL` | standalone apps | URL standalone Exploreru |
| `NEXT_PUBLIC_STACKS_URL` | standalone apps | URL standalone Stacks |
| `NEXT_PUBLIC_BASE_URL` | apps/web | Např. pro Academy API po deployi (Vercel) |
| `YOUTUBE_CHANNEL_ID` | apps/web | Volitelně pro Academy YouTube RSS |
| Pro GitHub PR (commit projektu) | apps/web API | Octokit – viz route `/api/github/commit-project` |

### 6.2 Org web

- Volitelně `VITE_PORTAL_URL`, `VITE_ORG_URL` pro odkazy v UI (např. „Privacy Portal“ → portál, „About“ → org).

---

## 7. Jak spustit a budovat

### 7.1 Základní příkazy (z kořene repozitáře)

```bash
npm install
```

| Účel | Příkaz |
|------|--------|
| Portal (hlavní app) | `npm run dev:web` → http://localhost:3000 |
| Explorer standalone | `npm run dev:explorer` |
| Stacks standalone | `npm run dev:stacks` |
| Build portálu | `npm run build:web` |
| Build explorer/stacks | `npm run build:explorer`, `npm run build:stacks` |
| Sestavení explorer-data JSON | `npm run data:build` |
| Crawl news feedů | `npm run crawl:news` |
| Stažení docs z GitHubu do apps/web/public/org/data/docs | `npm run docs:fetch` |

### 7.2 Org web

```bash
cd w3pn-org-web
npm install
npm run dev          # před tím se volá fetch-docs a generate-events
npm run build        # před buildem generate-events
```

### 7.3 Pořadí při plném běhu

1. `npm install` v kořeni (workspaces).
2. `npm run data:build` – pokud používáte lokální explorer-data YAML.
3. `npm run dev:web` nebo `npm run dev:explorer` / `dev:stacks`.
4. Pro org web: `cd w3pn-org-web && npm install && npm run dev`.

---

## 8. API trasy (Portal – apps/web)

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| /api/projects | GET | Projekty (filtry, stránkování) |
| /api/projects/[id] | GET | Detail projektu |
| /api/data | GET | Celá explorer data |
| /api/categories, /api/ecosystems, … | GET | Referenční data |
| /api/library | POST | Přidání položky do library |
| /api/library/recommend | POST | Doporučení knihy |
| /api/glossary | POST | Přidání/aktualizace termínu |
| /api/jobs | GET, POST, PUT | CRUD jobs |
| /api/likes | GET, POST | Lajky stacků |
| /api/profiles | GET | Profily stacků |
| /api/local/save-project | POST | Uložení projektu (lokální disk) |
| /api/github/commit-project | POST | Vytvoření PR na GitHub |
| /api/academy/youtube, /api/academy/radio | GET | Academy – YouTube / radio |

---

## 9. Editace dat – stručný workflow

| Sekce | Jak přidat/upravit | Kam se ukládá |
|-------|--------------------|----------------|
| Explorer projekty | ProjectEditor → /api/local/save-project nebo /api/github/commit-project | data/explorer-data/src/projects/<id>/ nebo GitHub PR |
| Library | AddLibraryItemForm → POST /api/library | apps/web/data/library-user.yaml |
| Glossary | AddTermForm / EditTermForm → POST /api/glossary | apps/web/data/glossary-user.yaml |
| Jobs | AddJobForm / EditJobForm → POST/PUT /api/jobs | apps/web/data/jobs-user.yaml |
| Ideas | AddIdeaForm → localStorage | Klíč privacy-portal-ideas-user |
| Events | YAML v apps/web/data/events/ | index.yaml, details/*.yaml; pak spustit generate-events v w3pn-org-web |
| Org projekty (W3PN) | Ruční úprava JSON | apps/web/src/data/org/w3pn-projects/*.json a w3pn-org-web/src/data/w3pn-projects/*.json |

---

## 10. Org web vs Portal – integrace

- **Portal** má sekci `/org` (org projekty, docs, donate, …); data z `apps/web/src/data/org/w3pn-projects` a `apps/web/public/org/`.
- **Org web** je samostatná SPA; může být hostována na jiné doméně (např. web3privacy.info). Odkazy mezi weby se řeší přes env nebo konstanty (VITE_PORTAL_URL, aboutHref v nav-config).
- **Styly:** Portal = Tailwind + portal-ui; Org web = vlastní global.css + design-tokens.css z portal-ui. Izolace zachována.
- **Docs:** Portal servíruje org docs z `apps/web/public/org/data/docs`. Org web má vlastní kopii v `w3pn-org-web/public/data/docs`; zdroj pravdy lze sjednotit a skript `fetch-docs-from-github.mjs` rozšířit o zápis do obou míst.

---

## 11. Deploy

- **Portal:** Vercel – root repo, build command `npm run build`, output `apps/web/.next`. Viz také [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md).
- **Org web:** Statický hosting – výstup z `w3pn-org-web/dist/` po `npm run build`.
- **Docker:** `docker build -t codex-portal .` a `docker run -p 3000:3000 codex-portal` pro portál.

---

## 12. Další dokumentace v repozitáři

| Soubor | Obsah |
|--------|--------|
| [STYLE-GUIDE.md](./STYLE-GUIDE.md) | Sdílený stylový systém (design tokeny, barvy, fonty) Portal + org web |
| [STYLE-COMPATIBILITY-ANALYSIS.md](./STYLE-COMPATIBILITY-ANALYSIS.md) | Analýza kompatibility stylů mezi Portal a w3pn |
| [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) | Nasazení portálu na Vercel |
| [YOUTUBE_SETUP.md](./YOUTUBE_SETUP.md) | Nastavení YouTube videí (Academy) |
| [docs/PROJECT-DETAIL-DATA-SCHEMA.md](./docs/PROJECT-DETAIL-DATA-SCHEMA.md) | Rozšířené schéma details.json pro org projekty (project detail stránka) |

Obsah dokumentů v `docs/` (ARCHITECTURE, DATA, DEPENDENCIES, EDIT-WORKFLOWS, SECTIONS, MIGRATION, W3PN-ORG-WEB-INTEGRATION) je sloučen v tomto README-PROJECT.md; jednotlivé soubory v `docs/` slouží jako doplněk nebo archiv.

---

## 13. Rychlé odkazy pro implementace

- **Přidání nové sekce v Portalu:** route v `apps/web/src/app/<section>/page.tsx`, položka v `packages/portal-ui/src/nav-config.ts`, aktivní stav v `apps/web/src/components/navigation/portal-nav.tsx`, komponenty v `apps/web/src/components/<section>/`.
- **Nový datový zdroj:** typy v `apps/web/src/types/`, loader v `apps/web/src/lib/`, volitelně API v `apps/web/src/app/api/`.
- **Org projekty (změna dat):** upravit obě cesty, aby zůstaly v sync: `apps/web/src/data/org/w3pn-projects/` a `w3pn-org-web/src/data/w3pn-projects/`.
- **Events pro org web:** po změně YAML v `apps/web/data/events` spustit `cd w3pn-org-web && node scripts/generate-events-from-portal.js`.
