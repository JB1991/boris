import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import { ImmobilienChartOptions } from './immobilien.chartoptions';

describe('Immobilien.Immobilien.ImmobilienChartOptions', () => {

    it('chartRange should return Object', function() {
        const res = ImmobilienChartOptions.chartRange();
        expect(res).not.toBe(undefined);
    });

    it('getMapOptions return Object', function() {
        const res = ImmobilienChartOptions.getMapOptions();
        expect(res).not.toBe(undefined);
    });

    it('getChartOptions return Object', function() {
        const res = ImmobilienChartOptions.getChartOptions();
        expect(res).not.toBe(undefined);
    });

    it('getChartOptionsMerge return Object', function() {
        const res = ImmobilienChartOptions.getChartOptionsMerge();
        expect(res).not.toBe(undefined);
    });

});

/* vim: set expandtab ts=4 sw=4 sts=4: */
