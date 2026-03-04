# Workflow editace dat

Podrobný popis, jak se v jednotlivých sekcích data přidávají, mění a ukládají.

---

## 1. Explorer – projekty

### Vytvoření nového projektu

1. Uživatel: `/project/create`
2. **ProjectEditor** – formulář (YAML struktura)
3. Uložení:
   - **Lokální režim:** `POST /api/local/save-project` → zapíše do `data/explorer-data/src/projects/<id>/index.yaml`
   - **GitHub režim:** `POST /api/github/commit-project` → vytvoří PR do upstream repozitáře

### Editace projektu

1. Uživatel: `/project/[id]/edit`
2. Stejný ProjectEditor, načte existující YAML
3. Stejný flow uložení jako u vytvoření

### Závislosti

- `loadExplorerData` / `index.json` – zdroj dat pro zobrazení
- `scripts/build-explorer-data-json.mjs` – sestaví index.json ze YAML
- `sync-explorer-assets.mjs` – zkopíruje loga do public

---

## 2. Library

### Přidání položky

1. Uživatel: tlačítko "ADD BOOK" v submenu
2. **AddLibraryItemForm** – type (document/article/book), title, author, url, …
3. `POST /api/library` – tělo: `{ type, title, author, url, … }`
4. API přečte `library-user.yaml`, přidá záznam, zapíše zpět

### Doporučení knihy

1. Uživatel: "Recommend" na kartě knihy
2. `POST /api/library/recommend` – `{ itemKey, address }`
3. API zapíše do `library-recommendations.yaml`

### Soubory

- `data/library.yaml` – base (read-only v produkci)
- `data/library-user.yaml` – user příspevky (append)
- `data/library-recommendations.yaml` – doporučení

---

## 3. Glossary

### Přidání termínu

1. Uživatel: tlačítko "ADD TERM"
2. **AddTermForm** – term, definition
3. `POST /api/glossary` – `{ term, definition }`
4. API přidá do `glossary-user.yaml`

### Editace termínu

1. Uživatel: "Edit" na kartě termínu
2. **EditTermForm** – term, definition (předvyplněno)
3. `POST /api/glossary` – `{ term, definition, oldTerm }`
4. API upraví záznam v `glossary-user.yaml`

### Soubory

- `data/glossary.yaml` – base
- `data/glossary-user.yaml` – user termíny (merge s base při load)

---

## 4. Jobs

### Přidání nabídky

1. Uživatel: `/jobs/add` nebo tlačítko
2. **AddJobForm** – title, company, description, url, category, tags
3. `POST /api/jobs` – tělo job objektu
4. API přidá do `jobs-user.yaml`

### Editace nabídky

1. Uživatel: `/jobs/edit/[id]`
2. **EditJobForm** – předvyplněno
3. `PUT /api/jobs` – aktualizovaný job
4. API upraví v `jobs-user.yaml`

### Admin

- `/jobs/admin` – přehled user jobs (read-only v UI, edit přes edit stránku)

### Soubory

- `data/jobs.yaml` – base
- `data/jobs-user.yaml` – user jobs (merge při load)

---

## 5. Ideas (Idea Generator)

### Přidání nápadu

1. Uživatel: tlačítko "+ Add new idea"
2. **AddIdeaForm** – name, description, author, organization, categories, event, github, website
3. **Client-side:** `addUserIdea(idea)` → `localStorage.setItem("privacy-portal-ideas-user", JSON.stringify(ideas))`
4. Žádný backend – data zůstávají v prohlížeči

### Úprava statických dat

- Ruční editace `apps/web/public/data/ideas/community-ideas.json` (a dalších)
- Formát podle [privacy-idea-generator](https://github.com/web3privacy/privacy-idea-generator)

---

## 6. Stacks

### Přidání vlastního stacku

1. Uživatel: "Add own stack" v StacksExplorer
2. **AddOwnStackForm** – name, org, avatar, výběr nástrojů
3. Volání `onAddStack` – závisí na implementaci (API / lokální store)

### Lajky

- `GET /api/likes?address=…` – načtení lajků
- `POST /api/likes` – { stackId, address } – přepnutí lajku

---

## Shrnutí – kde se data ukládají

| Sekce   | Přidání/Edit | Cíl ukládání                          |
|---------|--------------|----------------------------------------|
| Explorer| API          | `data/explorer-data/` nebo GitHub PR  |
| Library | API          | `data/library-user.yaml`              |
| Glossary| API          | `data/glossary-user.yaml`             |
| Jobs    | API          | `data/jobs-user.yaml`                 |
| Ideas   | Client       | localStorage                          |
| Stacks  | API          | dle backendu                          |
