[immobilien](../README.md) / NipixRuntime

# Class: NipixRuntime

## Hierarchy

* **NipixRuntime**

## Table of contents

### Constructors

- [constructor](immobilien.runtime.md#constructor)

### Properties

- [availableNipixCategories](immobilien.runtime.md#availablenipixcategories)
- [availableQuartal](immobilien.runtime.md#availablequartal)
- [calculated](immobilien.runtime.md#calculated)
- [calculator](immobilien.runtime.md#calculator)
- [chart](immobilien.runtime.md#chart)
- [drawPresets](immobilien.runtime.md#drawpresets)
- [export](immobilien.runtime.md#export)
- [formatter](immobilien.runtime.md#formatter)
- [highlightedTimeout](immobilien.runtime.md#highlightedtimeout)
- [locale](immobilien.runtime.md#locale)
- [map](immobilien.runtime.md#map)
- [nipixStatic](immobilien.runtime.md#nipixstatic)
- [state](immobilien.runtime.md#state)

### Methods

- [calculateDrawData](immobilien.runtime.md#calculatedrawdata)
- [getDrawPreset](immobilien.runtime.md#getdrawpreset)
- [highlightSeries](immobilien.runtime.md#highlightseries)
- [highlightTimeout](immobilien.runtime.md#highlighttimeout)
- [resetDrawPresets](immobilien.runtime.md#resetdrawpresets)
- [resetHighlight](immobilien.runtime.md#resethighlight)
- [toggleNipixCategory](immobilien.runtime.md#togglenipixcategory)
- [translate](immobilien.runtime.md#translate)
- [translateArray](immobilien.runtime.md#translatearray)
- [updateAvailableNipixCategories](immobilien.runtime.md#updateavailablenipixcategories)
- [updateAvailableQuartal](immobilien.runtime.md#updateavailablequartal)
- [updateMapSelect](immobilien.runtime.md#updatemapselect)
- [updateRange](immobilien.runtime.md#updaterange)

## Constructors

### constructor

\+ **new NipixRuntime**(`niStatic`: [*NipixStatic*](immobilien.static.nipixstatic.md)): [*NipixRuntime*](immobilien.runtime.md)

#### Parameters:

Name | Type |
------ | ------ |
`niStatic` | [*NipixStatic*](immobilien.static.nipixstatic.md) |

**Returns:** [*NipixRuntime*](immobilien.runtime.md)

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
