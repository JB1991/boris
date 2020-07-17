import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { type } from 'os';

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
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // load data from server
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);
    return this.httpClient.get(url);
  }

  /**
   * Publish form by id.
   * @param id Form id
   * @param pin Pin type
   * @param time Time
   */
  public publishForm(id: string, pin: string = 'pin6', time: number = 60) {
    // check data
    if (!id) {
      throw new Error('id is required');
    }
    if (!(pin === 'public' || pin === 'pin6' || pin === 'pin8' || pin === 'pin6-factor')) {
      throw new Error('pin is invalid');
    }

    // load data from server
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id) + '?publish=true'
              + '&access=' + encodeURIComponent(pin)
              + '&access-minutes=' + encodeURIComponent(time);
    return this.httpClient.post(url, '');
  }

  /**
   * Archives form by id.
   * @param id Form id
   */
  public archiveForm(id: string) {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // load data from server
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id) + '?cancel=true';
    return this.httpClient.post(url, '');
  }

  /**
   * Deletes formular
   * @param id Formular id
   */
  public deleteForm(id: string) {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // delete formular
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);
    return this.httpClient.delete(url);
  }

  /**
   * Loads tasks for form.
   * @param id Form id
   */
  public loadTasks(id: string) {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // load data from server
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id) + '/tasks';
    return this.httpClient.get(url);
  }

  /**
   * Creates task
   * @param id Task id
   */
  public createTask(id: string) {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // create task
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id) + '/tasks';
    return this.httpClient.post(url, {});
  }

  /**
   * Deletes task
   * @param id Task id
   */
  public deleteTask(id: string) {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // delete task
    const url = environment.formAPI + 'intern/tasks/' + encodeURIComponent(id);
    return this.httpClient.delete(url);
  }
}
