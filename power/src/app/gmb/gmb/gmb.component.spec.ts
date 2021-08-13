import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';

import { GmbComponent } from './gmb.component';

/* eslint-disable max-lines */
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
        // spyOn(echarts, 'registerMap').and.callFake(function (par1, par2) { });

        component.loadGeoMap('geomap.fake');

        answerHTTPRequest('geomap.fake', 'GET', { 'features': [] });

        // expect(echarts.registerMap).toHaveBeenCalled();
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
                'name': 'Hameln-Hannover',
                'berichte': keyValueSort(component.berichte['Hameln-Hannover']),
                'start': Object.keys(component.berichte['Hameln-Hannover'])[0]
            },
            {
                'name': 'Hannover',
                'berichte': keyValueSort(component.berichte['Hannover']),
                'start': Object.keys(component.berichte['Hannover'])[0]
            },
        ];
        const eq1 = [
            {
                'name': 'Niedersachsen',
                'berichte': keyValueSort(component.berichte['Niedersachsen'])
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
            'type': 'selectchanged',
            'fromAction': 'select',
            'selected': [{ 'dataIndex': [1] }]
        };

        component.filterBerichte = jasmine.createSpy();

        component.onMapSelectChange(param);

        expect(component.selectedKreis).toEqual('033540000');
        expect(component.filterBerichte).toHaveBeenCalled();
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
        component.berichteOpened = ['Lüneburg_2222'];

        component.changeURL();

        expect(location.replaceState).toHaveBeenCalledWith(
            '/grundstuecksmarktberichte',
            'landkreis=L%C3%BCneburg&berichte=L%C3%BCneburg_2222'
        );

        component.mode = 'lmb';
        component.berichteOpened = ['Lüneburg_2222'];

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

    it('ariaLabelBericht works', () => {
        const resg = component.ariaLabelBericht(2000, 'Foobar');
        const resn = component.ariaLabelBericht(2000, 'Niedersachsen');

        const resgd = component.ariaLabelBericht(2000, 'Foobar', true);
        const resnd = component.ariaLabelBericht(2000, 'Niedersachsen', true);

        const dl = 'Download des ';
        const n = 'Landesgrundstücksmarktbericht';
        const g = 'Grundstücksmarktbericht';

        expect(resg).toEqual(g + ' 2000 vom Gutachterausschuss Foobar');
        expect(resn).toEqual(n + ' 2000');

        expect(resgd).toEqual(dl + g + 'es 2000 vom Gutachterausschuss Foobar');
        expect(resnd).toEqual(dl + n + 'es 2000');
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

    const keyValueSort = (data) => {
        const bb = [];
        const yk = Object.keys(data);

        for (let y = 0; y < yk.length; y++) {
            bb.push({
                'key': yk[y],
                'value': data[yk[y]]
            });

        }

        bb.sort(function (b, a) {
            return a['key'] - b['key'];
        });

        return bb;
    };

    afterEach(() => {
        // Verify that no requests are remaining
        httpTestingController.verify();
    });

});
/* vim: set expandtab ts=4 sw=4 sts=4: */
