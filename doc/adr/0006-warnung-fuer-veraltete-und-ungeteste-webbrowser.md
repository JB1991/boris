# 1. Warnung für veraltete und ungeteste Webbrowser

Date: 2021-01-14

## Status

Accepted

## Context

Wir wollen eine Warnung anzeigen für alle Webbrowser, die mit unserer Anwendung bekanntermaßen inkompatibel oder ungetestet sind.

## Decision

Eine triviale prüfung des User Agent vom Webbrowser ist ungenügend, siehe [diesem Artikel](https://developer.mozilla.org/en-US/docs/Web/HTTP/Browser_detection_using_the_user_agent) von Mozilla.
Daher wird stattdessen zur Prüfung das [Angular CDK Plattform Module](https://material.angular.io/cdk/platform/api) verwendet werden.

## Consequences

Dieses Modul erspart uns eine Eigenentwicklung, sowie das aufwändige testen und die zukünftige Wartung. Dazu wird keine neue Bibliothek benötigt, da wir das Angular CDK bereits verwenden.
