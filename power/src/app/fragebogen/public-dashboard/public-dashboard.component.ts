import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { StorageService } from './storage.service';
import { AlertsService } from '@app/shared/alerts/alerts.service';
import { LoadingscreenService } from '@app/shared/loadingscreen/loadingscreen.service';

@Component({
  selector: 'power-public-dashboard',
  templateUrl: './public-dashboard.component.html',
  styleUrls: ['./public-dashboard.component.scss']
})
export class PublicDashboardComponent implements OnInit {

  constructor(public titleService: Title,
    public router: Router,
    public alerts: AlertsService,
    public loadingscreen: LoadingscreenService,
    public storage: StorageService) {
    this.titleService.setTitle($localize`Öffentliche Formulare - POWER.NI`);
    this.storage.resetService();
  }

ngOnInit() {
    // load forms from server
    this.loadingscreen.setVisible(true);
    this.storage.loadFormsList().subscribe((data) => {
      console.log(data)
        // check for error
        if (!data || data['error'] || !data['data']) {
            const alertText = (data && data['error'] ? data['error'] : 'Forms');
            this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, alertText);

            this.loadingscreen.setVisible(false);
            this.router.navigate(['/forms'], { replaceUrl: true });
            console.log('Could not load forms: ' + alertText);
            return;
        }

        // save data
        this.storage.formsList = data['data'];
        this.loadingscreen.setVisible(false);
    }, (error: Error) => {
        // failed to load forms
        this.alerts.NewAlert('danger', $localize`Laden fehlgeschlagen`, error['statusText']);
        this.loadingscreen.setVisible(false);

        this.router.navigate(['/forms'], { replaceUrl: true });
        console.log(error);
        return;
    });
}

}
