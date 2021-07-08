# Shared

Im Shared Modul befinden sich häufig genutzte Komponenten, die überall im Frontend benötigt werden. Es dient somit der einfachen wiederverwendbarkeit von Code, in dem dieser Code als Komponente hier ausgelagert wird.


## Advanced Search

TODO


## Alertsmodul

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


## Authentifizierungsmodul

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


## Geosearch

* Funktionen
  * Adresssuche (Von Adresse zu Geokoordinaten)
  * Reverse Geocoding (Von Geokoordinaten zu Adresse)
* Verwendung in dem Modul Bodenrichtwerte
* Weiterleitung der Anfragen per nginx Reverse Proxy an den BKG Geocoder (siehe Abhängigkeiten)
* Abhängigkeiten:
  * [BKG GeoCoder](https://www.bkg.bund.de/SharedDocs/Produktinformationen/BKG/DE/P-2015/150119-Geokodierung.html)
  * [RxJS](https://angular.io/guide/rx-library)
  * [GeoJSON](https://www.npmjs.com/package/geojson)


## Loadingscreenmodul

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


## Markdown-Instructions

TODO


## Modal

Eine fullscreen Modalkomponente fürs Frontend.


## Modalmini

Eine Modalkomponente für die Bootstrap Modals.


## Pipes

TODO


## SEO

Ein SEO Service für das Frontend.


## Tagbox

Eine Tag-Auswahl Komponente fürs Frontend.
