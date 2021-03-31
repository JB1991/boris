import { Component, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'power-notfound',
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnDestroy {

    constructor(
        public titleService: Title,
        public meta: Meta,
    ) {
        this.titleService.setTitle($localize`Seite nicht gefunden - Immobilienmarkt.NI`);
        this.meta.updateTag({ name: 'robots', content: 'noindex,follow' });
        this.meta.updateTag({ name: 'description', content: $localize`Kostenloser Zugriff auf Bodenrichtwerte und Grundstücksmarktdaten von Niedersachsen` });
        this.meta.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwerte, BORIS.NI, Grundstücksmarktberichte, Landesgrundstücksmarktberichte, Landesgrund­stücks­markt­daten, Immobilienpreisindex, NIPIX, Immobilien-Preis-Kalkulator, IPK` });
    }

    ngOnDestroy(): void {
        // reset robots
        this.meta.updateTag({ name: 'robots', content: 'index,follow' });
    }
}
