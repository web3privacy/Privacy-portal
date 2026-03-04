# Analýza kompatibility stylů: Portal vs. w3pn-org-web (Web3Privacy OEG)

**Cíl**: Teoreticky sjednotit názvosloví, barvy, typografii a celkový styl obou webů tak, aby byly maximálně kompatibilní bez narušení současného vzhledu. **Primární právo zachovat styly má Portal.**

---

## 1. Přehled technologií

| Oblast | Portal (apps/web + portal-ui) | w3pn-org-web |
|--------|-------------------------------|--------------|
| Framework | Next.js 15, React 19 | Vite + React 18 |
| Styling | Tailwind CSS 4 + CSS modules | Plain CSS (single global.css) |
| UI komponenty | Radix UI, portal-ui package | Vlastní komponenty |
| Dark mode | `.dark` třída (light/dark) | Pouze dark (vždy #000) |

---

## 2. Barevná paleta

### 2.1 Srovnání CSS proměnných

| Sémantika | Portal (:root) | Portal (.dark) | w3pn-org-web |
|-----------|----------------|----------------|--------------|
| Pozadí | `--background: #ffffff` | `#0f1318` | `--bg: #000000` |
| Text | `--foreground: #121212` | `#f2f4f6` | `--text: #ffffff` |
| Kartičky | `--card: #efefef` | `#181d25` | `--surface`, `--surface-soft: #0a0a0a` |
| Muted text | `--muted-foreground: #616161` | `#a7b0bd` | `--muted: #b8b8b8` |
| **Akcent** | **`--accent: #59f26d`** | **`#59f26d`** | **`--accent: #70ff88`** |
| Akcent text | `--accent-foreground: #172118` | `#122014` | (implicitně #000 na accent bg) |
| Border / Line | `--border: #d6d6d6` | `#303640` | `--line: rgba(255,255,255,0.16)` |
| Destructive | `--destructive: #b42318` | `#ff8b80` | (chybí) |

**Rozdíl akcentu**: Portal `#59f26d`, w3pn `#70ff88` — oba odstíny zelené; w3pn je jasnější. Pro sjednocení bych doporučil **zachovat Portal `#59f26d`** jako primární.

### 2.2 Návrh mapování názvosloví

**Portal → jako referenční sémantika**:

```
Portal                 w3pn aktuálně    → w3pn navržený alias
────────────────────────────────────────────────────────────
--background           --bg             --bg: var(--background) 
--foreground           --text           --text: var(--foreground)
--card                 --surface        --surface: var(--card)
--muted-foreground     --muted          --muted: var(--muted-foreground)
--accent               --accent         --accent: var(--accent)  [Portal hodnota]
--border               --line           --line: var(--border)
```

**W3pn specifické (zachovat)**: `--surface-soft`, `--radius`, `--radius-lg`, `--content-max`.

---

## 3. Typografie

| Oblast | Portal | w3pn-org-web |
|--------|--------|--------------|
| Sans-serif | Archivo (font-sans) | Archivo |
| Serif | Domine (font-serif) | Domine |
| Další | Material Symbols Rounded | Inter, Silkscreen |

**Společné**: Archivo + Domine — dobrá shoda.

**Rozdíly**:
- w3pn používá **Inter** pro statistiky, čísla, některé nadpisy
- w3pn používá **Silkscreen** (monospace) pro activity sekce
- Portal má **Material Symbols** pro ikony

**Doporučení**: Zachovat obě sady fontů; v Portalu přidat volitelně Inter a Silkscreen pro speciální bloky, pokud se budou přenášet komponenty z w3pn.

```css
/* Teoretické rozšíření Portal theme */
@theme {
  --font-sans: "Archivo", ...;
  --font-serif: "Domine", ...;
  --font-display: "Silkscreen", monospace;   /* pro speciální nadpisy */
  --font-mono: "Inter", ...;                 /* pro statistiky/čísla */
}
```

---

## 4. Border radius

| Kontext | Portal | w3pn-org-web |
|---------|--------|--------------|
| Malý | 8px (rounded-lg) | 6px, 7px, 8px |
| Střední | 10px (rounded-[10px]) | 12px (--radius) |
| Velký | 12px (rounded-xl) | 16px (--radius-lg), 18px, 20px |
| Pilulka | rounded-full | 999px |

**Návrh sjednocení (bez změny vizuálu)** — použít sémantické tokeny:

```css
--radius-sm: 6px;   /* w3pn: 6–8px */
--radius-md: 10px;  /* Portal default pro inputs */
--radius-lg: 12px;  /* karty, sekce */
--radius-xl: 16px;  /* velké karty */
--radius-full: 999px;
```

w3pn by mohl přejít z `--radius: 12px` na `--radius: var(--radius-lg)` s fallbackem.

---

## 5. Komponenty a názvosloví tříd

### 5.1 Portal

- **PascalCase komponenty**: `ArticleCard`, `EventCard`, `NewsPageContent`
- **Tailwind utility**: `rounded-xl`, `bg-white`, `dark:bg-[#151a21]`
- **CSS modules**: `portal-header.module.css` → camelCase (`.shell`, `.brandLink`)

### 5.2 w3pn-org-web

- **BEM-like / kebab-case**: `top-nav`, `hero`, `section-title`, `w3-card`, `eco-card`, `testimonial-card`, `donation-card`
- Prefix **`w3-`**: `w3-card`, `w3-card-media`, `w3-card-logo`

### 5.3 Mapování komponent (konceptuální)

| w3pn třída/sekce | Portal ekvivalent / návrh |
|------------------|---------------------------|
| `section-title` | `SectionTitle` (portál nemá, ale podobné je v News) |
| `w3-card` | `Card` / `ActivityCard` |
| `video-card` | `ArticleCard` variant video |
| `testimonial-card` | `TestimonialCard` |
| `academy-card` | `AcademyCard` / podobné talk karty |
| `eco-card` | `EcosystemCard` |
| `primary-btn`, `outline-btn`, `dark-btn` | Button varianty (primary, outline, secondary) |
| `top-nav` | `PortalHeader` |

**Doporučení**: Při případném budoucím sdílení komponent by w3pn mohl používat prefix `portal-` pro styly importované z Portalu (např. `portal-btn`, `portal-card`), zatímco vlastní komponenty zůstanou pod `w3-` nebo kebab-case.

---

## 6. Layout a breakpointy

| Oblast | Portal | w3pn-org-web |
|--------|--------|--------------|
| Max šířka obsahu | 1280px (viewport-range-shell) | 1200px (--content-max) |
| Breakpointy | Tailwind (sm/md/lg/xl) | 1120px, 820px (media queries) |

**Návrh**: Sjednotit na `--content-max: 1280px` (Portal) nebo definovat v obou:

```css
--content-max: 1280px;
--content-max-narrow: 1200px;  /* w3pn ekvivalent */
```

---

## 7. Plán implementace (teoretický)

### Fáze 1: Sjednocení design tokenů (bez změny vzhledu)

1. **Vytvořit sdílený soubor tokenů** `design-tokens.css`:
   - Barvy (Portal jako zdroj pravdy)
   - Fonty
   - Border radius
   - Spacing (volitelně)

2. **Portal**  
   - Importovat tokeny v `portal-ui/globals.css`  
   - Zachovat stávající `:root` / `.dark`  
   - Tokeny jen doplní/doplňují

3. **w3pn-org-web**  
   - Importovat tokeny  
   - Přepsat vlastní proměnné na aliasy k tokenům:
     ```css
     --bg: var(--background, #000);
     --text: var(--foreground, #fff);
     --accent: var(--accent, #70ff88);  /* fallback na aktuální w3pn */
     ```
   - Vizuál zůstane stejný díky fallbackům

### Fáze 2: Sjednocení akcentu (volitelné)

- V w3pn změnit `--accent` z `#70ff88` na `#59f26d` (Portal)
- Drobný vizuální posun; pokud má zůstat vzhled beze změny, tento krok vynechat

### Fáze 3: Komponentní prefixy

- Definovat konvence:
  - `portal-*` — styly z Portalu
  - `w3-*` — vlastní w3pn komponenty
  - Společné utility (např. `section-title`) buď v tokenech, nebo jako sdílená třída

### Fáze 4: Dokumentace

- `STYLE-GUIDE.md` s tokeny, příklady použití a mapováním mezi projekty

---

## 8. Shrnutí doporučení

| Oblast | Doporučení |
|--------|------------|
| **Barvy** | Portal jako zdroj pravdy; w3pn aliasy s fallbacky |
| **Akcent** | Zachovat Portal `#59f26d`; w3pn může zůstat u `#70ff88` pro beze změny vzhledu |
| **Typografie** | Zachovat Archivo + Domine; w3pn si ponechá Inter, Silkscreen |
| **Radius** | Sjednotit na tokeny `--radius-sm/md/lg/xl` |
| **Layout** | `--content-max: 1280px` jako společný default |
| **Komponenty** | Oddělit `portal-*` vs `w3-*`; definovat mapování ekvivalentů |

**Priorita**: Fáze 1 (tokeny + aliasy) dává největší benefit při minimálním riziku změny vzhledu.
