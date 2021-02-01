[immobilien](../README.md) / NipixRuntimeCalculator

# Class: NipixRuntimeCalculator

## Hierarchy

* **NipixRuntimeCalculator**

## Table of contents

### Constructors

- [constructor](immobilien.runtime-calculator.md#constructor)

### Properties

- [nipixRuntime](immobilien.runtime-calculator.md#nipixruntime)
- [nipixStatic](immobilien.runtime-calculator.md#nipixstatic)

### Methods

- [calculateDrawData](immobilien.runtime-calculator.md#calculatedrawdata)
- [calculateDrawDataAggr](immobilien.runtime-calculator.md#calculatedrawdataaggr)
- [calculateDrawDataAggrDate](immobilien.runtime-calculator.md#calculatedrawdataaggrdate)
- [calculateDrawDataAggrIterate](immobilien.runtime-calculator.md#calculatedrawdataaggriterate)
- [calculateDrawDataSingle](immobilien.runtime-calculator.md#calculatedrawdatasingle)
- [calculateDrawDataSingleOnRef](immobilien.runtime-calculator.md#calculatedrawdatasingleonref)
- [calculateDrawDataSinglePush](immobilien.runtime-calculator.md#calculatedrawdatasinglepush)

## Constructors

### constructor

\+ **new NipixRuntimeCalculator**(`niStatic`: [*NipixStatic*](immobilien.static.nipixstatic.md), `niRuntime`: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)): [*NipixRuntimeCalculator*](immobilien.runtime-calculator.md)

#### Parameters:

Name | Type |
------ | ------ |
`niStatic` | [*NipixStatic*](immobilien.static.nipixstatic.md) |
`niRuntime` | [*NipixRuntime*](immobilien.runtime.nipixruntime.md) |

**Returns:** [*NipixRuntimeCalculator*](immobilien.runtime-calculator.md)

Defined in: immobilien/immobilien.runtime-calculator.ts:10

## Properties

### nipixRuntime

• `Private` **nipixRuntime**: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)

Defined in: immobilien/immobilien.runtime-calculator.ts:10

___

### nipixStatic

• `Private` **nipixStatic**: [*NipixStatic*](immobilien.static.nipixstatic.md)

Defined in: immobilien/immobilien.runtime-calculator.ts:9

## Methods

### calculateDrawData

▸ **calculateDrawData**(): *void*

Generates the drawdata from the given draw array

**Returns:** *void*

Defined in: immobilien/immobilien.runtime-calculator.ts:178

___

### calculateDrawDataAggr

▸ `Private`**calculateDrawDataAggr**(`drawitem`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`drawitem` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime-calculator.ts:144

___

### calculateDrawDataAggrDate

▸ `Private`**calculateDrawDataAggrDate**(`drawitem`: *any*, `workdata`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`drawitem` | *any* |
`workdata` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime-calculator.ts:123

___

### calculateDrawDataAggrIterate

▸ `Private`**calculateDrawDataAggrIterate**(`drawitem`: *any*, `workdata`: *any*, `aggr`: *any*, `d`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`drawitem` | *any* |
`workdata` | *any* |
`aggr` | *any* |
`d` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime-calculator.ts:91

___

### calculateDrawDataSingle

▸ `Private`**calculateDrawDataSingle**(`drawitem`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`drawitem` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime-calculator.ts:62

___

### calculateDrawDataSingleOnRef

▸ `Private`**calculateDrawDataSingleOnRef**(`drawitem`: *any*, `value`: *any*, `nipix`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`drawitem` | *any* |
`value` | *any* |
`nipix` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime-calculator.ts:18

___

### calculateDrawDataSinglePush

▸ `Private`**calculateDrawDataSinglePush**(`drawitem`: *any*, `value`: *any*, `nipix`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`drawitem` | *any* |
`value` | *any* |
`nipix` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.runtime-calculator.ts:48
