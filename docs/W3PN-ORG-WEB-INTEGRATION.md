# Integrace w3pn-org-web a Portalu – Analýza a návrh

Tento dokument popisuje analýzu složky `w3pn-org-web` (Web organizace Web3Privacy) a navrhuje datovou a funkční strukturu pro koexistenci s CODEX-PORTAL.

---

## 1. Shrnutí aktuálního stavu

### 1.1 Portal (apps/web)

| Aspekt | Hodnota |
|--------|---------|
| Framework | Next.js 15 (App Router) |
| React | 19 |
| Styling | Tailwind CSS 4 |
| Build | `npm run build:web` |
| Deploy | Vercel – `apps/web` |
| Data | YAML/JSON na disku, API routes, explorer-data |
| Struktura | Monorepo: apps (web, explorer, stacks, library, glossary, ideas) + packages/portal-ui |

**Stávající stránka /about:** Minimalistická – pouze obrázek `about_title.png`. Tlačítko "ABOUT US" v hlavním menu vede na `/about` (interní route).

### 1.2 w3pn-org-web (Web organizace)

| Aspekt | Hodnota |
|--------|---------|
| Framework | Vite 5 |
| React | 18 |
| Styling | Plain CSS (global.css, CSS variables) |
| Build | `npm run build` → `dist/` |
| Data | JSON v `defaultContent.js` + localStorage (CMS) |
| Struktura | Samostatný SPA, není v npm workspaces |

**Funkce:**
- Landing page s sekcemi: hero, partners, intro, impact, activities, academy, ecosystem, testimonials, contribute, donation, newsletter, members, footer
- Admin panel na `/web3privacy-control-room-73f9a` (heslo + localStorage)
- GitHub API pro community avatars (`githubCommunity.js`)
- Newsletter do localStorage (volitelně remote API)

---

## 2. Rozdíly a potenciální konflikty

### 2.1 Technologický stack – rozdíly

| Aspekt | Portal | w3pn-org-web | Doporučení |
|--------|--------|--------------|------------|
| Framework | Next.js | Vite | Oba projekty mohou zůstat samostatné – důležitá je izolace |
| React verze | 19 | 18 | Pro sdílení komponent by bylo ideální sjednotit (React 18 je kompatibilní) |
| Styling | Tailwind | Plain CSS | **Klíčové:** Zachovat izolaci – styly se nemají prolínat |

### 2.2 Audit – kritické nálezy

1. **Figma MCP asset URLs**
   - V `defaultContent.js` jsou použity URL typu `https://www.figma.com/api/mcp/asset/...`
   - Tyto URL jsou pro Figma MCP (Model Context Protocol) během vývoje, **ne pro produkční hosting**
   - V produkci tyto obrázky pravděpodobně **nebudou fungovat**
   - **Akce:** Nahradit exportovanými assety (PNG/SVG) v `public/assets/` nebo `public/images/`

2. **Footer Portalu**
   - `Footer.tsx` odkazuje na `https://web3privacy.info/about/` (externí doména)
   - Pokud bude w3pn-org-web hostován jinde (např. `about.web3privacy.info`), je potřeba sjednotit URL

3. **Navigace – ABOUT US**
   - `nav-config.ts`: `aboutHref` = `/about` (unified) nebo `webBase + "/about"`
   - Není zatím napojeno na w3pn-org-web – Portal má vlastní `/about`

---

## 3. Návrh datové a funkční struktury

### 3.1 Principy

- **Izolace:** Každý projekt má vlastní CSS, data a build.
- **Samostatná spustitelnost:** w3pn-org-web může běžet bez Portalu.
- **Sdílená data přes API / statické soubory:** Oba projekty čtou ze společných zdrojů tam, kde dává smysl.

### 3.2 Sdílená vs. projektově specifická data

