# Plán migrace Org webu na technologický stack Portálu

## 1. Shrnutí analýzy

### 1.1 Org web (`w3pn-org-web`) – současný stav

| Aspekt | Technologie / struktura |
|--------|--------------------------|
| **Build** | Vite 5, `@vitejs/plugin-react` |
| **Runtime** | React 18, react-router-dom 7, SPA (single entry `index.html` → `main.jsx` → `App.jsx`) |
| **Jazyk** | JavaScript (JSX), ES modules |
| **Styling** | Čisté CSS: `src/styles/global.css` (~5700+ řádků), `src/components/projects/detail/project-detail.css`. Import `@web3privacy/portal-ui/design-tokens.css` a vlastní tokeny/komponenty. **Žádné Tailwind.** |
| **Sdílené UI** | `@web3privacy/portal-ui`: `design-tokens.css`, `global-footer` + `global-footer.css` |
| **Routing** | React Router: `BrowserRouter` + `Routes`/`Route` v `App.jsx`. Podpora `basename` (např. `/org-web/`). |

**Stránky a funkce:**

- **`/`** – Landing (LandingPage): hero, partners, intro, impact, activities, contribute, members, footer.
- **`/about`** – AboutPage (defaultContent + footer).
- **`/projects`** – ProjectsPage: ProjectsOverview, ProjectsTechnologiesSection, karty projektů (w3pn-projects).
- **`/projects/:projectId`** – ProjectDetailPage: detail z `w3pn-projects-loader` (projects.json + details.json).
- **`/donate`** – DonatePage: DonateHero, MembershipSection, CryptoDonationSection, NftPlaceholderSection, GetInvolvedSection.
- **`/docs`**, **`/docs/*`** – DocsPage: sidebar + manifest z `/data/docs/`, načítání MD/MDX po síti, ReactMarkdown, breadcrumbs, „On this page“, edit link.
- **`/events`** – EventsPage: EventsHero, filtry (country), EventsUpcoming, EventsFeaturedBlock, EventsPast; data z `public/events.json` (generované z Portal YAML).
- **`/events/admin`** – EventsAdminPage (admin rozhraní).
- **`/events/:eventId`** – EventDetailPage: detail z `portalApi.getEventDetail()` (events.json + details).
- **`/resources`** – ResourcesPage: kategorie, filtry, ResourceCard; data z `content.resources` (defaultContent + admin).
- **Admin panel** – Speciální cesta `defaultContent.site.adminPath` (např. `/web3privacy-control-room-73f9a`): login, editace sekcí JSON (defaultContent), ResourcesAdmin, export/import, upload obrázků. Stav v `localStorage` (cmsStorage).

**Data a zdroje:**

- **defaultContent** – `src/data/defaultContent.js` (výchozí copy/config). Runtime merge s `loadContent()` (localStorage) a volitelným YAML (footer, activities).
- **Footer** – `loadFooterFromYaml()` → fetch `/data/footer.yaml` (YAML).
- **Activities** – `loadActivitiesYaml()` → fetch `/data/activities.yaml` (YAML).
- **Docs** – `public/data/docs/`: `manifest.json`, `sidebar.json`, MD/MDX soubory + `assets/`. Načítáno fetch v DocsPage. Obsah stahován skriptem `scripts/fetch-docs-from-github.mjs` z repo `web3privacy/docs`.
- **Events** – `public/events.json` (build-time generace z `apps/web/data/events` skriptem `w3pn-org-web/scripts/generate-events-from-portal.js`). Runtime: `portalApi.js` čte tento JSON (+ placeholder pro test).
- **W3PN projekty** – `src/data/w3pn-projects-loader.js` → `projects.json`, `details.json` (statická data v repu).
- **Community** – `getGitHubCommunityMembers(280)` (fetch na GitHub API), předáváno do footeru.

**Skripty:**

- `node scripts/fetch-docs-from-github.mjs` (z rootu) – stáhne docs do `w3pn-org-web/public/data/docs/`.
- `node w3pn-org-web/scripts/generate-events-from-portal.js` – vygeneruje `w3pn-org-web/public/events.json` z `apps/web/data/events`.

---

### 1.2 Portál (`apps/web`) – cílový stack

| Aspekt | Technologie / struktura |
|--------|--------------------------|
| **Build** | Next.js 15 (App Router) |
| **Runtime** | React 19, TypeScript |
| **Styling** | Tailwind 4, `@web3privacy/portal-ui/globals.css`, komponenty s `className` |
| **Sdílené UI** | `@web3privacy/portal-ui` (global-footer, design tokens), Radix, Framer Motion, nuqs, atd. |
| **Routing** | File-based: `src/app/**/page.tsx`, dynamické segmenty `[id]`, `[[...slug]]` |

