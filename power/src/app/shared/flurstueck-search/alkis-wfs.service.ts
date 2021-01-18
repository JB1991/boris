import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FeatureCollection } from 'geojson';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { Flurstueck } from './flurstueck-search.component';

@Injectable({
    providedIn: 'root'
})
export class AlkisWfsService {

    /**
     * ALKIS WFS URL
     */
    private url = '/geoserver/alkis/ows?';

    /**
     * Subject with feature object which contains a flurstueck and associated properties
     */
    private features = new Subject<FeatureCollection>();

    constructor(private http: HttpClient) {

    }

    /**
     * Returns the features as an Observable
     */
    public getFeatures(): Observable<FeatureCollection> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding a new value to the Subject
     * @param feature New feature
     */
    public updateFeatures(feature: FeatureCollection) {
        this.features.next(feature);
    }

    /**
     * 
     * @param gemarkung 
     * @param flur 
     * @param zaehler 
     * @param nenner 
     */
    /* istanbul ignore next */
    public getFlurstueckByFsk(gemarkung: string, flur: string, zaehler: string, nenner: string): any {
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
            '<wfs:Query typeName="ax_flurstueck_nds" srsName="EPSG:3857">' +
            '<ogc:Filter>' +
            '<ogc:PropertyIsEqualTo>' +
            '<ogc:PropertyName>flurstueckskennzeichen</ogc:PropertyName>' +
            '<ogc:Literal>' + fsk + '</ogc:Literal>' +
            '</ogc:PropertyIsEqualTo>' +
            '</ogc:Filter>' +
            '</wfs:Query>' +
            '</wfs:GetFeature>'

        console.log(filter);
        return this.http.post<FeatureCollection>(
            this.url,
            filter,
            { 'responseType': 'json' }
        ).pipe(catchError(AlkisWfsService.handleError));
    }

    /**
     * Handling of HTTP errors by logging it to the console
     * @param error HTTP error to be handled
     */
    private static handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}
