import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as echarts from 'echarts';
import { BodenrichtwertVerlaufComponent } from './bodenrichtwert-verlauf.component';

describe('Bodenrichtwert.BodenrichtwertVerlauf.BodenrichtwertVerlaufComponent', () => {
    const features = require('../../../assets/boden/bodenrichtwert-samples/bodenrichtwert-verlauf-features.json');

    let component: BodenrichtwertVerlaufComponent;
    let fixture: ComponentFixture<BodenrichtwertVerlaufComponent>;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertVerlaufComponent],
            imports: [
                HttpClientTestingModule
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

    it('filterByStichtag should filter the features by Stichtag', () => {
        const result = component.filterByStichtag(features);
        expect(result.length).toBe(8);
    });

    it('generateChart should insert data into chart options', () => {
        component.echartsInstance = echarts.init(document.getElementById('time-series'));
        component.echartsInstance.setOption(component.chartOption);
        expect(component.chartOption.legend.data.length).toBe(0);
        expect(component.chartOption.series.length).toBe(0);
        component.generateChart(features);
        expect(component.chartOption.legend.data.length).toBe(3);
        expect(component.chartOption.series.length).toBe(3);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
