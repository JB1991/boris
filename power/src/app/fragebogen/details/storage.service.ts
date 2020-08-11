import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { AuthService } from '@app/shared/auth/auth.service';

/**
 * StorageService handles api requests and data storage
 */
@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public form: any = null;
  public tasksList: any = [];

  constructor(private httpClient: HttpClient,
              public auth: AuthService) {
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
  public loadForm(id: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // load data from server
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);
    return this.httpClient.get(url, this.auth.getHeaders());
  }

  /**
   * Publish form by id.
   * @param id Form id
   * @param pin Pin type
   * @param time Time
   */
  public publishForm(id: string, pin: string = 'pin6', time: number = 60): Observable<Object> {
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
    return this.httpClient.post(url, '', this.auth.getHeaders());
  }

  /**
   * Archives form by id.
   * @param id Form id
   */
  public archiveForm(id: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // load data from server
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id) + '?cancel=true';
    return this.httpClient.post(url, '', this.auth.getHeaders());
  }

  /**
   * Get form results by id.
   * @param id Form id
   */
  public getCSV(id: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // load data from server
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id) + '/tasks/csv?status=submitted';
    return this.httpClient.get(url, this.auth.getHeaders('text', 'text/csv'));
  }

  /**
   * Deletes formular
   * @param id Formular id
   */
  public deleteForm(id: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // delete formular
    const url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id);
    return this.httpClient.delete(url, this.auth.getHeaders());
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
    return this.httpClient.get(url, this.auth.getHeaders());
  }

  /**
   * Creates task
   * @param id Task id
   * @param amount Number of tasks
   * @param factor Factor
   */
  public createTask(id: string, amount: number = 1, factor?: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // create task
    let url = environment.formAPI + 'intern/forms/' + encodeURIComponent(id) + '/tasks' +
                '?number=' + encodeURIComponent(amount);
    if (factor) {
      url += '&factor=' + encodeURIComponent(factor);
    }
    return this.httpClient.post(url, {}, this.auth.getHeaders());
  }

  /**
   * Deletes task
   * @param id Task id
   */
  public deleteTask(id: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // delete task
    const url = environment.formAPI + 'intern/tasks/' + encodeURIComponent(id);
    return this.httpClient.delete(url, this.auth.getHeaders());
  }

  /**
   * Updates comment
   * @param id Task id
   * @param comment Comment
   */
  public updateTaskComment(id: string, comment: string): Observable<Object> {
    // check data
    if (!id) {
      throw new Error('id is required');
    }

    // delete task
    const url = environment.formAPI + 'intern/tasks/' + encodeURIComponent(id)
                + '?description=' + encodeURIComponent(comment);
    return this.httpClient.post(url, '', this.auth.getHeaders());
  }
}
