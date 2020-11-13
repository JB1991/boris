import { BodenartPipe } from './bodenart.pipe';

describe('BodenartPipe', () => {
    let pipe: BodenartPipe;

    beforeEach(() => {
        pipe = new BodenartPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('S')).toEqual('Sand');
    });

    it('should return undefined when there is no appropriate entry', () => {
        expect(pipe.transform('0')).toEqual(undefined);
    });
});
