[immobilien](../README.md) / ImmobilienFormatter

# Class: ImmobilienFormatter

## Hierarchy

* **ImmobilienFormatter**

## Table of contents

### Constructors

- [constructor](immobilien.formatter.md#constructor)

### Properties

- [legendposition](immobilien.formatter.md#legendposition)
- [nipixRuntime](immobilien.formatter.md#nipixruntime)
- [nipixStatic](immobilien.formatter.md#nipixstatic)

### Methods

- [chartTooltipFormatter](immobilien.formatter.md#charttooltipformatter)
- [findName](immobilien.formatter.md#findname)
- [formatLabel](immobilien.formatter.md#formatlabel)
- [formatLegend](immobilien.formatter.md#formatlegend)
- [getSeriesColor](immobilien.formatter.md#getseriescolor)
- [getSeriesLabel](immobilien.formatter.md#getserieslabel)
- [graphicLegend](immobilien.formatter.md#graphiclegend)
- [graphicLegendMulti](immobilien.formatter.md#graphiclegendmulti)
- [graphicLegendMultiSelect](immobilien.formatter.md#graphiclegendmultiselect)
- [graphicLegendSingle](immobilien.formatter.md#graphiclegendsingle)
- [mapTooltipFormatter](immobilien.formatter.md#maptooltipformatter)
- [simpleLegend](immobilien.formatter.md#simplelegend)

## Constructors

### constructor

\+ **new ImmobilienFormatter**(`niStatic`: [*NipixStatic*](immobilien.static.nipixstatic.md), `niRuntime`: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)): [*ImmobilienFormatter*](immobilien.formatter.md)

#### Parameters:

Name | Type |
------ | ------ |
`niStatic` | [*NipixStatic*](immobilien.static.nipixstatic.md) |
`niRuntime` | [*NipixRuntime*](immobilien.runtime.nipixruntime.md) |

**Returns:** [*ImmobilienFormatter*](immobilien.formatter.md)

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
