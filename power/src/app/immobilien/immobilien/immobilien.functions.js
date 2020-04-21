/**
 * Convert RGB color component to hex
 *
 * Source: https://stackoverflow.com/a/5624139
 *
 * @param {int} c Color Component
 * @return {string} Hex Component
 */
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 * Convert RGB color to Hex
 *
 * @param {int} r red color
 * @param {int} g green color
 * @param {int} b blue coor
 *
 * @return {string} Hex-Color
 */
export function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

/**
 * Appending zeros
 *
 * @param n number
 *
 * @return zero padding number
 */
function appendLeadingZeroes(n){
    if (n <= 9) {
        return "0" + n;
    }
    return n
}

/**
 * get the current Daten with leading zeroes
 *
 * @return Date
 */
export function getDate() {
    let dt = new Date();

    return /*appendLeadingZeroes(dt.getDate())+'.'+*//*appendLeadingZeroes(dt.getMonth()+1)+'/'+*/dt.getFullYear();
}

/**
 * Convert given Color to HexColor
 *
 * Input color can be ofe of this formats:
 * - RGB:   rgb([r],[g],[b])
 * - Array: [r, g, b]
 * - Hex:   #rrggbb
 *
 * @param color Input Color
 *
 * @return HexColor (#rrggbb)
 */
export function convertColor(color) {
    if (color !== undefined && color !== null) {
        if (color.slice(0, 3) == "rgb") {
            var cc = color.slice(4).replace(")","").split(",");
            return rgbToHex(parseInt(cc[0]), parseInt(cc[1]), parseInt(cc[2]));
        } else if (Array.isArray(color) && color.length == 3 ) {
            return rgbToHex(color[0], color[1], color[2]);
        } else if (color.slice(0,1)=="#") {
            return color;
        }
    }
    return "#000000";

}

export function modifyRegionen(regionen, modifyArray) {

    let newRegionen = JSON.parse(JSON.stringify(regionen));

    for (var i = 0; i < modifyArray.length; i++) {
        for (var v = 0; v < modifyArray[i]["values"].length; v++) {
            newRegionen[modifyArray[i]["values"][v]]["color"] = modifyArray[i]["colors"];
        }
    }

    return newRegionen;
}

/**
 * Convert myRegion list to MapRegionen array.
 *
 * @param regionen Regionen Object
 * @param myregion FindMyRegion Region
 * @param selectionList List of selected Regions
 * @param lighten (default false) Lighten the areaColor
 *
 * @return MapRegionen array
 */
export function getMyMapRegionen(regionen, myregion=null, selectionList=null, lighten=false) {
    var res = [];
    let keys = Object.keys(regionen);
    for (var i = 0; i < keys.length; i++) {
        let bw = 1;
        let bc = "#333333";

        if (myregion !== undefined && myregion !== null && myregion == keys[i]) {
            bw = 4;
            bc = "#ffffff";
        }

        let region = {
            "name": keys[i],
            "itemStyle": {
                "areaColor": "#dddddd",
                "borderColor": bc,
                "borderWidth": bw
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": convertColor(regionen[keys[i]].color),
                    "borderColor": bc,
                    "borderWidth": bw
                }
            }
        };

        if (lighten==true)
            region["itemStyle"]["areaColor"] = modifyColor(regionen[keys[i]].color,0.85);

        if (selectionList !== null && selectionList !== undefined && Array.isArray(selectionList)) {
            if (selectionList.includes(keys[i])) {
                region["selected"] = true;
            }
        }

        res.push(region);
    }

    return res;
}


/**
 * Modify a color (lighten or darken)
 *
 * Source: https://stackoverflow.com/a/13542669
 *
 * @param color Input Color (Choose Format accepted by convertColor)
 * @param percent lighten or darken -1<=0<=1
 *
 * @return Modified color
 */
