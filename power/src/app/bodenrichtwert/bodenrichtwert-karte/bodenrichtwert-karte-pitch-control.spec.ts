import { TestBed, waitForAsync } from '@angular/core/testing';
import { Map, Marker } from 'mapbox-gl';
import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte.component';
import BodenrichtwertKartePitchControl from './bodenrichtwert-karte-pitch-control';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

describe('BodenrichtwertKartePitchControl', () => {

    const marker: Marker = new Marker();
    const component: BodenrichtwertKartePitchControl = new BodenrichtwertKartePitchControl(marker);
    let componentMap: BodenrichtwertKarteComponent;


    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertKarteComponent],
            imports: [
                NgxMapboxGLModule,
            ],providers: [
                HTMLButtonElement,
                HTMLDivElement
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        const fixture = TestBed.createComponent(BodenrichtwertKarteComponent);
        componentMap = fixture.componentInstance;
        const map = new Map({
            container: 'map',
        });
        componentMap.map = map;
        componentMap.map.addSource('openmaptiles', {'type': 'geojson'});
        componentMap.map.addLayer({id: 'building-extrusion', type: 'fill-extrusion', source: 'openmaptiles'});
        componentMap.map.setZoom(11);
        component.map = componentMap.map;
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should create a BodenrichtwertKarte instance', () => {
        expect(componentMap).toBeTruthy();
    });

    it('onAdd should create a button and icon html element and add these to the map', () => {
        spyOn(component.map, 'getPaintProperty');
        component.onAdd(component.map);
    });

    it('activate3dView should add a building transition layer to the map', () => {
        spyOn(component.map, 'getZoom');
        spyOn(component.map, 'easeTo');
        spyOn(component.map, 'setPaintProperty');
        component.activate3dView();
        expect(component.map.getZoom).toHaveBeenCalled();
        expect(component.map.easeTo).toHaveBeenCalled();
        expect(component.map.setPaintProperty).toHaveBeenCalled();
    });

    it('deactivate3dView should remove the building extrusion layer from the map', () => {
        spyOn(component.map, 'easeTo');
        spyOn(component.map, 'setPaintProperty');
        component.deactivate3dView();
        expect(component.map.easeTo).toHaveBeenCalled();
        expect(component.map.setPaintProperty).toHaveBeenCalled();
    });

    // it('onRemove should remove the html container and the map', () => {
    //     component.onAdd(componentMap.map);
    //     component.map = componentMap.map;
    //     console.log(componentMap.map);
    //     console.log(component.container.parentNode);
    //     component.onRemove();
    //     expect(component.map).toBeUndefined();
    // });
});
