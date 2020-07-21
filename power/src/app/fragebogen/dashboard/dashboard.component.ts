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

  constructor(public titleService: Title,
              public router: Router,
              public alerts: AlertsService,
              public loadingscreen: LoadingscreenService,
              public storage: StorageService) {
    this.titleService.setTitle('Dashboard - POWER.NI');
    this.storage.resetService();
  }

  ngOnInit(): void {
    // Load forms from server
    this.loadingscreen.setVisible(true);
    this.storage.loadFormsList().subscribe((data) => {
      // check for error
      if (!data || data['error'] || !data['data']) {
        const alertText = (data && data['error'] ? data['error'] : 'Forms');
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', alertText);

        this.loadingscreen.setVisible(false);
        this.router.navigate(['/forms'], { replaceUrl: true });
        console.log('Could not load forms: ' + alertText);
        return;
      }

      // Save data
      this.storage.formsList = data['data'];

      // Load tags from server
      this.storage.loadTags().subscribe((data2) => {
        // check for error
        if (!data2 || data2['error'] || !data2['data']) {
          const alertText = (data2 && data2['error'] ? data2['error'] : 'Tags');
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', alertText);

          this.loadingscreen.setVisible(false);
          this.router.navigate(['/forms'], { replaceUrl: true });
          console.log('Could not load tags: ' + alertText);
          return;
        }

        // Save data
        this.storage.tagList = data2['data'];
        this.loadingscreen.setVisible(false);
      }, (error2: Error) => {
        // failed to load tags
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error2['statusText']);
        this.loadingscreen.setVisible(false);

        this.router.navigate(['/forms'], { replaceUrl: true });
        console.log(error2);
        return;
      });
    }, (error: Error) => {
      // failed to load forms
      this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
      this.loadingscreen.setVisible(false);

      this.router.navigate(['/forms'], { replaceUrl: true });
      console.log(error);
      return;
    });
  }

  /**
   * Deletes an existing form
   * @param id Number of form
   */
  public deleteForm(id: number) {
    // check data
    if (id < 0 || id >= this.storage.formsList.length) {
      throw new Error('Invalid id');
    }
    // Ask user to confirm deletion
    if (!confirm('Möchten Sie dieses Formular wirklich löschen?')) {
      return;
    }

    // Delete form
    this.storage.deleteForm(this.storage.formsList[id].id).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        const alertText = (data && data['error'] ? data['error'] : this.storage.formsList[id].id);
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', alertText);

        console.log('Could not delete form: ' + alertText);
        return;
      }

      // Success
      this.storage.formsList.splice(id, 1);
      this.alerts.NewAlert('success', 'Formular gelöscht', 'Das Formular wurde erfolgreich gelöscht.');
    }, (error: Error) => {
      // failed to delete form
      this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', error['statusText']);
      console.log(error);
      return;
    });
  }
}
