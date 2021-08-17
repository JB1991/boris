import { BauweisePipe } from './bauweise.pipe';

describe('BauweisePipe', () => {
    let pipe: BauweisePipe;

    beforeEach(() => {
        pipe = new BauweisePipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('a')).toEqual('abweichende Bauweise');
    });
});
