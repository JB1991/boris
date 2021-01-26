import * as ImmobilienFormatter from './immobilien.formatter';
import * as ImmobilienStatic from './immobilien.static';
import * as ImmobilienRuntime from './immobilien.runtime';
import { ImmobilienUtils } from './immobilien.utils';

describe('Immobilien.Immobilien.ImmobilienFormatter', () => {

    let component: ImmobilienFormatter.ImmobilienFormatter;
    let niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
    let niRuntime = Object.create(ImmobilienRuntime.NipixRuntime.prototype);

    const niStaticData = {
        'regionen': {
            'foo': {
                'name': 'bar',
                'short': 'ba',
                'color': '#abcdef'
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
        'allItems': ['foo']
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
        niRuntime.highlightSeries = function (seriesName) { };
        niRuntime.chart = {
            'obj': {
                'convertToPixel': function (par1, par2) { return 1; }
            }
        };

        niRuntime.getDrawPreset = function (name) {
            return {
                'show': true,
                'values': ['foo'],
                'colors': '#aabbcc'
            };
        };

        niRuntime.translate = function (id) { return id; };

        component = new ImmobilienFormatter.ImmobilienFormatter(niStatic, niRuntime);

        spyOn(ImmobilienUtils, 'generateTextElement').and.callFake(
            function (name, color = '#000', fontSizeBase = 1.2, position = 0, posX?) {
                return name;
            }
        );

        spyOn(ImmobilienUtils, 'generateDotElement').and.callFake(
            function (radius = 4, color = '#fff', fontSizeBase = 1.2, position = 0,
                posX = 0, bordercolor = '#000', border = 0): any {
                return 'dot';
            }
        );

    });


    it('mapTooltipFormatter should return params.name', function () {
        const ths = { myRegionen: {} };
        const res = component.mapTooltipFormatter({ 'name': 'test' });
        expect(res).toEqual('test');
    });

    it('mapTooltipFormatter should return myregionname', function () {
        const res = component.mapTooltipFormatter({ 'name': 'foo' });
        expect(res).toEqual('bar');

    });

    it('chartTooltipFormatter should return name', function () {

        const res = component.chartTooltipFormatter(
            {
                'seriesName': 'blub',
                'name': 'foo',
                'marker': '',
                'data': 100
            },
            null,
            null
        );

        expect(res).toEqual('<b>blub</b><br>Preisentwicklung seit : 0%<br>Zugrunde liegende Fälle (foo): 0');
    });

    it('chartTooltipFormatter should return region', function () {
        const res = component.chartTooltipFormatter({ 'seriesName': 'foo', 'name': 'foo', 'marker': '', 'data': 200, 'dataIndex': 0 }, null, null);
        expect(res).toEqual('<b>bar</b><br>Preisentwicklung seit : +100%<br>Zugrunde liegende Fälle (foo): 100');
    });


    it('formatLabel should return empty string if not rangeEnd', function () {
        const res = component.formatLabel({ 'dataIndex': 1 });
        expect(res).toEqual('');
    });

    it('formatLabel should not return seriesName', function () {
        const res = component.formatLabel({ 'dataIndex': 10, seriesIndex: 0, 'seriesName': 'blub' });
        expect(res).toEqual('blub');
    });

    it('formatLabel should not return empty string if no space for legend', function () {
        component.formatLabel({ 'dataIndex': 10, seriesIndex: 0, 'seriesName': 'blub' });
        const res = component.formatLabel({ 'dataIndex': 10, seriesIndex: 2, 'seriesName': 'blub' });
        expect(res).toEqual('');
    });

    it('formatLabel should not return region name short', function () {
        const res = component.formatLabel({ 'dataIndex': 10, seriesIndex: 0, 'seriesName': 'foo' });
        expect(res).toEqual('ba');
    });

    it('formatLabel should not return short name', function () {
        const res = component.formatLabel({ 'dataIndex': 10, seriesIndex: 0, 'seriesName': 'shortName' });
        expect(res).toEqual('short');
    });

    it('formatLabel should return empty string if selected', function () {
        niRuntime.state.selectedChartLine = 'sel';
        const res = component.formatLabel({ 'dataIndex': 10, seriesIndex: 0, 'seriesName': 'sel' });
        expect(res).toEqual('');
    });

    it('formatLegend should return name', function () {
        const res = component.formatLegend('blub');
        expect(res).toEqual('blub');
    });

    it('formatLegend should return region name', function () {
        const res = component.formatLegend('foo');
        expect(res).toEqual('ba');
    });

    it('formatLegend should return short name', function () {
        const res = component.formatLegend('shortName');
        expect(res).toEqual('short');
    });

    /*it('formatLegend should return legend text', function () {
        const res = component.formatLegend('bar');
        expect(res).toEqual('foo');
    });*/

    it('getSeriesLabel work', function () {
        const res = component.getSeriesLabel('foo');
        expect(res).toEqual('bar (ba)');
    });

    it('getSeriesColor', function () {
        const res = component.getSeriesColor('foo');
        expect(res).toEqual('#abcdef');
    });

    it('simpleLEgend work', function () {
        const res = component.simpleLegend();
        expect(res).toEqual(['dd (ohne Daten)', 'draw']);
    });

    it('grapicLegend undefined work', function () {
        const res = component.graphicLegend();
        expect(res).toEqual([]);
    });

    it('graphicLegend Single work', function () {
        niRuntime.state.activeSelection = 'single';
        const res = component.graphicLegend();
        expect(res).toEqual(['[ohne Daten] dd (dd)', 'dot', 'draw (draw)', 'dot']);
    });

    it('graphicLegend Multi work', function () {
        niRuntime.state.activeSelection = 'multi';
        const res = component.graphicLegend();
        expect(res).toEqual(['foo (undefined)', 'dot']);
    });

    it('graphicLegend MultiSelect work', function () {
        niRuntime.state.activeSelection = 'multiSelect';
        const res = component.graphicLegend();
        expect(res).toEqual(['dot', 'bar (ba)']);
    });




});

/* vim: set expandtab ts=4 sw=4 sts=4: */
