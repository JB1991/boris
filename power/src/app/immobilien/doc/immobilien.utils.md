[immobilien](../README.md) / ImmobilienUtils

# Class: ImmobilienUtils

## Hierarchy

* **ImmobilienUtils**

## Table of contents

### Constructors

- [constructor](immobilien.utils.md#constructor)

### Methods

- [dispatchMapSelect](immobilien.utils.md#dispatchmapselect)
- [generateDotElement](immobilien.utils.md#generatedotelement)
- [generateDrawSeriesData](immobilien.utils.md#generatedrawseriesdata)
- [generateSeries](immobilien.utils.md#generateseries)
- [generateSeriesGS](immobilien.utils.md#generateseriesgs)
- [generateTextElement](immobilien.utils.md#generatetextelement)
- [getDateArray](immobilien.utils.md#getdatearray)
- [getMyMapRegionen](immobilien.utils.md#getmymapregionen)
- [getMyMapRegionenGR](immobilien.utils.md#getmymapregionengr)
- [modifyRegionen](immobilien.utils.md#modifyregionen)

## Constructors

### constructor

\+ **new ImmobilienUtils**(): [*ImmobilienUtils*](immobilien.utils.md)

**Returns:** [*ImmobilienUtils*](immobilien.utils.md)

## Methods

### dispatchMapSelect

▸ `Static`**dispatchMapSelect**(`obj`: *any*, `name`: *string*, `select`: *boolean*): *void*

#### Parameters:

Name | Type |
------ | ------ |
`obj` | *any* |
`name` | *string* |
`select` | *boolean* |

**Returns:** *void*

Defined in: immobilien/immobilien.utils.ts:271

___

### generateDotElement

▸ `Static`**generateDotElement**(`radius?`: *number*, `color?`: *string*, `fontSizeBase?`: *number*, `position?`: *number*, `posX?`: *number*, `bordercolor?`: *string*, `border?`: *number*): *any*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`radius` | *number* | 4 |
`color` | *string* | '#fff' |
`fontSizeBase` | *number* | 1.2 |
`position` | *number* | 0 |
`posX` | *number* | 0 |
`bordercolor` | *string* | '#000' |
`border` | *number* | 0 |

**Returns:** *any*

Defined in: immobilien/immobilien.utils.ts:229

___

### generateDrawSeriesData

▸ `Static`**generateDrawSeriesData**(`data`: *any*, `date?`: *any*[], `field?`: *any*, `offset?`: *number*): *any*[]

Generate Series data

**`offset`** Offset for ercentage calculation

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`data` | *any* | - | raw Series Data   |
`date` | *any*[] | ... | date arry for data   |
`field` | *any* | null | Data array field   |
`offset` | *number* | 100 | - |

**Returns:** *any*[]

Data array

Defined in: immobilien/immobilien.utils.ts:186

___

### generateSeries

▸ `Static`**generateSeries**(`name`: *any*, `data`: *any*, `color`: *any*, `labelFormatter?`: *any*, `selectedChartLine?`: *string*, `xIndex?`: *number*, `yIndex?`: *number*, `seriesType?`: *string*): *any*

Generate a Series object

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`name` | *any* | - | Series Name   |
`data` | *any* | - | Series data array   |
`color` | *any* | - | Series color (Must be valid for convertColor)   |
`labelFormatter` | *any* | null | Custom labelFormatter function   |
`selectedChartLine` | *string* | '' | Name of the selected chart line (for highlghting)   |
`xIndex` | *number* | 0 | - |
`yIndex` | *number* | 0 | yAxisIndex (Default 0) (see echarts api)   |
`seriesType` | *string* | 'line' | SeriesTyp (default line) (see echarts api)    |

**Returns:** *any*

echarts Series Object

Defined in: immobilien/immobilien.utils.ts:140

___

### generateSeriesGS

▸ `Static`**generateSeriesGS**(`name`: *any*, `seriesType`: *any*, `zindex`: *any*, `seriesColor`: *any*, `labelFormatter`: *any*, `data`: *any*): *object*

#### Parameters:

Name | Type |
------ | ------ |
`name` | *any* |
`seriesType` | *any* |
`zindex` | *any* |
`seriesColor` | *any* |
`labelFormatter` | *any* |
`data` | *any* |

**Returns:** *object*

Name | Type |
------ | ------ |
`data` | *any* |
`emphasis` | { `itemStyle`: { `color`: *any*  }  } |
`itemStyle` | { `borderColor`: *string* = 'rgba(255,255,255,0)'; `borderWidth`: *number* = 16; `color`: *any*  } |
`label` | { `normal`: { `formatter`: *any* ; `position`: *string* = 'right'; `show`: *boolean* = true }  } |
`name` | *any* |
`sampling` | *string* |
`showAllSymbol` | *boolean* |
`smooth` | *boolean* |
`symbol` | *string* |
`symbolSize` | *number* |
`type` | *any* |
`zlevel` | *any* |

Defined in: immobilien/immobilien.utils.ts:95

___

### generateTextElement

▸ `Static`**generateTextElement**(`name`: *any*, `color?`: *string*, `fontSizeBase?`: *number*, `position?`: *number*, `posX?`: *any*): *any*

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`name` | *any* | - |
`color` | *string* | '#000' |
`fontSizeBase` | *number* | 1.2 |
`position` | *number* | 0 |
`posX?` | *any* | - |

**Returns:** *any*

Defined in: immobilien/immobilien.utils.ts:215

___

### getDateArray

▸ `Static`**getDateArray**(`lastYear`: *number*, `lastPeriod`: *number*): *any*[]

Return Date Array for given Periods

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`lastYear` | *number* | Year of the last available NIPIX Data   |
`lastPeriod` | *number* | Period of the last available NIPIX Data    |

**Returns:** *any*[]

DateArray array

Defined in: immobilien/immobilien.utils.ts:13

___

### getMyMapRegionen

▸ `Static`**getMyMapRegionen**(`regionen`: *any*, `myregion?`: *any*, `selectionList?`: *any*, `lighten?`: *boolean*): *any*[]

Convert myRegion list to MapRegionen array.

#### Parameters:

Name | Type | Default value | Description |
------ | ------ | ------ | ------ |
`regionen` | *any* | - | Regionen Object   |
`myregion` | *any* | null | FindMyRegion Region   |
`selectionList` | *any* | null | List of selected Regions   |
`lighten` | *boolean* | false | (default false) Lighten the areaColor    |

**Returns:** *any*[]

MapRegionen array

Defined in: immobilien/immobilien.utils.ts:60

___

### getMyMapRegionenGR

▸ `Static`**getMyMapRegionenGR**(`name`: *string*, `bc`: *string*, `bw`: *number*, `area`: *string*): *object*

#### Parameters:

Name | Type |
------ | ------ |
`name` | *string* |
`bc` | *string* |
`bw` | *number* |
`area` | *string* |

**Returns:** *object*

Name | Type |
------ | ------ |
`emphasis` | { `itemStyle`: { `areaColor`: *string* ; `borderColor`: *string* ; `borderWidth`: *number*  }  } |
`itemStyle` | { `areaColor`: *string* = '#dddddd'; `borderColor`: *string* ; `borderWidth`: *number*  } |
`name` | *string* |

Defined in: immobilien/immobilien.utils.ts:32

___

### modifyRegionen

▸ `Static`**modifyRegionen**(`regionen`: *any*, `modifyArray`: *any*): *any*

#### Parameters:

Name | Type |
------ | ------ |
`regionen` | *any* |
`modifyArray` | *any* |

**Returns:** *any*

Defined in: immobilien/immobilien.utils.ts:256
