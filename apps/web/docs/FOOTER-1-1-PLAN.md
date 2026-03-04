# Plán: Patička portálu 1:1 jako na org-webu

## 1. Analýza současné patičky na org-webu

### 1.1 Komponenta a layout

- **Komponenta**: `GlobalFooter` z `@web3privacy/portal-ui` (sdílená).
- **Styly**: `global-footer.css` z portal-ui – stejné třídy (`.w3pn-global-footer`, `.contribute-wrap`, `.donation-card`, `.newsletter-row`, `.members-section`, `.site-footer`).
- **Layout** (shora dolů):
  1. **Contribute** – levý blok (obrázek + text + CTA), pod ním mřížka avatarů contributorů (až 60), vpravo/dole **Donation** karta a **Newsletter** formulář.
  2. **Members** – sekce „Our members“ s mřížkou log (název, handle, obrázek) + volitelný CTA.
  3. **Footer bar** – logo, 3 sloupce odkazů (nebo siteMap: org / portal / legal), sociální ikony, legal text.

### 1.2 Zdroj dat na org-webu

- **Konfigurace**: `getGlobalFooterConfig(content)` z `utils/globalFooterConfig.js` – bere `content` (defaultContent + YAML overlay) a vrací `{ contribute, donation, newsletter, members, footer }`.
- **Contributoři**: `getGitHubCommunityMembers(280)` z `utils/githubCommunity.js` – fetch na GitHub API (org members + repo contributors + stargazers), cache v localStorage, výsledek se předává jako `communityMembers` do `GlobalFooter`. Bez něj se použijí `contribute.communityAvatars` z configu (statické obrázky).
- **Newsletter**: na LandingPage je `onNewsletterSubmit` – ukládá e-mail do localStorage a volitelně POST na `newsletter.actionUrl`.

### 1.3 Konkrétní struktura configu (org-web defaultContent)

- **contribute**: `eyeImage`, `roundLogoImage`, `title`, `text`, `ctaText`, `ctaLink`, `communityAvatars` (pole URL nebo `{ image, name, href }`).
- **donation**: `title`, `text`, `ctaText`, `ctaLink`, `backgroundImage`.
- **newsletter**: `text`, `placeholder`, `buttonText`, `actionUrl`.
- **members**: `title`, `logos` (pole `{ name, handle, image }`), `ctaText`, `ctaLink`.
- **footer**: `logo`, `linksColumn1/2/3` nebo `siteMap` (org, portal, legal), `social` (pole `{ label, icon, href }`), `legal` (řetězec).

### 1.4 Rozdíl oproti portálu

- Portál má v `portalGlobalFooterConfig` jen zjednodušenou konfiguraci: contribute (title, text, cta) + footer (logo, jeden odkaz). Chybí: donation, newsletter, members, plné sloupce odkazů, sociální ikony, legal, obrázky (eyeImage, donation bg, member logos).
- Portál neposílá `communityMembers` → v mřížce se zobrazí jen `contribute.communityAvatars`; ty v aktuálním configu chybí, takže mřížka může být prázdná.

---

## 2. Cíl: stejný obsah a layout na portálu

- Stejná komponenta: `GlobalFooter` + `global-footer.css` (už použité).
- Stejná struktura configu: všechny sekce (contribute včetně obrázků, donation, newsletter, members, footer s plnými odkazy a sociálními ikonami).
- Stejná data: odpovídající texty, odkazy, obrázky a volitelně contributoři z GitHubu.

---

## 3. Adaptér a zdroj dat

### 3.1 Možnosti zdroje dat

| Možnost | Popis | Výhody | Nevýhody |
|--------|------|--------|---------|
| **A) Kopie configu v portálu** | Do `global-footer-config.ts` (nebo YAML/JSON) zkopírovat ekvivalent org-web defaultContent pro footer. | Jednoduché, žádná závislost na org-webu. | Duplicita; při změně na org-webu je třeba měnit i portál. |
| **B) Sdílený modul** | Config (nebo celý defaultContent) v monorepu sdílený (např. `packages/content` nebo z org-webu exportovaný). Portál importuje a volá adaptér `getGlobalFooterConfig(content)`. | Jedna pravda, konzistence. | Vyžaduje sdílený balíček nebo přesun souborů. |
| **C) API / statický JSON** | Org-web (nebo CMS) vystaví endpoint / statický JSON s obsahem patičky. Portál při buildu nebo za běhu načte a zmapuje na `GlobalFooterConfig`. | Aktualizace na jednom místě. | Závislost na síti / backendu. |

Doporučení pro rychlou 1:1 replikaci: **A)** – rozšířit `apps/web/src/config/global-footer-config.ts` na plný config (všechny sekce) podle org-webu. Později lze refaktorovat na B) nebo C).

### 3.2 Adaptér (mapování na GlobalFooterConfig)

- Typ `GlobalFooterConfig` z portal-ui už odpovídá org-webu.
- **Adaptér** = jedna funkce (nebo objekt), která:
  - bere „surový“ obsah (objekt ve tvaru org-web defaultContent nebo z API),
  - vrací `GlobalFooterConfig` (contribute, donation, newsletter, members, footer).
