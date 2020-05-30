import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private httpClient: HttpClient) {
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
  }
}
