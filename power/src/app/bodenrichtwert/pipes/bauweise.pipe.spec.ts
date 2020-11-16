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

    it('should return undefined when there is no appropriate entry', () => {
        expect(pipe.transform('0')).toEqual(undefined);
    });
});
