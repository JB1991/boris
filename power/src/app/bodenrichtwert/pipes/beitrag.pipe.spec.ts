import { BeitragPipe } from './beitrag.pipe';

describe('Bodenrichtwert.Pipes.BeitragPipe', () => {
    let pipe: BeitragPipe;

    beforeEach(() => {
        pipe = new BeitragPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('1')).toEqual('Erschließungsbeitrags- und kostenerstattungsbetragsfrei');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
