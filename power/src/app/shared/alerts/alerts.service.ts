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
    if (!(type === 'success' || type === 'danger' || type === 'info' || type === 'warning')) {
      throw new Error('Type is invalid');
    }
    if (timeout < 1000 || timeout > 60000) {
      throw new Error('timeout too big or small');
    }
    this.alertslist.push({ type, title, text, timeout });

    // prevent too much alerts
    if (this.alertslist.length > 4) {
      this.alertslist.splice(0, 1);
    }
  }

  /**
   * Resets service to empty model
   */
  public resetService() {
    this.alertslist = [];
  }
}
