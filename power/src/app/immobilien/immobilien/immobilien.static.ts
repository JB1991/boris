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

    public loadConfig(json: Object): boolean {
        // Layout
        this.layoutRtl = json['layoutRtl'];

        // ABGN
        this.agnbUrl = json['agnbUrl'];

        // Geo Choord
        this.data.geoCoordMap = json['map']['geoCoordMap'];

        // Regionen
        this.data.regionen = json['regionen'];

        // Draw-Presets
        this.data.presets = json['presets'];

        this.data.allItems = json['items'];
        this.data.shortNames = json['shortNames'];

        // Selections
        this.data.selections = json['selections'];

        return true;

    }

    public parseGemeinden(gem: string): boolean {

        const rgn = {};
        const lines = gem.split(/\r\n|\r|\n/g);

        // Iterate over all lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(';');

            // If line is valid
            if (line[0].length === 7) {

                rgn[line[1]] = line[2];
            }
        }

        this.data.gemeinden = rgn;

        return true;
    }

    public parseNipix(nipix: string): boolean {
        const npx = {};
        this.data.nipix = {};

        const lines = nipix.split(/\r\n|\r|\n/g);

        // Iterate over all lines
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].split(';');

            // If line is valid
            if (line[0].length > 10) {

                if (!this.data.nipix.hasOwnProperty(line[0])) {
                    this.data.nipix[line[0]] = {};
                }


                if ((typeof line[1] === 'string') && (line[1].indexOf('_') !== -1)) {
                    line[1] = line[1].substr(0, line[1].indexOf('_'));
                }

                if (!this.data.nipix[line[0]].hasOwnProperty(line[1])) {
                    this.data.nipix[line[0]][line[1]] = {};
                }

                const nval = {};

                nval['index'] = line[4];
                nval['faelle'] = Math.round(Number(line[3].replace(',', '.')));

                if (nval['index'] !== '') {
                    this.data.nipix[line[0]][line[1]][line[2]] = nval;
                }

            }
        }

        return true;
    }


}


/* vim: set expandtab ts=4 sw=4 sts=4: */
