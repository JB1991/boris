# 1. eslint-plugin-scanjs-rules

Date: 2020-12-17

## Status

Accepted

## Context

Wir wollen mittels Static application security testing (SAST) nach Sicherheitslücken im Programmcode suchen.

## Decision

ESLint führt bereits einfache Codeanalysen durch und soll durch ein Plugin erweitert werden. Christian Schneider hat uns eslint-plugin-scanjs-rules empfohlen.

Dieses Plugin wird von Mozilla entwickelt und sucht nach potenziellen Sicherheitslücken im Code, es ist speziell auf client-side Webanwendungen ausgelegt. Daher ist dieses Plugin geeignet für unseren Einsatzzweck.

## Consequences

Das Plugin wird viele Warnungen zum Code ausgeben, die überprüft werden müssen, bevor Entwickler neuen Code einchecken. Es wird einige false-positives geben.
