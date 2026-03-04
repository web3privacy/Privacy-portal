# Migrace a onboarding vývojáře

## 1. Rychlý start

```bash
npm install
npm run dev:web
```

Aplikace běží na `http://localhost:3000`.

---

## 2. Předpoklady

- Node.js 18+
- npm 11.x (doporučeno)
- (volitelně) Git pro explorer-data

---

## 3. Migrace na nový server / prostředí

### 3.1 Kód

```bash
git clone <repo>
cd CODEX-PORTAL
npm install
```

### 3.2 Data

| Zdroj | Cíl | Poznámka |
|-------|-----|----------|
| `data/explorer-data/` | `data/explorer-data/` | Projekty, kategorie, ranks |
| `data/library.yaml` | `apps/web/data/library.yaml` | V rámci apps/web |
| `data/glossary.yaml` | `apps/web/data/glossary.yaml` | |
| `data/jobs.yaml` | `apps/web/data/jobs.yaml` | |
| `public/data/ideas/*.json` | `apps/web/public/data/ideas/` | Statické JSON |

**Explorer data build:**
```bash
npm run data:build
```
(vytvoří `data/explorer-data/index.json` ze YAML)

### 3.3 Environment

Vytvořit `.env.local` v `apps/web`:
```
EXPLORER_DATA_URL=https://explorer-data.web3privacy.info
```
(nebo vlastní CDN / server s index.json)

### 3.4 Build a deploy

```bash
npm run build:web
npm run start:web
```

Nebo Docker:
```bash
docker build -t codex-portal .
docker run -p 3000:3000 codex-portal
```

---

## 4. Kontext pro budoucí vývoj

### 4.1 Přidání nové sekce

1. Route: `apps/web/src/app/<section>/page.tsx`
2. Nav: upravit `packages/portal-ui/src/nav-config.ts` (MORE submenu nebo hlavní položky)
3. `portal-nav.tsx`: přidat `getActiveId` pro novou cestu
4. Komponenty v `components/<section>/`

### 4.2 Nový datový zdroj

1. Typy v `types/`
2. Loader v `lib/` (server: fs, client: fetch)
3. API route v `app/api/` (pokud je potřeba)
4. Stránka / komponenta pro zobrazení a editaci

### 4.3 Editace dat

- **YAML (Library, Glossary, Jobs):** API route čte/píše soubory v `data/`
- **Explorer projekty:** ProjectEditor → API local nebo GitHub PR
- **Ideas:** pouze localStorage (client-side)

### 4.4 Sticky submenu

Submenu s filtry má `sticky top-0 z-40`. **Důležité:** na sticky prvku nesmí být `transform` ani `animate-*` s transformem (ruší sticky).
