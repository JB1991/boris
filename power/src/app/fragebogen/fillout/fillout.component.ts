import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { AlertsService } from '../alerts/alerts.service';
import { LoadingscreenService } from '../loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-formulars-fillout',
  templateUrl: './fillout.component.html',
  styleUrls: ['./fillout.component.css']
})
export class FilloutComponent implements OnInit {

  constructor(private titleService: Title,
              private router: Router,
              private route: ActivatedRoute,
              private alerts: AlertsService,
              private loadingscreen: LoadingscreenService,
              public storage: StorageService) {
    this.titleService.setTitle('LGLN - POWER.NI');
    this.storage.resetService();
    this.alerts.resetService();
  }

  ngOnInit() {
    // load data from server
    const pin = this.route.snapshot.paramMap.get('pin');
    if (pin) {
      this.loadingscreen.setVisible(true);

      // load task by pin
      this.storage.loadTask(pin).subscribe((data) => {
        // check for error
        if (!data || data['error']) {
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (data['error'] ? data['error'] : pin));
          this.loadingscreen.setVisible(false);

          this.router.navigate(['/forms'], { replaceUrl: true });
          throw new Error('Could not load task: ' + (data['error'] ? data['error'] : pin));
        }

        // store task
        this.storage.task = data['data'];

        // load form by id
        this.storage.loadForm(this.storage.task.form).subscribe((data2) => {
          // check for error
          if (!data2 || data2['error']) {
            this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', (data2['error'] ? data2['error'] : this.storage.task.form));
            this.loadingscreen.setVisible(false);

            this.router.navigate(['/forms'], { replaceUrl: true });
            throw new Error('Could not load form: ' + (data2['error'] ? data2['error'] : this.storage.task.form));
          }

          // store form
          this.storage.form = data2['data'];
          if (this.storage.task.content) {
            this.storage.form.content.data = this.storage.task.content;
          }

          // display form
          this.loadingscreen.setVisible(false);
        }, (error2: Error) => {
          // failed to load form
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error2['statusText']);
          this.loadingscreen.setVisible(false);

          this.router.navigate(['/forms'], { replaceUrl: true });
          throw error2;
        });
      }, (error: Error) => {
        // failed to load task
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
        this.loadingscreen.setVisible(false);

        this.router.navigate(['/forms'], { replaceUrl: true });
        throw error;
      });
    } else {
        // missing pin
        this.loadingscreen.setVisible(false);
        this.router.navigate(['/forms'], { replaceUrl: true });
    }
  }

  @HostListener('window:beforeunload')
  canDeactivate(): Observable<boolean> | boolean {
    // on test environment skip
    if (!environment.production) {
      return true;
    }
    return !this.storage.getUnsavedChanges();
  }

  /**
   * Submits form after completing it
   * @param data Data
   */
  public submit(data: any) {
    if (!data) return;
    this.storage.completeForm(this.storage.task.pin, data).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', (data['error'] ? data['error'] : this.storage.task.pin));
        throw new Error('Could not complete task: ' + (data['error'] ? data['error'] : this.storage.task.pin));
      }
      this.storage.setUnsavedChanges(false);
    }, (error) => {
        // failed to complete task
        this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', error['statusText']);
        throw error;
    });
  }

  /**
   * Receives form data to save it
   * @param data Data
   */
  public progress(data: any) {
    if (!data) return;
    this.storage.saveInterimResults(this.storage.task.id, data).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', (data['error'] ? data['error'] : this.storage.task.id));
        throw new Error('Could not save task: ' + (data['error'] ? data['error'] : this.storage.task.id));
      }
      this.storage.setUnsavedChanges(false);
    }, (error) => {
        // failed to save task
        this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', error['statusText']);
        throw error;
    });
  }

  /**
   * Receives change events
   * @param data Data
   */
  public changed(data: any) {
    this.storage.setUnsavedChanges(true);
  }
}
