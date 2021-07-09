import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AlertsService } from '@app/shared/alerts/alerts.service';
import { SEOService } from '@app/shared/seo/seo.service';
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
        public router: Router,
        public route: ActivatedRoute,
        public alerts: AlertsService,
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'description', content: $localize`Das Immobilienmarkt Portal Niedersachsen stellt gebührenfrei die Bodenrichtwerte, Grundstücksmarktdaten und den Immobilienpreisindex für Niedersachsen bereit.` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwertinformationssystem, Bodenrichtwert, BORIS.NI, BORIS, Bauland, Landwirtschaft, Grundstücksmarktbericht, Landesgrundstücksmarktbericht, Landesgrundstücksmarktdaten, Immobilienpreisindex, NIPIX, Immobilien-Preis-Kalkulator, IPK, OGC, Geodienste, Geodatendienste` });

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
    public submitPIN(pin: string): void {
        if (!pin) {
            this.alerts.NewAlert('danger', $localize`Eingabe ungültig`, $localize`Bitte geben Sie eine PIN ein.`);
            return;
        }
        this.router.navigate(['/forms', 'fillout', encodeURIComponent(pin)], { replaceUrl: true });
    }

    /**
     * Returns true for every second module
     * @param module Module name
     * @returns True if card should be left
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
    public scrollToElement(id: string): void {
        document.getElementById(id).scrollIntoView();
    }
}
/* vim: set expandtab ts=4 sw=4 sts=4: */
