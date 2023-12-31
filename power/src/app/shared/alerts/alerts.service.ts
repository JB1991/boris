import { Injectable } from '@angular/core';

/**
 * AlertMessage represents an alert message
 */
export type AlertMessage = {
    type: 'success' | 'danger' | 'info' | 'warning';
    title: string;
    text: string;
    timeout: number;
    date: Date;
};

/**
 * AlertsService allows to add new alert messages to the view
 */
@Injectable({
    providedIn: 'root'
})
export class AlertsService {
    public alertslist = new Array<AlertMessage>();

    /**
     * Adds new alert to view
     * @param type Display type [success, danger, info, warning]
     * @param title Title
     * @param text Body message
     * @param timeout Timeout in milliseconds
     */
    public NewAlert(type: 'success' | 'danger' | 'info' | 'warning',
        title: string, text: string, timeout = 5000): void {
        // check timeout
        if (timeout < 1000 || timeout > 60000) {
            throw new Error('timeout too big or small');
        }
        this.alertslist.push({ type: type, title: title, text: text, timeout: timeout, date: new Date() });

        // prevent too much alerts
        if (this.alertslist.length > 4) {
            this.alertslist.splice(0, 1);
        }
    }

    /**
     * Resets service to empty model
     */
    public resetService(): void {
        this.alertslist = [];
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
