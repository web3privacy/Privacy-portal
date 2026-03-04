# Dokumentace jednotlivých sekcí portálu

## 1. Explorer (Projekty)

**Trasy:** `/`, `/project/[id]`, `/project/create`, `/project/[id]/edit`

### Komponenty

| Komponenta | Soubor | Účel |
|------------|--------|------|
| ProjectsFilters | `components/projects/filters/ProjectsFilters.tsx` | Filtry, search, sticky submenu |
| ProjectsList | `components/projects/list/ProjectsList.tsx` | Seznam (cards/rows) |
| ProjectCard, ProjectRow | `components/projects/list/` | Karta / řádek projektu |
| ProjectEditor | `components/project-editor/ProjectEditor.tsx` | Vytvoření/editace YAML projektu |

### Data flow

1. `GET /api/projects` ← `loadExplorerDataFromDisk()` nebo remote
2. Filtry v URL (nuqs): categories, ecosystems, usecases, q, sortBy, sortOrder
3. `processProjects`, `computeProjectRatings` pro enrichment

### Editace projektu

- **Create:** `/project/create` → ProjectEditor → API `/api/local/save-project` nebo `/api/github/commit-project`
- **Update:** `/project/[id]/edit` → stejný flow
- Zdroj: `data/explorer-data/src/projects/<id>/index.yaml`

---

## 2. Stacks

**Trasy:** `/stacks`, `/stacks/[id]`, `/categories`, `/share/stack/[id]`, `/share/category/[id]`

### Komponenty

| Komponenta | Soubor | Účel |
|------------|--------|------|
| StacksExplorer | `components/stacks/stacks-explorer.tsx` | Hlavní stránka, filtry, sticky |
| StackPreviewCard | `components/stacks/stack-preview-card.tsx` | Karta stacku |
| AddOwnStackForm | `components/stacks/add-own-stack-form.tsx` | Přidání vlastního stacku |

### Data flow

- `/api/profiles` – stacky
- `/api/likes` – lajky (GET/POST)
- `loadExplorerData` pro tools/categories

### Editace

- Přidání stacku: `AddOwnStackForm` → API (závisí na backendu)

---

## 3. Library

**Trasy:** `/library`

### Komponenty

| Komponenta | Soubor | Účel |
|------------|--------|------|
| LibraryPageContent | `components/library/library-page-content.tsx` | Stránka, submenu, karty |
| DocumentCard, ArticleCard, BookCard | v library-page-content | Karty položek |
| AddLibraryItemForm | `components/library/add-library-item-form.tsx` | Formulář přidání |

### Data flow

- `lib/library.ts` – `loadLibraryData()` (YAML z disku)
- `POST /api/library` – přidání
- `POST /api/library/recommend` – doporučení (wallet)

### Editace

- Přidání: AddLibraryItemForm → API
- Soubory: `data/library.yaml`, `data/library-user.yaml`

---

## 4. Glossary

**Trasy:** `/library`, `/glossary/add`

### Komponenty

| Komponenta | Soubor | Účel |
|------------|--------|------|
| GlossaryPageContent | `components/glossary/glossary-page-content.tsx` | Stránka, submenu, karty termínů |
| AddTermForm, EditTermForm | `components/glossary/` | Formuláře |

### Data flow

- `lib/glossary.ts` – `loadGlossaryData()` (YAML)
- `POST /api/glossary` – add/update term

### Editace

- Add: AddTermForm
- Edit: EditTermForm (inline v kartě)
- Soubory: `data/glossary.yaml`, `data/glossary-user.yaml`

---

## 5. Jobs

**Trasy:** `/jobs`, `/jobs/add`, `/jobs/edit/[id]`, `/jobs/admin`

### Komponenty

| Komponenta | Soubor | Účel |
|------------|--------|------|
| JobsList | `components/jobs/jobs-list.tsx` | Seznam, filtry |
| JobsFilters | `components/jobs/jobs-filters.tsx` | Sticky submenu |
| JobCard | `components/jobs/job-card.tsx` | Karta nabídky |
| AddJobForm, EditJobForm | `components/jobs/` | Formuláře |

### Data flow

- `lib/jobs.ts` – `loadJobsData()` (YAML)
- `GET/POST/PUT /api/jobs` – CRUD

### Editace

- Add: `/jobs/add`
- Edit: `/jobs/edit/[id]`
- Admin: `/jobs/admin`
- Soubory: `data/jobs.yaml`, `data/jobs-user.yaml`

---

## 6. Events

**Trasy:** `/events`

### Komponenty

| Komponenta | Soubor | Účel |
|------------|--------|------|
| EventsPageContent | `components/events/events-page-content.tsx` | Stránka, filtry, upcoming/past |
| EventsFilters | `components/events/events-filters.tsx` | Sticky submenu – typ eventu, search, země, Add Event |
| EventCard | `components/events/event-card.tsx` | Karta eventu (normální / premium s vlastním pozadím) |

