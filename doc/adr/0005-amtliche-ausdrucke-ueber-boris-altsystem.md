# 1. Amtliche Ausdrucke über BORIS-Altsystem

Date: 2020-12-18

## Status

Accepted

## Context

Das MI fordert für die Produktivschaltung eine amtliche Druckfunktion in BORIS mobile.

## Decision

Da nicht ausreichend Zeit vorhanden ist, um eine Neuentwicklung der amtlichen Druckfunktion durchzuführen, wird für amtliche Ausdrucke das BORIS Altsystem per Reverse Proxy über eine API angesprochen. Das Altsystem stellt somit die Ausdrucke zur Verfügung.

**Derzeit verwenden wir die BORIS Testinstanz, welche noch Authentifizierung erfordert. Zur Produktivschaltung muss auf die Produktivinstanz umgestellt werden, die Authentifizierung wird ebenfalls wegfallen.**

## Consequences

Diese Übergangslösung ermöglicht es uns einen amtlichen Ausdruck einzubauen, sodass der Termin für die Produktivschaltung eingehalten wird. Die Altanwendung ist langsam, sodass die Ausdrucke einige Sekunden zum laden brauchen.
