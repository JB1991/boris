import * as echarts from 'echarts';
import * as ImmobilenNipixStatic from './immobilien.static';
import * as ImmobilienNipixRuntimeCalculator from './immobilien.runtime-calculator';
import * as ImmobilienFormatter from './immobilien.formatter';
import * as ImmobilienExport from './immobilien.export';
import { ImmobilienUtils } from './immobilien.utils';

interface NipixRuntimeMap {
    obj?: any;
    options?: echarts.EChartOption;
}

interface NipixRuntimeState {
    initState?: number;
    selectedChartLine?: string;
    rangeStartIndex?: number;
    rangeEndIndex?: number;
    selection?: any;
    activeSelection?: number;
    highlightedSeries?: string;
    selectedMyRegion?: string;
    mapWidth?: number;
}

interface NipixRuntimeCalculated {
    mapRegionen?: any;
    drawData?: any;
    hiddenData?: any;
    chartTitle?: string;
    legendText?: any;
}

/* eslint-disable max-lines */
export class NipixRuntime {

    private nipixStatic: ImmobilenNipixStatic.NipixStatic;

    private highlightedTimeout = setTimeout(this.highlightTimeout.bind(this), 10000);

    public formatter: ImmobilienFormatter.ImmobilienFormatter;
    public export: ImmobilienExport.ImmobilienExport;
    public calculator: ImmobilienNipixRuntimeCalculator.NipixRuntimeCalculator;

    public map: NipixRuntimeMap = {
        'obj': null,
        'options': {}
    };
    public chart: NipixRuntimeMap = {
        'obj': null,
        'options': {}
    };


    public state: NipixRuntimeState = {
        'initState': 0,
        'selectedChartLine': '',
        'rangeStartIndex': 0,
        'rangeEndIndex': 0,
        'selection': [],
        'activeSelection': 0,
        'highlightedSeries': '',
        'selectedMyRegion': '',
        'mapWidth': 10000
    };

    public availableQuartal = [];

    public availableNipixCategories = [];

    public drawPresets = [];

    public calculated: NipixRuntimeCalculated = {
        'mapRegionen': [],
        'drawData': [],
        'hiddenData': [],
        'chartTitle': '',
        'legendText': {}
    };

    public locale = {
        'Preisentwicklung Niedersachsen, gesamt': $localize`Preisentwicklung Niedersachsen, gesamt`,
        'gebrauchte Eigenheime': $localize`Gebrauchte Eigenheime`,
        'EH': $localize`EH`,
        'gebrauchte Eigentumswohnungen': $localize`Gebrauchte Eigentumswohnungen`,
        'EW': $localize`EW`,
        'Vergleich Preisentwicklung von städtischen und ländlichen Regionen': $localize`Vergleich Preisentwicklung von städtischen und ländlichen Regionen`,
        'Preisentwicklung nach städtischen und ländlichen Regionen': $localize`Preisentwicklung nach städtischen und ländlichen Regionen`,
        'Vergleich zusammengefasster Regionen': $localize`Vergleich zusammengefasster Regionen`,
        'städtische Regionen': $localize`Städtische Regionen`,
        'SR': $localize`SR`,
        'ländliche Regionen': $localize`Ländliche Regionen`,
        'LR': $localize`LR`,
        'Mitte': $localize`Mitte`,
        'Nord': $localize`Nord`,
        'Ost': $localize`Ost`,
        'Süd': $localize`Süd`,
        'West': $localize`West`,
        'Hannover': $localize`Hannover`,
        'Braunschweig': $localize`Braunschweig`,
        'Osnabrück': $localize`Osnabrück`,
        'Lüneburg': $localize`Lüneburg`,
        'Göttingen': $localize`Göttingen`,
        'Aurich': $localize`Aurich`,
        'Wolfsburg': $localize`Wolfsburg`,
        'Oldenburg': $localize`Oldenburg`,
        'Hamburger Umland': $localize`Hamburger Umland`,
        'Küste u. weiteres Umland': $localize`Küste u. weiteres Umland`,
        'Ostfriesische Inseln': $localize`Ostfriesische Inseln`,
        'Westliches Niedersachsen': $localize`Westliches Niedersachsen`,
        'Oldenburg - Münsterland - Osnabrück': $localize`Oldenburg - Münsterland - Osnabrück`,
        'Stadt Oldenburg': $localize`Stadt Oldenburg`,
        'Stadt Osnabrück u. städt. Gemeinden': $localize`Stadt Osnabrück u. städt. Gemeinden`,
        'Bremer Umland': $localize`Bremer Umland`,
        'Mittleres Niedersachsen': $localize`Mittleres Niedersachsen`,
        'Südliches Niedersachsen': $localize`Südliches Niedersachsen`,
        'Stadt Göttingen u. städt. Gemeinden': $localize`Stadt Göttingen u. städt. Gemeinden`,
        'Östliches Niedersachsen': $localize`Östliches Niedersachsen`,
        'Stadt Hannover': $localize`Stadt Hannover`,
        'Stadt Wolfsburg': $localize`Stadt Wolfsburg`,
        'Stadt Braunschweig': $localize`Stadt Braunschweig`,
        'Hannover - Braunschweig - Wolfsburg': $localize`Hannover - Braunschweig - Wolfsburg`
    };

    public constructor(niStatic: ImmobilenNipixStatic.NipixStatic) {
        this.nipixStatic = niStatic;
        this.formatter = new ImmobilienFormatter.ImmobilienFormatter(this.nipixStatic, this);
        this.export = new ImmobilienExport.ImmobilienExport(this.nipixStatic, this);
        this.calculator = new ImmobilienNipixRuntimeCalculator.NipixRuntimeCalculator(this.nipixStatic, this);
    }

