# Immobilienmarkt.NI


## Verzeichnis `assets`

Dieses Verzeichnis enthält die Assets der Anwendung, **alle Dateien in diesem Verzeichnis werden in der späteren Anwendung deployt!** Es sollten nur notwendige Dateien in diesem Verzeichnis liegen.


## Verzeichnis `environments`

Hier liegen die unterschiedlichen Environments-Dateien für Dev/Staging/Prod. Hierbei handelt es sich um Konstanten mit Werten, die sich zwischen den Instanzen unterscheiden.


## Verzeichnis `locales`

Hier befinden sich die Sprachdefinitionen der Anwendung.


## Verzeichnis `testdata`

Hier liegen die Testdaten für die automatisierten Unit-Tests.


## Datei `.browserslistrc`

Diese Datei enthält die vorgegebene Browserunterstützung für den SCSS Compiler.


## Datei `favicon.ico`

Das Favicon der Anwendung.


## Datei `index.html`

Die HTML-Schale der Anwendung.


## Datei `manifest.webmanifest`

Das [Manifest](https://developer.mozilla.org/de/docs/Web/Manifest) für die Progressive Web App (PWA), dies enthält die Konfiguration für die Installierbare Webseite im Webbrowser.


## Datei `polyfills.ts`

Die Polyfills enthält hauptsächlich Backports von modernen JavaScript Funktionen (ES6 -> ES5) für ältere Webbrowser, wie der IE11 und Edge <78.


## Datei `robots.txt`

Die `robots.txt` gibt Crawlern vor, welche Unterseiten der Webseite sie nicht betreten dürfen und somit auch nicht indizieren (z.B. googlebot).

**Inhalte, die nicht in Suchmaschinen landen sollen, müssen hier eingetragen werden.**

[Mehr dazu](https://gitlab.com/lgln/power.ni/coding-guidelines/seo#robotstxt)


## Datei `sitemap.xml`

Die `sitemap.xml` gibt den Crawlern eine Liste von öffentlichen Seiten unserer Anwendung, welche indiziert werden sollen.

**Wenn eine neue öffentliche Route hinzugefügt wird, sollte diese ebenfalls hier eingetragen werden!**

[Mehr dazu](https://gitlab.com/lgln/power.ni/coding-guidelines/seo#sitemapxml)


## Datei `styles.scss`

Dies ist die haupt Style-Datei der Anwendung.

## Datei `test.ts`

Über diese Datei kann man regeln, welche Tests ausgeführt werden, um nur spezifische Tests auszuführen.

```diff
-const context = require.context('./', true, /\.spec\.ts$/);
+const context = require.context('./app/fragebogen', true, /\.spec\.ts$/);
```
