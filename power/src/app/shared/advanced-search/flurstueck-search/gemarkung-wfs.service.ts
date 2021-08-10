import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Feature, FeatureCollection } from 'geojson';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import Fuse from 'fuse.js';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})

export class GemarkungWfsService {

    /**
     * ALKIS WFS URL
     */
    private url = environment.alkisOws;

    /**
     * Subject with feature object which contains a flurstueck and associated properties
     */
    private features = new Subject<Feature>();

    constructor(private http: HttpClient) {

    }

    /**
     * Returns Features
     * @returns features as an Observable
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

    /* istanbul ignore next */
    /**
     * getGemarkungByKey by given key
     * @param gemarkung gemarkungsschlüssel
     */
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

        const header = new HttpHeaders().set('Content-Type', 'application/xml')
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache')
            .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
            .set('If-Modified-Since', '0');
        return this.http.post<FeatureCollection>(
            this.url,
            filter,
            { 'headers': header, 'responseType': 'json' }
        ).pipe(catchError(GemarkungWfsService.handleError));
    }

    /* istanbul ignore next */
    /**
     * getGemarkungBySearchtext by given search text
     * @param searchText search text (gemarkungsschluessel, gemeinde, gemarkung)
     */
    public getGemarkungBySearchText(searchText: string): Observable<FeatureCollection> {

        const regNumbers = new RegExp(/\d+/g);
        const regWords = new RegExp(/[a-zA-Z_äÄöÖüÜß]+/g);
        const numbers: Array<string> = searchText.match(regNumbers);
        const words: Array<string> = searchText.match(regWords);

        let filterNumbers = '';
        numbers?.forEach(n => {
            n = n.padEnd(4, '*');
            filterNumbers +=
                '<ogc:PropertyIsLike wildCard="*" singleChar="_" escapeChar="/\">' +
                '<ogc:PropertyName>gemarkungsschluessel</ogc:PropertyName>' +
                '<ogc:Literal>' + n + '</ogc:Literal>' +
                '</ogc:PropertyIsLike>';
        });

        let filterWords = '';
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
            'service="WFS" version="1.1.0" outputFormat="JSON">' +
            '<wfs:Query typeName="gemarkungen">' +
            '<ogc:Filter>' +
            '<ogc:Or>' + filterWords + filterNumbers + '</ogc:Or>' +
            '</ogc:Filter>' +
            '</wfs:Query>' +
            '</wfs:GetFeature>';

        const header = new HttpHeaders().set('Content-Type', 'application/xml')
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache')
            .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
            .set('If-Modified-Since', '0');
        return this.http.post<FeatureCollection>(
            this.url,
            filter,
            { 'headers': header, 'responseType': 'json' }
        ).pipe(map(response => {
            response.features = this.fuzzySearch(response.features, searchText);
            return response;
        }), catchError(GemarkungWfsService.handleError));
    }

    /**
     * fuzzySearch filters the wfs search response with fuzzy searching
     * @param res response of the wfs search
     * @param searchText searchText
     * @returns first 10 filtered items by fuzzy search
     */
    private fuzzySearch(res: Array<Feature>, searchText: string): Array<Feature> {
        const options = {
            keys: [
                'properties.gemarkung',
                'properties.gemeinde',
                'properties.gemarkungsschluessel'
            ]
        };
        const fuse = new Fuse(res, options);

        return fuse.search(searchText).map(items => items.item).slice(0, 10);
    }

    /**
     * Handling of HTTP errors by logging it to the console
     * @param error HTTP error to be handled
     * @returns observable error
     */
    private static handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}
