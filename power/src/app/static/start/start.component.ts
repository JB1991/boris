import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { Config, ConfigService } from '@app/config.service';

@Component({
    selector: 'power-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
    public config: Config;
    public cardorder = {};
    public form: any = {};

    constructor(public title: Title,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        public configService: ConfigService) {
        this.title.setTitle($localize`Immobilienmarkt.NI`);
        // check if logged out
        /* istanbul ignore next */
        this.route.queryParams.subscribe(params => {
            if (params['logout']) {
                this.alerts.NewAlert('success', $localize`Logout erfolgreich`,
                    $localize`Sie wurden erfolgreich ausgeloggt.`);
            }
        });
    }

    ngOnInit() {
        this.config = this.configService.config;
    }

    /**
     * Redirects to formular fillout dialogue
     * @param pin Formular pin
     */
    public submitPIN(pin: string) {
        if (!pin) {
            this.alerts.NewAlert('danger', $localize`Bitte Pin eingeben`, '');
            return;
        }
        this.router.navigate(['/forms', 'fillout', encodeURIComponent(pin)], { replaceUrl: true });
    }

    /**
     * Returns true for every second module
     * @param module Module name
     */
    public getCardOrder(module: string): boolean {
        if (typeof this.cardorder[module] !== 'undefined') {
            return this.cardorder[module];
        }
        this.cardorder[module] = Object.keys(this.cardorder).length % 2 === 1;
    }

    /**
     * Scrolls to element
     * @param id Element id
     */
    public scrollToElement(id: string) {
        document.getElementById(id).scrollIntoView();
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
