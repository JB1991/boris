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
  public tagList: any = [];
  public serviceList: any = [{value: 'AKS', name: 'Automatische Kaufpreissammlung'}];

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
   * Loads list of formulars
   */
  public loadForms() {
    // load data from server
    const url = environment.formAPI + 'forms';
    return this.httpClient.get(url);
  }

  /**
   * Loads a formular by id
   */
  public loadForm(id: string) {
    // load form from server
    const url = environment.formAPI + 'forms/' + encodeURIComponent(id);
    return this.httpClient.get(url);
  }

  /**
   * Load tags
   */
  public loadTags() {
    // load tags from server
    const url = environment.formAPI + 'tags';
    return this.httpClient.get(url);
  }

  /**
   * Upload form from json
   */
  public createForm(data: any) {
    // uploads form
    const url = environment.formAPI + 'forms';
    return this.httpClient.post(url, data);
  }

  /**
   * Deletes formular
   * @param id Formular id
   */
  public deleteForm(id: string) {
    // delete formular
    const url = environment.formAPI + 'forms/' + encodeURIComponent(id);
    return this.httpClient.delete(url);
  }
}
