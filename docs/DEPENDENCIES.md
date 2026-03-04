# Závislosti projektu

## 1. NPM workspaces (monorepo)

```
├── apps/web         (@web3privacy/web)
├── apps/explorer    (@web3privacy/explorer)
├── apps/stacks      (@web3privacy/stacks)
└── packages/portal-ui
```

**packageManager:** npm@11.7.0

---

## 2. Klíčové závislosti apps/web

| Balíček | Verze | Účel |
|---------|-------|------|
| next | 15.3.8 | Framework |
| react, react-dom | 19.x | UI |
| @web3privacy/portal-ui | file:../../packages | Header, navigace, globals.css |
| nuqs | ^2.4.3 | URL search params (filtry) |
| zod | ^3.24.4 | Validace |
| radix-ui | různé | Dialog, Select, Accordion, … |
| tailwindcss | ^4 | Styly |
| js-yaml | ^4.1.0 | YAML (Library, Glossary, Jobs) |
| octokit | ^4.1.2 | GitHub API (PR při commit projektu) |

---

## 3. Externí služby a API

| Služba | URL / env | Účel |
|--------|-----------|------|
| Explorer Data | `API_URLS.EXPLORER_DATA` / `EXPLORER_DATA_URL` | Projekty, kategorie, ranks |
| GitHub | Octokit | PR při ukládání projektu |
| Open Library | covers.openlibrary.org | Obaly knih (ISBN) |

---

## 4. Environment proměnné

| Proměnná | Popis | Povinné |
|----------|-------|---------|
| `EXPLORER_DATA_URL` | URL explorer-data JSON | Ne (default: explorer-data.web3privacy.info) |
| `NEXT_PUBLIC_WEB_URL` | URL unified portálu (pro standalone apps) | Ne |
| `NEXT_PUBLIC_EXPLORER_URL` | URL standalone Explorer | Ne |
| `NEXT_PUBLIC_STACKS_URL` | URL standalone Stacks | Ne |

Pro GitHub PR (commit projektu) jsou potřeba další env (viz API route).

---

## 5. packages/portal-ui

**Exportuje:**
- `PortalHeader`, `PortalNavItem`, `PortalHeaderProps`
- `ThemeToggle`
- `getNavItems`, `NavContext`, `NavUrls`, `DEFAULT_NAV_URLS`
- `cn` (utility)
- `./globals.css` – Tailwind theme, fonty, dark mode

**Peer dependencies:** next ≥15, react ≥19, react-dom ≥19

---

## 6. Strom importů (zjednodušeně)

```
layout.tsx
  └── PortalNav (portal-ui)
        └── PortalHeader, getNavItems

page.tsx (home)
  └── ProjectsFilters, ProjectsList
        └── loadExplorerData / API /api/projects

library/page.tsx
  └── LibraryPageContent (lib/library.ts)

glossary/page.tsx
  └── GlossaryPageContent (lib/glossary.ts)

jobs/page.tsx
  └── JobsList (lib/jobs.ts)

ideas/page.tsx
  └── IdeasPageContent (lib/ideas.ts)

stacks/page.tsx
  └── StacksPageContent (loadExplorerData, API)
```
