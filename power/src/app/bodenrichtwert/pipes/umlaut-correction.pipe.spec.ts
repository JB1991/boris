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
        expect(pipe.transform('Buero, hochw. Dienste')).toEqual('Büro, hochw. Dienste');
    });

    it('should transform "Wuelfel" to "Wülfel"', () => {
        expect(pipe.transform('Verbrauchermaerkte')).toEqual('Verbrauchermärkte');
    });

    it('should do nothing if the string is empty', () => {
        expect(pipe.transform('')).toEqual('');
    });
});
