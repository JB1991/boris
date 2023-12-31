import * as ImmobilenNipixStatic from './immobilien.static';
import * as ImmobilenNipixRuntime from './immobilien.runtime';
import { ImmobilienUtils } from './immobilien.utils';
import { ImmobilienHelper } from './immobilien.helper';

export class NipixRuntimeCalculator {

    private nipixStatic: ImmobilenNipixStatic.NipixStatic;

    private nipixRuntime: ImmobilenNipixRuntime.NipixRuntime;

    constructor(niStatic: ImmobilenNipixStatic.NipixStatic, niRuntime: ImmobilenNipixRuntime.NipixRuntime) {
        this.nipixStatic = niStatic;
        this.nipixRuntime = niRuntime;
    }

    /**
     * Generates the drawdata from the given draw array
     */
    public calculateDrawData(): void {

        // Empty result
        this.nipixRuntime.calculated.drawData = [];

        // Iterate over all draw items
        for (let d = 0; d < this.nipixRuntime.drawPresets.length; d++) {
            const drawitem = this.nipixRuntime.drawPresets[d];

            // Type Single: display all values as an individual series
            if (drawitem['type'] === 'single') {
                this.calculateDrawDataSingle(drawitem);

                // Type Aggr: display all values as an aggregated series
            } else if (drawitem['type'] === 'aggr') {
                this.calculateDrawDataAggr(drawitem);
            }

        }

        // Filter empty Data
        this.filterNaN();

        // Fill Empty
        this.fillEmpty();
    }

    private calculateDrawDataSingleOnRef(drawitem: any, value: any, nipix: any): void {
        // Calc reference value on referenceDate
        let reference = 100;
        if (Object.prototype.hasOwnProperty.call(this.nipixStatic.data.nipix[drawitem.nipixCategory][value],
            this.nipixStatic.referenceDate)) {
            reference = ImmobilienHelper.parseStringAsFloat(
                this.nipixStatic.data.nipix[drawitem.nipixCategory][value][this.nipixStatic.referenceDate]['index']
            );
        }

        // Add Series
        this.nipixRuntime.calculated.drawData?.push(
            ImmobilienUtils.generateSeries(
                value,
                ImmobilienUtils.generateDrawSeriesData(
                    this.nipixStatic.data.nipix[drawitem.nipixCategory][value],
                    this.nipixRuntime.availableQuartal, 'index', reference
                ),
                this.nipixStatic.data.regionen[value]['color'],
                this.nipixRuntime.formatter.formatLabel,
                this.nipixRuntime.state.selectedChartLine
            )
        );
        if (this.nipixRuntime.calculated.hiddenData) {
            this.nipixRuntime.calculated.hiddenData[value] = ImmobilienUtils.generateDrawSeriesData(
                this.nipixStatic.data.nipix[drawitem.nipixCategory][value],
                this.nipixRuntime.availableQuartal,
                'faelle'
            );
        }
    }

    private calculateDrawDataSinglePush(drawitem: any, value: any, nipix: any): void {
        if (this.nipixStatic.data.regionen[value] !== undefined) {
            this.nipixRuntime.calculated.drawData?.push(
                ImmobilienUtils.generateSeries(
                    value,
                    [],
                    this.nipixStatic.data.regionen[value]['color'],
                    this.nipixRuntime.formatter.formatLabel,
                    this.nipixRuntime.state.selectedChartLine
                )
            );
        }
    }

    private calculateDrawDataSingle(drawitem: any): void {
        if (!this.nipixStatic.data.allItems) {
            return;
        }

        // Iterate over all Regions
        // let reg = Object.keys(this.nipixStatic.data.regionen);
        for (let i = 0; i < this.nipixStatic.data.allItems.length; i++) {

            const value = this.nipixStatic.data.allItems[i]; // drawitem["values"][i];
            const nipix = this.nipixStatic.data.nipix[drawitem.nipixCategory];

            // Region included, drawitem show and data available
            if (
                drawitem['values'].includes(value) &&
                (Object.prototype.hasOwnProperty.call(this.nipixStatic.data.nipix, drawitem.nipixCategory)) &&
                (Object.prototype.hasOwnProperty.call(this.nipixStatic.data.nipix[drawitem.nipixCategory], value)) &&
                (drawitem['show'] === true) &&
                (Object.getOwnPropertyNames(
                    this.nipixStatic.data.nipix[drawitem.nipixCategory][value]).length > 0)
            ) {
                this.calculateDrawDataSingleOnRef(drawitem, value, nipix);
            } else if (
                drawitem['values'].includes(value) &&
                (drawitem['show'] === true)
            ) {
                this.calculateDrawDataSinglePush(drawitem, value, nipix);
            }

        }
    }

