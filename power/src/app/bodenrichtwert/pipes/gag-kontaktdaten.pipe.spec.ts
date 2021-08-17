import { GagKontaktdatenPipe } from './gag-kontaktdaten.pipe';

describe('GagKontaktdatenPipe', () => {

    let pipe: GagKontaktdatenPipe;

    beforeEach(() => {
        pipe = new GagKontaktdatenPipe();
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return the correct value', () => {
        expect(pipe.transform('Gutachterausschuss für Grundstückswerte Lüneburg')).toEqual('https://www.lgln.niedersachsen.de/wir_ueber_uns/kontakte_informationen/rd_lueneburg/geschaeftsstelle_gutachterausschuss/kontaktdaten-der-geschaeftsstelle-103466.html');
    });
});
