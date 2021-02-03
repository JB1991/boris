# 1. SurveyJS

Date: 2019-12-xx

## Status

Accepted

## Context

Es soll ein Prototyp entwickelt werden, um dynamische Fragebögen erstellen und ausfüllen zu können.

## Decision

[SurveyJS](https://github.com/surveyjs/survey-library) ermöglichte es schnell einen visuell ansprechenden Klickdummy zu erstellen, dieser konnte die Stakeholder überzeugen und wurde für die weitere zukünftige Entwicklung ausgewählt.

## Consequences

Die Bibliothek übernimmt das gesamte Frontend rendering der Fragebögen, sodass nur noch der Fragebogen-Editor entwickelt werden muss, dies beschleunigt die Entwicklung sehr. Es werden viele Funktionalitäten durch die Bibliothek bereitgestellt, dennoch wird die Bibliothek in bestimmten Bereichen zu Limitierungen führen. Die Bibliothek ist sehr flexibel und lässt sich stark an die eigenen Bedürfnisse anpassen.
