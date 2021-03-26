# Bodenrichtwert-Karte

## Labelling

Große Polygone werden beim Labelling falsch dargestellt und müssen daher für jeden Stichtag
in der doNotDisplay-Liste erfasst werden.

Die Polygone werden mit dem Map-View verschnitten, damit zu jedem Polygon Werte dargestellt
werden können.

Mit dem buffer kann die Darstellung der Labels maßgeblich gesteuert werden. Durch die
stufenweise Änderung dieses Wertes entlang der Zoom-Level soll das Herumspringen der Labels
etwas verhindert werden.

Beim Buffering können Multi-Polygone entstehen, sodass gerade bei kleinen Features viele Labels
angezeigt werden. Um das zu verhindern, werden jeweils nur 2 Polygone in der bufferPolygon-Funktion
weitergegeben. Es wird davon ausgegangen, dass das erste und letzte Polygon eines Multi-Polygons
meist weiter auseinander liegen.

```typescript
if (arr.length > 2) {
    return [arr.shift(), arr.pop()];
}
```
