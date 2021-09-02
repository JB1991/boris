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
        this.seo.setAllowRobots(false);
        this.seo.updateTag({ name: 'description', content: $localize`Das Immobilienmarkt Portal Niedersachsen stellt gebührenfrei die Bodenrichtwerte, Grundstücksmarktdaten und den Immobilienpreisindex für Niedersachsen bereit.` });
        this.seo.updateTag({ name: 'keywords', content: $localize`Immobilienmarkt, Niedersachsen, Wertermittlung, Bodenrichtwertinformationssystem, Bodenrichtwert, BORIS.NI, BORIS, Bauland, Landwirtschaft, Grundstücksmarktbericht, Landesgrundstücksmarktbericht, Landesgrundstücksmarktdaten, Immobilienpreisindex, NIPIX, Immobilien-Preis-Kalkulator, IPK, OGC, Geodienste, Geodatendienste` });
    }

    /** @inheritdoc */
    public ngOnDestroy(): void {
        // reset robots
        this.seo.setAllowRobots(true);
    }
}
