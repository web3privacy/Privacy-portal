# Web3Privacy – průvodce stylovým systémem

Tento dokument popisuje sdílený stylový systém projektů **Portal** (apps/web) a **w3pn-org-web** (Web3Privacy OEG website). **Portal je zdrojem pravdy** pro design tokeny a sémantiku.

---

## 1. Přehled architektury

```
packages/portal-ui/
├── design-tokens.css   ← sdílené tokeny (radius, fonty, akcent)
└── globals.css         ← Portal theme + Tailwind

apps/web/               ← importuje @web3privacy/portal-ui/globals.css
w3pn-org-web/           ← importuje design-tokens.css + vlastní global.css
```

- **design-tokens.css** – statické tokeny sdílené oběma projekty
- **Portal globals.css** – kompletní theme (barvy, Tailwind integrace, dark mode)
- **w3pn global.css** – importuje tokeny, definuje aliasy pro vlastní třídy

---

## 2. Design tokeny (`design-tokens.css`)

**Umístění**: `packages/portal-ui/design-tokens.css`

### 2.1 Layout

| Token | Hodnota | Použití |
|-------|---------|---------|
| `--content-max` | 1280px | Maximální šířka hlavního obsahu |

### 2.2 Border radius

| Token | Hodnota | Použití |
|-------|---------|---------|
| `--radius-sm` | 6px | Malé prvky, ikony |
| `--radius-md` | 10px | Inputy, malé karty |
| `--radius-lg` | 12px | Karty, sekce |
| `--radius-xl` | 16px | Velké karty, modály |
| `--radius-full` | 999px | Pilulky, avatary |

### 2.3 Typografie

| Token | Hodnota | Použití |
|-------|---------|---------|
| `--font-sans` | "Archivo", "Avenir Next", "Helvetica Neue", sans-serif | Tělo textu, UI |
| `--font-serif` | "Domine", "Iowan Old Style", "Palatino Linotype", serif | Nadpisy h1–h4 |

### 2.4 Akcent (sjednocený)

| Token | Hodnota | Použití |
|-------|---------|---------|
| `--color-accent` | #70ff88 | CTA, zvýraznění, odkazy |
| `--color-accent-foreground` | #172118 | Text na akcentním pozadí |

---

## 3. Portal – barevné proměnné

Portal definuje sémantické barvy v `:root` (light) a `.dark` (dark mode).

### 3.1 Light theme (`:root`)

| Proměnná | Hodnota | Sémantika |
|----------|---------|-----------|
| `--background` | #ffffff | Pozadí stránky |
| `--foreground` | #121212 | Hlavní text |
| `--card` | #efefef | Pozadí karet |
| `--card-foreground` | #1c1c1c | Text na kartách |
| `--primary` | #171717 | Primární barva (tlačítka, důležité) |
| `--primary-foreground` | #ffffff | Text na primární |
| `--secondary` | #dfdfdf | Sekundární plochy |
| `--muted` | #e8e8e8 | Muted plochy |
| `--muted-foreground` | #616161 | Muted text |
| `--accent` | #70ff88 | Akcent |
| `--accent-foreground` | #172118 | Text na akcentu |
| `--border` | #d6d6d6 | Ohraničení |
| `--destructive` | #b42318 | Chybové stavy |

### 3.2 Dark theme (`.dark`)

| Proměnná | Hodnota |
|----------|---------|
| `--background` | #0f1318 |
| `--foreground` | #f2f4f6 |
| `--card` | #181d25 |
| `--primary` | #e8edf5 |
| `--accent` | #70ff88 |
| `--border` | #303640 |
| … | (viz globals.css) |

### 3.3 Tailwind integrace

Portal mapuje proměnné do Tailwind utility přes `@theme inline`:

```css
--color-background: var(--background);
--color-foreground: var(--foreground);
--color-accent: var(--accent);
/* … */
```

Použití: `bg-background`, `text-foreground`, `text-accent`, atd.

---

## 4. w3pn-org-web – aliasy a dark theme

w3pn je vždy dark, používá aliasy pro kompatibilitu s design tokeny.

### 4.1 Mapování proměnných

| w3pn (legacy) | → | Odkazuje na |
|---------------|---|-------------|
| `--bg` | | `--background` (#000) |
| `--surface` | | `--background` |
| `--text` | | `--foreground` (#fff) |
| `--accent` | | `var(--color-accent)` (#70ff88) |
| `--line` | | `--border` |
| `--radius` | | `var(--radius-lg)` (12px) |
| `--radius-lg` | | `var(--radius-xl)` (16px) |
| `--content-max` | | `var(--content-max)` (1280px) |

### 4.2 w3pn specifické

| Proměnná | Hodnota | Použití |
|----------|---------|---------|
| `--surface-soft` | #0a0a0a | Jemnější pozadí |
| `--muted` | #b8b8b8 | Sekundární text |

---

## 5. Fonty

### 5.1 Sdílené

- **Archivo** – sans-serif, tělo textu, UI
- **Domine** – serif, nadpisy

### 5.2 Pouze w3pn

- **Inter** – statistiky, čísla
- **Silkscreen** – activity sekce (monospace)

### 5.3 Pouze Portal

- **Material Symbols Rounded** – ikony

---

## 6. Breakpointy

| Projekt | Breakpointy |
|---------|-------------|
| Portal | Tailwind default (640, 768, 1024, 1280, 1536) |
| w3pn | 1120px, 820px (vlastní media queries) |

---

## 7. Použití v kódu

### 7.1 Portal (Tailwind)

```tsx
<div className="bg-background text-foreground rounded-xl">
  <h2 className="font-serif text-accent">Heading</h2>
  <button className="bg-accent text-accent-foreground rounded-lg px-4 py-2">
    CTA
  </button>
</div>
```

### 7.2 w3pn (plain CSS)

```css
.my-card {
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  color: var(--text);
}

.my-card h4 {
  color: var(--accent);
}
```

### 7.3 Přidání nového projektu

1. Nainstalovat `@web3privacy/portal-ui` nebo importovat `design-tokens.css`
2. V CSS:
   ```css
   @import '@web3privacy/portal-ui/design-tokens.css';
   
   :root {
     --background: #…;
     --foreground: #…;
     --accent: var(--color-accent);
   }
   ```

---

## 8. Změna tokenů

1. Upravit `packages/portal-ui/design-tokens.css`
2. Pro barvy: Portal upravit v `globals.css` (`:root`, `.dark`)
3. Spustit build obou projektů: `npm run build` (apps/web) a `npm run build` (w3pn-org-web)

---

## 9. Reference

- Analýza a plán: `STYLE-COMPATIBILITY-ANALYSIS.md`
- Design tokeny: `packages/portal-ui/design-tokens.css`
- Portal globals: `packages/portal-ui/globals.css`
- w3pn globals: `w3pn-org-web/src/styles/global.css`