    public translate(defaultID: string) {
        if (this.locale && this.locale.hasOwnProperty(defaultID)) {
            return this.locale[defaultID];
        } else {
            // console.log('Missing translation: ' + defaultID);
            return defaultID;
        }
    }

    public translateArray(input, key = 'name') {
        const cpy = JSON.parse(JSON.stringify(input));

        for (let i = 0; i < cpy.length; i++) {
            if (cpy[i][key] !== undefined) {
                cpy[i][key] = this.translate(cpy[i][key]);
            }
        }

        return cpy;
    }

    public resetDrawPresets() {
        this.drawPresets = JSON.parse(JSON.stringify(this.nipixStatic.data.presets));
    }

    public updateAvailableNipixCategories() {
        this.availableNipixCategories = Object.keys(this.nipixStatic.data.nipix);
    }

    public updateAvailableQuartal(lastYear: number, lastPeriod: number) {

        this.availableQuartal = [];

        for (let i = 2000; i < lastYear + 1; i++) {
            for (let q = 1; q < 5; q++) {
                if ((!(i <= 2000 && q === 1)) && (!((i === lastYear) && (q > lastPeriod)))) {
                    this.availableQuartal.push(i + '/' + q);
                }
            }

        }

    }

    /**
     * Toggle the NiPix Category (Eigenheime/Eigentumswohnungen) for a specific draw object.
     *
     * @param drawname Name of the draw object.
     */
    public toggleNipixCategory(drawname: string) {
        for (let i = 0; i < this.drawPresets.length; i++) {
            if (this.drawPresets[i]['name'] === drawname) {
                if (this.drawPresets[i]['nipixCategory'] === 'gebrauchte Eigenheime') {
                    this.drawPresets[i]['nipixCategory'] = 'gebrauchte Eigentumswohnungen';
                } else {
                    this.drawPresets[i]['nipixCategory'] = 'gebrauchte Eigenheime';
                }
                return;
            }
        }
    }

    /**
     * Get draw object for a specific name
     *
     * @param name Name of the draw Object
     * @returns draw Object
     */
    public getDrawPreset(name: string) {
        const result = this.drawPresets.filter(drawitem => drawitem['name'] === name);

        if (result.length === 1) {
            return result[0];
        } else {
            return {};
        }
    }

    /**
     * timeout handler for diable highlight
     */
    public highlightTimeout() {
        this.state.highlightedSeries = '';
        this.updateMapSelect();
    }

    /**
     * Reset the highlighted Map (before) timeout
     */
    public resetHighlight() {
        clearTimeout(this.highlightedTimeout);
        this.state.highlightedSeries = '';
        this.updateMapSelect();
    }

    /**
     * Highlight one Series (while mouse over)
     *
     * @param seriesName name of the series to highlight
     */
    public highlightSeries(seriesName) {
        if (this.state.highlightedSeries !== seriesName) {
            this.state.highlightedSeries = seriesName;

            const rkey = Object.keys(this.nipixStatic.data.regionen);
            let rname = [];

            if (rkey.includes(seriesName)) {
                rname.push(seriesName);
            } else {
                rname = this.getDrawPreset(seriesName)['values'];
            }

            for (let i = 0; i < rkey.length; i++) {
                ImmobilienUtils.dispatchMapSelect(this.map.obj, rkey[i], rname.includes(rkey[i]));
            }

        }
        clearTimeout(this.highlightedTimeout);
        this.highlightedTimeout = setTimeout(this.highlightTimeout.bind(this), 10000);
    }

    /**
     * Generates the drawdata from the given draw array
     */
    public calculateDrawData() {
        this.calculator.calculateDrawData();
    }


    public updateRange(range_start, range_end) {
        if (this.state.rangeStartIndex === 0) {
            this.state.rangeStartIndex =
                Math.round((this.availableQuartal.length - 1) / 100 * range_start);
            this.nipixStatic.referenceDate = this.availableQuartal[this.state.rangeStartIndex].replace('/', '_');
        }

        if (this.state.rangeEndIndex === 0) {
            this.state.rangeEndIndex =
                Math.round((this.availableQuartal.length - 1) / 100 * range_end);
        }
    }

    /**
     * Update the Selectiopn of the Map aware of the activer Draw Item
     * @param id
     */
    public updateMapSelect(id = null) {
        if (this.map.obj === null) {
            return;
        }

        if (this.state.activeSelection !== 99) {
            if (this.nipixStatic.data.selections[this.state.activeSelection]['type'] === 'single') {
                const draw = this.getDrawPreset(
                    this.nipixStatic.data.selections[this.state.activeSelection]['preset'][0]
                );
                const reg = Object.keys(this.nipixStatic.data.regionen);
                for (let s = 0; s < reg.length; s++) {
                    ImmobilienUtils.dispatchMapSelect(this.map.obj, reg[s], draw.values.includes(reg[s]));
                }
            } else { // All other drawing types; unselect
                const reg = Object.keys(this.nipixStatic.data.regionen);
                for (let s = 0; s < reg.length; s++) {
                    ImmobilienUtils.dispatchMapSelect(this.map.obj, reg[s], false);
                }
            }
        } else { // Update MyWoMaReg
            if (id !== null) {
                const reg = Object.keys(this.nipixStatic.data.regionen);
                for (let s = 0; s < reg.length; s++) {
                    ImmobilienUtils.dispatchMapSelect(this.map.obj, reg[s], (reg[s] === id));
                }
            }
        }
    }





}

/* vim: set expandtab ts=4 sw=4 sts=4: */
