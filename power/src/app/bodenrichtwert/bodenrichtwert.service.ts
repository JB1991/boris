import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FeatureCollection } from 'geojson';
import { environment } from '@env/environment';
import { Teilmarkt } from './bodenrichtwert-component/bodenrichtwert.component';

@Injectable({
    providedIn: 'root'
})
export class BodenrichtwertService {

    /**
     * URL where to fetch GeoJSON from
     */
    private url = environment.borisOws;

    /**
     * Boris BRZ Layer
     */
    private borisLayer = ['br_brzone_flat', 'br_brzone_flat_bremen'];

    /**
     * FeatureCollection, that can be subscribed to
     */
    private features = new Subject<FeatureCollection>();

    constructor(private http: HttpClient) {
    }

    /**
     * Returns the features as an Observable
     * @returns returns feature as observable
     */
    public getFeatures(): Observable<FeatureCollection> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding it to the Subject
     * @param features Updated FeatureCollection
     */
    public updateFeatures(features: FeatureCollection) {
        this.features.next(features);
    }

    public getFeatureByBRWNumber(brwNumber: string, stichtag: string, teilmarkt: Teilmarkt) {

        // OGC Filter for each teilmarkt/entwicklungszustand
        let ogcFilter = '';

        teilmarkt.value.forEach(entwType => {
            ogcFilter += '<ogc:PropertyIsEqualTo>\n' +
                '          <ogc:PropertyName>entw</ogc:PropertyName>\n' +
                '            <ogc:Literal>' + entwType + '</ogc:Literal>\n' +
                '        </ogc:PropertyIsEqualTo>\n';
        });

        // OGC Query for each layer to be searched
        let ogcQuery = '';

        this.borisLayer.forEach(layer => {
            ogcQuery +=
                '<wfs:Query typeName="' + layer + '" srsName="EPSG:4326">' +
                '<ogc:Filter>' +
                '<ogc:And>' +
                '<ogc:Or>\n' + ogcFilter + '</ogc:Or>\n' +
                '<ogc:PropertyIsEqualTo>' +
                '<ogc:PropertyName>stag</ogc:PropertyName>' +
                '<ogc:Literal>' + stichtag + '</ogc:Literal>' +
                '</ogc:PropertyIsEqualTo>' +
                '<ogc:PropertyIsLike wildCard="*" singleChar="_" escapeChar="/\">' +
                '<ogc:PropertyName>wnum</ogc:PropertyName>' +
                '<ogc:Literal>' + brwNumber + '*' + '</ogc:Literal>' +
                '</ogc:PropertyIsLike>' +
                '</ogc:And>' +
                '</ogc:Filter>' +
                '</wfs:Query>';
        });

        const filter = '<wfs:GetFeature ' +
            'xmlns:ogc="http://www.opengis.net/ogc" ' +
            'xmlns:wfs="http://www.opengis.net/wfs" ' +
            'xmlns:gml="http://www.opengis.net/gml/3.2" ' +
            'service="WFS" version="1.1.0" outputFormat="JSON" maxFeatures="10">' + ogcQuery + '</wfs:GetFeature>';

        return this.http.post<FeatureCollection>(
            this.url,
            filter,
            { 'responseType': 'json' }
        ).pipe(catchError(BodenrichtwertService.handleError));
    }
    /**
     * Returns the FeatureCollection identified by latitude, longitude and Teilmarkt
     * @param lat Latitude
     * @param lon Longitude
     * @param entw Teilmarkt
     * @returns returns feature
     */
    public getFeatureByLatLonEntw(lat: number, lon: number, entw: Array<string>): Observable<FeatureCollection> {
        // OGC Filter for each teilmarkt/entwicklungszustand
        let ogcFilter = '';

        entw.forEach(entwType => {
            ogcFilter += '<ogc:PropertyIsEqualTo>\n' +
                '          <ogc:PropertyName>entw</ogc:PropertyName>\n' +
                '            <ogc:Literal>' + entwType + '</ogc:Literal>\n' +
                '        </ogc:PropertyIsEqualTo>\n';
        });

        // OGC Query for each layer to be searched
        let ogcQuery = '';

        this.borisLayer.forEach(layer => {
            ogcQuery +=
                '  <wfs:Query typeName="' + layer + '" srsName="EPSG:4326">\n' +
                '    <ogc:Filter>\n' +
                '      <ogc:And>\n' +
                '        <ogc:Or>\n' + ogcFilter + '</ogc:Or>\n' +
                '        <ogc:Intersects>\n' +
                '        <ogc:PropertyName>geom</ogc:PropertyName>\n' +
                '          <gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">\n' +
                '            <gml:coordinates>' + lon + ',' + lat + '</gml:coordinates>\n' +
                '          </gml:Point>\n' +
                '      </ogc:Intersects>\n' +
                '      </ogc:And>\n' +
                '    </ogc:Filter>\n' +
                '  </wfs:Query>\n';
        });

        const filter =
            '<wfs:GetFeature \n' +
            '  xmlns:ogc="http://www.opengis.net/ogc"\n' +
            '  xmlns:wfs="http://www.opengis.net/wfs"\n' +
            '  xmlns:gml="http://www.opengis.net/gml/3.2" \n' +
            ' service="WFS" version="1.1.0" outputFormat="JSON">\n' + ogcQuery + '</wfs:GetFeature>';

        /*
         * Umrechnuntstabellendatei and Umrechnungstabellenwerte are presented as String not JSON,
         * therefore they have to be parsed manually
         */
        const header = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Cache-Control', 'no-cache')
            .set('Pragma', 'no-cache')
            .set('Expires', 'Sat, 01 Jan 2000 00:00:00 GMT')
            .set('If-Modified-Since', '0');
        return this.http.post<FeatureCollection>(this.url, filter, { 'headers': header, 'responseType': 'json' })
            .pipe(
                map(response => {
                    response.features = response.features.map(f => {
                        f.properties.nutzung = JSON.parse(f.properties.nutzung);
                        f.properties.umrechnungstabellendatei = JSON.parse(f.properties.umrechnungstabellendatei);
                        f.properties.umrechnungstabellenwerte = JSON.parse(f.properties.umrechnungstabellenwerte);
                        return f;
                    });
                    return response;
                }),
                catchError(BodenrichtwertService.handleError));
    }

    /**
     * Handling of HTTP errors by logging it to the console
     * @param error HTTP error to be handled
     * @returns returns error
     */
    private static handleError(error: HttpErrorResponse) {
        return throwError(error);
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
