/* eslint-disable @typescript-eslint/no-empty-function */
import * as ImmobilienStatic from './immobilien.static';
import * as ImmobilienRuntime from './immobilien.runtime';

import { ImmobilienUtils } from './immobilien.utils';

describe('Immobilien.Immobilien.ImmobilenRuntime', () => {

    let component: ImmobilienRuntime.NipixRuntime;
    let niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);

    const presets = [
        {
            'show': true,
            'name': 'foo',
            'nipixCategory': 'gebrauchte Eigenheime',
            'values': ['4102']
        },
        {
            'show': false,
            'values': []
        }
    ];

    beforeEach(() => {
        niStatic = Object.create(ImmobilienStatic.NipixStatic.prototype);
        niStatic.data = {
            'presets': presets,
            'nipix': {
                'gebrauchte Eigenheime': [],
                'gebrauchte Eigentumswohnungen': []
            },
            'regionen': {
                '4201': {
                    'name': 'foo'
                }
            }

        };
        component = new ImmobilienRuntime.NipixRuntime(niStatic);

    });

    it('resetDrawPresets works', function () {
        component.resetDrawPresets();
        expect(component.drawPresets).toEqual(presets);
    });

    it('updateAvailableQuartal works', function () {
        component.updateAvailableQuartal(2000, 3);
        expect(component.availableQuartal).toEqual(['2000/2', '2000/3']);
    });

    it('updateAvailableNipixCategories works', function () {
        component.updateAvailableNipixCategories();
        expect(component.availableNipixCategories).toEqual(['gebrauchte Eigenheime', 'gebrauchte Eigentumswohnungen']);
    });

    it('toggleNipixCategory works', function () {
        component.resetDrawPresets();

        component.toggleNipixCategory('foo');
        expect(component.drawPresets[0]['nipixCategory']).toEqual('gebrauchte Eigentumswohnungen');
        component.toggleNipixCategory('foo');
        expect(component.drawPresets[0]['nipixCategory']).toEqual('gebrauchte Eigenheime');
    });

    it('getDrawPreset works', function () {
        const res = component.getDrawPreset('bar');
        expect(res).toEqual({});
        component.resetDrawPresets();
        const res1 = component.getDrawPreset('foo');
        expect(res1).toEqual(
            {
                'show': true,
                'name': 'foo',
                'nipixCategory': 'gebrauchte Eigenheime',
                'values': ['4102']
            }
        );
    });

    it('highlightTimeout works', () => {
        component.state.highlightedSeries = 'foo';
        spyOn(component, 'updateMapSelect').and.callFake(function () { });

        component.highlightTimeout();
        expect(component.state.highlightedSeries).toEqual('');
        expect(component.updateMapSelect).toHaveBeenCalled();

    });

    it('resetHighlight works', function () {
        spyOn(window, 'clearTimeout').and.callThrough();
        spyOn(component, 'updateMapSelect').and.callThrough();
        component.resetHighlight();
        expect(clearTimeout).toHaveBeenCalled();
        expect(component.updateMapSelect).toHaveBeenCalled();
        expect(component.state.highlightedSeries).toEqual('');
    });

    it('highlightSeries works', function () {
        component.resetDrawPresets();

        component.state.highlightedSeries = 'foo';
        component.highlightSeries('foo');

        spyOn(ImmobilienUtils, 'dispatchMapSelect').and.callFake(
            function (mapobj, key, select) {
            }
        );
        spyOn(window, 'clearTimeout').and.callThrough();
        spyOn(window, 'setTimeout').and.callThrough();

        component.state.highlightedSeries = 'bar';
        component.highlightSeries('foo');
        expect(clearTimeout).toHaveBeenCalled();
        expect(setTimeout).toHaveBeenCalled();
        expect(component.state.highlightedSeries).toEqual('foo');
        expect(ImmobilienUtils.dispatchMapSelect).toHaveBeenCalled();
    });

    it('calculateDrawData works', function () {
        spyOn(component.calculator, 'calculateDrawData').and.callFake(function () { });
        component.calculateDrawData();
        expect(component.calculator.calculateDrawData).toHaveBeenCalled();
    });


    it('updateRange works', function () {
        component.updateAvailableQuartal(2000, 4);

        component.updateRange(100 / 3 * 2, 100);
        expect(component.state.rangeStartIndex).toEqual(1);
        expect(niStatic.referenceDate).toEqual('2000_3');
        expect(component.state.rangeEndIndex).toEqual(2);

        component.updateRange(100 / 3 * 2, 100);
    });

    it('updateMapSelect works', function () {
        component.resetDrawPresets();

        component.map.obj = {};
        component.state.activeSelection = 99;
        niStatic.data.regionen = { '4201': {} };
        spyOn(ImmobilienUtils, 'dispatchMapSelect').and.callFake(
            function (mapobj, key, select) { }
        );

        component.updateMapSelect('1');
        expect(ImmobilienUtils.dispatchMapSelect).toHaveBeenCalled();

        component.state.activeSelection = 1;
        niStatic.data['selections'] = { 1: { 'type': 'single', 'preset': ['foo'] } };

        component.updateMapSelect();
        expect(ImmobilienUtils.dispatchMapSelect).toHaveBeenCalled();

        niStatic.data['selections'] = { 1: { 'type': 'aggr', 'preset': ['foo'] } };

        component.updateMapSelect();
        expect(ImmobilienUtils.dispatchMapSelect).toHaveBeenCalled();

    });

});

/* vim: set expandtab ts=4 sw=4 sts=4: */
