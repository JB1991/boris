# 1. Feedback Datenhaltung über Gitlab

Date: 2020-12-04

## Status

Accepted

## Context

Auf der Feedbackseite soll von den Nutzern eingereichtest Feedback dargestellt werden. Dies soll redundantes Feedback verhindern.

## Decision

Das Feedback in Gitlab wird per RSS-Feed vom Frontend ausgelesen und auf der Feedbackseite dargestellt. Sensible Inhalt wie E-Mails und Telefonnummern werden automatisch durch Reguläre Ausdrücke zensiert.

Das Gitlab Respository muss hierfür öffentlich sein und wird für den Anwender versteckt, durch verwendung eines Reverse Proxys im Frontend. Dies ist notwendig, da Gitlab noch sensible Informationen anzeigt. Das Repository ist nicht über die Gitlabsuche auffindbar.

## Consequences

Schnelle Entwicklung einer Anzeige von Feedback, ohne Notwendigkeit eines eigenen Backends.
