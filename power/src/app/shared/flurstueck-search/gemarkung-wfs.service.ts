import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class GemarkungWfsService {

    /**
     * ALKIS WFS URL
     */
    private url = '/geoserver/alkis/ows?';

    /**
     * Subject with feature object which contains a flurstueck and associated properties
     */
    private features = new Subject<Feature>();

    constructor(private http: HttpClient) {

    }

    /**
     * Returns the features as an Observable
     */
    public getFeatures(): Observable<Feature> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding a new value to the Subject
     * @param feature New feature
     */
    public updateFeatures(feature: Feature) {
        this.features.next(feature);
    }

    /**
     * getGemarkungByKey by given key
     * @param gemarkung gemarkungsschlüssel
     */
    /* istanbul ignore next */
    public getGemarkungByKey(gemarkung: string): Observable<FeatureCollection> {
        const key = gemarkung.padEnd(4, '*');

        const filter = '<wfs:GetFeature ' +
            'xmlns:ogc="http://www.opengis.net/ogc" ' +
            'xmlns:wfs="http://www.opengis.net/wfs" ' +
            'xmlns:gml="http://www.opengis.net/gml/3.2" ' +
            'service="WFS" version="1.1.0" outputFormat="JSON" maxFeatures="10">' +
            '<wfs:Query typeName="gemarkungen">' +
            '<ogc:Filter>' +
            '<ogc:PropertyIsLike wildCard="*" singleChar="_" escapeChar="/\">' +
            '<ogc:PropertyName>gemarkungsschluessel</ogc:PropertyName>' +
            '<ogc:Literal>' + key + '</ogc:Literal>' +
            '</ogc:PropertyIsLike>' +
            '</ogc:Filter>' +
            '</wfs:Query>' +
            '</wfs:GetFeature>';

        return this.http.post<FeatureCollection>(
            this.url,
            filter,
            { 'responseType': 'json' }
        ).pipe(catchError(GemarkungWfsService.handleError));
    }

    /**
     * getGemarkungBySearchtext by given search text
     * @param searchText search text (gemarkungsschluessel, gemeinde, gemarkung)
     */
    /* istanbul ignore next */
    public getGemarkungBySearchText(searchText: string): Observable<FeatureCollection> {

        const regNumbers = new RegExp(/\d+/g);
        const regWords = new RegExp(/[a-zA-Z_äÄöÖüÜß]+/g);
        const numbers: Array<string> = searchText.match(regNumbers);
        const words: Array<string> = searchText.match(regWords);

        let filterNumbers: string;
        numbers?.forEach(n => {
            n = n.padEnd(4, '*');
            filterNumbers +=
                '<ogc:PropertyIsLike wildCard="*" singleChar="_" escapeChar="/\">' +
                '<ogc:PropertyName>gemarkungsschluessel</ogc:PropertyName>' +
                '<ogc:Literal>' + n + '</ogc:Literal>' +
                '</ogc:PropertyIsLike>';
        });

        let filterWords: string;
        words?.forEach(w => {
            w = w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() + '*';
            filterWords +=
                '<ogc:PropertyIsLike wildCard="*" singleChar="_" escapeChar="/\">' +
                '<ogc:PropertyName>gemarkung</ogc:PropertyName>' +
                '<ogc:Literal>' + w + '</ogc:Literal>' +
                '</ogc:PropertyIsLike>' +
                '<ogc:PropertyIsLike wildCard="*" singleChar="_" escapeChar="/\">' +
                '<ogc:PropertyName>gemeinde</ogc:PropertyName>' +
                '<ogc:Literal>' + w + '</ogc:Literal>' +
                '</ogc:PropertyIsLike>';
        });

        const filter = '<wfs:GetFeature ' +
            'xmlns:ogc="http://www.opengis.net/ogc" ' +
            'xmlns:wfs="http://www.opengis.net/wfs" ' +
            'xmlns:gml="http://www.opengis.net/gml/3.2" ' +
            'service="WFS" version="1.1.0" outputFormat="JSON" maxFeatures="10">' +
            '<wfs:Query typeName="gemarkungen">' +
            '<ogc:Filter>' +
            '<ogc:Or>' + filterWords + filterNumbers + '</ogc:Or>' +
            '</ogc:Filter>' +
            '</wfs:Query>' +
            '</wfs:GetFeature>';

        return this.http.post<FeatureCollection>(
            this.url,
            filter,
            { 'responseType': 'json' }
        ).pipe(catchError(GemarkungWfsService.handleError));
    }

    /**
     * Handling of HTTP errors by logging it to the console
     * @param error HTTP error to be handled
     */
    private static handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}
