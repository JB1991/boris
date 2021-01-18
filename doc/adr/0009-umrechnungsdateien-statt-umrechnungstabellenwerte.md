# 9. Umrechnungsdateien statt Umrechnungstabellen

Date: 2021-01-15

## Status

Accepted

## Context

Für Bodenrichtwertzonen gibt es sogenannte Umrechnungstabellen, bei denen der Bodenrichtwert abhängig von einer Einflussgröße ist. Es wird gefordert, die Umrechnungstabellen für die entsprechenden Zonen darzustellen. Umrechnungstabellen liegen zum einen als Umrechnungstabellenwerte in der Datenbank und als externe Datei (PDF/htm) vor. Die Daten der Umrechnungstabellenwerte sind jedoch fehlerhaft und müssen von den GAG geprüft und bereinigt werden. Darüber hinaus gibt es Sonderfälle, die mittels Umrechnungsdateien abgebildet wurden (teilweise nicht modellkonform) und aktuell nicht anders dargestellt werden können.

## Decision

Eine saubere Lösung wäre auf Basis der Umrechnungstabellenwerte eine eigene Darstellung zu implementieren. Da die Datenqualität der Umrechnungstabellenwerte dafür aber nicht ausreichend ist, wird vorerst auf die externen PDF-Dateien verlinkt.

## Consequences

- Deaktivieren des aktuellen Ansatzes (Eigene Darstellung der Umrechnungstabellenwerte)
- Verlinkung der externen Dateien (Abhängigkeit zu den externen Dateien)
