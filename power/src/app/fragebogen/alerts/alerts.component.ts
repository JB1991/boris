import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../alerts/alerts.service';

@Component({
  selector: 'power-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']
})
export class AlertsComponent implements OnInit {

  constructor(public alerts: AlertsService) { }

  ngOnInit() {
  }

  /**
   * Removes alert from list
   * @param id alert id
   */
  public onClosed(id: number) {
    this.alerts.alertslist.splice(id, 1);
  }
}
