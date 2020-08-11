import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Feature, FeatureCollection } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class GeosearchService {

  url = '/geocoding/geosearch/';

  features = new Subject<Feature>();

  constructor(private http: HttpClient) {
  }

  getFeatures(): Observable<Feature> {
    return this.features.asObservable();
  }

  updateFeatures(feature: Feature) {
    this.features.next(feature);
  }

  search(search: string): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(this.url, {
      params: new HttpParams().set('query', `text:(${search}) AND typ:haus AND bundesland:Niedersachsen`)
    }).pipe(
      catchError(this.handleError)
    );
  }

  getAddressFromCoordinates(lat, lng): Observable<FeatureCollection> {
    return this.http.get<FeatureCollection>(this.url, {
      params: new HttpParams().set('query', 'typ: haus').append('lat', lat).append('lon', lng)
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('Es ist ein Fehler aufgetreten: ' + error.message);
    } else {
      console.error(
        `Return-Code vom Backend: ${error.status}, ` +
        `Nachricht: ${error.error}`);
    }
    return throwError('Es ist ein Fehler aufgetreten.');
  }
}

// Sample result from BKG Geocoding Service: See file power/src/assets/geosearch/sample.json
