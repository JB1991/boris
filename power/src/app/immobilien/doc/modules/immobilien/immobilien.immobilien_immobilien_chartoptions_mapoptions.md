[power](../../doc.md) / [Exports](../../modules.md) / immobilien/immobilien.chartoptions-mapoptions

# Module: immobilien/immobilien.chartoptions-mapoptions

## Table of contents

### Variables

- [mapOptions](immobilien.immobilien_immobilien_chartoptions_mapoptions.md#mapoptions)

## Variables

### mapOptions

• `Const` **mapOptions**: *object*

#### Type declaration:

Name | Type | Value |
------ | ------ | ------ |
`color` | *string*[] | *string*[] |
`geo` | *object* | { `aspectScale`: *number* = 1; `map`: *string* = 'NDS'; `roam`: *boolean* = false; `show`: *boolean* = false } |
`graphic` | { `bottom`: *any* = null; `id`: *string* = 'copyright'; `left`: *number* = 90; `style`: { `fill`: *string* = '#333'; `fontSize`: *any* = null; `text`: *any* = null; `textAlign`: *string* = 'left' } ; `type`: *string* = 'text'; `z`: *number* = 100 }[] | { `bottom`: *any* = null; `id`: *string* = 'copyright'; `left`: *number* = 90; `style`: { `fill`: *string* = '#333'; `fontSize`: *any* = null; `text`: *any* = null; `textAlign`: *string* = 'left' } ; `type`: *string* = 'text'; `z`: *number* = 100 }[] |
`series` | ({ `coordinateSystem`: *string* = 'geo'; `data`: *any* = null; `itemStyle`: { `normal`: { `show`: *boolean* = true }  } ; `label`: { `emphasis`: { `show`: *boolean* = true } ; `fontSize`: *any* = null; `normal`: { `backgroundColor`: *string* = 'rgba(255,255,255,0.7)'; `formatter`: *string* = '{b}'; `offset`: *number*[] ; `position`: *any* ; `show`: *boolean* = true }  } ; `symbol`: *string* = 'circle'; `symbolSize`: *number* = 4; `type`: *string* = 'effectScatter'; `zlevel`: *number* = 2 } \| { `aspectScale`: *number* = 1; `data`: *any* = null; `itemStyle`: { `emphasis`: { `label`: { `show`: *boolean* = false }  } ; `normal`: { `label`: { `show`: *boolean* = false }  }  } ; `mapType`: *string* = 'NDS'; `name`: *string* ; `roam`: *boolean* = false; `selectedMode`: *any* = null; `type`: *string* = 'map' })[] | ({ `coordinateSystem`: *string* = 'geo'; `data`: *any* = null; `itemStyle`: { `normal`: { `show`: *boolean* = true }  } ; `label`: { `emphasis`: { `show`: *boolean* = true } ; `fontSize`: *any* = null; `normal`: { `backgroundColor`: *string* = 'rgba(255,255,255,0.7)'; `formatter`: *string* = '{b}'; `offset`: *number*[] ; `position`: *any* ; `show`: *boolean* = true }  } ; `symbol`: *string* = 'circle'; `symbolSize`: *number* = 4; `type`: *string* = 'effectScatter'; `zlevel`: *number* = 2 } \| { `aspectScale`: *number* = 1; `data`: *any* = null; `itemStyle`: { `emphasis`: { `label`: { `show`: *boolean* = false }  } ; `normal`: { `label`: { `show`: *boolean* = false }  }  } ; `mapType`: *string* = 'NDS'; `name`: *string* ; `roam`: *boolean* = false; `selectedMode`: *any* = null; `type`: *string* = 'map' })[] |
`title` | *object* | { `left`: *string* = 'center'; `text`: *string* ; `textStyle`: { `fontSize`: *any* = null } ; `top`: *number* = 10 } |
`toolbox` | *object* | { `feature`: { `mySaveAsGeoJSON`: { `icon`: *string* = 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M15.68,15C15.34,13.3 13.82,12 12,12C10.55,12 9.3,12.82 8.68,14C7.17,14.18 6,15.45 6,17A3,3 0 0,0 9,20H15.5A2.5,2.5 0 0,0 18,17.5C18,16.18 16.97,15.11 15.68,15Z'; `onclick`: *any* = null; `show`: *boolean* = true; `title`: *string*  } ; `saveAsImage`: { `icon`: *string* = 'path://M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M6,20H15L18,20V12L14,16L12,14L6,20M8,9A2,2 0 0,0 6,11A2,2 0 0,0 8,13A2,2 0 0,0 10,11A2,2 0 0,0 8,9Z'; `show`: *boolean* = true; `title`: *string*  }  } ; `itemGap`: *number* = 20; `itemSize`: *number* = 30; `orient`: *string* = 'vertical'; `right`: *number* = 5; `show`: *boolean* = false; `top`: *number* = 110 } |
`tooltip` | *object* | { `formatter`: *any* = null; `showDelay`: *number* = 0; `textStyle`: { `fontSize`: *any* = null } ; `transitionDuration`: *number* = 0.2; `trigger`: *string* = 'item' } |

Defined in: immobilien/immobilien.chartoptions-mapoptions.ts:31
