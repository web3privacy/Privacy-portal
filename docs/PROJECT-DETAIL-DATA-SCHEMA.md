# Project Detail – rozšířená datová struktura (details.json)

Pro 1:1 přiblížení k Figma návrhům lze v `w3pn-org-web/src/data/w3pn-projects/details.json` u každého projektu doplnit níže uvedená pole. Všechna jsou **volitelná** – komponenty mají výchozí chování, pokud pole chybí.

---

## Hero

```json
"hero": {
  "logo": "/projects/explorer.png",
  "graphic": "/assets/project-detail/hero-graphic.svg",
  "title": "Privacy Explorer",
  "tagline": "...",
  "ctaLabel": "EXPLORE NOW",
  "ctaHref": "https://...",
  "metrics": [
    { "value": "800+", "label": "Projects" },
    { "value": "16", "label": "Contributors" },
    { "value": "112", "label": "Lines of Code" },
    { "value": "11", "label": "Supported Chains" }
  ],
  "pagination": ["10", "11"]
}
```

- **graphic** – použije se místo `logo` pro velkou kruhovou grafiku (desktop vlevo). Pokud chybí, použije se `logo`.
- **pagination** – pole řetězců zobrazené pod metrikami na mobilu (např. kroky „10“, „11“).

---

## Mission

```json
"mission": {
  "text": "...",
  "readMoreHref": "https://...",
  "highlights": [
    { "src": "/assets/project-detail/mission-1.png", "alt": "", "caption": "RAILSUN" },
    { "src": "/assets/project-detail/mission-2.png", "caption": "Terminal" },
    { "src": "/assets/project-detail/mission-3.png", "caption": "Network" }
  ]
}
```

- **highlights** – až 3 karty (obrázek + volitelný caption) pod textem mise.

---

## Features (nový formát – dva řádky)

Místo jediného pole `features` můžeš použít objekt se dvěma poli:

```json
"features": {
  "cards": [
    { "image": "/path/to/image.jpg", "title": "Data & AI", "subtitle": "web3/AI model", "link": "https://...", "linkLabel": "Learn more" }
  ],
  "items": [
    { "icon": "brain", "text": "AI-driven solutions for web3 ecosystem", "link": "https://...", "linkLabel": "Learn more" },
    { "icon": "chain", "text": "Decentralized data storage & secure infrastructure" }
  ]
}
```

- **cards** – první řádek: karty s obrázkem (grayscale).
- **items** – druhý řádek: kruhová zelená ikona (pole `icon` = název bez přípony, např. `brain.svg`) + text.
- Pokud zůstane **features** jako pole objektů (jako dnes), zobrazí se jeden grid jako doposud.

---

## Articles

```json
"articles": [
  {
    "thumbnail": "/path/to/thumb.jpg",
    "title": "How Much Privacy Do We Really Have?",
    "date": "2024-01-15",
    "excerpt": "...",
    "href": "https://..."
  }
],
"articlesHrefAll": "https://..."
```

- **articlesHrefAll** – URL pro tlačítko VIEW ALL.

---

## Roadmap

```json
"roadmap": [
  {
    "phase": "Phase 1.0",
    "title": "Launch",
    "description": "Description of the first phase.",
    "release": "Release X.X",
    "items": ["Initial protocol"],
    "readMoreHref": "https://..."
  }
],
"roadmapPagination": { "current": 1, "total": 4 }
```

- **phase** – zobrazí se místo `quarter` (např. „Phase 1.0“).
- **release** – volitelný řádek (např. „Release X.X“).
- **roadmapPagination** – zobrazení „1 of 4“ pod timeline.

---

## Testimonials

```json
"testimonials": [ ... ],
"testimonialsReadMoreHref": "https://..."
```

- **testimonialsReadMoreHref** – URL tlačítka READ MORE pod kartami.

---

## Contribute

```json
"contribute": {
  "text": "...",
  "links": [
    { "label": "Code", "href": "https://...", "icon": "icon-code" },
    { "label": "Documentation", "href": "https://...", "icon": "icon-docs" },
    { "label": "Design", "href": "https://...", "icon": "icon-designers" },
    { "label": "Feedback", "href": "https://...", "icon": "icon-feedback" }
  ],
  "ctaLabel": "LEARN MORE",
  "ctaHref": "https://..."
}
```

- Pokud chybí, použijí se výchozí text a odkazy (Code, Documentation, Design, Feedback + LEARN MORE).

---

## Donate

```json
"donate": {
  "ctaSection": {
    "title": "Contribute to Future of Privacy",
    "body": "...",
    "image": "/assets/project-detail/donate-cta-eye.svg",
    "ctaLabel": "JOIN OUR COMMUNITY",
    "ctaHref": "https://..."
  },
  "communityAvatars": ["/assets/project-detail/community-1.jpg", ...],
  "empowerTitle": "Empower Change With Your Donation",
  "empowerImage": "/assets/project-detail/donate-empower-bg.jpg",
  "investors": [
    { "logo": "/assets/project-detail/investor-1.svg", "name": "Dyna OS", "href": "https://..." }
  ],
  "investorsCta": { "label": "BECOME INVESTOR", "href": "https://..." }
}
```

---

## Footer

```json
"footer": {
  "tagline": "Create your own web3-powered dApps...",
  "getStartedHref": "https://web3privacy.info",
  "communityAvatars": ["/assets/project-detail/footer-avatar-01.jpg", ...],
  "ctaImage": "/assets/project-detail/footer-cta-bg.jpg",
  "communityText": "Join the #W3PN community"
}
```

---

Assety k nahrání jsou vypsány v **`w3pn-org-web/public/assets/project-detail/ASSETS-LIST.md`**.
