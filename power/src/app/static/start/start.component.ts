import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { environment } from '@env/environment';

@Component({
    selector: 'power-start',
    templateUrl: './start.component.html',
    styleUrls: ['./start.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StartComponent {
    public config = environment.config;
    public cardorder = {};
    public pin: string;

    constructor(
        public titleService: Title,
        public meta: Meta,
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService
    ) {
        this.titleService.setTitle($localize`Immobilienmarkt.NI`);
        this.meta.updateTag({ name: 'description', content: $localize`Gebührenfreier Zugriff auf Bodenrichtwerte und Grundstücksmarktdaten von Niedersachsen` });
        this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwerte, BORIS, Grundstücksmarktberichte, Landesgrundstücksmarktberichte, Landesgrund­stücks­markt­daten, Immobilienpreisindex, NIPIX, Immobilien-Preis-Kalkulator, IPK` });

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
    public submitPIN(pin: string) {
        if (!pin) {
            this.alerts.NewAlert('danger', $localize`Eingabe ungültig`, $localize`Bitte geben Sie eine PIN ein.`);
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
