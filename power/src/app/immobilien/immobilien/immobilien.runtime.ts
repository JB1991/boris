import * as echarts from 'echarts';
import * as ImmobilenNipixStatic from './immobilien.static';
import * as ImmobilienNipixRuntimeCalculator from './immobilien.runtime-calculator';
import * as ImmobilienFormatter from './immobilien.formatter';
import * as ImmobilienExport from './immobilien.export';
import * as ImmobilienUtils from './immobilien.utils';
import * as ImmobilienHelper from './immobilien.helper';

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
}

interface NipixRuntimeCalculated {
    mapRegionen?: any;
    drawData?: any;
    hiddenData?: any;
    chartTitle?: string;
    legendText?: any;
}

export class NipixRuntime {

    private nipixStatic: ImmobilenNipixStatic.NipixStatic;

    private highlightedTimeout = setTimeout(this.highlightTimeout.bind(this), 10000);

    public formatter: ImmobilienFormatter.ImmobilienFormatter;
    public export: ImmobilienExport.ImmobilienExport;
    private calculator: ImmobilienNipixRuntimeCalculator.NipixRuntimeCalculator;

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
        'selectedMyRegion': ''
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


    public constructor(niStatic: ImmobilenNipixStatic.NipixStatic) {
        this.nipixStatic = niStatic;
        this.formatter = new ImmobilienFormatter.ImmobilienFormatter(this.nipixStatic, this);
        this.export = new ImmobilienExport.ImmobilienExport(this.nipixStatic, this);
        this.calculator = new ImmobilienNipixRuntimeCalculator.NipixRuntimeCalculator(this.nipixStatic, this);
    }

    public logStatic() {
        console.log('logStatic', this.nipixStatic);
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
     *
     * @return draw Object
     */
    public getDrawPreset(name: string) {
        const result = this.drawPresets.filter(drawitem => drawitem['name'] === name);

        if (result.length === 1) {
            return result[0];
        } else {
            return null;
        }
    }

    /**
     * timeout handler for diable highlight
     */
    private highlightTimeout() {
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
