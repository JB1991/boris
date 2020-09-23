import { UmlautCorrectionPipe } from './umlaut-correction.pipe';

describe('Bodenrichtwert.Pipes.UmlautCorrectionPipe', () => {
    let pipe: UmlautCorrectionPipe;

    beforeEach(() => {
        pipe = new UmlautCorrectionPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should do nothing with "Uelzen"', () => {
        expect(pipe.transform('Uelzen')).toEqual('Uelzen');
    });

    it('should transform "Wuelfel" to "Wülfel"', () => {
        expect(pipe.transform('Wuelfel')).toEqual('Wülfel');
    });

    it('should do nothing if the string is empty', () => {
        expect(pipe.transform('')).toEqual('');
    });
});
