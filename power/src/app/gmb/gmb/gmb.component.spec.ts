import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of'
import { Location } from '@angular/common';

import { GmbComponent } from './gmb.component';

import { NgxEchartsModule } from 'ngx-echarts';
import * as echarts from 'echarts';

import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import {
    download,
    plusCircle,
    dashCircle,
    infoCircle
} from 'ngx-bootstrap-icons';

// Select some icons (use an object, not an array)
/* eslint-disable object-shorthand */
const icons = {
    download,
    plusCircle,
    dashCircle,
    infoCircle
};
/* eslint-enable object-shorthand */


describe('GmbComponent', () => {
    let component: GmbComponent;
    let fixture: ComponentFixture<GmbComponent>;
    let httpTestingController: HttpTestingController;

    const location = {
        'replaceState': jasmine.createSpy()
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxBootstrapIconsModule.pick(icons),
                NgxEchartsModule.forRoot({ echarts }), // eslint-disable-line object-shorthand
                RouterTestingModule.withRoutes([]),
                RouterTestingModule
            ],
            declarations: [GmbComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        data: of({
                            'mode': 'gmb'
                        }),
                        queryParams: of({
                            'landkreis': 'Lüneburg',
                            'berichte': 'Lüneburg_2006'
                        })
                    }
                },
                { provide: Location, useValue: location }
            ]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GmbComponent);
        component = fixture.componentInstance;

        spyOn(component, 'mapInit').and.callFake(function () {
        });


        fixture.detectChanges();
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('loadGeoMap works', () => {

        spyOn(window, 'setTimeout');
        spyOn(echarts, 'registerMap').and.callFake(function (par1, par2) { });

        component.loadGeoMap('geomap.fake');

        answerHTTPRequest('geomap.fake', 'GET', { 'features': [] });

        expect(echarts.registerMap).toHaveBeenCalled();
    });

    it('generateKreisliste works', () => {

        component.generateKreisliste(undefined);

        const arr = ['033550000', 'foobar'];

        const res = component.generateKreisliste(arr);

        expect(res).toEqual('Lüneburg; foobar');
    });

    it('filterBerichte works', () => {
        component.selectedKreis = undefined;

        component.filterBerichte();

        expect(component.berichteFiltered).toEqual([]);

        component.selectedKreis = '032410000';

        component.filterBerichte();

        const eq = [
            {
                'name': 'Hannover',
                'berichte': component.berichte['Hannover'],
                'start': Object.keys(component.berichte['Hannover'])[0]
            },
            {
                'name': 'Hameln-Hannover',
                'berichte': component.berichte['Hameln-Hannover'],
                'start': Object.keys(component.berichte['Hameln-Hannover'])[0]
            },
        ];
        const eq1 = [
            {
                'name': 'Niedersachsen',
                'berichte': component.berichte['Niedersachsen']
            }
        ];
        expect(component.berichteFiltered).toEqual(eq);

        component.mode = 'lmb';
        component.filterBerichte(true);
        expect(component.berichteFiltered).toEqual(eq1);

    });

    it('Map Tooltip Formatter works', () => {
        const res = component.myMapOptions['tooltip']['formatter']({ 'name': '033550000' });
        expect(res).toEqual('Lüneburg');

        const res1 = component.myMapOptions['tooltip']['formatter']({ 'name': 'foobar' });
        expect(res1).toEqual('foobar');
    });

    it('onMapSelectChange works', () => {
        const param = {
            'type': 'mapselectchanged',
            'batch': [{ 'selected': { '033550000': true } }]
        };

        component.filterBerichte = jasmine.createSpy();

        component.onMapSelectChange(param);

        expect(component.selectedKreis).toEqual('033550000');
        expect(component.filterBerichte).toHaveBeenCalled();

        component.selectedKreis = undefined;
        component.onMapSelectChange({ 'selected': { 'foo': false } });

        expect(component.selectedKreis).toEqual(undefined);
    });

    it('onChange works', () => {
        component.selectedKreis = undefined;

        component.map['dispatchAction'] = jasmine.createSpy();
        component.filterBerichte = jasmine.createSpy();

        component.onChange('033550000');

        expect(component.selectedKreis).toEqual('033550000');
        expect(component.map['dispatchAction']).toHaveBeenCalled();

        component.onChange(null);
        expect(component.selectedKreis).toEqual(undefined);
    });

    it('keyPress works', () => {
        const event = {
            'key': 'Enter',
            'target': {
                'checked': false
            }
        };

        component.keyPress(event);
        expect(event.target['checked']).toEqual(true);
    });

    it('changeURL works', () => {

        component.mode = 'gmb';
        component.selectedKreis = '033550000';
        component.berichteOpened = [ 'Lüneburg_2222' ];

        component.changeURL();

        expect(location.replaceState).toHaveBeenCalledWith(
            '/grundstuecksmarktberichte',
            'landkreis=L%C3%BCneburg&berichte=L%C3%BCneburg_2222'
        );

        component.mode = 'lmb';
        component.berichteOpened = [ 'Lüneburg_2222' ];

        component.changeURL();

        expect(location.replaceState).toHaveBeenCalledWith(
            '/landesgrundstuecksmarktberichte',
            'berichte=L%C3%BCneburg_2222'
        );


    });

    it('selectMenu works', () => {
        component.kreise = {
            'b': 'foo',
            'a': 'bar',
            'c': 'tom'
        };

        const res = component.selectMenu();

        expect(res).toEqual([
            { 'key': null, 'value': '-- Landkreis --' },
            { 'key': 'a', 'value': 'bar' },
            { 'key': 'b', 'value': 'foo' },
            { 'key': 'c', 'value': 'tom' }
        ]);
    });

    it('checkValue works', () => {
        const event = {
            'target': {
                'checked': true,
                'id': 'id0815'
            }
        };

        component.berichteOpened = [];

        component.changeURL = jasmine.createSpy();

        component.checkValue(event);
        expect(component.berichteOpened).toEqual(['0815']);

        event.target.checked = false;
        component.checkValue(event);
        expect(component.berichteOpened).toEqual([]);

        expect(component.changeURL).toHaveBeenCalled();
    });

    it('changeTitle works', () => {
        component.mode = 'gmb';
        component.changeTitle();

        component.mode = 'lmb';
        component.changeTitle();
    });

    /**
     * Mocks the API by taking HTTP requests form the queue and returning the answer
     * @param url The URL of the HTTP request
     * @param method HTTP request method
     * @param body The body of the answer
     * @param opts Optional HTTP information of the answer
     */
    const answerHTTPRequest = (url, method, body, opts?) => {
        // Take HTTP request from queue
        const request = httpTestingController.expectOne(url);
        expect(request.request.method).toEqual(method);

        // Return the answer
        request.flush(deepCopy(body), opts);
    };

    const deepCopy = (data) => JSON.parse(JSON.stringify(data));

    afterEach(() => {
        // Verify that no requests are remaining
        httpTestingController.verify();
    });

});
/* vim: set expandtab ts=4 sw=4 sts=4: */
