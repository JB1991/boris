import * as ImmobilienStatic from './immobilien.static';
import * as ImmobilienRuntime from './immobilien.runtime';
import { ImmobilienUtils } from './immobilien.utils';
import * as ImmobilienRuntimeCalculator from './immobilien.runtime-calculator';

describe('Immobilien.Immobilien.ImmobilienRuntimeCalculator', () => {

    let component: ImmobilienRuntimeCalculator.NipixRuntimeCalculator;
    let niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
    let niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);

    const niStaticData = {
        'regionen': {
            '4102': {
                'name': 'bar',
                'short': 'ba',
                'color': '#abcdef'
            },
            '4103': {
                'name': 'barr',
                'short': 'br',
                'color': '#fedcba'
            },
            'dd': {
                'name': 'dd',
                'short': 'dd'
            },
            'draw': {
                'name': 'draw',
                'short': 'draw'
            }
        },
        'shortNames': {
            'shortName': 'short'
        },
        'selections': {
            'single': {
                'type': 'single'
            },
            'multi': {
                'type': 'multi',
                'preset': ['foo']
            },
            'multiIndex': {
                'type': 'multiIndex'
            },
            'multiSelect': {
                'type': 'multiSelect',
                'preset': ['foo']
            }
        },
        'allItems': [
            '4102', '4103', '4104'
        ],
        'nipix': {
            'foobar': {
                '4102': {
                    '2000_2': { 'index': 1, 'faelle': 1 },
                    '2000_3': { 'index': '42', 'faelle': 42 },
                    '2000_4': { 'index': 100, 'faelle': 100 }
                },
                '4104': {
                    '2000_2': { 'index': 100, 'faelle': 100 },
                    '2000_3': { 'index': 42, 'faelle': 42 },
                    '2000_4': { 'index': 1, 'faelle': 1 }
                }
            }
        },
        'referenceDate': '2000_2'
    };

    const niRuntimeCalculated = {
        'legendText': {
            'bar': 'foo'
        },
        'hiddenData': {
            'foo': [100]
        },
        'drawData': [
            {
                'data': [],
                'name': 'dd'
            },
            {
                'data': [0],
                'name': 'draw'
            }
        ]
    };


    beforeEach(() => {
        niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
        niStatic.data = JSON.parse(JSON.stringify(niStaticData));
        niStatic.referenceDate = '';
        niStatic.textOptions = {
            'fontSizePage': 1
        };

        niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);
        niRuntime.state = {
            'rangeEndIndex': 10,
            'selectedChartLine': '',
            'activeSelection': 'na'
        };
        niRuntime.calculated = JSON.parse(JSON.stringify(niRuntimeCalculated));
        niRuntime.highlightSeries = function (seriesName: any) { };
        niRuntime.chart = {
            'obj': {
                'convertToPixel': function (par1: any, par2: any) { return 1; }
            }
        };

        niRuntime.formatter = {
            'formatLabel': function () { }
        };

        niRuntime.getDrawPreset = function (name: any) {
            return {
                'show': true,
                'values': ['foo'],
                'colors': '#aabbcc'
            };
        };

        niRuntime.drawPresets = [
            {
                'show': true,
                'name': '4102',
                'type': 'single',
                'nipixCategory': 'foobar',
                'values': ['4102', '4103']
            },
            {
                'show': true,
                'name': 'fooaggr',
                'type': 'aggr',
                'nipixCategory': 'foobar',
                'values': ['4102', '4104']
            }
        ];

        niRuntime.availableQuartal = ['2000/2', '2000/3', '2000/4'];

        component = new ImmobilienRuntimeCalculator.NipixRuntimeCalculator(niStatic, niRuntime);

        spyOn(ImmobilienUtils, 'generateSeries').and.callFake(
            function (
                name,
                data,
                color,
                labelFormatter = null,
                selectedChartLine = '',
                xIndex = 0,
                yIndex = 0,
                seriesType = 'line'
            ) {
                return name as any;
            }
        );

    });

    it('RuntimeCalculator works', function () {
        component.calculateDrawData();
        expect(niRuntime.calculated.drawData).toEqual(['4102', '4103', 'fooaggr']);
    });


});

/* vim: set expandtab ts=4 sw=4 sts=4: */