    private calculateDrawDataAggrIterate(drawitem: any, workdata: any, aggr: any, d: number): void {
        for (let i = 0; i < drawitem['values'].length; i++) {
            const value = drawitem['values'][i];
            const data = this.nipixStatic.data.nipix[drawitem.nipixCategory][value];

            if (data !== undefined) { // Data available?
                workdata['reference'] = 100;
                if (Object.prototype.hasOwnProperty.call(data, this.nipixStatic.referenceDate)) {
                    workdata['reference'] = ImmobilienHelper.parseStringAsFloat(
                        data[this.nipixStatic.referenceDate].index
                    );
                }

                if (Object.prototype.hasOwnProperty.call(data, this.nipixRuntime.availableQuartal[d].replace('/', '_'))) {
                    let val = ImmobilienHelper.parseStringAsFloat(
                        data[this.nipixRuntime.availableQuartal[d].replace('/', '_')].index
                    );
                    const fal = ImmobilienHelper.parseStringAsFloat(
                        data[this.nipixRuntime.availableQuartal[d].replace('/', '_')].faelle
                    );

                    val += (100 - workdata['reference']);

                    if (!isNaN(val)) {
                        aggr['val'] += val * fal;
                        aggr['faelle'] += fal;
                    }
                }
            }
        }
    }

    private calculateDrawDataAggrDate(drawitem: any, workdata: any): void {
        for (let d = 0; d < this.nipixRuntime.availableQuartal.length; d++) {

            const aggr = {
                'val': 0,
                'faelle': 0
            };

            this.calculateDrawDataAggrIterate(drawitem, workdata, aggr, d);

            const pval = parseFloat((aggr['val'] / aggr['faelle']).toFixed(2));

            workdata['a_val'].push(pval);
            workdata['a_faelle'].push(aggr['faelle']);

            if (this.nipixRuntime.availableQuartal[d].replace('/', '_') === this.nipixStatic.referenceDate) {
                workdata['reference'] = pval;
            }
        }
    }

    private calculateDrawDataAggr(drawitem: any): void {
        const workdata = {
            'a_val': [],
            'a_faelle': [],
            'reference': 100
        };

        if ((drawitem['show'] === true) && (drawitem['values'].length > 0)) {

            this.calculateDrawDataAggrDate(drawitem, workdata);
            this.nipixRuntime.calculated.drawData?.push( // Add Series to Output
                ImmobilienUtils.generateSeries(
                    drawitem['name'],
                    ImmobilienUtils.generateDrawSeriesData(
                        workdata['a_val'],
                        this.nipixRuntime.availableQuartal,
                        null,
                        100
                    ),
                    drawitem['colors'],
                    this.nipixRuntime.formatter.formatLabel,
                    this.nipixRuntime.state.selectedChartLine
                )
            );

            if (this.nipixRuntime.calculated.hiddenData) {
                this.nipixRuntime.calculated.hiddenData[drawitem['name']] =
                    ImmobilienUtils.generateDrawSeriesData(workdata['a_faelle'], this.nipixRuntime.availableQuartal);
            }

        }
    }

    /**
     * Find DrawSeries with no Data (NaN) and change it to undefined
     */
    private filterNaN(): void {

        if (this.nipixRuntime.calculated.drawData === undefined) {
            return;
        }

        for (let i = 0; i < this.nipixRuntime.calculated.drawData.length; i++) {

            const itm = this.nipixRuntime.calculated.drawData[i];

            if ((itm === undefined) || (itm.data === undefined)) {
                return;
            }

            for (let o = 0; o < itm.data.length; o++) {
                if (isNaN(itm.data[o])) {
                    itm.data[o] = undefined;
                }
            }

        }
    }

    /**
     * Fill empty DrawSeries
     */
    private fillEmpty(): void {

        if (this.nipixRuntime.calculated.drawData === undefined) {
            return;
        }

        for (let i = 0; i < this.nipixRuntime.calculated.drawData.length; i++) {

            const itm = this.nipixRuntime.calculated.drawData[i];

            if ((itm === undefined) || (itm.data === undefined)) {
                return;
            }

            if (itm.data.length === 0) {
                for (let o = 0; o < this.nipixRuntime.availableQuartal.length; o++) {
                    itm.data.push(undefined);
                }
            }

        }

    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
