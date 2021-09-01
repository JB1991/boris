/* eslint-disable max-lines */
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AnyLayer, AnySourceData, IControl, LngLat, LngLatBounds, LngLatBoundsLike, MapboxGeoJSONFeature, MapMouseEvent, Marker, Map as MapBoxMap, AnySourceImpl } from 'maplibre-gl';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
    selector: 'map-client',
    templateUrl: './map-client.component.html',
    styleUrls: ['./map-client.component.scss']
})
export class MapClientComponent implements AfterViewInit {
    @ViewChild('mapContainer') private mapContainer!: ElementRef<HTMLElement>;
    private map!: MapBoxMap;

    @Input() activeDetails = false;
    @Input() defaultZoom = 6.86;
    @Input() defaultBearing = 0;
    @Input() defaultPitch = 0;
    @Input() bounds = new LngLatBounds([6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]);
    @Input() maxZoom = 20;
    @Input() minZoom = 5;
    @Input() style = '';
    @Input() marker?: Marker;

    private markerPosition = new BehaviorSubject<LngLat | undefined>(undefined);

    private click = new BehaviorSubject<LngLat | undefined>(undefined);
    private moveEnd = new BehaviorSubject<LngLatBounds | undefined>(undefined);
    private loaded = new BehaviorSubject<boolean>(false);

    private zoom = new BehaviorSubject<number>(6.86);
    private pitch = new BehaviorSubject<number>(0);
    private bearing = new BehaviorSubject<number>(0);

    /** @inheritdoc */
    public ngAfterViewInit() {
        this.map = new MapBoxMap({
            container: this.mapContainer.nativeElement,
            style: this.style,
            zoom: this.defaultZoom,
            bearing: this.defaultBearing,
            pitch: this.defaultPitch,
            maxPitch: 60,
            minPitch: 0,
            bounds: new LngLatBounds([6.19523325024787, 51.2028429493903], [11.7470832174838, 54.1183357191213]),
            maxZoom: this.maxZoom,
            minZoom: this.minZoom,
            transformRequest: (url: string, resourceType: string) => {
                if (!url.startsWith('http') && resourceType === 'Tile') {
                    return { url: location.protocol + '//' + location.host + url };
                }
                return { url: url };
            },
            trackResize: true,
            preserveDrawingBuffer: true,
        });
        this.map.on('load', () => {
            this.loaded.next(true);
        });
        this.map.on('click', (event: MapMouseEvent) => {
            this.click.next(event.lngLat);
        });
        this.map.on('moveend', () => {
            this.moveEnd.next(this.map.getBounds());
        });
        this.map.on('zoomend', () => {
            if (this.zoom.getValue() !== this.map.getZoom()) {
                return;
            }
            if (this.map) {
                this.updateZoom(this.map.getZoom());
            }
        });

        this.map.on('resize', () => this.fly());

        this.map.on('pitchend', () => {
            if (this.map) {
                this.updatePitch(this.map.getPitch());
            }
        });

        this.map.on('rotateend', () => {
            if (this.map) {
                this.updateBearing(this.map.getBearing());
            }
        });

        if (this.marker) {
            this.marker.on('dragend', () => {
                this.updateMarkerPosition(this.marker?.getLngLat());
            });
        }

        this.resetMap();
    }

    /**
     * getSource
     * @param id source id
     * @returns source or undefined
     */
    public getSource(id: string): AnySourceImpl | undefined {
        if (this.map) {
            return this.map.getSource(id);
        }
        return undefined;
    }

    /**
     * addSource
     * @param id source id
     * @param source source
     */
    public addSource(id: string, source: AnySourceData) {
        if (this.map) {
            this.map.addSource(id, source);
        }
    }

    /**
     * addLayer
     * @param layer layer
     * @param before layer id
     */
    public addLayer(layer: AnyLayer, before?: string) {
        if (this.map) {
            this.map.addLayer(layer, before);
        }
    }

    /**
     * addImage
     * @param id image id
     * @param image image
     */
    public addImage(id: string, image: ImageData) {
        if (this.map) {
            this.map.addImage(id, image);
        }
    }

    /**
     * setFilter
     * @param layer layer id
     * @param filter filter
     */
    public setFilter(layer: string, filter: any[] | boolean | null) {
        if (this.map) {
            this.map.setFilter(layer, filter);
        }
    }

    /**
     * getLayoutProperty
     * @param layer layer id
     * @param name property
     * @returns property
     */
    public getLayoutProperty(layer: string, name: string): any {
        if (this.map) {
            return this.map.getLayoutProperty(layer, name);
        }
    }

    /**
     * setLayoutProperty
     * @param layer layer id
     * @param name property
     * @param value property
     */
    public setLayoutProperty(layer: string, name: string, value: any) {
        if (this.map) {
            this.map.setLayoutProperty(layer, name, value);
        }
    }

    /**
     * addControl
     * @param control control id
     * @param position position
     */
    public addControl(
        control: IControl,
        position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
    ) {
        if (this.map) {
            this.map.addControl(control, position);
        }
    }

    /**
     * setStyle
     * @param style style
     */
    public setStyle(style: string) {
        this.style = style;
        if (this.map) {
            this.map.setStyle(style);
        }
    }

