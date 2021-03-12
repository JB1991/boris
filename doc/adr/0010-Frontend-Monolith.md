# 9. Frontend Monolith vs. Frontend Microservices

Date: 2021-03-09

## Status

Accepted

## Context

Nach der Microservices-Architektur sollen alle Services nur eine konkrete Aufgabe erfüllen und unabhängig von anderen Services sein. Dieses Prinzip halten wir aktuell bei den Backend-Services ein. Im Frontend wird jedoch ein Monolith, der alle Module/Services bereitstellt. Hier kam die Frage/Diskussion auf, ob ebenfalls einzelne Frontends für jedes Modul eingerichtet werden sollen.

## Decision

Da es aktuell noch nicht sehr viele Module und diese auch sehr übersichtlich sind, wurde beschlossen, weiterhin auf einen Frontend Monolithen zu setzen.

Vorteile:
- einheitliches Design für alle Module
- einheitliche Konfiguration
- geteilte Komponenten können direkt in allen Modulen verwendet werden (bei einzelnen Frontends müssten diese über einen Packagemanager installiert werden)
- Gute Performance durch Lazy Loading möglich
- 

## Consequences

- Fehler in einem Service/Modul führt zu Ausfällen bei allen anderen (Entwicklung nicht im Betrieb)
- Wachsendes System später aufteilen wird schwieriger/aufwändiger
- Versionen müssen in allen Modulen identisch sein
