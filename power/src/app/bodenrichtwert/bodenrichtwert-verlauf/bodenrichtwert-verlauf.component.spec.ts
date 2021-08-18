import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BodenrichtwertVerlaufComponent } from './bodenrichtwert-verlauf.component';
import { SimpleChanges } from '@angular/core';
import * as echarts from 'echarts';
import { LOCALE_ID } from '@angular/core';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

describe('Bodenrichtwert.BodenrichtwertVerlauf.BodenrichtwertVerlaufComponent', () => {
    const changes: SimpleChanges = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-changes.json');
    const features = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-features.json');
    const featureCollection = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-featurecollection.json');
    const series = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-series.json');
    const deleteSeries = require('../../../testdata/bodenrichtwert/bodenrichtwert-verlauf-deleteSeries.json');

    let component: BodenrichtwertVerlaufComponent;
    let fixture: ComponentFixture<BodenrichtwertVerlaufComponent>;

    registerLocaleData(localeDe);

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertVerlaufComponent],
            providers: [
                { provide: LOCALE_ID, useValue: 'de' },
                DecimalPipe],
            imports: [
                HttpClientTestingModule,
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertVerlaufComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnChanges should work', () => {
        component.features = JSON.parse(JSON.stringify(featureCollection));
        spyOn(component, 'clearChart');
        spyOn(component, 'filterByStichtag');
        spyOn(component, 'generateChart');
        component.ngOnChanges(changes);
        expect(component.clearChart).toHaveBeenCalledTimes(1);
        expect(component.filterByStichtag).toHaveBeenCalledTimes(1);
        expect(component.generateChart).toHaveBeenCalledTimes(1);
    });

    it('clearChart should delete the chart data', () => {
        (component.chartOption.series as Array<string>) = ['bar'];
        component.chartOption.legend['data'] = ['foo'];
        component.chartOption.legend['formatter'] = ['pluto'];
        component.chartOption.legend['textStyle'].rich = 'toto';
        component.srTableData = ['tata'];
        component.srTableHeader = ['paperino'];
        component.clearChart();
        expect(component.chartOption.legend['data'].length).toBe(0);
        expect(component.chartOption.series['length']).toBe(0);
        expect(component.srTableHeader.length).toBe(0);
        expect(component.srTableData.length).toBe(0);
        expect(component.chartOption.legend['formatter']).toBe('');
        expect(component.chartOption.legend['textStyle'].rich).toBe('');
    });

    it('filterByStichtag should filter the features by Stichtag', () => {
        const result = component.filterByStichtag(features);
        expect(result.length).toBe(8);
    });

    it('tooltipFormatter should format the tooltip text', () => {
        component.STICHTAGE = ['2020-12-31', '2019-12-31', '2018-12-31', '2017-12-31'];
        component.teilmarkt = { text: 'Bauland', value: ['B'], hexColor: '#c4153a' };

        const params = [{
            seriesName: 'Wohngebiet Stadtumbau',
            marker: 'marker',
            axisValue: 2018,
            value: 200
        }];
        spyOn(component, 'removeTextInTooltip').and.callThrough();
        let result = component.tooltipFormatter(params);
        expect(component.removeTextInTooltip).toHaveBeenCalledTimes(1);
        expect(result).toEqual('31.12.2017' + '<br />' + 'marker' + ' Wohngebiet' +
            '  : ' + 200 + ' € ' + '<br />');

        component.teilmarkt = { text: 'LF', value: ['B'], hexColor: '#c4153a' };
        result = component.tooltipFormatter(params);
        expect(result).toEqual('31.12.2017' + '<br />' + 'marker' + ' Wohngebiet' +
            '  : ' + '200,00' + ' € ' + '<br />');
    });

    it('removeTextInTooltip should remove some strings in the tooltip text', () => {
        let tooltipText = 'SanierungsgebietEntwicklungsbereichSoziale StadtStadtumbau' +
            'sanierungsunbeeinflusster Wertsanierungsbeeinflusster Wert';
        tooltipText = component.removeTextInTooltip(tooltipText);
        expect(tooltipText).toEqual('');
    });

    it('formatTooltipforSmallViews should break the tooltip text', () => {
        let tooltipText = 'Mischgebiet';
        tooltipText = component.formatTooltipforSmallViews(tooltipText);
        expect(tooltipText).toEqual('Mischgebiet ');

        tooltipText = 'Mischgebiet sanierungsunbeeinflusster Wert';
        tooltipText = component.formatTooltipforSmallViews(tooltipText);
        expect(tooltipText).toEqual('Mischgebiet sanierungsunbeeinflusster <br />Wert ');
    });

    it('generateChart should insert data into chart options', () => {
        component.echartsInstance = echarts.init(document.createElement('div'));
        component.echartsInstance.setOption(component.chartOption);
        expect(component.chartOption.legend['data'].length).toBe(0);
        expect(component.chartOption.series['length']).toBe(0);
        spyOn(component, 'getKeyValuePairs').and.callThrough();
        spyOn(component, 'getSeriesData').and.callThrough();
        spyOn(component, 'getVergOfSeries').and.callThrough();
        spyOn(component, 'deleteSeriesVergItems').and.callThrough();
        spyOn(component, 'createLegendLabel').and.callThrough();
        spyOn(component, 'setChartOptionsSeries').and.callThrough();
        spyOn(component, 'generateSrTable').and.callThrough();
        spyOn(component, 'setLegendFormat').and.callThrough();
        spyOn(component, 'setTextStyleOfLegend').and.callThrough();
        component.generateChart(features);
        expect(component.chartOption.legend['data'].length).toBe(1);
        expect(component.chartOption.series['length']).toBe(1);
        expect(typeof 'component.chartOption.serie[8].brw').toBe('string');
        expect(typeof 'component.chartOption.serie[3].brw').toBe('string');
        expect(typeof 'component.chartOption.serie[6].brw').toBe('string');
        expect(component.setChartOptionsSeries).toHaveBeenCalledTimes(1);
        expect(component.getKeyValuePairs).toHaveBeenCalledTimes(1);
        expect(component.getSeriesData).toHaveBeenCalledTimes(1);
        expect(component.getVergOfSeries).toHaveBeenCalledTimes(1);
        expect(component.deleteSeriesVergItems).toHaveBeenCalledTimes(1);
        expect(component.createLegendLabel).toHaveBeenCalledTimes(1);
        expect(component.generateSrTable).toHaveBeenCalledTimes(1);
        expect(component.setLegendFormat).toHaveBeenCalledTimes(1);
    });

    it('getKeyValuePairs should group the feature by Nutzungsart bzw. BRW-Nummer', () => {
        spyOn(component, 'groupBy').and.callThrough();
        component.getKeyValuePairs(features);
        expect(component.groupBy).toHaveBeenCalledTimes(1);
    });

    /* it('onChartInit should set the echartsInstance', () => {
        const echartsInstance = echarts.init(document.getElementById('eChartInstance'));
        component.onChartInit(echartsInstance);
        expect(component.echartsInstance).toEqual(echartsInstance);

    }); */

    it('getSeriesData should transform and filter features into series-array', () => {
        spyOn(component, 'deepCopy').and.callThrough();
        const result = component.getSeriesData(features);
        expect(component.deepCopy).toHaveBeenCalledTimes(1);
        expect(result.length).toBeGreaterThan(8);
    });

    it('getVergOfSeries should filter brws which inculdes a Verfahrensgrund', () => {
        spyOn(component, 'deepCopy').and.callThrough();
        const result = component.getVergOfSeries(series);
        expect(component.deepCopy).toHaveBeenCalledTimes(16);
        expect(result.length).toBe(4);
    });

    it('deleteSeriesVergItems should delete the data with verg and/or verf', () => {
        const deletedSeries = component.deleteSeriesVergItems(deleteSeries);
        expect(deletedSeries[0].verg).toEqual(null);
        expect(deletedSeries[0].brw).toEqual(null);
        expect(deletedSeries[0].verf).toEqual(null);
        expect(deletedSeries[0].nutzung).toEqual(null);

        expect(deletedSeries[2].stag).toEqual('2014');
        expect(deletedSeries[2].nutzung).toEqual('Wohnbaufläche');
        expect(deletedSeries[2].verg).toEqual(null);
        expect(deletedSeries[2].verf).toEqual(null);

        expect(deletedSeries[3].stag).toEqual('2015');
        expect(deletedSeries[3].brw).toEqual('4');
        expect(typeof (deletedSeries[3].brw)).toEqual('string');
        expect(deletedSeries[3].nutzung).toEqual(null);
        expect(deletedSeries[3].verg).toEqual(null);

        expect(deletedSeries.length).toEqual(4);

    });


    it('createLegendLabel should create the label of series', () => {
        const key = '12345';
        const res = component.createLegendLabel(key, series);
        expect(res).toEqual('Wohnbaufläche' +
            '\n' + 12345 +
            '\nSanierungsgebiet' +
            '\nsanierungsunbeeinflusster Wert' +
            '\nsanierungsbeeinflusster Wert' +
            '\nentwicklungsbeeinflusster Wert');
    });

    it('setChartOptionsSeries should format the chart options for the series', () => {
        const label = 'Wohnbaufläche';
        component.setChartOptionsSeries(series, label);
        expect(component.chartOption.series['length']).toEqual(1);
        expect(component.chartOption.series[0].data.length).toEqual(9);
        expect(component.chartOption.series[0].name).toEqual('Wohnbaufläche');
        expect(component.chartOption.series[0].type).toEqual('line');
        expect(component.chartOption.series[0].step).toEqual('end');
    });

    it('generateSrTable should create a table which inculdes the brw-data', () => {
        const label = 'Wohnbaufläche';
        component.generateSrTable(label, series);
        expect(component.srTableHeader.length).toBe(1);
        expect(component.srTableHeader[0]).toEqual('Wohnbaufläche');
        expect(component.srTableData.length).toBe(1);
    });

    it('getBremenStichtag should calculate last Stichtag of Bremen', () => {
        component.STICHTAGE = ['2020-12-31', '2019-12-31', '2018-12-31', '2017-12-31'];

        const result = component.getStichtag('BREMEN');
        expect(result).toEqual('2020-12-31');
    });

    it('getBremerhavenStichtag should calculate last Stichtag of Bremerhaven', () => {
        component.STICHTAGE = ['2020-12-31', '2019-12-31', '2018-12-31', '2017-12-31'];

        const result = component.getStichtag('BREMERHAVEN');
        expect(result).toEqual('2019-12-31');
    });

});
/* vim: set expandtab ts=4 sw=4 sts=4: */