| Datový typ | Zdroj | Portal | w3pn-org-web |
|------------|-------|--------|---------------|
| **Events** | `data/events/` nebo remote | ✓ | ✓ (čte při dostupnosti) |
| **Projekty / Explorer** | explorer-data | ✓ | ✓ (odkazy v activities) |
| **Organizační obsah** | `w3pn-org-web/src/data/` | ✗ | ✓ |
| **Library, Glossary, Jobs** | apps/web/data | ✓ | ✗ |

**Návrh:** Vytvořit společnou datovou složku `data/org/` (nebo podobně) pro:
- základní info o organizaci (název, logo, sociální sítě),
- events (možnost číst z `data/events/`),
- odkazy na Explorer, Stacks, Academy, atd.

w3pn-org-web si bude moci načítat tato data přes:
- statický JSON na veřejné URL (pokud běží Portal),
- fallback na vlastní `defaultContent.js` při samostatném běhu.

### 3.3 Sjednocení názvosloví

**w3pn-org-web (defaultContent):**
```
site, nav, hero, partners, intro, impact, activities, academy,
ecosystem, testimonials, contribute, donation, newsletter, members, footer
```

**Portal (docs):**
```
explorer, stacks, library, glossary, jobs, events, ideas, academy, awards
```

**Návrh mapování pro odkazy mezi projekty:**

| w3pn-org-web sekce | Portal ekvivalent / URL |
|--------------------|-------------------------|
| activities.EXPLORER | `/` nebo `/explorer` |
| activities.ACADEMY | `/academy` |
| activities.EVENTS | `/events` |
| activities.PORTAL | `/` (hlavní portal) |
| activities.PERSONAL STACKS | `/stacks` |
| PRIVACY PORTAL (v nav) | base URL portalu |

Konfigurovatelné proměnné prostředí:
- `VITE_PORTAL_URL` – base URL Portalu (např. `https://explorer.web3privacy.com`)
- `VITE_ORG_URL` – base URL org webu (např. `https://web3privacy.info`)

### 3.4 Izolace CSS

**Základní pravidlo:** Žádné globální třídy z Portalu (Tailwind) nesmí ovlivnit w3pn-org-web a naopak.

**w3pn-org-web:**
- Všechny styly v `src/styles/global.css` používají prefixované třídy (`.landing-root`, `.top-nav`, `.hero`, …) – již splněno.
- Doporučení: Přidat wrapper třídu `.w3pn-org-root` na root element a případně scope celé styly pod ni (pomocí nesting v CSS).

**Portal:**
- Tailwind utility classes jsou omezené na komponenty v `apps/web`.
- Pokud by se v budoucnu org web renderoval uvnitř Portalu (iframe nebo vložená route), použít:
  - iframe (nejčistší izolace), nebo
  - CSS layers / Shadow DOM pro vnořený obsah.

**Při samostatném hostingu obou projektů** izolace automaticky platí – jiné domény, jiné HTML dokumenty.

---

## 4. Možné architektury koexistence

### Varianta A: Dva samostatné deploymenty (doporučeno pro start)

```
Portal:     https://explorer.web3privacy.com  (nebo portal.web3privacy.info)
Org web:    https://web3privacy.info          (nebo about.web3privacy.info)
```

- Portal: `npm run build:web` → deploy `apps/web`
- Org web: `cd w3pn-org-web && npm run build` → deploy `dist/`
- Odkaz "ABOUT US" v Portalu → externí odkaz na org web
- Odkaz "PRIVACY PORTAL" v org webu → externí odkaz na Portal

**Výhody:** Jednoduché, plná izolace, každý projekt se vyvíjí nezávisle.

### Varianta B: Org web jako Next.js route v Portalu

- Přesunout w3pn-org-web do `apps/web/src/app/about/` jako samostatnou route
- Použít iframe na externí org URL nebo převést Landing page do React komponent s vlastními styly (scoped)

**Nevýhody:** Složitější, riziko prolínání stylů, větší změna kódu.

### Varianta C: Monorepo – w3pn-org-web jako app

- Přidat `w3pn-org-web` do `apps/` jako `apps/org-web`
- Zachovat Vite build, přidat `npm run dev:org` a `npm run build:org` do root `package.json`
- Sdílet `data/` přes relativní cesty nebo build-time import

