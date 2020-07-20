import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public formsList = [];
  public tagList = [];
  public serviceList = [
    {value: 'AKS', name: 'Automatische Kaufpreissammlung'}
  ];

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.formsList = [];
    this.tagList = [];
  }

  /**
   * Loads list of forms
   */
  public loadFormsList(): Observable<Object> {
    // Load data from server
    const url = environment.formAPI
                + 'intern/forms?fields=access,access-minutes,created,id,owners,readers,status,tags,title';
    return this.httpClient.get(url);
  }

  /**
   * Loads a form by id
   */
  public loadForm(id: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // load form from server
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);
    return this.httpClient.get(url);
  }

  /**
   * Load tags
   */
  public loadTags(): Observable<Object> {
    // Load tags from server
    const url = environment.formAPI + 'intern/tags';
    return this.httpClient.get(url);
  }

  /**
   * Upload form from JSON
   * @param data SurveyJS
   * @param tags Tag list
   */
  public createForm(data: any, tags?: string): Observable<Object> {
    // check data
    if (!data) {
      throw new Error('data is required');
    }

    // Uploads form
    let url = environment.formAPI + 'intern/forms';
    if (tags) {
      url += '?tags=' + encodeURIComponent(tags);
    }
    return this.httpClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Deletes form
   * @param id Form id
   */
  public deleteForm(id: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // Delete form
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);
    return this.httpClient.delete(url);
  }
}
