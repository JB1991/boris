[power](../../doc.md) / [Exports](../../modules.md) / [immobilien/immobilien.runtime](../../modules/immobilien/immobilien.immobilien_immobilien_runtime.md) / NipixRuntime

# Class: NipixRuntime

[immobilien/immobilien.runtime](../../modules/immobilien/immobilien.immobilien_immobilien_runtime.md).NipixRuntime

## Hierarchy

* **NipixRuntime**

## Table of contents

### Constructors

- [constructor](immobilien.runtime.nipixruntime.md#constructor)

### Properties

- [availableNipixCategories](immobilien.runtime.nipixruntime.md#availablenipixcategories)
- [availableQuartal](immobilien.runtime.nipixruntime.md#availablequartal)
- [calculated](immobilien.runtime.nipixruntime.md#calculated)
- [calculator](immobilien.runtime.nipixruntime.md#calculator)
- [chart](immobilien.runtime.nipixruntime.md#chart)
- [drawPresets](immobilien.runtime.nipixruntime.md#drawpresets)
- [export](immobilien.runtime.nipixruntime.md#export)
- [formatter](immobilien.runtime.nipixruntime.md#formatter)
- [highlightedTimeout](immobilien.runtime.nipixruntime.md#highlightedtimeout)
- [locale](immobilien.runtime.nipixruntime.md#locale)
- [map](immobilien.runtime.nipixruntime.md#map)
- [nipixStatic](immobilien.runtime.nipixruntime.md#nipixstatic)
- [state](immobilien.runtime.nipixruntime.md#state)

### Methods

- [calculateDrawData](immobilien.runtime.nipixruntime.md#calculatedrawdata)
- [getDrawPreset](immobilien.runtime.nipixruntime.md#getdrawpreset)
- [highlightSeries](immobilien.runtime.nipixruntime.md#highlightseries)
- [highlightTimeout](immobilien.runtime.nipixruntime.md#highlighttimeout)
- [resetDrawPresets](immobilien.runtime.nipixruntime.md#resetdrawpresets)
- [resetHighlight](immobilien.runtime.nipixruntime.md#resethighlight)
- [toggleNipixCategory](immobilien.runtime.nipixruntime.md#togglenipixcategory)
- [translate](immobilien.runtime.nipixruntime.md#translate)
- [translateArray](immobilien.runtime.nipixruntime.md#translatearray)
- [updateAvailableNipixCategories](immobilien.runtime.nipixruntime.md#updateavailablenipixcategories)
- [updateAvailableQuartal](immobilien.runtime.nipixruntime.md#updateavailablequartal)
- [updateMapSelect](immobilien.runtime.nipixruntime.md#updatemapselect)
- [updateRange](immobilien.runtime.nipixruntime.md#updaterange)

## Constructors

### constructor

\+ **new NipixRuntime**(`niStatic`: [*NipixStatic*](immobilien.static.nipixstatic.md)): [*NipixRuntime*](immobilien.runtime.nipixruntime.md)

#### Parameters:

Name | Type |
------ | ------ |
`niStatic` | [*NipixStatic*](immobilien.static.nipixstatic.md) |

**Returns:** [*NipixRuntime*](immobilien.runtime.nipixruntime.md)

Defined in: immobilien/immobilien.runtime.ts:120

## Properties

### availableNipixCategories

• **availableNipixCategories**: *any*[]

Defined in: immobilien/immobilien.runtime.ts:66

___

### availableQuartal

• **availableQuartal**: *any*[]

Defined in: immobilien/immobilien.runtime.ts:64

___

### calculated

• **calculated**: NipixRuntimeCalculated

Defined in: immobilien/immobilien.runtime.ts:70

___

### calculator

• **calculator**: [*NipixRuntimeCalculator*](immobilien.runtime-calculator.nipixruntimecalculator.md)

Defined in: immobilien/immobilien.runtime.ts:41

___

### chart

• **chart**: NipixRuntimeMap

Defined in: immobilien/immobilien.runtime.ts:47

___

### drawPresets

• **drawPresets**: *any*[]

Defined in: immobilien/immobilien.runtime.ts:68

___

### export

• **export**: [*ImmobilienExport*](immobilien.export.immobilienexport.md)

Defined in: immobilien/immobilien.runtime.ts:40

___

### formatter

• **formatter**: [*ImmobilienFormatter*](immobilien.formatter.immobilienformatter.md)

Defined in: immobilien/immobilien.runtime.ts:39

___

### highlightedTimeout

• `Private` **highlightedTimeout**: *Timeout*

Defined in: immobilien/immobilien.runtime.ts:37

___

### locale

• **locale**: { `Aurich`: *string* ; `Braunschweig`: *string* ; `Bremer Umland`: *string* ; `EH`: *string* ; `EW`: *string* ; `Göttingen`: *string* ; `Hamburger Umland`: *string* ; `Hannover`: *string* ; `Hannover - Braunschweig - Wolfsburg`: *string* ; `Küste u. weiteres Umland`: *string* ; `LR`: *string* ; `Lüneburg`: *string* ; `Mitte`: *string* ; `Mittleres Niedersachsen`: *string* ; `Nord`: *string* ; `Oldenburg`: *string* ; `Oldenburg - Münsterland - Osnabrück`: *string* ; `Osnabrück`: *string* ; `Ost`: *string* ; `Ostfriesische Inseln`: *string* ; `Preisentwicklung Niedersachsen, gesamt`: *string* ; `Preisentwicklung nach städtischen und ländlichen Regionen`: *string* ; `SR`: *string* ; `Stadt Braunschweig`: *string* ; `Stadt Göttingen u. städt. Gemeinden`: *string* ; `Stadt Hannover`: *string* ; `Stadt Oldenburg`: *string* ; `Stadt Osnabrück u. städt. Gemeinden`: *string* ; `Stadt Wolfsburg`: *string* ; `Süd`: *string* ; `Südliches Niedersachsen`: *string* ; `Vergleich Preisentwicklung von städtischen und ländlichen Regionen`: *string* ; `Vergleich zusammengefasster Regionen`: *string* ; `West`: *string* ; `Westliches Niedersachsen`: *string* ; `Wolfsburg`: *string* ; `gebrauchte Eigenheime`: *string* ; `gebrauchte Eigentumswohnungen`: *string* ; `ländliche Regionen`: *string* ; `städtische Regionen`: *string* ; `Östliches Niedersachsen`: *string*  }

#### Type declaration:

Name | Type |
------ | ------ |
`Aurich` | *string* |
`Braunschweig` | *string* |
`Bremer Umland` | *string* |
`EH` | *string* |
`EW` | *string* |
`Göttingen` | *string* |
`Hamburger Umland` | *string* |
`Hannover` | *string* |
`Hannover - Braunschweig - Wolfsburg` | *string* |
`Küste u. weiteres Umland` | *string* |
`LR` | *string* |
`Lüneburg` | *string* |
`Mitte` | *string* |
`Mittleres Niedersachsen` | *string* |
`Nord` | *string* |
`Oldenburg` | *string* |
`Oldenburg - Münsterland - Osnabrück` | *string* |
`Osnabrück` | *string* |
`Ost` | *string* |
`Ostfriesische Inseln` | *string* |
`Preisentwicklung Niedersachsen, gesamt` | *string* |
`Preisentwicklung nach städtischen und ländlichen Regionen` | *string* |
`SR` | *string* |
`Stadt Braunschweig` | *string* |
`Stadt Göttingen u. städt. Gemeinden` | *string* |
`Stadt Hannover` | *string* |
`Stadt Oldenburg` | *string* |
`Stadt Osnabrück u. städt. Gemeinden` | *string* |
`Stadt Wolfsburg` | *string* |
`Süd` | *string* |
`Südliches Niedersachsen` | *string* |
`Vergleich Preisentwicklung von städtischen und ländlichen Regionen` | *string* |
`Vergleich zusammengefasster Regionen` | *string* |
`West` | *string* |
`Westliches Niedersachsen` | *string* |
`Wolfsburg` | *string* |
`gebrauchte Eigenheime` | *string* |
`gebrauchte Eigentumswohnungen` | *string* |
`ländliche Regionen` | *string* |
`städtische Regionen` | *string* |
`Östliches Niedersachsen` | *string* |

Defined in: immobilien/immobilien.runtime.ts:78

___

### map

• **map**: NipixRuntimeMap

Defined in: immobilien/immobilien.runtime.ts:43

___

### nipixStatic

• `Private` **nipixStatic**: [*NipixStatic*](immobilien.static.nipixstatic.md)

Defined in: immobilien/immobilien.runtime.ts:35

___

### state

• **state**: NipixRuntimeState

Defined in: immobilien/immobilien.runtime.ts:53

## Methods

### calculateDrawData

▸ **calculateDrawData**(): *void*

Generates the drawdata from the given draw array

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:255

___

### getDrawPreset

▸ **getDrawPreset**(`name`: *string*): *any*

Get draw object for a specific name

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`name` | *string* | Name of the draw Object    |

**Returns:** *any*

draw Object

Defined in: immobilien/immobilien.runtime.ts:198

___

### highlightSeries

▸ **highlightSeries**(`seriesName`: *any*): *void*

Highlight one Series (while mouse over)

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`seriesName` | *any* | name of the series to highlight    |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:230

___

### highlightTimeout

▸ **highlightTimeout**(): *void*

timeout handler for diable highlight

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:211

___

### resetDrawPresets

▸ **resetDrawPresets**(): *void*

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:150

___

### resetHighlight

▸ **resetHighlight**(): *void*

Reset the highlighted Map (before) timeout

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:219

___

### toggleNipixCategory

▸ **toggleNipixCategory**(`drawname`: *string*): *void*

Toggle the NiPix Category (Eigenheime/Eigentumswohnungen) for a specific draw object.

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`drawname` | *string* | Name of the draw object.    |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:178

___

### translate

▸ **translate**(`defaultID`: *string*): *any*

#### Parameters:

Name | Type |
------ | ------ |
`defaultID` | *string* |

**Returns:** *any*

Defined in: immobilien/immobilien.runtime.ts:129

___

### translateArray

▸ **translateArray**(`input`: *any*, `key?`: *string*): *any*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`input` | *any* | - |
`key` | *string* | 'name' |

**Returns:** *any*

Defined in: immobilien/immobilien.runtime.ts:138

___

### updateAvailableNipixCategories

▸ **updateAvailableNipixCategories**(): *void*

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:154

___

### updateAvailableQuartal

▸ **updateAvailableQuartal**(`lastYear`: *number*, `lastPeriod`: *number*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`lastYear` | *number* |
`lastPeriod` | *number* |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:158

___

### updateMapSelect

▸ **updateMapSelect**(`id?`: *any*): *void*

Update the Selectiopn of the Map aware of the activer Draw Item

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`id` | *any* | null |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:276

___

### updateRange

▸ **updateRange**(`range_start`: *any*, `range_end`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`range_start` | *any* |
`range_end` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime.ts:260
