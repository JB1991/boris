import { Marker } from 'mapbox-gl';
import BodenrichtwertKartePitchControl from './bodenrichtwert-karte-pitch-control';

describe('BodenrichtwertKartePitchControl', () => {

    const marker: Marker = new Marker();

    it('should create an instance', () => {
        expect(new BodenrichtwertKartePitchControl(marker)).toBeTruthy();
    });
});
