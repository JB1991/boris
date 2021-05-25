# 11. Mapbox zu MapLibre

Date: 2021-05-17

## Status

Proposed

## Context

Wir verwenden zur Kartendarstellung [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs). Ab der Version 2 ändert sich das Lizenzmodell, wodurch ab [50.000 Karteninitialisierungen](https://www.mapbox.com/pricing/) Kosten fällig werden. 
Mapbox hat sich einen Namen bei der Verwendung von Vector Tiles gemacht; es existieren kaum Alternativen. Da andere Nutzer der Bibliothek vor einem ähnlichen Problem stehen, wurde ein Fork der Projekte von Mapbox unter dem Namen [Maplibre](https://github.com/maplibre) durchgeführt. 
Es ist zu klären, ob Mapbox durch Maplibre ersetzt werden soll. 

## Decision

Wir setzen auf Maplibre. Das Lizenzmodell von Mapbox ist für das LGLN keine Option. Wir stellen möglichst früh um, um auf Probleme von Mablibre reagieren zu können.

## Consequences

Es besteht das Risiko, dass Maplibre nicht weitergeplegt wird, was zu Inkompatibilitäten mit anderen Abhängigkeiten wie z.B. Typescript langfristig führen könnte. Dem entgegen spricht, dass sich einige Nutzer ebenfalls nicht auf das Lizenzmodell einlassen werden. Zur Pflege erklärten sich u.A. die französischen Universitäten [Human Sciences Institute in Brittany](https://www.mshb.fr/human-sciences-institute-brittany) und [Université RENNE 2](https://international.univ-rennes2.fr/), sowie der Kartendienstleister [Maptiler](https://www.maptiler.com/), bereit.
Wir können die Kosten vermeiden.
Die Umstellung hat für uns die Konsequenz, dass das Paket [ngx-mapbox-gl](https://www.npmjs.com/package/ngx-mapbox-gl) nicht mehr genutzt werden kann. Da es hierfür keinen Fork gibt, sollte die Bibliothek direkt verwendet werden.

## Details

Kosten entstehen ab einer Nutzung von 50.000 Initialisierungen der Karte im Browser. Wenn man annimmt, dass eine Nutzerin 10x den Browser refreshed oder mehrere Tabs verwendet, können 5000 Nutzer im Monat unsere Seite verwenden. Somit kommen wir auf 167 Nutzer pro Tag, was eine überschaubare Größe ist. 
Da das LGLN keine Non-Profit-Organisation ist, ist die Nutzung Zahlungspflichtig. Es konnte nicht geklärt werden, ob das gesamte LGLN gemeinsam oder jedes Projekt gesondert einen Access Token benötigt.
