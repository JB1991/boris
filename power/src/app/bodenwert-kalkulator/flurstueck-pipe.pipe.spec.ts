import { FlurstueckPipe } from './flurstueck-pipe.pipe';

describe('BodenwertKalkulator.FlurstueckPipe', () => {
    let pipe: FlurstueckPipe;

    const flurstueck = require('../../assets/boden/bodenwert-samples/flurstueck.json');

    beforeEach(() => {
        pipe = new FlurstueckPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform(flurstueck)).toEqual(144571);
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
