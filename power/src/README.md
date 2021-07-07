# Immobilienmarkt.NI

## Datei `.browserslistrc`

Diese Datei enthält die vorgegebende Browserunterstützung für den SCSS Compiler.

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

[Mehr dazu](https://gitlab.com/lgln/power.ni/coding-guidelines/seo#robotstxt)

## Datei `sitemap.xml`

Die `sitemap.xml` gibt den Crawlern eine Liste von öffentlichen Seiten unserer Anwendung, welche indiziert werden sollen.

**Wenn eine neue öffentliche Route hinzugefügt wird, sollte diese ebenfalls hier eingetragen werden!**

[Mehr dazu](https://gitlab.com/lgln/power.ni/coding-guidelines/seo#sitemapxml)

## Datei `styles.scss`

Dies ist die Hauptstyledatei der Anwendung.

## Datei `test.ts`

Über diese Datei kann man regeln, welche Tests ausgeführt werden, um nur spezifische Tests auszuführen.

```diff
-const context = require.context('./', true, /\.spec\.ts$/);
+const context = require.context('./app/fragebogen', true, /\.spec\.ts$/);
```
