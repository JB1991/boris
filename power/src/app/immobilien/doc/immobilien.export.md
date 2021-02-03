[immobilien](../README.md) / ImmobilienExport

# Class: ImmobilienExport

## Hierarchy

* **ImmobilienExport**

## Table of contents

### Constructors

- [constructor](immobilien.export.md#constructor)

### Properties

- [exportChart](immobilien.export.md#exportchart)
- [nipixRuntime](immobilien.export.md#nipixruntime)
- [nipixStatic](immobilien.export.md#nipixstatic)
- [geoJsonHeader](immobilien.export.md#geojsonheader)

### Methods

- [chartRenderFinished](immobilien.export.md#chartrenderfinished)
- [exportAsImage](immobilien.export.md#exportasimage)
- [exportAsImageFinish](immobilien.export.md#exportasimagefinish)
- [exportGeoJSON](immobilien.export.md#exportgeojson)
- [exportMapAsImage](immobilien.export.md#exportmapasimage)
- [exportNiPixGeoJson](immobilien.export.md#exportnipixgeojson)
- [exportNiPixGeoJsonCSV](immobilien.export.md#exportnipixgeojsoncsv)
- [exportNiPixGeoJsonGeoJson](immobilien.export.md#exportnipixgeojsongeojson)
- [getNiPixTimeslot](immobilien.export.md#getnipixtimeslot)

## Constructors

### constructor

\+ **new ImmobilienExport**(`niStatic`: [*NipixStatic*](immobilien.static.nipixstatic.md), `niRuntime`: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)): [*ImmobilienExport*](immobilien.export.md)

#### Parameters:

Name | Type |
------ | ------ |
`niStatic` | [*NipixStatic*](immobilien.static.nipixstatic.md) |
`niRuntime` | [*NipixRuntime*](immobilien.runtime.nipixruntime.md) |

**Returns:** [*ImmobilienExport*](immobilien.export.md)

Defined in: immobilien/immobilien.export.ts:25

## Properties

### exportChart

• **exportChart**: *boolean*= false

Defined in: immobilien/immobilien.export.ts:18

___

### nipixRuntime

• `Private` **nipixRuntime**: [*NipixRuntime*](immobilien.runtime.nipixruntime.md)

Defined in: immobilien/immobilien.export.ts:16

___

### nipixStatic

• `Private` **nipixStatic**: [*NipixStatic*](immobilien.static.nipixstatic.md)

Defined in: immobilien/immobilien.export.ts:15

___

### geoJsonHeader

▪ `Static` **geoJsonHeader**: { `crs`: { `properties`: { `name`: *string* = 'urn:ogc:def:crs:EPSG::3044' } ; `type`: *string* = 'name' } ; `features`: *any*[] ; `name`: *string* = 'womareg'; `type`: *string* = 'FeatureCollection' }

#### Type declaration:

Name | Type |
------ | ------ |
`crs` | { `properties`: { `name`: *string* = 'urn:ogc:def:crs:EPSG::3044' } ; `type`: *string* = 'name' } |
`features` | *any*[] |
`name` | *string* |
`type` | *string* |

Defined in: immobilien/immobilien.export.ts:20

## Methods

### chartRenderFinished

▸ **chartRenderFinished**(): *void*

**Returns:** *void*

Defined in: immobilien/immobilien.export.ts:96

___

### exportAsImage

▸ **exportAsImage**(): *void*

Download current Diagram Data as csv

**Returns:** *void*

Defined in: immobilien/immobilien.export.ts:45

___

### exportAsImageFinish

▸ `Private`**exportAsImageFinish**(): *void*

**Returns:** *void*

Defined in: immobilien/immobilien.export.ts:52

___

### exportGeoJSON

▸ **exportGeoJSON**(): *void*

**Returns:** *void*

Defined in: immobilien/immobilien.export.ts:72

___

### exportMapAsImage

▸ **exportMapAsImage**(): *void*

**Returns:** *void*

Defined in: immobilien/immobilien.export.ts:32

___

### exportNiPixGeoJson

▸ **exportNiPixGeoJson**(`geoJSON?`: *boolean*): *void*

Export GeoJSON with Nipix

#### Parameters:

Name | Type | Default value |
------ | ------ | ------ |
`geoJSON` | *boolean* | true |

**Returns:** *void*

Defined in: immobilien/immobilien.export.ts:105

___

### exportNiPixGeoJsonCSV

▸ `Private`**exportNiPixGeoJsonCSV**(`drawitem`: *any*, `date`: *any*, `series`: *any*, `istart`: *any*, `iend`: *any*): *any*[]

#### Parameters:

Name | Type |
------ | ------ |
`drawitem` | *any* |
`date` | *any* |
`series` | *any* |
`istart` | *any* |
`iend` | *any* |

**Returns:** *any*[]

Defined in: immobilien/immobilien.export.ts:173

___

### exportNiPixGeoJsonGeoJson

▸ `Private`**exportNiPixGeoJsonGeoJson**(`drawitem`: *any*, `geoData`: *any*, `date`: *any*, `series`: *any*, `istart`: *any*, `iend`: *any*): *any*[]

#### Parameters:

Name | Type |
------ | ------ |
`drawitem` | *any* |
`geoData` | *any* |
`date` | *any* |
`series` | *any* |
`istart` | *any* |
`iend` | *any* |

**Returns:** *any*[]

Defined in: immobilien/immobilien.export.ts:141

___

### getNiPixTimeslot

▸ `Private`**getNiPixTimeslot**(`date`: *any*, `series`: *any*, `region`: *any*, `tstart`: *number*, `tend`: *number*): *any*[]

Get NiPix Data in given Timeslot

#### Parameters:

Name | Type | Description |
------ | ------ | ------ |
`date` | *any* | Date Array   |
`series` | *any* | series array   |
`region` | *any* | region to get timeslot   |
`tstart` | *number* | Timeslot start date   |
`tend` | *number* | Timeslot end date   |

**Returns:** *any*[]

Timeslot array or empty array if region not found

Defined in: immobilien/immobilien.export.ts:216
