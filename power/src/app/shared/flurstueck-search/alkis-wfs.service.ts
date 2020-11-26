import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { XmlParser } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AlkisWfsService {

    /**
     * Alkis WFS URL
     */
    private url = '/wfs';

    /**
     * Subject with feature object which contains a flurstueck and associated properties
     */
    private features = new Subject<any>();

    constructor(private http: HttpClient) {

    }

    /**
     * Returns the features as an Observable
     */
    public getFeatures(): Observable<any> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding a new value to the Subject
     * @param feature New feature
     */
    public updateFeatures(feature: any) {
        console.log(feature);
        let parser = require('fast-xml-parser');
        // console.log(parser.validate(feature));
        let json = parser.parse(feature);
        console.log(json['wfs:FeatureCollection']['wfs:member']['AX_Flurstueck']['position']);
        this.features.next(feature);
    }

    public getFlurstueckByFsk(gemarkung: string, flur: string, zaehler: string, nenner: string): any {
        const fsk = '03' + gemarkung + flur + zaehler + nenner + '__';

        const fstFskParams = new HttpParams({})
            .set('REQUEST', 'GetFeature')
            .append('SERVICE', 'WFS')
            .append('VERSION', '2.0.0')
            .append('STOREDQUERY_ID', 'FstFsk')
            .append('FSK', fsk);

        return this.http.get(this.url, {
            params: fstFskParams,
            responseType: 'text'
        }).pipe(catchError(AlkisWfsService.handleError));
    }

    /**
     * Handling of HTTP errors by logging it to the console
     * @param error HTTP error to be handled
     */
    private static handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}
