# Immobilienmarkt.NI

[![pipeline status](https://gitlab.com/lgln/power.ni/power-frontend/badges/dev/pipeline.svg)](https://gitlab.com/lgln/power.ni/power-frontend/-/commits/dev)
[![coverage report](https://gitlab.com/lgln/power.ni/power-frontend/badges/dev/coverage.svg)](https://gitlab.com/lgln/power.ni/power-frontend/-/commits/dev)

In diesem Projekt wird an einer Plattform zur Visualisierung von Wertermittlungsinformationen gearbeitet.
Diese Plattform wird als Single-Page-Application (SPA) realisiert, die weitere Dienste (für z.B. Daten oder
Geokodierung) einbindet.

Entwickelt wird dieses Projekt vom Landesamt für Geoinformation und Landesvermessung Niedersachsen (LGLN) - Landesvermessung und Geobasisinformationen - Landesbetrieb - Fachgebiet 223 - Anwendungsentwicklung Wertermittlungs- u. Geschäftsinformationen.

## Voraussetzungen

1. git ([Linux](https://wiki.ubuntuusers.de/Git/) | [Windows](https://git-scm.com/))
2. node 14 + npm ([Linux](https://wiki.ubuntuusers.de/Node.js/) | [Windows](https://nodejs.org/en/))
4. Angular 12
   ```
   npm install -g @angular/cli
   ```
5. docker ([Linux](https://docs.docker.com/engine/install/ubuntu/) | [Windows](https://docs.docker.com/docker-for-windows/install/))

## Lokal starten

1. Projekt klonen
   ```
   git clone git@gitlab.com:lgln/power.ni/power-frontend.git
   cd power-frontend
   ```

2. Abhängigkeiten installieren
   ```
   cd power
   npm i
   ```

3. Lokalen Entwicklungsserver starten
   ```
   ng serve --open
   ```
   Dies startet einen Webserver, der unter [http://localhost:4200](http://localhost:4200) erreicht werden kann. Änderungen am Code werden automatisch neu geladen.

## Tests

1. Unit-Tests ausführen
   ```
   cd power
   ng test --code-coverage --browsers Chrome
   ```

2. E2E-Tests ausführen
   ```
   ng e2e -c staging
   ```

3. NPM Audit ausführen
   ```
   npm audit
   ```

4. Linter ausführen (TypeScript, CSS/SCSS und HTML)
   ```
   npm run lint power
   npm run lint:styles
   npm run lint:html
   ```

## Übersetzung

1. Tool installieren
   ```
   npm install -g ngx-i18nsupport
   ```

2. Sprachstrings exportieren
   ```
   cd power
   ng extract-i18n power --format=xlf2 --output-path src/locales
   ```

3. Vorhandene Übersetzungen updaten
   ```
   cd src/locales
   xliffmerge -p ./config.json
   ```

4. [Übersetzung anfertigen](https://martinroob.github.io/tiny-translator/de/#/home)

5. Sprache testen
   ```
   ng serve --open -c en
   ```

## Server Side Rendering / Prerendering

1. Lokalen SSR Server starten
   ```
   cd power
   npm run dev:ssr
   ```

2. Prerendering ausführen
   ```
   cd power
   npm run prerender
   ```

## Docker-Container lokal erstellen

1. Prerendering ausführen (siehe oben)

2. Container bauen
   ```
   docker build -t power-frontend:latest .
   ```

3. Container ausführen
   ```
   docker run -it --rm -p 8080:8081 power-frontend:latest
   ```

## Coding Guideline
Die Programmier-Richtlinie für dieses Projekt ist hier zu finden:
[Coding Guideline - Angular-Frontend](https://gitlab.com/lgln/power.ni/coding-guidelines/angular-frontend)

## Konfiguration

### Module (de)aktivieren
Um bestimmte Module zur Laufzeit zu aktivieren oder deaktivieren, füge die Namen der Module zur [environment.ts](power/src/environments/environment.ts) hinzu.

## Dokumentation der Module

- [BORIS.NI](power/src/app/bodenrichtwert/README.md)
- [Online Formular Service](power/src/app/fragebogen/README.md)
- [GMB / LGMB](power/src/app/gmb/README.md)
- [NIPIX](power/src/app/immobilien/README.md)
- [Shared Module](power/src/app/shared/README.md)
- [Static Module](power/src/app/static/README.md)