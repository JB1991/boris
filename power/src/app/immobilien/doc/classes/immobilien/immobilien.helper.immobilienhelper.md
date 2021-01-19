[power](../../doc.md) / [Exports](../../modules.md) / [immobilien/immobilien.helper](../../modules/immobilien/immobilien.immobilien_immobilien_helper.md) / ImmobilienHelper

# Class: ImmobilienHelper

[immobilien/immobilien.helper](../../modules/immobilien/immobilien.immobilien_immobilien_helper.md).ImmobilienHelper

## Hierarchy

* **ImmobilienHelper**

## Table of contents

### Constructors

- [constructor](immobilien.helper.immobilienhelper.md#constructor)

### Methods

- [appendLeadingZeroes](immobilien.helper.immobilienhelper.md#appendleadingzeroes)
- [componentToHex](immobilien.helper.immobilienhelper.md#componenttohex)
- [convertArrayToCSV](immobilien.helper.immobilienhelper.md#convertarraytocsv)
- [convertColor](immobilien.helper.immobilienhelper.md#convertcolor)
- [convertRemToPixels](immobilien.helper.immobilienhelper.md#convertremtopixels)
- [downloadFile](immobilien.helper.immobilienhelper.md#downloadfile)
- [getDate](immobilien.helper.immobilienhelper.md#getdate)
- [getGeometryArray](immobilien.helper.immobilienhelper.md#getgeometryarray)
- [getSingleFeature](immobilien.helper.immobilienhelper.md#getsinglefeature)
- [modifyColor](immobilien.helper.immobilienhelper.md#modifycolor)
- [parseStringAsFloat](immobilien.helper.immobilienhelper.md#parsestringasfloat)
- [resolve](immobilien.helper.immobilienhelper.md#resolve)
- [rgbToHex](immobilien.helper.immobilienhelper.md#rgbtohex)

## Constructors

### constructor

\+ **new ImmobilienHelper**(): [*ImmobilienHelper*](immobilien.helper.immobilienhelper.md)

**Returns:** [*ImmobilienHelper*](immobilien.helper.immobilienhelper.md)

## Methods

### appendLeadingZeroes

▸ `Static`**appendLeadingZeroes**(`n`: *any*): *any*

Appending zeros

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`n` | *any* | number    |

**Returns:** *any*

zero padding number

Defined in: immobilien/immobilien.helper.ts:107

___

### componentToHex

▸ `Static`**componentToHex**(`c`: *any*): *any*

Convert RGB color component to hex

Source: https://stackoverflow.com/a/5624139

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`c` | *any* | Color Component   |

**Returns:** *any*

Hex Component

Defined in: immobilien/immobilien.helper.ts:22

___

### convertArrayToCSV

▸ `Static`**convertArrayToCSV**(`array`: *any*, `keys`: *any*, `split?`: *string*, `feld?`: *string*): *string*

Convert Array to CSV

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`array` | *any* | - | Array with th data which should converted   |
`keys` | *any* | - | Keys which data should be used    |
`split` | *string* | ';' | - |
`feld` | *string* | '"' | - |

**Returns:** *string*

CSV String

Defined in: immobilien/immobilien.helper.ts:203

___

### convertColor

▸ `Static`**convertColor**(`color`: *any*): *any*

Convert given Color to HexColor

Input color can be ofe of this formats:
- RGB:   rgb([r],[g],[b])
- Array: [r, g, b]
- Hex:   #rrggbb

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`color` | *any* | Input Color    |

**Returns:** *any*

HexColor (#rrggbb)

Defined in: immobilien/immobilien.helper.ts:52

___

### convertRemToPixels

▸ `Static`**convertRemToPixels**(`rem`: *number*): *number*

Convert REM to PX
source: https://stackoverflow.com/a/42769683

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`rem` | *number* | size in rem    |

**Returns:** *number*

size in px

Defined in: immobilien/immobilien.helper.ts:10

___

### downloadFile

▸ `Static`**downloadFile**(`data`: *any*, `filename`: *any*, `filetype?`: *string*, `isurl?`: *boolean*): *any*

Dowload Binary Data as file

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | *any* | - | Data for Download   |
`filename` | *any* | - | Filename for the Data to download    |
`filetype` | *string* | 'text/csv' | - |
`isurl` | *boolean* | false | - |

**Returns:** *any*

Defined in: immobilien/immobilien.helper.ts:146

___

### getDate

▸ `Static`**getDate**(): *number*

get the current Daten with leading zeroes

**Returns:** *number*

Date

Defined in: immobilien/immobilien.helper.ts:119

___

### getGeometryArray

▸ `Static`**getGeometryArray**(`data`: *any*, `features`: *any*): *object*

Get an Array of given Geometries from GeoJSON

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | *any* | GeoJSON Data   |
`features` | *any* | Array of Features for the Collection    |

**Returns:** *object*

Name | Type |
------ | ------ |
`geometries` | *any*[] |
`type` | *string* |

GeometryCollection Object (Empty geometries property if no feature were found)

Defined in: immobilien/immobilien.helper.ts:257

___

### getSingleFeature

▸ `Static`**getSingleFeature**(`data`: *any*, `feature`: *any*): *any*

Get Single Feature from GeoJSON

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`data` | *any* | GeoJSON Data   |
`feature` | *any* | Feature which should be extracted    |

**Returns:** *any*

Feature if found, empty object if not found

Defined in: immobilien/immobilien.helper.ts:236

___

### modifyColor

▸ `Static`**modifyColor**(`color`: *any*, `percent`: *any*): *string*

Modify a color (lighten or darken)

Source: https://stackoverflow.com/a/13542669

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`color` | *any* | Input Color (Choose Format accepted by convertColor)   |
`percent` | *any* | lighten or darken -1<=0<=1    |

**Returns:** *string*

Modified color

Defined in: immobilien/immobilien.helper.ts:77

___

### parseStringAsFloat

▸ `Static`**parseStringAsFloat**(`value`: *any*): *any*

parse String as Flaot

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`value` | *any* | String or float    |

**Returns:** *any*

float

Defined in: immobilien/immobilien.helper.ts:132

___

### resolve

▸ `Static`**resolve**(`path`: *any*, `obj?`: *any*, `separator?`: *string*): *any*

Resolves key in Array

Source: https://stackoverflow.com/a/22129960

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`path` | *any* | - | Path of the Property   |
`obj` | *any* | ... | Object   |
`separator` | *string* | '.' | Separator used in path    |

**Returns:** *any*

Resolved Property

Defined in: immobilien/immobilien.helper.ts:189

___

### rgbToHex

▸ `Static`**rgbToHex**(`r`: *any*, `g`: *any*, `b`: *any*): *string*

Convert RGB color to Hex

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`r` | *any* | red color   |
`g` | *any* | green color   |
`b` | *any* | blue coor    |

**Returns:** *string*

Hex-Color

Defined in: immobilien/immobilien.helper.ts:36
