import { ImmobilienHelper } from './immobilien.helper';
import * as ImmobilenNipixRuntime from './immobilien.runtime';
import * as ImmobilenNipixStatic from './immobilien.static';
import { ImmobilienUtils } from './immobilien.utils';

export class ImmobilienFormatter {

    private nipixStatic: ImmobilenNipixStatic.NipixStatic;

    private nipixRuntime: ImmobilenNipixRuntime.NipixRuntime;

    private legendposition = new Array<number>();

    public constructor(niStatic: ImmobilenNipixStatic.NipixStatic, niRuntime: ImmobilenNipixRuntime.NipixRuntime) {
        this.nipixStatic = niStatic;
        this.nipixRuntime = niRuntime;
    }

    public mapTooltipFormatter = (params: any): string => {
        if (Object.prototype.hasOwnProperty.call(this.nipixStatic.data.regionen, params.name)) {
            return this.nipixRuntime.translate(this.nipixStatic.data.regionen[params.name]['name']);
        }
        return this.nipixRuntime.translate(params.name);
    };

    public chartTooltipFormatter = (params: any, ticket: any, callback: any): string => {

        let faelle = 0;

        if (Object.prototype.hasOwnProperty.call(this.nipixRuntime.calculated.hiddenData, params.seriesName)) {
            faelle = this.nipixRuntime.calculated.hiddenData?.[params.seriesName][params.dataIndex];
        }

        let printName = params.seriesName;
        if (Object.prototype.hasOwnProperty.call(this.nipixStatic.data.regionen, params.seriesName)) {
            printName = this.nipixStatic.data.regionen[params.seriesName]['name'];
        }

        let entw = (Math.round((params.data - 100) * 10) / 10);
        if (entw > 0) {
            entw = ('+' + entw) as any;
        }

        this.nipixRuntime.highlightSeries(params.seriesName);

        printName = this.nipixRuntime.translate(printName);

        return '<strong>' + (params).marker + printName + '</strong><br>' +
            $localize`Preisentwicklung seit` + ' ' + this.nipixStatic.referenceDate.replace('_', '/')
            + ': ' + entw + '%<br>' +
            $localize`Zugrunde liegende Fälle` + ' (' + params.name + '): ' + faelle;
    };

    /**
     * Format Series Label
     *
     * @param params eCharts Formatter parameter (see echarts api)
     * @returns Formatted String
     */
    public formatLabel = (params: any): string => { // eslint-disable-line complexity
        if (params.dataIndex === this.nipixRuntime.state.rangeEndIndex) {
            if ((this.legendposition.length > params.seriesIndex) ||
                (params.seriesIndex === 0)) {
                this.legendposition = new Array<number>();
            }

            let printlegend = true;
            const pixel = Math.round(this.nipixRuntime.chart.obj.convertToPixel({ 'yAxisIndex': 0 }, params.data));
            const fontSizeInPx =
                ImmobilienHelper.convertRemToPixels(this.nipixStatic.textOptions.fontSizePage);
            const clearance = Math.round((fontSizeInPx + 2) / 2);

            for (let i = 0; i < this.legendposition.length; i++) {
                if ((pixel > this.legendposition[i] - clearance) &&
                    (pixel < this.legendposition[i] + clearance)) {
                    printlegend = false;
                }
            }

            if ((this.nipixRuntime.state.selectedChartLine !== '')
                && (this.nipixRuntime.state.selectedChartLine !== params.seriesName)) {
                printlegend = false;
            }

            if ((this.nipixRuntime.calculated.drawData?.length === 2) &&
                (params.seriesName === '1')) {
                printlegend = false;
            }

            if (printlegend) {
                this.legendposition.push(pixel);
                return this.findName(params.seriesName, false, true);
            }
        }
        return '';
    };

    public findName = (
        name: string,
        legend = false,
        shortregion = false,
        shortname = true
    ): string => {

        let myname = '';

        if (legend && Object.prototype.hasOwnProperty.call(this.nipixRuntime.calculated.legendText, name)) {
            myname = this.nipixRuntime.calculated.legendText[name];
        } else if (shortname && Object.prototype.hasOwnProperty.call(this.nipixStatic.data.shortNames, name)) {
            myname = this.nipixStatic.data.shortNames[name];
        } else if (!shortregion && Object.prototype.hasOwnProperty.call(this.nipixStatic.data.regionen, name)) {
            myname = this.nipixStatic.data.regionen[name]['name'];
        } else if (shortregion && Object.prototype.hasOwnProperty.call(this.nipixStatic.data.regionen, name)) {
            myname = this.nipixStatic.data.regionen[name]['short'];
        } else {
            myname = name;
        }

        return this.nipixRuntime.translate(myname);
    };

    public formatLegend = (name: string): string => this.findName(name, false, true);

    /**
     * Get Label for a specific Series
     *
     * @param series series Id
     * @returns series label (sort)
     */
    public getSeriesLabel(series: string): string {
        if (this.nipixStatic.data.regionen[series] !== undefined) {
            return this.nipixRuntime.translate(this.nipixStatic.data.regionen[series]['name']) +
                ' (' +
                this.nipixRuntime.translate(this.nipixStatic.data.regionen[series]['short']) +
                ')';
        }
        return '';
    }

