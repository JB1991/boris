import { Component, OnDestroy } from '@angular/core';
import { SEOService } from '@app/shared/seo/seo.service';

@Component({
    selector: 'power-notfound',
    templateUrl: './notfound.component.html',
    styleUrls: ['./notfound.component.scss']
})
export class NotfoundComponent implements OnDestroy {

    constructor(
        private seo: SEOService
    ) {
        this.seo.setTitle($localize`Seite nicht gefunden - Immobilienmarkt.NI`);
        this.seo.updateTag({ name: 'robots', content: 'noindex,follow' });
        this.seo.updateTag({ name: 'description', content: $localize`Gebührenfreier Zugriff auf Bodenrichtwerte und Grundstücksmarktdaten von Niedersachsen` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwerte, BORIS, Grundstücksmarktberichte, Landesgrundstücksmarktberichte, Landesgrund­stücks­markt­daten, Immobilienpreisindex, NIPIX, Immobilien-Preis-Kalkulator, IPK` });
    }

    ngOnDestroy(): void {
        // reset robots
        this.seo.updateTag({ name: 'robots', content: 'index,follow' });
    }
}
