import { Injectable } from '@angular/core';

/**
 * AlertsService allows to add new alert messages to the view
 */
@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  public alertslist: any = [];

  constructor() { }

  /**
   * Adds new alert to view
   * @param type Display type [success, danger, info, warning]
   * @param title Title
   * @param text Body message
   * @param timeout Timeout in milliseconds
   */
  public NewAlert(type: string, title: string, text: string, timeout: number = 5000) {
    // check if type is set
    if (!type) {
      throw new Error('Type is required');
    }

    this.alertslist.push({type, title, text, timeout});
  }
}
