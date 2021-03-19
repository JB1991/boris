import { Map } from 'mapbox-gl';

export default class BodenrichtwertKartePitchControl {
    private map: Map;
    private btn: HTMLButtonElement;
    private container: HTMLDivElement;

    private threeDActive = false;
    private currentZoom: number;

    constructor() { }

    onAdd(map) {
        this.map = map;
        this.btn = document.createElement('button');
        this.btn.className = 'btn';
        this.btn.type = 'button';
        this.btn.title = '3D aktivieren/deaktivieren';
        this.btn.onclick = () => {
            if (this.threeDActive) {
                this.deactivate3dView();
                this.threeDActive = !this.threeDActive;
            } else {
                this.activate3dView();
                this.threeDActive = !this.threeDActive;
            }
        };

        const icon = document.createElement('i');
        icon.className = 'bi bi-badge-3d';
        this.btn.append(icon);

        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this.container.append(this.btn);

        return this.container;
    }

    /**
     * activate3dView adds a building transition layer to the map
     */
    public activate3dView() {
        this.currentZoom = this.map.getZoom();
        if (this.currentZoom < 11) {
            this.currentZoom = 15.1;
        }
        this.map.easeTo({
            pitch: 60,
            zoom: 17,
            center: this.map.getCenter()
            // this.marker ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 15);
    }

    /**
     * deactivate3dView removes the building extrusion layer from the map
     */
    public deactivate3dView() {
        this.map.easeTo({
            pitch: 0,
            zoom: this.currentZoom,
            center: this.map.getCenter()
            // this.marker ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
    }

    onRemove() {
        this.container.parentNode.removeChild(this.container);
        this.map = undefined;
    }
}
