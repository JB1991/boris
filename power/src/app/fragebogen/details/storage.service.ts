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

  constructor(private httpClient: HttpClient) {
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
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
}
