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

  getFeatures(): Observable<FeatureCollection> {
    return this.features.asObservable();
  }

  updateFeatures(features: FeatureCollection) {
    this.features.next(features);
  }

  getSelected(): Observable<Feature> {
    return this.selected.asObservable();
  }

  updateSelected(feature: Feature) {
    this.selected.next(feature);
  }

  getStichtag(): Observable<Date> {
    return this.stichtag.asObservable();
  }

  updateStichtag(date: Date) {
    this.stichtag.next(date);
  }

  getCapabilities() {
    const body =
      '<wfs:GetCapabilities \n' +
      '  xmlns:wfs="http://www.opengis.net/wfs"\n' +
      '  service="WFS" version="1.1.0">\n' +
      '</wfs:GetCapabilities>';
    const options = {responseType: 'text' as 'json'};
    return this.http.post(this.url, body, options)
      .pipe(catchError(this.handleError));
  }

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

    return this.http.post<FeatureCollection>(this.url, filter).pipe(catchError(this.handleError));
  }

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

    return this.http.post<FeatureCollection>(this.url, filter).pipe(catchError(this.handleError));
  }

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
          const ft = response.features.map(f => {
            f.properties.nutzung = JSON.parse(f.properties.nutzung);
            f.properties.umrechnungstabellendatei = JSON.parse(f.properties.umrechnungstabellendatei);
            f.properties.umrechnungstabellenwerte = JSON.parse(f.properties.umrechnungstabellenwerte);
            return f;
          });
          response.features = ft;
          return response;
        }),
        catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
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
