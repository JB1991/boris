# Portal für Wertermittlungsinformationen

[![pipeline status](https://gitlab.com/lgln/power.ni/power-frontend/badges/master/pipeline.svg)](https://gitlab.com/lgln/power.ni/power-frontend/-/commits/master)
[![coverage report](https://gitlab.com/lgln/power.ni/power-frontend/badges/master/coverage.svg)](https://gitlab.com/lgln/power.ni/power-frontend/-/commits/master)

In diesem Projekt wird gemeinsam an einer Plattform zur Visualisierung von Wertermittlungsinformationen gearbeitet.
Diese Plattform wird in Form einer Single-Page-Application (SPA) realisiert, die weitere Dienste (für z.B. Daten oder 
Geokodierung) einbindet. 

Entwickelt wird dieses Projekt vom Landesamt für Geoinformation und Landesvermessung Niedersachsen (LGLN).

# Voraussetzungen

1. git
2. node
3. npm
4. ng
5. docker

# Getting started

1. Projekt klonen  
    ```
   git clone ... 
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
 
# Tests

1. Unit-Tests ausführen
   ```
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

# CI/CD
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

# Configuration

## Active Modules
To enable or disable specific modules in runtime, you can add or remove module names from [config.json](src/assets/config.json). 
These values have to match [app.component.html](src/app/app.component.html). The config.json file can be changed in the final artifact.
