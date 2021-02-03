import { NutzungBremenPipe } from './nutzung-bremen.pipe';

describe('NutzungBremenPipe', () => {
    let pipe: NutzungBremenPipe;

    beforeEach(() => {
        pipe = new NutzungBremenPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform([{ 'enuta': ['G2'] }]))
            .toEqual('Büro, hochw. Dienste usw.');
    });

    it('should return nothing when there is no appropriate entry', () => {
        expect(pipe.transform([{'nutz': '0', 'enuta': []}]))
            .toEqual('');
    });
});

/* vim: set expandtab ts=4 sw=4 sts=4: */
