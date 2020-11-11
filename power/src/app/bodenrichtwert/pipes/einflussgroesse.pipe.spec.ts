import { EinflussgroessePipe } from './einflussgroesse.pipe';

describe('Bodenrichtwert.Pipes.EinflussgroessePipe', () => {
    let pipe: EinflussgroessePipe;

    beforeEach(() => {
        pipe = new EinflussgroessePipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform "BAUW" to "Bauweise"', () => {
        expect(pipe.transform('BAUW')).toEqual('Bauweise');
    });

    it('should do nothing if the string is empty', () => {
        expect(pipe.transform('')).toEqual('');
    });

    it('should do nothing if the string is null', () => {
        expect(pipe.transform(null)).toEqual(null);
    });
});
