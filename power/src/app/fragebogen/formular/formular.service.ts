import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { PurchaseCase } from '../shared/purchase-case';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class FormularService {
  private retryCount = 3;

  constructor(private http: HttpClient) { }

  // Error handling
  private static errorHandler(error: HttpErrorResponse): Observable<any> {
    console.error('Error occurred!');
    return throwError(error);
  }

  // Get formular from backend via PIN
  loadTask(pin: string): Observable<PurchaseCase> {
    const url = environment.formAPI + '/tasks?pin=' + pin;
    return this.http.get<PurchaseCase>(url)
      .pipe(
        retry(this.retryCount),
        catchError(FormularService.errorHandler)
      );
  }

  // Post formular to backend via PIN
  saveTask(pin: string, model: any): Observable<PurchaseCase> {
    const url = environment.formAPI + '/tasks?pin=' + pin;
    return this.http.post<PurchaseCase>(url, model)
      .pipe(
        retry(this.retryCount),
        catchError(FormularService.errorHandler)
      );
  }
}
