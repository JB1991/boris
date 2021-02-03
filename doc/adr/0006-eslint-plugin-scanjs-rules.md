# 1. eslint-plugin-scanjs-rules

Date: 2020-12-17

## Status

Accepted

## Context

Wir wollen mittels Static application security testing (SAST) nach Sicherheitslücken im Programmcode suchen.

## Decision

ESLint führt bereits einfache Codeanalysen durch und soll durch ein Plugin erweitert werden. Christian Schneider hat uns eslint-plugin-scanjs-rules empfohlen.

Dieses Plugin wird von Mozilla entwickelt und sucht nach potenziellen Sicherheitslücken im Code, es ist speziell auf client-side Webanwendungen ausgelegt. Daher ist dieses Plugin geeignet für unseren Einsatzzweck.

Folgende Regeln wurden global deaktiviert:
- `scanjs-rules/identifier_localStorage`: localStorage wird benötigt um die Session abzulegen. Die Regel warnt, dass die Verwendung unsicher sein kann.
- `scanjs-rules/property_geolocation`: geolocation ermöglicht die bestimmung der Position des Nutzers, für BORIS benötigt. Die Regel warnt, dass die Verwendung unsicher sein kann.

Andere false-positives werden im Code per Kommentar deaktiviert.

## Consequences

Das Plugin wird viele Warnungen zum Code ausgeben, die überprüft werden müssen, bevor Entwickler neuen Code einchecken. Es wird einige false-positives geben.
