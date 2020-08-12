/**
 * Convert REM to PX
 * source: https://stackoverflow.com/a/42769683
 *
 * @param rem size in rem
 *
 * @return size in px
 */
export function convertRemToPixels(rem: number): number {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

/**
 * Convert RGB color component to hex
 *
 * Source: https://stackoverflow.com/a/5624139
 *
 * @param {int} c Color Component
 * @return {string} Hex Component
 */
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
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
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
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
        if (color.slice(0, 3) === 'rgb') {
            const cc = color.slice(4).replace(')', '').split(',');
            return rgbToHex(parseInt(cc[0], 10), parseInt(cc[1], 10), parseInt(cc[2], 10));
        } else if (Array.isArray(color) && color.length === 3 ) {
            return rgbToHex(color[0], color[1], color[2]);
        } else if (color.slice(0, 1) === '#') {
            return color;
        }
    }
    return '#000000';

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

    const f = parseInt(color.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;

    /* tslint:disable:no-bitwise */
    const R = f >> 16; // eslint-disable-line no-bitwise
    const G = f >> 8 & 0x00FF; // eslint-disable-line no-bitwise
    const B = f & 0x0000FF; // eslint-disable-line no-bitwise
    /* tslint:enable:no-bitwise */

    return  '#' + (
        0x1000000
        + (Math.round( (t - R) * p) + R) * 0x10000
        + (Math.round( (t - G) * p) + G) * 0x100
        + (Math.round( (t - B) * p) + B)
    ).toString(16).slice(1);
}


/**
 * Appending zeros
 *
 * @param n number
 *
 * @return zero padding number
 */
export function appendLeadingZeroes(n) {
    if (n <= 9) {
        return '0' + n;
    }
    return n;
}

/**
 * get the current Daten with leading zeroes
 *
 * @return Date
 */
export function getDate() {
    const dt = new Date();

    return dt.getFullYear();
}


/**
 * Dowload Binary Data as file
 *
 * @param data Data for Download
 * @param filename Filename for the Data to download
 */
export function downloadFile(data, filename, filetype = 'text/csv', isurl = false) {
    let url = data;

    if (!isurl) {
        const blob = new Blob([data], { type: filetype });
        url = window.URL.createObjectURL(blob);
    }

    const anchor = document.createElement('a');
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
export function resolve(path, obj: any = self, separator = '.') {
    const properties = Array.isArray(path) ? path : path.split(separator);
    return properties.reduce((prev, curr) => prev && prev[curr], obj);
}


/**
 * Convert Array to CSV
 *
 * @param array Array with th data which should converted
 * @param keys Keys which data should be used
 *
 * @return CSV String
 */
export function convertArrayToCSV(array, keys, split = ';', feld= '"') {
    const tmp = [];

    for (let i = 0; i < array.length; i++) {
        let stmp = '';
        for (let k = 0; k < keys.length; k++) {
            if (stmp !== '') {
                stmp += split;
            }

            let val = resolve(keys[k], array[i]);

            if (typeof val === 'number') {
                val = ('' + val).replace('.', ',');
            }

            stmp += feld + val + feld;
        }
        tmp.push(stmp);
    }

    return tmp.join('\r\n');

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

    for (let i = 0; i < data['features'].length; i++) {
        if (feature === data['features'][i]['properties']['name']) {
            return data['features'][i];
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

    const geoarray = [];

    for (let i = 0; i < data['features'].length; i++) {
        if (features.includes(data['features'][i]['properties']['name'])) {
            geoarray.push(data['features'][i]['geometry']);
        }
    }

    return {
        'type': 'GeometryCollection',
        'geometries': geoarray
    };

}


/* vim: set expandtab ts=4 sw=4 sts=4: */
