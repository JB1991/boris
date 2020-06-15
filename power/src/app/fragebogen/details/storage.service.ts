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
  public form: any = null;
  public tasksList: any = [];

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.form = null;
    this.tasksList = [];
  }

  /**
   * Loads form by id.
   * @param id Form id
   */
  public loadForm(id: string) {
    // load data from server
    const url = environment.formAPI + 'forms/' + encodeURIComponent(id);
    return this.httpClient.get(url);
  }

  /**
   * Loads tasks for form.
   * @param id Form id
   */
  public loadTasks(id: string) {
    // load data from server
    const url = environment.formAPI + 'forms/' + encodeURIComponent(id) + '/tasks';
    return this.httpClient.get(url);
  }

  /**
   * Deletes task
   * @param id Task id
   */
  public deleteTask(id: string) {
    // delete task
    const url = environment.formAPI + 'tasks/' + encodeURIComponent(id);
    return this.httpClient.delete(url);
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

  /**
   * Creates task
   * @param id Task id
   */
  public createTask(id: string) {
    // create task
    const url = environment.formAPI + 'forms/' + encodeURIComponent(id) + '/tasks';
    return this.httpClient.post(url, {});
  }
}