- Na portálu: buď přímo exportovat `portalGlobalFooterConfig` jako kompletní objekt, nebo `getPortalFooterConfig(rawContent?)` která použije výchozí data a případně je přepíše z argumentu (např. z API).

### 3.3 Cesty k obrázkům (assets)

- Org-web: `/assets/...` (např. `/assets/contribute-eye-now.png`, `/assets/nav-logo.svg`, `/assets/donation-banner-bg.png`, `/assets/members/dyne.png`).
- Portál: může používat:
  - **Stejné relativní cesty** – pokud portál servíruje stejné assety pod `/assets/...` (např. zkopírovat nebo symlink do `apps/web/public/assets`).
  - **Absolutní URL** – např. `https://web3privacy.info/assets/...` nebo CDN; config pak obsahuje plné URL.
- V plánu: v configu použít buď `/assets/...` a doplnit assety do `public/assets`, nebo základní URL z env a skládat cesty (např. `process.env.NEXT_PUBLIC_ORG_WEB_URL + '/assets/...'`).

---

## 4. Kroky implementace (portál, React)

### Krok 1: Rozšířit `portalGlobalFooterConfig` na plný config

- Do `apps/web/src/config/global-footer-config.ts` doplnit:
  - **contribute**: `eyeImage`, `roundLogoImage` (volitelně), `title`, `text`, `ctaText`, `ctaLink`, `communityAvatars` (pole URL nebo objektů pro fallback, když nebudou posíláni `communityMembers`).
  - **donation**: `title`, `text`, `ctaText`, `ctaLink`, `backgroundImage`.
  - **newsletter**: `text`, `placeholder`, `buttonText`, `actionUrl`.
  - **members**: `title`, `logos` (name, handle, image), `ctaText`, `ctaLink`.
  - **footer**: `logo`, `linksColumn1`, `linksColumn2`, `linksColumn3` (nebo `siteMap`), `social`, `legal`.
- Texty a odkazy z org-web defaultContent zkopírovat / přizpůsobit (např. odkazy na explorer.web3privacy.com, web3privacy.info, forum, Discord, atd.).
- Asset cesty: rozhodnout mezi `/assets/...` v portálu nebo absolutními URL; doplnit do configu.

### Krok 2: Assety na portálu

- Buď zkopírovat potřebné obrázky z org-webu do `apps/web/public/assets` (contribute eye, donation bg, member logos, logo pro footer).
- Nebo nastavit `NEXT_PUBLIC_ORG_WEB_URL` (nebo podobně) a v configu používat `${baseUrl}/assets/...`.

### Krok 3: Volitelně – contributoři z GitHubu (portal)

- Převést logiku `getGitHubCommunityMembers(limit)` do TypeScriptu v portálu (nebo volat vlastní API route, která to dělá na serveru).
- V root layoutu (nebo v client komponentě obalující footer): fetch contributorů, předat je do `GlobalFooter` jako `communityMembers`.
- Protože GlobalFooter je už „use client“, lze fetch volat v `useEffect` v layoutu nebo v tenké client wrapper komponentě, která předá `config` + `communityMembers` do `GlobalFooter`.

### Krok 4: Newsletter na portálu

- Pokud má být chování jako na org-webu: implementovat `onNewsletterSubmit` (např. uložení do localStorage + volitelně POST na `config.newsletter.actionUrl`).
- Root layout je server component; předat callback lze přes client wrapper: např. `<GlobalFooterWrapper config={...} />`, která uvnitř drží state a předá `onNewsletterSubmit` a `newsletterState` / `newsletterMessage` do `GlobalFooter`.

### Krok 5: Ověření layoutu a stylů

- Ověřit, že `@web3privacy/portal-ui/global-footer.css` je v portálu načtený (už je v layoutu).
- Zkontrolovat, že žádné globální styly portálu nepřepisují klíčové třídy (`.w3pn-global-footer`, `.contribute-wrap`, …); v případě konfliktů upravit selektory nebo specifičnost v portal-ui CSS.

### Krok 6: (Volitelně) Sdílený zdroj dat

- Pokud bude později požadována jedna pravda pro oba weby: vytvořit např. `packages/footer-content` s defaultním obsahem a exportovat `getGlobalFooterConfig(content)`; org-web i portál budou importovat a předávat do `GlobalFooter`. Případně načítat config z API.

---

## 5. Shrnutí

| Úkol | Popis |
|-----|------|
| Config | Rozšířit `portalGlobalFooterConfig` o donation, newsletter, members, plný footer (odkazy, social, legal). |
| Assety | Přidat assety pod `/assets/` nebo použít absolutní URL z org-webu. |
| Adaptér | Jedna funkce/objekt mapující data na `GlobalFooterConfig`; zatím stačí přímo plný config v TS. |
| Contributoři | Volitelně: TS verze getGitHubCommunityMembers + předání `communityMembers` v layoutu (client wrapper). |
| Newsletter | Volitelně: client wrapper s `onNewsletterSubmit` a state pro loading/success/error. |
| Styly | Používat pouze portal-ui `global-footer.css`; nekopírovat patičku do vlastních komponent. |

Tím bude patička na portálu vizuálně i obsahově 1:1 s org-webem, s možností později sjednotit zdroj dat do sdíleného modulu nebo API.
