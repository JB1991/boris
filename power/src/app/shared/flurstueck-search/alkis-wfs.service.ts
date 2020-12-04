import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Flurstueck } from './flurstueck-search.component';

@Injectable({
    providedIn: 'root'
})
export class AlkisWfsService {

    /**
     * Alkis WFS URL
     */
    private url = '/wfs/alkis/';

    /**
     * Subject with feature object which contains a flurstueck and associated properties
     */
    private features = new Subject<Flurstueck>();

    constructor(private http: HttpClient) {

    }

    /**
     * Returns the features as an Observable
     */
    public getFeatures(): Observable<Flurstueck> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding a new value to the Subject
     * @param feature New feature
     */
    public updateFeatures(feature: Flurstueck) {
        this.features.next(feature);
    }

    /**
     * @param gemarkung gemarkungsschlüssel
     * @param flur flurnummer
     * @param zaehler flurstücksnummer - zähler
     * @param nenner flurstücksnummer - nenner
     */
    /* istanbul ignore next */
    public getFlurstueckByFsk(gemarkung: string, flur: string, zaehler: string, nenner: string): any {
        const fsk = '03' // laenderschluessel für NDS
            + gemarkung.padStart(4, '0')
            + flur.padStart(3, '0')
            + zaehler.padStart(5, '0')
            + nenner.padStart(4, '0')
            + '__'; // flurstueckskennzeichen suffix

        const fstFskParams = new HttpParams()
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
