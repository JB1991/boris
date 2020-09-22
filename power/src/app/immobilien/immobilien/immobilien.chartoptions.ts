import * as echarts from 'echarts';
import { ImmobilienHelper } from './immobilien.helper';
import * as MO from './immobilien.chartoptions-mapoptions';
import * as CO from './immobilien.chartoptions-chartoptions';
import * as PO from './immobilien.chartoptions-printoptions';

export class ImmobilienChartOptions {

    static chartRange() {
        return JSON.parse(JSON.stringify(CO.chartRange));
    }

    /**
     * Configuration Option for the Map
     */
    static getMapOptions(opt: any = {'text': {}}, selectType: any = 'multiple'): echarts.EChartOption {
        const ret = JSON.parse(JSON.stringify(MO.mapOptions));
        ret.title.textStyle.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizePage);
        ret.graphic[0].bottom = ImmobilienHelper.convertRemToPixels( opt.text.fontSizeCopy ) * 2.5;
        ret.graphic[0].style.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeCopy);
        ret.graphic[0].style.text = 'Quelle: Oberer Gutachterausschuss für\nGrundstückswerte in Niedersachsen, '
            + ImmobilienHelper.getDate();
        ret.tooltip.formatter = opt.tooltipFormatter;
        ret.tooltip.textStyle.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeMap);
        ret.toolbox.feature.mySaveAsGeoJSON.onclick = opt.exportGeoJSON;
        ret.series[0].selectedMode = selectType;
        ret.series[0].data = opt.mapRegionen;

        ret.series[1].label.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeMap);
        ret.series[1].data = opt.geoCoordMap['right'];

        ret.series[2].label.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeMap);
        ret.series[2].data = opt.geoCoordMap['bottom'];

        ret.series[3].label.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeMap);
        ret.series[3].data = opt.geoCoordMap['left'];

        ret.series[4].label.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeMap);
        ret.series[4].data = opt.geoCoordMap['top'];

        return ret;
    }

    /**
     * Configuration Option for the Chart
     */
    static getChartOptions(opt: any = {'text': {}}): echarts.EChartOption {
        const ret = JSON.parse(JSON.stringify(CO.chartOptions));
        ret.textStyle.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeBase);
        ret.title.textStyle.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizePage);
        ret.grid[0].top = 56 + ImmobilienHelper.convertRemToPixels(opt.text.fontSizePage) * (1.5 + 1);
        ret.graphic[0].style.fontSize =  ImmobilienHelper.convertRemToPixels(opt.text.fontSizeCopy);
        ret.graphic[0].style.text = 'Quelle: Oberer Gutachterausschuss für Grundstückswerte in Niedersachsen, '
            + ImmobilienHelper.getDate();
        ret.xAxis[0].data = opt.date;
        ret.xAxis[0].axisLabel.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeAxisLabel);
        ret.yAxis[0].axisLabel.fontSize = ImmobilienHelper.convertRemToPixels(opt.text.fontSizeAxisLabel);
        ret.tooltip.formatter = opt.tooltipFormatter;
        ret.toolbox.feature.mySaveAsImage.onclick = opt.exportAsImage;
        ret.toolbox.feature.mySaveAsCSV.onclick = opt.exportCSV;
        ret.toolbox.feature.mySaveAsGeoJSON.onclick = opt.exportNiPixGeoJson;
        ret.series[0] = ImmobilienChartOptions.chartRange();

        return ret;
    }

    /**
     * Configuration Option for the Chart
     */
    static getChartOptionsMerge(opt: any = {'text': {}}): echarts.EChartOption {
        const ret = JSON.parse(JSON.stringify(CO.chartOptionsMerge));
        ret.graphic[0] = opt.graphic0;
        ret.graphic[1].left = opt.graphic1left;
        ret.graphic[1].children = opt.graphic1children;
        ret.graphic[2].style.fontSize = opt.graphic2fontsize;
        ret.graphic[2].style.text = opt.graphic2text;
        ret.legend.data = opt.legenddata;
        ret.legend.formatter =  opt.legendformatter;
        ret.title.subtext = opt.subtitle;
        ret.series = opt.series;
        ret.dataZoom[0].start = opt.datastart;
        ret.dataZoom[0].end = opt.dataend;

        return ret;
    }

    /**
     * Chart Options (Merge) for hideing view components and show print components
     */
    static mergeHide = JSON.parse(JSON.stringify(PO.mergeHide));

    /**
     * Chart Options (Merge) for show view components and hide print components
     */
    static mergeShow = JSON.parse(JSON.stringify(PO.mergeShow));

}
/* vim: set expandtab ts=4 sw=4 sts=4: */