**Existující stránky (výběr):** `/`, `/explorer`, `/events`, `/events/[id]`, `/donate`, `/about`, `/news`, `/awards`, `/people`, `/academy`, `/glossary`, `/ideas`, `/library`, `/stacks`, `/project/[id]`, `/categories`, `/jobs`, admin stránky (events, news, awards, academy, jobs), API routes (`/api/events`, `/api/projects`, atd.).

**Důležité:** Portál už má `/about` a `/donate` – obsah a design se liší od org webu. Org stránky musí buď nahradit, nebo koexistovat pod jinou cestou (např. `/org/about`, `/org/donate`), podle produktového rozhodnutí.

---

## 2. Cíle migrace

1. **Sjednotit stack:** Jedna aplikace na Next.js 15 + React 19 + TypeScript (jako portal).
2. **Zachovat všechny funkce** všech stránek org webu (landing, about, projects, donate, docs, events, resources, admin panel).
3. **Neměnit CSS styly** org webu – stávající `global.css` a `project-detail.css` zůstanou vizuálně stejné (pouze nutné začlenění do Next bez konfliktů s Tailwind).
4. **Maximální kompatibilita** s portálem (sdílený layout, navigace, footer, build, deployment).
5. **Příprava na budoucnost:** Jedna entita připravená na rozdělení do samoobslužných služeb (např. oddělené domény / služby později).

---

## 3. Strategie migrace (doporučená)

### 3.1 Varianta A: Org pod prefixem `/org` (doporučeno)

- Všechny org stránky budou pod cestou `/org` (např. `/org`, `/org/about`, `/org/projects`, `/org/docs`, …).
- Výhody: žádný konflikt s existujícími cestami portálu (`/about`, `/donate`, `/events` zůstávají portalové). Jasné oddělení „org“ vs „portal“.
- Navigace: v portálu odkaz „Web3Privacy Now“ / „Org“ → `/org`; v org webu odkaz na Explorer/Portal → stávající URL.

### 3.2 Varianta B: Org na root s přepsáním některých cest

- Landing org na `/`, org `/about` a `/donate` nahradí nebo sloučí s portalovými.
- Vyžaduje pečlivé sloučení obsahu a rozhodnutí, která verze „about“/„donate“ zůstane na `/about` a `/donate`. Složitější a rizikovější pro zachování obou verzí.

**V plánu níže předpokládám variantu A (`/org`).**

---

## 4. Detailní kroky migrace

### Fáze 0: Příprava (bez změny chování)

1. **Umístění dat a assetů pro Next**
   - Zkopírovat nebo přesměrovat výstupy skriptů tak, aby Next mohl servírovat stejná data:
     - **Docs:** Buď ponechat `w3pn-org-web/public/data/docs/` a v Next přidat servírování z `public` (např. zkopírovat do `apps/web/public/org/data/docs/`), nebo měnit `fetch-docs-from-github.mjs` tak, aby zapisoval do `apps/web/public/org/data/docs/`. Cíl: v Next dostupné např. `/org/data/docs/manifest.json`, `/org/data/docs/sidebar.json`, `/org/data/docs/.../file.md`.
     - **Events:** `generate-events-from-portal.js` už čte z `apps/web/data/events`. Upravit výstup: místo `w3pn-org-web/public/events.json` zapisovat např. `apps/web/public/org/events.json`. V Next pak např. `/org/events.json`.
     - **Footer/activities YAML:** Zkopírovat `w3pn-org-web/public/data/footer.yaml` a `activities.yaml` (pokud existují) do `apps/web/public/org/data/` a servírovat pod `/org/data/`.
   - **W3PN projekty:** Přesunout `w3pn-org-web/src/data/w3pn-projects/` (projects.json, details.json) a `w3pn-projects-loader.js` do `apps/web` (např. `apps/web/data/org/w3pn-projects/` nebo `lib/org/`). Loader převést na TS modul, který čte tato data (build-time nebo z `public`).
   - **defaultContent:** Převést `defaultContent.js` na JSON nebo TS konstantu v `apps/web` (např. `apps/web/data/org/defaultContent.json` nebo `config/org-default-content.ts`). Admin bude měnit kopii v localStorage nebo později přes API.

2. **Skripty v monorepu**
   - Upravit `package.json` (root nebo apps/web): `docs:fetch` aby zapisoval do `apps/web/public/org/data/docs/` (a případně aktualizovat cestu v `fetch-docs-from-github.mjs`).
   - Upravit `generate-events-from-portal.js`: výstup do `apps/web/public/org/events.json`. V `prebuild`/`build` apps/web volat tyto skripty (nebo CI), aby před buildem byly docs a events aktuální.

