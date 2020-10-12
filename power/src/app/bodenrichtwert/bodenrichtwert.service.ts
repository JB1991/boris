import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Feature, FeatureCollection } from 'geojson';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class BodenrichtwertService {

    /**
     * URL where to fetch GeoJSON from
     */
    private url = environment.ows;

    /**
     * FeatureCollection, that can be subscribed to
     */
    private features = new Subject<FeatureCollection>();

    /**
     * Selected Feature, that can be subscribed to
     */
    private selected = new Subject<Feature>();

    /**
     * Selected Stichtag, that can be subscribed to
     */
    private stichtag = new Subject<Date>();

    constructor(private http: HttpClient) {
    }

    /**
     * Returns the features as an Observable
     */
    getFeatures(): Observable<FeatureCollection> {
        return this.features.asObservable();
    }

    /**
     * Updates the features by feeding it to the Subject
     * @param features Updated FeatureCollection
     */
    updateFeatures(features: FeatureCollection) {
        this.features.next(features);
    }

    /**
     * Return the selected Feature as an Observable
     */
    getSelected(): Observable<Feature> {
        return this.selected.asObservable();
    }

    /**
     * Update the selected Feature by feeding it to the Subject
     * @param feature Selected Feature
     */
    updateSelected(feature: Feature) {
        this.selected.next(feature);
    }

    /**
     * Return the stichtag as an Observable
     */
    getStichtag(): Observable<Date> {
        return this.stichtag.asObservable();
    }

    /**
     * Update the stichtag by feeding it to the Subject
     * @param date New stichtag
     */
    updateStichtag(date: Date) {
        this.stichtag.next(date);
    }

    /**
     * Return the WFS capabilities as an XML object
     */
    getCapabilities() {
        const body =
            '<wfs:GetCapabilities \n' +
            '  xmlns:wfs="http://www.opengis.net/wfs"\n' +
            '  service="WFS" version="1.1.0">\n' +
            '</wfs:GetCapabilities>';
        const options = {responseType: 'text' as 'json'};
        return this.http.post(this.url, body, options)
            .pipe(catchError(BodenrichtwertService.handleError));
    }

    /**
     * Return a FeatureCollection identified by its Objektidentifikator
     * @param id Objektidentifikator
     */
    getFeatureByObjektidentifikator(id: string): Observable<FeatureCollection> {
        const filter =
            '<wfs:GetFeature \n' +
            '  xmlns:ogc="http://www.opengis.net/ogc"\n' +
            '  xmlns:wfs="http://www.opengis.net/wfs"\n' +
            ' service="WFS" version="1.1.0" outputFormat="JSON" maxFeatures="1">\n' +
            '  <wfs:Query typeName="boris:br_brzone_flat" srsName="EPSG:4326" >\n' +
            '    <ogc:Filter>\n' +
            '      <ogc:And>\n' +
            '        <ogc:PropertyIsEqualTo>\n' +
            '          <ogc:PropertyName>objektidentifikator</ogc:PropertyName>\n' +
            '            <ogc:Literal>' + id + '</ogc:Literal>\n' +
            '        </ogc:PropertyIsEqualTo>\n' +
            '      </ogc:And>\n' +
            '    </ogc:Filter>\n' +
            '  </wfs:Query>\n' +
            '</wfs:GetFeature>';

        return this.http.post<FeatureCollection>(this.url, filter).pipe(catchError(BodenrichtwertService.handleError));
    }

    /**
     * Returns the FeatureCollection identified by latitude, longitude, Stichtag and Teilmarkt
     * @param lat Latitude
     * @param lon Longitude
     * @param stag Stichtag
     * @param entw Teilmarkt
     */
    // tslint:disable-next-line:max-func-body-length
    getFeatureByLatLonStagEntw(lat: any, lon: any, stag: Date, entw: any): Observable<FeatureCollection> {
        const filter =
            '<wfs:GetFeature \n' +
            '  xmlns:ogc="http://www.opengis.net/ogc"\n' +
            '  xmlns:wfs="http://www.opengis.net/wfs"\n' +
            '  xmlns:gml="http://www.opengis.net/gml/3.2" \n' +
            ' service="WFS" version="1.1.0" outputFormat="JSON" maxFeatures="5">\n' +
            '  <wfs:Query typeName="boris:br_brzone_flat" srsName="EPSG:3857" >\n' +
            '    <ogc:Filter>\n' +
            '      <ogc:And>\n' +
            '        <ogc:PropertyIsEqualTo>\n' +
            '          <ogc:PropertyName>stag</ogc:PropertyName>\n' +
            '          <ogc:Function name="dateParse">\n' +
            '            <ogc:Literal>yyyy-MM-dd</ogc:Literal>\n' +
            '            <ogc:Literal>' + stag.toISOString().substring(0, 10) + '</ogc:Literal>\n' +
            '          </ogc:Function>\n' +
            '        </ogc:PropertyIsEqualTo>\n' +
            '        <ogc:PropertyIsEqualTo>\n' +
            '          <ogc:PropertyName>entw</ogc:PropertyName>\n' +
            '            <ogc:Literal>' + entw + '</ogc:Literal>\n' +
            '        </ogc:PropertyIsEqualTo>\n' +
            '        <ogc:Intersects>\n' +
            '        <ogc:PropertyName>geom</ogc:PropertyName>\n' +
            '          <gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">\n' +
            '            <gml:coordinates>' + lon + ',' + lat + '</gml:coordinates>\n' +
            '          </gml:Point>\n' +
            '      </ogc:Intersects>\n' +
            '      </ogc:And>\n' +
            '    </ogc:Filter>\n' +
            '  </wfs:Query>\n' +
            '</wfs:GetFeature>';

        return this.http.post<FeatureCollection>(this.url, filter).pipe(catchError(BodenrichtwertService.handleError));
    }

    /**
     * Returns the FeatureCollection identified by latitude, longitude and Teilmarkt
     * @param lat Latitude
     * @param lon Longitude
     * @param entw Teilmarkt
     */
    // tslint:disable-next-line:max-func-body-length
    getFeatureByLatLonEntw(lat: any, lon: any, entw: any): Observable<FeatureCollection> {
        const filter =
            '<wfs:GetFeature \n' +
            '  xmlns:ogc="http://www.opengis.net/ogc"\n' +
            '  xmlns:wfs="http://www.opengis.net/wfs"\n' +
            '  xmlns:gml="http://www.opengis.net/gml/3.2" \n' +
            ' service="WFS" version="1.1.0" outputFormat="JSON">\n' +
            '  <wfs:Query typeName="boris:br_brzone_flat" srsName="EPSG:3857" >\n' +
            '    <ogc:Filter>\n' +
            '      <ogc:And>\n' +
            '        <ogc:PropertyIsEqualTo>\n' +
            '          <ogc:PropertyName>entw</ogc:PropertyName>\n' +
            '            <ogc:Literal>' + entw + '</ogc:Literal>\n' +
            '        </ogc:PropertyIsEqualTo>\n' +
            '        <ogc:Intersects>\n' +
            '        <ogc:PropertyName>geom</ogc:PropertyName>\n' +
            '          <gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">\n' +
            '            <gml:coordinates>' + lon + ',' + lat + '</gml:coordinates>\n' +
            '          </gml:Point>\n' +
            '      </ogc:Intersects>\n' +
            '      </ogc:And>\n' +
            '    </ogc:Filter>\n' +
            '  </wfs:Query>\n' +
            '</wfs:GetFeature>';

        /*
         * Umrechnuntstabellendatei and Umrechnungstabellenwerte are presented as String not JSON,
         * therefore they have to be parsed manually
         */
        return this.http.post<FeatureCollection>(this.url, filter)
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
     * @private
     */
    private static handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occurred:', error.error.message);
        } else {
            console.error(
                `Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        return throwError('Something bad happened; please try again later.');
    }
}

/* vim: set expandtab ts=4 sw=4 sts=4: */
