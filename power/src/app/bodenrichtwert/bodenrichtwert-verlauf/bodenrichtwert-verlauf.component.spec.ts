import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BodenrichtwertVerlaufComponent } from './bodenrichtwert-verlauf.component';
import { SimpleChanges } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

describe('Bodenrichtwert.BodenrichtwertVerlauf.BodenrichtwertVerlaufComponent', () => {
    const changes: SimpleChanges = require('../../../assets/boden/bodenrichtwert-samples/bodenrichtwert-verlauf-changes.json');
    const features = require('../../../assets/boden/bodenrichtwert-samples/bodenrichtwert-verlauf-features.json');
    const featureCollection = require('../../../assets/boden/bodenrichtwert-samples/bodenrichtwert-verlauf-featurecollection.json');
    const series = require('../../../assets/boden/bodenrichtwert-samples/bodenrichtwert-verlauf-series.json');

    let component: BodenrichtwertVerlaufComponent;
    let fixture: ComponentFixture<BodenrichtwertVerlaufComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertVerlaufComponent],
            imports: [
                HttpClientTestingModule,
                NgxEchartsModule.forRoot({ echarts: echarts }),
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertVerlaufComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        httpClient = TestBed.inject(HttpClient);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });

    it('ngOnChanges should work', () => {
        component.features = featureCollection;
        spyOn(component, 'clearChart');
        spyOn(component, 'filterByStichtag');
        spyOn(component, 'generateChart');
        component.ngOnChanges(changes);
        expect(component.clearChart).toHaveBeenCalledTimes(1);
        expect(component.filterByStichtag).toHaveBeenCalledTimes(1);
        expect(component.generateChart).toHaveBeenCalledTimes(1);
    });

    it('clearChart should delete the chart data', () => {
        component.chartOption.legend.data = ['foo'];
        component.chartOption.series = ['bar'];
        component.chartOption.legend.formatter = ['pluto'];
        component.chartOption.legend.textStyle.rich = 'toto';
        component.chartOption.grid.top = '20%';
        component.srTableData = ['tata'];
        component.srTableHeader = ['paperino'];
        component.clearChart();
        expect(component.chartOption.legend.data.length).toBe(0);
        expect(component.chartOption.series.length).toBe(0);
        expect(component.srTableHeader.length).toBe(0);
        expect(component.srTableData.length).toBe(0);
        expect(component.chartOption.legend.formatter).toBe('');
        expect(component.chartOption.legend.textStyle.rich).toBe('');
        expect(component.chartOption.grid.top).toBe('10%');
    });

    it('filterByStichtag should filter the features by Stichtag', () => {
        const result = component.filterByStichtag(features);
        expect(result.length).toBe(8);
    });

    it('generateChart should insert data into chart options', () => {
        component.echartsInstance = echarts.init(document.getElementById('eChartInstance'));
        component.echartsInstance.setOption(component.chartOption);
        expect(component.chartOption.legend.data.length).toBe(0);
        expect(component.chartOption.series.length).toBe(0);
        spyOn(component, 'setChartOptionsSeries').and.callThrough();
        spyOn(component, 'fillLineDuringYear').and.callThrough();
        component.generateChart(features);
        expect(component.chartOption.legend.data.length).toBe(1);
        expect(component.chartOption.series.length).toBe(2);
        expect(typeof 'component.chartOption.serie[8].brw').toBe('string');
        expect(typeof 'component.chartOption.serie[3].brw').toBe('string');
        expect(typeof 'component.chartOption.serie[6].brw').toBe('string');
        expect(component.setChartOptionsSeries).toHaveBeenCalledTimes(2);
        expect(component.fillLineDuringYear).toHaveBeenCalledTimes(1);
    });

    it('onChartInit should set the echartsInstance', () => {
        const echartsInstance = echarts.init(document.getElementById('eChartInstance'));
        component.onChartInit(echartsInstance);
        expect(component.echartsInstance).toEqual(echartsInstance);

    });

    it('getSeriesData should transform and filter features into series-array', () => {
        spyOn(component, 'deepCopy').and.callThrough();
        const result = component.getSeriesData(features);
        expect(component.deepCopy).toHaveBeenCalledTimes(1);
        expect(result.length).toBeGreaterThan(8);
    });

    it('getVergSeries should filter brws which inculdes a Verfahrensgrund', () => {
        spyOn(component, 'deepCopy').and.callThrough();
        const result = component.getVergSeries(series);
        console.log(result);
        expect(component.deepCopy).toHaveBeenCalledTimes(17);
        expect(result.length).toBe(4);
    });

    // it('deleteSeriesVergItems should delete the data with verg and/or verf', () => {
    //     const res = component.deleteSeriesVergItems(series);
    //     expect(typeof(res[2].brw)).toBe('string');

    // });

    it('setLegendFormat should format the legend of the diagram', () =>{
       

    });

    it('getBremenStichtag should calculate last Stichtag of Bremen', () => {
        spyOn(component, 'getCurrentYear').and.returnValues(2020, 2021);
        let result = component.getBremenStichtag();
        expect(result).toBe('31.12.2017.');
        result = component.getBremenStichtag();
        expect(result).toBe('31.12.2019.');
    });

    it('getBremenStichtag should calculate last Stichtag of Bremerhaven', () => {
        spyOn(component, 'getCurrentYear').and.returnValues(2021, 2020);
        let result = component.getBremerhavenStichtag();
        expect(result).toBe('31.12.2018.');
        result = component.getBremerhavenStichtag();
        expect(result).toBe('31.12.2018.');
    });

});
/* vim: set expandtab ts=4 sw=4 sts=4: */
