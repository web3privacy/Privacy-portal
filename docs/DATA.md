# Datové zdroje a schémata

## 1. Explorer (Projekty)

### Zdroj

- **Lokálně:** `data/explorer-data/index.json` (build ze skriptu)
- **Remote:** `https://explorer-data.web3privacy.info` (nebo `EXPLORER_DATA_URL`)

### Build pipeline

```
data/explorer-data/src/
├── projects/        # Jeden adresář na projekt: projects/<id>/index.yaml
├── categories.yaml
├── ecosystems.yaml
├── usecases.yaml
├── ranks.yaml
├── assets.yaml
├── features.yaml
├── phases.yaml
├── custodys.yaml
└── requirements.yaml
         │
         ▼  scripts/build-explorer-data-json.mjs
         │
data/explorer-data/index.json
```

**Příkaz:** `npm run data:build`

### Schéma projektu (Project)

- `id`, `name`, `description`, `categories`, `usecases`, `ecosystem`
- `links` (web, github, twitter, …)
- `technology`, `blockchain_features`, `tokens`, …
- `logos` – pole `{ file, url }` pro logo
- Podrobnosti v `types/project.ts`

---

## 2. Library

### Soubory

| Soubor | Účel |
|--------|------|
| `apps/web/data/library.yaml` | Základní dokumenty, články, knihy |
| `apps/web/data/library-user.yaml` | Uživatelské doplňky (merge s base) |
| `apps/web/data/library-recommendations.yaml` | Doporučení (wallet → položky) |

### Schémata (lib/library.ts)

- **LibraryDocument** / **LibraryArticle:** title, author, year, description, url, imageUrl
- **LibraryBook:** title, author, recommendedBy, isbn, imageUrl, catalogUrl
- **LibraryData:** keyDocuments, importantArticles, books (Record<kategorie, Book[]>)

### Editace

- API `POST /api/library` – přidání položky
- API `POST /api/library/recommend` – doporučení knihy (wallet)
- Formulář: `AddLibraryItemForm`

---

## 3. Glossary

### Soubory

| Soubor | Účel |
|--------|------|
| `apps/web/data/glossary.yaml` | Základní termíny |
| `apps/web/data/glossary-user.yaml` | Uživatelské termíny (merge) |

### Schéma (lib/glossary.ts)

- **GlossaryTerm:** term, definition
- **GlossaryData:** terms[]

### Editace

- API `POST /api/glossary` – přidání nebo update termínu
- Formuláře: `AddTermForm`, `EditTermForm`

---

## 4. Jobs

### Soubory

| Soubor | Účel |
|--------|------|
| `apps/web/data/jobs.yaml` | Základní nabídky |
| `apps/web/data/jobs-user.yaml` | Uživatelské nabídky (merge) |

### Schéma (types/jobs.ts)

- **Job:** id, title, company, description, url, category, tags, …
- **JobsData:** jobs[], categories[]

### Editace

- API `GET/POST/PUT /api/jobs` – CRUD
- Formuláře: `AddJobForm`, `EditJobForm`
- Admin stránka: `/jobs/admin`

---

## 5. Events

### Soubory

| Soubor | Účel |
|--------|------|
| `apps/web/data/events/index.yaml` | Seznam eventů (1:1 schéma z web3privacy/data) |
| `apps/web/data/events/README.md` | Popis schématu a příprava na editaci |

### Schéma (types/events.ts, 1:1 web3privacy)

- **Event:** id, type (congress | summit | meetup | collab | rave | hackathon | privacycorner), date, city, country, place?, place-address?, links?, speakers?, lead, coincidence?, confirmed?, helpers?, optional?, days?, design?, **premium?**, **title?**, **description?**
- **EventsData:** events[] (YAML je root-level pole)

### Editace

- Data v `data/events/` jsou připravena na budoucí editaci (další fáze).
- Zdroj: [web3privacy/data src/events/index.yaml](https://github.com/web3privacy/data/blob/main/src/events/index.yaml)

---

## 6. Ideas (Idea Generator)

### Zdroj

| Zdroj | Účel |
|-------|------|
| `apps/web/public/data/ideas/community-ideas.json` | Komunitní nápady |
| `apps/web/public/data/ideas/expert-ideas.json` | Expertní nápady |
| `apps/web/public/data/ideas/organization-ideas.json` | Organizační nápady |
| localStorage `privacy-portal-ideas-user` | Uživatelské nápady (client) |

### Schéma (types/ideas.ts)

- **Idea:** name, description, categories[], author?, organization?, event?, github?, website?, featured?, features? (org)
- **IdeaType:** "community" | "expert" | "organization"

### Editace

- Pouze client-side: `AddIdeaForm` → `addUserIdea()` → localStorage
- Statické JSON lze editovat ručně v repozitáři

### Reference

- Data z [web3privacy/privacy-idea-generator](https://github.com/web3privacy/privacy-idea-generator)

---

## 7. Stacks

### Zdroj

- API `/api/profiles` (např. z explorer-data) – stacky
- API `/api/likes` – lajky
- Data vycházejí z explorer-data / externího API

### Schéma (types/stacks.ts)

- **Stack:** id, name, org, avatar, tools (Record<categoryKey, Tool[]>)
- **Tools:** mapa kategorií → nástroje
- **LikeCounts:** stackId → count

---

## 8. Srovnání persistence

| Sekce | Editovatelné | Kde se ukládá | Backend |
|-------|--------------|---------------|---------|
| Explorer | Ano (ProjectEditor) | GitHub PR / lokální disk | API local/github |
| Library | Ano | YAML na disku | API library |
| Glossary | Ano | YAML na disku | API glossary |
| Jobs | Ano | YAML na disku | API jobs |
| Ideas | Ano (user) | localStorage | Ne |
| Events | Připraveno | YAML v data/events/ | Načtení z disku |
| Stacks | Ano (AddOwnStack) | API / data store | API |
