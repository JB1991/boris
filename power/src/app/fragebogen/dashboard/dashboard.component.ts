import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-formulars-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private titleService: Title,
              private router: Router,
              private alerts: AlertsService,
              private loadingscreen: LoadingscreenService,
              public storage: StorageService) {
    this.titleService.setTitle('Dashboard - POWER.NI');
    this.storage.resetService();
  }

  ngOnInit(): void {
    // load forms from server
    this.storage.loadForms().subscribe((data) => {
      // check for error
      if (!data || data['error'] || !data['data']) {
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (data['error'] ? data['error'] : ''));
        this.loadingscreen.setVisible(false);

        this.router.navigate(['/forms'], { replaceUrl: true });
        throw new Error('Could not load forms list: ' + (data['error'] ? data['error'] : ''));
      }

      // save data
      this.storage.formsList = data['data'];
    }, (error: Error) => {
        // failed to load forms list
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
        this.loadingscreen.setVisible(false);

        this.router.navigate(['/forms'], { replaceUrl: true });
        throw error;
    });
  }

  /**
   * Deletes an existing form
   * @param i Number of form
   */
  public deleteForm(i: number) {
    // Ask user to confirm deletion
    if (!confirm('Möchten Sie dieses Formular wirklich löschen?')) {
      return;
    }

    // delete form
    this.storage.deleteForm(this.storage.formsList[i].id).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', (data['error'] ? data['error'] : this.storage.formsList[i].id));
        throw new Error('Could not delete form: ' + (data['error'] ? data['error'] : this.storage.formsList[i].id));
      }

      // success
      this.storage.formsList.splice(i, 1);
      this.alerts.NewAlert('success', 'Formular gelöscht', 'Das Formular wurde erfolgreich gelöscht.');
    }, (error: Error) => {
        // failed to delete form
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', error['statusText']);
        throw error;
    });
  }

  /**
   * Exports form to json
   * @param id form id
   */
  public exportForm(i: number) {
    // load form
    this.storage.loadForm(this.storage.formsList[i].id).subscribe((data) => {
      // check for error
      if (!data || data['error'] || !data['data'] || !data['data']['content']) {
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (data['error'] ? data['error'] : this.storage.formsList[i].id));
        throw new Error('Could not load form: ' + (data['error'] ? data['error'] : this.storage.formsList[i].id));
      }

      // download json
      const pom = document.createElement('a');
      const encodedURIComponent = encodeURIComponent(JSON.stringify(data['data']['content']));
      const href = 'data:application/octet-stream;charset=utf-8,' + encodedURIComponent;
      pom.setAttribute('href', href);
      pom.setAttribute('download', 'formular.json');
      pom.click();
    }, (error: Error) => {
        // failed to load form
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
        throw error;
    });
  }

  /**
   * Imports form from JSON
   */
  public importForm() {
    // create input
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
        this.storage.createForm(reader.result).subscribe((data) => {
          // check for error
          if (!data || data['error'] || !data['data']) {
            this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', (data['error'] ? data['error'] : ''));
            throw new Error('Could not load form: ' + (data['error'] ? data['error'] : ''));
          }

          // success
          this.storage.formsList.push(data['data']);
          this.alerts.NewAlert('success', 'Erfolgreich erstellt', 'Das Formular wurde erfolgreich hochgeladen.');
        }, (error: Error) => {
            // failed to create form
            this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', error['statusText']);
            throw error;
        });
      };

      // FileReader is async -> call readAsText() after declaring the onload handler
      reader.readAsText(file);
    };
    input.click();
  }
}
