import { NutzungPipe } from './nutzung.pipe';

describe('Bodenrichtwert.Pipes.NutzungPipe', () => {
    let pipe: NutzungPipe;

    beforeEach(() => {
        pipe = new NutzungPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform([{'nutz': 'W', 'enuta': ['EFH']}]))
            .toEqual('Wohnbaufläche (Ein- und Zweifamilienhäuser)');
    });

    it('should return undefined when there is no appropriate entry', () => {
        expect(pipe.transform([{'nutz': '0', 'enuta': []}]))
            .toEqual('undefined');
    });
});
/* vim: set expandtab ts=4 sw=4 sts=4: */
