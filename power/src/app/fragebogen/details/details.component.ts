import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';
import { StorageService } from './storage.service';

@Component({
  selector: 'power-formulars-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  constructor(private titleService: Title,
              private router: Router,
              private route: ActivatedRoute,
              private alerts: AlertsService,
              private loadingscreen: LoadingscreenService,
              public storage: StorageService) {
    this.titleService.setTitle('Formular Details - POWER.NI');
    this.storage.resetService();
  }

  ngOnInit() {
    // load data from server
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadingscreen.setVisible(true);

      // load form form server
      this.storage.loadForm(id).subscribe((data) => {
        // check for error
        if (!data || data['error'] || !data['data']) {
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (data['error'] ? data['error'] : id));
          this.loadingscreen.setVisible(false);

          this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
          throw new Error('Could not load form: ' + (data['error'] ? data['error'] : id));
        }

        // save data
        this.storage.form = data['data'];
        console.log(this.storage.form);

        // load tasks from server
        this.storage.loadTasks(id).subscribe((data2) => {
          // check for error
          if (!data2 || data2['error'] || !data2['data']) {
            this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (data2['error'] ? data2['error'] : id));
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
            throw new Error('Could not load task: ' + (data2['error'] ? data2['error'] : id));
          }

          // save data
          this.storage.tasksList = data2['data'];
          console.log(this.storage.tasksList);
          this.loadingscreen.setVisible(false);
        }, (error2: Error) => {
          // failed to load forms list
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error2['statusText']);
          this.loadingscreen.setVisible(false);

          this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
          throw error2;
        });
      }, (error: Error) => {
          // failed to load forms list
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
          this.loadingscreen.setVisible(false);

          this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
          throw error;
      });
    } else {
      // missing id
      this.loadingscreen.setVisible(false);
      this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
    }
  }

  /**
   * Deletes an existing task
   * @param i Number of task
   */
  public deleteTask(i: number) {
    // Ask user to confirm deletion
    if (!confirm('Möchten Sie diese Antwort wirklich löschen?')) {
      return;
    }

    // delete task
    this.storage.deleteTask(this.storage.tasksList[i].id).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', (data['error'] ? data['error'] : this.storage.tasksList[i].id));
        throw new Error('Could not delete form: ' + (data['error'] ? data['error'] : this.storage.tasksList[i].id));
      }

      // success
      this.storage.tasksList.splice(i, 1);
      this.alerts.NewAlert('success', 'Antwort gelöscht', 'Die Antwort wurde erfolgreich gelöscht.');
    }, (error: Error) => {
        // failed to delete task
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', error['statusText']);
        throw error;
    });
  }

  /**
   * Deletes form
   */
  public deleteForm() {
    // Ask user to confirm deletion
    if (!confirm('Möchten Sie dieses Formular wirklich löschen?')) {
      return;
    }

    // delete form
    this.storage.deleteForm(this.storage.form.id).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', (data['error'] ? data['error'] : this.storage.form.id));
        throw new Error('Could not delete form: ' + (data['error'] ? data['error'] : this.storage.form.id));
      }

      // success
      this.alerts.NewAlert('success', 'Formular gelöscht', 'Das Formular wurde erfolgreich gelöscht.');
      this.router.navigate(['/forms/dashboard'], { replaceUrl: true });
    }, (error: Error) => {
        // failed to delete form
        this.alerts.NewAlert('danger', 'Löschen fehlgeschlagen', error['statusText']);
        throw error;
    });
  }
}