3. **portal-ui a React 19**
   - Org dnes používá React 18; po sloučení do Next bude používat React 19 z portálu. Ověřit, že `@web3privacy/portal-ui` (global-footer, design-tokens) funguje s React 19. Pokud má package peer „react 19“, žádná změna v org kódu kromě upgrade.

---

### Fáze 1: Layout a styly org webu v Next

4. **Layout pro `/org`**
   - Vytvořit `apps/web/src/app/org/layout.tsx`.
   - Cíl: na cestách pod `/org` používat **org header** (OrgNavHeader) a **org footer** (GlobalFooter s variantou „org“), ne portal nav/footer. Layout bude renderovat např. `<OrgNavHeader />`, `{children}`, `<GlobalFooter config={...} variant="org" />`.
   - Načítání konfigurace footeru: buď z defaultContent (přesunutého do app) + runtime merge s YAML z `/org/data/footer.yaml` (fetch na klientu), nebo předpřipravený config v server komponentě. Community members pro footer: stávající `getGitHubCommunityMembers` přesunout do `apps/web` (lib) a volat z layoutu nebo klienta.

5. **CSS org webu beze změny vzhledu**
   - **Kritické:** Neměnit stávající CSS pravidla a třídy v `global.css` a `project-detail.css`.
   - Možnosti:
     - **5a)** Do `apps/web/src/app/org/layout.tsx` přidat import pouze pro org strom:  
       `import '@/styles/org/global.css'` a `import '@/styles/org/project-detail.css'`.  
       Zkopírovat `w3pn-org-web/src/styles/global.css` → `apps/web/src/styles/org/global.css` a `w3pn-org-web/src/components/projects/detail/project-detail.css` → `apps/web/src/styles/org/project-detail.css`. Upravit v `global.css` pouze cestu k `@web3privacy/portal-ui/design-tokens.css` (zůstane stejná). Aby se styly aplikovaly jen na org stránky, obalit obsah layoutu do wrapperu s třídou např. `org-web-root` a v `global.css` (org) všechny selektory buď ponechat globální (pokud nemají konflikt s portalem), nebo předřadit `.org-web-root` (např. `.org-web-root .page-content-wrap { ... }`). Konflikty s Tailwind řešit pouze tam, kde portal a org sdílí stejnou stránku (u varianty A se org stránky nenačítají v portal layoutu, takže stačí zajistit, že org layout neimportuje portal globals nadbytečně).
   - **5b)** Pokud by Tailwind z layoutu aplikoval na org děti: použít v org layoutu pouze vlastní globals (org global.css) a nepoužívat v org komponentách Tailwind třídy pro „obalové“ prvky, které už má global.css. Ideálně držet org stránky čistě na stávajících třídách z global.css.
   - Doporučení: 5a s wrapperem `.org-web-root` a zkopírovanými soubory bez změny pravidel; pouze doplnit před selektory `.org-web-root` tam, kde hrozí konflikt (např. `body` v org layoutu může mít třídu `org-body` a v org global.css upravit jen `body.org-body` / `html:has(.org-web-root)` podle potřeby). Zbytek CSS nechat jak je.

6. **Assetové cesty**
   - Org používá např. `/assets/nav-logo.svg`, `/assets/hero-bg.png`. Přesunout `w3pn-org-web/public/assets/` do `apps/web/public/org/assets/` a v defaultContent / komponentách měnit cesty na `/org/assets/...` (nebo ponechat pod `/assets/` pokud portál nemá kolize). Preferovat `/org/assets/` pro čisté oddělení.

---

### Fáze 2: Převod stránek a rout na App Router

7. **Mapování cest (variant A)**

   - ` /org` → `apps/web/src/app/org/page.tsx` (Landing).
   - ` /org/about` → `apps/web/src/app/org/about/page.tsx`.
   - ` /org/projects` → `apps/web/src/app/org/projects/page.tsx`.
   - ` /org/projects/[projectId]` → `apps/web/src/app/org/projects/[projectId]/page.tsx`.
   - ` /org/donate` → `apps/web/src/app/org/donate/page.tsx`.
   - ` /org/docs` a `/org/docs/[[...slug]]` → `apps/web/src/app/org/docs/[[...slug]]/page.tsx` (jeden dynamický segment pro všechny doc stránky).
   - ` /org/events` → `apps/web/src/app/org/events/page.tsx`.
   - ` /org/events/admin` → `apps/web/src/app/org/events/admin/page.tsx`.
   - ` /org/events/[eventId]` → `apps/web/src/app/org/events/[eventId]/page.tsx`.
   - ` /org/resources` → `apps/web/src/app/org/resources/page.tsx`.
   - Admin: ` /org/web3privacy-control-room-73f9a` (nebo konfigurovatelná cesta) → `apps/web/src/app/org/admin/[[...path]]/page.tsx` nebo dynamická route podle `defaultContent.site.adminPath` (např. segment `web3privacy-control-room-73f9a`). V Next lze mít dynamickou složku `[adminSlug]` pouze pro tento path a uvnitř renderovat AdminPanel.

