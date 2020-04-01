import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';

import {environment} from '@env/environment';
import {AlertsService} from '../alerts/alerts.service';

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
              private httpClient: HttpClient) {
    this.titleService.setTitle('Dashboard - POWER.NI');
  }

  /**
   * Check if `str` is a valid JSON string
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

  ngOnInit(): void {
    // Load form list
    this.httpClient.get(environment.fragebogen_api + 'forms?history=false').subscribe((data) => {
        // Check for error
        if (!data) {
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', 'Keine Daten erhalten');
          this.error = 'Could not load forms (no data)';
        } else if (data[`Error`]) {
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', data[`Error`]);
          this.error = 'Could not load forms (error)';
        }

        // Store form
        if (data && data[`Forms`]) {
          this.formsList = data[`Forms`];
        }
      },
      // Failed to load
      (error: Error) => {
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error[`statusText`]);
        this.error = error[`statusText`];
      });
  }

  /**
   * Exports form to json
   * @param id form id
   */
  public exportForm(id: string) {
    // Input validation
    const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

    if (!id || !id.match(UUID)) {
      this.alerts.NewAlert('danger', 'Export fehlgeschlagen', 'Ungültige Formular-ID');
      this.error = 'Invalid UUID';
      return;
    }

    // Load form
    this.httpClient.get(environment.fragebogen_api + 'forms/' + id).subscribe((data) => {
        // Check for error
        if (!data) {
          this.alerts.NewAlert('danger', 'Export fehlgeschlagen', 'Keine Daten');
          this.error = 'Could not export form (no data)';
        } else if (data[`Error`]) {
          this.alerts.NewAlert('danger', 'Export fehlgeschlagen', data[`Error`]);
          this.error = 'Could not export form (error)';
        }

        // Store form
        if (data && data[`Form`]) {
          const pom = document.createElement('a');
          const encodedURIComponent = encodeURIComponent(JSON.stringify(data[`Form`][`data`]));
          pom.setAttribute('href', 'data:application/octet-stream;charset=utf-8,' + encodedURIComponent);
          pom.setAttribute('download', 'formular.json');
          pom.click();
        }
      },
      // Failed to load
      (error: Error) => {
        this.alerts.NewAlert('danger', 'Export fehlgeschlagen', error[`statusText`]);
        this.error = error[`statusText`];
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
      const file = event.target[`files`][0];
      const reader = new FileReader();

      // Upload success
      reader.onload = () => {
        this.processPutRequest(reader.result);
      };

      // FileReader is async -> call readAsText() after declaring the onload handler
      reader.readAsText(file);
    };
    input.click();
  }

  /**
   * Handling of the HTTP PUT request for importing a form
   * @param body The body of the HTTP PUT request
   */
  public processPutRequest(body) {
    // Input validation
    if (!body || !DashboardComponent.isValidJsonString(body)) {
      this.alerts.NewAlert('danger', 'Import fehlgeschlagen', 'Ungültige JSON-Datei');
      this.error = 'Invalid JSON file';
      return;
    }

    this.httpClient.put(environment.fragebogen_api + 'forms/', body).subscribe((data) => {
        // Check for error
        if (!data) {
          this.alerts.NewAlert('danger', 'Import fehlgeschlagen', 'Keine Daten erhalten');
          this.error = 'Could not import form (no data)';
        } else if (data[`Error`]) {
          this.alerts.NewAlert('danger', 'Import fehlgeschlagen', data[`Error`]);
          this.error = 'Could not import form (error)';
        }

        // Reload
        this.ngOnInit();
      },
      // Failed to upload
      (error: Error) => {
        this.alerts.NewAlert('danger', 'Import fehlgeschlagen', error[`statusText`]);
        this.error = error[`statusText`];
      });
  }
}
