import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { Bootstrap4_CSS } from '../surveyjs/style';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public css_style: any = JSON.parse(JSON.stringify(Bootstrap4_CSS));
  public task: any;
  public form: any;
  public UnsavedChanges = false;

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));
    this.task = null;
    this.form = null;
    this.UnsavedChanges = false;
  }

  /**
   * Get access by pin.
   * @param pin Task pin
   * @param factor Task factor
   */
  public getAccess(pin: string, factor: string) {
    // load data from server
    const url = environment.formAPI + 'public/access?pin=' + encodeURIComponent(pin) + '&factor=' + encodeURIComponent(factor);
    return this.httpClient.get(url);
  }

  /**
   * Loads task by id.
   * @param id Task id
   */
  public loadTask(id: string) {
    // load data from server
    const url = environment.formAPI + 'public/tasks' + encodeURIComponent(id);
    return this.httpClient.get(url);
  }

  /**
   * Loads form by id.
   * @param id Form id
   */
  public loadForm(id: string) {
    // load data from server
    const url = environment.formAPI + 'public/forms/' + encodeURIComponent(id);
    return this.httpClient.get(url);
  }

  /**
   * Saves progress
   * @param id Task id
   * @param data Data from survey
   */
  public saveInterimResults(id: string, data: any) {
    const url = environment.formAPI + 'public/tasks/' + encodeURIComponent(id);
    return this.httpClient.post(url, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * Completes task
   * @param id Task id
   */
  public completeTask(id: string) {
    const url = environment.formAPI + 'public/tasks/' + encodeURIComponent(id) + '?submit=true';
    return this.httpClient.post(url, {})
  }

  /**
   * Sets unsaved changes state
   * @param state true or false
   */
  public setUnsavedChanges(state: boolean) {
    this.UnsavedChanges = state;
  }

  /**
   * Returns true if unsaved changes exists
   */
  public getUnsavedChanges(): boolean {
    return this.UnsavedChanges;
  }
}
