interface NipixStaticTextOptions {
    fontSizePage?: number;
    fontSizeBase?: number;
    fontSizeCopy?: number;
    fontSizeAxisLabel?: number;
    fontSizeMap?: number;
}

interface NipixStaticData {
    nipix?: any;
    gemeinden?: any;
    geoCoordMap?: any;
    regionen?: any;
    presets?: any;
    allItems?: any;
    shortNames?: any;
    selections?: any;

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
        'gemeinden': {},
        'geoCoordMap': [],
        'regionen': [],
        'presets': [],
        'allItems': [],
        'shortNames': {},
        'selections': []
    };


    // Reference Date for the nipix
    public referenceDate = '2016_1';


    public constructor() {
    }

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

    public parseGemeinden(gem: string): boolean {

        const rgn = [];
        const lines = gem.split(/\r\n|\r|\n/g);

        // Iterate over all lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(';');

            // If line is valid
            if (line[0].length === 7) {

                rgn.push({'name': line[1], 'ags': line[0], 'woma_id': line[2]});
            }
        }

        this.data.gemeinden = rgn;

        return true;
    }

    public procMap(geoJson: any): any {

        const geoMap = {
            'type':'FeatureCollection',
            'totalFeatures':'unknown',
            'features':[]
        };

        const regionenData = {};
        const geoCoordMap = { 'left': [], 'right': [], 'top': [], 'bottom': [] };
        const nipixData = {};

        for (let i = 0; i < geoJson['features'].length; i++) {

            const props = geoJson['features'][i]['properties'];

            if (geoJson['features'][i]['geometry']['type'] !== 'Point') {

                // Wohnungsmarktkarte
                geoMap.features.push(geoJson['features'][i]);

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

                    nipixData[nkey[n]][props['name']] = nipixParse[nkey[n]];
                }

            } else {
                // Point
                geoCoordMap[props['position']].push({
                    'name': props['name'],
                    'value': geoJson['features'][i]['geometry']['coordinates']
                });
            }
        }

        this.data.regionen = regionenData;
        this.data.geoCoordMap = geoCoordMap;
        this.data.nipix = nipixData;

        return geoMap;
    }


}


/* vim: set expandtab ts=4 sw=4 sts=4: */