### Data flow

- `lib/events.ts` – `loadEventsData()` (YAML z disku)
- Data: `data/events/index.yaml` (schéma 1:1 z [web3privacy/data events](https://github.com/web3privacy/data/blob/main/src/events/index.yaml))
- Volitelné rozšíření: `title`, `description`, `premium` pro zvýrazněnou kartu

### Funkce

- **Filtry:** typ (ALL EVENTS, CONFERENCES, MEETUPS, HACKATHONS, W3PN ONLY, OTHER), fulltextové vyhledávání, země
- **Kategorie:** Upcoming Events / Past Events s řádkovým výpisem
- **Premium event:** v YAML `premium: true` (+ volitelně `title`, `description`, `design.background`) – karta s vlastním pozadím (černá / vlastní)
- **Paginace:** stránkování a „Load older events“ u minulých eventů

### Editace

- Data připravena na editaci v další fázi (admin / formuláře)
- Soubory: `data/events/index.yaml`, `data/events/README.md` (popis schématu)
- Schéma položky: id, type, date, city, country, place, links, speakers, (title, description, premium)

---

## 7. Idea Generator

**Trasy:** `/ideas`

### Komponenty

| Komponenta | Soubor | Účel |
|------------|--------|------|
| IdeasPageContent | `components/ideas/ideas-page-content.tsx` | Stránka, hero, submenu, taby |
| IdeaCard | `components/ideas/IdeaCard.tsx` | Karta nápadu |
| AddIdeaForm | `components/ideas/AddIdeaForm.tsx` | Přidání (→ localStorage) |
| GeneratedIdeaDialog | `components/ideas/GeneratedIdeaDialog.tsx` | Dialog s náhodným nápadem |

### Data flow

- Statické JSON: `/data/ideas/community-ideas.json`, `expert-ideas.json`, `organization-ideas.json`
- Client: `loadIdeas()` (fetch), `loadUserIdeas()` (localStorage)
- Žádný backend pro ideas

### Editace

- Přidání: AddIdeaForm → `addUserIdea()` → localStorage
- Statické JSON lze editovat ručně v repozitáři

---

## 8. Awards

**Trasy:** `/awards`, `/awards/[year]`

### Komponenty

| Komponenta | Soubor | Účel |
|------------|--------|------|
| AwardsPageContent | `components/awards/awards-page-content.tsx` | Hlavní stránka, submenu s výběrem ročníku |
| AwardsHero | `components/awards/awards-hero.tsx` | Hero sekce s pozadím (parallax efekt) |
| NominationCard | `components/awards/nomination-card.tsx` | Karta nominujícího s jeho nominacemi (styl ze Stacks) |
| WinnerCard, WinnersSection | `components/awards/winner-card.tsx` | Karty vítězů podle kategorií |
| ArticleCard | v awards-page-content | Karta článku |
| BannerAdCard | v awards-page-content | Placeholder pro bannerové reklamy |

### Data flow

- `lib/awards.ts` – `loadAwardsData()` (YAML z disku)
- Data se načítají z `data/awards.yaml` a `data/awards-user.yaml`
- User data má přednost před base daty

### Struktura dat

Každý ročník obsahuje:
- **Metadata**: title, description, heroBackgroundImage
- **Datumy**: nominationsOpen, nominationsClose, announcement
- **Kategorie**: konfigurace kategorií (Favourite Privacy Project, Exciting Innovation, Major News/Event, Doxxer of Year)
- **Vítězové**: seznam vítězů podle kategorií (nebo prázdné pro aktuální ročník)
- **Nominace**: seznam nominujících s jejich tipy
- **Pravidla**: text pravidel (může se lišit podle ročníku)
- **Články**: související články
- **Banner reklamy**: placeholder pro reklamy
- **How to nominate**: textová sekce s instrukcemi

### Editace

- Editace: Ruční úprava YAML souborů
- Soubory: `data/awards.yaml`, `data/awards-user.yaml`
- Ročníky lze přidávat/editovat jako objekty v YAML
- Každý ročník je nezávislý objekt s vlastními daty

### Funkce

- **Výběr ročníku**: Submenu s tlačítky pro přepínání mezi ročníky (2024, 2025, 2026)
- **Zobrazení vítězů**: Karty vítězů podle kategorií, nebo "Winners will be announced soon" pro aktuální ročník
- **Nominace**: Zobrazení prvních 8 nominujících, pak tlačítko "SHOW MORE"
- **Datumy**: Zobrazení důležitých dat v kartách
- **Články**: Grid s kartami článků
- **Banner reklamy**: Placeholder sekce pro reklamy
