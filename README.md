# Masters resultattavle

En resultattavle i Masters-stil for en brettspillturnering med to spillere. Logg
kamper og se ledertavle og spill-for-spill-oversikt på storskjerm.

**Live:** https://maciejost.github.io/tournament-scoreboard/

## Funksjoner

- Redigerbare spillernavn
- Legg til, gi nytt navn på og slett brettspill
- Rask resultatregistrering (velg spill og vinner)
- Historikk med redigering og sletting
- Ledertavle med seiere, tap, seiersprosent og leder
- Spill-for-spill-oversikt
- Fullskjermmodus som skjuler faner og statuslinje
- Alt lagres i nettleseren (localStorage) – ingen backend
- Presentasjonsvisning i full skjermhøyde, optimalisert for TV

## Kjør lokalt

Krever Node.js 20.19+ eller 22.12+.

```bash
npm install
npm run dev
```

Åpne deretter http://localhost:5173.

## Nyttige kommandoer

```bash
npm run build     # produksjonsbygg til dist/
npm run preview   # forhåndsvis produksjonsbygget
npm run lint      # kjør oxlint
```

## Deploy

Nettstedet publiseres automatisk til GitHub Pages ved hver push til `main`, via
workflowen i `.github/workflows/deploy.yml`. Vite bruker
`base: '/tournament-scoreboard/'` for produksjonsbygg, slik at ressurser lastes
riktig under prosjekt-URL-en.

## Teknologi

React 19 · TypeScript · Vite · Tailwind CSS v4
