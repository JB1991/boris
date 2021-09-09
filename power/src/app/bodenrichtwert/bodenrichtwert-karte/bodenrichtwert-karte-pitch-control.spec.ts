import { BodenrichtwertKartePitchControl } from './bodenrichtwert-karte-pitch-control';
import { Map, Marker } from 'maplibre-gl';

describe('GrundsteuerviewerKartePitchControl', () => {
    let pitchControl: BodenrichtwertKartePitchControl;
    let marker: Marker;
    let map: Map;
    let mapContainer: HTMLElement | null;
    let document: Document;

    beforeEach(() => {
        document = new Document().implementation.createHTMLDocument();
        document.body.insertAdjacentHTML('beforeend', '<div id="mapContainer"></div>');
        mapContainer = document.getElementById('mapContainer');
        if (mapContainer === null) {
            return;
        }
        marker = new Marker();
        map = new Map({
            container: mapContainer,
            zoom: 9
        });
        map.addSource('openmaptiles', {
            type: 'geojson',
            data: {
                'type': 'FeatureCollection',
                'features': [{
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [
                            -76.53063297271729,
                            39.18174077994108
                        ]
                    }
                }]
            }
        });

        map.addLayer({ id: 'building-extrusion', type: 'fill-extrusion', source: 'openmaptiles' });
        pitchControl = new BodenrichtwertKartePitchControl(marker);
    });

    it('should create an instance', () => {
        expect(pitchControl).toBeTruthy();
    });

    it('onAdd should create a button and icon html element and add these to the map', () => {
        const container = pitchControl.onAdd(map);
        expect(container.className).toBe('mapboxgl-ctrl mapboxgl-ctrl-group');
        expect(container.hasChildNodes()).toBeTrue();
        expect(container.getElementsByClassName('btn')).toBeInstanceOf(HTMLCollection);
        expect(container.getElementsByClassName('bi')).toBeInstanceOf(HTMLCollection);
    });

    it('activate3dView should add a building transition layer to the map', () => {
        pitchControl.map = map;
        spyOn(pitchControl.map, 'getZoom');
        spyOn(pitchControl.map, 'easeTo');
        spyOn(pitchControl.map, 'setPaintProperty');
        pitchControl.activate3dView();
        expect(pitchControl.map.easeTo).toHaveBeenCalled();
        expect(pitchControl.map.setPaintProperty).toHaveBeenCalled();
        expect(pitchControl.map.getZoom).toHaveBeenCalled();
    });

    it('deactivate3dView should remove the building extrusion layer from the map', () => {
        pitchControl.map = map;
        pitchControl.currentZoom = 15;
        spyOn(pitchControl.map, 'easeTo');
        spyOn(pitchControl.map, 'setPaintProperty');
        pitchControl.deactivate3dView();
        expect(pitchControl.map.easeTo).toHaveBeenCalled();
        expect(pitchControl.map.setPaintProperty).toHaveBeenCalled();
    });

    it('onRemove should remove the html container and the map', () => {
        pitchControl.map = map;
        pitchControl.container = document.createElement('div');
        document.body.append(pitchControl.container);
        if (pitchControl.container.parentNode) {
            spyOn(pitchControl.container.parentNode, 'removeChild');
        }
        pitchControl.onRemove();
        expect(pitchControl.container.parentNode?.removeChild).toHaveBeenCalled();
        expect(pitchControl.map).toBeUndefined();
    });

});
