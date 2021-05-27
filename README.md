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
   ng extract-i18n power --format=xlf2 --ivy=true --output-path src/locales
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
   ng serve --open --configuration=en
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

## Module

### Alertsmodul
* Anzeigen von Fehlermeldungen an den Benutzer
* Funktionen
  * Unterstützt success, danger, info und warning Meldungen
  * Timeout frei einstellbar
  * Maximal 4 Meldungen gleichzeitig zu sehen
* Schnittstellen
  * `AlertsService` zum Constructor hinzufügen
  * `NewAlert`: Erstellen neuer Meldung
* Abhängigkeiten
  * [ngx-bootstrap](https://valor-software.com/ngx-bootstrap/#/)
  * [bootstrap-icons](https://icons.getbootstrap.com/)

### Authentifizierungsmodul
* Authentifizierung mittels Keycloak
* Funktionen
  * Login über Keycloak
  * Logout über Keycloak
  * Beziehen von Benutzerinfos über Keycloak
  * Schützen von Routen
  * Autorisierung von API Anfragen
* Schnittstellen
  * Route schützen
    * Importiere `AuthGuard` in die Routendefinition
    * Füge AuthGuard zur Route hinzu `canActivate: [AuthGuard]`
  * Authentifizierung prüfen
    * `AuthService` zum Constructor hinzufügen
    * `IsAuthEnabled`: True wenn Authentifizierung aktiviert
    * `IsAuthenticated`: True wenn Benutzer Authentifiziert
  * Benutzerinfos erhalten
    * `AuthService` zum Constructor hinzufügen
    * `getBearer`: HTTP Authorizationheader content
    * `getHeaders`: Gibt fertigen Anguar `HttpHeaders` zurück mit Responsetype, Content-Type und Authorizationheader gesetzt
    * `getUser`: Gibt Benutzerobjekt zurück. Attribut `.data` enthält Userinfo von Keycloak
* Abhängigkeiten
  * Keycloak

### Bodenrichtwerte
* Visualisierung der Bodenrichtwertzonen
* Funktionen
  * Auswahl von Stichtag und Teilmarkt
  * Adresssuche, Reverse Geocoding
  * Geolocation Positionsbestimmung
  * 3D-Gebäude
* Stichtage 2012 - 2019
* Informationen zu
  * Art der Nutzung
  * Bodenrichtwert
  * Beitragsrechtlicher Zustand
* Entwicklung des BRW als Step-Line-Graph
* Abhängigkeiten
  * [Präsentations-Microservice](https://gitlab.com/lgln/power.ni/presentation) inkl. [BORIS-Datenbank](https://gitlab.com/lgln/power.ni/boris.ni/borisni-database-vboris2)
  * [ng-bootstrap](https://www.npmjs.com/package/@ng-bootstrap/ng-bootstrap)
  * [Maplibre GL](https://www.npmjs.com/package/maplibre-gl)
  * [ECharts](https://www.npmjs.com/package/echarts)
  * [GeoJSON](https://www.npmjs.com/package/geojson)

### Fragebogenonline
* Dynamisches erstellen von Fragebogen, welche online ausgefüllt werden können
* Funktionen
  * Mächtiger Editor zum erstellen von dynamischen und flexiblen Fragebögen
  * Universelle Lösung, vielseitig einsetzbar
  * Öffentliche Fragebögen oder mit PIN geschützte
  * Ergebnisexport als CSV oder per API
* Abhängigkeiten
  * [ngx-bootstrap](https://valor-software.com/ngx-bootstrap/#/)
  * [bootstrap-icons](https://icons.getbootstrap.com/)
  * [ngx-smooth-dnd](https://github.com/kutlugsahin/ngx-smooth-dnd)
  * [SurveyJS - Angular](https://github.com/surveyjs/surveyjs_angular_cli)
  * [SurveyJS - Widgets](https://github.com/surveyjs/widgets)
    * [nouislider](https://refreshless.com/nouislider/)
  * [ngx-showdown](https://github.com/yisraelx/ngx-showdown)

### Immobilienpreisindex
* Darstellung des Immobilienpreisindexes als Grafik
* Darstellung der Wohnungsmarktregionen als Karte mit Auswahlfunktion
* Funktionen
  * Auswahl der darzustellenden Indexreihen nach Wohnungsmarktregion und Indextyp
  * Aggregation mehrerer Wohnungsmarktregionen
  * Individuelle Bestimmung der anzuzeigenden Regionen / Aggregationen
* Details zur Konfiguration sind in der Datei [README.md](power/src/app/immobilien/immobilien/README.md) zu finden.
* Datenquellen
  * Konfiguration (cfg.json)
  * Karte als GeoJSON mit Nipix-Daten als property (erzeugt von GeoServer mit PostGIS Backend)
* Abhängigkeiten
  * [ngx-bootstrap](https://valor-software.com/ngx-bootstrap/#/)
  * [ngx-bootstrap-icons](https://www.npmjs.com/package/ngx-bootstrap-icons)
  * [ECharts](https://www.npmjs.com/package/echarts)


### Geosearch
* Funktionen
  * Adresssuche (Von Adresse zu Geokoordinaten)
  * Reverse Geocoding (Von Geokoordinaten zu Adresse)
* Verwendung in dem Modul Bodenrichtwerte
* Weiterleitung der Anfragen per nginx Reverse Proxy an den BKG Geocoder (siehe Abhängigkeiten)
* Abhängigkeiten:
  * [BKG GeoCoder](https://www.bkg.bund.de/SharedDocs/Produktinformationen/BKG/DE/P-2015/150119-Geokodierung.html)
  * [RxJS](https://angular.io/guide/rx-library)
  * [GeoJSON](https://www.npmjs.com/package/geojson)


### Loadingscreenmodul
* Anzeige eines Ladebildschirmes
* Funktionen
  * Überdecken der gesamten Webseite mit Ladeanimation
  * Automatische anzeige, während Module laden
  * Automatisch deaktiviert, nach beendigung vom Routing Event
* Schnittstellen
  * `LoadingscreenService` zum Constructor hinzufügen
  * `isVisible`: True wenn Ladebildschirm angezeigt wird
  * `setVisible`: Anzeigen oder verstecken des Ladebildschirmes
* Abhängigkeiten
  * Keine

### Feedback
Benutzer können uns über den Link "Rückmeldung geben" Feedback senden.
Dieses wird über die dort stehende E-Mail-Adresse an den [Service Desk](https://gitlab.com/lgln/power.ni/power-frontend/-/issues/service_desk) in diesem Repository weitergeleitet und automatisch in ein Issue konvertiert.
Wenn wir das Issue kommentieren, erhält der Benutzer die Antwort per Mail, sodass eine beidseitige Kommunikation möglich ist.
Auch Screenshots können die Nutzer senden.

Ein Nachteil ist, dass die Benutzer folgende Auto-Response erhalten: `Thank you for your support request! We are tracking your request as ticket #1, and will respond as soon as we can.`

Die Auto-Response ist nur mit dem [kostenpflichtigen GitLab-Premium](https://about.gitlab.com/pricing/) über [E-Mail-Templates](https://gitlab.com/help/user/project/service_desk#using-customized-email-templates) änderbar.

Über die Datei `.gitlab/issue_templates/Feedback.md` wird neuen Issues automatisch das Label "Feedback" hinzugefügt.
Per [GitLab Quick Actions](https://docs.gitlab.com/ee/user/project/quick_actions.html) können bei Bedarf weitere Aktionen automatisch ausgeführt werden.
