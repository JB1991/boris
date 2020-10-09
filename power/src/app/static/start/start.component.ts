import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertsService } from '@app/shared/alerts/alerts.service';

@Component({
    selector: 'power-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss']
})
export class StartComponent {

    constructor(public title: Title,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService) {
        this.title.setTitle($localize`Portal für Wertermittlung Niedersachsen`);

        // check if logged out
        /* istanbul ignore next */
        this.route.queryParams.subscribe(params => {
            if (params['logout']) {
                this.alerts.NewAlert('success', $localize`Logout erfolgreich`,
                    $localize`Sie wurden erfolgreich ausgeloggt.`);
            }
        });
    }

    /**
     * Redirects to formular fillout dialogue
     * @param pin Formular pin
     */
    submitPIN(pin: string) {
        if (!pin) {
            throw new Error('pin is required');
        }
        this.router.navigate(['/forms', 'fillout', encodeURIComponent(pin)], { replaceUrl: true });
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
