interface NipixStaticTextOptions {
    fontSizePage: number;
    fontSizeBase: number;
    fontSizeCopy: number;
    fontSizeAxisLabel: number;
    fontSizeMap: number;
}

interface NipixStaticData {
    nipix?: any;
    gemeinden?: any[];
    geoCoordMap?: any;
    regionen?: any;
    presets?: any[];
    allItems?: any[];
    shortNames?: any;
    selections?: any[];
}

export class NipixStatic {

    public layoutRtl = false;
    public agnbUrl = '';
    public chartExportWidth = 1800;
    public textOptions: NipixStaticTextOptions = {
        'fontSizePage': 1,
        'fontSizeBase': 0.8,
        'fontSizeCopy': 0.7,
        'fontSizeAxisLabel': 0.8,
        'fontSizeMap': 0.8
    };
    public data: NipixStaticData = {
        'nipix': {},
        'gemeinden': [],
        'geoCoordMap': {},
        'regionen': {},
        'presets': [],
        'allItems': [],
        'shortNames': {},
        'selections': []
    };


    // Reference Date for the nipix
    public referenceDate = '2016_1';


    public constructor() {
    }

    /**
     * loadConfig
     * @param json data
     * @returns always true?
     */
    public loadConfig(json: any): boolean {
        // Layout
        this.layoutRtl = json['layoutRtl'];

        // ABGN
        this.agnbUrl = json['agnbUrl'];

        // Draw-Presets
        this.data.presets = json['presets'];

        this.data.allItems = json['items'];
        this.data.shortNames = json['shortNames'];

        // Selections
        this.data.selections = json['selections'];

        return true;

    }

    /**
     * parseGemeinden
     * @param gem gemeinden
     * @returns always true?
     */
    public parseGemeinden(gem: string): boolean {

        const rgn = [];
        const lines = gem.split(/\r\n|\r|\n/g);

        // Iterate over all lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(';');

            // If line is valid
            if (line[0].length === 7) {

                rgn.push({ 'name': line[1], 'ags': line[0], 'woma_id': line[2] });
            }
        }

        this.data.gemeinden = rgn;

        return true;
    }

    /**
     * procMap
     * @param geoJson geo json data
     * @returns
     */
    public procMap(geoJson: any): any {

        const geoMap = {
            'type': 'FeatureCollection',
            'totalFeatures': 'unknown',
            'features': new Array<any>()
        };

        const regionenData: any = {};
        const geoCoordMap: any = { 'left': [], 'right': [], 'top': [], 'bottom': [] };
        const nipixData: any = {};

        const lastAvailable = [];

        for (let i = 0; i < geoJson['features'].length; i++) {

            const feature = geoJson['features'][i];
            const props = feature['properties'];

            if (feature['geometry']['type'] !== 'Point') {

                // Wohnungsmarktkarte
                geoMap.features.push(feature);

                // Wohnungsmarktregionen
                regionenData[props['name']] = {
                    'name': props['WOMA_NAME'],
                    'short': props['WOMA_SHORT'],
                    'color': props['WOMA_COLOR'],
                    'colorh': props['WOMA_COLORH']
                };

                // Nipix Daten
                const nipixParse = JSON.parse(props['nipix']);
                const nkey = Object.keys(nipixParse);

                for (let n = 0; n < nkey.length; n++) {

                    if (!nipixData.hasOwnProperty(nkey[n])) {
                        nipixData[nkey[n]] = {};
                    }

                    const la = Object.keys(nipixParse[nkey[n]]);
                    lastAvailable.push(la[la.length - 1]);

                    nipixData[nkey[n]][props['name']] = nipixParse[nkey[n]];
                }

            } else {
                // Point
                geoCoordMap[props['position']].push({
                    'name': props['name'],
                    'value': feature['geometry']['coordinates']
                });
            }
        }

        this.data.regionen = regionenData;
        this.data.geoCoordMap = geoCoordMap;
        this.data.nipix = nipixData;

        // Get last available Data; Assume the last Data Interval is equal
        const las = lastAvailable[0].split('_');

        return { 'map': geoMap, 'la': [parseInt(las[0], 10), parseInt(las[1], 10)]};
    }


}


/* vim: set expandtab ts=4 sw=4 sts=4: */
