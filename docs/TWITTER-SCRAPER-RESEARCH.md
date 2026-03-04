# Twitter/X scraper – výzkum a plán

## Shrnutí

Twitter/X neimplementujeme v první fázi. Dokumentace slouží pro budoucí rozšíření agregovaného feedu.

## Možnosti přístupu k Twitteru

### 1. Oficiální Twitter API v2

- **Stav:** Placené (Basic $100/měsíc min.), bezplatná tier velmi omezená (1500 tweetů/měsíc read)
- **Výhody:** Stabilní, oficiální, žádné ToS riziko
- **Nevýhody:** Nákladné pro malý projekt

### 2. RSS Bridge

- **URL:** https://github.com/RSS-Bridge/rss-bridge
- **Popis:** Self-hosted service, převádí Twitter profily na RSS feed
- **Výhody:** RSS výstup → můžeme použít stávající RSS crawler
- **Nevýhody:** Musíme hostovat vlastní instanci, nebo spoléhat na veřejné instance (nestabilní)

### 3. Neoficiální scrapers (Nitter, etc.)

- **Nitter:** https://github.com/zedeus/nitter – Twitter frontend s RSS
- **Stav:** Často rozbitý kvůli změnám Twitter API, maintenance problémy
- **Alternativy:** Snscrape (Python), twscrape, x-scraper

### 4. Vlastní scraper (headless / API reverse engineering)

- **Knihovny:** `twikit` (Python), `nitter-api` wrappery
- **Rizika:** Porušení ToS, blokace IP, CAPTCHA
- **Výhody:** Plná kontrola, bez poplatků

## Doporučený postup pro budoucí implementaci

1. **Fáze 1 – RSS Bridge**
   - Nasadit vlastní RSS Bridge instanci (Docker)
   - Přidat typ zdroje `twitter` s parametrem `handle`
   - Bridge generuje RSS z `https://twitter.com/{handle}`
   - Crawler používá stávající RSS pipeline

2. **Fáze 2 – Evaluace**
   - Sledovat stabilitu Bridge, Twitter změny
   - Pokud Bridge přestane fungovat, zvážit placené API nebo odstranění Twitteru

3. **Alternativa – Nitter instance**
   - Self-hosted Nitter (pokud projekt žije)
   - Nitter nabízí RSS endpoint pro profily

## Typ zdroje pro feeds.yaml (budoucí)

```yaml
sources:
  - id: eff-twitter
    type: twitter  # nebo twitter-bridge
    handle: EFF
    # bridgeUrl: https://rss-bridge.example.com (pokud self-hosted)
    enabled: true
```

## Reference

- [RSS-Bridge Twitter bridge](https://github.com/RSS-Bridge/rss-bridge/blob/master/bridges/TwitterBridge.php)
- [Nitter](https://github.com/zedeus/nitter)
- [Twitter API pricing](https://developer.twitter.com/en/products/twitter-api)
