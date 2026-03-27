# Den Oever — Live Waterstanden & Weerdashboard

## 🚀 Online zetten via Vercel

### Stap 1 — GitHub repository aanmaken
1. Ga naar **https://github.com/new**
2. Naam: `den-oever-dashboard` → **Create repository**
3. Klik **uploading an existing file**
4. Sleep alle bestanden uit deze map naar de pagina (niet de map zelf, de inhoud)
5. Klik **Commit changes**

### Stap 2 — Deploy op Vercel
1. Ga naar **https://vercel.com** → maak gratis account (met GitHub inloggen)
2. Klik **Add New → Project**
3. Selecteer je `den-oever-dashboard` repository
4. Klik **Deploy** — Vercel detecteert alles automatisch
5. Na ~30 seconden krijg je een URL zoals `den-oever-dashboard.vercel.app`

Klaar! De URL is permanent en publiek toegankelijk.

---

## Structuur

```
/
├── api/
│   ├── weather.js      → Wind (Open-Meteo)
│   ├── marine.js       → Golven (Open-Meteo Marine)
│   └── waterstand.js   → Waterstand (RWS Waterinfo)
├── public/
│   ├── index.html      → Dashboard
│   └── logo.png
├── vercel.json         → Routering
└── package.json
```

## Databronnen
- 📡 **RWS Waterinfo** — waterstand Den Oever (OEBU)
- 🌬️ **Open-Meteo Forecast** — wind, windrichting, vlagen
- 🌊 **Open-Meteo Marine** — golfhoogte Hm0, periode
- 🗺️ **Windy.com** — interactieve weerkaart
