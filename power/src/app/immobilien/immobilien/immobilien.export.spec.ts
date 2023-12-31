import * as ImmobilienExport from './immobilien.export';
import * as ImmobilienStatic from './immobilien.static';
import * as ImmobilienRuntime from './immobilien.runtime';
import * as echarts from 'echarts';

import { ImmobilienHelper } from './immobilien.helper';

describe('Immobilien.Immobilien.ImmobilenExport', () => {

    let component: ImmobilienExport.ImmobilienExport;
    let niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
    let niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);

    const prepareNiStatic = function (): void {
        niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
        niStatic.data = {
            'regionen': {
                '4102': {
                    'name': 'foo'
                }
            }
        };
    };

    const prepareNiRuntime = function (): void {
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

    const prepareNiRuntimeChart = function (): void {
        niRuntime.chart = {
            'obj': {
                'convertToPixel': function (par1: any, par2: any) { return 1; },
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
                'getDataURL': function (par1: any) {
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

        echarts.registerMap('NDS', {
            'geoJson': {
                'features': [

                    { 'type': 'Feature', 'properties': { 'WOMAREGIO': 'Nds_West', 'WOMA_NAME': 'Westliches Niedersachsen', 'WMRE': 2, 'WMRS': 0, 'name': '4102' }, 'geometry': {} }

                ]
            },
            'geoJSON': {
            },
            'specialAreas': {
            }
        } as any
        );

        spyOn(ImmobilienHelper, 'downloadFile').and.callFake(
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            (data, filename, filetype = 'text/csv', isurl = false): any => { }
        );

    });


    it('exportAsImage works', () => {
        component.exportAsImage();
        expect(component.exportChart).toEqual(true);
    });

    it('exportNiPixGeoJson returns without object', () => {
        niRuntime.chart.obj = null;
        component.exportNiPixGeoJson();
    });

    it('exportNiPixGeoJson (geoJSON) single works', () => {
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

    it('exportNiPixGeoJson (geoJSON) aggr works', () => {
        niRuntime.drawPresets[0]['type'] = 'aggr';
        spyOn(ImmobilienHelper, 'getGeometryArray').and.callFake(
            (data, features) => ({ 'type': 'foo', 'geometries': ['bar'] })
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

    it('exportNiPixGeoJson (CSV) single works', () => {
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

    it('exportNiPixGeoJson (CSV) aggr works', () => {
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

    it('exportGeoJson selected works', () => {
        niRuntime.state.activeSelection = 99;
        niRuntime.state.selectedMyRegion = 'foo';
        component.exportGeoJSON();
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith(JSON.stringify({ 'features': [null] }), 'Wohnungsmarktregionen.geojson');
    });

    it('exportGeoJSON works', () => {
        component.exportGeoJSON();
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith(JSON.stringify({
            'features': [
                { 'type': 'Feature', 'properties': { 'WOMAREGIO': 'Nds_West', 'WOMA_NAME': 'Westliches Niedersachsen', 'WMRE': 2, 'WMRS': 0, 'name': '4102' }, 'geometry': {} }
            ]
        }), 'Wohnungsmarktregionen.geojson');
    });

    it('exportChartImage finish works', () => {
        component.exportChart = true;
        component.chartRenderFinished();
        expect(niRuntime.chart.obj.resize).toHaveBeenCalled();
        expect(niRuntime.chart.obj.setOption).toHaveBeenCalled();
        expect(ImmobilienHelper.downloadFile).toHaveBeenCalledWith('data', 'nipix.png', '', true);
    });

});

/* vim: set expandtab ts=4 sw=4 sts=4: */
