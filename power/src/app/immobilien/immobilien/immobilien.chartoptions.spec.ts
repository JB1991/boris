import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import * as ImmobilenChartOptions from './immobilien.chartoptions';

describe('Immobilien.Immobilien.ImmobilenChartOptions', () => {

	it('chartRange should return Object', function() {
		let res = ImmobilenChartOptions.chartRange();
		expect(res).not.toBe(undefined);
	});

	it('getMapOptions return Object', function() {
		let res = ImmobilenChartOptions.getMapOptions();
		expect(res).not.toBe(undefined);
	});

	it('getChartOptions return Object', function() {
		let res = ImmobilenChartOptions.getChartOptions();
		expect(res).not.toBe(undefined);
	});

});

/* vim: set expandtab ts=4 sw=4 sts=4: */
