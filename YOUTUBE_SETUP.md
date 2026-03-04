# YouTube Video Setup Guide

## Pro načítání videí z YouTube potřebujete:

### 1. Channel ID nebo Handle

**Možnosti:**
- **Channel Handle:** `@Web3PrivacyNow` (již implementováno)
- **Channel ID:** Např. `UCxxxxxxxxxxxxxxxxxxxxxxxxxx` (pokud znáte)

### 2. RSS Feed URL

YouTube poskytuje RSS feed pro kanály a playlisty:

**Pro Channel:**
```
https://www.youtube.com/feeds/videos.xml?channel_id=CHANNEL_ID
```

**Pro Playlist:**
```
https://www.youtube.com/feeds/videos.xml?playlist_id=PLAYLIST_ID
```

### 3. Jak získat Channel ID

**Metoda 1: Z channel page**
1. Otevřete `https://www.youtube.com/@Web3PrivacyNow`
2. Klikněte pravým tlačítkem → "View Page Source"
3. Vyhledejte `"channelId":"UC..."`
4. Nebo použijte YouTube Data API v3

**Metoda 2: YouTube Data API v3**
```bash
curl "https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=Web3PrivacyNow&key=YOUR_API_KEY"
```

**Metoda 3: Online nástroje**
- https://commentpicker.com/youtube-channel-id.php
- Zadejte handle `@Web3PrivacyNow` nebo URL kanálu

### 4. Environment Variable (volitelné)

Pokud chcete použít přímo Channel ID, přidejte do `.env.local`:

```env
YOUTUBE_CHANNEL_ID=UCxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Aktuální implementace

Současná implementace v `/apps/web/src/app/api/academy/youtube/route.ts`:
- Automaticky se pokouší získat Channel ID z channel page
- Fallback na `YOUTUBE_CHANNEL_ID` env variable
- Používá RSS feed pro načítání videí (bez API key)

### 6. Omezení RSS Feed

RSS feed **neobsahuje**:
- `viewCount` (počet zhlédnutí) - pro řazení podle popularity
- `duration` (délka videa) - musí se získat z YouTube Data API v3

**Řešení:**
- Pro `viewCount`: Použít YouTube Data API v3 (vyžaduje API key)
- Pro `duration`: Použít YouTube Data API v3 nebo oEmbed API

### 7. YouTube Data API v3 (pokud potřebujete viewCount)

1. Získejte API key z Google Cloud Console
2. Povolte YouTube Data API v3
3. Přidejte do `.env.local`:
```env
YOUTUBE_API_KEY=your_api_key_here
```

4. Upravte `/apps/web/src/app/api/academy/youtube/route.ts` pro použití API místo RSS

### 8. Playlist RSS Feed

Pro radio/interview playlist:
```
https://www.youtube.com/feeds/videos.xml?playlist_id=PLSsVHWrO8Yh1WwICFUsZnB__ThC9bhgqM
```

Toto je již implementováno v `/apps/web/src/app/api/academy/radio/route.ts`

### 9. Testování

Otestujte RSS feed přímo v prohlížeči:
```
https://www.youtube.com/feeds/videos.xml?channel_id=YOUR_CHANNEL_ID
```

Nebo pro playlist:
```
https://www.youtube.com/feeds/videos.xml?playlist_id=PLSsVHWrO8Yh1WwICFUsZnB__ThC9bhgqM
```

### 10. Troubleshooting

**Problém: RSS feed vrací prázdný výsledek**
- Zkontrolujte, že Channel ID je správné
- Zkontrolujte, že kanál má veřejná videa
- Zkontrolujte, že kanál není soukromý

**Problém: Nelze získat Channel ID automaticky**
- Použijte environment variable `YOUTUBE_CHANNEL_ID`
- Nebo získejte Channel ID ručně (viz Metoda 1-3)

**Problém: Potřebujete viewCount pro řazení**
- Použijte YouTube Data API v3 (vyžaduje API key)
- Nebo použijte `displayOrder` v admin rozhraní pro ruční řazení
