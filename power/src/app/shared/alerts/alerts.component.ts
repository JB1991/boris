import { Component } from '@angular/core';
import { AlertsService } from './alerts.service';

@Component({
    selector: 'power-alerts',
    templateUrl: './alerts.component.html',
    styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent {

    constructor(public alerts: AlertsService) { }

    /**
     * Removes alert from list
     * @param id alert id
     */
    public onClosed(id: number): void {
        if (id < 0 || id >= this.alerts.alertslist.length) {
            throw new Error('Invalid id');
        }
        this.alerts.alertslist.splice(id, 1);
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
