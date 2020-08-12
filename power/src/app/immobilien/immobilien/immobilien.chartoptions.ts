import * as echarts from 'echarts';
import * as ImmobilenHelper from './immobilien.helper';
import * as MO from './immobilien.chartoptions-mapoptions';
import * as CO from './immobilien.chartoptions-chartoptions';
import * as PO from './immobilien.chartoptions-printoptions';

export function chartRange() {
    return JSON.parse(JSON.stringify(CO.chartRange));
}

/**
 * Configuration Option for the Map
 */
export function getMapOptions(opt: any = {'text': {}}, selectType: any = 'multiple'): echarts.EChartOption {
    const ret = JSON.parse(JSON.stringify(MO.mapOptions));
    ret.title.textStyle.fontSize = ImmobilenHelper.convertRemToPixels(opt.text.fontSizePage);
    ret.graphic[0].bottom = ImmobilenHelper.convertRemToPixels( opt.text.fontSizeCopy ) * 2.5;
    ret.graphic[0].style.fontSize = ImmobilenHelper.convertRemToPixels(opt.text.fontSizeCopy);
    ret.graphic[0].style.text = '© Oberer Gutachterausschusses für\nGrundstückswerte in Niedersachsen, '
                    + ImmobilenHelper.getDate();
    ret.tooltip.formatter = opt.tooltipFormatter;
    ret.tooltip.textStyle.fontSize = ImmobilenHelper.convertRemToPixels(opt.text.fontSizeMap);
    ret.toolbox.feature.mySaveAsGeoJSON.onclick = opt.exportGeoJSON;
    ret.series[0].selectedMode = selectType;
    ret.series[0].data = opt.mapRegionen;
    ret.series[1].label.fontSize = ImmobilenHelper.convertRemToPixels(this.fontSizeMap);
    ret.series[1].data = opt.geoCoordMap;

    return ret;
}

/**
 * Configuration Option for the Chart
 */
export function getChartOptions(opt: any = {'text': {}}): echarts.EChartOption {
    const ret = JSON.parse(JSON.stringify(CO.chartOptions));
    ret.textStyle.fontSize = ImmobilenHelper.convertRemToPixels(opt.text.fontSizeBase);
    ret.title.textStyle.fontSize = ImmobilenHelper.convertRemToPixels(opt.text.fontSizePage);
    ret.grid[0].top = 56 + ImmobilenHelper.convertRemToPixels(opt.text.fontSizePage) * 1.5;
    ret.graphic[0].style.fontSize =  ImmobilenHelper.convertRemToPixels(opt.text.fontSizeCopy);
    ret.graphic[0].style.text = '© Oberer Gutachterausschusses für Grundstückswerte in Niedersachsen, '
                    + ImmobilenHelper.getDate();
    ret.xAxis[0].data = opt.date;
    ret.xAxis[0].axisLabel.fontSize = ImmobilenHelper.convertRemToPixels(opt.text.fontSizeAxisLabel);
    ret.yAxis[0].axisLabel.fontSize = ImmobilenHelper.convertRemToPixels(opt.text.fontSizeAxisLabel);
    ret.tooltip.formatter = opt.tooltipFormatter;
    ret.toolbox.feature.mySaveAsImage.onclick = opt.exportAsImage;
    ret.toolbox.feature.mySaveAsCSV.onclick = opt.exportCSV;
    ret.toolbox.feature.mySaveAsGeoJSON.onclick = opt.exportNiPixGeoJson;
    ret.series[0] = chartRange();

    return ret;
}


/**
 * Chart Options (Merge) for hideing view components and show print components
 */
export const mergeHide = JSON.parse(JSON.stringify(PO.mergeHide));

/**
 * Chart Options (Merge) for show view components and hide print components
 */
export const mergeShow = JSON.parse(JSON.stringify(PO.mergeShow));

/* vim: set expandtab ts=4 sw=4 sts=4: */
