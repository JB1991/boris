/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
// eslint-disable-next-line
// @ts-ignore
import { Map, Marker } from 'maplibre-gl';

@Injectable({
    providedIn: 'root'
})

export class BodenrichtwertKarteService {

    public map?: Map;

    public marker?: Marker;

    /**
     * Zooms view to selection
     */
    public zoomToSelection(): void {
        // update marker and andress
        const longlat = this.marker?.getLngLat();
        if (longlat) {
            this.map?.jumpTo({
                center: [longlat.lng, longlat.lat],
                zoom: this.map?.getZoom()
            });
        }
    }

    /**
     * Returns screenshot of map
     * @returns base64 encoded image
     */
    public getScreenshot(): string {
        if (this.map) {
            return this.map.getCanvas().toDataURL('image/png');
        }
        return '';
    }

    /**
     * Returns map heigth in pixels
     * @returns Height
     */
    public getMapHeight(): number {
        if (this.map) {
            return this.map.getCanvas().height;
        }
        return 0;
    }

    /**
     * Returns map width in pixels
     * @returns Width
     */
    public getMapWidth(): number {
        if (this.map) {
            return this.map.getCanvas().width;
        }
        return 0;
    }
}
