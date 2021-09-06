import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Feature, FeatureCollection } from 'geojson';

@Injectable({
    providedIn: 'root'
})
export class GeosearchService {

    // Geosearch URL
    private readonly url = '/geocoding/geosearch/';

    // Subject with feature object which contains a geometry and associated properties
    private features = new Subject<Feature>();

    constructor(private http: HttpClient) {
    }

    /**
     * Handling of HTTP errors by logging it to the console
     * @param error HTTP error to be handled
     * @returns Error Observable
     */
    private static handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(error);
    }

    /**
     * Returns the features as an Observable
     * @returns Feature Observable
     */
    public getFeatures(): Observable<Feature> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding a new value to the Subject
     * @param feature New feature
     */
    public updateFeatures(feature: Feature): void {
        this.features.next(feature);
    }

    /**
     * Search for locations in lower saxony
     * @param search The search string to be passed to the GeoCoder
     * @returns FeatureCollection Observable
     */
    public search(search: string): Observable<FeatureCollection> {
        const header = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache')
            .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
            .set('If-Modified-Since', '0');
        return this.http.get<FeatureCollection>(this.url, {
            headers: header,
            responseType: 'json',
            params: new HttpParams().set('query', `text:(${search}) AND (typ:ort OR typ:strasse OR typ:haus^0.2) AND (bundesland:Niedersachsen OR bundesland:Bremen)`)
                .append('minScore', '1').append('count', '10')
        }).pipe(
            catchError(GeosearchService.handleError)
        );
    }

    /**
     * Translate geo coordinates to an address
     * If the parameter `distance` changes, the html text in `bodenrichtwert.component` must be changed accordingly.
     * @param lat Latitude
     * @param lon Longitude
     * @returns FeatureCollection Observable
     */
    public getAddressFromCoordinates(lat: number, lon: number): Observable<FeatureCollection> {
        const header = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache')
            .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
            .set('If-Modified-Since', '0');
        return this.http.get<FeatureCollection>(this.url, {
            headers: header,
            responseType: 'json',
            params: new HttpParams().set('query', 'typ: haus').append('lat', lat.toString())
                .append('lon', lon.toString()).append('distance', '50')
        }).pipe(
            catchError(GeosearchService.handleError)
        );
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
