# Karte Deutschland

Interaktive Karte (Frontend-only) auf Basis von React, Chakra UI und OpenLayers.

## Stack

- **React** + **Vite** (Bundler / Build-Tool)
- **Chakra UI** für UI-Komponenten
- **OpenLayers** für die Karte
- **i18next** + **YAML** für Übersetzungen (DE / EN)

## Setup

```bash
npm install
npm run dev       # Entwicklungs-Server
npm run build     # Produktions-Build (dist/)
npm run preview   # Vorschau des Produktions-Builds
npm run prefetch  # Stadtdaten aktualisieren → src/data/cities.json
```

## Daten-Prefetch

Die Liste der deutschen Städte (Bevölkerung ≥ 50.000) wird **nicht zur Laufzeit** geladen, sondern als statisches Artefakt unter [`src/data/cities.json`](src/data/cities.json) ins Repo eingecheckt. Erzeugt von [`scripts/prefetch-cities.mjs`](scripts/prefetch-cities.mjs) via Overpass API.

Aktualisieren:

```bash
npm run prefetch
git commit src/data/cities.json -m "chore: refresh cities data"
```

Das hält den Build deterministisch und unabhängig von der Verfügbarkeit von Overpass.

## Deployment (GitHub Pages)

Der Workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) baut bei jedem Push auf `main` und deployt nach GitHub Pages. Einmalig in *Settings → Pages → Source* auf "GitHub Actions" stellen. `vite.config.js` nutzt `base: './'`, damit Asset-Pfade auch unter `https://<user>.github.io/<repo>/` funktionieren.

## Übersetzungen

Sprachdateien liegen unter `src/i18n/locales/` als YAML:

- `de.yaml` – Deutsch
- `en.yaml` – English

Neue Sprache hinzufügen: YAML-Datei anlegen, in `src/i18n/index.js` registrieren und in `LanguageSwitcher.jsx` ergänzen.

## API-Schnittstellen

Hier werden alle öffentlichen API-Endpunkte gesammelt, die das Frontend nutzt.

### Hintergrundkarte

- **OpenStreetMap Tile-Server** – `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
  Standard-Raster-Tiles über die `OSM`-Quelle von OpenLayers.
  Nutzungsbedingungen: <https://operations.osmfoundation.org/policies/tiles/>

### Daten-APIs

<!-- Neue Endpunkte hier eintragen, im Format:
- **Name** – `URL`
  Kurzbeschreibung. Doku: <link>
-->

- **Overpass API (OpenStreetMap)** – `https://overpass-api.de/api/interpreter`
  Liefert deutsche Städte/Ortschaften (`place=city|town`) mit `population`-Tag inkl. Koordinaten und Namen (DE/EN). Filterung auf Bevölkerung ≥ 50.000 client-seitig. Verwendet in [`src/api/germanCities.js`](src/api/germanCities.js).
  Doku: <https://wiki.openstreetmap.org/wiki/Overpass_API> · Nutzungsbedingungen: <https://operations.osmfoundation.org/policies/>
