import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import * as data from './data';
import { Bootstrap4_CSS } from '../surveyjs/style';

/**
 * StorageService handles loading and saving formulars for the editor component
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public model: any = JSON.parse(JSON.stringify(data.FormularTemplate));
  public css_style: any = JSON.parse(JSON.stringify(Bootstrap4_CSS));
  public FormularFields = data.FormularFields;
  public DatabaseMap = data.DatabaseMap;
  public selectedPageID = 0;
  public selectedElementID: number = null;
  public UnsavedChanges = false;
  public AutoSaveEnabled = true;

  constructor(private httpClient: HttpClient) {
    // overwrite style class
    this.css_style.container = 'sv_container';
  }

  /**
   * Resets service to empty model
   */
  public ResetService() {
    this.model = JSON.parse(JSON.stringify(data.FormularTemplate));
    this.css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));
    this.css_style.container = 'sv_container';
    this.FormularFields = data.FormularFields;
    this.DatabaseMap = data.DatabaseMap;
    this.selectedPageID = 0;
    this.selectedElementID = null;
    this.UnsavedChanges = false;
    this.AutoSaveEnabled = true;
  }

  /**
   * Loads a formular by id. If id is empty default template is loaded
   * @param id Formular id
   */
  public FormularLoad(id: string): Observable<Object> {
    // load data from server
    return this.httpClient.get(environment.api_url + 'forms/' + id);
  }

  /**
   * Saves formular. If id is not specified a new will be created.
   * @param data Surveyjs model
   * @param id Formular id
   */
  public FormularSave(data: any, id?: string): Observable<Object> {
    if (id) {
      return this.httpClient.post(environment.api_url + 'forms/' + id, JSON.stringify(data));
    } else {
      return this.httpClient.put(environment.api_url + 'forms/', JSON.stringify(data));
    }
  }

  /**
   * Sets unsaved changes state
   * @param state true or false
   */
  public SetUnsavedChanges(state: boolean) {
    this.UnsavedChanges = state;
  }

  /**
   * Returns true if unsaved changes exists
   */
  public GetUnsavedChanges(): boolean {
    return this.UnsavedChanges;
  }

  /**
   * Enables or disables autosave
   * @param state true or false
   */
  public SetAutoSaveEnabled(state: boolean) {
    this.AutoSaveEnabled = state;
  }

  /**
   * Returns true if autosave is enabled
   */
  public GetAutoSaveEnabled(): boolean {
    return this.AutoSaveEnabled;
  }


  /* HELPER FUNCTIONS */

  /**
   * Get next unique page id
   */
  public NewPageID(): string {
    // first page id 'p1'
    const prefix = 'p';
    let counter = 1;

    // for every page
    for (let i = 0; i < this.model.pages.length; i++) {
      // check if id exists
      if (this.model.pages[i].name === prefix + counter) {
        // id found, increment counter and reset loop
        counter++;
        i = -1;
      }
    }

    // return new id
    return prefix + counter;
  }

  /**
   * Get next unique element id
   */
  public NewElementID(): string {
    // first element id 'e1'
    const prefix = 'e';
    let counter = 1;

    // for every page
    for (let i = 0; i < this.model.pages.length; i++) {
      // for every element
      for (const element of this.model.pages[i].elements) {
        // check if id exists
        if (element.name === prefix + counter) {
          // id found, increment counter and reset loop
          counter++;
          i = -1;
          break;
        }
      }
    }

    // return new id
    return prefix + counter;
  }
}
