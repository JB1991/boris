import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

import {environment} from '@env/environment';
import {AlertsService} from '../alerts/alerts.service';
import {LoadingscreenService} from '../loadingscreen/loadingscreen.service';

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
              private loadingscreen: LoadingscreenService) {
    this.titleService.setTitle('Dashboard - POWER.NI');
  }

  /**
   * Check if 'str' is a valid JSON string
   * @param str String to be checked
   */
  private static isValidJsonString(str): boolean {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  /**
   * Check if 'str' is a valid form ID
   * @param str String to be checked
   */
  private static isValidXID(str): boolean {
    // The Form-API uses XID for the form ID (https://github.com/rs/xid)
    const validXID: RegExp = /^[a-z0-9]{20}$/;
    return str.match(validXID);
  }

  ngOnInit(): void {
    // Load form list
    this.loadingscreen.setVisible(true);
    const url = environment.formAPI + 'forms';
    this.httpClient.get(url).subscribe((response) => {
        this.loadingscreen.setVisible(false);
        // Check for error
        if (!response) {
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', 'Keine Antwort erhalten');
          this.error = 'Could not load forms (no response)';
        } else if (response['Error']) {
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', response['Error']);
          this.error = 'Could not load forms (error)';
        }

        // Store form
        if (response && response['data']) {
          this.formsList = response['data'];
        }
      },
      // Failed to load
      (error: Error) => {
        this.loadingscreen.setVisible(false);
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
        this.error = error['statusText'];
      });
  }

  /**
   * Reload the current page
   */
  private reloadPage() {
    this.formsList = [];
    this.ngOnInit();
  }

  /**
   * Exports form to json
   * @param id form id
   */
  public exportForm(id: string) {
    // Input validation
    if (!id || !DashboardComponent.isValidXID(id)) {
      this.alerts.NewAlert('danger', 'Export fehlgeschlagen', 'Ungültige Formular-ID');
      this.error = 'Export: Invalid UUID';
      return;
    }

    // Load form
    const url = environment.formAPI + 'forms/' + id;
    this.httpClient.get(url).subscribe((response) => {
        // Check for error
        if (!response) {
          this.alerts.NewAlert('danger', 'Export fehlgeschlagen', 'Keine Antwort erhalten');
          this.error = 'Could not export form (no response)';
        } else if (response['Error']) {
          this.alerts.NewAlert('danger', 'Export fehlgeschlagen', response['Error']);
          this.error = 'Could not export form (error)';
        }

        // Store form
        if (response && response['data']) {
          const pom = document.createElement('a');
          const encodedURIComponent = encodeURIComponent(JSON.stringify(response['data']['content']));
          const href = 'data:application/octet-stream;charset=utf-8,' + encodedURIComponent;
          pom.setAttribute('href', href);
          pom.setAttribute('download', 'formular.json');
          pom.click();
        }
      },
      // Failed to load
      (error: Error) => {
        this.alerts.NewAlert('danger', 'Export fehlgeschlagen', error['statusText']);
        this.error = error['statusText'];
      });
  }

  /**
   * Imports form from JSON
   */
  public importForm() {
    // Create input element
    const input = document.createElement('input');
    input.id = 'file-upload';
    input.type = 'file';
    input.accept = 'application/JSON';
    input.hidden = true;

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

  /**
   * Deletes an existing form
   * @param id form id
   */
  public deleteForm(id: string) {
    // Input validation
    if (!id || !DashboardComponent.isValidXID(id)) {
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
        // Check for error
        if (!response) {
          this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', 'Keine Antwort erhalten');
          this.error = 'Could not delete form (no response)';
        } else {
          this.reloadPage();
        }
      },
      // Failed to load
      (error: Error) => {
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', error['statusText']);
        this.error = error['statusText'];
      });
  }

  /**
   * Handling of the HTTP POST request for importing a form
   * @param body The body of the HTTP POST request
   */
  public processPostRequest(body) {
    // Input validation
    if (!body || !DashboardComponent.isValidJsonString(body)) {
      this.alerts.NewAlert('danger', 'Import fehlgeschlagen', 'Ungültige JSON-Datei');
      this.error = 'Invalid JSON file';
      return;
    }

    const url = environment.formAPI + 'forms';
    this.httpClient.post(url, body).subscribe((response) => {
        // Check for error
        if (!response) {
          this.alerts.NewAlert('danger', 'Import fehlgeschlagen', 'Keine Antwort erhalten');
          this.error = 'Could not import form (no response)';
        } else if (response['Error']) {
          this.alerts.NewAlert('danger', 'Import fehlgeschlagen', response['Error']);
          this.error = 'Could not import form (error)';
        }

        this.reloadPage();
      },
      // Failed to upload
      (error: Error) => {
        this.alerts.NewAlert('danger', 'Import fehlgeschlagen', error['statusText']);
        this.error = error['statusText'];
      });
  }
}
