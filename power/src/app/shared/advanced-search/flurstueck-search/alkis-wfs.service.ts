import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { FeatureCollection } from 'geojson';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AlkisWfsService {

    /**
     * ALKIS WFS URL
     */
    private url = environment.alkisOws;

    /**
     * Subject with feature object which contains a flurstueck and associated properties
     */
    private features = new Subject<FeatureCollection>();

    constructor(private http: HttpClient) {

    }

    /**
     * Returns Features
     * @returns Features as an Observable
     */
    public getFeatures(): Observable<FeatureCollection> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding a new value to the Subject
     * @param features New feature
     */
    public updateFeatures(features: FeatureCollection) {
        this.features.next(features);
    }

    /* istanbul ignore next */
    /**
     * getFlurstueckByFsk returns a flurstueck by given fsk
     * @param gemarkung gemarkungsschlüssel
     * @param flur flurnummer
     * @param zaehler Flurstücksnummer - Zähler
     * @param nenner Flurstücksnummer - Nenner
     * @returns flurstueck
     */
    public getFlurstueckByFsk(
        gemarkung: string,
        flur: string,
        zaehler: string,
        nenner?: string): Observable<FeatureCollection> {
        let fsk = '03' // laenderschluessel für NDS
            + gemarkung.padStart(4, '0')
            + flur.padStart(3, '0')
            + zaehler.padStart(5, '0');

        if (nenner) {
            fsk += nenner.padStart(4, '0') + '__'; // flurstueckskennzeichen suffix
        } else {
            fsk += '______';
        }

        const filter = '<wfs:GetFeature ' +
            'xmlns:ogc="http://www.opengis.net/ogc" ' +
            'xmlns:wfs="http://www.opengis.net/wfs" ' +
            'xmlns:gml="http://www.opengis.net/gml/3.2" ' +
            'service="WFS" version="1.1.0" outputFormat="JSON">' +
            '<wfs:Query typeName="ax_flurstueck_nds" srsName="EPSG:4326">' +
            '<ogc:Filter>' +
            '<ogc:PropertyIsEqualTo>' +
            '<ogc:PropertyName>flurstueckskennzeichen</ogc:PropertyName>' +
            '<ogc:Literal>' + fsk + '</ogc:Literal>' +
            '</ogc:PropertyIsEqualTo>' +
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
        ).pipe(catchError(AlkisWfsService.handleError));
    }

    /**
     * Use geo coordinates to get Flurstueck feature
     * @param lng Longitude
     * @param lat Latitude
     * @returns observable feature collection
     */
    public getFlurstueckfromCoordinates(lng: number, lat: number): Observable<FeatureCollection> {
        const filter = '<wfs:GetFeature ' +
            'xmlns:ogc="http://www.opengis.net/ogc" ' +
            'xmlns:wfs="http://www.opengis.net/wfs" ' +
            'xmlns:gml="http://www.opengis.net/gml/3.2" ' +
            'service="WFS" version="1.1.0" outputFormat="JSON">' +
            '<wfs:Query typeName="ax_flurstueck_nds" srsName="EPSG:4326">' +
            '<ogc:Filter>' +
            '<ogc:Intersects>' +
            '<ogc:PropertyName>wkb_geometry</ogc:PropertyName>' +
            '<gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">' +
            '<gml:coordinates>' + lng + ',' + lat + '</gml:coordinates>' +
            '</gml:Point>' +
            '</ogc:Intersects>' +
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
        ).pipe(catchError(AlkisWfsService.handleError));
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

/* vim: set expandtab ts=4 sw=4 sts=4: */
