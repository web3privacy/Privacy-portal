# CODEX-PORTAL – Architektura projektu

Dokumentace datové a funkční architektury, závislostí a postupů editace pro snadnou migraci a budoucí vývoj.

---

## 1. Přehled monorepa

```
CODEX-PORTAL/
├── apps/
│   ├── web/             # Unified portal (Explorer + Stacks + Jobs + Library + Glossary + Ideas)
│   ├── explorer/        # Standalone Explorer
│   └── stacks/          # Standalone Stacks
├── packages/
│   └── portal-ui/       # Sdílené UI: header, navigace, styly
├── data/                # Zdrojová data (explorer-data, news crawler)
├── scripts/             # Build skripty
└── w3pn-org-web/        # Org web (landing W3PN) – mimo npm workspaces, samostatný Vite projekt
```

**Hlavní aplikace:** `apps/web` – unified portal na `http://localhost:3000`

**Org web (w3pn-org-web):** Samostatná SPA v kořeni repozitáře, **mimo** npm workspaces (`apps/*`, `packages/*`). Vite 5, React 18. Sdílí `@web3privacy/portal-ui` přes `file:../packages/portal-ui`. Build: `cd w3pn-org-web && npm run build` → výstup do `w3pn-org-web/dist/`. Deploy: statický hosting z `dist/` (např. web3privacy.info).

| Trasa | Sekce | Popis |
|-------|-------|-------|
| `/` | Explorer | Projekty |
| `/stacks` | Stacks | Osobní tool stacky |
| `/jobs` | Jobs | Nabídky práce |
| `/library` | Library | Dokumenty, články, knihy |
| `/glossary` | Glossary | Slovník pojmů |
| `/ideas` | Idea Generator | Nápady pro hackathony |
| `/about` | About | O projektu |

---

## 2. Technologický stack

| Kategorie | Technologie |
|-----------|-------------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| State | nuqs (URL search params), lokální stav |
| Validace | Zod |
| Formuláře | Radix Dialog, Sheet, vlastní formuláře |
| Fonty | Domine (serif), Archivo (sans), Material Symbols |

**Vzájemné závislosti v monorepu:**
- `@web3privacy/web` závisí na `@web3privacy/portal-ui` (lokální balíček)
- `portal-ui` vyžaduje Next.js ≥15, React ≥19
- **w3pn-org-web** závisí na `@web3privacy/portal-ui` přes `file:../packages/portal-ui` (mimo workspaces)

---

## 3. Datové zdroje – přehled

| Sekce | Zdroj dat | Formát | Persistence |
|-------|-----------|--------|-------------|
| **Explorer (Projekty)** | `data/explorer-data/` + remote API | YAML → JSON | Disk / CDN |
| **Stacks** | `loadExplorerData` (data API) | JSON | Remote / lokální build |
| **Library** | `data/library.yaml`, `library-user.yaml` | YAML | Disk |
| **Glossary** | `data/glossary.yaml`, `glossary-user.yaml` | YAML | Disk |
| **Jobs** | `data/jobs.yaml`, `jobs-user.yaml` | YAML | Disk |
| **Ideas** | `public/data/ideas/*.json` + localStorage | JSON | Statický + browser |

Detail v [docs/DATA.md](./DATA.md).

---

## 4. API trasy (Next.js Route Handlers)

| Endpoint | Metoda | Popis |
|----------|--------|-------|
| `/api/projects` | GET | Projekty (filtry, stránkování) |
| `/api/projects/[id]` | GET | Detail projektu |
| `/api/data` | GET | Celá explorer data |
| `/api/categories`, `/api/ecosystems`, … | GET | Referenční data |
| `/api/library` | POST | Přidání položky do library |
| `/api/library/recommend` | POST | Doporučení knihy |
| `/api/glossary` | POST | Přidání/aktualizace termínu |
| `/api/jobs` | GET, POST, PUT | CRUD jobs |
| `/api/likes` | GET, POST | Lajky stacků |
| `/api/profiles` | GET | Profily stacků |
| `/api/local/save-project` | POST | Uložení projektu (lokální) |
| `/api/github/commit-project` | POST | PR na GitHub |

---

## 5. Sdílené komponenty a layout

- **Layout:** `layout.tsx` – header (PortalNav), main, footer
- **Navigace:** `portal-nav.tsx` + `getNavItems("unified")` z `portal-ui`
- **Submenu:** Sticky filtry na Library, Glossary, Jobs, Explorer, Stacks, Ideas
- **Dark mode:** CSS třída `.dark` na `<html>`, theme toggle v headeru

---

## 6. Migrace – checklist

1. **Závislosti:** `npm install` v root složce projektu
2. **Data:** Zkopírovat `data/` (explorer-data, library, glossary, jobs)
3. **Env:** Nastavit `NEXT_PUBLIC_*`, `EXPLORER_DATA_URL` (volitelné)
4. **Build:** `npm run build:web` (spustí `sync-explorer-assets`)
5. **Ideas:** `public/data/ideas/*.json` – statické soubory

Detail v [docs/MIGRATION.md](./MIGRATION.md).

---

## 7. Deploy

| Aplikace | Jak deployovat |
|----------|----------------|
| **Portal** | Vercel – build z kořene: `npm run build:web`, output `apps/web/.next` (viz `vercel.json`). Docker: `docker build -t codex-portal .` |
| **Org web** | Statický hosting – `cd w3pn-org-web && npm run build`, nasadit obsah složky `w3pn-org-web/dist/` (např. na web3privacy.info) |
