[immobilien](../README.md) / NipixStatic

# Class: NipixStatic

## Hierarchy

* **NipixStatic**

## Table of contents

### Constructors

- [constructor](immobilien.static.md#constructor)

### Properties

- [agnbUrl](immobilien.static.md#agnburl)
- [chartExportWidth](immobilien.static.md#chartexportwidth)
- [data](immobilien.static.md#data)
- [layoutRtl](immobilien.static.md#layoutrtl)
- [referenceDate](immobilien.static.md#referencedate)
- [textOptions](immobilien.static.md#textoptions)

### Methods

- [loadConfig](immobilien.static.md#loadconfig)
- [parseGemeinden](immobilien.static.md#parsegemeinden)
- [procMap](immobilien.static.md#procmap)

## Constructors

### constructor

\+ **new NipixStatic**(): [*NipixStatic*](immobilien.static.md)

**Returns:** [*NipixStatic*](immobilien.static.md)

Defined in: immobilien/immobilien.static.ts:46

## Properties

### agnbUrl

• **agnbUrl**: *string*= ''

Defined in: immobilien/immobilien.static.ts:24

___

### chartExportWidth

• **chartExportWidth**: *number*= 1800

Defined in: immobilien/immobilien.static.ts:25

___

### data

• **data**: NipixStaticData

Defined in: immobilien/immobilien.static.ts:33

___

### layoutRtl

• **layoutRtl**: *boolean*= false

Defined in: immobilien/immobilien.static.ts:23

___

### referenceDate

• **referenceDate**: *string*= '2016\_1'

Defined in: immobilien/immobilien.static.ts:46

___

### textOptions

• **textOptions**: NipixStaticTextOptions

Defined in: immobilien/immobilien.static.ts:26

## Methods

### loadConfig

▸ **loadConfig**(`json`: *any*): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`json` | *any* |

**Returns:** *boolean*

Defined in: immobilien/immobilien.static.ts:52

___

### parseGemeinden

▸ **parseGemeinden**(`gem`: *string*): *boolean*

#### Parameters:

Name | Type |
------ | ------ |
`gem` | *string* |

**Returns:** *boolean*

Defined in: immobilien/immobilien.static.ts:72

___

### procMap

▸ **procMap**(`geoJson`: *any*): *any*

#### Parameters:

Name | Type |
------ | ------ |
`geoJson` | *any* |

**Returns:** *any*

Defined in: immobilien/immobilien.static.ts:93
