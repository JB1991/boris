import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { AlertsService } from '../alerts/alerts.service';
import { LoadingscreenService } from '../loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-formulars-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public formsList: any = [];
  public error = '';

  constructor(private router: Router,
              private titleService: Title,
              private alerts: AlertsService,
              private httpClient: HttpClient,
              private loadingscreen: LoadingscreenService,
              public storage: StorageService) {
    this.titleService.setTitle('Dashboard - POWER.NI');
  }

  ngOnInit(): void {
    // Load form list
    this.loadingscreen.setVisible(true);
    const url = environment.formAPI + 'forms';
    this.httpClient.get(url).subscribe((response) => {
        this.loadingscreen.setVisible(false);
        this.errorCheck(response, 'Laden');
        this.storeForm(response);
      },
      (error: Error) => {
        this.loadingscreen.setVisible(false);
        this.loadFailed(error, 'Laden');
      });
  }

  private storeForm(response) {
    if (response && response['data']) {
      this.formsList = response['data'];
    }
  }

  /**
   * Exports form to json
   * @param id form id
   */
  public exportForm(id: string) {
    // Input validation
    if (!id || !DashboardComponent.isValidFormID(id)) {
      this.alerts.NewAlert('danger', 'Export fehlgeschlagen', 'Ungültige Formular-ID');
      this.error = 'Export: Invalid UUID';
      return;
    }

    // Load form
    const url = environment.formAPI + 'forms/' + id;
    this.httpClient.get(url).subscribe((response) => {
        this.errorCheck(response, 'Export');
        DashboardComponent.downloadForm(response);
      },
      (error: Error) => {
        this.loadFailed(error, 'Export');
      });
  }

  private static isValidFormID(str): boolean {
    // The Form-API uses XID for the form ID (https://github.com/rs/xid)
    const validXID: RegExp = /^[a-z0-9]{20}$/;
    return str.match(validXID);
  }

  private static downloadForm(response) {
    if (response && response['data']) {
      const pom = document.createElement('a');
      const encodedURIComponent = encodeURIComponent(JSON.stringify(response['data']['content']));
      const href = 'data:application/octet-stream;charset=utf-8,' + encodedURIComponent;
      pom.setAttribute('href', href);
      pom.setAttribute('download', 'formular.json');
      pom.click();
    }
  }

  /**
   * Imports form from JSON
   */
  public importForm() {
    const input = DashboardComponent.createInputElement();

    // Add the input element to the DOM so that it can be accessed from the tests
    const importButton = document.getElementById('button-import');
    importButton.parentNode.insertBefore(input, importButton);

    // File selected
    input.onchange = (event: Event) => {
      const file = event.target['files'][0];
      const reader = new FileReader();

      // Upload success
      reader.onload = () => {
        this.processPostRequest(reader.result);
      };

      // FileReader is async -> call readAsText() after declaring the onload handler
      reader.readAsText(file);
    };
    input.click();
  }

  private static createInputElement() {
    const input = document.createElement('input');
    input.id = 'file-upload';
    input.type = 'file';
    input.accept = 'application/JSON';
    input.hidden = true;
    return input;
  }

  /**
   * Deletes an existing form
   * @param id form id
   */
  public deleteForm(id: string) {
    // Input validation
    if (!id || !DashboardComponent.isValidFormID(id)) {
      this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', 'Ungültige Formular-ID');
      this.error = 'Delete: Invalid UUID';
      return;
    }

    // Ask user to confirm deletion
    if (!confirm('Möchten Sie dieses Formular wirklich löschen?')) {
      return;
    }

    const url = environment.formAPI + 'forms/' + id;
    this.httpClient.delete(url).subscribe((response) => {
        this.errorCheck(response, 'Löschen');
        this.reloadCurrentPage();
      },
      (error: Error) => {
        this.loadFailed(error, 'Löschen');
      });
  }

  /**
   * Handling of the HTTP POST request for importing a form
   * @param body The body of the HTTP POST request
   */
  public processPostRequest(body) {
    // Input validation
    if (!body || !DashboardComponent.isValidJson(body)) {
      this.alerts.NewAlert('danger', 'Import fehlgeschlagen', 'Ungültige JSON-Datei');
      this.error = 'Invalid JSON file';
      return;
    }

    const url = environment.formAPI + 'forms';
    this.httpClient.post(url, body).subscribe((response) => {
        this.errorCheck(response, 'Import');
        this.reloadCurrentPage();
      },
      (error: Error) => {
        this.loadFailed(error, 'Import');
      });
  }

  private reloadCurrentPage() {
    this.formsList = [];
    this.ngOnInit();
  }

  private errorCheck(response, operation) {
    const message = operation + ' fehlgeschlagen';

    if (!response) {
      this.alerts.NewAlert('danger', message, 'Keine Antwort erhalten');
      this.error = message + ' (Keine Antwort)';
    } else if (response['Error']) {
      this.alerts.NewAlert('danger', message, response['Error']);
      this.error = message + ' (Fehler)';
    }
  }

  private loadFailed(error, operation) {
    this.alerts.NewAlert('danger', operation + ' fehlgeschlagen', error['statusText']);
    this.error = error['statusText'];
  }

  private static isValidJson(str): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}
