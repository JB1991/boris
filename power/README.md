# Portal für Wertermittlungsinformationen

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
   ng e2e
   ```
 
3. Audit ausführen
   ```
   npm audit
   ```

4. Code Climate ausführen (Analyse der Code-Qualität)
   ```
   docker pull codeclimate/codeclimate
   docker run -it --rm --env CODECLIMATE_CODE="$PWD" --volume "$PWD":/code --volume /var/run/docker.sock:/var/run/docker.sock --volume /tmp/cc:/tmp/cc codeclimate/codeclimate analyze
   ```
