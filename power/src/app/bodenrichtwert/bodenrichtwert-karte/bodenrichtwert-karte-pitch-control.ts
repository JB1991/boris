import { Map, Marker } from 'maplibre-gl';

export default class BodenrichtwertKartePitchControl {
    public map: Map;
    public btn?: HTMLButtonElement;
    public container?: HTMLDivElement;

    public currentZoom?: number;
    public marker: Marker;

    constructor(marker: Marker) {
        this.marker = marker;
    }

    /**
     * onAdd creates a button and icon html element and add these to the map
     * @param map Map
     * @returns a div container including a button and i element
     */
    public onAdd(map: Map): HTMLDivElement {
        this.map = map;
        this.btn = document.createElement('button');
        this.btn.id = '3D';
        this.btn.className = 'btn';
        this.btn.type = 'button';
        this.btn.title = $localize`3D aktivieren/deaktivieren`;
        this.btn.onclick = () => {
            if (this.map.getPaintProperty('building-extrusion', 'fill-extrusion-height') === 0) {
                this.activate3dView();
            } else {
                this.deactivate3dView();
            }
        };

        const icon = document.createElement('i');
        icon.className = 'bi bi-badge-3d';
        this.btn.appendChild(icon);

        this.container = document.createElement('div');
        this.container.className = 'mapboxgl-ctrl mapboxgl-ctrl-group';
        this.container.appendChild(this.btn);

        return this.container;
    }

    /**
     * activate3dView adds a building transition layer to the map
     */
    public activate3dView(): void {
        this.currentZoom = this.map.getZoom();
        if (this.currentZoom && this.currentZoom < 11) {
            this.currentZoom = 15.1;
        }
        this.map.easeTo({
            pitch: 60,
            zoom: 17,
            center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 15);
    }

    /**
     * deactivate3dView removes the building extrusion layer from the map
     */
    public deactivate3dView(): void {
        this.map.easeTo({
            pitch: 0,
            zoom: this.currentZoom,
            center: this.marker ? this.marker.getLngLat() : this.map.getCenter()
        });
        this.map.setPaintProperty('building-extrusion', 'fill-extrusion-height', 0);
    }

    /**
     * onRemove removes the html container and the map
     */
    public onRemove(): void {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.map = undefined;
    }
}
