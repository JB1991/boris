import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BodenrichtwertKarteService } from './bodenrichtwert-karte.service';

describe('BodenrichtwertKarteService', () => {
    let service: BodenrichtwertKarteService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BodenrichtwertKarteService
            ],
            imports: [
                HttpClientTestingModule
            ]
        });
        service = TestBed.inject(BodenrichtwertKarteService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should getScreenshot', () => {
        service.map = {
            getCanvas: jasmine.createSpy().and.returnValue({ toDataURL: jasmine.createSpy().and.returnValue('ABC') })
        } as any;
        expect(service.getScreenshot()).toEqual('ABC');
    });

    it('should not getScreenshot', () => {
        service.map = undefined;
        expect(service.getScreenshot()).toEqual('');
    });

    it('should get Map Width/Height', () => {
        service.map = {
            getCanvas: jasmine.createSpy().and.returnValue({ height: 250, width: 300 })
        } as any;
        expect(service.getMapWidth()).toEqual(300);
        expect(service.getMapHeight()).toEqual(250);
    });

    it('should not get Map Width/Height', () => {
        service.map = undefined;
        expect(service.getMapWidth()).toEqual(0);
        expect(service.getMapHeight()).toEqual(0);
    });

    it('should zoomToSelection', () => {
        service.map = {
            jumpTo: jasmine.createSpy(),
            getZoom: jasmine.createSpy().and.returnValue(10)
        } as any;
        service.marker = {
            getLngLat: jasmine.createSpy().and.returnValue({ lng: 50, lat: 5 } as any)
        } as any;
        service.zoomToSelection();
        expect(service.map?.jumpTo).toHaveBeenCalledTimes(1);
        expect(service.map?.jumpTo).toHaveBeenCalledWith({
            center: [50, 5],
            zoom: 10
        });
    });

    it('should not zoomToSelection', () => {
        service.map = {
            jumpTo: jasmine.createSpy(),
            getZoom: jasmine.createSpy().and.returnValue(10)
        } as any;
        service.marker = {
            getLngLat: jasmine.createSpy().and.returnValue(undefined as any)
        } as any;
        service.zoomToSelection();
        expect(service.map?.jumpTo).toHaveBeenCalledTimes(0);
    });
});
