import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { Bootstrap4_CSS } from '../surveyjs/style';

/**
 * StorageService handles loading and saving tasks/formulars for the fillout component
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
   * Loads task by pin.
   * @param pin Task pin
   */
  public loadTask(pin: string) {
    // load data from server
    const url = environment.formAPI + 'tasks?pin=' + pin;
    return this.httpClient.get(url);
  }

  /**
   * Loads form by id.
   * @param id Form id
   */
  public loadForm(id: string) {
    // load data from server
    const url = environment.formAPI + 'forms/' + id;
    return this.httpClient.get(url);
  }

  /**
   * Saves progress
   * @param id Task id
   * @param data Data from survey
   */
  public saveInterimResults(id: string, data: any) {
    const url = environment.formAPI + 'tasks/' + id;
    return this.httpClient.put(url, data)
  }

  /**
   * Completes form
   * @param pin Task pin
   * @param data Data from survey
   */
  public completeForm(pin: string, data: any) {
    const url = environment.formAPI + 'tasks?pin=' + pin;
    return this.httpClient.patch(url, data)
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
