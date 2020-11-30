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
        component.clearChart();
        expect(component.chartOption.legend.data.length).toBe(0);
        expect(component.chartOption.series.length).toBe(0);
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
        spyOn(component, 'setChartOptionsVerf').and.callThrough();
        spyOn(component, 'fillLineDuringYear').and.callThrough();
        spyOn(component, 'onResizeVerf').and.callThrough();;
        component.generateChart(features);
        expect(component.chartOption.legend.data.length).toBe(1);
        expect(component.chartOption.series.length).toBe(1);
        expect(component.chartOption.visualMap[0].pieces.length).toBe(1);
        expect(component.chartOption.visualMap[0].pieces[0].label).toBe('Sanierungsgebiet:\nKeine Wertanpassung');
        expect(component.chartOption.visualMap[0].inRange.color).toBe('#0080FF');
        expect(component.chartOption.grid.top).toBe('15%');
        expect(typeof 'component.chartOption.visualMap[0].outOfRange.color').toBe('string');
        expect(typeof 'component.chartOption.serie[8].brw').toBe('string');
        expect(typeof 'component.chartOption.serie[3].brw').toBe('string');
        expect(typeof 'component.chartOption.serie[6].brw').toBe('string');
        expect(component.setChartOptionsSeries).toHaveBeenCalledTimes(1);
        expect(component.setChartOptionsVerf).toHaveBeenCalledTimes(1);
        expect(component.fillLineDuringYear).toHaveBeenCalledTimes(1);
        expect(component.onResizeVerf).toHaveBeenCalledTimes(1);
    });

    it('onChartInit should set the echartsInstance', () => {
        const echartsInstance = echarts.init(document.getElementById('eChartInstance'));
        component.onChartInit(echartsInstance);
        expect(component.echartsInstance).toEqual(echartsInstance);

    });

});
/* vim: set expandtab ts=4 sw=4 sts=4: */