8. **Komponenty**
   - Přesunout komponenty z `w3pn-org-web/src/components/` a `w3pn-org-web/src/pages/` do `apps/web/src/components/org/` a `apps/web/src/app/org/...` (stránky jako komponenty v `components/org` a v page.tsx jen import a render).
   - Nahradit `react-router-dom`: `useNavigate` → `useRouter` z `next/navigation`, `Link` → `next/link`, `useParams` → `useParams` z `next/navigation`, `useLocation` → `usePathname` + `useSearchParams`. Odstranit `BrowserRouter`/`Routes`/`Route` – routing řeší App Router.

9. **Data v komponentách**
   - **defaultContent:** Načítat z přesunutého modulu/JSON. Pro runtime úpravy (admin) ponechat klient-side merge s localStorage ve stejném tvaru jako dnes (cmsStorage) a předávat „content“ do stránek (provider nebo context pro org).
   - **Footer/activities YAML:** V layoutu nebo v příslušných stránkách fetch na `/org/data/footer.yaml` a `/org/data/activities.yaml` (v Next lze fetch z `process.cwd()/public/org/data/` na serveru, nebo z klienta na stejné URL). Merge do content objektu jako dnes.
   - **Docs:** Stránka `/org/docs/[[...slug]]`: na serveru nebo klientu načíst `sidebar.json` a `manifest.json` z `/org/data/docs/`, podle slug načíst příslušný MD/MDX soubor (fetch z `/org/data/docs/...` nebo z filesystému). ReactMarkdown a komponenty (DocContent, DocsLayout, DocsNav, OnThisPage) převést na TSX a nechat logiku stejnou. Obrázky: resolve na `/org/data/docs/...` jako dnes.
   - **Events:** `getEvents` / `getEventDetail`: místo `public/events.json` volat fetch na `/org/events.json` (nebo API route `GET /api/org/events` která čte z `public/org/events.json`). Zachovat placeholder event logiku pokud je potřeba.
   - **W3PN projekty:** Loader volat z `apps/web` (data v repu). `getProject`, `getProjectDetail`, `getProjectsByCategory` – stejné API, jiný zdroj souborů.
   - **Community:** `getGitHubCommunityMembers` v lib, volat z org layoutu nebo footer komponenty (klient).

10. **Admin panel**
    - Přesunout `AdminPanel`, `LoginForm`, `ResourcesAdmin` do `apps/web`. Admin route: buď fixní `/org/admin` s kontrolou hesla (env např. `ORG_CMS_PASSWORD`), nebo zachovat „secret path“ přes dynamickou route (např. `/org/[secretPath]` kde `secretPath === adminPath`). Uložení: stále localStorage (cmsStorage) s klíčem např. `w3pn_landing_content_v1`, aby bylo možné po migraci zachovat kompatibilitu. Export/import a upload obrázků ponechat.

11. **TypeScript**
    - Převést přenášené soubory na TypeScript (.tsx/.ts). Typy pro defaultContent, footer config, events, docs manifest/sidebar doplnit podle stávající struktury. Není nutné typovat každý detail najednou – lze začít s `any` nebo minimálními typy a postupně zpřesňovat.

12. **Odstranění závislosti na React Router a Vite**
    - Po převodu všech stránek a ověření: v apps/web žádný import z `react-router-dom`. Build org už nebude Vite; jediný build bude `next build`.

---

### Fáze 3: Integrace s portálem a navigace

13. **Navigace mezi portálem a org**
    - V portal nav (PortalNav) přidat položku typu „Web3Privacy Now“ / „Org“ → `/org`. V org headeru ponechat odkaz na Explorer/Portal (externí nebo `/explorer` podle aktuálního nastavení).
    - Footer: portál už používá `GlobalFooterWrapper` s konfigurací; org layout používá vlastní `GlobalFooter` s `variant="org"` a config z defaultContent + YAML. Žádná změna v portálovém footeru kromě případného odkazu na `/org`.

