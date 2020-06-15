import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-forms-dashboard',
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
    this.loadingscreen.setVisible(true);
    this.storage.loadForms().subscribe((data) => {
      // check for error
      if (!data || data['error'] || !data['data']) {
        const alertText = (data['error'] ? data['error'] : '');
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', alertText);
        this.loadingscreen.setVisible(false);
        this.router.navigate(['/forms'], {replaceUrl: true});
        throw new Error('Could not load forms list: ' + alertText);
      }

      // Save data
      this.storage.formsList = data['data'];

      // loads tags from server
      this.storage.loadTags().subscribe((data2) => {
        // check for error
        if (!data2 || data2['error'] || !data2['data']) {
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (data2['error'] ? data2['error'] : ''));
          this.loadingscreen.setVisible(false);

          this.router.navigate(['/forms'], { replaceUrl: true });
          throw new Error('Could not load tags list: ' + (data2['error'] ? data2['error'] : ''));
        }

        // save data
        this.storage.tagList = data2['data'];
        this.loadingscreen.setVisible(false);
      }, (error2: Error) => {
          // failed to load tags list
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error2['statusText']);
          this.loadingscreen.setVisible(false);

          this.router.navigate(['/forms'], { replaceUrl: true });
          throw error2;
      });
    }, (error: Error) => {
      // Failed to load forms list
      this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
      this.loadingscreen.setVisible(false);
      this.router.navigate(['/forms'], {replaceUrl: true});
      throw error;
    });
  }

  /**
   * Deletes an existing form
   * @param id Number of form
   */
  public deleteForm(id: number) {
    // Ask user to confirm deletion
    if (!confirm('Möchten Sie dieses Formular wirklich löschen?')) {
      return;
    }

    // Delete form
    this.storage.deleteForm(this.storage.formsList[id].id).subscribe((data) => {
      // Check for error
      if (!data || data['error']) {
        const alertText = (data['error'] ? data['error'] : this.storage.formsList[id].id);
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', alertText);
        throw new Error('Could not delete form: ' + alertText);
      }

      // Success
      this.storage.formsList.splice(id, 1);
      this.alerts.NewAlert('success', 'Formular gelöscht', 'Das Formular wurde erfolgreich gelöscht.');
    }, (error: Error) => {
      // Failed to delete form
      this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', error['statusText']);
      throw error;
    });
  }

  /**
   * Exports form to JON
   * @param id form id
   */
  public exportForm(id: number) {
    // Load form
    this.storage.loadForm(this.storage.formsList[id].id).subscribe((data) => {
      // Check for error
      if (!data || data['error'] || !data['data'] || !data['data']['content']) {
        const alertText = (data['error'] ? data['error'] : this.storage.formsList[id].id);
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', alertText);
        throw new Error('Could not load form: ' + alertText);
      }

      // Download JSON
      const pom = document.createElement('a');
      const encodedURIComponent = encodeURIComponent(JSON.stringify(data['data']['content']));
      const href = 'data:application/octet-stream;charset=utf-8,' + encodedURIComponent;
      pom.setAttribute('href', href);
      pom.setAttribute('download', 'formular.json');
      pom.click();
    }, (error: Error) => {
      // Failed to load form
      this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
      throw error;
    });
  }

  /**
   * Imports form from JSON
   */
  public importForm() {
    const input = DashboardComponent.createInputElement();
    DashboardComponent.addInputElementToDOM(input);

    // File selected
    input.onchange = (event: Event) => {
      const file = event.target['files'][0];
      const reader = new FileReader();

      // Upload success
      reader.onload = () => {
        this.storage.createForm(reader.result).subscribe((data) => {
          // Check for error
          if (!data || data['error'] || !data['data']) {
            const alertText = (data['error'] ? data['error'] : '');
            this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', alertText);
            throw new Error('Could not load form: ' + alertText);
          }
          // Success
          this.storage.formsList.push(data['data']);
          this.alerts.NewAlert('success', 'Erfolgreich erstellt', 'Das Formular wurde erfolgreich hochgeladen.');
        }, (error: Error) => {
          // Failed to create form
          this.alerts.NewAlert('danger', 'Erstellen fehlgeschlagen', error['statusText']);
          throw error;
        });
      };
      // FileReader is async -> call readAsText() after declaring the onload handler
      reader.readAsText(file);
    };
    input.click();
  }

  /**
   * Create and return an input element for uploading files
   */
  private static createInputElement() {
    const input = document.createElement('input');
    input.id = 'file-upload';
    input.type = 'file';
    input.accept = 'application/JSON';
    input.hidden = true;
    return input;
  }

  /**
   * Add the input element to the DOM so that it can be accessed from the tests
   * @param input Input element
   */
  private static addInputElementToDOM(input: HTMLInputElement) {
    const importButton = document.getElementById('button-import');
    importButton.parentNode.insertBefore(input, importButton);
  }
}
