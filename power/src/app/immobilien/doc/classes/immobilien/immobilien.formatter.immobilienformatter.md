[power](../../doc.md) / [Exports](../../modules.md) / [immobilien/immobilien.formatter](../../modules/immobilien/immobilien.immobilien_immobilien_formatter.md) / ImmobilienFormatter

# Class: ImmobilienFormatter

[immobilien/immobilien.formatter](../../modules/immobilien/immobilien.immobilien_immobilien_formatter.md).ImmobilienFormatter

## Hierarchy

* **ImmobilienFormatter**

## Table of contents

### Constructors

- [constructor](immobilien.formatter.immobilienformatter.md#constructor)

### Properties

- [legendposition](immobilien.formatter.immobilienformatter.md#legendposition)
- [nipixRuntime](immobilien.formatter.immobilienformatter.md#nipixruntime)
- [nipixStatic](immobilien.formatter.immobilienformatter.md#nipixstatic)

### Methods

- [chartTooltipFormatter](immobilien.formatter.immobilienformatter.md#charttooltipformatter)
- [findName](immobilien.formatter.immobilienformatter.md#findname)
- [formatLabel](immobilien.formatter.immobilienformatter.md#formatlabel)
- [formatLegend](immobilien.formatter.immobilienformatter.md#formatlegend)
- [getSeriesColor](immobilien.formatter.immobilienformatter.md#getseriescolor)
- [getSeriesLabel](immobilien.formatter.immobilienformatter.md#getserieslabel)
- [graphicLegend](immobilien.formatter.immobilienformatter.md#graphiclegend)
- [graphicLegendMulti](immobilien.formatter.immobilienformatter.md#graphiclegendmulti)
- [graphicLegendMultiSelect](immobilien.formatter.immobilienformatter.md#graphiclegendmultiselect)
- [graphicLegendSingle](immobilien.formatter.immobilienformatter.md#graphiclegendsingle)
- [mapTooltipFormatter](immobilien.formatter.immobilienformatter.md#maptooltipformatter)
- [simpleLegend](immobilien.formatter.immobilienformatter.md#simplelegend)

## Constructors

### constructor

\+ **new ImmobilienFormatter**(`niStatic`: [*NipixStatic*](immobilien.static.nipixstatic.md), `niRuntime`: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)): [*ImmobilienFormatter*](immobilien.formatter.immobilienformatter.md)

#### Parameters:

Name | Type |
------ | ------ |
`niStatic` | [*NipixStatic*](immobilien.static.nipixstatic.md) |
`niRuntime` | [*NipixRuntime*](immobilien.runtime.nipixruntime.md) |

**Returns:** [*ImmobilienFormatter*](immobilien.formatter.immobilienformatter.md)

Defined in: immobilien/immobilien.formatter.ts:11

## Properties

### legendposition

• `Private` **legendposition**: *any*[]

Defined in: immobilien/immobilien.formatter.ts:11

___

### nipixRuntime

• `Private` **nipixRuntime**: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)

Defined in: immobilien/immobilien.formatter.ts:9

___

### nipixStatic

• `Private` **nipixStatic**: [*NipixStatic*](immobilien.static.nipixstatic.md)

Defined in: immobilien/immobilien.formatter.ts:8

## Methods

### chartTooltipFormatter

▸ **chartTooltipFormatter**(`params`: *any*, `ticket`: *any*, `callback`: *any*): *string*

#### Parameters:

Name | Type |
------ | ------ |
`params` | *any* |
`ticket` | *any* |
`callback` | *any* |

**Returns:** *string*

Defined in: immobilien/immobilien.formatter.ts:26

___

### findName

▸ **findName**(`name`: *string*, `legend?`: *boolean*, `shortregion?`: *boolean*, `shortname?`: *boolean*): *string*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`name` | *string* | - |
`legend` | *boolean* | false |
`shortregion` | *boolean* | false |
`shortname` | *boolean* | true |

**Returns:** *string*

Defined in: immobilien/immobilien.formatter.ts:99

___

### formatLabel

▸ **formatLabel**(`params`: *any*): *string*

Format Series Label

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`params` | *any* | eCharts Formatter parameter (see echarts api)    |

**Returns:** *string*

Formatted String

Defined in: immobilien/immobilien.formatter.ts:62

___

### formatLegend

▸ **formatLegend**(`name`: *string*): *string*

#### Parameters:

Name | Type |
------ | ------ |
`name` | *string* |

**Returns:** *string*

Defined in: immobilien/immobilien.formatter.ts:117

___

### getSeriesColor

▸ **getSeriesColor**(`series`: *any*): *any*

Gets the color for a specific series

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`series` | *any* | series id    |

**Returns:** *any*

Series Color

Defined in: immobilien/immobilien.formatter.ts:144

___

### getSeriesLabel

▸ **getSeriesLabel**(`series`: *any*): *string*

Get Label for a specific Series

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`series` | *any* | series Id    |

**Returns:** *string*

series label (sort)

Defined in: immobilien/immobilien.formatter.ts:126

___

### graphicLegend

▸ **graphicLegend**(): *any*[]

**Returns:** *any*[]

Defined in: immobilien/immobilien.formatter.ts:241

___

### graphicLegendMulti

▸ `Private`**graphicLegendMulti**(`obj`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.formatter.ts:192

___

### graphicLegendMultiSelect

▸ `Private`**graphicLegendMultiSelect**(`obj`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.formatter.ts:212

___

### graphicLegendSingle

▸ `Private`**graphicLegendSingle**(`obj`: *any*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *any* |

**Returns:** *void*

Defined in: immobilien/immobilien.formatter.ts:165

___

### mapTooltipFormatter

▸ **mapTooltipFormatter**(`params`: *any*): *any*

#### Parameters:

Name | Type |
------ | ------ |
`params` | *any* |

**Returns:** *any*

Defined in: immobilien/immobilien.formatter.ts:18

___

### simpleLegend

▸ **simpleLegend**(): *any*[]

**Returns:** *any*[]

Defined in: immobilien/immobilien.formatter.ts:152
