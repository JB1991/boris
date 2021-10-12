# Static

Im Static Modul befinden sich einzelne allgemeine Seiten, die zu keinem anderen Modul dazu gehören.


## Feedback

Benutzer können uns über den Link "Rückmeldung geben" Feedback senden.
Dieses wird über die dort stehende E-Mail-Adresse an den [Service Desk](https://gitlab.com/lgln/power.ni/power-frontend/-/issues/service_desk) in diesem Repository weitergeleitet und automatisch in ein Issue konvertiert.
Wenn wir das Issue kommentieren, erhält der Benutzer die Antwort per Mail, sodass eine beidseitige Kommunikation möglich ist.
Auch Screenshots können die Nutzer senden.

Ein Nachteil ist, dass die Benutzer folgende Auto-Response erhalten: `Thank you for your support request! We are tracking your request as ticket #1, and will respond as soon as we can.`

Die Auto-Response ist nur mit dem [kostenpflichtigen GitLab-Premium](https://about.gitlab.com/pricing/) über [E-Mail-Templates](https://gitlab.com/help/user/project/service_desk#using-customized-email-templates) änderbar.

Über die Datei `.gitlab/issue_templates/Feedback.md` wird neuen Issues automatisch das Label "Feedback" hinzugefügt.
Per [GitLab Quick Actions](https://docs.gitlab.com/ee/user/project/quick_actions.html) können bei Bedarf weitere Aktionen automatisch ausgeführt werden.


## Login

Die Loginseite leitet zum IAM-Provider weiter und verarbeitet die Accesstokens, nach erfolgreichem Login des Benutzers.


## Logout

Die Logoutseite leutet zum IAM-Provider weiter, um den Benutzer auszuloggen.


## Notfound

Eine statische 404 Not Found Seite vom Frontend.


## OGC-Services

Eine statische Informationsseite über die OGC Datendienste des LGLN.


## Start

Die statische Startseite / Landingpage vom Frontend.


## Open-Source-Libraries

Auflistung der verwendeten Open Source Libraries. Die Tabelle wird durch das Parsen der Datei 3rdpartylicenses.txt realisiert. Die Datei existiert nur bei einem Build, als nicht durch
   ```
   ng serve
   ```
Um die Tabelle in der Entwicklungsumgebung zu sehen, wird wie folgt umgegangen:

1. Build erstellen
   ```
   npm build
   ```
2. HTTP Server installieren
   ```
   npm install -g http-server
   ```
3. HTTP Server starten
   ```
   http-server ./dist/power/browser/de
   ```
