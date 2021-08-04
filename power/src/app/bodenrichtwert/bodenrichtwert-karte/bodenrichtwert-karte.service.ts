/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { Map, Marker } from 'maplibre-gl';

@Injectable({
    providedIn: 'root'
})

export class BodenrichtwertKarteService {

    public map: Map;
    public marker: Marker;

    /**
     * Zooms view to selection
     */
    public zoomToSelection() {
        // update marker and andress
        const longlat = this.marker.getLngLat();
        if (longlat) {
            this.map.jumpTo({
                center: [longlat.lng, longlat.lat],
                zoom: this.map.getZoom()
            });
        }
    }

    /**
     * Returns screenshot of map
     * @returns base64 encoded image
     */
    public getScreenshot(): string {
        return this.map.getCanvas().toDataURL('image/png');
    }

    /**
     * Returns map heigth in pixels
     * @returns Height
     */
    public getMapHeight(): number {
        return this.map.getCanvas().height
    }

    /**
     * Returns map width in pixels
     * @returns Width
     */
    public getMapWidth(): number {
        return this.map.getCanvas().width
    }
}
