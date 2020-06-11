import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public formsList: any = [];

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Loads list of forms
   */
  public loadFormsList() {
    // Load data from server
    const url = environment.formAPI + 'forms';
    return this.httpClient.get(url);
  }

  /**
   * Loads a form by id
   */
  public loadForm(id: string) {
    // Load form from server
    const url = environment.formAPI + 'forms/' + id;
    return this.httpClient.get(url);
  }

  /**
   * Upload form from JSON
   */
  public createForm(data: any) {
    // Uploads form
    const url = environment.formAPI + 'forms';
    return this.httpClient.post(url, data);
  }

  /**
   * Deletes form
   * @param id Form id
   */
  public deleteForm(id: string) {
    // Delete form
    const url = environment.formAPI + 'forms/' + id;
    return this.httpClient.delete(url);
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.formsList = [];
  }
}
