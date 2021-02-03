import { ArtDerBebauungPipe } from './art-der-bebauung.pipe';

describe('Bodenrichtwert.Pipes.ArtDerBebauungPipe', () => {
    let pipe: ArtDerBebauungPipe;

    beforeEach(() => {
        pipe = new ArtDerBebauungPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('1')).toEqual('EFH');
    });

    it('should return undefined when there is no appropriate entry', () => {
        expect(pipe.transform('0')).toEqual(undefined);
    });
});
