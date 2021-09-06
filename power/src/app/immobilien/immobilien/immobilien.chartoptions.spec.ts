import { ImmobilienChartOptions } from './immobilien.chartoptions';

describe('Immobilien.Immobilien.ImmobilienChartOptions', () => {

    it('chartRange should return Object', function () {
        const res = ImmobilienChartOptions.chartRange();
        expect(res).not.toBe(undefined);
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