14. **Base URL a odkazy**
    - Všechny interní odkazy v org komponentách musí vést na `/org/...` (ne `/about`, `/docs`). Prohlédnout všechny `<a href>`, `<Link>` a `useRouter().push` v přenesených komponentách a doplnit prefix `/org`.

15. **Metadata a titulky**
    - V každé `page.tsx` pod `/org` nastavit `export const metadata` (title, description) podle toho, co org web dnes mění v `document.title` (useEffect). Např. `metadata = { title: 'Projects | Web3Privacy Now' }` pro projects stránku.

---

### Fáze 4: Ověření a úklid

16. **Checklist funkcí (bez změny CSS)**
    - [ ] Landing: hero, partners marquee, intro, impact, activities, contribute, members, footer.
    - [ ] About: obsah + footer.
    - [ ] Projects: seznam, kategorie, karty, odkazy na detail.
    - [ ] Project detail: všechny bloky (hero, features, team, roadmap, atd.), styly z project-detail.css.
    - [ ] Donate: všechny sekce (membership, crypto, NFT placeholder, get involved).
    - [ ] Docs: sidebar, manifest, načítání MD/MDX, breadcrumbs, On this page, edit link, obrázky.
    - [ ] Events: seznam, filtry, upcoming/past, featured, odkaz na admin.
    - [ ] Events admin: funkce podle stávajícího EventsAdminPage.
    - [ ] Event detail: data z events.json + details.
    - [ ] Resources: kategorie, filtry, karty, admin úpravy přes content.
    - [ ] Admin panel: login, sekce, editor JSON, ResourcesAdmin, export/import, upload obrázku, reset.

17. **CSS**
    - Vizuálně srovnat každou stránku s aktuálním org webem (např. side-by-side). Žádné úpravy designu – pouze ověřit, že stejné třídy a soubory vedou ke stejnému vzhledu.

18. **Skripty a CI**
    - Před buildem apps/web spouštět `docs:fetch` a `generate-events-from-portal` (nebo ekvivalent), aby `public/org/data/docs/` a `public/org/events.json` byly aktuální. V `package.json` apps/web přidat např. `prebuild`: `npm run docs:fetch && node ../../w3pn-org-web/scripts/generate-events-from-portal.js` (cesty upravit podle nového umístění skriptů).

19. **Odstranění w3pn-org-web jako samostatné aplikace**
    - Až je vše přeneseno a otestováno: odstranit složku `w3pn-org-web` (nebo ji ponechat jen jako archiv a přesměrovat dokumentaci na nové cesty). Root `package.json` odstranit workspaces odkaz na w3pn-org-web a skripty typu `dev:org` pokud byly. Dokumentace (README, docs) aktualizovat na „Org je součástí Portálu na `/org`“.

---

## 5. Rizika a zmírnění

| Riziko | Zmírnění |
|--------|----------|
| Konflikt CSS (Tailwind vs org global.css) | Org layout importuje pouze org CSS; obal `.org-web-root`; nepoužívat Tailwind v org komponentách pro layout, který už definuje global.css. |
| Rozbití docs (obrázky, odkazy) | Zachovat stejnou strukturu složek a URL (`/org/data/docs/...`). Testovat několik doc stránek včetně obrázků a „Portal & Org Web“ stránek. |
| Admin path a bezpečnost | Heslo z env; secret path zůstane „security by obscurity“ jako dnes, nebo přejít na `/org/admin` s proper auth. |
| React 19 vs stávající kód | Ověřit portal-ui a všechny přenášené komponenty pod React 19; opravit případné deprecation warnings. |
| Změna URL (např. z `/donate` na `/org/donate`) | 301 redirecty z původních URL na nové `/org/...` (na úrovni Next nebo reverse proxy), pokud jsou staré URL veřejně používané. |

---

## 6. Přechod na samoobslužné služby (později)

Po sjednocení do jedné Next aplikace lze v budoucnu:

- **Rozdělení domén:** Např. org na `web3privacy.info`, portal na `explorer.web3privacy.com`. Next může podle hostu servírovat jiný layout nebo přesměrovat; nebo oddělit deploy (org = jedna Next app, portal = druhá) s sdíleným kódem (monorepo).
- **Micro-frontend / samostatný build:** Org jako samostatný Next projekt v monorepu (např. `apps/org-web`) s vlastním buildem a deployem, sdílející `packages/portal-ui` a společné lib. Pak by migrace znamenala převod w3pn-org-web do `apps/org-web` na Next s tímto plánem (stejné kroky, jen jiná app složka).

Tento plán zachovává všechny funkce a styly org webu a sjednocuje stack s portálem; rozdělení na služby zůstává otevřené bez nutnosti měnit znovu logiku stránek.
