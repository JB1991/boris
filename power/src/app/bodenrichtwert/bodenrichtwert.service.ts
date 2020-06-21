import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, Subject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Feature, FeatureCollection} from 'geojson';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BodenrichtwertService {

  private url = environment.ows;

  private features = new Subject<FeatureCollection>();
  private selected = new Subject<Feature>();
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


    return this.http.post<FeatureCollection>(this.url, filter).pipe(catchError(this.handleError));

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

  getCapabilities() {

    const body =
      '<wfs:GetCapabilities \n' +
      '  xmlns:wfs="http://www.opengis.net/wfs"\n' +
      '  service="WFS" version="1.1.0">\n' +
      '</wfs:GetCapabilities>';
    const options = {responseType: 'text' as 'json'};
    return this.http.post(this.url, body, options).pipe(catchError(this.handleError));
  }

  // TODO Return available stichtage from WFS
  getStichtage() {

  }
}
