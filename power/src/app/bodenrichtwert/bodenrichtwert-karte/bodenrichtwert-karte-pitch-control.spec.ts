import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Map, Marker } from 'mapbox-gl';
import { BodenrichtwertKarteComponent } from './bodenrichtwert-karte.component';
import BodenrichtwertKartePitchControl from './bodenrichtwert-karte-pitch-control';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

describe('BodenrichtwertKartePitchControl', () => {

    const marker: Marker = new Marker();
    const component: BodenrichtwertKartePitchControl = new BodenrichtwertKartePitchControl(marker);
    let componentMap: BodenrichtwertKarteComponent;
    let fixture: ComponentFixture<BodenrichtwertKarteComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [BodenrichtwertKarteComponent],
            imports: [
                NgxMapboxGLModule,
            ], providers: [
                HTMLButtonElement,
                HTMLDivElement
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BodenrichtwertKarteComponent);
        componentMap = fixture.componentInstance;
        const map = new Map({
            container: 'map',
        });
        componentMap.map = map;
        componentMap.map.addSource('openmaptiles', {
            'type': 'geojson',
            'data': {
                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [52.40729, 9.80205]
                },
                'properties': {
                    'title': 'geojson',
                    'marker-symbol': 'monument'
                }
            }
        });
        componentMap.map.addLayer({ id: 'building-extrusion', type: 'fill-extrusion', source: 'openmaptiles' });
        componentMap.map.setZoom(10);
        component.map = componentMap.map;
    });

    afterEach(() => {
        // Clean up and release all internal resources associated with this map
        componentMap.map.remove();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('should create a BodenrichtwertKarte instance', () => {
        expect(componentMap).toBeTruthy();
    });

    it('onAdd should create a button and icon html element and add these to the map', () => {
        const container = component.onAdd(component.map);
        expect(container.innerHTML).toContain('<button id="3D" class="btn" type="button" title="3D aktivieren/deaktivieren">');
        expect(container.innerHTML).toContain('<i class="bi bi-badge-3d">');

        componentMap.map.addControl(component);
        componentMap.teilmarkt = {
            text: 'Bauland',
            value: ['B', 'SF', 'R', 'E'],
            hexColor: '#c4153a'
        };
        const button = document.getElementById('3D');
        spyOn(component, 'activate3dView');
        spyOn(component, 'deactivate3dView');
        button.click();
        expect(component.deactivate3dView).toHaveBeenCalled();
        component.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
        button.click();
        expect(component.activate3dView).toHaveBeenCalled();
    });

    it('activate3dView should add a building transition layer to the map', () => {
        spyOn(component.map, 'getZoom').and.callThrough();
        spyOn(component.map, 'easeTo');
        spyOn(component.map, 'setPaintProperty');
        component.activate3dView();
        expect(component.map.getZoom).toHaveBeenCalled();
        expect(component.map.easeTo).toHaveBeenCalled();
        expect(component.map.setPaintProperty).toHaveBeenCalled();
        expect(component.currentZoom).toBe(15.1);
    });

    it('deactivate3dView should remove the building extrusion layer from the map', () => {
        spyOn(component.map, 'easeTo');
        spyOn(component.map, 'setPaintProperty');
        component.deactivate3dView();
        expect(component.map.easeTo).toHaveBeenCalled();
        expect(component.map.setPaintProperty).toHaveBeenCalled();
    });

    it('onRemove should remove the html container and the map', () => {
        const container = component.onAdd(componentMap.map);
        const parentNode = document.createElement('div');
        parentNode.appendChild(container);
        component.onRemove();
        expect(component.map).toBeUndefined();
    });
});
