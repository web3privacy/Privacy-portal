# CODEX-PORTAL – Dokumentace

Podrobná dokumentace datové a funkční architektury, závislostí a postupů editace pro snadnou migraci a budoucí vývoj.

## Přehled dokumentů

| Dokument | Obsah |
|----------|-------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Celková architektura, stack, API, layout, org web, deploy |
| [DATA.md](./DATA.md) | Datové zdroje, schémata, persistence |
| [DEPENDENCIES.md](./DEPENDENCIES.md) | NPM závislosti, externí služby, env proměnné |
| [EDIT-WORKFLOWS.md](./EDIT-WORKFLOWS.md) | Workflow editace (přidání/úprava dat v každé sekci) |
| [SECTIONS.md](./SECTIONS.md) | Dokumentace jednotlivých sekcí (Explorer, Stacks, Library, …) |
| [MIGRATION.md](./MIGRATION.md) | Migrace, onboarding, checklist |
| [W3PN-ORG-WEB-INTEGRATION.md](./W3PN-ORG-WEB-INTEGRATION.md) | Integrace Portal + org web (w3pn-org-web), koexistence, data |

## Další dokumentace v kořeni projektu

- [STYLE-GUIDE.md](../STYLE-GUIDE.md) – stylový systém Portal + org web
- [STYLE-COMPATIBILITY-ANALYSIS.md](../STYLE-COMPATIBILITY-ANALYSIS.md) – analýza kompatibility stylů
- [VERCEL_DEPLOY.md](../VERCEL_DEPLOY.md) – nasazení portálu na Vercel
- [YOUTUBE_SETUP.md](../YOUTUBE_SETUP.md) – nastavení YouTube videí (Academy)

## Rychlý odkaz

- **Spuštění:** `npm run dev:web`
- **Build:** `npm run build:web`
- **Data build:** `npm run data:build`
- **Org web:** `cd w3pn-org-web && npm run dev` / `npm run build`
