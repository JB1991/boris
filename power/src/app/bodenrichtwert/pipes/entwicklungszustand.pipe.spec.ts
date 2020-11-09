import { EntwicklungszustandPipe } from './entwicklungszustand.pipe';

describe('EntwicklungszustandPipe', () => {
    let pipe: EntwicklungszustandPipe;

    beforeEach(() => {
        pipe = new EntwicklungszustandPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('B')).toEqual('Baureifes Land');
    });

    it('should return undefined when there is no appropriate entry', () => {
        expect(pipe.transform('NULL')).toEqual(undefined);
    });
});
