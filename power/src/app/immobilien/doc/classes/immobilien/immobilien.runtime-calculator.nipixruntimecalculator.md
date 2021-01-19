[power](../../doc.md) / [Exports](../../modules.md) / [immobilien/immobilien.runtime-calculator](../../modules/immobilien/immobilien.immobilien_immobilien_runtime_calculator.md) / NipixRuntimeCalculator

# Class: NipixRuntimeCalculator

[immobilien/immobilien.runtime-calculator](../../modules/immobilien/immobilien.immobilien_immobilien_runtime_calculator.md).NipixRuntimeCalculator

## Hierarchy

* **NipixRuntimeCalculator**

## Table of contents

### Constructors

- [constructor](immobilien.runtime-calculator.nipixruntimecalculator.md#constructor)

### Properties

- [nipixRuntime](immobilien.runtime-calculator.nipixruntimecalculator.md#nipixruntime)
- [nipixStatic](immobilien.runtime-calculator.nipixruntimecalculator.md#nipixstatic)

### Methods

- [calculateDrawData](immobilien.runtime-calculator.nipixruntimecalculator.md#calculatedrawdata)
- [calculateDrawDataAggr](immobilien.runtime-calculator.nipixruntimecalculator.md#calculatedrawdataaggr)
- [calculateDrawDataAggrDate](immobilien.runtime-calculator.nipixruntimecalculator.md#calculatedrawdataaggrdate)
- [calculateDrawDataAggrIterate](immobilien.runtime-calculator.nipixruntimecalculator.md#calculatedrawdataaggriterate)
- [calculateDrawDataSingle](immobilien.runtime-calculator.nipixruntimecalculator.md#calculatedrawdatasingle)
- [calculateDrawDataSingleOnRef](immobilien.runtime-calculator.nipixruntimecalculator.md#calculatedrawdatasingleonref)
- [calculateDrawDataSinglePush](immobilien.runtime-calculator.nipixruntimecalculator.md#calculatedrawdatasinglepush)

## Constructors

### constructor

\+ **new NipixRuntimeCalculator**(`niStatic`: [*NipixStatic*](immobilien.static.nipixstatic.md), `niRuntime`: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)): [*NipixRuntimeCalculator*](immobilien.runtime-calculator.nipixruntimecalculator.md)

#### Parameters:

Name | Type |
------ | ------ |
`niStatic` | [*NipixStatic*](immobilien.static.nipixstatic.md) |
`niRuntime` | [*NipixRuntime*](immobilien.runtime.nipixruntime.md) |

**Returns:** [*NipixRuntimeCalculator*](immobilien.runtime-calculator.nipixruntimecalculator.md)

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