export function modifyColor(color, percent) {

    color = convertColor(color);

    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;

    return  "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}


/**
 * Dowload Binary Data as file
 *
 * @param data Data for Download
 * @param filename Filename for the Data to download
 */
export function downloadFile(data, filename, filetype='text/csv', isurl=false) {
    if (!isurl) {
        const blob = new Blob([data], { type: filetype });
        const url= window.URL.createObjectURL(blob);
    } else
        const url = data;

    var anchor = document.createElement("a");
    anchor.download = filename;
    anchor.href = url;
    anchor.click();
}


/**
 * Resolves key in Array
 *
 * Source: https://stackoverflow.com/a/22129960
 *
 * @param path Path of the Property
 * @param obj Object
 * @param separator Separator used in path
 *
 * @return Resolved Property
 */
function resolve(path, obj=self, separator='.') {
    var properties = Array.isArray(path) ? path : path.split(separator)
        return properties.reduce((prev, curr) => prev && prev[curr], obj)
}


/**
 * Convert Array to CSV
 *
 * @param array Array with th data which should converted
 * @param keys Keys which data should be used
 *
 * @return CSV String
 */
export function convertArrayToCSV(array, keys, split=";", feld="\"") {
    var tmp = [];

    for (var i = 0; i < array.length; i++) {
        let stmp = "";
        for (let k = 0; k < keys.length; k++) {
            if (stmp != "")
                stmp += split;

            let val = resolve(keys[k], array[i]);

            if (typeof val == 'number')
                val = (""+val).replace(".",",");

            stmp += feld+val+feld;
        }
        tmp.push(stmp);
    }

    return tmp.join("\r\n");

}

/**
 * Get Single Feature from GeoJSON
 *
 * @param data GeoJSON Data
 * @param feature Feature which should be extracted
 *
 * @return Feature if found, empty object if not found
 */
export function getSingleFeature(data, feature) {

    for (var i = 0; i < data["features"].length; i++) {
        if (feature == data["features"][i]["properties"]["name"]) {
            return data["features"][i];
        }
    }

    return {};

}


/**
 * Get an Array of given Geometries from GeoJSON
 *
 * @param data GeoJSON Data
 * @param features Array of Features for the Collection
 *
 * @return GeometryCollection Object (Empty geometries property if no feature were found)
 */
export function getGeometryArray(data, features) {

    var geoarray = [];

    for (var i = 0; i < data["features"].length; i++) {
        if (features.includes(data["features"][i]["properties"]["name"])) {
            geoarray.push(data["features"][i]["geometry"]);
        }
    }

    return {
        "type": "GeometryCollection",
        "geometries": geoarray
    };

}


/**
 * Generate a Series object
 *
 * @param name Series Name
 * @param data Series data array
 * @param color Series color (Must be valid for convertColor)
 * @param labelFormatter Custom labelFormatter function
 * @param selectedChartLine Name of the selected chart line (for highlghting)
 * @param zIndex xAxisIndex (degfault 0) (see echarts api)
 * @param yIndex yAxisIndex (Default 0) (see echarts api)
 * @param seriesType SeriesTyp (default line) (see echarts api)
 *
 * @return echarts Series Object
 */
export function generateSeries(name, data, color, labelFormatter=null, selectedChartLine="", xIndex=0, yIndex=0, seriesType="line") {

    let seriesColor = convertColor(color);
    let zindex = 0;

    if ((selectedChartLine != "") && (selectedChartLine != name))
        seriesColor = modifyColor(color, 0.9);
    else
        zindex = 1;

    // Series Object
    let ret = {
        "name": name,
        "type": seriesType,
        "smooth": false,
        "symbol": 'circle',
        "symbolSize": 4,
        "sampling": 'average',
        "zlevel": zindex,
        "itemStyle": {
            "color": seriesColor,
            "borderWidth": 16,
            "borderColor": "rgba(255,255,255,0)"
        },
        "emphasis": {
            "itemStyle": {
                "color": seriesColor
            }
        },
        label: {
            normal: {
                show: true,
                position: 'right',
                formatter: labelFormatter
            },
        },
        "data": data
    };


    // Set the corresponding Grid/Axis id
    if (xIndex !== 0)
        ret["xAxisIndex"] = xIndex;

    if (yIndex !== 0)
        ret["yAxisIndex"] = yIndex;

    return ret;
}

/**
 * Generate Series data
 *
 * @param data raw Series Data
 * @param date date arry for data
 * @param field Data array field
 * @offset Offset for ercentage calculation
 *
 * @return Data array
 */
export function generateDrawSeriesData(data, date=[], field = null, offset = 100) {

    // Empty data array
    var ret = [];

    // Iterate over all available data
    for (let d = 0; d< date.length; d++) {
        if (data.hasOwnProperty(date[d].replace("/","_")) || field === null) {

            let val = "";
            let fval = 0;

            if (field === null)
                val = data[d];
            else
                val = data[date[d].replace("/","_")][field];


            if (typeof val == "string")
                fval = parseFloat(val.replace(",","."));
            else
                fval = val;

            fval = parseFloat((fval + (100-offset)).toFixed(2));

            ret.push(fval);
        } else {
            ret.push(undefined);
        }
    }
    return ret;
}


/**
 * Get NiPix Data in given Timeslot
 *
 * @param date Date Array
 * @param series series array
 * @param region region to get timeslot
 * @param tstart Timeslot start date
 * @param tend Timeslot end date
 * @param hiddendate Hiddendata (Sales) for the series
 *
 * @return Timeslot array or empty array if region not found
 */
export function getNiPixTimeslot(date, series, region, tstart, tend, hiddendata={}) {
    var data = null;
    var datafaelle = 0;

    for (var i = 0; i < series.length; i++) {
        if (series[i]["name"] == region) {
            if (series[i]["data"].length > 0) {
                data = series[i]["data"];
            }
        }
    }

    if (hiddendata.hasOwnProperty(region))
        datafaelle = hiddendata[region];

    if (data !== null && datafaelle!== null) {

        var res = [];

        for (var i = tstart; i < tend; i++) {
            res.push({
                'date': date[i].replace("/","_"),
                'index': data[i],
                'sales': datafaelle[i]
            });
        }

        return res;

    } else {
        return [];
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
