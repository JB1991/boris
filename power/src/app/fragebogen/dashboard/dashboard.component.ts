import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { AlertsService } from '../alerts/alerts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public formsList: any = [];

  constructor(private router: Router,
              private titleService: Title,
              private alerts: AlertsService,
              private httpClient: HttpClient) {
    this.titleService.setTitle('Dashboard - POWER.NI');
  }

  ngOnInit(): void {
    // load formular list
    this.httpClient.get(environment.fragebogen_api + 'forms?history=false').subscribe((data) => {
      // check for error
      if (!data || data[`Error`]) {
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', data[`Error`]);
        throw new Error('Could not load formulars');
      }

      // store formular
      if (data[`Forms`]) {
        this.formsList = data[`Forms`];
      }
    }, (error: Error) => {
      // failed to load
      this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error[`statusText`]);
      throw error;
    });
  }

  /**
   * Exports formular to json
   * @param id formular id
   */
  public exportFormular(id: string) {
    // load formular
    this.httpClient.get(environment.fragebogen_api + 'forms/' + id).subscribe((data) => {
      // check for error
      if (!data || data[`Error`]) {
        this.alerts.NewAlert('danger', 'Export fehlgeschlagen', data[`Error`]);
        throw new Error('Could not export formular');
      }

      // store formular
      if (data[`Form`]) {
        const pom = document.createElement('a');
        pom.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodeURIComponent(JSON.stringify(data[`Form`][`data`])));
        pom.setAttribute('download', 'formular.json');
        pom.click();
      }
    }, (error: Error) => {
      // failed to load
      this.alerts.NewAlert('danger', 'Export fehlgeschlagen', error[`statusText`]);
      throw error;
    });
  }

  /**
   * Imports formular from json
   */
  public importFormular() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/JSON';

    // image selected
    input.onchange = (e: Event) => {
      const file = e.target[`files`][0];
      const reader = new FileReader();
      reader.readAsText(file);

      // upload success
      reader.onload = () => {
        this.httpClient.put(environment.fragebogen_api + 'forms/', reader.result).subscribe((data) => {
          // check for error
          if (!data || data[`Error`]) {
            this.alerts.NewAlert('danger', 'Import fehlgeschlagen', data[`Error`]);
            throw new Error('Could not import formular');
          }

          // reload
          this.ngOnInit();
        }, (error: Error) => {
          // failed to upload
          this.alerts.NewAlert('danger', 'Import fehlgeschlagen', error[`statusText`]);
          throw error;
        });
      };
    };
    input.click();
  }
}
