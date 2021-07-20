/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { Map } from 'maplibre-gl';

@Injectable({
    providedIn: 'root'
})

export class BodenrichtwertKarteService {

    public map: Map;

    constructor() { }

    /**
     * Returns screenshot of map
     * @returns base64 encoded image
     */
    public getScreenshot(): string {
        return this.map.getCanvas().toDataURL('image/png');
    }
}
