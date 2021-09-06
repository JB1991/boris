import { ImmobilienUtils } from './immobilien.utils';

/* eslint-disable max-lines */
describe('Immobilien.Immobilien.ImmobilienUtils', () => {

    it('getDateArray works', () => {
        const res = ImmobilienUtils.getDateArray(2000, 2);
        expect(res).toEqual(['2000/2']);
    });

    it('getMyMapRegionen works', () => {
        const res = ImmobilienUtils.getMyMapRegionen({ 'foo': {} });
        expect(res).toEqual([{
            'name': 'foo',
            'itemStyle': {
                'areaColor': '#dddddd',
                'borderColor': '#333333',
                'borderWidth': 1
            },
            'emphasis': {
                'itemStyle': {
                    'areaColor': '#000000',
                    'borderColor': '#333333',
                    'borderWidth': 1
                }
            },
            'select': {
                'itemStyle': {
                    'areaColor': '#000000'
                }
            }
        }]);
    });

    it('getMyMapRegionen with selected works', () => {
        const res = ImmobilienUtils.getMyMapRegionen({ 'foo': {} }, 'foo');
        expect(res).toEqual([{
            'name': 'foo',
            'itemStyle': {
                'areaColor': '#dddddd',
                'borderColor': '#ffffff',
                'borderWidth': 4
            },
            'emphasis': {
                'itemStyle': {
                    'areaColor': '#000000',
                    'borderColor': '#ffffff',
                    'borderWidth': 4
                }
            },
            'select': {
                'itemStyle': {
                    'areaColor': '#000000'
                }
            }
        }]);
    });

    it('getMyMapRegionen with selectionList works', () => {
        const res = ImmobilienUtils.getMyMapRegionen({ 'foo': {} }, null, ['foo']);
        expect(res).toEqual([{
            'name': 'foo',
            'selected': true,
            'itemStyle': {
                'areaColor': '#dddddd',
                'borderColor': '#333333',
                'borderWidth': 1
            },
            'emphasis': {
                'itemStyle': {
                    'areaColor': '#000000',
                    'borderColor': '#333333',
                    'borderWidth': 1
                }
            },
            'select': {
                'itemStyle': {
                    'areaColor': '#000000'
                }
            }
        }]);
    });


    it('getMyMapRegionen with lighten works', () => {
        const res = ImmobilienUtils.getMyMapRegionen({ 'foo': { 'color': '#ffffff' } }, null, null, true);
        expect(res).toEqual([{
            'name': 'foo',
            'itemStyle': {
                'areaColor': '#ffffff',
                'borderColor': '#333333',
                'borderWidth': 1
            },
            'emphasis': {
                'itemStyle': {
                    'areaColor': '#ffffff',
                    'borderColor': '#333333',
                    'borderWidth': 1
                }
            },
            'select': {
                'itemStyle': {
                    'areaColor': '#ffffff'
                }
            }
        }]);
    });

    it('generateSeries works', () => {
        const res = ImmobilienUtils.generateSeries('foo', [], '#ffffff', null, '-');
        expect(res).toEqual({
            'name': 'foo',
            'type': 'line',
            'smooth': false,
            'symbol': 'circle',
            'symbolSize': 4,
            'showAllSymbol': true,
            'sampling': 'average',
            'zlevel': 0,
            'itemStyle': {
                'color': '#ffffff',
                'borderWidth': 16,
                'borderColor': 'rgba(255,255,255,0)'
            },
            'emphasis': {
                'itemStyle': {
                    'color': '#ffffff'
                }
            },
            label: {
                show: true,
                position: 'right',
                formatter: null
            },
            'data': []
        });
    });

    it('generateSeries with parameters works', () => {
        const res = ImmobilienUtils.generateSeries('foo', [], '#ffffff', 'bar', 'foo', 1, 2, 'bar');
        expect(res).toEqual({
            'name': 'foo',
            'type': 'bar',
            'smooth': false,
            'symbol': 'circle',
            'symbolSize': 4,
            'showAllSymbol': true,
            'sampling': 'average',
            'zlevel': 1,
            'xAxisIndex': 1,
            'yAxisIndex': 2,
            'itemStyle': {
                'color': '#ffffff',
                'borderWidth': 16,
                'borderColor': 'rgba(255,255,255,0)'
            },
            'emphasis': {
                'itemStyle': { 'color': '#ffffff' }
            },
            label: {
                show: true,
                position: 'right',
                formatter: 'bar'
            },
            'data': []
        } as any);
    });

    it('generateDrawSeriesData empty works', () => {
        const data = { '2000_1': { 'value': 1 }, '2000_2': { 'value': '1.0' } };
        const res = ImmobilienUtils.generateDrawSeriesData(data);
        expect(res).toEqual([]);
    });

    it('generateDrawSeriesData works', () => {
        const data = { '2000_1': { 'value': 1 }, '2000_2': { 'value': '1.0' } };
        const date = ['2000/1', '2000/2'];
        const res = ImmobilienUtils.generateDrawSeriesData(data, date, 'value', 80);
        expect(res).toEqual([21, 21]);
    });

    it('generateDrawSeriesData empty field works', () => {
        const data = [1, '1.0'];
        const date = ['2000/1', '2000/2'];
        const res = ImmobilienUtils.generateDrawSeriesData(data, date);
        expect(res).toEqual([1, 1]);
    });

    it('generateDrawSeriesData with no data works', () => {
        const data = {};
        const date = ['2000/1', '2000/2'];
        const res = ImmobilienUtils.generateDrawSeriesData(data, date, 'value', 80);
        expect(res).toEqual([undefined, undefined]);
    });

    it('generateTextElement works', () => {
        spyOn(window, 'getComputedStyle').and.callFake(
            (elt: Element, pseudoElt?: string | null | undefined): CSSStyleDeclaration => {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );
        const res = ImmobilienUtils.generateTextElement('foo');
        expect(res).toEqual({
            type: 'text',
            top: 0,
            left: undefined,
            style: {
                fill: '#000',
                textAlign: 'left',
                fontSize: 1.2,
                text: 'foo'
            }
        });
    });

    it('generateTextElement with parameter works', () => {
        spyOn(window, 'getComputedStyle').and.callFake(
            (elt: Element, pseudoElt?: string | null | undefined): CSSStyleDeclaration => {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );
        const res = ImmobilienUtils.generateTextElement('foo', '#aabbcc', 1, 1, 1);
        expect(res).toEqual({
            type: 'text',
            top: 1.5,
            left: 1,
            style: {
                fill: '#aabbcc',
                textAlign: 'left',
                fontSize: 1,
                text: 'foo'
            }
        });
    });

    it('generateDotElement works', () => {
        spyOn(window, 'getComputedStyle').and.callFake(
            (elt: Element, pseudoElt?: string | null | undefined): CSSStyleDeclaration => {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );
        const res = ImmobilienUtils.generateDotElement();
        expect(res).toEqual({
            type: 'circle',
            cursor: 'normal',
            shape: {
                cx: -8,
                cy: 0.6,
                r: 4
            },
            style: {
                fill: '#fff',
                stroke: '#000',
                lineWidth: 0
            }
        });
    });

    it('generateDotElement with parameter works', () => {
        spyOn(window, 'getComputedStyle').and.callFake(
            (elt: Element, pseudoElt?: string | null | undefined): CSSStyleDeclaration => {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );
        const res = ImmobilienUtils.generateDotElement(1, '#aabbcc', 1, 1, 1, '#ff0000', 1);
        expect(res).toEqual({
            type: 'circle',
            cursor: 'normal',
            shape: {
                cx: -2 + 4,
                cy: 2,
                r: 1
            },
            style: {
                fill: '#aabbcc',
                stroke: '#ff0000',
                lineWidth: 1
            }
        });
    });

    it('nodifyRegionen works', () => {
        const regionen = {
            'foo': {
                'color': '#000000'
            }
        };
        const modifyArray = [
            {
                'values': ['foo'],
                'colors': '#ff0000'
            }
        ];
        const res = ImmobilienUtils.modifyRegionen(regionen, modifyArray);
        expect(res).toEqual({
            'foo': {
                'color': '#ff0000'
            }
        });
    });

    it('dispatchMapSelect works', () => {
        const obj = {
            'dispatchAction': jasmine.createSpy()
        };

        ImmobilienUtils.dispatchMapSelect(obj, 'foo', true);
        expect(obj.dispatchAction).toHaveBeenCalledWith({
            type: 'select',
            name: 'foo'
        });

        ImmobilienUtils.dispatchMapSelect(obj, 'foo', false);
        expect(obj.dispatchAction).toHaveBeenCalledWith({
            type: 'unselect',
            name: 'foo'
        });

    });

});

/* vim: set expandtab ts=4 sw=4 sts=4: */
