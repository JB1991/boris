import * as ImmobilenHelper from './immobilien.helper';
import * as ImmobilenNipixRuntime from './immobilien.runtime';
import * as ImmobilenNipixStatic from './immobilien.static';

export class ImmobilienFormatter {

    private nipixStatic: ImmobilenNipixStatic.NipixStatic;
    private nipixRuntime: ImmobilenNipixRuntime.NipixRuntime;

    private legendposition = [];

    public constructor(niStatic: ImmobilenNipixStatic.NipixStatic, niRuntime: ImmobilenNipixRuntime.NipixRuntime) {
        this.nipixStatic = niStatic;
        this.nipixRuntime = niRuntime;
    }

    public mapTooltipFormatter = (params) => {
        if (this.nipixStatic.data.regionen.hasOwnProperty(params.name)) {
            return this.nipixStatic.data.regionen[params.name]['name'];
        } else {
            return params.name;
        }
    }

    public chartTooltipFormatter = (params, ticket, callback) => {

        let faelle = 0;

        if (this.nipixRuntime.calculated.hiddenData.hasOwnProperty(params.seriesName)) {
            faelle = this.nipixRuntime.calculated.hiddenData[params.seriesName][params.dataIndex];
        }

        let printName = params.seriesName;
        if (this.nipixStatic.data.regionen.hasOwnProperty(params.seriesName)) {
            printName = this.nipixStatic.data.regionen[params.seriesName]['name'];
        }

        let entw = (Math.round((params.data - 100) * 10) / 10);
        if (entw > 0) {
            entw = <any>('+' + entw);
        }

        this.nipixRuntime.highlightSeries(params.seriesName);

        return '<b>' + (<any>params).marker + printName + '</b><br>' +
            'Preisentwicklung seit ' + this.nipixStatic.referenceDate.replace('_', '/') + ': ' + entw + '%<br>' +
            'Zugrunde liegende Fälle (' + params.name + '): ' + faelle;
    }

    /**
     * Format Series Label
     *
     * @param params eCharts Formatter parameter (see echarts api)
     *
     * @return Formatted String
     */
    public formatLabel = (params) => {
        if (params.dataIndex === this.nipixRuntime.state.rangeEndIndex) {
            if (this.legendposition.length >= params.seriesIndex) {
                this.legendposition = [];
            }

            let printlegend = true;
            const pixel = Math.round(this.nipixRuntime.chart.obj.convertToPixel({'yAxisIndex': 0}, params.data));
            const clearance = Math.round(
                ( ImmobilenHelper.convertRemToPixels( this.nipixStatic.textOptions.fontSizePage ) - 2 )
                / 2 );

            for (let i = 0; i < this.legendposition.length; i++) {
                if ((pixel > this.legendposition[i] - clearance) && (pixel < this.legendposition[i] + clearance)) {
                    printlegend = false;
                }
            }

            if ((this.nipixRuntime.state.selectedChartLine !== '')
                && (this.nipixRuntime.state.selectedChartLine !== name)) {
                printlegend = false;
            }

            if (printlegend) {
                this.legendposition.push(pixel);
                return this.findName(params.seriesName, false, true);
            }
        }
        return '';
    }

    private findName = (name: string, legend = false, shortregion = false): string => {
        if (legend && this.nipixRuntime.calculated.legendText.hasOwnProperty(name)) {
            return this.nipixRuntime.calculated.legendText[name];
        } else if (this.nipixStatic.data.shortNames.hasOwnProperty(name)) {
            return this.nipixStatic.data.shortNames[name];
        } else if (!shortregion && this.nipixStatic.data.regionen.hasOwnProperty(name)) {
            return this.nipixStatic.data.regionen[name]['name'];
        } else if (shortregion && this.nipixStatic.data.regionen.hasOwnProperty(name)) {
            return this.nipixStatic.data.regionen[name]['short'];
        } else {
            return name;
        }
    }

    public formatLegend = (name: string) => {
        return this.findName(name, true);
    }

}

/* vim: set expandtab ts=4 sw=4 sts=4: */