    /**
     * fly
     */
    public fly() {
        if (this.map) {
            const position = this.markerPosition.getValue();
            this.map.flyTo({
                center: position ? [position.lng, position.lat] : this.bounds.getCenter(),
                zoom: this.zoom.getValue(),
                speed: 1,
                curve: 1,
            });
        }
    }

    /**
     * fitBounds
     * @param bounds bounds
     * @param options options
     */
    public fitBounds(bounds: LngLatBoundsLike, options?: maplibregl.FitBoundsOptions) {
        if (this.map) {
            this.map.fitBounds(bounds, options);
        }
    }

    /**
     * getLoaded fires event when map is loaded.
     * @returns observable
     */
    public getLoaded(): Observable<boolean> {
        return this.loaded.asObservable();
    }

    /**
     * getLoaded fires event when map is loaded.
     * @returns observable
     */
    public getClick(): Observable<LngLat | undefined> {
        return this.click.asObservable();
    }

    /**
     * getLoaded fires event when map is loaded.
     * @returns observable
     */
    public getMoveEnd(): Observable<LngLatBounds | undefined> {
        return this.moveEnd.asObservable();
    }

    /**
     * getMarkerPosition returns the latitude and longitude of the marker as an Observable
     * @returns latLng
     */
    public getMarkerPosition(): Observable<LngLat | undefined> {
        return this.markerPosition.asObservable();
    }

    /**
     * Updates the latitude and longitude by feeding it to the Subject
     * @param position position
     */
    public updateMarkerPosition(position?: LngLat) {
        if (this.map && position && this.marker) {
            this.marker.setLngLat(position).addTo(this.map);
        }

        this.markerPosition.next(position);
    }

    /**
     * Returns the zoom as an Observable
     * @returns zoom
     */
    public getZoom(): Observable<number> {
        return this.zoom.asObservable();
    }

    /**
     * Updates the zoom by feeding it to the Subject
     * @param zoom Updated zoom
     */
    public updateZoom(zoom: number) {
        if (!zoom || zoom === this.zoom.getValue()) {
            return;
        }

        this.zoom.next(zoom);
        let nextZoom = zoom;
        if (zoom >= this.maxZoom) {
            nextZoom = this.maxZoom;
        } else if (zoom <= this.minZoom) {
            nextZoom = this.minZoom;
        }

        if (this.map) {
            this.map.setZoom(nextZoom);
        }
        this.zoom.next(nextZoom);
    }

    /**
     * Updates the zoom if current zoom is less than value by feeding it to the Subject
     * @param zoom minimal updated zoom
     */
    public updateMinZoom(zoom: number) {
        if (zoom > this.zoom.getValue()) {
            this.zoom.next(zoom);
        }
    }

    /**
     * Returns the pitch as an Observable
     * @returns pitch
     */
    public getPitch(): Observable<number> {
        return this.pitch.asObservable();
    }

    /**
     * Updates the pitch by feeding it to the Subject
     * @param pitch Updated pitch
     */
    public updatePitch(pitch: number) {
        let nextPitch = pitch;

        if (pitch >= 60) {
            nextPitch = 60;
        } else if (!pitch || pitch <= 0) {
            nextPitch = 0;
        }
        if (this.map) {
            this.map.setPitch(nextPitch);
        }
        this.pitch.next(nextPitch);
    }

    /**
     * Returns the bearing as an Observable
     * @returns bearing
     */
    public getBearing(): Observable<number> {
        return this.bearing.asObservable();
    }

    /**
     * Updates the bearing by feeding it to the Subject
     * @param bearing updated bearing
     */
    public updateBearing(bearing: number) {
        if (isNaN(bearing)) {
            return;
        }

        let nextBearing = bearing;
        if (bearing >= 180) {
            nextBearing = 180;
        } else if (bearing <= -180) {
            nextBearing = -180;
        }
        if (this.map) {
            this.map.setBearing(nextBearing);
        }
        this.bearing.next(nextBearing);
    }

    /**
     * resizeMap
     */
    public resizeMap() {
        if (this.map) {
            // eslint-disable-next-line
            setTimeout(() => {
                this.map.resize();
            });
        }
    }

    /**
     * resetMap
     */
    public resetMap() {
        if (this.markerPosition.getValue()) {
            this.updateMarkerPosition();
        }
        if (this.marker) {
            this.marker.remove();
        }
        this.updateBearing(this.defaultBearing);
        this.updatePitch(this.defaultPitch);
        this.updateZoom(this.defaultZoom);
        this.resizeMap();
    }

    /**
     * queryRenderedFeatures
     * @param layers layer ids
     * @returns features
     */
    public queryRenderedFeatures(layers?: string[]): MapboxGeoJSONFeature[] {
        if (!this.map) {
            return [];
        }

        return this.map.queryRenderedFeatures(undefined, { layers: layers })
    }

    /**
     * Returns screenshot of map
     * @returns base64 encoded image
     */
    public getScreenshot(): string {
        if (!this.map) {
            return '';
        }

        return this.map.getCanvas().toDataURL('image/png');
    }
}
