## Verwendung NiPix Applikation

### Installation

Die Installation ist als Bestandteil des BORIS.NI Projektes gedacht (nähere Details bitte diesem Projekt entnehmen) oder kann Wahlweise auch als Standalone-Applikation genutzt werden.

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

*  "nipixUrl": URL zum (aktuellen) NiPix (csv)
```
        "nipixUrl": "assets/data/00- NIPX_Final_bis_2018_4.csv"
```

*  "gemeindenUrl": URL zum Gemeinden->Wohnungsmarktregionen Mapping File (CSV)
```
        "gemeindenUrl": "assets/data/gemeinden.csv"
```

*  "map": Konfinguration der Map
    * "geoCoordMap" (Array of Object): Elemente die als Punkt mit Titel auf der Karte dargestellt werden sollen. (z.B. Städte)
```
                     "geoCoordMap": [
                        {
                                "name": "Hannover",
                                "value": [553508, 5805402]
                        },
                        {
                                "name": "Braunschweig",
                                "value": [604181, 5792042]
                        },
                        {
                                "name": "Osnabrück",
                                "value": [435154, 5791143]
                        },
                        {
                                "name": "Oldenburg",
                                "value": [447464, 5888516]
                        },
                        {
                                "name": "Lüneburg",
                                "value": [593935, 5900862]
                        },
                        {
                                "name": "Göttingen",
                                "value": [564868, 5709487]
                        },
                        {
                                "name": "Aurich",
                                "value": [399429, 5925718]
                        },
                        {
                                "name": "Wolfsburg",
                                "value": [621464, 5809316]
                        }
                ]
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

*  "regionen": Regionen Mapping von RegionID auf Name, short(Name) und Farbe [R,G,B]
```
	"regionen": {
		"4101": {
			"name": "Küste, weiteres Umland",
			"short": "KÜ",
			"color": [158, 218, 229]
		},
		"4110": {
			"name": "Ostfriesische Inseln",
			"short": "IN",
			"color": [23, 190, 207]
		},
		"4104": {
			"name": "Bremer Umland",
			"short": "HB",
			"color": [255, 213, 213]
		},
		"4103": {
			"name": "Oldenburg, Münsterland, Osnabrück",
			"short": "OMO",
			"color": [157, 155, 61]
		},
		"4203": {
			"name": "Stadt Osnabrück (incl. städt. Gemeinden)",
			"short": "OS",
			"color": [214, 39, 40]
		},
		"4102": {
			"name": "Westliches Niedersachsen",
			"short": "WN",
			"color": [170, 135, 128]
		},
		"4201": {
			"name": "Stadt Oldenburg",
			"short": "OL",
			"color": [255, 127, 14]
		},
		"4105": {
			"name": "Mittleres Niedersachsen",
			"short": "MN",
			"color": [107, 107, 107]
		},
		"4107": {
			"name": "Östliches Niedersachsen",
			"short": "ÖN",
			"color": [219, 219, 141]
		},
		"4106": {
			"name": "Hamburger südliches Umland",
			"short": "HH",
			"color": [114, 114, 143]
		},
		"4108": {
			"name": "Hannover, Braunschweig, Wolfsburg",
			"short": "HBW",
			"color": [218, 182, 175]
		},
		"4109": {
			"name": "Südliches Niedersachsen",
			"short": "SN",
			"color": [44, 160, 44]
		},
		"4205": {
			"name": "Stadt Hannover",
			"short": "H",
			"color": [214, 39, 40]
		},
		"4208": {
			"name": "Stadt Göttingen (incl. städt. Gemeinden)",
			"short": "GÖ",
			"color": [255, 187, 120]
		},
		"4204": {
			"name": "Stadt Wolfsburg",
			"short": "WOB",
			"color": [214, 39, 40]
		},
		"4206": {
			"name": "Stadt Braunschweig",
			"short": "BS",
			"color": [225, 87, 89]
		}
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

#### NiPix CSV Datei

Die NiPix CSV Datei hat folgendes Format:

*  Spaltentrenner: Simikolon

*  keine Anführungszeichen oder ähnliches zum einfassen des Feldinhaltes
```
	Immobilienart;Region;Zeitabschnitt;Anzahl_Mittel;Index_final
	gebrauchte Eigenheime;4101;2000_1;249;
	gebrauchte Eigenheime;4101;2000_2;178;111,6395738
	...
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

