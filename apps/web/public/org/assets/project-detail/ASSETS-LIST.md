# Project Detail – seznam assetů k nahrání

Nahraj tyto soubory do složky **`public/assets/project-detail/`** (nebo do `w3pn-org-web/public/assets/project-detail/`). Cesta v kódu: `/assets/project-detail/<soubor>`.

---

## 1. Ikony pro sekci Links (Mission & Links)

| Soubor | Použití |
|--------|--------|
| `icon-website.svg` | Odkaz Website / URL |
| `icon-docs.svg` | Documentation |
| `icon-github.svg` | GitHub |
| `icon-twitter.svg` | Twitter |
| `icon-discord.svg` | Discord |
| `icon-telegram.svg` | Telegram |

**Formát:** SVG, doporučená velikost cca 20×20 px (zobrazují se 20×20). Barva může být bílá nebo jednoduchá silueta (ikona se zobrazí vedle zeleného textu).

---

## 2. Ikony pro Features (ikonové položky – druhý řádek)

Používají se, když v datech máš `features.items[].icon` (název bez přípony). Např. `icon: 'brain'` → načte se `brain.svg`.

| Soubor | Použití (příklad) |
|--------|--------------------|
| `brain.svg` | AI / „AI-driven solutions“ |
| `chain.svg` | Decentralized / „Decentralized data storage“ |
| *(další dle Figmy)* | libovolný název odpovídající `icon` v datech |

**Formát:** SVG, zobrazuje se v kruhu 48×48 (zelené pozadí). Ideálně jednoduchá ikona bílá/černá.

---

## 3. Ikony pro Contribute (seznam odkazů)

V datech můžeš u položky uvést `icon: 'icon-developers'` atd. Komponenta načítá `/assets/project-detail/<icon>.svg`.

| Soubor | Použití |
|--------|--------|
| `icon-developers.svg` | Developers |
| `icon-designers.svg` | Designers |
| `icon-marketers.svg` | Marketers |
| *(volitelně)* | Code, Documentation, Design, Feedback – pokud chceš vlastní ikony |

---

## 4. Hero

| Soubor | Použití |
|--------|--------|
| *(volitelně)* `hero-graphic-<project>.svg` nebo `.png` | Velká kruhová grafika (oko v lupě / logo projektu). V datech: `hero.graphic: '/assets/project-detail/hero-graphic-privacy-explorer.svg'`. Pokud není, použije se `hero.logo`. |

---

## 5. Mission – 3 highlight karty

Pokud v datech používáš `mission.highlights[]` s polem `src` (URL obrázku), assety mohou být:

- buď přímo URL (externí nebo z jiné složky),
- nebo lokální v `public/assets/project-detail/`, např.:
  - `mission-highlight-1.png`
  - `mission-highlight-2.png`
  - `mission-highlight-3.png`

V `details.json` pak např.:  
`"highlights": [{ "src": "/assets/project-detail/mission-highlight-1.png", "caption": "RAILSUN" }, ...]`

---

## 6. Donate – bílá sekce „Contribute to Future of Privacy“

| Soubor | Použití |
|--------|--------|
| `donate-cta-eye.svg` nebo `.png` | Ilustrace „oka“ v bílé CTA sekci. V datech: `donate.ctaSection.image: '/assets/project-detail/donate-cta-eye.svg'`. |

---

## 7. Donate – karta „Empower Change With Your Donation“

| Soubor | Použití |
|--------|--------|
| `donate-empower-bg.jpg` nebo `.png` | Pozadí karty (tech / equipment). V datech: `donate.empowerImage: '/assets/project-detail/donate-empower-bg.jpg'`. |

---

## 8. Donate – komunita (řada avatarů)

Pole URL v datech: `donate.communityAvatars: ['/assets/project-detail/community-1.jpg', ...]`.  
Můžeš nahradit placeholder URL za reálné obrázky; počet dle designu (cca 16).

| Soubor (příklad) | Použití |
|------------------|--------|
| `community-avatar-01.jpg` … `community-avatar-16.jpg` | Kruhové avatary v řadě (nebo odkazy na externí URL). |

---

## 9. Donate – investoři

Pole objektů v datech: `donate.investors: [{ logo: '...', name: '...', href: '...' }]`.  
Loga mohou být v této složce nebo externí.

| Soubor (příklad) | Použití |
|------------------|--------|
| `investor-1.svg` … `investor-6.svg` | Loga investorů (grayscale v kódu). |

---

## 10. Footer

| Soubor | Použití |
|--------|--------|
| `footer-cta-bg.jpg` | Pozadí druhého CTA bloku (město / vizuál). V datech: `footer.ctaImage: '/assets/project-detail/footer-cta-bg.jpg'`. |
| `footer-avatar-01.jpg` … `footer-avatar-16.jpg` | Grid 4×4 avatarů komunity. V datech: `footer.communityAvatars: ['/assets/project-detail/footer-avatar-01.jpg', ...]`. |

---

## 11. Sociální ikony (footer)

Komponenta načítá `/assets/project-detail/icon-<sít>.svg`.

| Soubor | Síť |
|--------|-----|
| `icon-twitter.svg` | Twitter (může být stejný jako v Links) |
| `icon-discord.svg` | Discord |
| `icon-github.svg` | GitHub |
| `icon-linkedin.svg` | LinkedIn |
| `icon-medium.svg` | Medium |
| `icon-youtube.svg` | YouTube |

---

## Minimální sada pro funkční vzhled

- **Links:** `icon-website.svg`, `icon-docs.svg`, `icon-github.svg`, `icon-twitter.svg`, `icon-discord.svg`, `icon-telegram.svg`
- **Footer sociální:** stejné ikony (twitter, discord, github) + `icon-linkedin.svg`, `icon-medium.svg`, `icon-youtube.svg`
- **Features (pokud používáš druhý řádek s ikonami):** `brain.svg`, `chain.svg`
- **Contribute (pokud používáš ikony):** `icon-developers.svg`, `icon-designers.svg`, `icon-marketers.svg`

Ostatní assety (hero grafika, mission highlights, donate CTA, empower pozadí, avatary, investoři, footer CTA obrázek) jsou volitelné a závisí na datech v `details.json`.
