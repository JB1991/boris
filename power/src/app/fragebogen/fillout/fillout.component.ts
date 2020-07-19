import { Component, OnInit, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-formulars-fillout',
  templateUrl: './fillout.component.html',
  styleUrls: ['./fillout.component.css']
})
export class FilloutComponent implements OnInit {

  constructor(public titleService: Title,
              public router: Router,
              public route: ActivatedRoute,
              public alerts: AlertsService,
              public loadingscreen: LoadingscreenService,
              public storage: StorageService) {
    this.titleService.setTitle('Formulare - POWER.NI');
    this.storage.resetService();
  }

  ngOnInit() {
    // get pin
    const pin = this.route.snapshot.paramMap.get('pin');
    if (pin) {
      // load data
      this.loadData(pin);
    } else {
      // missing pin
      this.router.navigate(['/forms'], { replaceUrl: true });
    }
  }

  @HostListener('window:beforeunload') canDeactivate(): Observable<boolean> | boolean {
    // on test environment skip
    if (!environment.production) {
      return true;
    }
    return !this.storage.getUnsavedChanges();
  }

  /**
   * Load form data
   * @param pin Task pin
   * @param factor Task factor
   */
  public loadData(pin: string, factor: string = null) {
    // check data
    if (!pin) {
      throw new Error('pin is required');
    }

    // get access by pin
    this.loadingscreen.setVisible(true);
    this.storage.getAccess(pin, factor).subscribe((data) => {
      // check for error
      if (!data || data['error'] || !data['data']) {
        const alertText = (data && data['error'] ? data['error'] : pin + ' - ' + factor);
        this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', alertText);

        this.loadingscreen.setVisible(false);
        this.router.navigate(['/forms'], {replaceUrl: true});
        console.log('Could not load access: ' + alertText);
        return;
      }

      // store task data
      this.storage.task = data['data'];

      // load form by id
      this.storage.loadForm(this.storage.task['form-id']).subscribe((data2) => {
        // check for error
        if (!data2 || data2['error'] || !data2['data']) {
          const alertText = (data2 && data2['error'] ? data2['error'] : this.storage.task['form-id']);
          this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', alertText);

          this.loadingscreen.setVisible(false);
          this.router.navigate(['/forms'], {replaceUrl: true});
          console.log('Could not load form: ' + alertText);
          return;
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
        console.log(error2);
        return;
      });
    }, (error: Error) => {
      // failed to load task
      this.alerts.NewAlert('danger', 'Laden fehlgeschlagen', error['statusText']);
      this.loadingscreen.setVisible(false);

      this.router.navigate(['/forms'], { replaceUrl: true });
      console.log(error);
      return;
    });
  }

  /**
   * Submits form after completing it
   * @param result Data
   */
  public submit(result: any) {
    // check data
    if (!result) {
      throw new Error('no data provided');
    }

    // complete
    this.storage.saveResults(this.storage.task.id, result, true).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        const alertText = (data && data['error'] ? data['error'] : this.storage.task.pin);
        this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', alertText);

        console.log('Could not submit results: ' + alertText);
        return;
      }
      this.storage.setUnsavedChanges(false);
      this.alerts.NewAlert('success', 'Speichern erfolgreich', 'Ihre Daten wurden erfolgreich gespeichert.');
    }, (error: Error) => {
        // failed to complete task
        this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', error['statusText']);
        console.log(error);
        return;
    });
  }

  /**
   * Receives form data to save it
   * @param result Data
   */
  public progress(result: any) {
    // check data
    if (!result) {
      throw new Error('no data provided');
    }

    // interim results
    this.storage.saveResults(this.storage.task.id, result).subscribe((data) => {
      // check for error
      if (!data || data['error']) {
        const alertText = (data && data['error'] ? data['error'] : this.storage.task.pin);
        this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', alertText);

        console.log('Could not save results: ' + alertText);
        return;
      }
      this.storage.setUnsavedChanges(false);
    }, (error: Error) => {
        // failed to save task
        this.alerts.NewAlert('danger', 'Speichern fehlgeschlagen', error['statusText']);
        console.log(error);
        return;
    });
  }

  /**
   * Receives change events
   * @param result Data
   */
  public changed(result: any) {
    this.storage.setUnsavedChanges(true);
  }
}
