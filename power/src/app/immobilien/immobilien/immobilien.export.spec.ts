import * as ImmobilienExport from './immobilien.export';
import * as ImmobilienStatic from './immobilien.static';
import * as ImmobilienRuntime from './immobilien.runtime';
import * as echarts from 'echarts';

import { ImmobilienHelper } from './immobilien.helper';

describe('Immobilien.Immobilien.ImmobilenExport', () => {

    let component: ImmobilienExport.ImmobilienExport;
    let niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
    let niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);

    const prepareNiStatic = function () {
        niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
        niStatic.data = {
            'regionen': {
                '4102': {
                    'name': 'foo'
                }
            }
        };
    };

    const prepareNiRuntime = function () {
        niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);
        niRuntime.state = {
            'activeSelection': 'na',
            'selectedMyRegion': '4102'
        };
        niRuntime.calculated = {
            'hiddenData': {}
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

    };

    const prepareNiRuntimeChart = function () {
        niRuntime.chart = {
            'obj': {
                'convertToPixel': function (par1, par2) { return 1; },
                'resize': jasmine.createSpy(),
                'setOption': jasmine.createSpy(),
                'getOption': function () {
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
                'getDataURL': function (par1) {
                    return 'data';
                }
            }
        };
    };

    beforeEach(() => {

        prepareNiStatic();

        prepareNiRuntime();
        prepareNiRuntimeChart();

        component = new ImmobilienExport.ImmobilienExport(niStatic, niRuntime);

        spyOn(echarts, 'getMap').and.callFake(
            function (name) {
                return {
                    'geoJson': {
                        'features': [

                            { 'type': 'Feature', 'properties': { 'WOMAREGIO': 'Nds_West', 'WOMA_NAME': 'Westliches Niedersachsen', 'WMRE': 2, 'WMRS': 0, 'name': '4102' }, 'geometry': {} }

                        ]
                    }
                };
            }
        );

        spyOn(ImmobilienHelper, 'downloadFile').and.callFake(
            function (data, filename, filetype = 'text/csv', isurl = false): any {
                return;
            }
        );

    });


    it('exportAsImage works', function () {
        component.exportAsImage();
        expect(component.exportChart).toEqual(true);
    });

    it('exportNiPixGeoJson returns without object', function () {
        niRuntime.chart.obj = null;
        component.exportNiPixGeoJson();
    });

    it('exportNiPixGeoJson (geoJSON) single works', function () {
        niRuntime.drawPresets[0]['type'] = 'single';
        component.exportNiPixGeoJson();
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith(
            JSON.stringify(
                {
                    'type': 'FeatureCollection',
                    'name': 'womareg',
                    'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:EPSG::3044' } },
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {
                                'WOMAREGIO': 'Nds_West',
                                'WOMA_NAME': 'Westliches Niedersachsen',
                                'WMRE': 2,
                                'WMRS': 0,
                                'name': '4102',
                                'nipix': {
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
                            'geometry': {}
                        }
                    ]
                }
            ),
            'Immobilienpreisindex.geojson');

    });

    it('exportNiPixGeoJson (geoJSON) aggr works', function () {
        niRuntime.drawPresets[0]['type'] = 'aggr';
        spyOn(ImmobilienHelper, 'getGeometryArray').and.callFake(
            function (data, features) {
                return { 'type': 'foo', 'geometries': ['bar'] };
            }
        );

        component.exportNiPixGeoJson();
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith(
            JSON.stringify(
                {
                    'type': 'FeatureCollection',
                    'name': 'womareg',
                    'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:EPSG::3044' } },
                    'features': [
                        {
                            'type': 'Feature',
                            'properties': {
                                'name': '4102',
                                'nipix': {
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
                            'geometry': { 'type': 'foo', 'geometries': ['bar'] }
                        }
                    ]
                }
            ),
            'Immobilienpreisindex.geojson');

    });

    it('exportNiPixGeoJson (CSV) single works', function () {
        niRuntime.drawPresets[0]['type'] = 'single';
        component.exportNiPixGeoJson(false);
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith(
            '"Kategorie";"Region";"Jahr_Q";"Index";"Kauffälle"\r\n' +
            '"undefined";"foo";"2000_2";"1";"undefined"\r\n' +
            '"undefined";"foo";"2000_3";"42";"undefined"\r\n' +
            '"undefined";"foo";"2000_4";"100";"undefined"',
            'Immobilienpreisindex.csv'
        );
    });

    it('exportNiPixGeoJson (CSV) aggr works', function () {
        niRuntime.drawPresets[0]['type'] = 'aggr';
        component.exportNiPixGeoJson(false);
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith(
            '"Kategorie";"Region";"Jahr_Q";"Index";"Kauffälle"\r\n' +
            '"undefined";"4102";"2000_2";"1";"undefined"\r\n' +
            '"undefined";"4102";"2000_3";"42";"undefined"\r\n' +
            '"undefined";"4102";"2000_4";"100";"undefined"',
            'Immobilienpreisindex.csv'
        );
    });

    it('exportGeoJson selected works', function () {
        niRuntime.state.activeSelection = 99;
        niRuntime.state.selectedMyRegion = 'foo';
        component.exportGeoJSON();
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith(JSON.stringify({ 'features': [] }), 'Wohnungsmarktregionen.geojson');
    });

    it('exportGeoJSON works', function () {
        component.exportGeoJSON();
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith(JSON.stringify({
            'features': [
                { 'type': 'Feature', 'properties': { 'WOMAREGIO': 'Nds_West', 'WOMA_NAME': 'Westliches Niedersachsen', 'WMRE': 2, 'WMRS': 0, 'name': '4102' }, 'geometry': {} }
            ]
        }), 'Wohnungsmarktregionen.geojson');
    });

    it('exportChartImage finish works', function () {
        component.exportChart = true;
        component.chartRenderFinished();
        expect(niRuntime.chart.obj.resize).toHaveBeenCalled();
        expect(niRuntime.chart.obj.setOption).toHaveBeenCalled();
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith('data', 'nipix.png', '', true);
    });

});

/* vim: set expandtab ts=4 sw=4 sts=4: */
