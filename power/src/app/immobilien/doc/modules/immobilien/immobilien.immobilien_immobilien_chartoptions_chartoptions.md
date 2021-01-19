[power](../../doc.md) / [Exports](../../modules.md) / immobilien/immobilien.chartoptions-chartoptions

# Module: immobilien/immobilien.chartoptions-chartoptions

## Table of contents

### Variables

- [chartOptions](immobilien.immobilien_immobilien_chartoptions_chartoptions.md#chartoptions)
- [chartOptionsMerge](immobilien.immobilien_immobilien_chartoptions_chartoptions.md#chartoptionsmerge)
- [chartRange](immobilien.immobilien_immobilien_chartoptions_chartoptions.md#chartrange)

## Variables

### chartOptions

• `Const` **chartOptions**: *object*

#### Type declaration:

Name | Type | Value |
------ | ------ | ------ |
`dataZoom` | ({ `bottom`: *number* = 30; `end`: *number* = 100; `handleIcon`: *string* = 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'; `handleSize`: *string* = '120%'; `height`: *number* = 20; `realtime`: *boolean* = false; `start`: *number* = 80; `top`: *undefined* = null; `type`: *string* = 'slider'; `xAxisIndex`: *number*[]  } \| { `bottom`: *undefined* = 30; `end`: *number* = 100; `handleIcon`: *undefined* = 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'; `handleSize`: *undefined* = '120%'; `height`: *number* = 20; `realtime`: *undefined* = false; `start`: *number* = 80; `top`: *number* = 30; `type`: *string* = 'inside'; `xAxisIndex`: *number*[]  })[] | ({ `bottom`: *number* = 30; `end`: *number* = 100; `handleIcon`: *string* = 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'; `handleSize`: *string* = '120%'; `height`: *number* = 20; `realtime`: *boolean* = false; `start`: *number* = 80; `top`: *undefined* = null; `type`: *string* = 'slider'; `xAxisIndex`: *number*[]  } \| { `bottom`: *undefined* = 30; `end`: *number* = 100; `handleIcon`: *undefined* = 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'; `handleSize`: *undefined* = '120%'; `height`: *number* = 20; `realtime`: *undefined* = false; `start`: *number* = 80; `top`: *number* = 30; `type`: *string* = 'inside'; `xAxisIndex`: *number*[]  })[] |
`graphic` | { `bottom`: *number* = 2; `id`: *string* = 'copyright'; `right`: *number* = 90; `style`: { `fill`: *string* = '#333'; `fontSize`: *any* = null; `text`: *any* = null; `textAlign`: *string* = 'right' } ; `type`: *string* = 'text'; `z`: *number* = 100 }[] | { `bottom`: *number* = 2; `id`: *string* = 'copyright'; `right`: *number* = 90; `style`: { `fill`: *string* = '#333'; `fontSize`: *any* = null; `text`: *any* = null; `textAlign`: *string* = 'right' } ; `type`: *string* = 'text'; `z`: *number* = 100 }[] |
`grid` | ({ `backgroundColor`: *string* = 'rgb(255, 255, 255)'; `borderColor`: *string* = 'transparent'; `bottom`: *number* ; `height`: *undefined* ; `id`: *string* = 'main'; `left`: *string* = '60'; `right`: *string* = '90'; `show`: *boolean* = true; `top`: *any* = null } \| { `backgroundColor`: *undefined* = 'rgb(255, 255, 255)'; `borderColor`: *undefined* = 'transparent'; `bottom`: *string* = '50'; `height`: *number* ; `id`: *string* = 'bottom'; `left`: *string* = '60'; `right`: *string* = '90'; `show`: *undefined* = true; `top`: *undefined* = null })[] | ({ `backgroundColor`: *string* = 'rgb(255, 255, 255)'; `borderColor`: *string* = 'transparent'; `bottom`: *number* ; `height`: *undefined* ; `id`: *string* = 'main'; `left`: *string* = '60'; `right`: *string* = '90'; `show`: *boolean* = true; `top`: *any* = null } \| { `backgroundColor`: *undefined* = 'rgb(255, 255, 255)'; `borderColor`: *undefined* = 'transparent'; `bottom`: *string* = '50'; `height`: *number* ; `id`: *string* = 'bottom'; `left`: *string* = '60'; `right`: *string* = '90'; `show`: *undefined* = true; `top`: *undefined* = null })[] |
`series` | *any*[] | *any*[] |
`textStyle` | *object* | { `fontSize`: *any* = null } |
`title` | *object* | { `left`: *string* = 'center'; `show`: *boolean* = false; `text`: *string* ; `textStyle`: { `fontSize`: *any* = null } ; `top`: *number* = 10 } |
`toolbox` | *object* | { `feature`: { `mySaveAsCSV`: { `icon`: *string* = 'path://M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M10,19H7V17H10V19M10,16H7V14H10V16M10,13H7V11H10V13M14,19H11V17H14V19M14,16H11V14H14V16M14,13H11V11H14V13M13,9V3.5L18.5,9H13Z'; `onclick`: *any* = null; `show`: *boolean* = true; `title`: *string*  } ; `mySaveAsGeoJSON`: { `icon`: *string* = 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15.68,15C15.34,13.3 13.82,12 12,12C10.55,12 9.3,12.82 8.68,14C7.17,14.18 6,15.45 6,17A3,3 0 0,0 9,20H15.5A2.5,2.5 0 0,0 18,17.5C18,16.18 16.97,15.11 15.68,15Z'; `onclick`: *any* = null; `show`: *boolean* = true; `title`: *string*  } ; `mySaveAsImage`: { `icon`: *string* = 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z'; `onclick`: *any* = null; `show`: *boolean* = true; `title`: *string*  }  } ; `itemGap`: *number* = 20; `itemSize`: *number* = 30; `orient`: *string* = 'vertical'; `right`: *number* = 5; `show`: *boolean* = false; `top`: *number* = 190 } |
`tooltip` | *object* | { `backgroundColor`: *string* = 'rgba(245, 245, 245, 0.8)'; `borderColor`: *string* = '#ccc'; `borderWidth`: *number* = 1; `formatter`: *any* = null; `padding`: *number* = 10; `textStyle`: { `color`: *string* = '#000' } ; `trigger`: *string* = 'item' } |
`xAxis` | ({ `axisLabel`: { `fontSize`: *any* = null; `show`: *boolean* = true; `showMaxLabel`: *boolean* = true; `showMinLabel`: *boolean* = true } ; `axisLine`: { `onZero`: *boolean* = false; `show`: *undefined* = true } ; `axisTick`: *undefined* ; `boundaryGap`: *boolean* = false; `data`: *any* = null; `gridIndex`: *undefined* = 1; `id`: *undefined* = 'xds'; `max`: *undefined* = 100; `min`: *undefined* = 0; `name`: *string* ; `silent`: *undefined* = true; `splitLine`: { `show`: *boolean* = false } ; `type`: *string* = 'category' } \| { `axisLabel`: { `fontSize`: *undefined* = null; `show`: *boolean* = false; `showMaxLabel`: *undefined* = true; `showMinLabel`: *undefined* = true } ; `axisLine`: { `onZero`: *undefined* = false; `show`: *boolean* = false } ; `axisTick`: { `show`: *boolean* = false } ; `boundaryGap`: *boolean* = false; `data`: *undefined* = null; `gridIndex`: *number* = 1; `id`: *string* = 'xds'; `max`: *number* = 100; `min`: *number* = 0; `name`: *undefined* ; `silent`: *boolean* = true; `splitLine`: { `show`: *boolean* = false } ; `type`: *string* = 'value' })[] | ({ `axisLabel`: { `fontSize`: *any* = null; `show`: *boolean* = true; `showMaxLabel`: *boolean* = true; `showMinLabel`: *boolean* = true } ; `axisLine`: { `onZero`: *boolean* = false; `show`: *undefined* = true } ; `axisTick`: *undefined* ; `boundaryGap`: *boolean* = false; `data`: *any* = null; `gridIndex`: *undefined* = 1; `id`: *undefined* = 'xds'; `max`: *undefined* = 100; `min`: *undefined* = 0; `name`: *string* ; `silent`: *undefined* = true; `splitLine`: { `show`: *boolean* = false } ; `type`: *string* = 'category' } \| { `axisLabel`: { `fontSize`: *undefined* = null; `show`: *boolean* = false; `showMaxLabel`: *undefined* = true; `showMinLabel`: *undefined* = true } ; `axisLine`: { `onZero`: *undefined* = false; `show`: *boolean* = false } ; `axisTick`: { `show`: *boolean* = false } ; `boundaryGap`: *boolean* = false; `data`: *undefined* = null; `gridIndex`: *number* = 1; `id`: *string* = 'xds'; `max`: *number* = 100; `min`: *number* = 0; `name`: *undefined* ; `silent`: *boolean* = true; `splitLine`: { `show`: *boolean* = false } ; `type`: *string* = 'value' })[] |
`yAxis` | ({ `axisLabel`: { `fontSize`: *any* = null; `show`: *boolean* = true } ; `axisLine`: *undefined* ; `axisTick`: *undefined* ; `boundaryGap`: *string*[] ; `gridIndex`: *undefined* = 1; `id`: *undefined* = 'xds'; `max`: *undefined* = 100; `min`: *undefined* = 0; `name`: *string* ; `nameGap`: *number* = 35; `nameLocation`: *string* = 'middle'; `nameRotate`: *number* = 90; `scale`: *boolean* = true; `silent`: *undefined* = true; `splitLine`: *undefined* ; `splitNumber`: *undefined* = 2; `type`: *string* = 'value' } \| { `axisLabel`: { `fontSize`: *undefined* = null; `show`: *boolean* = false } ; `axisLine`: { `show`: *boolean* = false } ; `axisTick`: { `show`: *boolean* = false } ; `boundaryGap`: *undefined* ; `gridIndex`: *number* = 1; `id`: *string* = 'yds'; `max`: *number* = 0; `min`: *number* = -1; `name`: *undefined* ; `nameGap`: *undefined* = 35; `nameLocation`: *undefined* = 'middle'; `nameRotate`: *undefined* = 90; `scale`: *boolean* = false; `silent`: *boolean* = true; `splitLine`: { `show`: *boolean* = false } ; `splitNumber`: *number* = 2; `type`: *string* = 'value' })[] | ({ `axisLabel`: { `fontSize`: *any* = null; `show`: *boolean* = true } ; `axisLine`: *undefined* ; `axisTick`: *undefined* ; `boundaryGap`: *string*[] ; `gridIndex`: *undefined* = 1; `id`: *undefined* = 'xds'; `max`: *undefined* = 100; `min`: *undefined* = 0; `name`: *string* ; `nameGap`: *number* = 35; `nameLocation`: *string* = 'middle'; `nameRotate`: *number* = 90; `scale`: *boolean* = true; `silent`: *undefined* = true; `splitLine`: *undefined* ; `splitNumber`: *undefined* = 2; `type`: *string* = 'value' } \| { `axisLabel`: { `fontSize`: *undefined* = null; `show`: *boolean* = false } ; `axisLine`: { `show`: *boolean* = false } ; `axisTick`: { `show`: *boolean* = false } ; `boundaryGap`: *undefined* ; `gridIndex`: *number* = 1; `id`: *string* = 'yds'; `max`: *number* = 0; `min`: *number* = -1; `name`: *undefined* ; `nameGap`: *undefined* = 35; `nameLocation`: *undefined* = 'middle'; `nameRotate`: *undefined* = 90; `scale`: *boolean* = false; `silent`: *boolean* = true; `splitLine`: { `show`: *boolean* = false } ; `splitNumber`: *number* = 2; `type`: *string* = 'value' })[] |

Defined in: immobilien/immobilien.chartoptions-chartoptions.ts:20

___

### chartOptionsMerge

• `Const` **chartOptionsMerge**: *object*

#### Type declaration:

Name | Type | Value |
------ | ------ | ------ |
`dataZoom` | { `bottom`: *number* = 30; `end`: *any* = null; `handleIcon`: *string* = 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'; `handleSize`: *string* = '120%'; `height`: *number* = 20; `realtime`: *boolean* = false; `start`: *any* = null; `type`: *string* = 'slider'; `xAxisIndex`: *number*[]  }[] | { `bottom`: *number* = 30; `end`: *any* = null; `handleIcon`: *string* = 'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z'; `handleSize`: *string* = '120%'; `height`: *number* = 20; `realtime`: *boolean* = false; `start`: *any* = null; `type`: *string* = 'slider'; `xAxisIndex`: *number*[]  }[] |
`graphic` | ({ `children`: *any* = null; `id`: *string* = 'legend'; `ignore`: *boolean* = true; `left`: *any* = null; `style`: *undefined* ; `top`: *number* = 65; `type`: *string* = 'group'; `z`: *number* = 100 } \| { `children`: *undefined* = null; `id`: *string* = 'zeitraum'; `ignore`: *undefined* = true; `left`: *string* = 'center'; `style`: { `fill`: *string* = '#333'; `fontSize`: *any* = null; `text`: *any* = null; `textAlign`: *string* = 'center' } ; `top`: *number* = 65; `type`: *string* = 'text'; `z`: *number* = 101 })[] | ({ `children`: *any* = null; `id`: *string* = 'legend'; `ignore`: *boolean* = true; `left`: *any* = null; `style`: *undefined* ; `top`: *number* = 65; `type`: *string* = 'group'; `z`: *number* = 100 } \| { `children`: *undefined* = null; `id`: *string* = 'zeitraum'; `ignore`: *undefined* = true; `left`: *string* = 'center'; `style`: { `fill`: *string* = '#333'; `fontSize`: *any* = null; `text`: *any* = null; `textAlign`: *string* = 'center' } ; `top`: *number* = 65; `type`: *string* = 'text'; `z`: *number* = 101 })[] |
`legend` | *object* | { `data`: *any* = null; `formatter`: *any* = null; `show`: *boolean* = false; `top`: *number* = 60; `z`: *number* = -1 } |
`series` | *any* | null |
`title` | *object* | { `left`: *string* = 'center'; `show`: *boolean* = false; `subtext`: *any* = null; `text`: *string* ; `top`: *number* = 10 } |

Defined in: immobilien/immobilien.chartoptions-chartoptions.ts:191

___

### chartRange

• `Const` **chartRange**: *object*

#### Type declaration:

Name | Type | Value |
------ | ------ | ------ |
`animation` | *boolean* | false |
`areaStyle` | *object* | { `color`: *string* = '#ccc' } |
`data` | *number*[][] | *number*[][] |
`id` | *string* | 'a' |
`itemStyle` | *object* | { `color`: *string* = '#ccc' } |
`silent` | *boolean* | true |
`smooth` | *boolean* | false |
`symbol` | *string* | 'none' |
`type` | *string* | 'line' |
`xAxisIndex` | *number* | 1 |
`yAxisIndex` | *number* | 1 |
`z` | *number* | -1 |

Defined in: immobilien/immobilien.chartoptions-chartoptions.ts:1
