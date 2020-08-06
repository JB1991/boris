# Portal für Wertermittlungsinformationen

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
   cd power
   ```
2. Abhängigkeiten installieren  
    ```
    npm install
   ```
    
3. Lokalen Entwicklungsserver starten  
    ```
    ng serve
   ```  
    Dies startet einen Webserver, der unter [http://localhost:4200](http://localhost:4200) erreicht werden kann.
    Bei Änderungen am Code werden Änderungen automatisch übertragen. 
 
## Tests

1. Unit-Tests ausführen
   ```
   cd power
   ng test --code-coverage --browsers Chrome
   ```

2. E2E-Tests ausführen
   ```
   ng e2e --port 4201
   ```
 
3. Audit ausführen
   ```
   npm audit
   ```

4. Linter ausführen (TypeScript und CSS)
   ```
   npm run lint
   npm run lint:styles
   ```

## Coding Guideline
Die Programmier-Richtlinie für dieses Projekt ist hier zu finden:
[Coding Guideline - Angular-Frontend](https://gitlab.com/lgln/power.ni/coding-guidelines/frontend)

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

## Module

### Bodenrichtwerte
* Visualisierung der Bodenrichtwertzonen
* Funktionen:
  * Auswahl von Stichtag und Teilmarkt
  * Adresssuche, Reverse Geocoding
  * Geolocation Positionsbestimmung
  * 3D-Gebäude
* Stichtage 2012 - 2019
* Informationen zu:
  * Art der Nutzung
  * Bodenrichtwert
  * Beitragsrechtlicher Zustand
* Entwicklung des BRW als Step-Line-Graph
* Abhängigkeiten:
  * [Präsentations-Microservice](https://gitlab.com/lgln/power.ni/presentation)
  * [Bootstrap](https://www.npmjs.com/package/@ng-bootstrap/ng-bootstrap)
  * [Mapbox GL JS](https://www.npmjs.com/package/mapbox-gl)
  * [ECharts](https://www.npmjs.com/package/echarts)
  * [GeoJSON](https://www.npmjs.com/package/geojson)

### Bodenwerte
* Visualisierung von Bodenwerten (Flurstück)
* Funktionen:
  * Adresssuche, Reverse Geocoding
  * Geolocation Positionsbestimmung
  * 3D-Gebäude
  * Selektion und Addition von Flurstücken
* Benötigt Datensatz mit Flurstücken und Werten
* Derzeit mit offiziellen LGLN Testdaten + zufällig generierten Werten (100.000€ - 1.000.000€)
* Abhängigkeiten:
  * [Präsentations-Microservice](https://gitlab.com/lgln/power.ni/presentation)
  * [Bootstrap](https://www.npmjs.com/package/@ng-bootstrap/ng-bootstrap)
  * [Mapbox GL JS](https://www.npmjs.com/package/mapbox-gl)

### Feedback
Benutzer können uns über den Link "Rückmeldung geben" Feedback senden.
Dieses wird über die dort stehende E-Mail-Adresse an den [Service Desk](https://gitlab.com/lgln/power.ni/power-frontend/-/issues/service_desk) in diesem Repository weitergeleitet und automatisch in ein Issue konvertiert.
Wenn wir das Issue kommentieren, erhält der Benutzer die Antwort per Mail, sodass eine beidseitige Kommunikation möglich ist.
Auch Screenshots können die Nutzer senden.

Ein Nachteil ist, dass die Benutzer folgende Auto-Response erhalten: `Thank you for your support request! We are tracking your request as ticket #1, and will respond as soon as we can.`

Die Auto-Response ist nur mit dem [kostenpflichtigen GitLab-Premium](https://about.gitlab.com/pricing/) über [E-Mail-Templates](https://gitlab.com/help/user/project/service_desk#using-customized-email-templates) änderbar.

Über die Datei `.gitlab/issue_templates/Feedback.md` wird neuen Issues automatisch das Label "Feedback" hinzugefügt.
Per [GitLab Quick Actions](https://docs.gitlab.com/ee/user/project/quick_actions.html) können bei Bedarf weitere Aktionen automatisch ausgeführt werden. 
