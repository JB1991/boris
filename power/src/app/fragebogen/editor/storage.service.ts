import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import * as templates from './data';
import { Bootstrap4_CSS } from '../surveyjs/style';

/**
 * StorageService handles loading and saving formulars for the editor component
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public model: any = JSON.parse(JSON.stringify(templates.FormularTemplate));
  public css_style: any = JSON.parse(JSON.stringify(Bootstrap4_CSS));
  public FormularFields = templates.FormularFields;
  public DatabaseMap = templates.DatabaseMap;
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
  public resetService() {
    this.model = JSON.parse(JSON.stringify(templates.FormularTemplate));
    this.css_style = JSON.parse(JSON.stringify(Bootstrap4_CSS));
    this.css_style.container = 'sv_container';
    this.FormularFields = templates.FormularFields;
    this.DatabaseMap = templates.DatabaseMap;
    this.selectedPageID = 0;
    this.selectedElementID = null;
    this.UnsavedChanges = false;
    this.AutoSaveEnabled = true;
  }

  /**
   * Loads a form by id. If id is empty default template is loaded
   * @param id Form id
   */
  public loadForm(id: string): Observable<Object> {
    // load data from server
    const url = environment.formAPI + 'forms/' + id;
    return this.httpClient.get(url);
  }

  /**
   * Saves form. If id is not specified a new will be created.
   * @param data Surveyjs model
   * @param id Form id
   * @param tags Form tags
   */
  public saveForm(data: any, id?: string, tags?: string[]): Observable<Object> {
    const body = JSON.stringify(data);
    if (id) {
      const url = environment.formAPI + 'forms/' + id;
      return this.httpClient.put(url, body);
    } else if (tags) {
      let query: string;
      if (tags.length > 0) {
        query = '?' + tags.join(',');
      }
      const url = environment.formAPI + 'forms' + query;
      return this.httpClient.post(url, body);
    } else {
      const url = environment.formAPI + 'forms';
      return this.httpClient.post(url, body);
    }
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

  /**
   * Enables or disables autosave
   * @param state true or false
   */
  public setAutoSaveEnabled(state: boolean) {
    this.AutoSaveEnabled = state;
  }

  /**
   * Returns true if autosave is enabled
   */
  public getAutoSaveEnabled(): boolean {
    return this.AutoSaveEnabled;
  }


  /* HELPER FUNCTIONS */

  /**
   * Get next unique page id
   */
  public newPageID(): string {
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
  public newElementID(): string {
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
