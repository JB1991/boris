[power](../../doc.md) / [Exports](../../modules.md) / immobilien/immobilien.chartoptions-printoptions

# Module: immobilien/immobilien.chartoptions-printoptions

## Table of contents

### Variables

- [mergeHide](immobilien.immobilien_immobilien_chartoptions_printoptions.md#mergehide)
- [mergeShow](immobilien.immobilien_immobilien_chartoptions_printoptions.md#mergeshow)

## Variables

### mergeHide

• `Const` **mergeHide**: *object*

Chart Options (Merge) for hideing view components and show print components

#### Type declaration:

Name | Type | Value |
------ | ------ | ------ |
`dataZoom` | { `show`: *boolean* = false; `type`: *string* = 'slider' }[] | { `show`: *boolean* = false; `type`: *string* = 'slider' }[] |
`graphic` | ({ `id`: *string* = 'copyright'; `ignore`: *undefined* = true; `right`: *number* = 600 } \| { `id`: *string* = 'legend'; `ignore`: *boolean* = false; `right`: *undefined* = 600 })[] | ({ `id`: *string* = 'copyright'; `ignore`: *undefined* = true; `right`: *number* = 600 } \| { `id`: *string* = 'legend'; `ignore`: *boolean* = false; `right`: *undefined* = 600 })[] |
`grid` | { `id`: *string* = 'main'; `right`: *number* = 600 }[] | { `id`: *string* = 'main'; `right`: *number* = 600 }[] |
`series` | { `areaStyle`: { `color`: *string* = '#fff' } ; `id`: *string* = 'a'; `itemStyle`: { `color`: *string* = '#fff' }  }[] | { `areaStyle`: { `color`: *string* = '#fff' } ; `id`: *string* = 'a'; `itemStyle`: { `color`: *string* = '#fff' }  }[] |
`title` | *object* | { `show`: *boolean* = true } |
`toolbox` | *object* | { `show`: *boolean* = false } |
`xAxis` | { `id`: *string* = 'xds'; `show`: *boolean* = false }[] | { `id`: *string* = 'xds'; `show`: *boolean* = false }[] |
`yAxis` | { `id`: *string* = 'yds'; `show`: *boolean* = false }[] | { `id`: *string* = 'yds'; `show`: *boolean* = false }[] |

Defined in: immobilien/immobilien.chartoptions-printoptions.ts:4

___

### mergeShow

• `Const` **mergeShow**: *object*

Chart Options (Merge) for show view components and hide print components

#### Type declaration:

Name | Type | Value |
------ | ------ | ------ |
`dataZoom` | { `show`: *boolean* = true; `type`: *string* = 'slider' }[] | { `show`: *boolean* = true; `type`: *string* = 'slider' }[] |
`graphic` | ({ `id`: *string* = 'copyright'; `ignore`: *undefined* = true; `right`: *number* = 90 } \| { `id`: *string* = 'legend'; `ignore`: *boolean* = true; `right`: *undefined* = 600 })[] | ({ `id`: *string* = 'copyright'; `ignore`: *undefined* = true; `right`: *number* = 90 } \| { `id`: *string* = 'legend'; `ignore`: *boolean* = true; `right`: *undefined* = 600 })[] |
`grid` | { `id`: *string* = 'main'; `right`: *number* = 90 }[] | { `id`: *string* = 'main'; `right`: *number* = 90 }[] |
`series` | { `areaStyle`: { `color`: *string* = '#ccc' } ; `id`: *string* = 'a'; `itemStyle`: { `color`: *string* = '#ccc' }  }[] | { `areaStyle`: { `color`: *string* = '#ccc' } ; `id`: *string* = 'a'; `itemStyle`: { `color`: *string* = '#ccc' }  }[] |
`title` | *object* | { `show`: *boolean* = false } |
`toolbox` | *object* | { `show`: *boolean* = false } |
`xAxis` | { `id`: *string* = 'xds'; `show`: *boolean* = true }[] | { `id`: *string* = 'xds'; `show`: *boolean* = true }[] |
`yAxis` | { `id`: *string* = 'yds'; `show`: *boolean* = true }[] | { `id`: *string* = 'yds'; `show`: *boolean* = true }[] |

Defined in: immobilien/immobilien.chartoptions-printoptions.ts:62
