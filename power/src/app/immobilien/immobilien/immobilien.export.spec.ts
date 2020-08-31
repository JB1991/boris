import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import * as ImmobilienExport from './immobilien.export';
import * as ImmobilienStatic from './immobilien.static';
import * as ImmobilienRuntime from './immobilien.runtime';
import * as echarts from 'echarts';

import * as Helper from './immobilien.helper';

describe('Immobilien.Immobilien.ImmobilenExport', () => {

    let component: ImmobilienExport.ImmobilienExport;
    let niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
    let niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);

    let downloadSpy;

    beforeEach(() => {
        niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
        niStatic.data = {
            'regionen': {
                '4102': {
                    'name': 'foo'
                }
            }
        };
        //JSON.parse(JSON.stringify(niStaticData));
        //niStatic.referenceDate = '';
        //niStatic.textOptions = {
        //    'fontSizePage': 1
        //};

        niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);
        niRuntime.state = {
        //    'rangeEndIndex': 10,
        //    'selectedChartLine': '',
            'activeSelection': 'na',
            'selectedMyRegion': '4102'
        };
        niRuntime.calculated = {
            'hiddenData': {}
        };
        //JSON.parse(JSON.stringify(niRuntimeCalculated));
        //niRuntime.highlightSeries = function(seriesName) {};
        niRuntime.chart = {
            'obj': {
                'convertToPixel': function(par1, par2) { return 1; },
                'resize': jasmine.createSpy(),
                'setOption': jasmine.createSpy(),
                'getOption': function() { 
                    return {
                        'series': [
                            {
                                'name': '4102',
                                'data': [1, 42, 100]
                            }
                        ],
                        'dataZoom': [
                            {
                                'start': 0,
                                'end': 100
                            }
                        ],
                        'xAxis': [
                            { 'data': ['2000/2', '2000/3', '2000/4'] }
                        ]
                    };
                },
                'getDataURL': function(par1) {
                    return 'data';
                }
            }
        };

        niRuntime.drawPresets = [
            { 
                'show': true,
                'name': '4102',
                'values': ['4102']
            },
            {
                'show': false,
                'values': []
            }
        ];

        //niRuntime.getDrawPreset = function(name) {
        //    return {
        //        'show': true,
        //        'values': ['foo'],
        //        'colors': '#aabbcc'
        //    };
        //};

        component = new ImmobilienExport.ImmobilienExport(niStatic, niRuntime);

        spyOn(echarts, 'getMap').and.callFake(
            function(name) {
                return {
                    'geoJson': {
                        'features': [

                            { "type": "Feature", "properties": { "WOMAREGIO": "Nds_West", "WOMA_NAME": "Westliches Niedersachsen", "WMRE": 2, "WMRS": 0, "name": "4102" }, "geometry": {  } }

                        ]
                    }
                };
            }
        );

        spyOn(Helper, 'downloadFile').and.callFake(
            function(data, filename, filetype = 'text/csv', isurl = false): any {
                return ;
            }
        );

        /*spyOn(Helper, 'convertArrayToCSV').and.callFake(
            function(raw, items) {
                return raw;
            }
        );*/

    });

    
    it('exportAsImage works', function() {
        component.exportAsImage();
        expect(component.exportChart).toEqual(true);
    });

    it('exportNiPixGeoJson returns without object', function() {
        niRuntime.chart.obj = null;
        component.exportNiPixGeoJson();
    });

    it('exportNiPixGeoJson (geoJSON) single works', function() {
        niRuntime.drawPresets[0]['type'] = 'single';
        component.exportNiPixGeoJson();
        expect(Helper.downloadFile).toHaveBeenCalledWith(
            JSON.stringify(
                {
                    'type': 'FeatureCollection',
                    'name': 'womareg',
                    'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:EPSG::3044'}},
                    'features': [
                        {
                            "type": "Feature",
                            "properties": {
                                "WOMAREGIO": "Nds_West",
                                "WOMA_NAME": "Westliches Niedersachsen",
                                "WMRE": 2,
                                "WMRS": 0,
                                "name": "4102",
                                "nipix": {
                                    'type': undefined,
                                    'data': [
                                        {
                                            'date': '2000_2',
                                            'index': 1,
                                            'sales': undefined
                                        },
                                        {
                                            'date': '2000_3',
                                            'index': 42,
                                            'sales': undefined
                                        },
                                        {
                                            'date': '2000_4',
                                            'index': 100,
                                            'sales': undefined
                                        }
                                    ]
                                }
                            },
                            "geometry": {  }
                        }
                    ]
                }
            ),
            'Immobilienpreisindex.geojson');

    });

    it('exportNiPixGeoJson (geoJSON) aggr works', function() {
        niRuntime.drawPresets[0]['type'] = 'aggr';
        spyOn(Helper, 'getGeometryArray').and.callFake(
            function(data, features) {
                return { 'type': 'foo', 'geometries': ['bar'] };
            }
        );

        component.exportNiPixGeoJson();
        expect(Helper.downloadFile).toHaveBeenCalledWith(
            JSON.stringify(
                {
                    'type': 'FeatureCollection',
                    'name': 'womareg',
                    'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:EPSG::3044'}},
                    'features': [
                        {
                            "type": "Feature",
                            "properties": {
                                "name": "4102",
                                "nipix": {
                                    'type': undefined,
                                    'data': [
                                        {
                                            'date': '2000_2',
                                            'index': 1,
                                            'sales': undefined
                                        },
                                        {
                                            'date': '2000_3',
                                            'index': 42,
                                            'sales': undefined
                                        },
                                        {
                                            'date': '2000_4',
                                            'index': 100,
                                            'sales': undefined
                                        }
                                    ]
                                }
                            },
                            "geometry":  { 'type': 'foo', 'geometries': ['bar'] }
                        }
                    ]
                }
            ),
            'Immobilienpreisindex.geojson');

    });

    it('exportNiPixGeoJson (CSV) single works', function() {
        niRuntime.drawPresets[0]['type'] = 'single';
        component.exportNiPixGeoJson(false);
        expect(Helper.downloadFile).toHaveBeenCalledWith(
            '"Kategorie";"Region";"Jahr_Q";"Index";"Kauffälle"\r\n' +
            '"undefined";"foo";"2000_2";"1";"undefined"\r\n' + 
            '"undefined";"foo";"2000_3";"42";"undefined"\r\n' +
            '"undefined";"foo";"2000_4";"100";"undefined"',
            'Immobilienpreisindex.csv'
        );
    });

    it('exportNiPixGeoJson (CSV) aggr works', function() {
        niRuntime.drawPresets[0]['type'] = 'aggr';
        component.exportNiPixGeoJson(false);
        expect(Helper.downloadFile).toHaveBeenCalledWith(
            '"Kategorie";"Region";"Jahr_Q";"Index";"Kauffälle"\r\n' +
            '"undefined";"4102";"2000_2";"1";"undefined"\r\n' + 
            '"undefined";"4102";"2000_3";"42";"undefined"\r\n' +
            '"undefined";"4102";"2000_4";"100";"undefined"',
            'Immobilienpreisindex.csv'
        );
    });

    it('exportGeoJson selected works', function() {
        niRuntime.state.activeSelection = 99;
        niRuntime.state.selectedMyRegion = 'foo';
        component.exportGeoJSON();
         expect(Helper.downloadFile).toHaveBeenCalledWith(JSON.stringify({'features': [ ] }), 'Wohnungsmarktregionen.geojson');

        //expect(component.exportChart).toEqual(true);
    });
            

    /*
    it('mapTooltipFormatter should return myregionname', function() {
        let ths = { myRegionen: {'test': {'name': 'foo'}} };
        let fun = ImmobilenFormatter.mapTooltipFormatter.bind(ths);
        let res = fun({'name': 'test'});
        expect(res).toEqual('foo');
    });

     */
    it('exportGeoJSON works', function() {
        let res = component.exportGeoJSON();
        expect(Helper.downloadFile).toHaveBeenCalledWith(JSON.stringify({
                                'features': [
        
                                    { "type": "Feature", "properties": { "WOMAREGIO": "Nds_West", "WOMA_NAME": "Westliches Niedersachsen", "WMRE": 2, "WMRS": 0, "name": "4102" }, "geometry": {  } }
        
                                ]
        }), 'Wohnungsmarktregionen.geojson');

        //expect(res).not.toBe(undefined);
    });

    it('exportChartImage finish works', function() {
        component.exportChart = true;
        component.chartRenderFinished();
        expect(niRuntime.chart.obj.resize).toHaveBeenCalled();
        expect(niRuntime.chart.obj.setOption).toHaveBeenCalled();
        expect(Helper.downloadFile).toHaveBeenCalledWith('data', 'nipix.png', '', true);
    });
    /*
    it('getChartOptions return Object', function() {
        let res = ImmobilenChartOptions.getChartOptions();
        expect(res).not.toBe(undefined);
    });
     */
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
