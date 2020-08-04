import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import * as ImmobilenHelper from './immobilien.helper';
import * as ImmobilenUtils from './immobilien.utils';

describe('Immobilien.Immobilien.ImmobilenUtils', () => {

    it('getDateArray works', function() {
        const res = ImmobilenUtils.getDateArray(2000, 2);
        expect(res).toEqual(['2000/2']);
    });

    it('getMyMapRegionen works', function() {
        const res = ImmobilenUtils.getMyMapRegionen({'foo': {}});
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
            }
        }]);
    });

    it('getMyMapRegionen with selected works', function() {
        const res = ImmobilenUtils.getMyMapRegionen({'foo': {}}, 'foo');
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
            }
        }]);
    });

    it('getMyMapRegionen with selectionList works', function() {
        const res = ImmobilenUtils.getMyMapRegionen({'foo': {}}, null, ['foo']);
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
            }
        }]);
    });


    it('getMyMapRegionen with lighten works', function() {
        const res = ImmobilenUtils.getMyMapRegionen({'foo': {'color': '#ffffff'}}, null, null, true);
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
            }
        }]);
    });

    it('generateSeries works', function() {
        const res = ImmobilenUtils.generateSeries('foo', [], '#ffffff', null, '-');
        expect(res).toEqual({
            'name': 'foo',
            'type': 'line',
            'smooth': false,
            'symbol': 'circle',
            'symbolSize': 4,
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
                normal: {
                    show: true,
                    position: 'right',
                    formatter: null
                },
            },
            'data': []
        });
    });

    it('generateSeries with parameters works', function() {
        const res = ImmobilenUtils.generateSeries('foo', [], '#ffffff', 'bar', 'foo', 1, 2, 'bar');
        expect(res).toEqual({
            'name': 'foo',
            'type': 'bar',
            'smooth': false,
            'symbol': 'circle',
            'symbolSize': 4,
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
                'itemStyle': {
                    'color': '#ffffff'
                }
            },
            label: {
                normal: {
                    show: true,
                    position: 'right',
                    formatter: 'bar'
                },
            },
            'data': []
        });
    });

    it('generateDrawSeriesData empty works', function() {
        const data = {'2000_1': {'value': 1}, '2000_2': {'value': '1.0'}};
        const res = ImmobilenUtils.generateDrawSeriesData(data);
        expect(res).toEqual([]);
    });

    it('generateDrawSeriesData works', function() {
        const data = {'2000_1': {'value': 1}, '2000_2': {'value': '1.0'}};
        const date = ['2000/1', '2000/2'];
        const res = ImmobilenUtils.generateDrawSeriesData(data, date, 'value', 80);
        expect(res).toEqual([21, 21]);
    });

    it('generateDrawSeriesData empty field works', function() {
        const data = [1, '1.0'];
        const date = ['2000/1', '2000/2'];
        const res = ImmobilenUtils.generateDrawSeriesData(data, date);
        expect(res).toEqual([1, 1]);
    });

    it('generateDrawSeriesData with no data works', function() {
        const data = {};
        const date = ['2000/1', '2000/2'];
        const res = ImmobilenUtils.generateDrawSeriesData(data, date, 'value', 80);
        expect(res).toEqual([undefined, undefined]);
    });

    it('generateTextElement works', function() {

        spyOn(window, 'getComputedStyle').and.callFake(
            function(elt: Element, pseudoElt?: string) {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );

        const res = ImmobilenUtils.generateTextElement('foo');
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

    it('generateTextElement with parameter works', function() {

        spyOn(window, 'getComputedStyle').and.callFake(
            function(elt: Element, pseudoElt?: string) {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );

        const res = ImmobilenUtils.generateTextElement('foo', '#aabbcc', 1, 1, 1);
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

    it('generateDotElement works', function() {

        spyOn(window, 'getComputedStyle').and.callFake(
            function(elt: Element, pseudoElt?: string) {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );

        const res = ImmobilenUtils.generateDotElement();
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

    it('generateDotElement with parameter works', function() {

        spyOn(window, 'getComputedStyle').and.callFake(
            function(elt: Element, pseudoElt?: string) {
                const val = Object.create(CSSStyleDeclaration.prototype);
                val.fontSize = '1';
                return val;
            }
        );

        const res = ImmobilenUtils.generateDotElement(1, '#aabbcc', 1, 1, 1, '#ff0000', 1);
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
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
