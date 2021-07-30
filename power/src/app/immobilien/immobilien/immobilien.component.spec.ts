import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs/observable/of';
import { Location } from '@angular/common';


import { ImmobilienComponent } from './immobilien.component';
import * as ImmobilienNipixStatic from './immobilien.static';
import * as ImmobilienNipixRuntime from './immobilien.runtime';
import { ImmobilienChartOptions } from './immobilien.chartoptions';
import { ImmobilienHelper } from './immobilien.helper';
import { ImmobilienUtils } from './immobilien.utils';

import * as echarts from 'echarts';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

/* eslint-disable max-lines */
describe('Immobilien.Immobilien.ImmobilienComponent', () => {
    let component: ImmobilienComponent;
    let fixture: ComponentFixture<ImmobilienComponent>;
    let httpTestingController: HttpTestingController;

    let niStatic;
    let niRuntime;

    const location = {
        'replaceState': jasmine.createSpy()
    };

    const prepareNiStatic = function () {
        niStatic = Object.create(ImmobilienNipixStatic.NipixStatic.prototype);
        niStatic.loadConfig = jasmine.createSpy();
        niStatic.textOptions = {
            'fontSizePage': 1
        };
        niStatic.data = {
            'geoCoordMap': {}
        };
    };

    const prepareNiRuntime = function () {
        niRuntime = Object.create(ImmobilienNipixRuntime.NipixRuntime.prototype);
        niRuntime.resetDrawPresets = jasmine.createSpy();
        niRuntime.calculated = {
            'mapRegionen': null,
            'chartTitle': null
        };
        niRuntime.export = {
            'chartRenderFinished': jasmine.createSpy()
        };
        niRuntime.chart = {
            'obj': null
        };
        niRuntime.map = {
            'obj': null,
            'options': {
                'series': [
                    {
                        'data': [
                            {}, {}, {}, {}, {}
                        ]
                    }
                ]
            }
        };
        niRuntime.state = {
            'initState': 0
        };
        niRuntime.formatter = {
        };
        niRuntime.translateArray = function (data) { return data; };
    };

    const configAnswer = {
        'lastYear': 2020,
        'lastPeriod': 2,
        'gemeindenUrl': 'gemeinde.fake',
        'mapUrl': 'map.fake',
        'nipixUrl': 'nipix.fake'
    };

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                BrowserAnimationsModule,
                AccordionModule.forRoot(),
                BsDropdownModule.forRoot(),
                RouterTestingModule.withRoutes([]),
                RouterTestingModule,
            ],
            providers: [
                ImmobilienUtils,
                ImmobilienHelper,
                ImmobilienChartOptions,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        queryParams: of({
                        })
                    }
                },
                { provide: Location, useValue: location }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {

        prepareNiStatic();
        prepareNiRuntime();

        fixture = TestBed.createComponent(ImmobilienComponent);
        component = fixture.componentInstance;
        component.nipixStatic = niStatic;
        component.nipixRuntime = niRuntime;

        spyOn(component, 'initNipix').and.callFake(function () {
        });

        fixture.detectChanges();

        httpTestingController = TestBed.inject(HttpTestingController);


    });

    it('should create', () => {
        expect(component).toBeTruthy();
        expect(component.initNipix).toHaveBeenCalled();
    });

    it('loadConfig works', () => {
        spyOn(ImmobilienUtils, 'getDateArray').and.callFake(function (par1, par2) { return []; });
        spyOn(ImmobilienChartOptions, 'getChartOptions').and.callFake(function (par) { return {}; });

        niStatic.data.selections = [{ 'name': 'foobar' }];
        component.loadGemeinden = jasmine.createSpy();
        component.loadGeoMap = jasmine.createSpy();

        component.loadConfig(component.configUrl);

        answerHTTPRequest(component.configUrl, 'GET', configAnswer);
        expect(niStatic.loadConfig).toHaveBeenCalled();
        expect(niRuntime.calculated.chartTitle).toEqual('foobar');
        // expect(ImmobilienUtils.getDateArray).toHaveBeenCalled();
        // expect(ImmobilienChartOptions.getChartOptions).toHaveBeenCalled();
        expect(component.loadGemeinden).toHaveBeenCalled();
        expect(component.loadGeoMap).toHaveBeenCalled();
    });

    it('loadGemeinden works', () => {
        niStatic.parseGemeinden = jasmine.createSpy();
        component.loadGemeinden('gemeinden.fake');

        answerHTTPRequest('gemeinden.fake', 'GET', {});

        expect(niStatic.parseGemeinden).toHaveBeenCalled();
    });

    it('loadGeoMap works', () => {

        spyOn(ImmobilienUtils, 'getMyMapRegionen').and.callFake(
            function (regionen: any, myregion?: any, selectionList?: any, lighten?: boolean) {
                return [
                ];
            });

        component.setMapOptions = jasmine.createSpy();
        niRuntime.resetDrawPresets = jasmine.createSpy();
        niRuntime.updateAvailableNipixCategories = jasmine.createSpy();
        niStatic.procMap = function () { return { 'map': {}, 'la': [2000, 2] }; };

        spyOn(window, 'setTimeout');
        // spyOn(echarts, 'registerMap').and.callFake(function (par1, par2) { });

        component.loadGeoMap('geomap.fake');

        answerHTTPRequest('geomap.fake', 'GET', { 'features': [] });

        // expect(echarts.registerMap).toHaveBeenCalled();
        expect(niRuntime.updateAvailableNipixCategories).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalled();
        expect(niRuntime.resetDrawPresets).toHaveBeenCalled();
        expect(ImmobilienUtils.getMyMapRegionen).toHaveBeenCalled();
        expect(component.setMapOptions).toHaveBeenCalled();

    });

    it('setMapOptions works', () => {
        spyOn(window, 'setTimeout');
        spyOn(ImmobilienChartOptions, 'getMapOptions').and.callFake(function (par, type) { return {}; });
        spyOn(component, 'updateMapSelect').and.callFake(function () { });

        component.setMapOptions();
        expect(ImmobilienChartOptions.getMapOptions).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalled();

    });

    it('onMapSelectChange works', () => {
        niRuntime.drawPresets = [{ 'values': [] }];
        spyOn(component, 'updateChart').and.callFake(function () { });

        component.onMapSelectChange({
            'type': 'selectchanged',
            'fromAction': 'select',
            'selected': [
                { 'dataIndex': [1] }
            ]
        });
        expect(component.updateChart).toHaveBeenCalled();

    });

    it('toggleMapSelect works', () => {
        niRuntime.resetHighlight = jasmine.createSpy();
        niRuntime.drawPresets = [{ 'name': 'foo', 'nipixCategory': 'bar', 'values': ['bar'] }];

        spyOn(ImmobilienUtils, 'dispatchMapSelect').and.callFake(function (par1, par2, par3) { });
        spyOn(component, 'updateChart').and.callFake(function () { });

        component.toggleMapSelect('foo', 'bar', 'single');
        expect(niRuntime.resetHighlight).toHaveBeenCalled();
        expect(component.updateChart).toHaveBeenCalled();
        expect(ImmobilienUtils.dispatchMapSelect).toHaveBeenCalled();

        component.toggleMapSelect('foo', 'barfoo', 'single');
        expect(ImmobilienUtils.dispatchMapSelect).toHaveBeenCalled();
    });

    it('updateMapSelect works', () => {
        niRuntime.updateMapSelect = jasmine.createSpy();

        component.updateMapSelect();
        expect(niRuntime.updateMapSelect).toHaveBeenCalledWith(null);

        component.updateMapSelect('foobar');
        expect(niRuntime.updateMapSelect).toHaveBeenCalledWith('foobar');
    });

    it('Init with initState=3 works', () => {
        spyOn(component, 'updateChart').and.callFake(function () { });
        spyOn(component, 'updateMapSelect').and.callFake(function () { });
        niRuntime.state.initState = 3;

        component.onChartInit(null);
        component.onChartChartInit(null);

        expect(component.updateChart).toHaveBeenCalled();
        expect(component.updateMapSelect).toHaveBeenCalled();
    });

    /*
    it('onChartFinished works', () => {
        niRuntime.export = {
            'chartRenderFinished': jasmine.createSpy()
        };

        component.onChartFinished(null);

        expect(niRuntime.export.chartRenderFinished).toHaveBeenCalled();
    });

*/

    it('onChangeCat works', () => {
        niRuntime.drawPresets = [{ 'name': 'foo', 'nipixCategory': 'bar' }];
        spyOn(component, 'updateChart').and.callFake(function () { });

        component.onChangeCat('foo', 'bar');
        expect(component.updateChart).toHaveBeenCalled();

        component.onChangeCat(['foo'], 'bar');
        expect(component.updateChart).toHaveBeenCalled();
    });

    it('onClickDrawRoot works', () => {
        spyOn(component, 'updateChart').and.callFake(function () { });
        spyOn(component, 'updateMapSelect').and.callFake(function () { });

        component.onClickDrawRoot('foobar');

        expect(component.updateChart).toHaveBeenCalled();
        expect(component.updateMapSelect).toHaveBeenCalled();
    });

    it('onToggleDrawRoot works', () => {
        spyOn(component, 'updateChart').and.callFake(function () { });
        niRuntime.drawPresets = [{ 'name': 'foobar', 'show': false }];

        component.onToggleDrawRoot('foobar');

        expect(component.updateChart).toHaveBeenCalled();
    });

    it('updateChart works', () => {
        spyOn(component, 'updateChartMerge').and.callFake(function (par1, par2, par3, par4) { });
        niRuntime.calculateDrawData = jasmine.createSpy();
        niRuntime.updateRange = jasmine.createSpy();
        niRuntime.availableQuartal = ['2000/2', '2000/3'];
        niRuntime.state.rangeStartIndex = 0;
        niRuntime.state.rangeEndIndex = 1;
        niStatic.data.selections = { 'foo': { 'type': 'single', 'preset': ['foo'] } };
        niRuntime.state.activeSelection = 'foo';
        niRuntime.getDrawPreset = jasmine.createSpy().and.returnValue({ 'nipixCategory': 'foobar' });

        component.updateChart(1, 100);

        expect(niRuntime.updateRange).toHaveBeenCalled();
        expect(niRuntime.calculateDrawData).toHaveBeenCalled();
        expect(niRuntime.getDrawPreset).toHaveBeenCalled();
        expect(component.updateChartMerge).toHaveBeenCalled();
    });

    it('onDataZoom works', () => {
        spyOn(component, 'updateChart').and.callFake(function (par1, par2) { });
        niRuntime.availableQuartal = ['2000/2', '2000/3'];

        component.onDataZoom({ 'start': 1, 'end': 100 });
        expect(niRuntime.state.rangeStartIndex).toEqual(0);
        expect(niRuntime.state.rangeEndIndex).toEqual(1);
        expect(niStatic.referenceDate).toEqual('2000_2');
        expect(component.updateChart).toHaveBeenCalled();
    });

    it('chartClicked works', () => {
        spyOn(component, 'updateChart').and.callFake(function () { });

        component.chartClicked({ 'componentType': 'series', 'seriesType': 'line', 'seriesName': 'foobar' });
        expect(niRuntime.state.selectedChartLine).toEqual('foobar');
        expect(component.updateChart).toHaveBeenCalled();
    });

    it('onPanelChangeWoMa works', () => {
        spyOn(component, 'setMapOptions').and.callFake(function (par) { });
        spyOn(component, 'updateMapSelect').and.callFake(function (par) { });
        spyOn(ImmobilienUtils, 'getMyMapRegionen').and.callFake(
            function (regionen, myregion = null, selectionList = null, lighten = false) { return ['foobar']; });

        component.onPanelChangeWoMa();

        expect(component.setMapOptions).toHaveBeenCalled();
        expect(component.updateMapSelect).toHaveBeenCalled();
        expect(niRuntime.calculated.mapRegionen).toEqual(['foobar']);
    });

    it('onPanelChangeIndex works', () => {
        niRuntime.drawPresets = [{ 'name': 'foo', 'nipixCategory': 'bar', 'values': ['bar'] }];
        niStatic.data.selections = { 1: { 'name': 'bar', 'type': 'multiSelect', 'preset': '', 'selected': false } };
        spyOn(component, 'updateChart').and.callFake(function () { });
        spyOn(ImmobilienUtils, 'getMyMapRegionen').and.callFake(
            function (regionen, myregion = null, selectionList = null, lighten = false) { return ['foobar']; });
        spyOn(ImmobilienUtils, 'modifyRegionen').and.callFake(function (regionen, modifyArray) { return {}; });
        spyOn(component, 'setMapOptions').and.callFake(function (par) { });
        spyOn(component, 'onSetSpecificDraw').and.callFake(function (par, par1) { });
        component.onPanelChangeIndex(1);

        expect(component.onSetSpecificDraw).toHaveBeenCalled();
        expect(component.updateChart).toHaveBeenCalled();
        expect(ImmobilienUtils.getMyMapRegionen).toHaveBeenCalled();
        expect(component.setMapOptions).toHaveBeenCalled();
    });

    it('toggleAllSelect works', () => {
        niRuntime.resetHighlight = jasmine.createSpy();
        niRuntime.drawPresets = [{ 'name': 'foo', 'nipixCategory': 'bar', 'values': ['bar'] }];
        spyOn(component, 'updateChart').and.callFake(function () { });
        spyOn(component, 'updateMapSelect').and.callFake(function () { });

        component.toggleAllSelect('foo');

        expect(niRuntime.resetHighlight).toHaveBeenCalled();
        expect(component.updateChart).toHaveBeenCalled();
        expect(component.updateMapSelect).toHaveBeenCalled();

    });

    it('regionName works', () => {
        niStatic.data.regionen = { '4102': { 'name': 'foo' } };
        spyOn(component, 'updateMapSelect').and.callFake(function (par) { });

        const ret = component.regionName('4102');

        expect(component.updateMapSelect).toHaveBeenCalledWith('4102');
        expect(ret).toEqual('foo');

        const ret1 = component.regionName(undefined);
        expect(ret1).toEqual('');
    });

    it('selectSingle works', () => {
        niStatic.data.selections = [ {'type': 'single'}, {'type': 'foo'} ];
        const res = component.selectSingle();
        expect(res).toEqual(0);
    });

    it('onSelectWoMa works', () => {
        niStatic.data.gemeinden = [ {'name': 'foo', 'woma_id': 'foo'} ];
        component.selectedWoMaValue = 'foo';

        component.accOpen = { '0': false, '1': false };
        spyOn(component, 'selectSingle').and.returnValue(0);

        niStatic.data.selections = [ {'preset': ['foo']} ];
        niRuntime.drawPresets = [{ 'name': 'foo', 'nipixCategory': 'bar', 'values': ['bar'] }];

        spyOn(component, 'updateChart').and.callFake(function () { });
        spyOn(component, 'updateMapSelect').and.callFake(function () { });

        component.onSelectWoMa();

        expect(niRuntime.drawPresets[0]['values']).toEqual(['foo']);
        expect(niRuntime.state.activeSelection).toEqual(0);
    });

    it('parseURLTimeRange works', () => {
        niRuntime.availableQuartal = ['foo', 'bar', 'foobar'];
        const params = {
            't1': 'foo',
            't2': 'foobar'
        };

        component.parseURLTimeRange(params);

        expect(niRuntime.state.rangeStartIndex).toEqual(0);
        expect(niRuntime.state.rangeEndIndex).toEqual(2);
    });

    it('parseURLAggr works', () => {

        spyOn(component, 'checkURLNipixCategory').and.returnValue('bar');
        const di = {};
        niRuntime.getDrawPreset = function(val) { return this; }.bind(di);

        niStatic.data.selections = [{
            'type': 'multiIndex',
            'preset': ['a']
        }];
        const params = {
            'a': 'a,b,c',
            'i': 'foo'
        };

        component.parseURLAggr(0, params);

        expect(di['nipixCategory']).toEqual('bar');
        expect(di['show']).toEqual(true);
    });

    it('parseURLSingle works', () => {

        spyOn(component, 'checkURLNipixCategory').and.returnValue('bar');
        const di = {
            'type': 'single'
        };
        niRuntime.getDrawPreset = function(val) { return this; }.bind(di);

        spyOn(component, 'unmakeValuesHumanReadable').and.callFake(function(val) { return val; });

        niStatic.data.selections = [{
            'type': 'multiIndex',
            'preset': ['a']
        }];

        const params = {
            's': 'a,b,c',
            'i': 'foo'
        };

        component.parseURLSingle(0, params);

        expect(di['nipixCategory']).toEqual('bar');
        expect(di['values']).toEqual(['a','b','c']);
    });

    it('parseURLMultiSelect works', () => {

        spyOn(component, 'checkURLNipixCategory').and.returnValue('bar');
        const di = {
            'type': 'single'
        };
        niRuntime.getDrawPreset = function(val) { return this; }.bind(di);

        spyOn(component, 'unmakeValuesHumanReadable').and.callFake(function(val) { return val; });

        niStatic.data.selections = [{
            'type': 'multiIndex',
            'preset': ['a']
        }];

        const params = {
            'm': 'a:foo:a;b:foo:b;c:foo:c'
        };


        component.parseURLMultiSelect(0, params);
    });

    it('queryURL works', () => {
        niStatic.data.selections = [
            {'name': 'bar'},
            {'name': '1'}
        ];
        const params = {
            'c': '1'
        };
        spyOn(component, 'parseURLTimeRange').and.callFake( function(par) {} );
        spyOn(component, 'staticChange').and.callFake( function() {} );

        spyOn(component, 'parseURLAggr').and.returnValue();
        spyOn(component, 'parseURLSingle').and.returnValue();
        spyOn(component, 'parseURLMultiSelect').and.returnValue();

        component.queryURL({'c': '1', 'a': 'foo'});
        expect(component.parseURLAggr).toHaveBeenCalled();

        component.queryURL({'c': '1', 's': 'foo'});
        expect(component.parseURLSingle).toHaveBeenCalled();

        component.queryURL({'c': '1', 'm': 'foo'});
        expect(component.parseURLMultiSelect).toHaveBeenCalled();
    });

    it('onChangeQuartal works', () => {
        spyOn(component, 'updateChart').and.callFake( function(t1, t2) {} );
        niRuntime.availableQuartal= [ 'foo', 'bar', 'foobar' ];
        component.onChangeQuartal(0,2);
        expect(niRuntime.state.rangeStartIndex).toEqual(0);
        expect(niRuntime.state.rangeEndIndex).toEqual(2);
        expect(component.updateChart).toHaveBeenCalledWith(0,100);

    });

    it('getCustomColor works', () => {
        niRuntime.getDrawPreset = jasmine.createSpy().and.returnValue({ 'colors': 'foobar' });
        spyOn(ImmobilienHelper, 'convertColor').and.callFake(function (par) { return par; });

        const ret = component.getCustomColor('foobar');
        expect(ret).toEqual('foobar');

        niRuntime.getDrawPreset = jasmine.createSpy().and.returnValue(undefined);
        const ret2 = component.getCustomColor('bar');
        expect(ret2).toEqual('transparent');
    });

    it('onSetSpecificDraw works', () => {
        niRuntime.drawPresets = [{ 'name': 'foo', 'nipixCategory': 'bar', 'values': ['bar'] }];

        component.onSetSpecificDraw(['foo'], 0);
        expect(niRuntime.drawPresets[0].show).toEqual(false);
        component.onSetSpecificDraw(['foo'], 1);
        expect(niRuntime.drawPresets[0].show).toEqual(true);

    });

    it('onSetNumber works', () => {
        niStatic.data.selections = [{ 'name': 'foobar', 'selected': 0, 'preset': ['foo'] }];
        spyOn(component, 'updateChart').and.callFake(function () { });
        spyOn(component, 'onSetSpecificDraw').and.callFake(function (par, par1) { });

        component.onSetNumber('foobar', 2);

        expect(component.onSetSpecificDraw).toHaveBeenCalledWith(['foo'], 1);
        expect(component.updateChart).toHaveBeenCalled();
    });

    it('toggleNipixCategory works', () => {
        spyOn(component, 'updateChart').and.callFake(function () { });
        niRuntime.toggleNipixCategory = jasmine.createSpy();
        component.toggleNipixCategory('foobar');
        expect(niRuntime.toggleNipixCategory).toHaveBeenCalledWith('foobar');
        expect(component.updateChart).toHaveBeenCalled();
    });

    it('staticChange works', () => {
        component.accOpen = {};
        spyOn(component, 'onPanelChangeIndex').and.returnValue();
        spyOn(component, 'onPanelChangeWoMa').and.returnValue();

        component.staticChange(0, true);
        expect(component.onPanelChangeIndex).toHaveBeenCalledWith(0);
        expect(component.accOpen[0]).toEqual(true);

        component.staticChange(99, true);
        expect(component.onPanelChangeWoMa).toHaveBeenCalled();
        expect(component.accOpen[99]).toEqual(true);
    });

    it('makeValuesHumanReadable works', () => {
        niStatic.data.regionen = {
            'foo': { 'short': 'a b&$%§=012' }
        };
        const res = component.makeValuesHumanReadable(['foo']);
        expect(res).toEqual(['ab012']);
    });

    it('unmakeValuesHumanReadable works', () => {
        niStatic.data.regionen = {
            'foo': { 'short': 'a b&$%§=012' }
        };
        const res = component.unmakeValuesHumanReadable(['ab012']);
        expect(res).toEqual(['foo']);
    });

    it('checkURLNipixCategory works', () => {
        niRuntime.availableNipixCategories = ['f oo', 'b ar'];
        const res = component.checkURLNipixCategory('bar');
        expect(res).toEqual('b ar');
    });

    it('changeURLAppendPresets works', () => {


        let param = {};
        const params = {
            'append': function(k, v) { param[k]=v; }
        };


        spyOn(component, 'makeValuesHumanReadable').and.returnValue(['foobar']);

        const dpreset = {
            'nipixCategory': 'foobar',
            'name': 'barfoo',
            'type': 'single',
            'show': true,
            'values': ['foo','bar']
        };

        niRuntime.getDrawPreset = function(val) {
            return dpreset;
        };

        let res = component.changeURLAppendPresets({'preset': ['foo'], 'nipixCategory': 'bar'}, params);
        expect(param).toEqual({
            'i': 'foobar',
            's': 'foobar'
        });

        param = {};

        res = component.changeURLAppendPresets({'preset': ['foo', 'bar'], 'type': 'multiIndex'}, params);
        expect(param).toEqual({
            'i': 'foobar',
            'a': 'foo,bar'
        });

        param = {};


        dpreset['name'] = 'bf';

        res = component.changeURLAppendPresets({'preset': ['fo', 'ba'], 'type': 'multiIndex'}, params);
        expect(param).toEqual({
            'm': 'fo:foobar:foobar;ba:foobar:foobar'
        });



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
