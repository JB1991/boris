# Immobilienmarkt.NI

[![pipeline status](https://gitlab.com/lgln/power.ni/power-frontend/badges/dev/pipeline.svg)](https://gitlab.com/lgln/power.ni/power-frontend/-/commits/dev)
[![coverage report](https://gitlab.com/lgln/power.ni/power-frontend/badges/dev/coverage.svg)](https://gitlab.com/lgln/power.ni/power-frontend/-/commits/dev)

In diesem Projekt wird gemeinsam an einer Plattform zur Visualisierung von Wertermittlungsinformationen gearbeitet.
Diese Plattform wird in Form einer Single-Page-Application (SPA) realisiert, die weitere Dienste (für z.B. Daten oder
Geokodierung) einbindet.

Entwickelt wird dieses Projekt vom Landesamt für Geoinformation und Landesvermessung Niedersachsen (LGLN).

## Voraussetzungen

1. git
2. node
3. npm
4. ng
5. docker

## Getting started

1. Projekt klonen
   ```
   git clone ...
   ```
2. Abhängigkeiten installieren
   ```
   cd power
   npm install
   ```

3. Lokalen Entwicklungsserver starten
   ```
   ng serve --open
   ```
    Dies startet einen Webserver, der unter [http://localhost:4200](http://localhost:4200) erreicht werden kann.
    Bei Änderungen am Code werden Änderungen automatisch übertragen.

4. Lokalen SSR Server starten
   ```
   cd power
   npm run dev:ssr
   ```

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

3. Audit ausführen
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
   * Bitte die Datei `messages.xlf` nach dem String `node_modules` durchsuchen und die entsprechenden Einträge entfernen.
   Leider gibt es derzeit keinen `exclude`-Parameter (siehe https://github.com/angular/angular-cli/issues/18885).

3. Vorhandene Übersetzungen updaten
   ```
   cd src/locales
   xliffmerge -p ./config.json
   ```

4. [Übersetzung anfertigen](https://martinroob.github.io/tiny-translator/de/#/home)
    * Falls es Darstellungsprobleme auf der Website gibt, dann einfach die Cookies für die Website löschen.

5. Sprache testen
   ```
   ng serve --open -c en
   ```

## Coding Guideline
Die Programmier-Richtlinie für dieses Projekt ist hier zu finden:
[Coding Guideline - Angular-Frontend](https://gitlab.com/lgln/power.ni/coding-guidelines/angular-frontend)

## CI/CD
Nach dem Commit und Push ins Repository wird automatisch die [CI/CD-Pipeline auf GitLab](https://gitlab.com/lgln/power.ni/power-frontend/pipelines) angestoßen.
Die Konfiguration dazu befindet sich in der Datei `.gitlab-ci.yml`.

**Stages**:
1. **Init**:
Die Node-Module werden installiert und an die weiteren Stages per Cache weitergereicht.

2. **Test**:
Hier werden die Karma- und E2E-Tests sowie ein Audit auf Schwachstellen ausgeführt.
Zudem wird ein Code-Quality-Report generiert.
Diese sind nach Beendigung dieser Stage in den Pipeline-Details unter den Tabs "Tests" und "Code Quality" ersichtlich.

3. **Build**:
Das eigentliche Bauen der Anwendung findet hier statt.

4. **Package**:
Hier wird ein Docker-Container gebaut und in die Registry hochgeladen.

5. **Deploy**:
Abschließend wird der Container im Kubernetes-Cluster per [Helm](https://helm.sh/) deployt.
Das Deployment findet nur statt, wenn in der Datei `package.json` die Versionsnummer inkrementiert wurde.

## Konfiguration

### Module (de)aktivieren
Um bestimmte Module zur Laufzeit zu aktivieren oder deaktivieren, füge die Namen der Module zur Datei [config.json](power/src/assets/config/config.json) hinzu.
Die Bezeichner müssen mit den Namen in der Datei [app.component.html](power/src/app/app.component.html) übereinstimmen.
Die Datei `config.json` kann im finalen Artefakt geändert werden.

### Authentifizerung (de)aktivieren
Die Authentifizierungskomponente lässt sich in der Datei [config.json](power/src/assets/config/config.json) (de)aktivieren. Dies geht auch zur Laufzeit in Kubernetes in der `power-configmap`.
