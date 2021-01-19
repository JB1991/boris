## Strukturen und Konfiguration der NiPix Applikation

### Abhängigkeiten
  * [ngx-bootstrap](https://valor-software.com/ngx-bootstrap/#/)
  * [ngx-bootstrap-icons](https://www.npmjs.com/package/ngx-bootstrap-icons)
  * [ECharts](https://www.npmjs.com/package/echarts)

### Projektstruktur
Die Anwendung besteht aus mehreren Quelldateien:
*  immobilien.component.ts / immobilien.component.html / immobilien.component.scss<br>
*Dieses sind die Hauptdateien der Anwendung und beinhaltet den Grundaufbau sowie Eventhandler.* 

*  immobilien.chatoptions.ts<br>
*Diese Datei stellt die Konfiguration der Echarts Komponente bereit und beinhaltet hierfür die Funktionen "getMapOptions", "getChartOptions" und "getChartOptionsMerge".<br> 
Die einzelnen Konfigurationsobjekte werden hierbei aus folgenden Dateien entnommen:*

*  immobilien.chartoptions-mapoptions.ts<br>
*Konfiguration für die Karte*

*  immobilien.chartoptions-chartoptions.ts<br>
*Konfiguration für den Graphen*

*  immobilien.chartoptions-printoptions.ts<br>
*Konfiguration für die Druckansicht bzw. Bildexport*

*  immobilien.export.ts<br>
*Funktionen für den Export der Karte (exportMapAsImage, exportGeoJson) sowie des Graphen (exportAsImage, exportAsImageFinish, exportNiPixGeoJson)*

*  immpobilien.formatter.ts<br>
*Funktionen für die Formatierung von Labels in der Karte (mapTooltipForamtter) und dem Graphen (chartTooltipFormatter, formatLabel, formatLegend, getSeriesLabel, getSeriesColor, simpleLegend, graphicLegend)*

*  immpbilien.helper.ts<br>
*diverse Hilfsfunktionen (convertRemToPixels, componentToHex, rgbToHex, convertColor, modifyColor, appendLeadingZeroes, getDate, parseStringAsFloat, downloadFile, resolve, convertArrayToCSV, getSingleFeature, getGeometryArray)*

*  immpbilien.utils.ts<br>
*Anwendungsspezifische Hilfsfunktionen (getDateArray, getMyMapRegionenGR, getMyMapRegionen, genertateSeriesGS, generateSeries, generateDrawSeriesData, generateTextElement, generateDotElement, modifyRegionen, dispatchMapSelect)*

*  immobilien.static.ts<br>
*Statische Nipix-Anwendungskonfiguration und Daten. Beinhaltet Funktionen zum laden bzw. parsen der externen Konfiguration (loadConfig), Gemeinden (parseGemeinden), GeoJSON mit NipixDaten (procMap) und stellt diese statische Konfiguration der Anwendung zur Verfügung*

*  immobilien.runtime.ts<br>
*Laufzeitkonfiguration der Nipix-Anwendung. Beinhaltet Funktionen zum Erzeugen und Ändern von Laufzeitdaten (translage, translateArray, resetDrawPresets, updateAvailableNipixCategories, updateAvailableQuartal, toggleNipixCategory, getDrawPreset, highlightTimeout, resetHighlight, highlightSeries, calculateDrawData, updateRange, updateMapSelect).*

*  immobilien.runtime-calculator.ts<br>
*Funktionen zur Berechnung von Laufzeitdaten: calculateDrawData*

### Installation

Die Installation ist als Bestandteil des BORIS.NI Projektes gedacht (nähere Details bitte diesem Projekt entnehmen) ~~oder kann Wahlweise auch als Standalone-Applikation genutzt werden~~.

### Komponenten-API-Dokumentation

- [immobilien-routing.module](doc/modules/immobilien-routing.immobilien_routing_module.md)
- [immobilien.module](doc/modules/immobilien.immobilien_module.md)
- [immobilien/immobilien.chartoptions](doc/modules/immobilien/immobilien.immobilien_immobilien_chartoptions.md)
- [immobilien/immobilien.chartoptions-chartoptions](doc/modules/immobilien/immobilien.immobilien_immobilien_chartoptions_chartoptions.md)
- [immobilien/immobilien.chartoptions-mapoptions](doc/modules/immobilien/immobilien.immobilien_immobilien_chartoptions_mapoptions.md)
- [immobilien/immobilien.chartoptions-printoptions](doc/modules/immobilien/immobilien.immobilien_immobilien_chartoptions_printoptions.md)
- [immobilien/immobilien.component](doc/modules/immobilien/immobilien.immobilien_immobilien_component.md)
- [immobilien/immobilien.export](doc/modules/immobilien/immobilien.immobilien_immobilien_export.md)
- [immobilien/immobilien.formatter](doc/modules/immobilien/immobilien.immobilien_immobilien_formatter.md)
- [immobilien/immobilien.helper](doc/modules/immobilien/immobilien.immobilien_immobilien_helper.md)
- [immobilien/immobilien.runtime](doc/modules/immobilien/immobilien.immobilien_immobilien_runtime.md)
- [immobilien/immobilien.runtime-calculator](doc/modules/immobilien/immobilien.immobilien_immobilien_runtime_calculator.md)
- [immobilien/immobilien.static](doc/modules/immobilien/immobilien.immobilien_immobilien_static.md)
- [immobilien/immobilien.utils](doc/modules/immobilien/immobilien.immobilien_immobilien_utils.md)


### Konfiguration

Im Quellcode der NiPix Applikation haben Sie die Möglichkeit einen URL zu einer Konfigurationsdatei für die Applikation anzugeben. Diese Konfigurationsdatei verwaltet die komplette Konfiguration der Anwendung inklusieve Datenquellen, Presets, Farben und Typos

#### Konfigurationsdatei: cfg.json

*  "layoutRtl": Gibt an, ob das Layout von rechts nach links aufgebaut werden soll, also sich der Graph/Map auf der rechten Seite befinden soll oder nicht.
```
        "layoutRtl": false
```

*  "mapUrl": URL zur geojson der Karte
```
        "mapUrl": "assets/data/womareg.geojson"
```

*  "gemeindenUrl": URL zum Gemeinden->Wohnungsmarktregionen Mapping File (CSV)
```
        "gemeindenUrl": "assets/data/gemeinden.csv"
```

*  "shortNames": Objekt mit benutzerspezifischen Kurzbezeichnungen (z.B. für Graphen) für einen gegebenen Namen.
```
        "shortNames" : {
                "Eigenheime": "EH",
                "Eigentumswohnungen" : "EW",
                "städtische Regionen" : "SR",
                "ländliche Regionen" : "LR"
        }
```

*  "items": Verwendbare Regionen in gewünschter geordneter Reihenfolge
```
	"items": ["4205", "4206", "4201", "4203", "4204", "4208", "4106", "4104", "4108", "4105", "4109", "4103", "4102", "4107", "4101", "4110"]
```

*  "presets" (Array of Objects): Geordnete Liste aller zur Verfügung stehenen Presets mit Name, Type (single = einzeldarstellung, aggr = gewichtetes Mittel), nipixCategory, verwendere Regionen (values), ggf. Farbe (für Tyoe aggr)
```
	"presets": [
		{
			"name": "Einzeldarstellung",
			"type": "single",
			"nipixCategory": "gebrauchte Eigenheime",
			"show": true,
			"values": ["4205", "4206", "4201", "4203", "4204", "4208", "4106", "4104", "4108", "4105", "4109", "4103", "4102", "4107", "4101", "4110"],
			"colors": []
		},
		{
			"name": "Eigenheime",
			"type": "aggr",
			"nipixCategory": "gebrauchte Eigenheime",
			"show": false,
			"values": ["4205", "4206", "4201", "4203", "4204", "4208", "4106", "4104", "4108", "4105", "4109", "4103", "4102", "4107", "4101", "4110"],
			"colors": "rgb(214,39,40)"
		},
		{
			"name": "Eigentumswohnungen",
			"type": "aggr",
			"nipixCategory": "gebrauchte Eigentumswohnungen",
			"show": false,
			"values": ["4205", "4206", "4201", "4203", "4204", "4208", "4106", "4104", "4108", "4105", "4109", "4103", "4102", "4107", "4101", "4110"],
			"colors": "rgb(255,127,14)"
		},
		{
			"name": "städtische Regionen",
			"type": "aggr",
			"nipixCategory": "gebrauchte Eigenheime",
			"show": false,
			"values": ["4205", "4206", "4201", "4203", "4204", "4208", "4106", "4104"],
			"colors": "rgb(214,39,40)"
		},
		{
			"name": "ländliche Regionen",
			"type": "aggr",
			"show": false,
			"nipixCategory": "gebrauchte Eigenheime",
			"values": ["4108", "4105", "4109", "4103", "4102", "4107", "4101", "4110"],
			"colors": "rgb(44,160,44)"
		},
		{
			"name": "1",
			"type": "aggr",
			"show": false,
			"nipixCategory": "gebrauchte Eigenheime",
			"values": [],
			"colors": "rgb(214,39,40)"
		},
		{
			"name": "2",
			"type": "aggr",
			"show": false,
			"nipixCategory": "gebrauchte Eigenheime",
			"values": [],
			"colors": "rgb(170,135,128)"
		},
		{
			"name": "3",
			"type": "aggr",
			"show": false,
			"nipixCategory": "gebrauchte Eigenheime",
			"values": [],
			"colors": "rgb(225,127,14)"
		},
		{
			"name": "4",
			"type": "aggr",
			"show": false,
			"nipixCategory": "gebrauchte Eigenheime",
			"values": [],
			"colors": "rgb(107,107,107)"
		},
		{
			"name": "5",
			"type": "aggr",
			"show": false,
			"nipixCategory": "gebrauchte Eigenheime",
			"values": [],
			"colors": "rgb(219,219,141)"
		}


	]
```

*  "selections" (Array of Objects): Geordnete Liste von möglichen Auswahlkategorien unter Angabe des Namens, des Typs
    - single: Auswahl einzelner Regionen (siehe preset single)
    - multi: Auswahl mehrerer Presets als aggr. Kurve
    - multiIndex: wie multi, jedoch mit zusätzlicher Wahl des Index-Types 
    - multiSelect: wie multi, jedoch mit Auswahl der einzelnen Regionen (ähnl. single) 
 sowie der verwendeten Presets:

```
 	"selections": [
		{
			"name": "Preisentwicklung nach Städten und Regionen",
			"type": "single",
			"preset": ["Einzeldarstellung"]
		},
		{	"name": "Preisentwicklung Niedersachsen, gesamt",
			"type": "multi",
			"preset": ["Eigenheime", "Eigentumswohnungen"]
		},
		{	"name": "Vergleich Preisentwicklung von Städten und Regionen",
			"type": "multiIndex",
			"preset": ["städtische Regionen","ländliche Regionen"]
		},
		{
			"name": "Vergleich zusammengefasster Regionen",
			"type": "multiSelect",
			"preset": ["1", "2", "3", "4", "5"],
			"selected": 1
		}
	] 
```	

#### Gemeinden CSV Datei

Die Gemeinden CSV Datei hat folgendes Format:

*  Spaltentrenner: Simikolon

*  keine Anführungszeichen oder ähnliches zum einfassen des Feldinhaltes

```	
	AGS;Geme_Bezeichnung;WOMA_ID
	3462001;Blomberg;4101
	3462002;Dunum;4101
	...
```

