export class ImmobilienHelper {
    /**
     * Convert REM to PX
     * source: https://stackoverflow.com/a/42769683
     *
     * @param rem size in rem
     * @returns size in px
     */
    public static convertRemToPixels(rem: number): number {
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    /**
     * Convert RGB color component to hex
     *
     * Source: https://stackoverflow.com/a/5624139
     *
     * @param {number} c Color Component
     * @returns {string} Hex Component
     */
    public static componentToHex(c: number): string {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }

    /**
     * Convert RGB color to Hex
     *
     * @param {number} r red color
     * @param {number} g green color
     * @param {number} b blue coor
     * @returns {string} Hex-Color
     */
    public static rgbToHex(r: number, g: number, b: number): string {
        return '#' + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
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
     * @returns HexColor (#rrggbb)
     */
    public static convertColor(color: string | number[]): string {
        if (color !== undefined && color !== null) {
            if (typeof color === 'string' && color.slice(0, 3) === 'rgb') {
                const cc = color.slice(4).replace(')', '').split(',');
                return this.rgbToHex(parseInt(cc[0], 10), parseInt(cc[1], 10), parseInt(cc[2], 10));
            } else if (Array.isArray(color) && color.length === 3) {
                return this.rgbToHex(color[0], color[1], color[2]);
            } else if (typeof color === 'string' && color.slice(0, 1) === '#') {
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
     * @returns Modified color
     */
    public static modifyColor(color: string | number[], percent: number): string {

        color = this.convertColor(color);

        const f = parseInt(color.slice(1), 16);
        const t = percent < 0 ? 0 : 255;
        const p = percent < 0 ? percent * -1 : percent;

        /* eslint-disable no-bitwise */
        const R = f >> 16; // eslint-disable-line no-bitwise
        const G = f >> 8 & 0x00FF; // eslint-disable-line no-bitwise
        const B = f & 0x0000FF; // eslint-disable-line no-bitwise
        /* eslint-enable no-bitwise */

        return '#' + (
            0x1000000
            + (Math.round((t - R) * p) + R) * 0x10000
            + (Math.round((t - G) * p) + G) * 0x100
            + (Math.round((t - B) * p) + B)
        ).toString(16).slice(1);
    }

    /**
     * Appending zeros
     *
     * @param n number
     * @returns zero padding number
     */
    public static appendLeadingZeroes(n: number): string {
        if (n <= 9) {
            return '0' + n;
        }
        return n.toString();
    }

    /**
     * get the current Daten with leading zeroes
     *
     * @returns Date
     */
    public static getDate(): number {
        const dt = new Date();

        return dt.getFullYear();
    }

    /**
     * parse String as Flaot
     *
     * @param value String or float
     * @returns float
     */
    static static parseStringAsFloat(value: string|number): number {
        if (typeof value === 'string') {
            return parseFloat(value.replace(',', '.'));
        } else {
            return value;
        }
    }

    /**
     * Dowload Binary Data as file
     *
     * @param data Data for Download
     * @param filename Filename for the Data to download
     * @param filetype Content-Type
     * @param isurl True if is url
     */
    static downloadFile(
        data: string,
        filename: string,
        filetype: string = 'text/csv',
        isurl: boolean = false
    ): void {
        let url = data;
        let blob;

        if (!isurl) {
            blob = new Blob([data], { type: filetype });
            url = window.URL.createObjectURL(blob);
        }

        if (navigator.msSaveBlob) { // IE and Edge
            if (!blob) {
                // base64 to blob convertion
                const byteString = atob(url.split(',')[1]);
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);

                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                blob = new Blob([ab], { type: 'image/png' });
            }

            // download
            navigator.msSaveBlob(blob, filename);
        } else {
            const anchor = document.createElement('a');
            anchor.download = filename;
            /* eslint-disable-next-line scanjs-rules/assign_to_href */
            anchor.href = url;
            anchor.click();
        }
    }

    /**
     * Resolves key in Array
     *
     * Source: https://stackoverflow.com/a/22129960
     *
     * @param path Path of the Property
     * @param obj Object
     * @param separator Separator used in path
     * @returns Resolved Property
     */
    public static resolve(path: string | string[], obj: any = self, separator = '.'): any {
        const properties = Array.isArray(path) ? path : path.split(separator);
        return properties.reduce((prev, curr) => prev && prev[curr], obj);
    }

    /**
     * Convert Array to CSV
     *
     * @param array Array with th data which should converted
     * @param keys Keys which data should be used
     * @param split Split value
     * @param feld Quote character
     * @returns CSV String
     */
    static static convertArrayToCSV(array: any[], keys: any[], split: string = ';', feld: string = '"'): string {
        const tmp = new Array<any>();

        for (let i = 0; i < array.length; i++) {
            let stmp = '';
            for (let k = 0; k < keys.length; k++) {
                if (stmp !== '') {
                    stmp += split;
                }

                let val = this.resolve(keys[k], array[i]);

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
     * @returns Feature if found, empty object if not found
     */
    public static getSingleFeature(data: any, feature: any): any {
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
     * @returns GeometryCollection Object (Empty geometries property if no feature were found)
     */
    public static getGeometryArray(data: any, features: any): any {

        const geoarray = new Array<any>();

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
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
