import { UmlautCorrectionPipe } from './umlaut-correction.pipe';

describe('Bodenrichtwert.Pipes.UmlautCorrectionPipe', () => {
    let pipe: UmlautCorrectionPipe;

    beforeEach(() => {
        pipe = new UmlautCorrectionPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should transform "Buero, hochw. Dienste" to Büro, "hochw. Dienste"', () => {
        expect(pipe.transform('Buero, hochw. Dienste')).toEqual('Büro, hochw. Dienste');
    });

    it('should transform "Verbrauchermaerkte" to "Verbrauchermärkte"', () => {
        expect(pipe.transform('Verbrauchermaerkte')).toEqual('Verbrauchermärkte');
    });

    it('should fix Umlaute', () => {
        expect(pipe.transform('Check dat Ã¤ÃŸ')).toEqual('Check dat äß');
    });

    it('should do nothing if the string is empty', () => {
        expect(pipe.transform('')).toEqual('');
    });
});