    /**
     * Gets the color for a specific series
     *
     * @param series series id
     * @returns Series Color
     */
    public getSeriesColor(series: string): string {
        if (this.nipixStatic.data.regionen[series] !== undefined) {
            return ImmobilienHelper.convertColor(this.nipixStatic.data.regionen[series]['color']);
        }
        return '#000000';
    }

    public simpleLegend(): string[] {
        const legend = new Array<string>();
        if (this.nipixRuntime.calculated.drawData) {
            for (let i = 0; i < this.nipixRuntime.calculated.drawData.length; i++) {
                if (this.nipixRuntime.calculated.drawData[i]['data'].length === 0) {
                    legend.push(this.nipixRuntime.calculated.drawData[i]['name'] + ' ' + $localize`(ohne Daten)`);
                } else {
                    legend.push(this.nipixRuntime.calculated.drawData[i]['name']);
                }
            }
        }
        return legend;
    }

    public graphicLegend(): any[] {
        const workdata = {
            'infoLegend': new Array<any>(),
            'infoLegendPosition': 0
        };

        if (this.nipixStatic.data.selections && this.nipixRuntime.state.activeSelection
            && this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection] !== undefined
            && this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection] !== null) {
            if ((this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection]['type'] === 'single')) {
                this.graphicLegendSingle(workdata);
            } else if (
                (this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection]['type'] === 'multi') ||
                (this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection]['type'] === 'multiIndex')
            ) {
                this.graphicLegendMulti(workdata);
            } else if ((this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection]['type'] === 'multiSelect')) {
                this.graphicLegendMultiSelect(workdata);
            }
        }

        return workdata['infoLegend'];
    }

    private graphicLegendSingle(obj: any): void {
        if (!this.nipixRuntime.calculated.drawData) {
            return;
        }
        for (let i = 0; i < this.nipixRuntime.calculated.drawData.length; i++) {
            let addText = '';
            const element = this.nipixStatic.data.regionen[this.nipixRuntime.calculated.drawData[i]['name']];

            if (this.nipixRuntime.calculated.drawData[i]['data'].length === 0) {
                addText = $localize`[ohne Daten]` + ' ';
            }

            if (Object.prototype.hasOwnProperty.call(this.nipixStatic.data.regionen, this.nipixRuntime.calculated.drawData[i]['name'])) {
                obj.infoLegend.push(ImmobilienUtils.generateTextElement(
                    addText + element['name'] + ' (' + element['short'] + ')',
                    '#000',
                    this.nipixStatic.textOptions.fontSizeBase,
                    obj.infoLegendPosition
                ));
                obj.infoLegend.push(ImmobilienUtils.generateDotElement(
                    4,
                    element['color'],
                    this.nipixStatic.textOptions.fontSizeBase,
                    obj.infoLegendPosition
                ));
                obj.infoLegendPosition++;
            }
        }
    }

    private graphicLegendMulti(obj: any): void {
        if (!(this.nipixStatic.data.selections && this.nipixRuntime.state.activeSelection)) {
            return;
        }
        const ccat = this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection]['preset'];
        for (let i = 0; i < ccat.length; i++) {
            obj.infoLegend.push(ImmobilienUtils.generateTextElement(
                ccat[i] + ' (' + this.nipixStatic.data.shortNames[ccat[i]] + ')',
                '#000',
                this.nipixStatic.textOptions.fontSizeBase,
                obj.infoLegendPosition
            ));
            obj.infoLegend.push(ImmobilienUtils.generateDotElement(
                4,
                this.nipixRuntime.getDrawPreset(ccat[i]).colors,
                this.nipixStatic.textOptions.fontSizeBase,
                obj.infoLegendPosition
            ));
            obj.infoLegendPosition++;

        }
    }

    private graphicLegendMultiSelect(obj: any): void {
        if (!(this.nipixStatic.data.selections && this.nipixRuntime.state.activeSelection
            && this.nipixStatic.data.allItems)) {
            return;
        }
        const ccat = this.nipixStatic.data.selections[this.nipixRuntime.state.activeSelection]['preset'];
        for (let i = 0; i < this.nipixStatic.data.allItems.length; i++) {
            for (let d = 0; d < ccat.length; d++) {
                const citem = this.nipixRuntime.getDrawPreset(ccat[d]);
                if (citem['show'] === true) {
                    if (citem['values'].includes(this.nipixStatic.data.allItems[i])) {
                        obj.infoLegend.push(ImmobilienUtils.generateDotElement(
                            4,
                            citem['colors'],
                            this.nipixStatic.textOptions.fontSizeBase,
                            obj.infoLegendPosition,
                            d
                        ));
                    }
                }
            }
            obj.infoLegend.push(ImmobilienUtils.generateTextElement(
                this.getSeriesLabel(this.nipixStatic.data.allItems[i]),
                '#000',
                this.nipixStatic.textOptions.fontSizeBase,
                obj.infoLegendPosition,
                4 * 4 * 4
            ));

            obj.infoLegendPosition++;
        }
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
