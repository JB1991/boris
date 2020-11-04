import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Feature, FeatureCollection } from 'geojson';

@Injectable({
    providedIn: 'root'
})
export class GeosearchService {

    // Geosearch URL
    url = '/geocoding/geosearch/';

    // Subject with feature object which contains a geometry and associated properties
    features = new Subject<Feature>();

    constructor(private http: HttpClient) {
    }

    /**
     * Returns the features as an Observable
     */
    getFeatures(): Observable<Feature> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding a new value to the Subject
     * @param feature New feature
     */
    updateFeatures(feature: Feature) {
        this.features.next(feature);
    }

    /**
     * Search for locations in lower saxony
     * @param search The search string to be passed to the GeoCoder
     */
    search(search: string): Observable<FeatureCollection> {
        return this.http.get<FeatureCollection>(this.url, {
            params: new HttpParams().set('query', `text:(${search}) AND (typ:ort OR typ:strasse OR typ:haus^0.2) AND bundesland:Niedersachsen`)
            .append('minScore', '1').append('count', '10')
        }).pipe(
            catchError(GeosearchService.handleError)
        );
    }

    /**
     * Translate geo coordinates to an address
     * @param lat Latitude
     * @param lon Longitude
     * Sollte sich der Parameter distance ändern, muss der HTML-Text (bodenrichtwert.component) angespasst werden.
     */
    getAddressFromCoordinates(lat, lon): Observable<FeatureCollection> {
        return this.http.get<FeatureCollection>(this.url, {
            params: new HttpParams().set('query', 'typ: haus').append('lat', lat)
                .append('lon', lon).append('distance', '50')
        }).pipe(
            catchError(GeosearchService.handleError)
        );
    }

    /**
     * Handling of HTTP errors by logging it to the console
     * @param error HTTP error to be handled
     * @private
     */
    private static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error($localize`Es ist ein Fehler aufgetreten` + `: ${error.message}`);
        } else {
            console.error(
                $localize`Return-Code vom Backend` + `: ${error.status}, ` +
                $localize`Nachricht` + `: ${error.error}`);
        }
        return throwError($localize`Es ist ein Fehler aufgetreten.`);
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
