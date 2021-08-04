import { GemarkungWfsService } from '@app/shared/advanced-search/flurstueck-search/gemarkung-wfs.service';
import { GemarkungPipe } from './gemarkung.pipe';

describe('GemarkungPipe', () => {
    let pipe: GemarkungPipe;
    let gemarkungService: GemarkungWfsService;

    beforeEach(() => {
        pipe = new GemarkungPipe(gemarkungService);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });
});
