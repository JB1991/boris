import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { PurchaseCase } from '../shared/purchase-case';
import { catchError, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormularService {
  private api = 'http://localhost:9090';
  private retryCount = 3;

  constructor(private http: HttpClient) { }

  // Get formular from backend via ID
  loadFormular(id: string): Observable<PurchaseCase> {
    return this.http.get<PurchaseCase>(`${this.api}/formular/${id}`)
      .pipe(
        retry(this.retryCount),
        catchError(this.errorHandler)
      );
  }

  // Post formular to backend via ID
  saveFormular(id: string, model: any): Observable<PurchaseCase> {
    return this.http.post<PurchaseCase>(`${this.api}/formular/${id}`, model)
      .pipe(
        retry(this.retryCount),
        catchError(this.errorHandler)
      );
  }

  // Error handling
  private errorHandler(error: HttpErrorResponse): Observable<any> {
    console.error('Error occurred!');
    return throwError(error);
  }
}