**Výhody:** Jednotné místo pro vývoj, společné skripty.  
**Nevýhody:** w3pn-org-web musí být přizpůsoben workspaces (package name, import paths).

---

## 5. Doporučené kroky (priorita)

### Fáze 1: Stabilizace w3pn-org-web (před integrací)

1. **Nahradit Figma MCP URLs** – viz `w3pn-org-web/docs/ASSETS-MANIFEST.md` a skript `w3pn-org-web/scripts/export-figma-assets.mjs`:
   - Ruční export z Figmy podle manifestu
   - Nebo `node scripts/export-figma-assets.mjs manifest` → pak `apply` po ručním exportu
2. **Konfigurovatelné URL** – přidat `VITE_PORTAL_URL`, `VITE_ORG_URL` do `.env` a použít v odkazech (např. PRIVACY PORTAL → Portal)
3. **Ověřit React 18** – zda není nutná upgrade na React 19 pro budoucí sdílení

### Fáze 2: Propojení s Portalem

4. **Odkaz ABOUT US** – vede na úvodní stránku org webu na **https://web3privacy.info**
   - Upravit `nav-config.ts`: `aboutHref` = `https://web3privacy.info` (nebo `VITE_ORG_URL` / env)
   - `/about` v Portalu může zůstat jako redirect na org web, nebo být odstraněna
5. **Footer** – již odkazuje na `https://web3privacy.info/about/` – sjednotit s tím, že org web je na kořenu `web3privacy.info` (úvodní stránka = org web)
6. **Hosting org webu** – na **web3privacy.info**, stejná adresářová struktura jako na disku (`w3pn-org-web/` → deploy `dist/` do rootu nebo do podcesty podle serveru)

### Fáze 3: Sdílená data (volitelné)

6. **data/org/** – společná složka pro org info, events (odkaz na `data/events/`)
7. **w3pn-org-web** – načítat events/projects z API Portalu, pokud dostupné; jinak fallback na lokální data

---

## 6. Přehled souborů w3pn-org-web

| Soubor | Účel |
|--------|------|
| `src/App.jsx` | Routing (admin vs. landing) |
| `src/main.jsx` | Entry point |
| `src/components/LandingPage.jsx` | Hlavní landing page (Homepage) |
| `src/components/AdminPanel.jsx` | CMS admin |
| `src/data/defaultContent.js` | Výchozí obsah + `sectionOrder` |
| `src/styles/global.css` | Všechny styly (izolované třídy) |
| `src/utils/cmsStorage.js` | localStorage pro CMS |
| `src/utils/githubCommunity.js` | GitHub API pro avatary |
| `public/assets/` | Statické assety |
| `vite.config.js` | Vite konfigurace |

---

## 7. Odpovědi na konkrétní požadavky

- **Samospustitelnost:** w3pn-org-web je již samospustitelný (`npm run build` + `npm run preview` nebo deploy `dist/`). Jediná externí závislost při běhu: GitHub API (pro community avatars) – má fallback na `communityAvatars` z defaultContent.
- **Vlastní adresář a data:** Ano – `w3pn-org-web/` obsahuje vlastní `src/data/`, `public/`, styly. Data jsou v `defaultContent.js` + localStorage.
- **Nespolehat na běžící Portal:** Aktuálně org web na Portal nespolehá. Pro budoucí propojení (např. events) je vhodné použít fallback na lokální data.
- ** oddělené CSS:** Ano – w3pn-org-web používá vlastní `global.css` bez Tailwindu. Žádné sdílené třídy s Portalem.
- **Homepage (About Us):** Landing page v `LandingPage.jsx` je ta, na kterou odkazuje "About Us" v hlavním menu Portalu → **https://web3privacy.info** (org web). Pro srovnání 1:1 se screenshotem (desktop + mobil) viz `w3pn-org-web/docs/ASSETS-MANIFEST.md` a vizuální audit v `LandingPage.jsx` a `global.css`.
