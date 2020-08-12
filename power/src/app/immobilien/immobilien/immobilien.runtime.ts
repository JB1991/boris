import * as echarts from 'echarts';
import * as ImmobilenNipixStatic from './immobilien.static';
import * as ImmobilienFormatter from './immobilien.formatter';
import * as ImmobilienExport from './immobilien.export';
import * as ImmobilenUtils from './immobilien.utils';

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
                ImmobilenUtils.dispatchMapSelect(this.map.obj, rkey[i], rname.includes(rkey[i]));
            }

        }
        clearTimeout(this.highlightedTimeout);
        this.highlightedTimeout = setTimeout(this.highlightTimeout.bind(this), 10000);
    }

    private calculateDrawDataSingle(drawitem: any) {

        // Iterate over all Regions
        // let reg = Object.keys(this.nipixStatic.data.regionen);
        for (let i = 0; i < this.nipixStatic.data.allItems.length; i++) {

            const value = this.nipixStatic.data.allItems[i]; // drawitem["values"][i];
            const nipix = this.nipixStatic.data.nipix[drawitem.nipixCategory];

            // Region included, drawitem show and data available
            if (
                drawitem['values'].includes(value) &&
                (this.nipixStatic.data.nipix.hasOwnProperty(drawitem.nipixCategory)) &&
                (this.nipixStatic.data.nipix[drawitem.nipixCategory].hasOwnProperty(value)) &&
                (drawitem['show'] === true) &&
                (Object.getOwnPropertyNames(
                    this.nipixStatic.data.nipix[drawitem.nipixCategory][value]).length > 0)
            ) {

                // Calc reference value on referenceDate
                let reference = 100;
                if (this.nipixStatic.data.nipix[drawitem.nipixCategory][value].hasOwnProperty(
                    this.nipixStatic.referenceDate)) {
                    reference = parseFloat(
                        this.nipixStatic.data.nipix[drawitem.nipixCategory][value][this.nipixStatic.referenceDate]
                        .index.replace(',', '.')
                    );
                }

                // Add Series
                this.calculated.drawData.push(
                    ImmobilenUtils.generateSeries(
                        value,
                        ImmobilenUtils.generateDrawSeriesData(
                            this.nipixStatic.data.nipix[drawitem.nipixCategory][value],
                            this.availableQuartal, 'index', reference
                        ),
                        this.nipixStatic.data.regionen[value]['color'],
                        this.formatter.formatLabel,
                        this.state.selectedChartLine
                    )
                );
                this.calculated.hiddenData[value] = ImmobilenUtils.generateDrawSeriesData(
                    this.nipixStatic.data.nipix[drawitem.nipixCategory][value],
                    this.availableQuartal,
                    'faelle'
                );
            } else if (
                drawitem['values'].includes(value) &&
                (drawitem['show'] === true)
            ) {
                this.calculated.drawData.push(
                    ImmobilenUtils.generateSeries(
                        value,
                        [],
                        this.nipixStatic.data.regionen[value]['color'],
                        this.formatter.formatLabel,
                        this.state.selectedChartLine
                    )
                );

            }

        }
    }

    private parseStringAsFloat(value: any) {
        if (typeof value === 'string') {
            return parseFloat(value.replace(',', '.'));
        } else {
            return value;
        }
    }

    private calculateDrawDataAggr(drawitem: any) {

        const a_val = [];
        const a_faelle = [];

        let reference = 100;

        // Display?
        if ((drawitem['show'] === true) && (drawitem['values'].length > 0)) {
            for (let d = 0; d < this.availableQuartal.length; d++) {

                let aggr_val = 0;
                let aggr_faelle = 0;

                // Iterate over all values for this aggregation
                for (let i = 0; i < drawitem['values'].length; i++) {

                    const value = drawitem['values'][i];
                    const data = this.nipixStatic.data.nipix[drawitem.nipixCategory][value];

                    // Data available?
                    if (data !== undefined) {

                        // Calculate reference for referenceDate
                        reference = 100;
                        if (data.hasOwnProperty(this.nipixStatic.referenceDate)) {
                            reference = parseFloat(data[this.nipixStatic.referenceDate].index.replace(',', '.'));
                        }

                        // Add Value to aggregation Var
                        if (data.hasOwnProperty(this.availableQuartal[d].replace('/', '_'))) {
                            let val = this.parseStringAsFloat(
                                data[this.availableQuartal[d].replace('/', '_')].index
                            );
                            const fal = this.parseStringAsFloat(
                                data[this.availableQuartal[d].replace('/', '_')].faelle
                            );

                            val += (100 - reference);

                            if (!isNaN(val)) {
                                aggr_val += val * fal;
                                aggr_faelle += fal;
                            }
                        }
                    }
                }


                // Calc aggregated Value for a specific date
                const pval = parseFloat((aggr_val / aggr_faelle).toFixed(2));

                a_val.push(pval);
                a_faelle.push(aggr_faelle);

                if (this.availableQuartal[d].replace('/', '_') === this.nipixStatic.referenceDate) {
                    reference = pval;
                }
            }

            // Add Series to Output
            this.calculated.drawData.push(
                ImmobilenUtils.generateSeries(
                    drawitem['name'],
                    ImmobilenUtils.generateDrawSeriesData(a_val, this.availableQuartal, null, 100), // reference),
                    drawitem['colors'],
                    this.formatter.formatLabel,
                    this.state.selectedChartLine
                )
            );
            this.calculated.hiddenData[drawitem['name']] =
                ImmobilenUtils.generateDrawSeriesData(a_faelle, this.availableQuartal);
        }
    }

    /**
     * Generates the drawdata from the given draw array
     */
    public calculateDrawData() {

        // Empty result
        this.calculated.drawData = [];

        // Iterate over all draw items
        for (let d = 0; d < this.drawPresets.length; d++) {
            const drawitem = this.drawPresets[d];

            // Type Single: display all values as an individual series
            if (drawitem['type'] === 'single') {
                this.calculateDrawDataSingle(drawitem);

                // Type Aggr: display all values as an aggregated series
            } else if (drawitem['type'] === 'aggr') {
                this.calculateDrawDataAggr(drawitem);
            }

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
                    ImmobilenUtils.dispatchMapSelect(this.map.obj, reg[s], draw.values.includes(reg[s]));
                }
            } else { // All other drawing types; unselect
                const reg = Object.keys(this.nipixStatic.data.regionen);
                for (let s = 0; s < reg.length; s++) {
                    ImmobilenUtils.dispatchMapSelect(this.map.obj, reg[s], false);
                }
            }
        } else { // Update MyWoMaReg
            if (id !== null) {
                const reg = Object.keys(this.nipixStatic.data.regionen);
                for (let s = 0; s < reg.length; s++) {
                    ImmobilenUtils.dispatchMapSelect(this.map.obj, reg[s], (reg[s] === id));
                }
            }
        }
    }





}

/* vim: set expandtab ts=4 sw=4 sts=4: */
