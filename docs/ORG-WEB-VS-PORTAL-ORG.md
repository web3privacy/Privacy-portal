# w3pn-org-web vs Portal /org – stav a možnosti

## Jak to je teď

### Dvě různé věci

| | **Portal sekce `/org`** (apps/web) | **Standalone w3pn-org-web** (kořen složka) |
|---|-------------------------------------|---------------------------------------------|
| **Kde běží** | Uvnitř Portalu na `/org`, `/org/about`, `/org/projects`, … | Samostatná Vite SPA, typicky nasazená na **web3privacy.info** |
| **Stack** | Next.js 15, React 19, Tailwind, portal-ui | Vite 5, React 18, vlastní CSS (global.css) |
| **Obsah** | Org landing (OrgLandingContent), projekty, docs, events, donate, about, resources | Stejné sekce + **plná landing page** (hero, partners, impact, testimonials, …) + **Admin panel (CMS)** s localStorage |
| **Navigace v Portalu** | Když jste na Portalu (unified), odkaz „ABOUT US“ vede na **/org** (vnitřní route). | Když jste na standalone Explorer/Stacks, „ABOUT US“ vede na **orgUrl** = https://web3privacy.info |

**Shrnutí:** Obsah org (projekty, docs, donate, events…) je **zapracovaný v apps/web** pod `/org`. Sekce `/org` používá stejná data (`apps/web/src/data/org/w3pn-projects`, `public/org/`) a vlastní komponenty (OrgLandingContent, …).  

**w3pn-org-web** není „jen ta samá složka v apps“ – je to **druhá, samostatná aplikace** (jiný build, jiný design, CMS, vlastní deploy). Slouží hlavně jako **vlastní web organizace na web3privacy.info**.

---

## Když chcete „se zbavit“ složky w3pn-org-web

Možné přístupy:

---

### Varianta A: Nechat obojí (doporučeno, pokud potřebujete web3privacy.info)

- **Portal** = jeden produkt (explorer.web3privacy.com nebo podobně) s `/org` pro About/Projects/Docs/Donate/Events.
- **w3pn-org-web** = druhý produkt na **web3privacy.info** (landing, CMS, vlastní vzhled).

V repozitáři zůstane složka `w3pn-org-web`. Odkaz „ABOUT US“ z Portalu už vede na `/org`, takže na Portalu se w3pn-org-web přímo nepotřebuje. Složka je potřeba jen pro build a deploy **web3privacy.info**.

**Výhody:** Žádná velká změna, dva weby podle potřeby.  
**Nevýhody:** Dva zdroje pravdy pro podobný obsah (projekty, docs, events), nutnost udržovat data ve sync (w3pn-projects, events, docs).

---

### Varianta B: Zrušit standalone org web – pouze Portal `/org`

Cíl: **jedna aplikace** (Portal), žádná složka `w3pn-org-web`.

**Kroky:**

1. **Deploy / doména**  
   - web3privacy.info buď přesměrovat na Portal (např. `https://explorer.web3privacy.com/org`),  
   - nebo nasadit Portal tak, aby web3privacy.info byl jeho základní URL a `/org` zůstala hlavní „about“ sekce.

2. **Navigace**  
   - V Portalu už „ABOUT US“ = `/org`.  
   - Pro standalone Explorer/Stacks změnit `orgUrl` v `packages/portal-ui` (nebo v env) na URL Portalu + `/org` (např. `https://explorer.web3privacy.com/org`), aby neodkazovaly na starý web.

3. **Data a skripty**  
   - **Org projekty:** zdroj pravdy zůstane `apps/web/src/data/org/w3pn-projects/` (w3pn-org-web už nepotřebujete).  
   - **Events:** skript `w3pn-org-web/scripts/generate-events-from-portal.js` přesunout např. do `scripts/generate-org-events.mjs` (nebo do apps/web), aby z `apps/web/data/events` generoval jen `apps/web/public/org/events.json`. Volat ho v `prebuild` Portalu nebo z root skriptů.  
   - **Docs:** `scripts/fetch-docs-from-github.mjs` už píše do `apps/web/public/org/data/docs` – stačí ho dál spouštět (např. před buildem nebo CI).

4. **Smazání w3pn-org-web**  
   - Po přesměrování web3privacy.info a úpravě skriptů lze smazat celou složku `w3pn-org-web/`.

**Co ztratíte:**  
- Samostatnou landing stránku s vlastním designem (hero, partners, testimonials atd. z w3pn-org-web).  
- Admin panel (CMS) z w3pn-org-web; úpravy obsahu pak jen přes data v repu / YAML / Portal admin, pokud nějaký je.

**Výhody:** Jeden repozitář bez w3pn-org-web, jeden build, jedna datová cesta pro org.  
**Nevýhody:** Nutnost doplnit v Portalu cokoliv, co dnes dělá jen w3pn-org-web (např. plná landing, CMS), nebo to přijmout jako záměrné zjednodušení.

---

### Varianta C: Přesunout w3pn-org-web do monorepa (nesmazat, jen přejmenovat/zkusit)

- Přesunout `w3pn-org-web` do `apps/org-web` (nebo `apps/landing`) a zapojit do npm workspaces.  
- Build zůstane Vite, výstup např. `apps/org-web/dist/`.  
- Odkaz „ABOUT US“ a deploy web3privacy.info se nemění.

**Výhody:** Jednotná struktura `apps/*`, jeden `npm install` v kořeni.  
**Nevýhody:** Složka „org web“ zůstává – nezbavíte se jí, jen ji přemístíte. Pořád dvě aplikace (Portal + org web).

---

## Doporučení

- **Potřebujete samostatný web na web3privacy.info (landing + případně CMS)?**  
  → **Varianta A** – nechat w3pn-org-web a nic nemazat.

- **Chcete jen jeden web (Portal) a web3privacy.info má jen přesměrovat na Portal /org?**  
  → **Varianta B** – přesunout generování events/docs do skriptů u Portalu a pak smazat složku `w3pn-org-web`.

- **Chcete jen uklidit strukturu, ale oba weby zachovat?**  
  → **Varianta C** – přesun do `apps/org-web`.

---

## Rychlý přehled závislostí (kdybyste mazali w3pn-org-web)

| Co | Kde to je / kdo to používá |
|----|----------------------------|
| **Org projekty (projects.json, details.json)** | Portal už používá **apps/web/src/data/org/w3pn-projects/** – po odstranění w3pn-org-web žádná změna. |
| **events.json** | Generuje `w3pn-org-web/scripts/generate-events-from-portal.js`; píše do `w3pn-org-web/public/events.json` a **apps/web/public/org/events.json**. Před mazáním w3pn-org-web přesunout skript a volat ho tak, aby plnil jen výstup do `apps/web/public/org/events.json`. |
| **Org docs** | `scripts/fetch-docs-from-github.mjs` cílí na **apps/web/public/org/data/docs** – nezávisí na w3pn-org-web. |
| **Odkazy na web3privacy.info** | V kódu Portalu (defaultContent, details.json, komponenty) jsou odkazy na web3privacy.info; po Variantě B je vhodné mít web3privacy.info → redirect na Portal /org, aby tyto odkazy dávaly smysl. |

Pokud řeknete, kterou variantu chcete (A/B/C), můžeme navrhnout konkrétní úpravy souborů a skriptů krok za krokem.
