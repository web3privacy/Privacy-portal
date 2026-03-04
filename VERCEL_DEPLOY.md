# Nasadenie portálu na Vercel

## 1. Účet a Vercel CLI (voliteľné)

- Ak ešte nemáš účet: [vercel.com](https://vercel.com) → Sign up (napr. cez GitHub).
- Lokálne nasadenie cez CLI: `npm i -g vercel`

## 2. Nasadenie cez Vercel Dashboard (odporúčané)

1. Nahraj projekt na **GitHub** (ak ešte nie je).
2. Choď na [vercel.com/new](https://vercel.com/new).
3. **Import** repozitára (napr. tvoj GitHub repo).
4. **Root Directory:** nechaj prázdne (build sa spúšťa z koreňa monorepa).
5. **Build & Development Settings** (Vercel ich môže sám nastaviť z `vercel.json`):
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `apps/web/.next`
6. Klikni **Deploy**.

## 3. Nasadenie cez Vercel CLI

V koreni projektu (PORTAL):

```bash
npx vercel
```

Postupuj podľa otázok (login, link na existujúci projekt alebo nový). Pri prvom nasadení môžeš použiť `npx vercel --prod` pre production.

## 4. Premenné prostredia (ak ich potrebuješ)

V **Vercel Dashboard** → tvoj projekt → **Settings** → **Environment Variables** pridaj napr.:

- `NEXT_PUBLIC_BASE_URL` = `https://tvoja-domena.vercel.app`  
  (pre Academy API volania po nasadení)

## 5. Čo je už nakonfigurované

- `vercel.json` – framework Next.js, build a output pre monorepo.
- `apps/web/next.config.ts` – na Vercel sa nepoužíva `output: "standalone"` (správne pre Vercel).
- Stránky `/academy/courses` a `/jobs` sú nastavené ako dynamické, aby build prebehol bez chýb.

Po nasadení Vercel ti dá URL typu `https://tvoj-projekt.vercel.app`.
