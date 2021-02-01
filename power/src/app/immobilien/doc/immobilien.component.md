[immobilien](../README.md) / ImmobilienComponent

# Class: ImmobilienComponent

## Hierarchy

* **ImmobilienComponent**

## Implements

* *OnInit*

## Table of contents

### Constructors

- [constructor](immobilien.component.md#constructor)

### Properties

- [accOpen](immobilien.component.md#accopen)
- [chart\_range](immobilien.component.md#chart_range)
- [configUrl](immobilien.component.md#configurl)
- [mapLoaded](immobilien.component.md#maploaded)
- [nipixRuntime](immobilien.component.md#nipixruntime)
- [nipixStatic](immobilien.component.md#nipixstatic)
- [selectedWoMa](immobilien.component.md#selectedwoma)
- [selectedWoMaValue](immobilien.component.md#selectedwomavalue)
- [title](immobilien.component.md#title)

### Methods

- [chartClicked](immobilien.component.md#chartclicked)
- [getCustomColor](immobilien.component.md#getcustomcolor)
- [initNipix](immobilien.component.md#initnipix)
- [loadConfig](immobilien.component.md#loadconfig)
- [loadGemeinden](immobilien.component.md#loadgemeinden)
- [loadGeoMap](immobilien.component.md#loadgeomap)
- [ngOnInit](immobilien.component.md#ngoninit)
- [onChangeCat](immobilien.component.md#onchangecat)
- [onChangeQuartal](immobilien.component.md#onchangequartal)
- [onChartChartInit](immobilien.component.md#onchartchartinit)
- [onChartFinished](immobilien.component.md#onchartfinished)
- [onChartInit](immobilien.component.md#onchartinit)
- [onClickDrawRoot](immobilien.component.md#onclickdrawroot)
- [onDataZoom](immobilien.component.md#ondatazoom)
- [onMapSelectChange](immobilien.component.md#onmapselectchange)
- [onPanelChangeIndex](immobilien.component.md#onpanelchangeindex)
- [onPanelChangeWoMa](immobilien.component.md#onpanelchangewoma)
- [onSelectWoMa](immobilien.component.md#onselectwoma)
- [onSetNumber](immobilien.component.md#onsetnumber)
- [onSetSpecificDraw](immobilien.component.md#onsetspecificdraw)
- [onToggleDrawRoot](immobilien.component.md#ontoggledrawroot)
- [regionName](immobilien.component.md#regionname)
- [selectSingle](immobilien.component.md#selectsingle)
- [setMapOptions](immobilien.component.md#setmapoptions)
- [staticChange](immobilien.component.md#staticchange)
- [staticExpand](immobilien.component.md#staticexpand)
- [toggleAllSelect](immobilien.component.md#toggleallselect)
- [toggleMapSelect](immobilien.component.md#togglemapselect)
- [toggleNipixCategory](immobilien.component.md#togglenipixcategory)
- [updateChart](immobilien.component.md#updatechart)
- [updateChartMerge](immobilien.component.md#updatechartmerge)
- [updateMapSelect](immobilien.component.md#updatemapselect)

## Constructors

### constructor

\+ **new ImmobilienComponent**(`http`: *HttpClient*, `titleService`: *Title*, `cdr`: *ChangeDetectorRef*): [*ImmobilienComponent*](immobilien.component.md)

Constructor:

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`http` | *HttpClient* | Inject HttpClient   |
`titleService` | *Title* | Service for settings the title of the HTML document    |
`cdr` | *ChangeDetectorRef* | - |

**Returns:** [*ImmobilienComponent*](immobilien.component.md)

Defined in: immobilien/immobilien.component.ts:37

## Properties

### accOpen

• **accOpen**: {}

Defined in: immobilien/immobilien.component.ts:37

___

### chart\_range

• **chart\_range**: *any*

echart_range_series

Defined in: immobilien/immobilien.component.ts:114

___

### configUrl

• **configUrl**: *string*= 'assets/data/cfg.json'

Defined in: immobilien/immobilien.component.ts:28

___

### mapLoaded

• **mapLoaded**: *boolean*= false

Defined in: immobilien/immobilien.component.ts:56

___

### nipixRuntime

• **nipixRuntime**: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)

Defined in: immobilien/immobilien.component.ts:34

___

### nipixStatic

• **nipixStatic**: [*NipixStatic*](immobilien.static.nipixstatic.md)

Defined in: immobilien/immobilien.component.ts:31

___

### selectedWoMa

• **selectedWoMa**: *string*

Defined in: immobilien/immobilien.component.ts:59

___

### selectedWoMaValue

• **selectedWoMaValue**: *string*

Defined in: immobilien/immobilien.component.ts:60

___

### title

• **title**: *string*= 'lgln'

Defined in: immobilien/immobilien.component.ts:53

## Methods

### chartClicked

▸ **chartClicked**(`event`: *any*): *void*

Focus single ChartLine

#### Parameters:

Name | Type |
------ | ------ |
`event` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:507

___

### getCustomColor

▸ **getCustomColor**(`name`: *any*): *any*

Get custom color

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | *any* | draw name    |

**Returns:** *any*

color Color

Defined in: immobilien/immobilien.component.ts:617

___

### initNipix

▸ **initNipix**(): *void*

Init the Application.
Load external Config File

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:127

___

### loadConfig

▸ **loadConfig**(`url`: *any*): *void*

Handle Load Configuration

Format: JSON

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`url` | *any* | Url to Configuration    |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:139

___

### loadGemeinden

▸ **loadGemeinden**(`url`: *any*): *void*

Handle Load Gemeinden

Format CSV; Seperator: Semikolon;
Fields: AGS, Geme_Bezeichnung, WOMA_ID

**`params`** {string} url Url to Gemeinnde CSV

#### Parameters:

Name | Type |
------ | ------ |
`url` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:170

___

### loadGeoMap

▸ **loadGeoMap**(`url`: *any*): *void*

Load Map

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`url` | *any* | Url to Map GeoJSON    |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:187

___

### ngOnInit

▸ **ngOnInit**(): *void*

Init the Application.

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:119

___

### onChangeCat

▸ **onChangeCat**(`index`: *any*, `cat`: *any*): *void*

Change between NiPix Category (Eigenheime, Wohnungen)

#### Parameters:

Name | Type |
------ | ------ |
`index` | *any* |
`cat` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:363

___

### onChangeQuartal

▸ **onChangeQuartal**(`start`: *any*, `end`: *any*): *void*

Manually change Quartal

#### Parameters:

Name | Type |
------ | ------ |
`start` | *any* |
`end` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:389

___

### onChartChartInit

▸ **onChartChartInit**(`ec`: *any*): *void*

Gets chart element for Chart

#### Parameters:

Name | Type |
------ | ------ |
`ec` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:344

___

### onChartFinished

▸ **onChartFinished**(`ec`: *any*): *void*

Finish Randering

#### Parameters:

Name | Type |
------ | ------ |
`ec` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:355

___

### onChartInit

▸ **onChartInit**(`ec`: *any*): *void*

Gets chart element for map

#### Parameters:

Name | Type |
------ | ------ |
`ec` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:333

___

### onClickDrawRoot

▸ **onClickDrawRoot**(`name`: *any*): *void*

Switch between multiple Draw Items

#### Parameters:

Name | Type |
------ | ------ |
`name` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:407

___

### onDataZoom

▸ **onDataZoom**(`event`: *any*): *void*

Handle Chart DataZoom

#### Parameters:

Name | Type |
------ | ------ |
`event` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:492

___

### onMapSelectChange

▸ **onMapSelectChange**(`param`: *any*): *void*

Handle the Change of an Selection in the Map

#### Parameters:

Name | Type |
------ | ------ |
`param` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:244

___

### onPanelChangeIndex

▸ **onPanelChangeIndex**(`selection_id`: *number*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`selection_id` | *number* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:526

___

### onPanelChangeWoMa

▸ **onPanelChangeWoMa**(): *void*

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:514

___

### onSelectWoMa

▸ **onSelectWoMa**(): *void*

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:73

___

### onSetNumber

▸ **onSetNumber**(`selectname`: *any*, `count`: *any*): *void*

Set amount (count) of drawable items (multiSelect)

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`selectname` | *any* | Name of the selection   |
`count` | *any* | Amount    |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:654

___

### onSetSpecificDraw

▸ **onSetSpecificDraw**(`preset`: *any*, `count`: *any*): *void*

Set show for a specific preset and count

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`preset` | *any* | Array of preset   |
`count` | *any* | Amount of items    |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:633

___

### onToggleDrawRoot

▸ **onToggleDrawRoot**(`name`: *any*): *void*

Toggle Show of Draw Item

#### Parameters:

Name | Type |
------ | ------ |
`name` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:416

___

### regionName

▸ **regionName**(`id`: *any*): *any*

Get the Region Name for "Find My WoMaReg".
Handle found WoMaReg.

#### Parameters:

Name | Type |
------ | ------ |
`id` | *any* |

**Returns:** *any*

WoMaReg Name

Defined in: immobilien/immobilien.component.ts:597

___

### selectSingle

▸ **selectSingle**(): *any*

**Returns:** *any*

Defined in: immobilien/immobilien.component.ts:62

___

### setMapOptions

▸ **setMapOptions**(`selectType?`: *any*): *void*

Set Map Options

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`selectType` | *any* | 'multiple' |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:223

___

### staticChange

▸ **staticChange**(`id`: *any*, `event`: *any*): *void*

Change Static Expand

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`id` | *any* | id of the tab   |
`event` | *any* | boolean is Opened    |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:700

___

### staticExpand

▸ **staticExpand**(`id`: *any*): *boolean*

Check Static Expand

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`id` | *any* | id of the tab    |

**Returns:** *boolean*

Defined in: immobilien/immobilien.component.ts:686

___

### toggleAllSelect

▸ **toggleAllSelect**(`drawname`: *any*): *void*

Toggle All for specific draw

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`drawname` | *any* | Name of the draw Object    |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:572

___

### toggleMapSelect

▸ **toggleMapSelect**(`category`: *any*, `name`: *any*, `typ?`: *string*): *void*

Toggle the Selection of an Subitem

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`category` | *any* | - |
`name` | *any* | - |
`typ` | *string* | 'undefined' |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:292

___

### toggleNipixCategory

▸ **toggleNipixCategory**(`drawname`: *any*): *void*

Toggle the NiPix Category (Eigenheime/Eigentumswohnungen) for a specific draw object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`drawname` | *any* | Name of the draw object.    |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:676

___

### updateChart

▸ **updateChart**(`start?`: *any*, `end?`: *any*): *void*

Update Chart

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`start` | *any* | null |
`end` | *any* | null |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:428

___

### updateChartMerge

▸ **updateChartMerge**(`range_start`: *any*, `range_end`: *any*, `subAdd`: *any*, `range_text`: *any*): *void*

Update Chart

#### Parameters:

Name | Type |
------ | ------ |
`range_start` | *any* |
`range_end` | *any* |
`subAdd` | *any* |
`range_text` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:462

___

### updateMapSelect

▸ **updateMapSelect**(`id?`: *any*): *void*

Update the Selectiopn of the Map aware of the activer Draw Item

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`id` | *any* | null |

**Returns:** *void*

Defined in: immobilien/immobilien.component.ts:325
