# Explorer App

Next.js app for Web3Privacy Explorer. This app consumes `https://explorer-data.web3privacy.info` and exposes internal API routes (`/api/*`) for filtering + pagination.

## Local dev

```bash
cd /Users/coinmandeer/Desktop/CODEX-W3PN-EXPLORER
npm install
cp /Users/coinmandeer/Desktop/CODEX-W3PN-EXPLORER/apps/explorer/.env.example /Users/coinmandeer/Desktop/CODEX-W3PN-EXPLORER/apps/explorer/.env.local
npm run dev
```

## Routes

- `/` - home (filters + cards/rows view)
- `/project/[id]` - project detail
- `/project/create` - create project YAML and open a PR to `web3privacy/explorer-data`
- `/project/[id]/edit` - load + update project YAML and open a PR
